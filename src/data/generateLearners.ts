import type { Learner, LearnerStatus, LearnerModule } from '../types'
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

function buildModuleHistory(
  moduleProgress: number,
  avgScore: number,
  rand: () => number
): LearnerModule[] {
  return bootcampModules.map((mod, i) => {
    if (i < moduleProgress) {
      // completed — score wobbles around the learner's average
      const variance = Math.round((rand() - 0.5) * 20)
      const score = Math.min(100, Math.max(35, avgScore + variance))
      return { id: mod.id, title: mod.title, status: 'COMPLETED', score }
    }
    if (i === moduleProgress && moduleProgress < bootcampModules.length) {
      return { id: mod.id, title: mod.title, status: 'IN_PROGRESS', score: null }
    }
    return { id: mod.id, title: mod.title, status: 'LOCKED', score: null }
  })
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
    const avgScore = Math.round(40 + rand() * 55)
    const clampedProgress = Math.min(moduleProgress, 6)

    learners.push({
      id,
      name,
      avatar: `https://i.pravatar.cc/150?u=${id}`,
      status,
      currentModule,
      moduleProgress: clampedProgress,
      totalModules: 6,
      lastActive,
      avgScore,
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
      moduleHistory: buildModuleHistory(clampedProgress, avgScore, rand),
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
    moduleHistory: [
      { id: bootcampModules[0].id, title: bootcampModules[0].title, status: 'COMPLETED', score: 78 },
      { id: bootcampModules[1].id, title: bootcampModules[1].title, status: 'COMPLETED', score: 61 },
      { id: bootcampModules[2].id, title: bootcampModules[2].title, status: 'COMPLETED', score: 55 },
      { id: bootcampModules[3].id, title: bootcampModules[3].title, status: 'IN_PROGRESS', score: null },
      { id: bootcampModules[4].id, title: bootcampModules[4].title, status: 'LOCKED', score: null },
      { id: bootcampModules[5].id, title: bootcampModules[5].title, status: 'LOCKED', score: null },
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
