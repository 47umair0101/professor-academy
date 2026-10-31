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
client.connect().then(async () => {
  const res = await client.query('SELECT tablename, policyname, cmd, qual, with_check FROM pg_policies ORDER BY tablename, policyname;');
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}).catch(console.error);
