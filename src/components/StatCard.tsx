interface StatCardProps {
  label: string
  value: string | number
  suffix?: string
  trend?: string
  color?: string
}

export default function StatCard({ label, value, suffix, trend }: StatCardProps) {
  return (
    <div className="card border-stone-300 p-4">
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-1 font-serif text-2xl font-semibold text-stone-900">
        {value}
        {suffix && <span className="text-base font-normal text-stone-600">{suffix}</span>}
      </p>
      {trend && <p className="mt-1 text-xs text-stone-500">{trend}</p>}
    </div>
  )
}
