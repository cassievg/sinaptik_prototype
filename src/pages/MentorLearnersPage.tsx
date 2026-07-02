import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import StatusBadge from '../components/StatusBadge'
import { getMentorLearners, formatRelativeTime } from '../utils/dashboard'
import type { Learner, LearnerStatus } from '../types'

const PAGE_SIZE = 25

type SortMode = 'default' | 'priority'

function sortByPriority(learners: Learner[]): Learner[] {
  const priority = (status: LearnerStatus) => {
    if (status === 'STUCK') return 0
    if (status === 'AT_RISK') return 1
    return 2
  }

  return [...learners]
    .map((learner, index) => ({ learner, index }))
    .sort((a, b) => {
      const diff = priority(a.learner.status) - priority(b.learner.status)
      return diff !== 0 ? diff : a.index - b.index
    })
    .map(({ learner }) => learner)
}

export default function MentorLearnersPage() {
  const { data } = useApp()
  const myLearners = getMentorLearners(data.learners, data.currentUser.id)
  const [page, setPage] = useState(0)
  const [sortMode, setSortMode] = useState<SortMode>('default')

  const sortedLearners = useMemo(
    () => (sortMode === 'priority' ? sortByPriority(myLearners) : myLearners),
    [myLearners, sortMode]
  )

  const totalPages = Math.ceil(sortedLearners.length / PAGE_SIZE)
  const visible = sortedLearners.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleSortChange = (mode: SortMode) => {
    setSortMode(mode)
    setPage(0)
  }

  return (
    <div>
      <h1 className="page-title">All learners</h1>
      <p className="page-subtitle">
        {myLearners.length} learners under mentor {data.currentUser.name} · Cohort total:{' '}
        {data.cohort.totalLearners} learners
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label htmlFor="learner-sort" className="text-sm font-medium text-stone-700">
          Sort by
        </label>
        <select
          id="learner-sort"
          value={sortMode}
          onChange={(e) => handleSortChange(e.target.value as SortMode)}
          className="filter-select"
        >
          <option value="default">Default order</option>
          <option value="priority">Priority — stuck &amp; at risk first</option>
        </select>
        {sortMode === 'priority' && (
          <span className="text-xs text-stone-500">
            Stuck and at-risk learners appear at the top
          </span>
        )}
      </div>

      <div className="card mt-6 overflow-hidden border-stone-300">
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
            {visible.map((learner) => {
              const isAtRisk = learner.status === 'STUCK' || learner.status === 'AT_RISK'
              return (
                <tr
                  key={learner.id}
                  className={`hover:bg-stone-50 ${isAtRisk ? 'bg-amber-50/40' : ''}`}
                >
                  <td className="px-4 py-3 font-medium text-stone-900">
                    <span className="flex items-center gap-2">
                      {isAtRisk && (
                        <span
                          className="inline-block h-2 w-2 shrink-0 rounded-full bg-amber-500"
                          title="Stuck or at risk"
                        />
                      )}
                      {learner.name}
                    </span>
                  </td>
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
              )
            })}
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
              className="btn-secondary rounded-md px-3 py-1 text-xs disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="btn-secondary rounded-md px-3 py-1 text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
