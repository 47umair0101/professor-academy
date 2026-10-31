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

async function seedQuizzes() {
  await client.connect();
  console.log('Connected to PostgreSQL...');

  const coursePhysics = '10000000-0000-0000-0000-000000000001';
  const courseChemistry = '10000000-0000-0000-0000-000000000002';
  const studentId = '33333333-3333-3333-3333-333333333333';
  const teacherId = '11111111-1111-1111-1111-111111111111';

  // 1. Insert Physics Benchmark Quiz
  console.log('Creating Physics Benchmark Quiz...');
  const q1 = await client.query(`
    INSERT INTO public.quizzes (
      course_id, title, description, time_limit_minutes, attempts_allowed, 
      passing_percentage, randomize_questions, has_expiry, expires_at, 
      written_grading_mode, is_published, published_at
    ) VALUES (
      $1,
      'MDCAT Physics: Mechanics, Projectiles & Work-Energy Benchmark (2026)',
      'Official diagnostic assessment covering UHS / PMDC high-yield past paper tricks, non-calculator shortcuts, and conceptual physics definitions.',
      45,
      2,
      60.00,
      true,
      false,
      null,
      'HYBRID_AI_TEACHER',
      true,
      NOW()
    ) RETURNING id;
  `, [coursePhysics]);

  const quiz1Id = q1.rows[0].id;

  // Insert Questions for Quiz 1
  const questions1 = [
    {
      type: 'SINGLE_CHOICE',
      prompt: 'A projectile is launched from ground level with speed v at an angle of 30° to the horizontal. At what other launch angle will it have the exact same horizontal range (neglecting air resistance)?',
      options: { A: '45°', B: '60°', C: '75°', D: '90°' },
      correct: 'B',
      points: 2,
      order: 1,
    },
    {
      type: 'SINGLE_CHOICE',
      prompt: 'A body moves along a circular path of radius R with constant speed v. What is the net work done by the centripetal force after one complete revolution?',
      options: { A: '2π R F_c', B: 'Zero Joules', C: 'mv² / R', D: '(1/2)mv²' },
      correct: 'B',
      points: 2,
      order: 2,
    },
    {
      type: 'TRUE_FALSE',
      prompt: 'In simple harmonic motion (SHM), the acceleration of the particle is always directed away from the mean position.',
      options: { True: 'True', False: 'False' },
      correct: 'False',
      points: 1,
      order: 3,
    },
    {
      type: 'FILL_BLANK',
      prompt: 'The physical quantity defined as the rate of change of momentum is called ________.',
      options: {},
      correct: ['force', 'Force', 'net force'],
      points: 1,
      order: 4,
    },
    {
      type: 'WRITTEN_QA',
      prompt: 'Explain the difference between elastic and inelastic collisions. What happens to kinetic energy and total momentum in an isolated system during an inelastic collision?',
      options: {},
      correct: 'In an elastic collision, both total momentum and total kinetic energy are conserved. In an inelastic collision, total momentum is conserved, but kinetic energy is not conserved (some kinetic energy is transformed into heat, sound, or permanent deformation).',
      points: 4,
      order: 5,
    },
  ];

  for (const q of questions1) {
    await client.query(`
      INSERT INTO public.quiz_questions (
        quiz_id, question_type, prompt, options, correct_answer, points, sort_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7);
    `, [quiz1Id, q.type, q.prompt, JSON.stringify(q.options), JSON.stringify(q.correct), q.points, q.order]);
  }
  console.log(`  ✓ Inserted 5 multi-format questions for Quiz 1 (ID: ${quiz1Id})`);

  // 2. Insert Sample Student Attempt with PENDING_GRADING for Teacher Grading Queue
  console.log('Seeding sample student attempt in grading queue...');
  const writtenQuestion = await client.query(`
    SELECT id, points, prompt, correct_answer FROM public.quiz_questions 
    WHERE quiz_id = $1 AND question_type = 'WRITTEN_QA' LIMIT 1;
  `, [quiz1Id]);

  if (writtenQuestion.rows.length > 0) {
    const wQ = writtenQuestion.rows[0];
    const att = await client.query(`
      INSERT INTO public.quiz_attempts (
        quiz_id, student_id, started_at, submitted_at, total_score, max_score, 
        percentage, is_passed, grading_status
      ) VALUES ($1, $2, NOW() - INTERVAL '30 minutes', NOW(), 5.0, 10.0, 50.0, true, 'PENDING_GRADING')
      RETURNING id;
    `, [quiz1Id, studentId]);

    const attId = att.rows[0].id;

    // Insert written answer
    await client.query(`
      INSERT INTO public.quiz_attempt_answers (
        attempt_id, question_id, student_response, points_awarded, ai_feedback, is_graded
      ) VALUES (
        $1, $2,
        $3,
        3.0,
        'Good understanding! Student correctly stated that momentum is conserved and kinetic energy is lost. Mentioning deformation or thermal transformation would earn full 4/4 marks.',
        false
      );
    `, [
      attId,
      wQ.id,
      JSON.stringify('In elastic collisions kinetic energy is conserved. In inelastic collision momentum is conserved but kinetic energy decreases and changes into other forms.'),
    ]);

    console.log('  ✓ Seeded pending student attempt with Gemini AI preliminary feedback in Teacher Grading Queue!');
  }

  // 3. Seed Sample In-App Notification
  console.log('Seeding in-app notification...');
  await client.query(`
    INSERT INTO public.notifications (
      recipient_id, sender_id, course_id, title, message, type, link_url, is_read
    ) VALUES (
      $1, $2, $3,
      'New Timed Assessment: Mechanics & Projectiles Benchmark',
      'Prof. Dr. Arshad Mahmood has published a 45-minute benchmark quiz. Test your understanding and get instant AI feedback.',
      'QUIZ',
      $4,
      false
    );
  `, [studentId, teacherId, coursePhysics, `/student/quizzes/${quiz1Id}`]);

  console.log('  ✓ Seeded in-app notification for student.');

  await client.end();
  console.log('\n✓ Quizzes and sample data seeded successfully!');
}

seedQuizzes().catch(err => {
  console.error('Quiz seed failed:', err);
  process.exit(1);
});
