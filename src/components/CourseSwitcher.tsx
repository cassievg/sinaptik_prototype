import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CourseSwitcher() {
  const { mentorCourses, selectedCourse, selectedCourseId, setSelectedCourseId } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  if (mentorCourses.length <= 1) {
    return (
      <p className="mt-0.5 truncate text-xs text-stone-600" title={selectedCourse?.cohortName}>
        {selectedCourse?.cohortName ?? 'Mentor portal'}
      </p>
    )
  }

  return (
    <div ref={ref} className="relative mt-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-md border border-stone-300 bg-white px-2.5 py-1.5 text-left transition hover:border-stone-400"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="min-w-0">
          <span className="block text-[10px] uppercase tracking-wide text-stone-500">Course</span>
          <span className="block truncate text-xs font-medium text-stone-900">
            {selectedCourse?.name}
          </span>
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-1 overflow-hidden rounded-md border border-stone-300 bg-white shadow-lg"
        >
          {mentorCourses.map((course) => {
            const active = course.id === selectedCourseId
            return (
              <li key={course.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setSelectedCourseId(course.id)
                    setOpen(false)
                  }}
                  className={`block w-full px-3 py-2 text-left transition ${
                    active ? 'bg-stone-100' : 'hover:bg-stone-50'
                  }`}
                >
                  <span className="block truncate text-xs font-medium text-stone-900">
                    {course.name}
                  </span>
                  <span className="block truncate text-[10px] text-stone-500">
                    {course.cohortName}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
