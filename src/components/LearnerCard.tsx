import { Link } from 'react-router-dom'
import type { Learner } from '../types'
import StatusBadge from './StatusBadge'
import { formatRelativeTime } from '../utils/dashboard'

export default function LearnerCard({ learner }: { learner: Learner }) {
  const progressPct = Math.round((learner.moduleProgress / learner.totalModules) * 100)

  return (
    <Link
      to={`/mentor/learner/${learner.id}`}
      className="block border border-stone-200 bg-white p-3 transition hover:border-stone-400"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-stone-900">{learner.name}</h3>
        <StatusBadge status={learner.status} />
      </div>
      <p className="mt-1 text-xs text-stone-600">{learner.currentModule}</p>
      <p className="mt-2 text-xs text-stone-500">
        Score {learner.avgScore} · Risk {learner.dropOffRisk} · {progressPct}% complete
      </p>
      <p className="mt-1 text-xs text-stone-400">
        {learner.assignedMentor.name} · {formatRelativeTime(learner.lastActive)}
      </p>
    </Link>
  )
}
