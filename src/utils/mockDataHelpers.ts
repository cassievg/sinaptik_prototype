import type {
  ChatConversation,
  Learner,
  MentorTask,
  Notification,
  NotificationType,
  Submission,
} from '../types'

/** Use cohort KPIs from mock (Figma: 52.4%, 45/100) — not derived from partial submissions. */
export function getMentorDashboardKpis(cohort: { completionRate: number; avgScore: number }) {
  return {
    completionRate: cohort.completionRate,
    averageScore: cohort.avgScore,
  }
}

export function getSubmissionById(
  submissions: Submission[],
  submissionId: string
): Submission | undefined {
  return submissions.find((s) => s.id === submissionId)
}

export function getSubmissionForLearner(
  submissions: Submission[],
  learnerId: string,
  submissionId?: string
): Submission | undefined {
  if (submissionId) return getSubmissionById(submissions, submissionId)
  return submissions.find((s) => s.learnerId === learnerId)
}

export function getTasksForDate(tasks: MentorTask[], isoDate: string): MentorTask[] {
  return tasks.filter((t) => t.dueDate === isoDate)
}

export function getCalendarTaskMarkers(tasks: MentorTask[]) {
  const dates = new Set(tasks.map((t) => t.dueDate))
  return Array.from(dates).sort()
}

/** Per-day calendar dot: green when all tasks done, red when any are still pending. */
export function getCalendarDayStatus(tasks: MentorTask[]) {
  const byDate = new Map<string, { pending: number }>()
  for (const task of tasks) {
    const entry = byDate.get(task.dueDate) ?? { pending: 0 }
    if (task.status === 'PENDING') entry.pending++
    byDate.set(task.dueDate, entry)
  }
  const result = new Map<string, 'complete' | 'pending'>()
  byDate.forEach((v, date) => {
    result.set(date, v.pending > 0 ? 'pending' : 'complete')
  })
  return result
}

export function groupTasksByCourse(tasks: MentorTask[]) {
  const map = new Map<string, { courseName: string; tasks: MentorTask[] }>()
  for (const task of tasks) {
    const existing = map.get(task.courseId)
    if (existing) {
      existing.tasks.push(task)
    } else {
      map.set(task.courseId, { courseName: task.courseName, tasks: [task] })
    }
  }
  return map
}

export function groupTasksByCourseModule(tasks: MentorTask[]) {
  const courses = groupTasksByCourse(tasks)
  const result: {
    courseId: string
    courseName: string
    modules: { moduleTitle: string; tasks: MentorTask[] }[]
  }[] = []

  courses.forEach((course, courseId) => {
    const moduleMap = new Map<string, MentorTask[]>()
    for (const task of course.tasks) {
      const list = moduleMap.get(task.moduleTitle) ?? []
      list.push(task)
      moduleMap.set(task.moduleTitle, list)
    }
    result.push({
      courseId,
      courseName: course.courseName,
      modules: Array.from(moduleMap.entries()).map(([moduleTitle, moduleTasks]) => ({
        moduleTitle,
        tasks: moduleTasks,
      })),
    })
  })

  return result
}

export function getPendingTaskCount(tasks: MentorTask[]): number {
  return tasks.filter((t) => t.status === 'PENDING').length
}

export function getUnreadNotificationCount(notifications: Notification[]): number {
  return notifications.filter((n) => !n.read).length
}

export function filterNotificationsByTab(
  notifications: Notification[],
  tab: 'ALL' | 'MENTOR_REQUEST' | 'ASSIGNMENT_SUBMISSION'
): Notification[] {
  if (tab === 'ALL') return notifications
  if (tab === 'MENTOR_REQUEST') {
    return notifications.filter((n) => n.type === 'MENTOR_REQUEST')
  }
  return notifications.filter((n) => n.type === 'SUBMISSION')
}

export function searchLearners(learners: Learner[], query: string): Learner[] {
  const q = query.trim().toLowerCase()
  if (!q) return learners
  return learners.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.currentModule.toLowerCase().includes(q) ||
      l.enrollmentLabel.toLowerCase().includes(q)
  )
}

export function buildChatLearnerList(
  conversations: ChatConversation[],
  learners: Learner[]
): { learnerId: string; name: string; courseLabel: string; lastMessage: string }[] {
  const fromConversations = conversations.map((c) => ({
    learnerId: c.learnerId,
    name: c.learnerName,
    courseLabel: c.courseLabel,
    lastMessage: c.lastMessage,
  }))

  const known = new Set(fromConversations.map((c) => c.learnerId))
  const extras = learners
    .filter((l) => !known.has(l.id))
    .map((l) => ({
      learnerId: l.id,
      name: l.name,
      courseLabel: l.enrollmentLabel,
      lastMessage: '',
    }))

  return [...fromConversations, ...extras]
}

export function getNotificationRoute(
  notification: Notification,
  type: NotificationType
): string {
  if (notification.reviewRequestId) {
    return `/mentor/review/${notification.reviewRequestId}`
  }
  if (notification.submissionId) {
    return `/mentor/marking/${notification.submissionId}`
  }
  if (type === 'CHAT') {
    return `/mentor/chat/${notification.learnerId}`
  }
  if (type === 'MENTOR_REQUEST') {
    return `/mentor/learner/${notification.learnerId}`
  }
  if (type === 'SUBMISSION' && notification.submissionId) {
    return `/mentor/marking/${notification.submissionId}`
  }
  return `/mentor/learner/${notification.learnerId}`
}

export function getTaskRoute(task: MentorTask): string {
  if (task.type === 'REVIEW_REQUEST' && task.reviewRequestId) {
    return `/mentor/review/${task.reviewRequestId}`
  }
  if (task.submissionId) {
    return `/mentor/marking/${task.submissionId}`
  }
  return `/mentor/learner/${task.learnerId}`
}
