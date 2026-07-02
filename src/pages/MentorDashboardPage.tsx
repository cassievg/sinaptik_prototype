import { useApp } from '../context/AppContext'
import {
  calcCompletionRate,
  calcAvgScore,
  calcAtRiskCount,
  calcPendingReviewCount,
  groupLearnersByColumn,
  getMentorLearners,
  formatRelativeTime,
  getActivityLabel,
} from '../utils/dashboard'
import StatCard from '../components/StatCard'
import LearnerCard from '../components/LearnerCard'
import {
  GroupedBarChart,
  VerticalBarChart,
  HorizontalBarChart,
  StatusBarChart,
} from '../components/charts/BarChart'

const columnConfig = [
  { key: 'on_track' as const, title: 'On track' },
  { key: 'needs_review' as const, title: 'Needs review' },
  { key: 'stuck' as const, title: 'Stuck / at risk' },
]

const statusLabels: Record<string, string> = {
  on_track: 'On track',
  needs_review: 'Needs review',
  stuck: 'Stuck / at risk',
  completed: 'Completed',
}

export default function MentorDashboardPage() {
  const { data } = useApp()
  const { cohort, learners, submissions, dashboardAnalytics, activityLogs, currentUser } = data

  const myLearners = getMentorLearners(learners, currentUser.id)
  const grouped = groupLearnersByColumn(myLearners)
  const completionRate = calcCompletionRate(myLearners)
  const avgScore = calcAvgScore(submissions)
  const atRiskCount = calcAtRiskCount(myLearners)
  const pendingReview = calcPendingReviewCount(myLearners)

  const recentAlerts = activityLogs
    .filter((l) => l.type === 'AI_ALERT' || l.requiresAction)
    .slice(0, 5)

  const statusChartData = (
    Object.entries(dashboardAnalytics.statusBreakdown) as [string, number][]
  ).map(([key, count]) => ({
    label: statusLabels[key],
    count,
    pct: Math.round((count / cohort.totalLearners) * 100),
  }))

  return (
    <div>
      <h1 className="page-title">Command center</h1>
      <p className="page-subtitle">{cohort.name}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Completion rate" value={completionRate} suffix="%" />
        <StatCard label="Average score" value={avgScore} suffix="/100" />
        <StatCard label="At risk" value={atRiskCount} />
        <StatCard label="Pending review" value={pendingReview} />
        <StatCard label="Avg response" value={cohort.avgResponseTimeHours} suffix="h" />
        <StatCard
          label="Active this week"
          value={`${cohort.activeThisWeek}/${cohort.totalLearners}`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <GroupedBarChart
          title="Weekly engagement"
          subtitle="Logins and submissions by day"
          data={dashboardAnalytics.weeklyEngagement.map((d) => ({
            label: d.day,
            logins: d.logins,
            submissions: d.submissions,
          }))}
        />
        <HorizontalBarChart
          title="Module completion"
          subtitle="Learners who completed each module"
          data={dashboardAnalytics.moduleCompletion.map((d) => ({
            label: d.module.replace(/^M\d+: /, 'M'),
            value: d.completed,
            display: `${d.completed}/${d.total}`,
          }))}
          maxValue={cohort.totalLearners}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <VerticalBarChart
          title="Score distribution"
          subtitle="Number of AI-graded submissions per range"
          data={dashboardAnalytics.scoreDistribution.map((d) => ({
            label: d.range,
            value: d.count,
            sublabel: d.label,
          }))}
        />
        <HorizontalBarChart
          title="Cohort skill averages"
          subtitle="Average proficiency by skill area"
          data={dashboardAnalytics.skillAverages.map((d) => ({
            label: d.skill,
            value: d.avg,
            display: `${d.avg}%`,
          }))}
          maxValue={100}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <StatusBarChart title="Status breakdown" data={statusChartData} />

        <div className="card border-stone-300 p-5 lg:col-span-2">
          <div className="section-heading">
            <h3 className="section-title">Recent alerts and actions</h3>
          </div>
          <div className="mt-4 space-y-2">
            {recentAlerts.map((alert) => {
              const learner = learners.find((l) => l.id === alert.learnerId)
              const needsAction = alert.requiresAction
              return (
                <div
                  key={alert.id}
                  className={`relative flex items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                    needsAction
                      ? 'border-amber-300 bg-amber-50/70 shadow-sm'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  {needsAction && (
                    <span
                      className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-amber-500"
                      aria-hidden
                    />
                  )}
                  <span
                    className={`ml-1 shrink-0 text-xs font-medium uppercase ${
                      needsAction ? 'text-amber-800' : 'text-stone-500'
                    }`}
                  >
                    {getActivityLabel(alert.type)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm ${needsAction ? 'font-medium text-stone-900' : 'text-stone-800'}`}>
                      {alert.message}
                    </p>
                    <p className="text-xs text-stone-500">
                      {learner?.name} · {formatRelativeTime(alert.timestamp)}
                    </p>
                  </div>
                  {needsAction && (
                    <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-amber-400 bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                      <span className="inline-block h-2 w-2 rounded-full bg-amber-600" />
                      Action needed
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <section className="mt-10">
        <div className="section-heading">
          <h3 className="section-title">Learner progress board</h3>
        </div>
        <p className="mt-3 text-sm text-stone-600">
          {myLearners.length} learners under {currentUser.name} · {cohort.totalLearners} total in
          cohort
        </p>
        <div className="mt-4 grid gap-6 md:grid-cols-3">
          {columnConfig.map((col) => (
            <div key={col.key} className="rounded-lg border border-stone-300 bg-white p-4">
              <div className="mb-4 flex items-center justify-between border-b border-stone-200 pb-2">
                <h4 className="text-sm font-medium text-stone-900">{col.title}</h4>
                <span className="text-xs text-stone-500">{grouped[col.key].length}</span>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {grouped[col.key].length === 0 ? (
                  <p className="py-6 text-center text-sm text-stone-400">No learners</p>
                ) : (
                  grouped[col.key].slice(0, 8).map((learner) => (
                    <LearnerCard key={learner.id} learner={learner} />
                  ))
                )}
                {grouped[col.key].length > 8 && (
                  <p className="text-center text-xs text-stone-500">
                    +{grouped[col.key].length - 8} more learners
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
