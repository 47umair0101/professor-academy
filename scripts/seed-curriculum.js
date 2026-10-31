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

// Course Curricula definitions with rich academic content
const curricula = [
  {
    courseId: '10000000-0000-0000-0000-000000000001', // MDCAT Physics
    sections: [
      {
        title: 'Section 1: Force, Motion & Work Energy (High Yield)',
        orderIndex: 1,
        lessons: [
          {
            title: '1.1 Displacement-Time Graphs & Non-Linear Slopes',
            lessonType: 'VIDEO',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            videoDurationSeconds: 1680,
            isFreePreview: true,
            orderIndex: 1,
            contentHtml: `
              <h3>Key Learning Objectives</h3>
              <p>Understanding the geometric interpretation of displacement-time graphs is crucial for PMDC / UHS MDCAT numerical problems.</p>
              <blockquote><strong>MDCAT Golden Rule:</strong> The slope of the tangent to a displacement-time curve gives instantaneous velocity (v = ds/dt). If the slope is zero, the body is momentarily at rest.</blockquote>
              <h4>Common Past Paper Traps:</h4>
              <ul>
                <li><strong>Trap 1:</strong> Confusing distance-time (scalar, always positive slope) with displacement-time (vector, can have negative slope).</li>
                <li><strong>Trap 2:</strong> When a ball is thrown vertically upwards, velocity at maximum height is zero, but acceleration remains constant at 9.8 m/s² downwards!</li>
              </ul>
            `,
          },
          {
            title: '1.2 Projectile Motion Shortcuts (Max Range & Time of Flight)',
            lessonType: 'VIDEO',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            videoDurationSeconds: 2040,
            isFreePreview: true,
            orderIndex: 2,
            contentHtml: `
              <h3>Projectile Motion Quick Reference</h3>
              <p>In MDCAT, you rarely have more than 40 seconds to solve a projectile question. Memorize these rapid relations:</p>
              <ul>
                <li><strong>Maximum Range:</strong> R_max = v² / g at launch angle θ = 45°.</li>
                <li><strong>Relation between Height and Range:</strong> At θ = 45°, R_max = 4H.</li>
                <li><strong>Complementary Angles:</strong> Angles θ and (90° - θ) produce identical horizontal ranges! (e.g. 30° and 60° have equal range).</li>
              </ul>
            `,
          },
          {
            title: '1.3 Work-Energy Theorem in Variable Force Systems',
            lessonType: 'TEXT',
            videoDurationSeconds: 0,
            isFreePreview: false,
            orderIndex: 3,
            contentHtml: `
              <h3>Work-Energy Theorem Deep Dive</h3>
              <p>The net work done on an object by all conservative and non-conservative forces equals the change in its kinetic energy:</p>
              <pre><code>W_net = ΔK = (1/2)m(v_f² - v_i²)</code></pre>
              <h4>Conservative vs Non-Conservative Forces:</h4>
              <p>Gravitational force and electrostatic force are conservative (work along a closed loop is 0). Frictional and viscous drag forces are non-conservative (energy dissipated as thermal radiation).</p>
            `,
          },
          {
            title: '1.4 Elastic & Inelastic Collisions: UHS Past Paper Drills',
            lessonType: 'VIDEO',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            videoDurationSeconds: 1860,
            isFreePreview: false,
            orderIndex: 4,
            contentHtml: `
              <h3>Collision Velocity Formulas</h3>
              <p>For an isolated system with m1 colliding with m2 at rest:</p>
              <ul>
                <li>If m1 = m2, they completely swap velocities!</li>
                <li>If m1 >> m2 (heavy truck hitting marble), m1 continues with speed v, and marble shoots forward at 2v!</li>
                <li>If m1 << m2 (marble hitting heavy wall), marble rebounds with speed -v!</li>
              </ul>
            `,
          },
        ],
      },
      {
        title: 'Section 2: Waves, Oscillations & Sound Doppler Effect',
        orderIndex: 2,
        lessons: [
          {
            title: '2.1 Simple Harmonic Motion: Energy Conservation Curve',
            lessonType: 'TEXT',
            videoDurationSeconds: 0,
            isFreePreview: false,
            orderIndex: 1,
            contentHtml: `
              <h3>Energy in SHM</h3>
              <p>Total mechanical energy in simple harmonic motion is conserved:</p>
              <pre><code>E_total = K.E. + P.E. = (1/2)k*x_0² = constant</code></pre>
              <p>At the mean position (x = 0), potential energy is zero and kinetic energy is at its absolute maximum. At extreme positions (x = ±x0), kinetic energy is zero and potential energy is maximum.</p>
            `,
          },
          {
            title: '2.2 Doppler Effect Formulas in 3 Steps',
            lessonType: 'VIDEO',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            videoDurationSeconds: 2100,
            isFreePreview: true,
            orderIndex: 2,
            contentHtml: `
              <h3>MDCAT 3-Step Doppler Master Rule</h3>
              <p>Always draw an arrow from <strong>Source (S)</strong> to <strong>Observer (O)</strong>:</p>
              <ul>
                <li>When source moves towards stationary listener: f' = f * (v / (v - u_s)) [Frequency Increases].</li>
                <li>When source moves away from stationary listener: f' = f * (v / (v + u_s)) [Frequency Decreases].</li>
                <li>When observer moves towards stationary source: f' = f * ((v + u_o) / v) [Frequency Increases].</li>
              </ul>
            `,
          },
        ],
      },
    ],
  },
  {
    courseId: '10000000-0000-0000-0000-000000000002', // MDCAT Chemistry
    sections: [
      {
        title: 'Section 1: Reaction Kinetics & Chemical Equilibrium',
        orderIndex: 1,
        lessons: [
          {
            title: '1.1 Rate Law, Order of Reaction & Half-Life Graphs',
            lessonType: 'VIDEO',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            videoDurationSeconds: 1920,
            isFreePreview: true,
            orderIndex: 1,
            contentHtml: `
              <h3>Reaction Kinetics Mastery</h3>
              <p>Order of reaction can ONLY be determined experimentally, never from stoichiometric coefficients of a balanced equation.</p>
              <ul>
                <li><strong>First-Order Reactions:</strong> Half-life t_1/2 is independent of initial concentration! (t_1/2 = 0.693 / k).</li>
                <li><strong>Second-Order Reactions:</strong> Half-life is inversely proportional to initial concentration.</li>
              </ul>
            `,
          },
          {
            title: '1.2 Le Chatelier Principle in Industrial Ammonia Synthesis',
            lessonType: 'TEXT',
            videoDurationSeconds: 0,
            isFreePreview: false,
            orderIndex: 2,
            contentHtml: `
              <h3>Industrial Equilibrium & Catalysis</h3>
              <p>For Haber process: N2(g) + 3H2(g) ⇌ 2NH3(g) (ΔH = -92 kJ/mol):</p>
              <ul>
                <li>Increasing pressure shifts equilibrium to the right (4 moles → 2 moles).</li>
                <li>Since forward reaction is exothermic, low temperature favors yield, but reduces rate. Hence compromise temperature of 400-450°C is employed.</li>
                <li>Catalyst (finely divided Fe with Al2O3/K2O promoter) speeds up both forward and backward rates equally without shifting Kc!</li>
              </ul>
            `,
          },
        ],
      },
    ],
  },
  {
    courseId: '10000000-0000-0000-0000-000000000003', // ECAT Mathematics
    sections: [
      {
        title: 'Section 1: Differential Calculus & Optimization',
        orderIndex: 1,
        lessons: [
          {
            title: '1.1 Limits & L\'Hôpital\'s Rule for Rapid Evaluation',
            lessonType: 'VIDEO',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            videoDurationSeconds: 1800,
            isFreePreview: true,
            orderIndex: 1,
            contentHtml: `
              <h3>Calculus Shortcuts for ECAT (UET Lahore)</h3>
              <p>When encountering indeterminate forms 0/0 or ∞/∞, apply L'Hôpital's Rule: differentiate numerator and denominator independently with respect to x until indeterminacy vanishes.</p>
            `,
          },
        ],
      },
    ],
  },
];

