const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', 'apps', 'web', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

const connectionString = process.env.DATABASE_URL;

async function checkAndApply() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  console.log('Connected to PostgreSQL...');

  // Check current policies
  const currentPolicies = await client.query(`
    SELECT policyname, cmd 
    FROM pg_policies 
    WHERE tablename = 'enrollments';
  `);
  console.log('Current Enrollment Policies:', currentPolicies.rows);

  // Add Admin and Teacher policies if not present
  console.log('Applying Admin and Teacher policies for enrollments...');
  await client.query(`
    -- Allow Admins full access (SELECT, UPDATE, DELETE) to enrollments
    DROP POLICY IF EXISTS "Admins can view and manage all enrollments" ON public.enrollments;
    CREATE POLICY "Admins can view and manage all enrollments" ON public.enrollments
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role = 'ADMIN'
        )
      );

    -- Allow Teachers to view enrollments for their own courses
    DROP POLICY IF EXISTS "Teachers can view enrollments for their courses" ON public.enrollments;
    CREATE POLICY "Teachers can view enrollments for their courses" ON public.enrollments
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.courses 
          WHERE id = enrollments.course_id AND teacher_id = auth.uid()
        )
      );

    -- Allow Students to update their own pending enrollments (e.g. re-upload receipt if rejected/pending)
    DROP POLICY IF EXISTS "Students can update own pending enrollments" ON public.enrollments;
    CREATE POLICY "Students can update own pending enrollments" ON public.enrollments
      FOR UPDATE USING (
        auth.uid() = student_id AND status = 'PENDING_VERIFICATION'
      );
  `);

  const updatedPolicies = await client.query(`
    SELECT policyname, cmd 
    FROM pg_policies 
    WHERE tablename = 'enrollments';
  `);
  console.log('Updated Enrollment Policies:', updatedPolicies.rows);

  // Also check if public.notifications has RLS policies
  console.log('Checking notifications policies...');
  await client.query(`
    DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
    CREATE POLICY "Users can view their own notifications" ON public.notifications
      FOR SELECT USING (auth.uid() = recipient_id);

    DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
    CREATE POLICY "Users can update their own notifications" ON public.notifications
      FOR UPDATE USING (auth.uid() = recipient_id);

    DROP POLICY IF EXISTS "System and admins can insert notifications" ON public.notifications;
    CREATE POLICY "System and admins can insert notifications" ON public.notifications
      FOR INSERT WITH CHECK (true);
  `);

  await client.end();
  console.log('✓ Successfully updated database policies for Module 6!');
}

checkAndApply().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
