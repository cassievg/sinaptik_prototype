import type { ReactNode } from 'react'

type PageIcon =
  | 'dashboard'
  | 'tasks'
  | 'learners'
  | 'inbox'
  | 'programs'
  | 'marking'
  | 'review'

export default function PageTitleWithIcon({
  title,
  icon,
  className = '',
}: {
  title: ReactNode
  icon: PageIcon
  className?: string
}) {
  return (
    <h1 className={`page-title flex items-center gap-2 ${className}`}>
      <span aria-hidden className="inline-flex h-6 w-6 items-center justify-center text-stone-700">
        <TitleIcon icon={icon} />
      </span>
      <span>{title}</span>
    </h1>
  )
}

function TitleIcon({ icon }: { icon: PageIcon }) {
  const base = 'h-5 w-5'

  switch (icon) {
    case 'dashboard':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-10.5z" />
        </svg>
      )
    case 'tasks':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M8 3v3M16 3v3M4 9h16" />
          <rect x="4" y="5" width="16" height="16" rx="2" />
        </svg>
      )
    case 'learners':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <circle cx="17.5" cy="9" r="2.5" />
          <path d="M14.5 20c.2-2 1.3-3.7 3-4.8" />
        </svg>
      )
    case 'inbox':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M15 18H5l1.3-1.3a2 2 0 0 0 .6-1.4V10a5 5 0 0 1 10 0v5.3a2 2 0 0 0 .6 1.4L19 18h-4z" />
          <path d="M10 20a2 2 0 0 0 4 0" />
        </svg>
      )
    case 'programs':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
          <path d="M8 9h8M8 13h8M8 17h5" />
        </svg>
      )
    case 'marking':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M4 4h16v16H4z" />
          <path d="M8 9h8M8 13h5M15.5 15.5l3-3 1.5 1.5-3 3H15.5z" />
        </svg>
      )
    case 'review':
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M4 4h16v12H7l-3 3V4z" />
          <path d="M8 8h8M8 12h5" />
        </svg>
      )
  }
}
