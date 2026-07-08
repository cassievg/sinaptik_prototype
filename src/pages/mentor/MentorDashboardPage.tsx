import { type ReactNode, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import {
  groupLearnersByColumn,
  getMentorLearners,
  formatRelativeTime,
} from '../../utils/dashboard'
import { getMentorDashboardKpis, getTaskRoute } from '../../utils/mockDataHelpers'
import { useReturnNavigation } from '../../utils/taskNavigation'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import PageTitleWithIcon from '../../components/PageTitleWithIcon'
import type { Learner, MentorTask } from '../../types'

const PREVIEW_LIMIT = 5

function pendingTasksSorted(tasks: MentorTask[]) {
  return [...tasks]
    .filter((t) => t.status === 'PENDING')
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
}

export default function MentorDashboardPage() {
  const { data, tasks } = useApp()
  const { t } = useLanguage()
  const { tasksReturn } = useReturnNavigation()
  const { cohort, learners, currentUser } = data
  const kpis = getMentorDashboardKpis(cohort)

  const myLearners = getMentorLearners(learners, currentUser.id)
  const grouped = groupLearnersByColumn(myLearners)
  const pendingWork = useMemo(() => pendingTasksSorted(tasks), [tasks])
  const workPreview = pendingWork.slice(0, PREVIEW_LIMIT)
  const followUpPreview = grouped.stuck.slice(0, PREVIEW_LIMIT)
  const greetingKey = new Date().getHours() < 12 ? 'dashboard.greetingMorning' : 'dashboard.greetingAfternoon'

  return (
    <div>
      <PageTitleWithIcon
        title={t(greetingKey, { name: currentUser.name.split(' ')[0] })}
        icon="dashboard"
      />
      <p className="page-subtitle">{cohort.name}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard label={t('dashboard.yourLearners')} value={myLearners.length} />
        <StatCard label={t('dashboard.cohortCompletion')} value={kpis.completionRate} suffix="%" />
        <StatCard label={t('dashboard.averageScore')} value={kpis.averageScore} suffix="/100" />
      </div>

      <section className="mt-10">
        <h2 className="section-title">{t('dashboard.whoNeedsYou')}</h2>
        <p className="mt-2 max-w-2xl text-sm text-stone-600">
          {t('dashboard.previewPrefix')}
          <Link to="/tasks" className="text-accent hover:underline">{t('nav.tasks')}</Link>
          {t('dashboard.previewJoin')}
          <Link to="/learners" className="text-accent hover:underline">{t('nav.learners')}</Link>
          {t('dashboard.previewSuffix')}
        </p>

        <div className="mt-6 space-y-6">
          <ActionPanel
            kind="work"
            title={t('dashboard.workQueue')}
            subtitle={t('dashboard.workQueueDesc')}
            count={pendingWork.length}
            previewCount={workPreview.length}
            viewAllTo="/tasks"
            viewAllLabel={t('dashboard.openTasks')}
            emptyText={t('dashboard.noTasks')}
            moreLinkLabel={t('dashboard.openTasksLink')}
            t={t}
          >
            {workPreview.map((task) => (
              <WorkRow
                key={task.id}
                task={task}
                learner={myLearners.find((l) => l.id === task.learnerId)}
                tasksReturn={tasksReturn}
                t={t}
              />
            ))}
          </ActionPanel>

          <ActionPanel
            kind="followup"
            title={t('dashboard.followUp')}
            subtitle={t('dashboard.followUpDesc')}
            count={grouped.stuck.length}
            previewCount={followUpPreview.length}
            viewAllTo="/learners?board=stuck"
            viewAllLabel={t('dashboard.allAtRisk')}
            emptyText={t('dashboard.noFollowUp')}
            moreLinkLabel={t('dashboard.allAtRisk')}
            t={t}
          >
            {followUpPreview.map((learner) => (
              <FollowUpRow key={learner.id} learner={learner} t={t} />
            ))}
          </ActionPanel>
        </div>
      </section>
    </div>
  )
}

function ActionPanel({
  kind,
  title,
  subtitle,
  count,
  previewCount,
  viewAllTo,
  viewAllLabel,
  emptyText,
  moreLinkLabel,
  t,
  children,
}: {
  kind: 'work' | 'followup'
  title: string
  subtitle: string
  count: number
  previewCount: number
  viewAllTo: string
  viewAllLabel: string
  emptyText: string
  moreLinkLabel: string
  t: (key: string, params?: Record<string, string | number>) => string
  children: ReactNode
}) {
  const border =
    kind === 'work' ? 'border-l-amber-400 bg-amber-50/40' : 'border-l-red-400 bg-red-50/40'
  const overflow = count - previewCount

  return (
    <div className={`rounded-lg border border-stone-200 border-l-4 ${border}`}>
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-stone-200/80 px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-stone-900">{title}</h3>
            <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-stone-600 ring-1 ring-stone-200">
              {count}
            </span>
          </div>
          <p className="mt-1 text-xs text-stone-600">{subtitle}</p>
        </div>
        {count > 0 && (
          <Link to={viewAllTo} className="shrink-0 text-xs text-accent hover:underline">
            {viewAllLabel} →
          </Link>
        )}
      </div>
      <div className="divide-y divide-stone-200/80">
        {count === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-stone-400">{emptyText}</p>
        ) : (
          children
        )}
      </div>
      {overflow > 0 && (
        <p className="border-t border-stone-200/80 px-4 py-2 text-center text-xs text-stone-500">
          {t('dashboard.moreInTasks', { count: overflow })}
          <Link to={viewAllTo} className="text-accent hover:underline">
            {moreLinkLabel.toLowerCase()}
          </Link>
        </p>
      )}
    </div>
  )
}

