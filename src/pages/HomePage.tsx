import { Link } from 'react-router-dom'
import { fields, mentors, programs } from '../data/sinaptikCatalog'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper p-6">
      <div className="mx-auto max-w-4xl">
        <header className="border-b border-stone-300 pb-8">
          <p className="text-sm text-stone-500">sinaptik.id</p>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-stone-900">Sinaptik</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
            Indonesia&apos;s learning platform for data, AI, software engineering, product,
            leadership, marketing, finance, and design — guided by industry practitioners.
          </p>
        </header>

        <section className="mt-10">
          <h2 className="section-title">Our mentors</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((m) => (
              <div key={m.id} className="border border-stone-300 bg-stone-900 p-4 text-white">
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="mx-auto h-20 w-20 rounded-full border-2 border-stone-600"
                />
                <h3 className="mt-3 text-center font-medium">{m.name}</h3>
                <p className="mt-1 text-center text-xs text-stone-300">{m.title}</p>
                <Link
                  to="/mentor/programs"
                  className="mt-4 block bg-accent py-2 text-center text-xs font-medium text-white hover:bg-brand-700"
                >
                  View details
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="section-title">Learning fields</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map((field) => {
              const count = programs.filter((p) => p.fieldId === field.id).length
              return (
                <div key={field.id} className="border border-stone-300 bg-white p-4">
                  <h3 className="font-medium text-stone-900">{field.name}</h3>
                  <p className="mt-1 text-sm text-stone-600">{field.description}</p>
                  <p className="mt-2 text-xs text-stone-500">{count} programs available</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="section-title">Enter the platform</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              to="/learner"
              className="border border-stone-300 bg-white px-4 py-4 text-sm font-medium text-stone-900 transition hover:border-accent"
            >
              Learner portal
              <p className="mt-1 text-xs font-normal text-stone-500">
                Submit assignments, get AI feedback, take skill tests
              </p>
            </Link>
            <Link
              to="/mentor"
              className="border border-stone-300 bg-white px-4 py-4 text-sm font-medium text-stone-900 transition hover:border-accent"
            >
              Mentor portal
              <p className="mt-1 text-xs font-normal text-stone-500">
                Command center, cohort analytics, in-context grading
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
