const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env.local if present
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

async function migrate() {
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required.');
  }

  console.log('Connecting to Supabase PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  console.log('✓ Connected to PostgreSQL database!');

  const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
  console.log('Reading schema file from:', schemaPath);
  const sql = fs.readFileSync(schemaPath, 'utf8');

  console.log('Executing schema.sql...');
  await client.query(sql);
  console.log('✓ Successfully executed schema.sql on Supabase!');

  // Check tables
  const tables = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log('Tables created in public schema:');
  tables.rows.forEach(r => console.log('  - ' + r.table_name));

  await client.end();
  console.log('✓ Done!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
