const { Client } = require('pg');

const client = new Client({
  connectionString:
    'postgresql://postgres.pvppoygilxoypscyoprc:lFX1Y9924ZLN3dSF@aws-0-eu-west-1.pooler.supabase.com:5432/postgres',
});

async function run() {
  await client.connect();
  console.log('Connected to Supabase PostgreSQL');

  const sql = `
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES 
    (
      '11111111-1111-1111-1111-111111111111',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'teacher@professoracademy.pk',
      crypt('teacher123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Prof. Dr. Arshad Mahmood"}'::jsonb,
      now(),
      now()
    ),
    (
      '22222222-2222-2222-2222-222222222222',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@professoracademy.pk',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Executive Administrator"}'::jsonb,
      now(),
      now()
    ),
    (
      '33333333-3333-3333-3333-333333333333',
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'student@professoracademy.pk',
      crypt('student123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Hamza Farooq"}'::jsonb,
      now(),
      now()
    )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (
    id,
    role,
    full_name,
    email,
    phone,
    city,
    program,
    can_direct_publish,
    commission_rate
  )
  VALUES
    (
      '11111111-1111-1111-1111-111111111111',
      'TEACHER',
      'Prof. Dr. Arshad Mahmood',
      'teacher@professoracademy.pk',
      '+92 321 7654321',
      'Islamabad',
      'Physics Department',
      true,
      80.00
    ),
    (
      '22222222-2222-2222-2222-222222222222',
      'ADMIN',
      'Executive Administrator',
      'admin@professoracademy.pk',
      '+92 300 0000000',
      'Lahore',
      'Platform Governance',
      true,
      80.00
    ),
    (
      '33333333-3333-3333-3333-333333333333',
      'STUDENT',
      'Hamza Farooq',
      'student@professoracademy.pk',
      '+92 300 1234567',
      'Lahore',
      'MDCAT Preparation (2026)',
      false,
      80.00
    )
  ON CONFLICT (id) DO UPDATE SET
    role = EXCLUDED.role,
    can_direct_publish = EXCLUDED.can_direct_publish;
  `;

  await client.query(sql);
  console.log('Seeded auth.users and public.profiles successfully!');

  const res = await client.query('SELECT id, email, role, can_direct_publish FROM public.profiles');
  console.log('Active Profiles in Supabase:', res.rows);

  await client.end();
}

run().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
