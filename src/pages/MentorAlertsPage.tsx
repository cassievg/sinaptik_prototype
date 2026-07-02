import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { formatTimestamp, getActivityLabel, isSystemAlert } from '../utils/dashboard'

export default function MentorAlertsPage() {
  const { data } = useApp()
  const { activityLogs, learners } = data

  const actionItems = activityLogs.filter((l) => l.requiresAction)
  const alerts = activityLogs.filter((l) => l.type === 'AI_ALERT')

  return (
    <div>
      <h1 className="page-title">Alerts and actions</h1>
      <p className="page-subtitle">{actionItems.length} items require attention</p>

      {actionItems.length > 0 && (
        <section className="mt-8">
          <h2 className="section-title">Action required</h2>
          <div className="mt-4 space-y-2">
            {actionItems.map((log) => {
              const learner = learners.find((l) => l.id === log.learnerId)
              return (
                <div
                  key={log.id}
                  className="card flex items-center justify-between border-stone-300 p-4"
                >
                  <div>
                    <p className="text-xs uppercase text-stone-500">
                      {getActivityLabel(log.type)}
                    </p>
                    <p className="font-medium text-stone-900">{learner?.name}</p>
                    <p className="text-sm text-stone-600">{log.message}</p>
                    <p className="text-xs text-stone-400">{formatTimestamp(log.timestamp)}</p>
                  </div>
                  <Link to={`/mentor/feedback/${log.learnerId}`} className="btn-primary text-sm">
                    Review
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="section-title">AI alerts</h2>
        <div className="mt-4 space-y-2">
          {alerts.map((log) => {
            const learner = learners.find((l) => l.id === log.learnerId)
            return (
              <div key={log.id} className="card border-stone-300 p-4">
                <p className="font-medium text-stone-900">{learner?.name}</p>
                <p className="text-sm text-stone-600">{log.message}</p>
                <p className="text-xs text-stone-400">{formatTimestamp(log.timestamp)}</p>
                <Link
                  to={`/mentor/learner/${log.learnerId}`}
                  className="mt-2 inline-block text-sm text-accent hover:underline"
                >
                  View profile
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="section-title">All activity</h2>
        <div className="card mt-4 divide-y divide-stone-200 border-stone-300">
          {activityLogs.map((log) => {
            const learner = learners.find((l) => l.id === log.learnerId)
            return (
              <div key={log.id} className="flex items-center gap-3 px-4 py-3">
                <span className="w-14 text-xs uppercase text-stone-500">
                  {getActivityLabel(log.type)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-stone-800">
                    <strong>{learner?.name}</strong> — {log.message}
                  </p>
                  <p className="text-xs text-stone-400">{formatTimestamp(log.timestamp)}</p>
                </div>
                <span className="text-xs text-stone-500">
                  {isSystemAlert(log.type) ? 'System' : 'User'}
                </span>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
