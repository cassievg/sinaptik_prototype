import type { Learner } from '../../types'

const ACCENT = '#1e3a5f'
const MUTED = '#9ca3af'
const TRACK = '#e7e5e4'

interface ModuleHistoryChartProps {
  learner: Learner
}

export default function ModuleHistoryChart({ learner }: ModuleHistoryChartProps) {
  const visited = learner.moduleHistory.filter((m) => m.status !== 'LOCKED')
  const barH = 18
  const rowGap = 14
  const chartW = 400

  return (
    <section className="card border-stone-300 p-6">
      <div className="section-heading">
        <h2 className="section-title">Modules visited</h2>
        <p className="mt-1 text-xs text-stone-500">
          {visited.length} of {learner.moduleHistory.length} modules started
        </p>
      </div>

      {visited.length === 0 ? (
        <p className="mt-6 text-sm text-stone-400">No modules visited yet.</p>
      ) : (
        <svg
          viewBox={`0 0 ${chartW} ${visited.length * (barH + rowGap) + 8}`}
          className="mt-4 w-full"
          role="img"
          aria-label="Modules visited with progress and score"
        >
          {visited.map((mod, i) => {
            const y = i * (barH + rowGap)
            const inProgress = mod.status === 'IN_PROGRESS'
            const pct = inProgress ? 100 : (mod.score ?? 0)
            const barTrackW = 220
            const barX = 150
            const w = inProgress ? barTrackW : (pct / 100) * barTrackW
            const label = mod.title.length > 24 ? `${mod.title.slice(0, 22)}…` : mod.title
            const display = inProgress ? 'In progress' : `${mod.score}`

            return (
              <g key={mod.id}>
                <title>{mod.title}</title>
                <text x={0} y={y + 13} className="fill-stone-600 text-[10px]">
                  {label}
                </text>
                <rect x={barX} y={y} width={barTrackW} height={barH} fill={TRACK} />
                <rect
                  x={barX}
                  y={y}
                  width={w}
                  height={barH}
                  fill={inProgress ? MUTED : ACCENT}
                  fillOpacity={inProgress ? 0.5 : 1}
                />
                <text
                  x={chartW - 4}
                  y={y + 13}
                  textAnchor="end"
                  className={`text-[10px] ${inProgress ? 'fill-stone-500' : 'fill-stone-800'}`}
                >
                  {display}
                </text>
              </g>
            )
          })}
        </svg>
      )}

      <div className="mt-3 flex gap-4 text-xs text-stone-600">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5" style={{ backgroundColor: ACCENT }} />
          Completed (score)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5" style={{ backgroundColor: MUTED, opacity: 0.5 }} />
          In progress
        </span>
      </div>
    </section>
  )
}