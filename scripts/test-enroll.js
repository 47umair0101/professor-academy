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

async function testInsert() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const studentId = '33333333-3333-3333-3333-333333333333';
  const courseId = '10000000-0000-0000-0000-000000000001';
  const tid = 'JC-' + Math.floor(1000000000 + Math.random() * 9000000000);

  console.log('Inserting enrollment with valid UUIDs...');
  const res = await client.query(`
    INSERT INTO public.enrollments (
      student_id, course_id, status, payment_method, transaction_id, 
      amount_paid_pkr, teacher_share_pkr, platform_share_pkr, receipt_url
    ) VALUES ($1, $2, 'PENDING_VERIFICATION', 'JAZZCASH', $3, 4500, 3600, 900, 'https://example.com/receipt.jpg')
    ON CONFLICT (student_id, course_id) DO UPDATE SET
      transaction_id = EXCLUDED.transaction_id,
      status = 'PENDING_VERIFICATION'
    RETURNING id, student_id, course_id, status, transaction_id;
  `, [studentId, courseId, tid]);

  console.log('✓ Successfully inserted enrollment into PostgreSQL:', res.rows[0]);

  const check = await client.query(`
    SELECT e.id, e.status, e.transaction_id, e.amount_paid_pkr, p.full_name, c.title
    FROM public.enrollments e
    JOIN public.profiles p ON p.id = e.student_id
    JOIN public.courses c ON c.id = e.course_id
    WHERE e.id = $1;
  `, [res.rows[0].id]);

  console.log('✓ Successfully verified join query:', check.rows[0]);
  await client.end();
}

testInsert().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
