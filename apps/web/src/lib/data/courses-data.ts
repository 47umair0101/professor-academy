export interface CourseData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  examBoard: string;
  level: 'Entry Test' | 'Intermediate' | 'Competitive Exam' | 'Skill Development';
  instructor: {
    name: string;
    designation: string;
    avatarUrl: string;
    bio: string;
    rating: number;
    studentsCount: number;
    coursesCount: number;
  };
  thumbnailUrl: string;
  rating: number;
  ratingCount: number;
  pricePkr: number;
  originalPricePkr: number;
  badgeText?: string;
  badgeVariant?: 'gold' | 'indigo' | 'neutral' | 'success';
  durationHours: number;
  lessonsCount: number;
  lastUpdated: string;
  language: string;
  eligibilitySnippet: string;
  eligibilityRequirements: {
    minQualification: string;
    recommendedBackground: string;
    targetStudents: string[];
    prerequisites: string[];
  };
  whatYouWillLearn: string[];
  sections: Array<{
    id: string;
    title: string;
    lessons: Array<{
      id: string;
      title: string;
      durationMinutes: number;
      isFreePreview: boolean;
      videoUrl?: string;
    }>;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const MOCK_COURSES: CourseData[] = [
  {
    id: 'c-1',
    slug: 'mdcat-physics-masterclass',
    title: 'MDCAT Physics: Complete High-Yield Prep & Past Paper Shortcuts (2026)',
    subtitle: 'Master 100% of the UHS & PMDC Physics syllabus with 400+ past paper tricks, formula sheets, and mock tests.',
    category: 'MDCAT Prep',
    examBoard: 'UHS / PMDC',
    level: 'Entry Test',
    instructor: {
      name: 'Prof. Dr. Arshad Mahmood',
      designation: 'Ex-Chairman Physics, 22+ Years MDCAT Mentorship',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      bio: 'Mentored over 14,000 students to secure seats in King Edward Medical University, Allama Iqbal Medical College, and Fatima Jinnah.',
      rating: 4.9,
      studentsCount: 18450,
      coursesCount: 4,
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    ratingCount: 4210,
    pricePkr: 4500,
    originalPricePkr: 8000,
    badgeText: 'Bestseller',
    badgeVariant: 'gold',
    durationHours: 38,
    lessonsCount: 54,
    lastUpdated: 'October 2026',
    language: 'Urdu & English (Bilingual)',
    eligibilitySnippet: '🎯 FSc Pre-Medical 65%+ or A-Level Physics passed',
    eligibilityRequirements: {
      minQualification: 'FSc Pre-Medical Part-1 passed with at least 65% marks, or equivalent CAIE A-Levels.',
      recommendedBackground: 'Basic command of algebraic vectors, Newton mechanics, and trigonometry.',
      targetStudents: [
        'Aspirants targeting King Edward, AIMC, Rawalpindi Medical College, and UHS colleges.',
        'Improvers & Freshers wanting high-yield past paper short tricks.',
        'A-Level students converting to PMDC local syllabus.',
      ],
      prerequisites: [
        'Matric / O-Level Science background with 60%+ marks',
        'Scientific calculator understanding',
        'Dedication of 5-7 study hours weekly',
      ],
    },
    whatYouWillLearn: [
      'Solve 90% of MDCAT mechanics and electricity problems in under 45 seconds using non-calculator shortcuts.',
      'Comprehensive mastery of all 18 PMDC specified physics topics.',
      'Access to 2,000+ chapter-wise MDCAT MCQs with step-by-step video solutions.',
      'Master error propagation, significant figures, dimensional analysis, and circular motion.',
      'Full coverage of Nuclear Physics, Radioactivity, and Modern Quantum Physics.',
      'Time management and negative marking avoidance strategies.',
    ],
    sections: [
      {
        id: 'sec-1',
        title: 'Section 1: Force, Motion & Work Energy (High Yield)',
        lessons: [
          { id: 'l-1', title: '1.1 Displacement-Time Graphs & Non-Linear Slopes', durationMinutes: 28, isFreePreview: true, videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ' },
          { id: 'l-2', title: '1.2 Projectile Motion Shortcuts (Max Range & Time of Flight)', durationMinutes: 34, isFreePreview: true, videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ' },
          { id: 'l-3', title: '1.3 Work-Energy Theorem in Variable Force Systems', durationMinutes: 42, isFreePreview: false },
          { id: 'l-4', title: '1.4 Elastic & Inelastic Collisions: UHS Past Paper Drills', durationMinutes: 31, isFreePreview: false },
        ],
      },
      {
        id: 'sec-2',
        title: 'Section 2: Waves, Oscillations & Sound Doppler Effect',
        lessons: [
          { id: 'l-5', title: '2.1 Simple Harmonic Motion: Energy Conservation Curve', durationMinutes: 26, isFreePreview: false },
          { id: 'l-6', title: '2.2 Doppler Effect Formulas in 3 Steps', durationMinutes: 35, isFreePreview: true, videoUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ' },
          { id: 'l-7', title: '2.3 Stationary Waves in Air Columns & Organ Pipes', durationMinutes: 39, isFreePreview: false },
        ],
      },
      {
        id: 'sec-3',
        title: 'Section 3: Electromagnetism & Modern Physics',
        lessons: [
          { id: 'l-8', title: '3.1 Coulomb Law Vector Form & Electric Dipoles', durationMinutes: 40, isFreePreview: false },
          { id: 'l-9', title: '3.2 Magnetic Force on Charge: Right Hand Grip Rules', durationMinutes: 32, isFreePreview: false },
          { id: 'l-10', title: '3.3 Photoelectric Effect & Einstein Equation Pitfalls', durationMinutes: 45, isFreePreview: false },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this course updated for the PMDC 2026 MDCAT Syllabus?',
        answer: 'Yes, 100%. Every single topic, numerical trick, and question bank item aligns strictly with the latest PMDC syllabus guidelines.',
      },
      {
        question: 'Can I watch lectures in Urdu / English bilingual format?',
        answer: 'Yes. Professor Dr. Arshad explains all conceptual mechanics in clear, easy-to-understand Urdu while maintaining standard English medical terminology.',
      },
      {
        question: 'How do I submit my fee using JazzCash, Easypaisa, or Bank Transfer?',
        answer: 'When clicking Enroll Now, select your preferred local payment method. You will get our official account details and upload your transaction receipt/TID for instant verification.',
      },
    ],
  },
  {
    id: 'c-2',
    slug: 'fsc-chemistry-part-1',
    title: 'FSc Pre-Medical Chemistry Part-1: Organic & Inorganic Concepts',
    subtitle: 'Federal Board & Punjab Board syllabus simplified with animated reaction mechanisms and chapter-wise numericals.',
    category: 'FSc Part-I',
    examBoard: 'FBISE & Punjab Boards',
    level: 'Intermediate',
    instructor: {
      name: 'Dr. Fatima Tariq',
      designation: 'M.Phil Organic Chemistry, Gold Medalist',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      bio: 'Author of 3 high-school chemistry revision guides with 12+ years of teaching experience across top colleges in Lahore and Islamabad.',
      rating: 4.9,
      studentsCount: 11200,
      coursesCount: 3,
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    ratingCount: 1890,
    pricePkr: 3800,
    originalPricePkr: 6000,
    badgeText: 'Top Rated',
    badgeVariant: 'gold',
    durationHours: 32,
    lessonsCount: 46,
    lastUpdated: 'September 2026',
    language: 'Urdu & English',
    eligibilitySnippet: '🎯 Matric Science with Chemistry (60%+)',
    eligibilityRequirements: {
      minQualification: 'Matriculation (Science Group) with minimum 60% in Chemistry & Biology.',
      recommendedBackground: 'Familiarity with atomic structures, periodic table groups, and stoichiometry basics.',
      targetStudents: [
        '1st Year FSc Pre-Medical and Pre-Engineering students in Federal & Punjab boards.',
        'Students preparing for FBISE board toppers merit list.',
        'Aspirants building an early bedrock foundation for MDCAT Chemistry.',
      ],
      prerequisites: [
        'Textbook: Chemistry Part-1 (National Book Foundation or Punjab Textbook Board)',
        'Periodic Table reference chart',
        'Commitment of 4 hours weekly',
      ],
    },
    whatYouWillLearn: [
      'Master Stoichiometry, Limiting Reactants, and Yield calculations effortlessly.',
      'Visualise atomic orbitals, quantum numbers, and chemical bonding (VSEPR, MOT, Hybridization).',
      'Understand states of matter: Ideal Gas laws, Van der Waals corrections, and crystal lattices.',
      'Chemical Equilibrium, Le Chatelier principle, and Buffer solution calculations.',
      'Acquire full marks in long questions with verified Board-topper paper presentation templates.',
    ],
    sections: [
      {
        id: 'sec-c1',
        title: 'Section 1: Stoichiometry & Basic Chemical Concepts',
        lessons: [
          { id: 'cl-1', title: '1.1 Mole Concept & Avogadro Number Calculations', durationMinutes: 30, isFreePreview: true },
          { id: 'cl-2', title: '1.2 Identifying Limiting Reactants in Multi-step Reactions', durationMinutes: 38, isFreePreview: true },
          { id: 'cl-3', title: '1.3 Percentage Yield vs Theoretical Yield Pitfalls', durationMinutes: 24, isFreePreview: false },
        ],
      },
      {
        id: 'sec-c2',
        title: 'Section 2: Atomic Structure & Quantum Mechanics',
        lessons: [
          { id: 'cl-4', title: '2.1 Bohr Model Limitations & Planck Quantum Theory', durationMinutes: 35, isFreePreview: false },
          { id: 'cl-5', title: '2.2 Quantum Numbers (n, l, m, s) & Electronic Configurations', durationMinutes: 42, isFreePreview: false },
        ],
      },
    ],
    faqs: [
      {
        question: 'Are solved board past papers included?',
        answer: 'Yes! Over 10 years of FBISE and Lahore Board solved questions are integrated into each chapter.',
      },
    ],
  },
  {
    id: 'c-3',
    slug: 'ecat-net-advanced-math',
    title: 'ECAT & NUST (NET) Advanced Mathematics: Speed Tricks & Problem Sets',
    subtitle: 'Crush the math section of UET ECAT, NUST NET, FAST, and GIKI with 500+ speed formulas and past papers.',
    category: 'Engineering Prep',
    examBoard: 'UET / NUST',
    level: 'Entry Test',
    instructor: {
      name: 'Engr. Usman Qureshi',
      designation: 'M.Sc. Mathematics, UET Lahore Top Graduate',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      bio: 'Specialist in entrance exam mathematics with 10+ years coaching top engineering aspirants across Pakistan.',
      rating: 4.8,
      studentsCount: 14900,
      coursesCount: 2,
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    ratingCount: 2340,
    pricePkr: 4200,
    originalPricePkr: 7500,
    badgeText: 'Popular',
    badgeVariant: 'indigo',
    durationHours: 42,
    lessonsCount: 60,
    lastUpdated: 'September 2026',
    language: 'Urdu & English',
    eligibilitySnippet: '🎯 FSc Pre-Engineering / ICS Math student',
    eligibilityRequirements: {
      minQualification: 'FSc Pre-Engineering or ICS with Mathematics (Minimum 60% in Part-1).',
      recommendedBackground: 'Strong grasp of functions, limits, derivatives, integration, and matrices.',
      targetStudents: [
        'Aspirants targeting NUST SEECS, UET Lahore, FAST-NUCES, and GIKI engineering seats.',
        'Students aiming to score 75+ out of 80 in NET Mathematics.',
      ],
      prerequisites: [
        'Mathematics Part-1 and Part-2 syllabus familiarity',
        'Dedication to daily speed practice problem sheets',
      ],
    },
    whatYouWillLearn: [
      'Solve conic sections and calculus limits in under 30 seconds without long L-Hopital manual steps.',
      'Master permutations, combinations, and probability shortcuts for NUST NET.',
      'Trigonometric identities: eliminate angle variables with substitution hacks.',
      'Vector geometry & 3D coordinate system problem sets.',
    ],
    sections: [
      {
        id: 'sec-m1',
        title: 'Section 1: Conic Sections & Coordinate Geometry',
        lessons: [
          { id: 'ml-1', title: '1.1 Circle Equations & Tangent Length Shortcuts', durationMinutes: 32, isFreePreview: true },
          { id: 'ml-2', title: '1.2 Parabola, Ellipse & Hyperbola Eccentricity Table', durationMinutes: 44, isFreePreview: false },
        ],
      },
    ],
    faqs: [
      {
        question: 'Does this cover both ECAT and NUST NET?',
        answer: 'Yes! Both test patterns are covered with dedicated modules for NET calculator-free speed calculations and ECAT negative marking controls.',
      },
    ],
  },
  {
    id: 'c-4',
    slug: 'cambridge-a-level-biology',
    title: 'Cambridge International A-Level Biology (Paper 4 & 5 Special Prep)',
    subtitle: 'Score an A* with comprehensive coverage of CAIE 9700 syllabus, marking schemes, and practical planning.',
    category: 'Cambridge A-Level',
    examBoard: 'Cambridge CAIE',
    level: 'Intermediate',
    instructor: {
      name: 'Amina Rehman',
      designation: 'Cambridge Certified Educator, Ex-Aitchison Faculty',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      bio: 'Over 15 years teaching Cambridge A-Level Biology with more than 85% of students securing straight A/A* grades.',
      rating: 4.9,
      studentsCount: 6800,
      coursesCount: 2,
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    ratingCount: 980,
    pricePkr: 6500,
    originalPricePkr: 11000,
    badgeText: 'Certified',
    badgeVariant: 'indigo',
    durationHours: 36,
    lessonsCount: 48,
    lastUpdated: 'August 2026',
    language: 'English',
    eligibilitySnippet: '🎯 O-Level / IGCSE Biology Grade B or above',
    eligibilityRequirements: {
      minQualification: 'O-Level or IGCSE Biology with minimum Grade B (or equivalent).',
      recommendedBackground: 'Cell biology, enzymes, genetics, and basic scientific experimental method.',
      targetStudents: [
        'Students taking CAIE A2 Biology examinations (Syllabus 9700).',
        'Students looking to excel in Paper 4 Structured Questions and Paper 5 Planning, Analysis & Evaluation.',
      ],
      prerequisites: [
        'Enrolled in Cambridge A-Level program',
        'English proficiency for structured answer formulation',
      ],
    },
    whatYouWillLearn: [
      'Master Paper 4 A2 Theory: Energy and Respiration, Photosynthesis, Homeostasis, and Gene Technology.',
      'Formulate full-mark answers using CAIE specific biological keywords and marking schemes.',
      'Paper 5 mastery: Experimental design, statistical null hypothesis testing (t-test, chi-squared), and error analysis.',
      'Access to 10 years of solved topical past papers with examiner report insights.',
    ],
    sections: [
      {
        id: 'sec-b1',
        title: 'Section 1: Energy & Respiration (Topic 12)',
        lessons: [
          { id: 'bl-1', title: '1.1 Glycolysis, Link Reaction & Krebs Cycle', durationMinutes: 35, isFreePreview: true },
          { id: 'bl-2', title: '1.2 Oxidative Phosphorylation & ATP Synthase Mechanism', durationMinutes: 40, isFreePreview: false },
        ],
      },
    ],
    faqs: [
      {
        question: 'Are practical planning questions in Paper 5 explained?',
        answer: 'Yes! A dedicated module teaches you how to write step-by-step risk assessments, control variables, and data tables for Paper 5.',
      },
    ],
  },
  {
    id: 'c-5',
    slug: 'css-essay-precis-mastery',
    title: 'CSS English Essay & Précis Writing Masterclass (2026 Batch)',
    subtitle: 'Strategic writing blueprint by CSP officers to conquer the highest-failing subjects of the CSS examination.',
    category: 'CSS / PMS',
    examBoard: 'FPSC',
    level: 'Competitive Exam',
    instructor: {
      name: 'Bilal Ahmad, PAS',
      designation: 'CSP Officer & Civil Services Academy Mentor',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      bio: 'Secured Top 15 allocation in CSS. Mentored over 150 successful civil servants in English Essay and Précis composition.',
      rating: 4.9,
      studentsCount: 5400,
      coursesCount: 1,
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    ratingCount: 1420,
    pricePkr: 14000,
    originalPricePkr: 22000,
    badgeText: 'Premium',
    badgeVariant: 'gold',
    durationHours: 50,
    lessonsCount: 42,
    lastUpdated: 'October 2026',
    language: 'English & Urdu',
    eligibilitySnippet: '🎯 Graduation (BA/BSc/BS 14-16 years) with 2nd division',
    eligibilityRequirements: {
      minQualification: 'Bachelor’s degree (14 or 16 years of education) with at least 2nd Division.',
      recommendedBackground: 'Analytical reading habits, awareness of national and international socio-economic affairs.',
      targetStudents: [
        'Aspirants preparing for CE CSS 2026 / 2027 by Federal Public Service Commission.',
        'PMS Punjab, KP, and Sindh aspirants.',
      ],
      prerequisites: [
        'Basic English grammar and sentence structuring',
        'Daily reading habit of national editorials (Dawn, The News)',
      ],
    },
    whatYouWillLearn: [
      'Master the 5-paragraph thesis statement construction and argumentative essay outlines.',
      'Rules of Précis writing: Extracting central thought and condensing to one-third without distortions.',
      'Vocabulary building with high-frequency GRE/CSS words and contextual usage.',
      'Individual evaluations and feedback templates on 10 full-length essay outlines.',
    ],
    sections: [
      {
        id: 'sec-css1',
        title: 'Section 1: The Anatomy of a Scoring CSS Essay',
        lessons: [
          { id: 'css-1', title: '1.1 Decoding the FPSC Examiner Report on Essay Failures', durationMinutes: 45, isFreePreview: true },
          { id: 'css-2', title: '1.2 Thesis Statement Crafting: Argumentative vs Descriptive', durationMinutes: 52, isFreePreview: false },
        ],
      },
    ],
    faqs: [
      {
        question: 'Do we get essay outline evaluation?',
        answer: 'Yes, students get dedicated evaluation rubrics and sample model essays written by CSP officers.',
      },
    ],
  },
  {
    id: 'c-6',
    slug: 'computer-science-fullstack-foundations',
    title: 'Full-Stack Web Development with Next.js 15 & TypeScript',
    subtitle: 'From zero to building full-stack web applications with modern React, Next.js App Router, Tailwind, and Supabase.',
    category: 'Computer Science',
    examBoard: 'Skill Development',
    level: 'Skill Development',
    instructor: {
      name: 'Mohammad Hamza',
      designation: 'Senior Staff Engineer & Tech Lead',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      bio: 'Full-stack software architect with 8+ years building enterprise SaaS and training university graduates in modern web engineering.',
      rating: 4.8,
      studentsCount: 9200,
      coursesCount: 2,
    },
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    ratingCount: 3100,
    pricePkr: 0,
    originalPricePkr: 5000,
    badgeText: 'Free Course',
    badgeVariant: 'indigo',
    durationHours: 24,
    lessonsCount: 36,
    lastUpdated: 'October 2026',
    language: 'Urdu & English',
    eligibilitySnippet: '🎯 Anyone with a computer & passion to build software',
    eligibilityRequirements: {
      minQualification: 'Matriculation or O-Levels in any group. No computer science degree required.',
      recommendedBackground: 'Basic computer literacy (installing software, using a web browser).',
      targetStudents: [
        'College & University students seeking practical programming skills.',
        'Beginners wanting to launch their careers in remote software development.',
      ],
      prerequisites: [
        'A laptop/desktop with Windows, macOS, or Linux',
        'Curiosity to solve problems with code',
      ],
    },
    whatYouWillLearn: [
      'HTML5, Tailwind CSS, TypeScript fundamentals from the ground up.',
      'Next.js 15 App Router: Server Components, Client Components, and Server Actions.',
      'PostgreSQL database design and Supabase authentication.',
      'Deploy production apps to Vercel with automated CI/CD.',
    ],
    sections: [
      {
        id: 'sec-dev1',
        title: 'Section 1: Modern Web Foundations',
        lessons: [
          { id: 'dev-1', title: '1.1 Setting up VS Code, Node.js and TypeScript', durationMinutes: 25, isFreePreview: true },
          { id: 'dev-2', title: '1.2 Tailwind CSS: Building Modern UI Components', durationMinutes: 38, isFreePreview: true },
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this course truly 100% free?',
        answer: 'Yes! Professor Academy offers this foundational course completely free of cost to empower Pakistani youth with digital skills.',
      },
    ],
  },
];
