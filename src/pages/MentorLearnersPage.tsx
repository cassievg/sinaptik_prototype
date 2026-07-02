import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'
import { getMentorLearners, formatRelativeTime } from '../utils/dashboard'

const PAGE_SIZE = 25

export default function MentorLearnersPage() {
  const { data } = useApp()
  const myLearners = getMentorLearners(data.learners, data.currentUser.id)
  const [page, setPage] = useState(0)

  const totalPages = Math.ceil(myLearners.length / PAGE_SIZE)
  const visible = myLearners.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  return (
    <div>
      <h1 className="page-title">All learners</h1>
      <p className="page-subtitle">
        {myLearners.length} learners under mentor {data.currentUser.name} · Cohort total:{' '}
        {data.cohort.totalLearners} learners
      </p>

      <div className="card mt-8 overflow-hidden border-stone-300">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-300 bg-stone-50">
            <tr>
              <th className="px-4 py-3 font-medium text-stone-700">Learner</th>
              <th className="hidden px-4 py-3 font-medium text-stone-700 sm:table-cell">Module</th>
              <th className="px-4 py-3 font-medium text-stone-700">Status</th>
              <th className="hidden px-4 py-3 font-medium text-stone-700 md:table-cell">Score</th>
              <th className="hidden px-4 py-3 font-medium text-stone-700 lg:table-cell">Risk</th>
              <th className="hidden px-4 py-3 font-medium text-stone-700 lg:table-cell">
                Last active
              </th>
              <th className="px-4 py-3 font-medium text-stone-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {visible.map((learner) => (
              <tr key={learner.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-medium text-stone-900">{learner.name}</td>
                <td className="hidden px-4 py-3 text-stone-600 sm:table-cell">
                  {learner.currentModule}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={learner.status} />
                </td>
                <td className="hidden px-4 py-3 text-stone-900 md:table-cell">{learner.avgScore}</td>
                <td className="hidden px-4 py-3 text-stone-600 lg:table-cell">
                  {learner.dropOffRisk}
                </td>
                <td className="hidden px-4 py-3 text-stone-500 lg:table-cell">
                  {formatRelativeTime(learner.lastActive)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/mentor/learner/${learner.id}`}
                    className="text-sm text-accent hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-stone-600">
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="btn-secondary px-3 py-1 text-xs disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="btn-secondary px-3 py-1 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
