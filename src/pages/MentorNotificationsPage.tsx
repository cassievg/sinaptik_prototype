import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  filterNotificationsByTab,
  getNotificationRoute,
  sortNotificationsByDate,
} from '../utils/mockDataHelpers'
import type { Notification } from '../types'

type Tab = 'ALL' | 'MENTOR_REQUEST' | 'ASSIGNMENT_SUBMISSION'

const TABS: { id: Tab; label: string }[] = [
  { id: 'ALL', label: 'All Notification' },
  { id: 'MENTOR_REQUEST', label: 'Mentor Request' },
  { id: 'ASSIGNMENT_SUBMISSION', label: 'Assignment Submission' },
]

function formatNotificationDate(isoDate: string) {
  return new Date(isoDate + 'T12:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })
}

function isUrgentNotification(notification: Notification) {
  return notification.requiresAction && notification.type === 'MENTOR_REQUEST'
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-stone-400"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  )
}

function NotificationRow({
  notification,
  onRead,
}: {
  notification: Notification
  onRead: (id: string) => void
}) {
  const urgent = isUrgentNotification(notification)
  const read = notification.read

  return (
    <Link
      to={getNotificationRoute(notification, notification.type)}
      onClick={() => onRead(notification.id)}
      className={`grid grid-cols-1 gap-1 border-b border-stone-200 px-4 py-3.5 transition last:border-b-0 hover:z-10 hover:outline hover:outline-2 hover:outline-blue-500 hover:-outline-offset-2 md:grid-cols-[minmax(140px,1fr)_2fr_auto] md:items-center md:gap-6 ${
        urgent ? 'bg-amber-100 hover:bg-amber-100' : 'bg-white hover:bg-white'
      }`}
    >
      <div className="flex min-w-0 items-center gap-2">
        {urgent && (
          <span className="shrink-0 text-base font-bold leading-none text-stone-900">!</span>
        )}
        <span
          className={`truncate text-sm ${
            read ? 'font-normal text-stone-400' : 'font-semibold text-stone-900'
          }`}
        >
          {notification.learnerName}
        </span>
      </div>
      <p className={`min-w-0 text-sm ${read ? 'text-stone-400' : 'text-stone-800'}`}>
        {notification.message}
      </p>
      <p
        className={`shrink-0 text-sm md:text-right ${
          read ? 'text-stone-400' : 'text-stone-600'
        }`}
      >
        {formatNotificationDate(notification.date)}
      </p>
    </Link>
  )
}

export default function MentorNotificationsPage() {
  const { notifications, markNotificationRead } = useApp()
  const [tab, setTab] = useState<Tab>('ALL')
  const [query, setQuery] = useState('')

  const actionCount = notifications.filter((n) => n.requiresAction).length

  const filtered = useMemo(() => {
    let list = filterNotificationsByTab(notifications, tab)
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (n) =>
          n.learnerName.toLowerCase().includes(q) || n.message.toLowerCase().includes(q)
      )
    }
    return sortNotificationsByDate(list)
  }, [notifications, tab, query])

  return (
    <div>
      <h1 className="page-title">Inbox</h1>
      <p className="page-subtitle">{actionCount} items require attention</p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="relative min-w-[220px] flex-1">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full rounded-md border border-stone-300 bg-white py-2.5 pl-3 pr-10 text-sm text-stone-800 placeholder:text-stone-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="inbox-sort" className="text-sm text-stone-700">
            Sort by
          </label>
          <select id="inbox-sort" className="filter-select py-2.5" defaultValue="default">
            <option value="default">Default Order</option>
          </select>
        </div>
      </div>

      <div className="mt-6 border-b-2 border-stone-300">
        <nav className="-mb-0.5 flex gap-8">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`border-b-2 pb-2.5 text-sm transition ${
                tab === t.id
                  ? 'border-stone-900 font-medium text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="card overflow-hidden rounded-t-none border-t-0 border-stone-300">
        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-stone-500">No notifications.</p>
        ) : (
          <div>
            {filtered.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onRead={markNotificationRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
