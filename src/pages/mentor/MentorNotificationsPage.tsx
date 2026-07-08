import { useMemo, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import PageTitleWithIcon from '../../components/PageTitleWithIcon'
import {
  filterNotificationsByTab,
  filterNotificationsByDateWithin,
  getNotificationRoute,
  sortNotificationsByDate,
  formatBadgeCount,
  getUnreadNotificationCount,
  type NotificationDateWithin,
} from '../../utils/mockDataHelpers'
import {
  getNotificationTypeStyle,
  READ_NOTIFICATION_ROW,
} from '../../utils/notificationStyles'
import { useReturnNavigation } from '../../utils/taskNavigation'
import type { Notification } from '../../types'

type InboxTab = 'ALL' | 'GRADING' | 'AI_ALERT' | 'SYSTEM'

const TABS: { id: InboxTab; labelKey: string; dot?: string }[] = [
  { id: 'ALL', labelKey: 'inbox.tabAll' },
  { id: 'GRADING', labelKey: 'inbox.tabGrading', dot: 'bg-amber-500' },
  { id: 'AI_ALERT', labelKey: 'inbox.tabAi', dot: 'bg-rose-500' },
  { id: 'SYSTEM', labelKey: 'inbox.tabSystem', dot: 'bg-emerald-500' },
]

const DATE_WITHIN_OPTIONS: { value: NotificationDateWithin; labelKey: string }[] = [
  { value: 'any', labelKey: 'inbox.anyTime' },
  { value: '1d', labelKey: 'inbox.day1' },
  { value: '3d', labelKey: 'inbox.days3' },
  { value: '1w', labelKey: 'inbox.week1' },
  { value: '2w', labelKey: 'inbox.weeks2' },
  { value: '1m', labelKey: 'inbox.month1' },
  { value: '1y', labelKey: 'inbox.year1' },
]

const DEMO_TODAY = '2026-07-06'

function formatNotificationDate(isoDate: string, dateLocale: string) {
  return new Date(isoDate + 'T12:00:00').toLocaleDateString(dateLocale, {
    day: 'numeric',
    month: 'short',
  })
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
  t,
  dateLocale,
  notificationsReturn,
}: {
  notification: Notification
  onRead: (id: string) => void
  t: (key: string, params?: Record<string, string | number>) => string
  dateLocale: string
  notificationsReturn: { returnTo: string; returnLabel: string }
}) {
  const read = notification.read
  const typeStyle = getNotificationTypeStyle(notification.type)
  const rowStyle = read ? READ_NOTIFICATION_ROW : typeStyle

  return (
    <Link
      to={getNotificationRoute(notification, notification.type)}
      state={notificationsReturn}
      onClick={() => onRead(notification.id)}
      className={`grid grid-cols-1 gap-1 border-b border-stone-200 border-l-4 px-4 py-3.5 transition last:border-b-0 hover:z-10 hover:outline hover:outline-2 hover:outline-blue-500 hover:-outline-offset-2 md:grid-cols-[minmax(140px,1fr)_2fr_auto] md:items-center md:gap-6 ${rowStyle.border} ${rowStyle.rowBg} ${rowStyle.rowBgHover}`}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={`truncate text-sm ${
            read ? 'font-normal text-stone-500' : 'font-semibold text-stone-900'
          }`}
        >
          {notification.learnerName}
        </span>
        {!read && (
          <span
            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${typeStyle.badge}`}
          >
            {t(`notificationType.${notification.type}`)}
          </span>
        )}
      </div>
      <p className={`min-w-0 text-sm ${read ? 'text-stone-400' : 'text-stone-800'}`}>
        {notification.message}
      </p>
      <p
        className={`shrink-0 text-sm md:text-right ${
          read ? 'text-stone-400' : 'text-stone-600'
        }`}
      >
        {formatNotificationDate(notification.date, dateLocale)}
      </p>
    </Link>
  )
}

export default function MentorNotificationsPage() {
  const { notifications, markNotificationRead } = useApp()
  const { t, dateLocale } = useLanguage()
  const { notificationsReturn } = useReturnNavigation()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<InboxTab>('ALL')
  const [query, setQuery] = useState('')
  const [dateWithin, setDateWithin] = useState<NotificationDateWithin>('any')
  const [anchorDate, setAnchorDate] = useState(DEMO_TODAY)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'AI_ALERT') setTab('AI_ALERT')
  }, [searchParams])

  const unreadCount = getUnreadNotificationCount(notifications)
  const unreadLabel = formatBadgeCount(unreadCount)
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
    list = filterNotificationsByDateWithin(list, dateWithin, anchorDate)
    return sortNotificationsByDate(list)
  }, [notifications, tab, query, dateWithin, anchorDate])

  return (
    <div>
      <PageTitleWithIcon title={t('inbox.title')} icon="inbox" />
      <p className="page-subtitle">
        {unreadLabel ? (
          <>
            <span className="font-medium text-stone-900">
              {t('inbox.unread', { count: unreadLabel })}
            </span>
            {actionCount > 0 && (
              <>
                {t(actionCount === 1 ? 'inbox.requireAttentionOne' : 'inbox.requireAttention', {
                  count: actionCount,
                })}
              </>
            )}
          </>
        ) : (
          <>
            {actionCount > 0
              ? t('inbox.allCaughtUp', { count: actionCount })
              : t('inbox.allCaughtUpNone')}
          </>
        )}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="relative min-w-[220px] flex-1">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('inbox.search')}
            className="w-full rounded-md border border-stone-300 bg-white py-2.5 pl-3 pr-10 text-sm text-stone-800 placeholder:text-stone-400 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <label htmlFor="inbox-date-within" className="text-sm text-stone-700">
            {t('inbox.dateWithin')}
          </label>
          <select
            id="inbox-date-within"
            value={dateWithin}
            onChange={(e) => {
              setDateWithin(e.target.value as NotificationDateWithin)
            }}
            className="filter-select py-2.5"
          >
            {DATE_WITHIN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
          <div className="relative">
            <input
              id="inbox-anchor-date"
              type="date"
              value={anchorDate}
              disabled={dateWithin === 'any'}
              onChange={(e) => {
                setAnchorDate(e.target.value)
              }}
              className="filter-select py-2.5 pr-9 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-400"
              aria-label={t('inbox.filterDate')}
            />
          </div>
          {dateWithin !== 'any' && (
            <button
              type="button"
              onClick={() => {
                setDateWithin('any')
                setAnchorDate(DEMO_TODAY)
              }}
              className="text-sm text-stone-500 hover:text-stone-800 hover:underline"
            >
              {t('inbox.clear')}
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 border-b-2 border-stone-300">
        <nav className="-mb-0.5 flex flex-wrap gap-x-6 gap-y-2">
          {TABS.map((tabItem) => (
            <button
              key={tabItem.id}
              type="button"
              onClick={() => setTab(tabItem.id)}
              className={`inline-flex items-center gap-2 border-b-2 pb-2.5 text-sm transition ${
                tab === tabItem.id
                  ? 'border-stone-900 font-medium text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              {tabItem.dot && (
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${tabItem.dot}`}
                  aria-hidden
                />
              )}
              {t(tabItem.labelKey)}
            </button>
          ))}
        </nav>
        {tab === 'GRADING' && (
          <p className="pb-2 text-xs text-stone-500">{t('inbox.legend')}</p>
        )}
      </div>

      <div className="card overflow-hidden rounded-t-none border-t-0 border-stone-300">
        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-stone-500">{t('inbox.empty')}</p>
        ) : (
          <div>
            {filtered.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onRead={markNotificationRead}
                t={t}
                dateLocale={dateLocale}
                notificationsReturn={notificationsReturn}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
