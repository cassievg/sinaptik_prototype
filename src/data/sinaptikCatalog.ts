export type FieldId =
  | 'data-analytics'
  | 'leadership'
  | 'software-engineering'
  | 'product-management'
  | 'artificial-intelligence'
  | 'digital-marketing'
  | 'finance-business'
  | 'ui-ux-design'

export interface Field {
  id: FieldId
  name: string
  description: string
}

export interface Mentor {
  id: string
  name: string
  title: string
  field: FieldId
  avatar: string
  programs: string[]
}

export interface ProgramModule {
  id: string
  title: string
}

export interface Program {
  id: string
  fieldId: FieldId
  name: string
  description: string
  durationWeeks: number
  mentorId: string
  modules: ProgramModule[]
}

export interface SkillTest {
  id: string
  fieldId: FieldId
  title: string
  description: string
  durationMinutes: number
  questionCount: number
  mentorId: string
  passingScore: number
}

export interface TestQuestion {
  id: string
  testId: string
  question: string
  options: string[]
  correctIndex: number
}

export const fields: Field[] = [
  {
    id: 'data-analytics',
    name: 'Data Analytics',
    description: 'Python, SQL, visualization, and industry case studies for aspiring data analysts.',
  },
  {
    id: 'leadership',
    name: 'Leadership & Management',
    description: 'Build leadership skills for tech teams and organizational growth.',
  },
  {
    id: 'software-engineering',
    name: 'Software Engineering',
    description: 'Full-stack development, system design, and engineering best practices.',
  },
  {
    id: 'product-management',
    name: 'Product Management',
    description: 'Product discovery, roadmapping, and delivering value to users.',
  },
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    description: 'Machine learning, LLM applications, and AI-assisted workflows.',
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    description: 'SEO, paid ads, content strategy, and growth marketing for digital products.',
  },
  {
    id: 'finance-business',
    name: 'Finance & Business Analytics',
    description: 'Financial modeling, business intelligence, and data-driven decision making.',
  },
  {
    id: 'ui-ux-design',
    name: 'UI/UX Design',
    description: 'User research, interface design, and prototyping for web and mobile apps.',
  },
]

export const mentors: Mentor[] = [
  {
    id: 'm1',
    name: 'Puja Pramudya',
    title: 'Leadership & Management',
    field: 'leadership',
    avatar: 'https://i.pravatar.cc/150?u=puja',
    programs: ['bootcamp-da', 'leadership-essentials', 'leadership-advanced'],
  },
  {
    id: 'm2',
    name: 'Rendy Faqot',
    title: 'Software Engineering',
    field: 'software-engineering',
    avatar: 'https://i.pravatar.cc/150?u=rendy',
    programs: ['se-bootcamp', 'se-system-design'],
  },
  {
    id: 'm3',
    name: 'Nadhira Ayuningtyas',
    title: 'Product Management',
    field: 'product-management',
    avatar: 'https://i.pravatar.cc/150?u=nadhira',
    programs: ['pm-fundamentals', 'pm-advanced'],
  },
  {
    id: 'm4',
    name: 'Hari Bagus Firdaus',
    title: 'Artificial Intelligence',
    field: 'artificial-intelligence',
    avatar: 'https://i.pravatar.cc/150?u=hari',
    programs: ['ai-bootcamp', 'ai-llm', 'kelas-ai'],
  },
  {
    id: 'm5',
    name: 'Dini Anggraini',
    title: 'Data Visualization',
    field: 'data-analytics',
    avatar: 'https://i.pravatar.cc/150?u=dini',
    programs: ['bootcamp-da', 'kelas-viz'],
  },
  {
    id: 'm6',
    name: 'Fajar Nugroho',
    title: 'SQL & Database',
    field: 'data-analytics',
    avatar: 'https://i.pravatar.cc/150?u=fajar',
    programs: ['kelas-sql', 'bootcamp-da'],
  },
  {
    id: 'm7',
    name: 'Alya Putri',
    title: 'Digital Marketing',
    field: 'digital-marketing',
    avatar: 'https://i.pravatar.cc/150?u=alya',
    programs: ['dm-fundamentals', 'dm-growth'],
  },
  {
    id: 'm8',
    name: 'Budi Santoso',
    title: 'Finance & Business Analytics',
    field: 'finance-business',
    avatar: 'https://i.pravatar.cc/150?u=budi',
    programs: ['finance-modeling', 'business-intelligence'],
  },
  {
    id: 'm9',
    name: 'Citra Maharani',
    title: 'UI/UX Design',
    field: 'ui-ux-design',
    avatar: 'https://i.pravatar.cc/150?u=citra',
    programs: ['ux-fundamentals', 'ux-advanced'],
  },
]

