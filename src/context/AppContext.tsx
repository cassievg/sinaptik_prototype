import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import rawData from '../../mock_data.json'
import { generateLearners, computeStatusBreakdown } from '../data/generateLearners'
import { mentors, programs, fields, skillTests } from '../data/sinaptikCatalog'
import type {
  AppData,
  Learner,
  LearnerStatus,
  ActivityLog,
  DashboardAnalytics,
  MentorTask,
  Notification,
  ChatConversation,
  ReviewRequest,
} from '../types'

interface AppState extends Omit<AppData, 'learners' | 'dashboardAnalytics'> {
  learners: Learner[]
  dashboardAnalytics: DashboardAnalytics
  learnerPendingReview: boolean
  learnerCompleted: boolean
  escalationReason: string
}

interface AppContextValue {
  data: AppState
  mentors: typeof mentors
  programs: typeof programs
  fields: typeof fields
  skillTests: typeof skillTests
  tasks: MentorTask[]
  notifications: Notification[]
  conversations: ChatConversation[]
  reviewRequests: ReviewRequest[]
  testResults: Record<string, number>
  markNotificationRead: (notificationId: string) => void
  saveTestResult: (testId: string, score: number) => void
  getSubmission: (learnerId: string, submissionId?: string) => AppData['submissions'][0] | undefined
  getSubmissionById: (submissionId: string) => AppData['submissions'][0] | undefined
  updateLearnerStatus: (learnerId: string, status: LearnerStatus) => void
  submitMentorRequest: (reason: string) => void
  acceptFeedback: () => void
  resolveSubmission: (learnerId: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const initialLearners = generateLearners(rawData.cohort.totalLearners)

export function AppProvider({ children }: { children: ReactNode }) {
  const [learners, setLearners] = useState<Learner[]>(initialLearners)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(
    rawData.activityLogs as ActivityLog[]
  )
  const [learnerPendingReview, setLearnerPendingReview] = useState(false)
  const [learnerCompleted, setLearnerCompleted] = useState(false)
  const [escalationReason, setEscalationReason] = useState('')
  const [testResults, setTestResults] = useState<Record<string, number>>({})
  const [notifications, setNotifications] = useState<Notification[]>(
    rawData.notifications as Notification[]
  )

  const dashboardAnalytics = useMemo(
    (): DashboardAnalytics => ({
      ...rawData.dashboardAnalytics,
      statusBreakdown: computeStatusBreakdown(learners),
    }),
    [learners]
  )

  const saveTestResult = useCallback((testId: string, score: number) => {
    setTestResults((prev) => ({ ...prev, [testId]: score }))
  }, [])

  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    )
  }, [])

  const submissions = rawData.submissions as AppData['submissions']

  const getSubmissionById = useCallback(
    (submissionId: string) => submissions.find((s) => s.id === submissionId),
    [submissions]
  )

  const getSubmission = useCallback(
    (learnerId: string, submissionId?: string) => {
      if (submissionId) return getSubmissionById(submissionId)
      return submissions.find((s) => s.learnerId === learnerId)
    },
    [submissions, getSubmissionById]
  )

  const updateLearnerStatus = useCallback((learnerId: string, status: LearnerStatus) => {
    setLearners((prev) => prev.map((l) => (l.id === learnerId ? { ...l, status } : l)))
  }, [])

  const submitMentorRequest = useCallback(
    (reason: string) => {
      setEscalationReason(reason)
      setLearnerPendingReview(true)
      updateLearnerStatus('l1', 'PENDING_MENTOR')
      setActivityLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          learnerId: 'l1',
          type: 'MENTOR_REQUEST',
          message: `Sari Dewi requested mentor review: "${reason}"`,
          timestamp: new Date().toISOString(),
          requiresAction: true,
        },
        ...prev,
      ])
    },
    [updateLearnerStatus]
  )

  const acceptFeedback = useCallback(() => {
    setLearnerCompleted(true)
    updateLearnerStatus('l1', 'COMPLETED')
  }, [updateLearnerStatus])

  const resolveSubmission = useCallback(
    (learnerId: string) => {
      updateLearnerStatus(learnerId, 'ON_TRACK')
      setActivityLogs((prev) =>
        prev.map((log) =>
          log.learnerId === learnerId && log.requiresAction
            ? { ...log, requiresAction: false }
            : log
        )
      )
    },
    [updateLearnerStatus]
  )

  const data: AppState = {
    ...(rawData as AppData),
    learners,
    activityLogs,
    dashboardAnalytics,
    learnerPendingReview,
    learnerCompleted,
    escalationReason,
  }

  return (
    <AppContext.Provider
      value={{
        data,
        mentors,
        programs,
        fields,
        skillTests,
        tasks: rawData.tasks as MentorTask[],
        notifications,
        conversations: rawData.conversations as ChatConversation[],
        reviewRequests: rawData.reviewRequests as ReviewRequest[],
        testResults,
        saveTestResult,
        markNotificationRead,
        getSubmission,
        getSubmissionById,
        updateLearnerStatus,
        submitMentorRequest,
        acceptFeedback,
        resolveSubmission,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
