import { useApp } from '../context/AppContext'
import { fields, getMentorById } from '../data/sinaptikCatalog'

export default function MentorProgramsPage() {
  const { programs, data } = useApp()

  return (
    <div>
      <h1 className="page-title">Sinaptik course catalog</h1>
      <p className="page-subtitle">
        All programs on sinaptik.id — {data.cohort.totalLearners} active learners in demo cohort
      </p>

      <div className="mt-8 space-y-10">
        {fields.map((field) => {
          const fieldPrograms = programs.filter((p) => p.fieldId === field.id)
          if (fieldPrograms.length === 0) return null

          return (
            <section key={field.id}>
              <h2 className="section-title">{field.name}</h2>
              <p className="mt-1 text-sm text-stone-600">{field.description}</p>

              <div className="mt-4 space-y-4">
                {fieldPrograms.map((prog) => {
                  const mentor = getMentorById(prog.mentorId)
                  const isActive = prog.id === data.cohort.programId

                  return (
                    <article key={prog.id} className="card border-stone-300 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="font-medium text-stone-900">{prog.name}</h3>
                          <p className="mt-2 text-sm text-stone-600">{prog.description}</p>
                          <p className="mt-2 text-xs text-stone-500">
                            {prog.durationWeeks} weeks · {prog.modules.length} modules · Mentor:{' '}
                            {mentor?.name}
                          </p>
                        </div>
                        {isActive && (
                          <span className="border border-accent px-2 py-1 text-xs text-accent">
                            Active cohort: {data.cohort.name}
                          </span>
                        )}
                      </div>
                      <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-stone-600">
                        {prog.modules.map((m) => (
                          <li key={m.id}>{m.title}</li>
                        ))}
                      </ol>
                    </article>
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