export const programs: Program[] = [
  {
    id: 'bootcamp-da',
    fieldId: 'data-analytics',
    name: 'Data Analytics Bootcamp',
    description:
      '12-week intensive program to become job-ready. Python, SQL, visualization, and real industry cases.',
    durationWeeks: 12,
    mentorId: 'm1',
    modules: [
      { id: 'mod1', title: 'Module 1: Python for Data' },
      { id: 'mod2', title: 'Module 2: SQL & Databases' },
      { id: 'mod3', title: 'Module 3: Pandas & EDA' },
      { id: 'mod4', title: 'Module 4: Data Cleaning & Wrangling' },
      { id: 'mod5', title: 'Module 5: Data Visualization' },
      { id: 'mod6', title: 'Module 6: Machine Learning Basics' },
    ],
  },
  {
    id: 'kelas-sql',
    fieldId: 'data-analytics',
    name: 'SQL for Data Analysts',
    description: 'Write SQL queries to extract, join, and analyze business data.',
    durationWeeks: 3,
    mentorId: 'm6',
    modules: [
      { id: 's1', title: 'SQL basics & filtering' },
      { id: 's2', title: 'JOINs & aggregation' },
      { id: 's3', title: 'Window functions & CTEs' },
    ],
  },
  {
    id: 'kelas-viz',
    fieldId: 'data-analytics',
    name: 'Data Visualization & Storytelling',
    description: 'Create clear charts and dashboards to communicate insights.',
    durationWeeks: 3,
    mentorId: 'm5',
    modules: [
      { id: 'v1', title: 'Matplotlib & Seaborn' },
      { id: 'v2', title: 'Dashboard fundamentals' },
      { id: 'v3', title: 'Presenting insights' },
    ],
  },
  {
    id: 'leadership-essentials',
    fieldId: 'leadership',
    name: 'Leadership Essentials',
    description: 'Core leadership skills for emerging tech leaders and team leads.',
    durationWeeks: 6,
    mentorId: 'm1',
    modules: [
      { id: 'le1', title: 'Leadership mindset' },
      { id: 'le2', title: 'Effective communication' },
      { id: 'le3', title: 'Team motivation' },
      { id: 'le4', title: 'Conflict resolution' },
    ],
  },
  {
    id: 'leadership-advanced',
    fieldId: 'leadership',
    name: 'Strategic Leadership',
    description: 'Strategic planning, organizational design, and scaling teams.',
    durationWeeks: 8,
    mentorId: 'm1',
    modules: [
      { id: 'la1', title: 'Vision & strategy' },
      { id: 'la2', title: 'OKRs & goal setting' },
      { id: 'la3', title: 'Change management' },
    ],
  },
  {
    id: 'se-bootcamp',
    fieldId: 'software-engineering',
    name: 'Software Engineering Bootcamp',
    description: 'Full-stack fundamentals from coding standards to deployment.',
    durationWeeks: 14,
    mentorId: 'm2',
    modules: [
      { id: 'se1', title: 'Programming fundamentals' },
      { id: 'se2', title: 'Web development' },
      { id: 'se3', title: 'APIs & databases' },
      { id: 'se4', title: 'Testing & CI/CD' },
      { id: 'se5', title: 'Code review practices' },
    ],
  },
  {
    id: 'se-system-design',
    fieldId: 'software-engineering',
    name: 'System Design Masterclass',
    description: 'Design scalable systems for high-traffic applications.',
    durationWeeks: 6,
    mentorId: 'm2',
    modules: [
      { id: 'sd1', title: 'Architecture patterns' },
      { id: 'sd2', title: 'Scalability & reliability' },
      { id: 'sd3', title: 'Case studies' },
    ],
  },
  {
    id: 'pm-fundamentals',
    fieldId: 'product-management',
    name: 'Product Management Fundamentals',
    description: 'Learn the product lifecycle from discovery to launch.',
    durationWeeks: 8,
    mentorId: 'm3',
    modules: [
      { id: 'pm1', title: 'Product discovery' },
      { id: 'pm2', title: 'User research' },
      { id: 'pm3', title: 'Roadmapping' },
      { id: 'pm4', title: 'Stakeholder management' },
    ],
  },
  {
    id: 'pm-advanced',
    fieldId: 'product-management',
    name: 'Advanced Product Strategy',
    description: 'Growth metrics, experimentation, and product-led growth.',
    durationWeeks: 6,
    mentorId: 'm3',
    modules: [
      { id: 'pa1', title: 'Metrics & KPIs' },
      { id: 'pa2', title: 'A/B testing' },
      { id: 'pa3', title: 'Go-to-market strategy' },
    ],
  },
  {
    id: 'ai-bootcamp',
    fieldId: 'artificial-intelligence',
    name: 'AI & Machine Learning Bootcamp',
    description: 'Build ML models and deploy AI solutions for real business problems.',
    durationWeeks: 10,
    mentorId: 'm4',
    modules: [
      { id: 'ai1', title: 'ML fundamentals' },
      { id: 'ai2', title: 'Supervised learning' },
      { id: 'ai3', title: 'Deep learning intro' },
      { id: 'ai4', title: 'Model deployment' },
    ],
  },
  {
    id: 'ai-llm',
    fieldId: 'artificial-intelligence',
    name: 'LLM Applications Workshop',
    description: 'Build applications with large language models and RAG pipelines.',
    durationWeeks: 4,
    mentorId: 'm4',
    modules: [
      { id: 'llm1', title: 'LLM concepts' },
      { id: 'llm2', title: 'Prompt engineering' },
      { id: 'llm3', title: 'RAG & agents' },
    ],
  },
  {
    id: 'kelas-ai',
    fieldId: 'artificial-intelligence',
    name: 'AI-Assisted Data Analysis (PandasAI)',
    description: 'Analyze data conversationally using PandasAI — a Sinaptik specialty.',
    durationWeeks: 2,
    mentorId: 'm4',
    modules: [
      { id: 'pai1', title: 'LLMs for data' },
      { id: 'pai2', title: 'PandasAI workflow' },
    ],
  },
  {
    id: 'dm-fundamentals',
    fieldId: 'digital-marketing',
    name: 'Digital Marketing Fundamentals',
    description: 'SEO basics, social media strategy, and content marketing for startups.',
    durationWeeks: 6,
    mentorId: 'm7',
    modules: [
      { id: 'dm1', title: 'Marketing funnel & personas' },
      { id: 'dm2', title: 'SEO & content strategy' },
      { id: 'dm3', title: 'Social media & community' },
      { id: 'dm4', title: 'Analytics & attribution' },
    ],
  },
  {
    id: 'dm-growth',
    fieldId: 'digital-marketing',
    name: 'Growth Marketing Masterclass',
    description: 'Paid acquisition, conversion optimization, and growth experiments.',
    durationWeeks: 5,
    mentorId: 'm7',
    modules: [
      { id: 'dg1', title: 'Paid ads (Meta & Google)' },
      { id: 'dg2', title: 'Landing page optimization' },
      { id: 'dg3', title: 'A/B testing campaigns' },
    ],
  },
  {
    id: 'finance-modeling',
    fieldId: 'finance-business',
    name: 'Financial Modeling for Analysts',
    description: 'Build Excel/Sheets models for forecasting, valuation, and scenario planning.',
    durationWeeks: 6,
    mentorId: 'm8',
    modules: [
      { id: 'fm1', title: 'Financial statements' },
      { id: 'fm2', title: 'Revenue forecasting' },
      { id: 'fm3', title: 'DCF & valuation basics' },
      { id: 'fm4', title: 'Scenario & sensitivity analysis' },
    ],
  },
  {
    id: 'business-intelligence',
    fieldId: 'finance-business',
    name: 'Business Intelligence & Reporting',
    description: 'Design KPI dashboards and executive reports for business stakeholders.',
    durationWeeks: 4,
    mentorId: 'm8',
    modules: [
      { id: 'bi1', title: 'KPI design' },
      { id: 'bi2', title: 'Dashboard storytelling' },
      { id: 'bi3', title: 'Stakeholder presentations' },
    ],
  },
  {
    id: 'ux-fundamentals',
    fieldId: 'ui-ux-design',
    name: 'UX Design Fundamentals',
    description: 'User research, wireframing, and usability testing for digital products.',
    durationWeeks: 8,
    mentorId: 'm9',
    modules: [
      { id: 'ux1', title: 'Design thinking' },
      { id: 'ux2', title: 'User research methods' },
      { id: 'ux3', title: 'Wireframing & prototyping' },
      { id: 'ux4', title: 'Usability testing' },
    ],
  },
  {
    id: 'ux-advanced',
    fieldId: 'ui-ux-design',
    name: 'Advanced UI Design Systems',
    description: 'Create scalable design systems, components, and handoff for engineering teams.',
    durationWeeks: 6,
    mentorId: 'm9',
    modules: [
      { id: 'ua1', title: 'Design tokens & components' },
      { id: 'ua2', title: 'Accessibility (WCAG)' },
      { id: 'ua3', title: 'Figma handoff & specs' },
    ],
  },
]

