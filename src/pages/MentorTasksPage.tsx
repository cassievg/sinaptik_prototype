import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import CollapsibleSection from '../components/CollapsibleSection'
import {
  getTasksForDate,
  getCalendarDayStatus,
  groupTasksByCourseModule,
  getTaskRoute,
} from '../utils/mockDataHelpers'
import { TASKS_RETURN } from '../utils/taskNavigation'
import type { MentorTask } from '../types'

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const ANCHOR = new Date('2026-07-06T12:00:00+07:00')

function formatIsoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function buildMonthGrid(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

function taskLabel(task: MentorTask) {
  const action =
    task.type === 'REVIEW_REQUEST' ? 'has requested feedback on' : 'has submitted'
  return `${task.learnerName} ${action} ${task.assignmentTitle} in ${task.moduleTitle}.`
}

export default function MentorTasksPage() {
  const { tasks } = useApp()
  const [viewYear, setViewYear] = useState(2026)
  const [viewMonth, setViewMonth] = useState(6)
  const [selectedDate, setSelectedDate] = useState(formatIsoDate(2026, 6, 3))

  const dayStatusByDate = useMemo(() => getCalendarDayStatus(tasks), [tasks])
  const dayTasks = useMemo(() => getTasksForDate(tasks, selectedDate), [tasks, selectedDate])

  const submissionGroups = useMemo(() => {
    const subs = dayTasks.filter((t) => t.type === 'SUBMISSION')
    return groupTasksByCourseModule(subs)
  }, [dayTasks])

  const reviewTasks = useMemo(
    () => dayTasks.filter((t) => t.type === 'REVIEW_REQUEST'),
    [dayTasks]
  )

  const uncompletedWeek = tasks.filter((t) => t.status === 'PENDING').length
  const monthLabel = new Date(viewYear, viewMonth).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  })
  const cells = buildMonthGrid(viewYear, viewMonth)

  const shiftMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  const isToday = (day: number) =>
    day === ANCHOR.getDate() && viewMonth === ANCHOR.getMonth() && viewYear === ANCHOR.getFullYear()

  const pendingReviewCount = reviewTasks.filter((t) => t.status === 'PENDING').length

  return (
    <div>
      <h1 className="page-title">Tasks</h1>
      <p className="page-subtitle">{uncompletedWeek} uncompleted tasks this week.</p>

      <div className="card mt-8 border-stone-300">
        <div className="grid lg:grid-cols-[280px_1fr]">
          <div className="border-b border-stone-300 p-5 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-semibold text-stone-900">{monthLabel}</h2>
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  className="px-1 text-stone-500 hover:text-stone-900"
                  aria-label="Next month"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  className="px-1 text-stone-500 hover:text-stone-900"
                  aria-label="Previous month"
                >
                  ▼
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs text-stone-500">
              {WEEKDAYS.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
              {cells.map((day, i) => {
                if (day === null) return <span key={`e-${i}`} />
                const iso = formatIsoDate(viewYear, viewMonth, day)
                const selected = iso === selectedDate
                const dayStatus = dayStatusByDate.get(iso)
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setSelectedDate(iso)}
                    className={`relative flex h-9 flex-col items-center justify-center rounded-full text-sm transition ${
                      selected
                        ? 'bg-stone-800 text-white'
                        : isToday(day)
                          ? 'bg-stone-200 text-stone-900'
                          : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {day}
                    {dayStatus && (
                      <span
                        className={`absolute bottom-0.5 h-1.5 w-1.5 rounded-full ${
                          dayStatus === 'complete'
                            ? selected
                              ? 'bg-emerald-300'
                              : 'bg-emerald-600'
                            : selected
                              ? 'bg-red-300'
                              : 'bg-red-600'
                        }`}
                        aria-hidden
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>

            <div className="mt-2 space-y-1">
              {dayTasks.length === 0 ? (
                <p className="py-4 text-sm text-stone-500">No tasks for this date.</p>
              ) : (
                <>
                  {submissionGroups.map((course, courseIdx) => {
                    const courseTaskCount = course.modules.reduce(
                      (sum, m) => sum + m.tasks.length,
                      0
                    )
                    return (
                      <CollapsibleSection
                        key={course.courseId}
                        title={course.courseName}
                        count={courseTaskCount}
                        defaultOpen={courseIdx === 0}
                        level="course"
                      >
                        <div className="space-y-1">
                          {course.modules.map((mod, modIdx) => (
                            <CollapsibleSection
                              key={mod.moduleTitle}
                              title={mod.moduleTitle}
                              count={mod.tasks.length}
                              defaultOpen={courseIdx === 0 && modIdx === 0}
                              level="module"
                            >
                              <ul className="space-y-2">
                                {mod.tasks.map((task) => (
                                  <TaskRow key={task.id} task={task} />
                                ))}
                              </ul>
                            </CollapsibleSection>
                          ))}
                        </div>
                      </CollapsibleSection>
                    )
                  })}

                  {reviewTasks.length > 0 && (
                    <div
                      className={
                        submissionGroups.length > 0 ? 'border-t border-stone-200 pt-2' : ''
                      }
                    >
                      <CollapsibleSection
                        title="Request review"
                        count={reviewTasks.length}
                        defaultOpen={pendingReviewCount > 0}
                        level="section"
                      >
                        <ul className="space-y-2">
                          {reviewTasks.map((task) => (
                            <TaskRow key={task.id} task={task} />
                          ))}
                        </ul>
                      </CollapsibleSection>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TaskRow({ task }: { task: MentorTask }) {
  const done = task.status === 'COMPLETED'
  return (
    <li className="flex items-start gap-3 text-sm">
      <span
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border ${
          done ? 'border-stone-400 bg-stone-100 text-stone-600' : 'border-stone-400'
        }`}
        aria-hidden
      >
        {done ? '✕' : ''}
      </span>
      <span className={`min-w-0 flex-1 ${done ? 'text-stone-500 line-through' : 'text-stone-800'}`}>
        {taskLabel(task)}
      </span>
      <Link
        to={getTaskRoute(task)}
        state={TASKS_RETURN}
        className="shrink-0 text-accent hover:underline"
      >
        View
      </Link>
    </li>
  )
}
