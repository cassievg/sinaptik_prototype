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
  enrollmentLabel: string
  programId: string
  assignedMentor: { id: string; avatar: string; name: string }
  moduleProgress: number
  totalModules: number
  lastActive: string
  avgScore: number
  engagementScore: number
  dropOffRisk: DropOffRisk
  skills: SkillProgress[]
  moduleHistory: LearnerModule[]
}

export type TaskType = 'SUBMISSION' | 'REVIEW_REQUEST'
export type TaskStatus = 'PENDING' | 'COMPLETED'

export interface MentorTask {
  id: string
  type: TaskType
  courseId: string
  courseName: string
  moduleTitle: string
  assignmentTitle: string
  learnerId: string
  learnerName: string
  submissionId?: string
  reviewRequestId?: string
  dueDate: string
  status: TaskStatus
  submittedAt?: string
}

export type NotificationType =
  | 'AI_ALERT'
  | 'MENTOR_REQUEST'
  | 'SUBMISSION'
  | 'SYSTEM'
  | 'CHAT'

export interface Notification {
  id: string
  type: NotificationType
  learnerId: string
  learnerName: string
  message: string
  date: string
  read: boolean
  requiresAction: boolean
  submissionId?: string
  reviewRequestId?: string
}

export interface NavBadges {
  dashboard: number
  tasks: number
  notifications: number
}

export interface ChatMessage {
  id: string
  senderId: string
  senderRole: 'MENTOR' | 'LEARNER'
  text: string
  timestamp: string
}

export interface ChatConversation {
  id: string
  learnerId: string
  learnerName: string
  courseLabel: string
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
  messages: ChatMessage[]
}

export interface ReviewRequest {
  id: string
  learnerId: string
  submissionId: string
  studentMessage: string
  status: 'OPEN' | 'RESOLVED'
  createdAt: string
  mentorScore?: number
  mentorFeedback?: string
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
  courseId: string
  moduleTitle: string
  assignmentTitle: string
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
  mentorCourseIds: string[]
  navBadges: NavBadges
  dashboardAnalytics: DashboardAnalytics
  learners: Learner[]
  submissions: Submission[]
  tasks: MentorTask[]
  notifications: Notification[]
  reviewRequests: ReviewRequest[]
  conversations: ChatConversation[]
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
