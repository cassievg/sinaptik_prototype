import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import { fields, getMentorById, type Program } from '../../data/sinaptikCatalog'
import PageTitleWithIcon from '../../components/PageTitleWithIcon'

function ProgramCard({
  prog,
  isActive,
  activeCohortLabel,
}: {
  prog: Program
  isActive: boolean
  activeCohortLabel?: string
}) {
  const { t } = useLanguage()
  const mentor = getMentorById(prog.mentorId)

  return (
    <article className="card overflow-hidden border-stone-300">
      <div className="border-b border-stone-200 bg-stone-50/80 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-serif text-lg font-semibold text-stone-900">{prog.name}</h3>
            <p className="mt-1 text-sm text-stone-600">{prog.description}</p>
          </div>
          {isActive && activeCohortLabel && (
            <span className="shrink-0 rounded-full border border-accent bg-white px-3 py-1 text-xs font-medium text-accent">
              {t('programs.active', { cohort: activeCohortLabel })}
            </span>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            {t('programs.weeksModules', {
              weeks: prog.durationWeeks,
              count: prog.modules.length,
            })}
          </p>
          {mentor && (
            <div className="flex items-center gap-2.5 rounded-lg border border-stone-200 bg-white px-3 py-2">
              <img
                src={mentor.avatar}
                alt=""
                className="h-9 w-9 rounded-full object-cover ring-1 ring-stone-200"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
                  {t('programs.mentor')}
                </p>
                <p className="truncate text-sm font-medium text-stone-900">{mentor.name}</p>
                <p className="truncate text-xs text-stone-500">{mentor.title}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-xs font-medium uppercase tracking-wide text-stone-400">
          {t('programs.modules')}
        </p>
        <ol className="mt-2 space-y-1.5">
          {prog.modules.map((m, i) => (
            <li key={m.id} className="flex gap-2 text-sm text-stone-700">
              <span className="w-5 shrink-0 tabular-nums text-stone-400">{i + 1}.</span>
              <span>{m.title}</span>
            </li>
          ))}
        </ol>
      </div>
    </article>
  )
}

export default function MentorProgramsPage() {
  const { programs, data } = useApp()
  const { t } = useLanguage()

  return (
    <div>
      <PageTitleWithIcon title={t('programs.title')} icon="programs" />
      <p className="page-subtitle">
        {t('programs.subtitle', { count: data.cohort.totalLearners })}
      </p>

      <div className="mt-8 space-y-10">
        {fields.map((field) => {
          const fieldPrograms = programs.filter((p) => p.fieldId === field.id)
          if (fieldPrograms.length === 0) return null

          return (
            <section key={field.id}>
              <h2 className="section-title">{field.name}</h2>
              <p className="mt-1 text-sm text-stone-600">{field.description}</p>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {fieldPrograms.map((prog) => {
                  const isActive = data.mentorCourseIds.includes(prog.id)
                  const activeCohortLabel =
                    prog.activeCohortName ??
                    (prog.id === data.cohort.programId ? data.cohort.name : undefined)

                  return (
                    <ProgramCard
                      key={prog.id}
                      prog={prog}
                      isActive={isActive}
                      activeCohortLabel={activeCohortLabel}
                    />
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
