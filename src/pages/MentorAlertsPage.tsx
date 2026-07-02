import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatTimestamp, getActivityLabel, isSystemAlert } from '../utils/dashboard'
import type { ActivityLog, ActivityType } from '../types'

function sortByPriority(logs: ActivityLog[]): ActivityLog[] {
  const typePriority = (type: ActivityType) => {
    if (type === 'AI_ALERT') return 1
    if (type === 'MENTOR_REQUEST') return 2
    if (type === 'SUBMISSION') return 3
    return 4
  }

  return [...logs].sort((a, b) => {
    if (a.requiresAction !== b.requiresAction) return a.requiresAction ? -1 : 1
    const typeDiff = typePriority(a.type) - typePriority(b.type)
    if (typeDiff !== 0) return typeDiff
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
}

export default function MentorAlertsPage() {
  const { data } = useApp()
  const { activityLogs, learners } = data

  const actionItems = useMemo(
    () => sortByPriority(activityLogs.filter((l) => l.requiresAction)),
    [activityLogs]
  )

  const alerts = useMemo(
    () => sortByPriority(activityLogs.filter((l) => l.type === 'AI_ALERT')),
    [activityLogs]
  )

  const allActivity = useMemo(() => sortByPriority(activityLogs), [activityLogs])

  return (
    <div>
      <h1 className="page-title">Alerts and actions</h1>
      <p className="page-subtitle">{actionItems.length} items require attention</p>

      {actionItems.length > 0 && (
        <section className="mt-8">
          <div className="rounded-lg border-2 border-amber-300 bg-amber-50/30 p-5">
            <div className="section-heading border-amber-300">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="section-title text-amber-950">Action required</h2>
                <span className="rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                  {actionItems.length}
                </span>
              </div>
              <p className="mt-1 text-sm text-amber-900/80">
                These items need your review before learners can continue
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {actionItems.map((log) => {
                const learner = learners.find((l) => l.id === log.learnerId)
                return (
                  <div
                    key={log.id}
                    className="relative flex items-center justify-between gap-4 rounded-lg border border-amber-300 bg-white p-4 shadow-sm"
                  >
                    <span
                      className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-amber-500"
                      aria-hidden
                    />
                    <div className="pl-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1.5 rounded-full border border-amber-400 bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                          <span className="inline-block h-2 w-2 rounded-full bg-amber-600" />
                          Action needed
                        </span>
                        <span className="text-xs uppercase text-amber-800/70">
                          {getActivityLabel(log.type)}
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-stone-900">{learner?.name}</p>
                      <p className="text-sm text-stone-600">{log.message}</p>
                      <p className="text-xs text-stone-400">{formatTimestamp(log.timestamp)}</p>
                    </div>
                    <Link
                      to={`/mentor/feedback/${log.learnerId}`}
                      className="btn-primary shrink-0 rounded-md text-sm"
                    >
                      Review
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="card border-stone-300 p-5">
          <div className="section-heading">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="section-title">AI alerts</h2>
              <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-medium text-stone-700">
                {alerts.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-500">
              Automated insights flagged by the AI coaching system
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {alerts.map((log) => {
              const learner = learners.find((l) => l.id === log.learnerId)
              const needsAttention = log.requiresAction
              return (
                <div
                  key={log.id}
                  className={`rounded-lg border p-4 ${
                    needsAttention
                      ? 'border-amber-300 bg-amber-50/50'
                      : 'border-stone-200 bg-stone-50/50'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      {needsAttention && (
                        <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                          Needs attention
                        </span>
                      )}
                      <p className="font-medium text-stone-900">{learner?.name}</p>
                      <p className="text-sm text-stone-600">{log.message}</p>
                      <p className="text-xs text-stone-400">{formatTimestamp(log.timestamp)}</p>
                    </div>
                    <Link
                      to={`/mentor/learner/${log.learnerId}`}
                      className="text-sm text-accent hover:underline"
                    >
                      View profile
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="card border-stone-300 p-5">
          <div className="section-heading">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="section-title">All activity</h2>
              <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-medium text-stone-700">
                {allActivity.length}
              </span>
            </div>
          </div>

          <div className="mt-4 divide-y divide-stone-200 overflow-hidden rounded-lg border border-stone-200">
            {allActivity.map((log) => {
              const learner = learners.find((l) => l.id === log.learnerId)
              const needsAttention = log.requiresAction
              return (
                <div
                  key={log.id}
                  className={`flex items-center gap-3 px-4 py-3 ${
                    needsAttention ? 'bg-amber-50/60' : 'bg-white'
                  }`}
                >
                  <span
                    className={`w-14 text-xs uppercase ${
                      needsAttention ? 'font-medium text-amber-800' : 'text-stone-500'
                    }`}
                  >
                    {getActivityLabel(log.type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-stone-800">
                      <strong>{learner?.name}</strong> — {log.message}
                    </p>
                    <p className="text-xs text-stone-400">{formatTimestamp(log.timestamp)}</p>
                  </div>
                  {needsAttention ? (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                      Action needed
                    </span>
                  ) : (
                    <span className="shrink-0 text-xs text-stone-500">
                      {isSystemAlert(log.type) ? 'System' : 'User'}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