function WorkRow({
  task,
  learner,
  tasksReturn,
  t,
}: {
  task: MentorTask
  learner?: Learner
  tasksReturn: { returnTo: string; returnLabel: string }
  t: (key: string) => string
}) {
  const isReview = task.type === 'REVIEW_REQUEST'
  const to = getTaskRoute(task)
  const cta = isReview ? t('dashboard.review') : t('dashboard.mark')

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={learner ? `/learners/${learner.id}` : '#'}
            className="font-medium text-stone-900 hover:underline"
          >
            {task.learnerName}
          </Link>
          <span
            className={`inline-flex border px-2 py-0.5 text-xs font-medium ${
              isReview
                ? 'border-amber-400 bg-amber-100 text-amber-950'
                : 'border-stone-400 bg-stone-100 text-stone-800'
            }`}
          >
            {isReview ? t('dashboard.reviewRequest') : t('dashboard.newSubmission')}
          </span>
        </div>
        <p className="mt-1 text-xs text-stone-600">
          {task.assignmentTitle} · {task.moduleTitle}
        </p>
      </div>
      <Link
        to={to}
        state={tasksReturn}
        className="shrink-0 rounded border border-amber-500 bg-white px-3 py-1.5 text-xs font-medium text-amber-900 hover:bg-amber-50"
      >
        {cta}
      </Link>
    </div>
  )
}

function FollowUpRow({
  learner,
  t,
}: {
  learner: Learner
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/learners/${learner.id}`}
            className="font-medium text-stone-900 hover:underline"
          >
            {learner.name}
          </Link>
          <StatusBadge status={learner.status} />
        </div>
        <p className="mt-1 text-xs text-stone-600">
          {learner.currentModule} · {t('dashboard.risk')} {learner.dropOffRisk} ·{' '}
          {formatRelativeTime(learner.lastActive, t)}
        </p>
      </div>
      <Link
        to={`/chat/${learner.id}`}
        className="shrink-0 rounded border border-red-400 bg-white px-3 py-1.5 text-xs font-medium text-red-900 hover:bg-red-50"
      >
        {t('dashboard.message')}
      </Link>
    </div>
  )
}
