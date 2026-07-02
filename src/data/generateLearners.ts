import type { Learner, LearnerStatus } from '../types'
import { bootcampModules, mentors } from './sinaptikCatalog'

const FIRST_NAMES = [
  'Sari', 'Budi', 'Ayu', 'Rizky', 'Dewi', 'Andi', 'Putri', 'Hendra', 'Nina', 'Agus',
  'Maya', 'Rafi', 'Lestari', 'Dimas', 'Fitri', 'Bayu', 'Rina', 'Adit', 'Wulan', 'Eko',
  'Citra', 'Yoga', 'Intan', 'Gilang', 'Kartika', 'Reza', 'Melati', 'Fauzan', 'Sinta', 'Hadi',
]

const LAST_NAMES = [
  'Dewi', 'Santoso', 'Wijaya', 'Pratama', 'Lestari', 'Nugroho', 'Saputra', 'Hartono',
  'Kusuma', 'Permana', 'Siregar', 'Halim', 'Utami', 'Gunawan', 'Rahayu',
]

const STATUSES: LearnerStatus[] = [
  'ON_TRACK', 'ON_TRACK', 'ON_TRACK', 'ON_TRACK', 'ON_TRACK',
  'PENDING_MENTOR', 'PENDING_MENTOR',
  'AT_RISK', 'STUCK',
  'COMPLETED',
]

const RISKS = ['Low', 'Low', 'Medium', 'High', 'Critical', 'None'] as const

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)]
}

export function generateLearners(count = 186): Learner[] {
  const rand = seededRandom(42)
  const learners: Learner[] = []

  for (let i = 0; i < count; i++) {
    const id = `l${i + 1}`
    const firstName = pick(FIRST_NAMES, rand)
    const lastName = pick(LAST_NAMES, rand)
    const name = i === 0 ? 'Sari Dewi' : `${firstName} ${lastName}`
    const mentor = mentors[i % mentors.length]
    const moduleProgress = Math.floor(rand() * 7)
    const status = moduleProgress >= 6 ? 'COMPLETED' : pick(STATUSES, rand)
    const modIdx = Math.min(moduleProgress, bootcampModules.length - 1)
    const currentModule =
      moduleProgress >= 6
        ? 'Program complete'
        : bootcampModules[modIdx]?.title ?? bootcampModules[0].title

    const daysAgo = Math.floor(rand() * 14)
    const lastActive = new Date(Date.now() - daysAgo * 86400000).toISOString()

    learners.push({
      id,
      name,
      avatar: `https://i.pravatar.cc/150?u=${id}`,
      status,
      currentModule,
      moduleProgress: Math.min(moduleProgress, 6),
      totalModules: 6,
      lastActive,
      avgScore: Math.round(40 + rand() * 55),
      engagementScore: Math.round(30 + rand() * 65),
      dropOffRisk: pick([...RISKS], rand),
      assignedMentor: {
        id: mentor.id,
        name: mentor.name,
        avatar: mentor.avatar,
      },
      skills: [
        { name: 'Python & Pandas', progress: Math.round(30 + rand() * 65) },
        { name: 'SQL', progress: Math.round(25 + rand() * 70) },
        { name: 'Data Wrangling', progress: Math.round(20 + rand() * 75) },
        { name: 'Leadership', progress: Math.round(15 + rand() * 70) },
        { name: 'Software Engineering', progress: Math.round(10 + rand() * 65) },
      ],
    })
  }

  learners[0] = {
    ...learners[0],
    id: 'l1',
    name: 'Sari Dewi',
    status: 'PENDING_MENTOR',
    currentModule: 'Module 4: Data Cleaning & Wrangling',
    moduleProgress: 3,
    avgScore: 52,
    engagementScore: 68,
    dropOffRisk: 'High',
    assignedMentor: {
      id: 'm1',
      name: 'Puja Pramudya',
      avatar: mentors[0].avatar,
    },
    skills: [
      { name: 'Python & Pandas', progress: 72 },
      { name: 'SQL', progress: 55 },
      { name: 'Data Wrangling', progress: 45 },
      { name: 'Data Visualization', progress: 38 },
      { name: 'Machine Learning', progress: 32 },
    ],
  }

  return learners
}

export function computeStatusBreakdown(learners: Learner[]) {
  return {
    on_track: learners.filter((l) => l.status === 'ON_TRACK').length,
    needs_review: learners.filter((l) => l.status === 'PENDING_MENTOR').length,
    stuck: learners.filter((l) => l.status === 'STUCK' || l.status === 'AT_RISK').length,
    completed: learners.filter((l) => l.status === 'COMPLETED').length,
  }
}
