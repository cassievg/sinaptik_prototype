import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { getQuestionsForTest } from '../data/skillTestQuestions'
import { getFieldById, getMentorById } from '../data/sinaptikCatalog'
import type { SkillTest } from '../data/sinaptikCatalog'

export default function LearnerTestsPage() {
  const { fields, skillTests, testResults, saveTestResult } = useApp()
  const [activeTest, setActiveTest] = useState<SkillTest | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const questions = activeTest ? getQuestionsForTest(activeTest.id) : []

  const handleSubmit = () => {
    if (!activeTest) return
    let correct = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correctIndex) correct++
    })
    const pct = Math.round((correct / questions.length) * 100)
    setScore(pct)
    setSubmitted(true)
    saveTestResult(activeTest.id, pct)
  }

  const closeTest = () => {
    setActiveTest(null)
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  return (
    <div>
      <h1 className="page-title">Skill assessments</h1>
      <p className="page-subtitle">
        Placement tests across all Sinaptik fields — measure your readiness before enrolling
      </p>

      <div className="mt-8 space-y-8">
        {fields.map((field) => {
          const tests = skillTests.filter((t) => t.fieldId === field.id)
          return (
            <section key={field.id}>
              <h2 className="section-title">{field.name}</h2>
              <p className="mt-1 text-sm text-stone-600">{field.description}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {tests.map((test) => {
                  const mentor = getMentorById(test.mentorId)
                  const result = testResults[test.id]
                  return (
                    <div key={test.id} className="card border-stone-300 p-4">
                      <h3 className="font-medium text-stone-900">{test.title}</h3>
                      <p className="mt-1 text-sm text-stone-600">{test.description}</p>
                      <p className="mt-2 text-xs text-stone-500">
                        {test.questionCount} questions · {test.durationMinutes} min · Pass:{' '}
                        {test.passingScore}% · Mentor: {mentor?.name}
                      </p>
                      {result !== undefined && (
                        <p
                          className={`mt-2 text-sm font-medium ${
                            result >= test.passingScore ? 'text-emerald-700' : 'text-stone-700'
                          }`}
                        >
                          Last score: {result}%{' '}
                          {result >= test.passingScore ? '(Passed)' : '(Not passed)'}
                        </p>
                      )}
                      <button
                        onClick={() => {
                          setActiveTest(test)
                          setAnswers({})
                          setSubmitted(false)
                        }}
                        className="btn-primary mt-4 text-sm"
                      >
                        {result !== undefined ? 'Retake test' : 'Start test'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {activeTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-stone-300 bg-white p-6">
            <h3 className="section-title">{activeTest.title}</h3>
            <p className="mt-1 text-sm text-stone-500">
              {getFieldById(activeTest.fieldId)?.name}
            </p>

            {!submitted ? (
              <>
                <div className="mt-6 space-y-6">
                  {questions.map((q, idx) => (
                    <div key={q.id}>
                      <p className="text-sm font-medium text-stone-900">
                        {idx + 1}. {q.question}
                      </p>
                      <div className="mt-2 space-y-1">
                        {q.options.map((opt, oi) => (
                          <label
                            key={oi}
                            className="flex cursor-pointer items-center gap-2 border border-stone-200 px-3 py-2 text-sm hover:bg-stone-50"
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={answers[q.id] === oi}
                              onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <button onClick={closeTest} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length < questions.length}
                    className="btn-primary flex-1"
                  >
                    Submit answers
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-6">
                <p className="font-serif text-4xl font-semibold text-stone-900">{score}%</p>
                <p className="mt-2 text-sm text-stone-600">
                  {score >= activeTest.passingScore
                    ? 'Congratulations! You passed this assessment.'
                    : `Passing score is ${activeTest.passingScore}%. Review the material and try again.`}
                </p>
                <button onClick={closeTest} className="btn-primary mt-6 w-full">
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