async function seedCurriculum() {
  await client.connect();
  console.log('Connected to PostgreSQL database...');

  for (const c of curricula) {
    console.log(`Seeding curriculum for course ${c.courseId}...`);

    for (const sec of c.sections) {
      // 1. Insert course_section
      const secRes = await client.query(`
        INSERT INTO public.course_sections (course_id, title, sort_order)
        VALUES ($1, $2, $3)
        RETURNING id;
      `, [c.courseId, sec.title, sec.orderIndex]);
      const sectionId = secRes.rows[0].id;
      console.log(`  ✓ Inserted Section: "${sec.title}" (ID: ${sectionId})`);

      // 2. Insert lessons
      for (const les of sec.lessons) {
        const lesRes = await client.query(`
          INSERT INTO public.lessons (
            section_id, course_id, title, lesson_type, content_html, 
            video_url, video_duration_seconds, is_free_preview, sort_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id;
        `, [
          sectionId,
          c.courseId,
          les.title,
          les.lessonType,
          les.contentHtml,
          les.videoUrl || null,
          les.videoDurationSeconds || 0,
          les.isFreePreview || false,
          les.orderIndex,
        ]);
        console.log(`    - Inserted Lesson: "${les.title}" (${les.lessonType})`);
      }
    }
  }

  // Seed sample topic comments for demonstration
  console.log('Seeding sample topic discussion comments...');
  const firstLesson = await client.query(`SELECT id FROM public.lessons LIMIT 1;`);
  if (firstLesson.rows.length > 0) {
    const lId = firstLesson.rows[0].id;
    const studentId = '33333333-3333-3333-3333-333333333333';
    const teacherId = '11111111-1111-1111-1111-111111111111';

    const c1 = await client.query(`
      INSERT INTO public.lesson_comments (lesson_id, user_id, body)
      VALUES ($1, $2, 'Sir, in MDCAT 2024 paper, there was a question about negative acceleration in non-linear slopes. Can you clarify if slope of v-t graph can ever be undefined?')
      RETURNING id;
    `, [lId, studentId]);

    await client.query(`
      INSERT INTO public.lesson_comments (lesson_id, user_id, parent_comment_id, body, is_pinned_answer)
      VALUES ($1, $2, $3, 'A excellent question, beta! A v-t curve cannot have a vertical line (infinite slope) in classical physics because that would imply infinite acceleration requiring infinite force. Hence, it is physically impossible.', true);
    `, [lId, teacherId, c1.rows[0].id]);

    console.log('  ✓ Seeded Q&A discussion thread with student question and teacher verified answer.');
  }

  await client.end();
  console.log('\n✓ Curriculum & sample discussions successfully seeded into database!');
}

seedCurriculum().catch(err => {
  console.error('Curriculum seeding failed:', err);
  process.exit(1);
});
