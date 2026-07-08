import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import CollapsibleSection from '../../components/CollapsibleSection'
import PageTitleWithIcon from '../../components/PageTitleWithIcon'
import {
  getTasksForDate,
  getCalendarDayStatus,
  groupTasksByCourseModule,
  getTaskRoute,
  type CalendarDayStatus,
} from '../../utils/mockDataHelpers'
import { useReturnNavigation } from '../../utils/taskNavigation'
import type { MentorTask } from '../../types'

function dotColor(status: CalendarDayStatus, selected: boolean): string {
  if (status === 'complete') return selected ? 'bg-emerald-300' : 'bg-emerald-600'
  if (status === 'upcoming') return selected ? 'bg-amber-300' : 'bg-amber-500'
  return selected ? 'bg-red-300' : 'bg-red-600'
}

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const ANCHOR = new Date('2026-07-08T12:00:00+07:00')
const TODAY_ISO = '2026-07-08'

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

function taskLabel(
  task: MentorTask,
  t: (key: string, params?: Record<string, string | number>) => string
) {
  if (task.type === 'REVIEW_REQUEST') {
    return t('tasks.reviewRequested', {
      name: task.learnerName,
      assignment: task.assignmentTitle,
      module: task.moduleTitle,
    })
  }
  return t('tasks.submitted', {
    name: task.learnerName,
    assignment: task.assignmentTitle,
    module: task.moduleTitle,
  })
}

export default function MentorTasksPage() {
  const { tasks } = useApp()
  const { t, dateLocale } = useLanguage()
  const [viewYear, setViewYear] = useState(2026)
  const [viewMonth, setViewMonth] = useState(6)
  const [selectedDate, setSelectedDate] = useState(TODAY_ISO)

  const dayStatusByDate = useMemo(() => getCalendarDayStatus(tasks, TODAY_ISO), [tasks])
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
  const monthLabel = new Date(viewYear, viewMonth).toLocaleString(dateLocale, {
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
      <PageTitleWithIcon title={t('tasks.title')} icon="tasks" />
      <p className="page-subtitle">{t('tasks.uncompleted', { count: uncompletedWeek })}</p>

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
                  aria-label={t('tasks.nextMonth')}
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  className="px-1 text-stone-500 hover:text-stone-900"
                  aria-label={t('tasks.prevMonth')}
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
                const today = isToday(day)
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => setSelectedDate(iso)}
                    className={`relative flex h-9 flex-col items-center justify-center rounded-full text-sm transition ${
                      selected
                        ? 'bg-stone-800 font-semibold text-white'
                        : today
                          ? 'font-semibold text-stone-900 ring-1 ring-inset ring-stone-400 hover:bg-stone-100'
                          : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {day}
                    {dayStatus && (
                      <span
                        className={`absolute bottom-0.5 h-1.5 w-1.5 rounded-full ${dotColor(
                          dayStatus,
                          selected
                        )}`}
                        aria-hidden
                      />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-stone-200 pt-3 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600" aria-hidden />
                {t('tasks.due')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
                {t('tasks.upcoming')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden />
                {t('tasks.done')}
              </span>
            </div>
          </div>

          <div className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString(dateLocale, {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>

            <div className="mt-2 space-y-1">
              {dayTasks.length === 0 ? (
                <p className="py-4 text-sm text-stone-500">{t('tasks.noTasks')}</p>
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
                        title={t('tasks.requestReview')}
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
  const { toggleTaskStatus } = useApp()
  const { t } = useLanguage()
  const { tasksReturn } = useReturnNavigation()
  const done = task.status === 'COMPLETED'

  return (
    <li className="flex items-start gap-3 text-sm">
      <button
        type="button"
        onClick={() => toggleTaskStatus(task.id)}
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border transition hover:border-stone-600 ${
          done ? 'border-stone-400 bg-stone-100 text-stone-600' : 'border-stone-400 bg-white'
        }`}
        aria-label={done ? t('tasks.markIncomplete') : t('tasks.markComplete')}
        aria-pressed={done}
      >
        {done ? '✕' : ''}
      </button>
      <span className={`min-w-0 flex-1 ${done ? 'text-stone-500 line-through' : 'text-stone-800'}`}>
        {taskLabel(task, t)}
      </span>
      <Link
        to={getTaskRoute(task)}
        state={tasksReturn}
        className="shrink-0 text-accent hover:underline"
      >
        {t('tasks.view')}
      </Link>
    </li>
  )
}
