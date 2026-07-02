export type LearnerStatus =
  | 'ON_TRACK'
  | 'PENDING_MENTOR'
  | 'AT_RISK'
  | 'STUCK'
  | 'COMPLETED'

export type BoardColumn = 'on_track' | 'needs_review' | 'stuck'

export type ActivityType = 'AI_ALERT' | 'MENTOR_REQUEST' | 'SUBMISSION' | 'SYSTEM'

export type DropOffRisk = 'None' | 'Low' | 'Medium' | 'High' | 'Critical'

export interface User {
  id: string
  name: string
  role: 'MENTOR' | 'LEARNER'
  avatar: string
}

export interface SkillProgress {
  name: string
  progress: number
}

export interface Learner {
  id: string
  name: string
  avatar: string
  status: LearnerStatus
  currentModule: string
  assignedMentor: { id: string; avatar: string; name: string }
  moduleProgress: number
  totalModules: number
  lastActive: string
  avgScore: number
  engagementScore: number
  dropOffRisk: DropOffRisk
  skills: SkillProgress[]
}

export interface ActivityLog {
  id: string
  learnerId: string
  type: ActivityType
  message: string
  timestamp: string
  requiresAction: boolean
}

export interface Submission {
  id: string
  learnerId: string
  moduleTitle: string
  content: string
  aiScore: number
  aiFeedback: string
  submittedAt: string
}

export interface Cohort {
  id: string
  name: string
  programId: string
  startDate: string
  totalModules: number
  totalLearners: number
  completionRate: number
  avgScore: number
  atRiskCount: number
  pendingReviewCount: number
  avgResponseTimeHours: number
  activeThisWeek: number
}

export interface DashboardAnalytics {
  weeklyEngagement: { day: string; submissions: number; logins: number }[]
  scoreDistribution: { range: string; count: number; label: string }[]
  moduleCompletion: { module: string; completed: number; total: number }[]
  skillAverages: { skill: string; avg: number }[]
  statusBreakdown: {
    on_track: number
    needs_review: number
    stuck: number
    completed: number
  }
}

export interface LearnerModule {
  id: string
  title: string
  status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED'
  score: number | null
}

export interface InContextComment {
  id: string
  text: string
  selectedText: string
  offsetTop: number
  mentions: string[]
}

export interface AppData {
  currentUser: User
  cohort: Cohort
  dashboardAnalytics: DashboardAnalytics
  learners: Learner[]
  submissions: Submission[]
  activityLogs: ActivityLog[]
  learnerSession: {
    currentUser: User
    programId: string
    modules: LearnerModule[]
    assignment: {
      title: string
      prompt: string
      submittedContent: string
    }
    aiEvaluation: {
      status: string
      score: number
      feedbackSummary: string
      detailedFeedback: string
    }
    assignedMentor: { id: string; name: string; avatar: string }
  }
}
