const CHART_COLORS = ['#1e3a5f', '#6b7280', '#9ca3af', '#d1d5db']

interface VerticalBarChartProps {
  title: string
  subtitle?: string
  data: { label: string; value: number; sublabel?: string }[]
  maxValue?: number
  valueSuffix?: string
}

export function VerticalBarChart({
  title,
  subtitle,
  data,
  maxValue,
  valueSuffix = '',
}: VerticalBarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1)
  const chartH = 160
  const barGap = 12
  const barWidth = Math.min(48, (320 - barGap * (data.length + 1)) / data.length)

  return (
    <div className="card border-stone-300 p-5">
      <h3 className="section-title">{title}</h3>
      {subtitle && <p className="mt-1 text-xs text-stone-500">{subtitle}</p>}

      <svg
        viewBox={`0 0 ${Math.max(data.length * (barWidth + barGap) + barGap, 280)} ${chartH + 40}`}
        className="mt-4 w-full"
        role="img"
        aria-label={title}
      >
        {/* baseline */}
        <line
          x1={barGap}
          y1={chartH}
          x2={data.length * (barWidth + barGap)}
          y2={chartH}
          stroke="#d6d3d1"
          strokeWidth={1}
        />

        {data.map((d, i) => {
          const h = max > 0 ? (d.value / max) * (chartH - 24) : 0
          const x = barGap + i * (barWidth + barGap)
          const y = chartH - h
          return (
            <g key={d.label}>
              <title>
                {d.label}: {d.value}
                {valueSuffix}
              </title>
              <rect x={x} y={y} width={barWidth} height={h} fill={CHART_COLORS[0]} />
              <text
                x={x + barWidth / 2}
                y={y - 4}
                textAnchor="middle"
                className="fill-stone-700 text-[10px]"
              >
                {d.value}
                {valueSuffix}
              </text>
              <text
                x={x + barWidth / 2}
                y={chartH + 14}
                textAnchor="middle"
                className="fill-stone-500 text-[10px]"
              >
                {d.label}
              </text>
              {d.sublabel && (
                <text
                  x={x + barWidth / 2}
                  y={chartH + 26}
                  textAnchor="middle"
                  className="fill-stone-400 text-[9px]"
                >
                  {d.sublabel}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

interface GroupedBarChartProps {
  title: string
  subtitle?: string
  data: { label: string; logins: number; submissions: number }[]
}

export function GroupedBarChart({ title, subtitle, data }: GroupedBarChartProps) {
  const max = Math.max(...data.flatMap((d) => [d.logins, d.submissions]), 1)
  const chartH = 160
  const groupW = 44
  const barW = 14
  const gap = 16

  return (
    <div className="card border-stone-300 p-5">
      <h3 className="section-title">{title}</h3>
      {subtitle && <p className="mt-1 text-xs text-stone-500">{subtitle}</p>}

      <svg
        viewBox={`0 0 ${data.length * (groupW + gap) + gap} ${chartH + 50}`}
        className="mt-4 w-full"
        role="img"
        aria-label={title}
      >
        <line
          x1={gap}
          y1={chartH}
          x2={data.length * (groupW + gap)}
          y2={chartH}
          stroke="#d6d3d1"
          strokeWidth={1}
        />

        {data.map((d, i) => {
          const gx = gap + i * (groupW + gap)
          const loginH = (d.logins / max) * (chartH - 24)
          const subH = (d.submissions / max) * (chartH - 24)
          return (
            <g key={d.label}>
              <rect
                x={gx}
                y={chartH - loginH}
                width={barW}
                height={loginH}
                fill={CHART_COLORS[1]}
              />
              <rect
                x={gx + barW + 4}
                y={chartH - subH}
                width={barW}
                height={subH}
                fill={CHART_COLORS[0]}
              />
              <text
                x={gx + groupW / 2}
                y={chartH + 14}
                textAnchor="middle"
                className="fill-stone-500 text-[10px]"
              >
                {d.label}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-2 flex gap-6 text-xs text-stone-600">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 bg-stone-400" />
          Logins
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 bg-accent" />
          Submissions
        </span>
      </div>
    </div>
  )
}

interface HorizontalBarChartProps {
  title: string
  subtitle?: string
  data: { label: string; value: number; display?: string }[]
  maxValue?: number
  asPercent?: boolean
}

export function HorizontalBarChart({
  title,
  subtitle,
  data,
  maxValue,
  asPercent = false,
}: HorizontalBarChartProps) {
  const max = maxValue ?? Math.max(...data.map((d) => d.value), 1)
  const barH = 18
  const rowGap = 10

  return (
    <div className="card border-stone-300 p-5">
      <h3 className="section-title">{title}</h3>
      {subtitle && <p className="mt-1 text-xs text-stone-500">{subtitle}</p>}

      <svg
        viewBox={`0 0 400 ${data.length * (barH + rowGap) + 8}`}
        className="mt-4 w-full"
        role="img"
        aria-label={title}
      >
        {data.map((d, i) => {
          const y = i * (barH + rowGap)
          const w = max > 0 ? (d.value / max) * 260 : 0
          const display = d.display ?? (asPercent ? `${d.value}%` : String(d.value))
          return (
            <g key={d.label}>
              <text x={0} y={y + 13} className="fill-stone-600 text-[10px]">
                {d.label.length > 18 ? `${d.label.slice(0, 16)}…` : d.label}
              </text>
              <rect x={120} y={y} width={260} height={barH} fill="#e7e5e4" />
              <rect x={120} y={y} width={w} height={barH} fill={CHART_COLORS[0]} />
              <text x={388} y={y + 13} textAnchor="end" className="fill-stone-800 text-[10px]">
                {display}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

interface StatusBarChartProps {
  title: string
  data: { label: string; count: number; pct: number }[]
}

export function StatusBarChart({ title, data }: StatusBarChartProps) {
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <div className="card border-stone-300 p-5">
      <h3 className="section-title">{title}</h3>
      <p className="mt-1 text-xs text-stone-500">{total} learners total</p>

      {/* stacked bar */}
      <div className="mt-6 flex h-8 w-full overflow-hidden border border-stone-300">
        {data.map((d, i) =>
          d.count > 0 ? (
            <div
              key={d.label}
              className="flex items-center justify-center text-[10px] text-white"
              style={{
                width: `${d.pct}%`,
                backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                minWidth: d.count > 0 ? '2rem' : 0,
              }}
              title={`${d.label}: ${d.count}`}
            >
              {d.pct >= 12 ? `${d.pct}%` : ''}
            </div>
          ) : null
        )}
      </div>

      <ul className="mt-4 space-y-2">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-stone-700">
              <span
                className="inline-block h-2.5 w-2.5"
                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
              />
              {d.label}
            </span>
            <span className="text-stone-900">
              {d.count} ({d.pct}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
