import { useApp } from '../context/AppContext'

const statusLabels = {
  COMPLETED: 'Completed',
  IN_PROGRESS: 'In progress',
  LOCKED: 'Locked',
}

export default function LearnerModulesPage() {
  const { data } = useApp()
  const modules = data.learnerSession.modules

  return (
    <div>
      <h1 className="page-title">My modules</h1>
      <p className="page-subtitle">Program curriculum and completion status</p>

      <div className="mt-8 space-y-2">
        {modules.map((mod, idx) => (
          <div key={mod.id} className="card flex items-center justify-between border-stone-300 px-4 py-3">
            <div>
              <p className="text-xs text-stone-500">Module {idx + 1}</p>
              <h2 className="text-sm font-medium text-stone-900">{mod.title}</h2>
              <p className="text-xs text-stone-600">{statusLabels[mod.status]}</p>
            </div>
            {mod.score !== null && (
              <span className="font-serif text-lg text-stone-900">{mod.score}/100</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
