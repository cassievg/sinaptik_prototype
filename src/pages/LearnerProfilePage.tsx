import { useParams, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'
import LearnerInsightChart from '../components/charts/LearnerInsightChart'
import ModuleHistoryChart from '../components/charts/ModuleHistoryChart'
import {
  formatTimestamp,
  getActivityLabel,
  isSystemAlert,
  getRiskColor,
} from '../utils/dashboard'

export default function LearnerProfilePage() {
  const { learnerId } = useParams<{ learnerId: string }>()
  const { data, getSubmission } = useApp()
  const navigate = useNavigate()

  const learner = data.learners.find((l) => l.id === learnerId)
  const logs = data.activityLogs
    .filter((log) => log.learnerId === learnerId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  const submission = learnerId ? getSubmission(learnerId) : undefined

  const cohortAvgScore = Math.round(
    data.learners.reduce((sum, l) => sum + l.avgScore, 0) / data.learners.length
  )
  const cohortAvgEngagement = Math.round(
    data.learners.reduce((sum, l) => sum + l.engagementScore, 0) / data.learners.length
  )

  if (!learner) {
    return <p className="text-stone-500">Learner not found.</p>
  }

  const progressPct = Math.round((learner.moduleProgress / learner.totalModules) * 100)

  return (
    <div>
      <Link to="/mentor" className="text-sm text-accent hover:underline">
        Back to command center
      </Link>

      <h1 className="page-title mt-4">{learner.name}</h1>
      <p className="page-subtitle">{learner.currentModule}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <StatusBadge status={learner.status} />
        <span className={`text-sm ${getRiskColor(learner.dropOffRisk)}`}>
          Drop-off risk: {learner.dropOffRisk}
        </span>
      </div>

      <div className="mt-6 grid gap-4 rounded-lg border border-stone-300 sm:grid-cols-3">
        <div className="p-4 text-center">
          <p className="font-serif text-2xl">{learner.avgScore}</p>
          <p className="text-xs text-stone-600">Average score</p>
        </div>
        <div className="border-t border-stone-300 p-4 text-center sm:border-l sm:border-t-0">
          <p className="font-serif text-2xl">{learner.engagementScore}</p>
          <p className="text-xs text-stone-600">Engagement</p>
        </div>
        <div className="border-t border-stone-300 p-4 text-center sm:border-l sm:border-t-0">
          <p className="font-serif text-2xl">{progressPct}%</p>
          <p className="text-xs text-stone-600">Progress</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <section className="card border-stone-300 p-6">
          <div className="section-heading">
            <h2 className="section-title">Learning snapshot</h2>
          </div>
          <div className="mt-4">
            <LearnerInsightChart
              learner={learner}
              cohortAvgScore={cohortAvgScore}
              cohortAvgEngagement={cohortAvgEngagement}
            />
          </div>
        </section>

        <ModuleHistoryChart learner={learner} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <section className="card border-stone-300 p-6 lg:col-span-1">
          <div className="section-heading">
            <h2 className="section-title">Skill breakdown</h2>
          </div>
          <div className="mt-4 space-y-4">
            {learner.skills.map((skill) => (
              <div key={skill.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-stone-700">{skill.name}</span>
                  <span className="text-stone-500">{skill.progress}%</span>
                </div>
                <div className="h-1.5 bg-stone-200">
                  <div className="h-full bg-accent" style={{ width: `${skill.progress}%` }} />
                </div>
              </div>
            ))}
          </div>

          {submission && (
            <div className="mt-6 border-t border-stone-200 pt-4">
              <h3 className="text-sm font-medium text-stone-900">Latest submission</h3>
              <p className="mt-1 text-sm text-stone-600">{submission.moduleTitle}</p>
              <p className="mt-1 font-serif text-lg">{submission.aiScore}/100</p>
              <button
                onClick={() => navigate(`/mentor/feedback/${learnerId}`)}
                className="btn-primary mt-3 w-full text-sm"
              >
                Review submission
              </button>
            </div>
          )}
        </section>

        <section className="card border-stone-300 p-6 lg:col-span-2">
          <div className="section-heading">
            <h2 className="section-title">Activity timeline</h2>
          </div>
          <div className="mt-6 space-y-4">
            {logs.length === 0 ? (
              <p className="text-sm text-stone-400">No activity yet.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex gap-4 border-b border-stone-100 pb-4">
                  <span className="w-16 shrink-0 text-xs font-medium uppercase text-stone-500">
                    {getActivityLabel(log.type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs text-stone-500">
                          {isSystemAlert(log.type) ? 'System' : 'User'}
                        </span>
                        <p className="mt-1 text-sm text-stone-800">{log.message}</p>
                        <p className="mt-1 text-xs text-stone-400">
                          {formatTimestamp(log.timestamp)}
                        </p>
                      </div>
                      {log.requiresAction && (
                        <button
                          onClick={() => navigate(`/mentor/feedback/${learnerId}`)}
                          className="btn-primary shrink-0 px-3 py-1 text-xs"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}