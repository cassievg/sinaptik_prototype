import { Link, useNavigate } from 'react-router-dom'

interface BackButtonProps {
  to?: string
  onClick?: () => void
  label: string
  className?: string
}

export function BackIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function BackButton({ to, onClick, label, className = '' }: BackButtonProps) {
  const navigate = useNavigate()
  const base =
    'inline-flex items-center justify-center rounded border border-stone-300 p-1.5 text-stone-700 transition hover:bg-stone-100 hover:text-stone-900'

  if (to) {
    return (
      <Link to={to} className={`${base} ${className}`} aria-label={label} title={label}>
        <BackIcon />
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick ?? (() => navigate(-1))}
      className={`${base} ${className}`}
      aria-label={label}
      title={label}
    >
      <BackIcon />
    </button>
  )
}
