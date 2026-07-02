import { useApp } from '../context/AppContext'

export default function LearnerProgressPage() {
  const { data } = useApp()
  const learner = data.learners.find((l) => l.id === 'l1')
  const modules = data.learnerSession.modules
  const completed = modules.filter((m) => m.status === 'COMPLETED').length
  const progressPct = Math.round((completed / modules.length) * 100)

  if (!learner) return null

  return (
    <div>
      <h1 className="page-title">My progress</h1>
      <p className="page-subtitle">Overview of learning outcomes</p>

      <div className="mt-8 grid gap-4 border border-stone-300 sm:grid-cols-3">
        <div className="p-4 text-center">
          <p className="font-serif text-3xl font-semibold">{progressPct}%</p>
          <p className="text-sm text-stone-600">Program progress</p>
        </div>
        <div className="border-l border-stone-300 p-4 text-center">
          <p className="font-serif text-3xl font-semibold">{learner.avgScore}</p>
          <p className="text-sm text-stone-600">Average score</p>
        </div>
        <div className="border-l border-stone-300 p-4 text-center">
          <p className="font-serif text-3xl font-semibold">{learner.engagementScore}</p>
          <p className="text-sm text-stone-600">Engagement score</p>
        </div>
      </div>

      <section className="card mt-8 border-stone-300 p-6">
        <h2 className="section-title">Skill breakdown</h2>
        <div className="mt-6 space-y-4">
          {learner.skills.map((skill) => (
            <div key={skill.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-stone-700">{skill.name}</span>
                <span className="text-stone-500">{skill.progress}%</span>
              </div>
              <div className="h-1.5 bg-stone-200">
                <div className="h-full bg-accent" style={{ width: `${skill.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