export const skillTests: SkillTest[] = [
  {
    id: 'test-da',
    fieldId: 'data-analytics',
    title: 'Data Analytics Placement Test',
    description: 'Assess your Python, SQL, and data wrangling fundamentals.',
    durationMinutes: 30,
    questionCount: 5,
    mentorId: 'm6',
    passingScore: 70,
  },
  {
    id: 'test-leadership',
    fieldId: 'leadership',
    title: 'Leadership Aptitude Assessment',
    description: 'Evaluate communication, decision-making, and team leadership skills.',
    durationMinutes: 25,
    questionCount: 5,
    mentorId: 'm1',
    passingScore: 65,
  },
  {
    id: 'test-se',
    fieldId: 'software-engineering',
    title: 'Software Engineering Skills Quiz',
    description: 'Test your knowledge of programming, APIs, and engineering practices.',
    durationMinutes: 35,
    questionCount: 5,
    mentorId: 'm2',
    passingScore: 70,
  },
  {
    id: 'test-pm',
    fieldId: 'product-management',
    title: 'Product Sense Assessment',
    description: 'Measure product thinking, prioritization, and user-centric design.',
    durationMinutes: 30,
    questionCount: 5,
    mentorId: 'm3',
    passingScore: 65,
  },
  {
    id: 'test-ai',
    fieldId: 'artificial-intelligence',
    title: 'AI Fundamentals Quiz',
    description: 'Assess understanding of ML concepts, LLMs, and AI ethics.',
    durationMinutes: 30,
    questionCount: 5,
    mentorId: 'm4',
    passingScore: 70,
  },
  {
    id: 'test-dm',
    fieldId: 'digital-marketing',
    title: 'Digital Marketing Readiness Test',
    description: 'Evaluate SEO, content strategy, and campaign analytics knowledge.',
    durationMinutes: 25,
    questionCount: 5,
    mentorId: 'm7',
    passingScore: 65,
  },
  {
    id: 'test-finance',
    fieldId: 'finance-business',
    title: 'Finance & BI Assessment',
    description: 'Test financial modeling, KPI design, and business reporting skills.',
    durationMinutes: 30,
    questionCount: 5,
    mentorId: 'm8',
    passingScore: 70,
  },
  {
    id: 'test-ux',
    fieldId: 'ui-ux-design',
    title: 'UX Design Aptitude Quiz',
    description: 'Measure user research, prototyping, and usability fundamentals.',
    durationMinutes: 25,
    questionCount: 5,
    mentorId: 'm9',
    passingScore: 65,
  },
]

export const bootcampProgram = programs[0]
export const bootcampModules = bootcampProgram.modules

export function getMentorById(id: string): Mentor | undefined {
  return mentors.find((m) => m.id === id)
}

export function getFieldById(id: FieldId): Field | undefined {
  return fields.find((f) => f.id === id)
}

export function getProgramsByField(fieldId: FieldId): Program[] {
  return programs.filter((p) => p.fieldId === fieldId)
}

export function getTestsByField(fieldId: FieldId): SkillTest[] {
  return skillTests.filter((t) => t.fieldId === fieldId)
}
