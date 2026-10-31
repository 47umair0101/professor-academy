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

const COURSES_TO_SEED = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    slug: 'mdcat-physics-masterclass',
    title: 'MDCAT Physics: Complete High-Yield Prep & Past Paper Shortcuts (2026)',
    category: 'MDCAT Prep',
    price_pkr: 4500,
    short_description: 'Master 100% of the UHS & PMDC Physics syllabus with 400+ past paper tricks, formula sheets, and mock tests.',
    full_description: 'Comprehensive video lectures and high-yield notes covering all PMDC Physics modules, error propagation, significant figures, Newton mechanics, electricity, electromagnetism, and modern nuclear physics.',
    eligibility_criteria: 'FSc Pre-Medical Part-1 passed with at least 65% marks, or equivalent CAIE A-Levels.',
    thumbnail_url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
    teacher_id: '11111111-1111-1111-1111-111111111111',
    status: 'PUBLISHED',
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    slug: 'fsc-chemistry-part-1',
    title: 'FSc Pre-Medical Chemistry Part-1: Organic & Inorganic Concepts',
    category: 'Intermediate (FSc)',
    price_pkr: 3800,
    short_description: 'Complete National Curriculum Chemistry for Class 11 covering atomic structure, chemical bonding, and gas laws.',
    full_description: 'In-depth chemical equilibrium, stoichiometry, thermochemistry, and solutions with Federal Board board exam papers.',
    eligibility_criteria: 'Matriculation (Science) passed with Chemistry.',
    thumbnail_url: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=800&q=80',
    teacher_id: '11111111-1111-1111-1111-111111111111',
    status: 'PUBLISHED',
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    slug: 'ecat-net-advanced-math',
    title: 'ECAT Advanced Mathematics: 50-Second Calculation Shortcuts (UET 2026)',
    category: 'ECAT Prep',
    price_pkr: 4200,
    short_description: 'Crack UET, NUST (NET), and GIKI entrance math with speed tricks for calculus, conic sections, and matrices.',
    full_description: 'Complete high-speed mathematics training for engineering entrance aspirants in Pakistan.',
    eligibility_criteria: 'FSc Pre-Engineering with 60%+ marks or ICS with Mathematics.',
    thumbnail_url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    teacher_id: '11111111-1111-1111-1111-111111111111',
    status: 'PUBLISHED',
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    slug: 'cambridge-a-level-biology',
    title: 'Cambridge A-Level Biology (9700): A* Exam Technique & Paper 4 Specialist',
    category: 'Cambridge (CAIE)',
    price_pkr: 5200,
    short_description: 'Structured A2 and AS biology program focusing on structured answers, genetic technology, and respiration.',
    full_description: 'Master Cambridge International Examinations 9700 paper 2, 4, and 5 marking schemes with sample examiner reports.',
    eligibility_criteria: 'O-Level Biology with Grade B or higher.',
    thumbnail_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    teacher_id: '11111111-1111-1111-1111-111111111111',
    status: 'PUBLISHED',
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    slug: 'css-essay-precis-mastery',
    title: 'CSS General Science & Ability (CE-2026): 100-Mark Comprehensive Program',
    category: 'Competitive (CSS/PMS)',
    price_pkr: 6000,
    short_description: 'The definitive preparation course for FPSC CSS compulsory paper covering environmental science and food science.',
    full_description: 'Master physical sciences, biological sciences, environmental sciences, IT, and basic quantitative ability.',
    eligibility_criteria: 'Graduation (Bachelor Degree 14/16 years).',
    thumbnail_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    teacher_id: '11111111-1111-1111-1111-111111111111',
    status: 'PUBLISHED',
  },
  {
    id: '10000000-0000-0000-0000-000000000006',
    slug: 'computer-science-fullstack-foundations',
    title: 'Python for AI & Data Science: From Basic Loops to Neural Networks',
    category: 'Computer Science',
    price_pkr: 4800,
    short_description: 'Hands-on practical coding bootcamp for Pakistani students aiming for AI engineering, freelancing, and data roles.',
    full_description: 'Zero to hero Python programming, NumPy, Pandas, Matplotlib, scikit-learn, and Gemini API application development.',
    eligibility_criteria: 'Basic computer literacy. No prior coding experience required.',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    teacher_id: '11111111-1111-1111-1111-111111111111',
    status: 'PUBLISHED',
  },
];

async function seed() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  console.log('Connected to PostgreSQL...');

  for (const c of COURSES_TO_SEED) {
    await client.query(`
      INSERT INTO public.courses (
        id, slug, title, category, price_pkr, short_description, full_description, 
        eligibility_criteria, thumbnail_url, teacher_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        slug = EXCLUDED.slug,
        title = EXCLUDED.title,
        price_pkr = EXCLUDED.price_pkr,
        thumbnail_url = EXCLUDED.thumbnail_url,
        status = EXCLUDED.status;
    `, [
      c.id,
      c.slug,
      c.title,
      c.category,
      c.price_pkr,
      c.short_description,
      c.full_description,
      c.eligibility_criteria,
      c.thumbnail_url,
      c.teacher_id,
      c.status,
    ]);
    console.log(`✓ Seeded course: ${c.title} (ID: ${c.id})`);
  }

  const res = await client.query('SELECT id, slug, title FROM public.courses');
  console.log('Total Courses in DB:', res.rows.length);

  await client.end();
  console.log('Done!');
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
