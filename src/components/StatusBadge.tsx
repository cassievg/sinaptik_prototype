import type { LearnerStatus } from '../types'
import { getStatusColor } from '../utils/dashboard'
import { useLanguage } from '../context/LanguageContext'

export default function StatusBadge({ status }: { status: LearnerStatus }) {
  const { t } = useLanguage()
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap border px-2 py-0.5 text-xs font-medium ${getStatusColor(status)}`}
    >
      {t(`status.${status}`)}
    </span>
  )
}
