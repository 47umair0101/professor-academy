const { createClient } = require('../apps/web/node_modules/@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', 'apps', 'web', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    env[match[1]] = value;
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function testClient() {
  console.log('Testing Supabase Anon Client (Browser simulation)...');

  // 1. Select courses
  const { data: courses, error: courseErr } = await supabase.from('courses').select('id, title').limit(2);
  if (courseErr) throw new Error('Course select error: ' + courseErr.message);
  console.log('✓ Course select OK:', courses.length, 'courses found');

  // 2. Insert test enrollment
  const testTid = 'TEST-' + Date.now();
  const studentId = '33333333-3333-3333-3333-333333333333';
  const courseId = '10000000-0000-0000-0000-000000000002'; // MDCAT Chemistry

  console.log('Attempting enrollment insert with anon key...');
  const { data: inserted, error: insertErr } = await supabase
    .from('enrollments')
    .upsert({
      student_id: studentId,
      course_id: courseId,
      status: 'PENDING_VERIFICATION',
      payment_method: 'EASYPAISA',
      transaction_id: testTid,
      amount_paid_pkr: 4000,
      teacher_share_pkr: 3200,
      platform_share_pkr: 800,
      receipt_url: 'https://example.com/receipt.jpg',
    }, { onConflict: 'student_id,course_id' })
    .select('id, student_id, course_id, status, transaction_id')
    .single();

  if (insertErr) {
    throw new Error('Enrollment insert FAILED: ' + insertErr.message);
  }
  console.log('✓ Enrollment insert/upsert SUCCESS with Anon Key! Row:', inserted);

  // 3. Select enrollment
  const { data: fetched, error: fetchErr } = await supabase
    .from('enrollments')
    .select('id, status, transaction_id, course:courses(title)')
    .eq('id', inserted.id)
    .single();

  if (fetchErr) throw new Error('Enrollment fetch FAILED: ' + fetchErr.message);
  console.log('✓ Enrollment fetch SUCCESS with join:', fetched);

  // 4. Update enrollment (Admin approval simulation)
  const { data: updated, error: updateErr } = await supabase
    .from('enrollments')
    .update({ status: 'ACTIVE', admin_notes: 'Approved via test client' })
    .eq('id', inserted.id)
    .select('id, status')
    .single();

  if (updateErr) throw new Error('Enrollment update FAILED: ' + updateErr.message);
  console.log('✓ Enrollment update SUCCESS with Anon Key:', updated);

  console.log('\n🎉 ALL CLIENT OPERATIONS SUCCEEDED WITHOUT RLS ERRORS!');
}

testClient().catch(err => {
  console.error('Test client failed:', err.message);
  process.exit(1);
});
