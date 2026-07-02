import type { Learner } from '../../types'

const ACCENT = '#1e3a5f'
const MUTED = '#9ca3af'
const TRACK = '#e7e5e4'

interface LearnerInsightChartProps {
  learner: Learner
  cohortAvgScore: number
  cohortAvgEngagement: number
}

export default function LearnerInsightChart({
  learner,
  cohortAvgScore,
  cohortAvgEngagement,
}: LearnerInsightChartProps) {
  const w = 280
  const h = 120
  const pad = { top: 12, right: 16, bottom: 28, left: 36 }
  const plotW = w - pad.left - pad.right
  const plotH = h - pad.top - pad.bottom

  const toX = (engagement: number) => pad.left + (engagement / 100) * plotW
  const toY = (score: number) => pad.top + plotH - (score / 100) * plotH

  const learnerX = toX(learner.engagementScore)
  const learnerY = toY(learner.avgScore)
  const cohortX = toX(cohortAvgEngagement)
  const cohortY = toY(cohortAvgScore)

  const completedModules = learner.moduleProgress
  const totalModules = learner.totalModules

  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50/50 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Learning snapshot
          </h3>
          <p className="mt-0.5 text-sm text-stone-700">Engagement vs performance</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-stone-500">Module progress</p>
          <div className="mt-1 flex gap-1">
            {Array.from({ length: totalModules }, (_, i) => {
              const done = i < completedModules
              const current = i === completedModules && completedModules < totalModules
              return (
                <span
                  key={i}
                  title={`Module ${i + 1}${done ? ' — completed' : current ? ' — current' : ''}`}
                  className={`h-2 w-5 rounded-sm ${
                    done ? 'bg-accent' : current ? 'border border-accent bg-accent/20' : 'bg-stone-300'
                  }`}
                />
              )
            })}
          </div>
          <p className="mt-1 text-xs text-stone-500">
            {completedModules}/{totalModules} complete
          </p>
        </div>
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 w-full max-w-sm" role="img" aria-label="Engagement vs performance chart">
        {/* grid */}
        {[25, 50, 75].map((tick) => (
          <g key={tick}>
            <line
              x1={pad.left}
              y1={toY(tick)}
              x2={pad.left + plotW}
              y2={toY(tick)}
              stroke={TRACK}
              strokeWidth={1}
            />
            <line
              x1={toX(tick)}
              y1={pad.top}
              x2={toX(tick)}
              y2={pad.top + plotH}
              stroke={TRACK}
              strokeWidth={1}
            />
          </g>
        ))}

        {/* cohort average crosshair */}
        <line
          x1={cohortX}
          y1={pad.top}
          x2={cohortX}
          y2={pad.top + plotH}
          stroke={MUTED}
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <line
          x1={pad.left}
          y1={cohortY}
          x2={pad.left + plotW}
          y2={cohortY}
          stroke={MUTED}
          strokeWidth={1}
          strokeDasharray="3 3"
        />
        <circle cx={cohortX} cy={cohortY} r={3} fill="white" stroke={MUTED} strokeWidth={1.5} />

        {/* learner point */}
        <circle cx={learnerX} cy={learnerY} r={5} fill={ACCENT} />
        <circle cx={learnerX} cy={learnerY} r={8} fill={ACCENT} fillOpacity={0.15} />

        {/* axis labels */}
        <text x={pad.left + plotW / 2} y={h - 4} textAnchor="middle" className="fill-stone-500 text-[9px]">
          Engagement
        </text>
        <text
          x={10}
          y={pad.top + plotH / 2}
          textAnchor="middle"
          transform={`rotate(-90, 10, ${pad.top + plotH / 2})`}
          className="fill-stone-500 text-[9px]"
        >
          Score
        </text>
      </svg>

      <div className="mt-2 flex flex-wrap gap-4 text-xs text-stone-600">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-accent" />
          {learner.name.split(' ')[0]}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full border border-stone-400 bg-white" />
          Cohort avg
        </span>
      </div>
    </div>
  )
}
