import { NavLink, Outlet } from 'react-router-dom'

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

export default function SidebarShell({
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
  return (
    <div className="flex min-h-screen bg-paper">
      <aside className="flex w-56 shrink-0 flex-col border-r border-stone-300 bg-stone-100 md:w-60">
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

        <nav className="flex-1 px-3 py-4">
          <ul className="space-y-0.5">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
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
        {header}
        <main className="flex-1 px-6 py-8 md:px-10 md:py-10">
          <Outlet />
        </main>
        {footer && (
          <footer className="border-t border-stone-300 px-6 py-4 text-sm text-stone-600 md:px-10">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
