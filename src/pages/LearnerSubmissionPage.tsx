import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function LearnerSubmissionPage() {
  const { data, submitMentorRequest, acceptFeedback } = useApp()
  const { assignment, aiEvaluation } = data.learnerSession
  const mentor = data.learnerSession.assignedMentor

  const [submitted, setSubmitted] = useState(aiEvaluation.status === 'GRADED')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
    }, 1200)
  }

  const handleSendRequest = () => {
    if (!reason.trim()) return
    submitMentorRequest(reason)
    setShowModal(false)
  }

  return (
    <div>
      <h1 className="page-title">{assignment.title}</h1>
      <p className="page-subtitle">Assignment submission and AI evaluation</p>

      {data.learnerPendingReview && (
        <div className="mt-6 border border-stone-400 bg-stone-50 px-4 py-3 text-sm text-stone-800">
          Your request has been sent to mentor <strong>{mentor.name}</strong>. Please wait for
          feedback.
        </div>
      )}

      {data.learnerCompleted && (
        <div className="mt-6 border border-stone-400 bg-stone-50 px-4 py-3 text-sm text-stone-800">
          Module marked as complete.
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="section-title">Assignment prompt</h2>
          <p className="mt-3 text-sm leading-relaxed text-stone-700">{assignment.prompt}</p>

          <h2 className="section-title mt-8">Your submission</h2>
          <pre className="mt-3 overflow-x-auto border border-stone-300 bg-stone-50 p-4 font-mono text-sm leading-relaxed text-stone-800">
            {assignment.submittedContent}
          </pre>

          {!submitted && !data.learnerCompleted && (
            <button onClick={handleSubmit} disabled={loading} className="btn-primary mt-6">
              {loading ? 'Grading...' : 'Submit assignment'}
            </button>
          )}
        </section>

        <section className="card p-6">
          <h2 className="section-title">AI feedback</h2>

          {!submitted && !data.learnerPendingReview && !data.learnerCompleted ? (
            <p className="mt-6 text-sm text-stone-500">
              Submit your assignment to receive AI feedback.
            </p>
          ) : (
            <>
              <p className="mt-4 font-serif text-3xl font-semibold text-stone-900">
                {aiEvaluation.score}
                <span className="text-lg font-normal text-stone-500"> / 100</span>
              </p>

              <p className="mt-4 text-sm font-medium text-stone-800">
                {aiEvaluation.feedbackSummary}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {aiEvaluation.detailedFeedback}
              </p>

              {!data.learnerPendingReview && !data.learnerCompleted && (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button onClick={acceptFeedback} className="btn-primary flex-1">
                    Accept feedback and complete
                  </button>
                  <button onClick={() => setShowModal(true)} className="btn-secondary flex-1">
                    Request mentor review
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 p-4">
          <div className="w-full max-w-md border border-stone-300 bg-white p-6">
            <h3 className="section-title">Request mentor review</h3>
            <p className="mt-1 text-sm text-stone-600">
              Describe what you need help with.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. I do not understand why dropping nulls is problematic here."
              rows={4}
              className="mt-4 w-full border border-stone-300 p-3 text-sm focus:border-accent focus:outline-none"
            />
            <div className="mt-4 flex gap-3">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={!reason.trim()}
                className="btn-primary flex-1"
              >
                Send request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
