const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', 'apps', 'web', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
});

const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const tables = [
  'profiles',
  'courses',
  'course_sections',
  'lessons',
  'enrollments',
  'lesson_progress',
  'lesson_comments',
  'past_papers',
  'quizzes',
  'quiz_questions',
  'quiz_attempts',
  'quiz_attempt_answers',
  'certificates',
  'platform_settings',
  'notifications',
];

async function apply() {
  await client.connect();
  console.log('Connected to PostgreSQL...');

  for (const table of tables) {
    console.log(`Configuring table: ${table}...`);
    // 1. Drop existing policies on this table
    const existing = await client.query(`
      SELECT policyname FROM pg_policies WHERE tablename = $1;
    `, [table]);

    for (const row of existing.rows) {
      await client.query(`DROP POLICY IF EXISTS "${row.policyname}" ON public.${table};`);
      console.log(`  - Dropped policy: ${row.policyname}`);
    }

    // 2. Either disable RLS or add permissive policy
    // Adding permissive policy FOR ALL USING (true) WITH CHECK (true)
    await client.query(`
      ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;
      CREATE POLICY "Allow all operations" ON public.${table}
        FOR ALL
        USING (true)
        WITH CHECK (true);
    `);
    console.log(`  ✓ Created permissive policy "Allow all operations" on ${table}`);
  }

  await client.end();
  console.log('\n✓ All tables successfully updated with permissive policies!');
}

apply().catch(err => {
  console.error('Error applying policies:', err);
  process.exit(1);
});
