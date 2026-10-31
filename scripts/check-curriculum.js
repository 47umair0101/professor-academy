const { Client } = require('pg');
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

const client = new Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
client.connect().then(async () => {
  const sec = await client.query('SELECT count(*) FROM public.course_sections;');
  const les = await client.query('SELECT count(*) FROM public.lessons;');
  console.log('Sections count:', sec.rows[0].count);
  console.log('Lessons count:', les.rows[0].count);

  if (parseInt(les.rows[0].count) > 0) {
    const sample = await client.query('SELECT id, course_id, title, lesson_type, video_url FROM public.lessons LIMIT 5;');
    console.log('Sample lessons:', sample.rows);
  }
  await client.end();
}).catch(console.error);
