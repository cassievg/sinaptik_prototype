import { Link, NavLink, Outlet } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { formatBadgeCount, getUnreadChatCount } from '../../utils/mockDataHelpers'
import { SidebarProvider, useSidebar } from '../../context/SidebarContext'
import LanguageSwitcher from '../LanguageSwitcher'
import NotificationBell from '../NotificationBell'

export interface SidebarNavItem {
  to: string
  label: string
  end?: boolean
  badge?: string
}

interface SidebarShellProps {
  title?: string
  logoSrc?: string
  logoAlt?: string
  subtitle: string
  navItems: SidebarNavItem[]
  user: { name: string; avatar: string; role: string }
  header?: React.ReactNode
  footer?: React.ReactNode
  belowTitle?: React.ReactNode
}

export default function SidebarShell(props: SidebarShellProps) {
  return (
    <SidebarProvider>
      <SidebarShellInner {...props} />
    </SidebarProvider>
  )
}

function MobileNavIcon({ to }: { to: string }) {
  const base = 'h-4 w-4 shrink-0'

  if (to === '/') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-10.5z" />
      </svg>
    )
  }

  if (to === '/tasks') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M8 3v3M16 3v3M4 9h16" />
        <rect x="4" y="5" width="16" height="16" rx="2" />
      </svg>
    )
  }

  if (to === '/learners') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
        <circle cx="17.5" cy="9" r="2.5" />
        <path d="M14.5 20c.2-2 1.3-3.7 3-4.8" />
      </svg>
    )
  }

  if (to === '/notifications') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M15 18H5l1.3-1.3a2 2 0 0 0 .6-1.4V10a5 5 0 0 1 10 0v5.3a2 2 0 0 0 .6 1.4L19 18h-4z" />
        <path d="M10 20a2 2 0 0 0 4 0" />
      </svg>
    )
  }

  if (to === '/programs') {
    return (
      <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </svg>
    )
  }

  return (
    <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function ChatIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

function IconBadge({ label }: { label: string }) {
  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
      {label}
    </span>
  )
}

function SidebarShellInner({
  title = 'Sinaptik',
  logoSrc,
  logoAlt,
  subtitle,
  navItems,
  user,
  header,
  footer,
  belowTitle,
}: SidebarShellProps) {
  const { isOpen, close } = useSidebar()
  const { conversations } = useApp()
  const chatBadge = formatBadgeCount(getUnreadChatCount(conversations))

  return (
    <div className="flex min-h-screen bg-paper">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden shrink-0 flex-col border-r border-stone-300 bg-stone-100 transition-all duration-200 ease-in-out md:static md:flex ${
          isOpen
            ? 'w-60 translate-x-0 md:w-60'
            : 'w-60 -translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden md:border-r-0'
        }`}
      >
        <div className="border-b border-stone-300 px-5 py-6">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={logoAlt ?? title}
              className="h-8 w-auto max-w-full object-contain object-left mix-blend-multiply"
            />
          ) : (
            <h1 className="font-serif text-lg font-semibold tracking-tight text-stone-900">
              {title}
            </h1>
          )}
          {belowTitle ?? <p className="mt-0.5 text-xs text-stone-600">{subtitle}</p>}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => {
                    if (window.matchMedia('(max-width: 767px)').matches) close()
                  }}
                  className={({ isActive }) =>
                    `flex items-center justify-between border-l-2 px-3 py-2 text-sm transition ${
                      isActive
                        ? 'border-accent bg-white font-medium text-stone-900'
                        : 'border-transparent text-stone-600 hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900'
                    }`
                  }
                >
                  {item.label}
                  {item.badge && (
                    <span className="rounded-full bg-stone-200 px-1.5 py-0.5 text-xs font-medium tabular-nums text-stone-700">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-stone-300 px-5 py-4">
          <p className="text-sm font-medium text-stone-900">{user.name}</p>
          <p className="text-xs text-stone-600">{user.role}</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-stone-300 bg-stone-100 px-4 py-3 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              {logoSrc ? (
                <img
                  src={logoSrc}
                  alt={logoAlt ?? title}
                  className="h-7 w-auto max-w-full object-contain object-left mix-blend-multiply"
                />
              ) : (
                <h1 className="font-serif text-base font-semibold tracking-tight text-stone-900">{title}</h1>
              )}
              <p className="mt-0.5 truncate text-xs text-stone-600">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/chat"
                aria-label="Open chat"
                className="relative rounded p-1.5 text-stone-700 transition hover:bg-stone-100"
              >
                <ChatIcon />
                {chatBadge ? <IconBadge label={chatBadge} /> : null}
              </Link>
              <NotificationBell />
              <LanguageSwitcher />
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full border border-stone-300 object-cover"
              />
            </div>
          </div>
          {belowTitle ? <div className="mt-3">{belowTitle}</div> : null}
        </div>
        {header}
        <main className="flex-1 px-4 py-4 pb-24 md:px-10 md:py-10 md:pb-10">
          <Outlet />
        </main>
        {footer && (
          <footer className="border-t border-stone-300 px-6 py-4 text-sm text-stone-600 md:px-10">
            {footer}
          </footer>
        )}
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-300 bg-white/95 px-2 py-2 backdrop-blur md:hidden">
          <ul className="grid grid-cols-5 gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  aria-label={item.label}
                  className={({ isActive }) =>
                    `relative flex min-h-11 items-center justify-center rounded-md px-1 text-center ${
                      isActive ? 'bg-stone-200 font-semibold text-stone-900' : 'text-stone-600'
                    }`
                  }
                >
                  <MobileNavIcon to={item.to} />
                  <span className="sr-only">{item.label}</span>
                  {item.badge ? (
                    <span className="absolute right-1 top-1 rounded-full bg-stone-200 px-1 text-[10px] tabular-nums text-stone-600">
                      {item.badge}
                    </span>
                  ) : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}