import type { TestQuestion } from './sinaptikCatalog'

export const testQuestions: TestQuestion[] = [
  // Data Analytics
  {
    id: 'da-q1',
    testId: 'test-da',
    question: 'Which pandas method is most appropriate for filling missing numeric values with the column median?',
    options: ['dropna()', 'fillna(df.median())', 'replace(0)', 'astype(float)'],
    correctIndex: 1,
  },
  {
    id: 'da-q2',
    testId: 'test-da',
    question: 'What does a LEFT JOIN return?',
    options: [
      'Only matching rows from both tables',
      'All rows from the left table and matching rows from the right',
      'All rows from both tables',
      'Only rows with null keys',
    ],
    correctIndex: 1,
  },
  {
    id: 'da-q3',
    testId: 'test-da',
    question: 'Which chart is best for comparing categories?',
    options: ['Line chart', 'Bar chart', 'Scatter plot', 'Histogram'],
    correctIndex: 1,
  },
  {
    id: 'da-q4',
    testId: 'test-da',
    question: 'What is the primary purpose of exploratory data analysis (EDA)?',
    options: [
      'Deploy models to production',
      'Understand data patterns before modeling',
      'Write SQL migrations',
      'Optimize server performance',
    ],
    correctIndex: 1,
  },
  {
    id: 'da-q5',
    testId: 'test-da',
    question: 'In Python, which library is most commonly used for data manipulation?',
    options: ['NumPy', 'Pandas', 'Matplotlib', 'Flask'],
    correctIndex: 1,
  },

  // Leadership
  {
    id: 'ld-q1',
    testId: 'test-leadership',
    question: 'What is the most effective first step when resolving team conflict?',
    options: [
      'Assign blame immediately',
      'Listen to all parties and clarify perspectives',
      'Ignore the conflict',
      'Reorganize the entire team',
    ],
    correctIndex: 1,
  },
  {
    id: 'ld-q2',
    testId: 'test-leadership',
    question: 'OKRs stand for:',
    options: [
      'Operational Key Results',
      'Objectives and Key Results',
      'Organizational Knowledge Reports',
      'Output KPI Records',
    ],
    correctIndex: 1,
  },
  {
    id: 'ld-q3',
    testId: 'test-leadership',
    question: 'Servant leadership primarily focuses on:',
    options: [
      'Maximizing personal authority',
      'Supporting and empowering team members',
      'Avoiding all decisions',
      'Micromanaging tasks',
    ],
    correctIndex: 1,
  },
  {
    id: 'ld-q4',
    testId: 'test-leadership',
    question: 'When delivering difficult feedback, you should:',
    options: [
      'Be specific, timely, and focus on behavior',
      'Wait until annual review only',
      'Discuss it publicly in meetings',
      'Use only written messages without context',
    ],
    correctIndex: 0,
  },
  {
    id: 'ld-q5',
    testId: 'test-leadership',
    question: 'Psychological safety in teams means:',
    options: [
      'No one is ever challenged',
      'Members feel safe to take risks and speak up',
      'Avoiding all conflict',
      'Working without deadlines',
    ],
    correctIndex: 1,
  },

  // Software Engineering
  {
    id: 'se-q1',
    testId: 'test-se',
    question: 'What does REST stand for in API design?',
    options: [
      'Remote Execution Standard Transfer',
      'Representational State Transfer',
      'Relational Entity Service Technology',
      'Runtime Event Stream Transport',
    ],
    correctIndex: 1,
  },
  {
    id: 'se-q2',
    testId: 'test-se',
    question: 'Unit tests are primarily used to:',
    options: [
      'Test the entire system end-to-end',
      'Verify individual functions or components in isolation',
      'Replace code reviews',
      'Deploy to production',
    ],
    correctIndex: 1,
  },
  {
    id: 'se-q3',
    testId: 'test-se',
    question: 'Which HTTP method is idempotent?',
    options: ['POST', 'PUT', 'PATCH with side effects', 'None of the above'],
    correctIndex: 1,
  },
  {
    id: 'se-q4',
    testId: 'test-se',
    question: 'Git branching best practice for features:',
    options: [
      'Commit directly to main',
      'Create a feature branch and merge via pull request',
      'Never use branches',
      'Delete main after each commit',
    ],
    correctIndex: 1,
  },
  {
    id: 'se-q5',
    testId: 'test-se',
    question: 'Load balancing helps with:',
    options: [
      'Distributing traffic across multiple servers',
      'Writing cleaner CSS',
      'Compiling TypeScript',
      'Database normalization only',
    ],
    correctIndex: 0,
  },

  // Product Management
  {
    id: 'pm-q1',
    testId: 'test-pm',
    question: 'An MVP (Minimum Viable Product) is:',
    options: [
      'A fully polished final product',
      'The smallest version to test core value with users',
      'A marketing campaign',
      'A technical architecture document',
    ],
    correctIndex: 1,
  },
  {
    id: 'pm-q2',
    testId: 'test-pm',
    question: 'Which framework helps prioritize features by impact vs effort?',
    options: ['SWOT', 'RICE / Impact-Effort matrix', 'PERT', 'FIFO'],
    correctIndex: 1,
  },
  {
    id: 'pm-q3',
    testId: 'test-pm',
    question: 'User stories typically follow the format:',
    options: [
      'As a [user], I want [goal], so that [benefit]',
      'Build feature X by Friday',
      'Revenue must increase 10%',
      'Deploy version 2.0',
    ],
    correctIndex: 0,
  },
  {
    id: 'pm-q4',
    testId: 'test-pm',
    question: 'A product roadmap should primarily communicate:',
    options: [
      'Daily task assignments only',
      'Strategic direction and planned outcomes over time',
      'Employee salaries',
      'Server configurations',
    ],
    correctIndex: 1,
  },
  {
    id: 'pm-q5',
    testId: 'test-pm',
    question: 'North Star Metric refers to:',
    options: [
      'A single key metric aligned with product value',
      'The CEO\'s favorite KPI',
      'Number of meetings held',
      'Lines of code written',
    ],
    correctIndex: 0,
  },

  // Artificial Intelligence
  {
    id: 'ai-q1',
    testId: 'test-ai',
    question: 'Supervised learning requires:',
    options: [
      'Labeled training data',
      'No data at all',
      'Only unlabeled data',
      'Manual rule writing only',
    ],
    correctIndex: 0,
  },
  {
    id: 'ai-q2',
    testId: 'test-ai',
    question: 'Overfitting occurs when a model:',
    options: [
      'Performs well on training data but poorly on new data',
      'Never learns patterns',
      'Has too few parameters',
      'Uses too little training data intentionally',
    ],
    correctIndex: 0,
  },
  {
    id: 'ai-q3',
    testId: 'test-ai',
    question: 'RAG (Retrieval-Augmented Generation) combines:',
    options: [
      'LLMs with external knowledge retrieval',
      'Only image generation',
      'Hardware optimization',
      'Database indexing only',
    ],
    correctIndex: 0,
  },
  {
    id: 'ai-q4',
    testId: 'test-ai',
    question: 'Which is a key AI ethics concern?',
    options: [
      'Bias and fairness in model outputs',
      'Using more RAM',
      'Longer variable names',
      'Choosing a code editor',
    ],
    correctIndex: 0,
  },
  {
    id: 'ai-q5',
    testId: 'test-ai',
    question: 'PandasAI enables users to:',
    options: [
      'Query and analyze data using natural language',
      'Replace all databases',
      'Compile C++ code',
      'Design hardware chips',
    ],
    correctIndex: 0,
  },

  // Digital Marketing
  {
    id: 'dm-q1',
    testId: 'test-dm',
    question: 'What does SEO primarily aim to improve?',
    options: [
      'Organic search visibility and traffic',
      'Server uptime',
      'Employee retention',
      'Inventory management',
    ],
    correctIndex: 0,
  },
  {
    id: 'dm-q2',
    testId: 'test-dm',
    question: 'A marketing funnel typically moves users from:',
    options: [
      'Awareness → consideration → conversion',
      'Purchase → awareness only',
      'Support → billing',
      'Design → deployment',
    ],
    correctIndex: 0,
  },
  {
    id: 'dm-q3',
    testId: 'test-dm',
    question: 'CTR (Click-Through Rate) is calculated as:',
    options: [
      'Clicks ÷ impressions',
      'Revenue ÷ cost',
      'Sessions ÷ users',
      'Bounce rate × 100',
    ],
    correctIndex: 0,
  },
  {
    id: 'dm-q4',
    testId: 'test-dm',
    question: 'A/B testing in marketing is used to:',
    options: [
      'Compare two variants to see which performs better',
      'Block all bot traffic',
      'Write legal contracts',
      'Replace analytics tools',
    ],
    correctIndex: 0,
  },
  {
    id: 'dm-q5',
    testId: 'test-dm',
    question: 'Content marketing focuses on:',
    options: [
      'Providing valuable content to attract and retain an audience',
      'Sending spam emails only',
      'Hiding product pricing',
      'Disabling social media',
    ],
    correctIndex: 0,
  },

  // Finance & Business
  {
    id: 'fin-q1',
    testId: 'test-finance',
    question: 'EBITDA roughly measures:',
    options: [
      'Operating profitability before interest, taxes, depreciation, and amortization',
      'Total employee count',
      'Website traffic',
      'Customer satisfaction only',
    ],
    correctIndex: 0,
  },
  {
    id: 'fin-q2',
    testId: 'test-finance',
    question: 'A DCF valuation estimates value based on:',
    options: [
      'Projected future cash flows discounted to present value',
      'Number of social followers',
      'Office square footage',
      'Lines of code',
    ],
    correctIndex: 0,
  },
  {
    id: 'fin-q3',
    testId: 'test-finance',
    question: 'Which financial statement shows assets, liabilities, and equity?',
    options: ['Income statement', 'Balance sheet', 'Cash flow statement', 'Cap table'],
    correctIndex: 1,
  },
  {
    id: 'fin-q4',
    testId: 'test-finance',
    question: 'A KPI dashboard should:',
    options: [
      'Highlight metrics aligned to business goals',
      'Display every possible metric without context',
      'Replace financial audits',
      'Hide negative trends',
    ],
    correctIndex: 0,
  },
  {
    id: 'fin-q5',
    testId: 'test-finance',
    question: 'Sensitivity analysis helps you understand:',
    options: [
      'How changes in assumptions affect model outcomes',
      'How to design mobile apps',
      'Server load balancing',
      'Git merge conflicts',
    ],
    correctIndex: 0,
  },

  // UI/UX Design
  {
    id: 'ux-q1',
    testId: 'test-ux',
    question: 'User personas are used to:',
    options: [
      'Represent target user types and guide design decisions',
      'Replace usability testing',
      'Store database passwords',
      'Measure server latency',
    ],
    correctIndex: 0,
  },
  {
    id: 'ux-q2',
    testId: 'test-ux',
    question: 'A wireframe is:',
    options: [
      'A low-fidelity layout showing structure without final visuals',
      'A production-ready coded page',
      'A marketing email template',
      'A financial forecast',
    ],
    correctIndex: 0,
  },
  {
    id: 'ux-q3',
    testId: 'test-ux',
    question: 'Usability testing should ideally:',
    options: [
      'Observe real users completing realistic tasks',
      'Only ask designers for opinions',
      'Skip users and rely on assumptions',
      'Run once after launch only',
    ],
    correctIndex: 0,
  },
  {
    id: 'ux-q4',
    testId: 'test-ux',
    question: 'WCAG guidelines relate to:',
    options: [
      'Web accessibility for people with disabilities',
      'Wireless network security',
      'Warehouse management',
      'Water quality standards',
    ],
    correctIndex: 0,
  },
  {
    id: 'ux-q5',
    testId: 'test-ux',
    question: 'A design system provides:',
    options: [
      'Reusable components, patterns, and standards for consistent UI',
      'A replacement for user research',
      'Only color palettes with no components',
      'Server deployment scripts',
    ],
    correctIndex: 0,
  },
]

export function getQuestionsForTest(testId: string): TestQuestion[] {
  return testQuestions.filter((q) => q.testId === testId)
}
