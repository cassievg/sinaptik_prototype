import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import PageTitleWithIcon from '../../components/PageTitleWithIcon'
import StatusBadge from '../../components/StatusBadge'
import { getMentorLearners, formatRelativeTime } from '../../utils/dashboard'
import { searchLearners } from '../../utils/mockDataHelpers'
import type { Learner } from '../../types'

const PAGE_SIZE = 10

/** Matches dashboard triage groups — no per-enum duplicates. */
type LearnerGroup = 'ALL' | 'WORK_QUEUE' | 'FOLLOW_UP' | 'ON_TRACK' | 'COMPLETED'

const GROUP_OPTIONS: { value: LearnerGroup; labelKey: string }[] = [
  { value: 'ALL', labelKey: 'learners.all' },
  { value: 'WORK_QUEUE', labelKey: 'learners.workQueue' },
  { value: 'FOLLOW_UP', labelKey: 'learners.followUp' },
  { value: 'ON_TRACK', labelKey: 'learners.onTrack' },
  { value: 'COMPLETED', labelKey: 'learners.completed' },
]

const GROUP_SUBTITLE_KEY: Partial<Record<LearnerGroup, string>> = {
  WORK_QUEUE: 'learners.workQueue',
  FOLLOW_UP: 'learners.followUp',
  ON_TRACK: 'learners.onTrack',
  COMPLETED: 'learners.completed',
}

function groupFromSearchParams(searchParams: URLSearchParams): LearnerGroup | null {
  const board = searchParams.get('board')
  const status = searchParams.get('status')
  if (board === 'stuck') return 'FOLLOW_UP'
  if (status === 'PENDING_MENTOR') return 'WORK_QUEUE'
  if (status === 'ON_TRACK') return 'ON_TRACK'
  if (status === 'COMPLETED') return 'COMPLETED'
  if (status === 'STUCK' || status === 'AT_RISK') return 'FOLLOW_UP'
  return null
}

function filterByGroup(learners: Learner[], group: LearnerGroup): Learner[] {
  switch (group) {
    case 'WORK_QUEUE':
      return learners.filter((l) => l.status === 'PENDING_MENTOR')
    case 'FOLLOW_UP':
      return learners.filter((l) => l.status === 'STUCK' || l.status === 'AT_RISK')
    case 'ON_TRACK':
      return learners.filter((l) => l.status === 'ON_TRACK')
    case 'COMPLETED':
      return learners.filter((l) => l.status === 'COMPLETED')
    default:
      return learners
  }
}

function sortLearners(learners: Learner[], group: LearnerGroup): Learner[] {
  if (group !== 'ALL') {
    return [...learners].sort((a, b) => a.name.localeCompare(b.name))
  }
  const priority = (l: Learner) => {
    if (l.status === 'PENDING_MENTOR') return 0
    if (l.status === 'STUCK') return 1
    if (l.status === 'AT_RISK') return 2
    if (l.status === 'ON_TRACK') return 3
    return 4
  }
  return [...learners].sort((a, b) => {
    const diff = priority(a) - priority(b)
    return diff !== 0 ? diff : a.name.localeCompare(b.name)
  })
}

export default function MentorLearnersPage() {
  const { data } = useApp()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const myLearners = getMentorLearners(data.learners, data.currentUser.id)
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState<LearnerGroup>('ALL')

  useEffect(() => {
    const fromUrl = groupFromSearchParams(searchParams)
    if (fromUrl) setGroup(fromUrl)
  }, [searchParams])

  const filtered = useMemo(() => {
    const list = filterByGroup(searchLearners(myLearners, query), group)
    return sortLearners(list, group)
  }, [myLearners, query, group])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const groupSubtitleKey = GROUP_SUBTITLE_KEY[group]

  return (
    <div>
      <PageTitleWithIcon title={t('learners.title')} icon="learners" />
      <p className="page-subtitle">
        {t('learners.subtitle', {
          count: myLearners.length,
          mentor: data.currentUser.name,
          total: data.cohort.totalLearners,
        })}
        {groupSubtitleKey && ` · ${t(groupSubtitleKey).split(' — ')[0]}`}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(0)
          }}
          placeholder={t('learners.search')}
          className="min-w-[200px] flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="learner-group" className="text-sm text-stone-700">
            {t('learners.show')}
          </label>
          <select
            id="learner-group"
            value={group}
            onChange={(e) => {
              setGroup(e.target.value as LearnerGroup)
              setPage(0)
            }}
            className="filter-select min-w-[220px]"
          >
            {GROUP_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden border-stone-300">
        <div className="overflow-x-auto">
          <table className="min-w-[840px] w-full text-left text-sm">
          <thead className="border-b border-stone-300 bg-stone-50">
            <tr>
              <th className="px-4 py-3 font-medium text-stone-700">{t('learners.learner')}</th>
              <th className="px-4 py-3 font-medium text-stone-700">{t('learners.module')}</th>
              <th className="px-4 py-3 font-medium text-stone-700">{t('learners.status')}</th>
              <th className="px-4 py-3 font-medium text-stone-700">{t('learners.score')}</th>
              <th className="px-4 py-3 font-medium text-stone-700">{t('learners.risk')}</th>
              <th className="px-4 py-3 font-medium text-stone-700">{t('learners.lastActive')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-stone-500">
                  {t('learners.empty')}
                </td>
              </tr>
            ) : (
              visible.map((learner) => (
                <tr
                  key={learner.id}
                  className="cursor-pointer hover:bg-stone-50"
                  onClick={() => navigate(`/learners/${learner.id}`)}
                >
                  <td className="px-4 py-3 font-medium text-stone-900">{learner.name}</td>
                  <td className="px-4 py-3 text-stone-600">{learner.currentModule}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={learner.status} />
                  </td>
                  <td className="px-4 py-3 text-stone-900">{learner.avgScore}</td>
                  <td className="px-4 py-3 text-stone-600">{learner.dropOffRisk}</td>
                  <td className="px-4 py-3 text-stone-500">
                    {formatRelativeTime(learner.lastActive, t)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-sm text-stone-600">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="disabled:opacity-40"
        >
          ‹
        </button>
        <span>
          {t('learners.page', { current: page + 1, total: totalPages })}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page >= totalPages - 1}
          className="disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  )
}
