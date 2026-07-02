import type { LearnerStatus } from '../types'
import { getStatusColor, getStatusLabel } from '../utils/dashboard'

export default function StatusBadge({ status }: { status: LearnerStatus }) {
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 text-xs font-medium ${getStatusColor(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  )
}
