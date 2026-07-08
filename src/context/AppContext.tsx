import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import rawData from '../data/mock_data.json'
import {
  generateLearners,
  computeStatusBreakdown,
  buildActivityLogs,
} from '../data/generateLearners'
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
  Submission,
  SubmissionMentorComment,
} from '../types'

interface AppState extends Omit<AppData, 'learners' | 'dashboardAnalytics'> {
  learners: Learner[]
  dashboardAnalytics: DashboardAnalytics
  learnerPendingReview: boolean
  learnerCompleted: boolean
  escalationReason: string
}

export interface MentorCourse {
  id: string
  name: string
  cohortName: string
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
  mentorCourses: MentorCourse[]
  selectedCourseId: string
  selectedCourse: MentorCourse
  setSelectedCourseId: (courseId: string) => void
  markNotificationRead: (notificationId: string) => void
  markConversationRead: (learnerId: string) => void
  toggleTaskStatus: (taskId: string) => void
  completeTaskBySubmission: (submissionId: string) => void
  completeTaskByReviewRequest: (reviewRequestId: string) => void
  saveSubmissionMentorGrading: (
    submissionId: string,
    grading: {
      mentorScore: number
      mentorScoreMax: number
      mentorFeedback: string
      mentorComments: SubmissionMentorComment[]
    }
  ) => void
  saveTestResult: (testId: string, score: number) => void
  getSubmission: (learnerId: string, submissionId?: string) => AppData['submissions'][0] | undefined
  getSubmissionById: (submissionId: string) => AppData['submissions'][0] | undefined
  updateLearnerStatus: (learnerId: string, status: LearnerStatus) => void
  submitMentorRequest: (reason: string) => void
  acceptFeedback: () => void
  resolveSubmission: (learnerId: string) => void
  resolveReviewRequest: (reviewRequestId: string, reviewResponse: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const initialLearners = generateLearners(rawData.cohort.totalLearners)

export function AppProvider({ children }: { children: ReactNode }) {
  const [learners, setLearners] = useState<Learner[]>(initialLearners)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() =>
    buildActivityLogs(initialLearners, rawData.activityLogs as ActivityLog[])
  )
  const [learnerPendingReview, setLearnerPendingReview] = useState(false)
  const [learnerCompleted, setLearnerCompleted] = useState(false)
  const [escalationReason, setEscalationReason] = useState('')
  const [testResults, setTestResults] = useState<Record<string, number>>({})
  const [notifications, setNotifications] = useState<Notification[]>(
    rawData.notifications as Notification[]
  )
  const [tasks, setTasks] = useState<MentorTask[]>(rawData.tasks as MentorTask[])
  const [submissions, setSubmissions] = useState<Submission[]>(
    rawData.submissions as Submission[]
  )
  const [reviewRequests, setReviewRequests] = useState<ReviewRequest[]>(
    rawData.reviewRequests as ReviewRequest[]
  )
  const [conversations, setConversations] = useState<ChatConversation[]>(
    rawData.conversations as ChatConversation[]
  )

  const mentorCourses = useMemo<MentorCourse[]>(() => {
    const ids = (rawData.mentorCourseIds as string[]) ?? [rawData.cohort.programId]
    return ids
      .map((id) => programs.find((p) => p.id === id))
      .filter((p): p is (typeof programs)[number] => Boolean(p))
      .map((p) => ({
        id: p.id,
        name: p.name,
        cohortName: p.activeCohortName ?? p.name,
      }))
  }, [])

  const [selectedCourseId, setSelectedCourseId] = useState<string>(rawData.cohort.programId)
  const selectedCourse =
    mentorCourses.find((c) => c.id === selectedCourseId) ?? mentorCourses[0]

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

  const markConversationRead = useCallback((learnerId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.learnerId === learnerId ? { ...c, unreadCount: 0 } : c))
    )
  }, [])

  const toggleTaskStatus = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' }
          : t
      )
    )
  }, [])

  const completeTaskBySubmission = useCallback((submissionId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.submissionId === submissionId ? { ...t, status: 'COMPLETED' } : t
      )
    )
  }, [])

  const completeTaskByReviewRequest = useCallback((reviewRequestId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.reviewRequestId === reviewRequestId ? { ...t, status: 'COMPLETED' } : t
      )
    )
  }, [])

  const saveSubmissionMentorGrading = useCallback(
    (
      submissionId: string,
      grading: {
        mentorScore: number
        mentorScoreMax: number
        mentorFeedback: string
        mentorComments: SubmissionMentorComment[]
      }
    ) => {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? {
                ...s,
                mentorScore: grading.mentorScore,
                mentorScoreMax: grading.mentorScoreMax,
                mentorFeedback: grading.mentorFeedback,
                mentorComments: grading.mentorComments,
                mentorMarkedAt: new Date().toISOString(),
              }
            : s
        )
      )
    },
    []
  )

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

  const resolveReviewRequest = useCallback(
    (reviewRequestId: string, reviewResponse: string) => {
      const request = reviewRequests.find((r) => r.id === reviewRequestId)
      if (!request) return

      setReviewRequests((prev) =>
        prev.map((r) =>
          r.id === reviewRequestId
            ? {
                ...r,
                status: 'RESOLVED' as const,
                reviewResponse,
              }
            : r
        )
      )
      resolveSubmission(request.learnerId)
      completeTaskByReviewRequest(reviewRequestId)
      setNotifications((prev) =>
        prev.map((n) =>
          n.reviewRequestId === reviewRequestId ? { ...n, read: true, requiresAction: false } : n
        )
      )
    },
    [reviewRequests, resolveSubmission, completeTaskByReviewRequest]
  )

  const data: AppState = {
    ...(rawData as AppData),
    submissions,
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
        tasks,
        notifications,
        conversations,
        reviewRequests,
        testResults,
        mentorCourses,
        selectedCourseId,
        selectedCourse,
        setSelectedCourseId,
        saveTestResult,
        markNotificationRead,
        markConversationRead,
        toggleTaskStatus,
        completeTaskBySubmission,
        completeTaskByReviewRequest,
        saveSubmissionMentorGrading,
        getSubmission,
        getSubmissionById,
        updateLearnerStatus,
        submitMentorRequest,
        acceptFeedback,
        resolveSubmission,
        resolveReviewRequest,
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
