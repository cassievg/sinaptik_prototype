import type { ActivityLog, BoardColumn, Learner, LearnerStatus, Submission } from '../types'

export function categorizeLearner(status: LearnerStatus): BoardColumn {
  if (status === 'PENDING_MENTOR') return 'needs_review'
  if (status === 'STUCK' || status === 'AT_RISK') return 'stuck'
  return 'on_track'
}

export function groupLearnersByColumn(learners: Learner[]) {
  return {
    on_track: learners.filter((l) => categorizeLearner(l.status) === 'on_track'),
    needs_review: learners.filter((l) => categorizeLearner(l.status) === 'needs_review'),
    stuck: learners.filter((l) => categorizeLearner(l.status) === 'stuck'),
  }
}

export function calcCompletionRate(learners: Learner[]): number {
  if (learners.length === 0) return 0
  const total = learners.reduce((sum, l) => {
    const progress = l.moduleProgress / l.totalModules
    return sum + progress * 100
  }, 0)
  return Math.round((total / learners.length) * 10) / 10
}

export function calcAvgScore(submissions: Submission[]): number {
  if (submissions.length === 0) return 0
  const sum = submissions.reduce((a, s) => a + s.aiScore, 0)
  return Math.round(sum / submissions.length)
}

export function calcAtRiskCount(learners: Learner[]): number {
  return learners.filter((l) => l.status === 'AT_RISK' || l.status === 'STUCK').length
}

export function calcPendingReviewCount(learners: Learner[]): number {
  return learners.filter((l) => l.status === 'PENDING_MENTOR').length
}

export function getStatusLabel(status: LearnerStatus): string {
  const labels: Record<LearnerStatus, string> = {
    ON_TRACK: 'On Track',
    PENDING_MENTOR: 'Pending Mentor',
    AT_RISK: 'At Risk',
    STUCK: 'Stuck',
    COMPLETED: 'Completed',
  }
  return labels[status]
}

export function getStatusColor(status: LearnerStatus): string {
  const colors: Record<LearnerStatus, string> = {
    ON_TRACK: 'bg-stone-100 text-stone-800 border-stone-400',
    PENDING_MENTOR: 'bg-stone-100 text-stone-800 border-stone-500',
    AT_RISK: 'bg-stone-100 text-stone-800 border-stone-600',
    STUCK: 'bg-stone-100 text-stone-900 border-stone-700',
    COMPLETED: 'bg-stone-100 text-stone-800 border-accent',
  }
  return colors[status]
}

export function getRiskColor(_risk: string): string {
  return 'text-stone-600'
}

export function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function getActivityLabel(type: ActivityLog['type']): string {
  switch (type) {
    case 'AI_ALERT':
      return 'Alert'
    case 'MENTOR_REQUEST':
      return 'Request'
    case 'SUBMISSION':
      return 'Submit'
    default:
      return 'System'
  }
}

export function isSystemAlert(type: ActivityLog['type']): boolean {
  return type === 'AI_ALERT' || type === 'SYSTEM'
}

export function getMentorLearners(learners: Learner[], mentorId: string): Learner[] {
  return learners.filter((l) => l.assignedMentor.id === mentorId)
}
