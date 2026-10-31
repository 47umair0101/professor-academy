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

async function check() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  const res = await client.query(`
    SELECT policyname, cmd, qual, with_check 
    FROM pg_policies 
    WHERE tablename = 'enrollments';
  `);
  console.log('Enrollment Policies in DB:');
  res.rows.forEach(r => console.log(JSON.stringify(r, null, 2)));

  await client.end();
}

check().catch(console.error);
