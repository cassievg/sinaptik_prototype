import { useLanguage } from '../context/LanguageContext'

export type ReturnNavigationState = {
  returnTo?: string
  returnLabel?: string
}

export function tasksPathWithDate(date?: string): string {
  return date ? `/tasks?date=${date}` : '/tasks'
}

export function learnersPathWithPage(page?: number): string {
  if (!page || page <= 1) return '/learners'
  return `/learners?page=${page}`
}

export function buildTasksReturn(
  label: string,
  date?: string
): ReturnNavigationState {
  return {
    returnTo: tasksPathWithDate(date),
    returnLabel: label,
  }
}

export function buildLearnersReturn(
  label: string,
  page?: number
): ReturnNavigationState {
  return {
    returnTo: learnersPathWithPage(page),
    returnLabel: label,
  }
}

export function resolveBackNavigation(
  state: unknown,
  defaultTo: string,
  defaultLabel: string
) {
  const nav = state as ReturnNavigationState | null
  return {
    to: nav?.returnTo ?? defaultTo,
    label: nav?.returnLabel ?? defaultLabel,
  }
}

export function useReturnNavigation() {
  const { t } = useLanguage()
  return {
    tasksReturn: buildTasksReturn(t('back.tasks')),
    tasksReturnForDate: (date: string) => buildTasksReturn(t('back.tasks'), date),
    learnersReturn: (page?: number) => buildLearnersReturn(t('back.learners'), page),
    dashboardReturn: {
      returnTo: '/',
      returnLabel: t('back.dashboard'),
    },
    notificationsReturn: {
      returnTo: '/notifications',
      returnLabel: t('back.inbox'),
    },
    backToLearners: t('back.learners'),
    backToDashboard: t('back.dashboard'),
    backToLearner: (name: string) => t('back.learner', { name }),
  }
}
