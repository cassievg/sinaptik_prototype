import { useState, useRef, useCallback, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import BackButton from '../components/BackButton'
import { resolveBackNavigation } from '../utils/taskNavigation'
import CommentBox, {
  buildMentionables,
  renderCommentText,
  type CommentEntry,
  type MentionableUser,
} from '../components/CommentBox'

export default function MarkingPage() {
  const { submissionId } = useParams<{ submissionId: string }>()
  const { data, getSubmissionById, resolveSubmission } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const contentRef = useRef<HTMLPreElement>(null)

  const submission = submissionId ? getSubmissionById(submissionId) : undefined
  const learner = submission ? data.learners.find((l) => l.id === submission.learnerId) : undefined

  const mentors = useMemo(() => {
    const map = new Map<string, { id: string; name: string; avatar: string }>()
    map.set(data.currentUser.id, data.currentUser)
    if (learner) {
      map.set(learner.assignedMentor.id, {
        id: learner.assignedMentor.id,
        name: learner.assignedMentor.name,
        avatar: learner.assignedMentor.avatar,
      })
    }
    return Array.from(map.values())
  }, [data.currentUser, learner])

  const mentionables = useMemo(
    () => (learner ? buildMentionables([learner], mentors) : buildMentionables([], mentors)),
    [learner, mentors]
  )

  const [comments, setComments] = useState<CommentEntry[]>([])
  const [mentorScore, setMentorScore] = useState('')
  const [selection, setSelection] = useState<{
    text: string
    top: number
    left: number
  } | null>(null)

  const scoreValue = mentorScore.trim() === '' ? null : Number(mentorScore)
  const canMark =
    scoreValue !== null && !Number.isNaN(scoreValue) && scoreValue >= 0 && scoreValue <= 100

  const addComment = (
    text: string,
    mentions: MentionableUser[],
    contextLabel?: string,
    offsetTop = 0
  ) => {
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        text,
        selectedText: contextLabel ?? '',
        offsetTop,
        mentions,
        authorName: data.currentUser.name,
        authorAvatar: data.currentUser.avatar,
        createdAt: new Date().toISOString(),
      },
    ])
    setSelection(null)
    window.getSelection()?.removeAllRanges()
  }

  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !contentRef.current) return

    const selectedText = sel.toString().trim()
    if (!selectedText) return

    const range = sel.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    const containerRect = contentRef.current.getBoundingClientRect()

    setSelection({
      text: selectedText,
      top: rect.bottom - containerRect.top + contentRef.current.scrollTop + 8,
      left: rect.left - containerRect.left,
    })
  }, [])

  const handleMark = () => {
    if (!learner || !canMark) return
    resolveSubmission(learner.id)
    navigate('/mentor/tasks')
  }

  if (!submission || !learner) {
    return (
      <div>
        <BackButton to="/mentor/tasks" label="Back to tasks" />
        <p className="mt-4 text-stone-500">Submission not found.</p>
      </div>
    )
  }

  const inlineComments = comments.filter((c) => c.selectedText)
  const generalComments = comments.filter((c) => !c.selectedText)
  const back = resolveBackNavigation(
    location.state,
    `/mentor/learner/${learner.id}`,
    `Back to ${learner.name}`
  )

  return (
    <div>
      <BackButton to={back.to} label={back.label} />

      <h1 className="page-title mt-4">Marking</h1>
      <p className="page-subtitle">
        {submission.assignmentTitle} · {submission.moduleTitle}
      </p>
      <p className="mt-1 text-sm text-stone-600">{learner.name}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card border-stone-300">
            <div className="border-b border-stone-200 px-4 py-3">
              <h2 className="text-sm font-medium text-stone-800">
                Student work (highlight text to comment)
              </h2>
            </div>
            <div className="relative p-4">
              <pre
                ref={contentRef}
                onMouseUp={handleMouseUp}
                className="select-text overflow-x-auto border border-stone-300 bg-stone-50 p-4 font-mono text-sm leading-relaxed text-stone-800"
              >
                {submission.content}
              </pre>

              {inlineComments.map((c) => (
                <div
                  key={c.id}
                  className="absolute z-10 max-w-xs border border-stone-400 bg-white p-3 shadow-sm"
                  style={{ top: c.offsetTop, left: 16 }}
                >
                  <p className="mb-1 text-xs text-stone-500">
                    On: &quot;{c.selectedText.slice(0, 40)}&quot;
                  </p>
                  <p className="text-sm text-stone-800">{renderCommentText(c.text)}</p>
                </div>
              ))}

              {selection && (
                <div className="absolute z-20 w-full max-w-md" style={{ top: selection.top, left: 0 }}>
                  <CommentBox
                    mentionables={mentionables}
                    author={data.currentUser}
                    contextLabel={selection.text}
                    compact
                    onSubmit={(text, mentions, ctx) =>
                      addComment(text, mentions, ctx, selection.top)
                    }
                    onCancel={() => setSelection(null)}
                  />
                </div>
              )}
            </div>
          </section>

          <section className="card border-stone-300 p-4">
            <h2 className="section-title">Add comment</h2>
            <p className="mt-1 text-xs text-stone-600">
              Type @ to tag {learner.name} or another mentor.
            </p>
            <div className="mt-4">
              <CommentBox
                mentionables={mentionables}
                author={data.currentUser}
                placeholder={`e.g. @${learner.name} — consider using fillna() instead of dropna()`}
                onSubmit={(text, mentions) => addComment(text, mentions)}
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card border-stone-300 p-6">
            <div className="section-heading">
              <h2 className="section-title">Mentor score</h2>
            </div>
            <p className="mt-2 text-xs text-stone-500">
              Grade this submission manually. AI is used elsewhere for cohort analytics and
              at-risk alerts only.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={100}
                value={mentorScore}
                onChange={(e) => setMentorScore(e.target.value)}
                placeholder="—"
                className="w-24 rounded-md border border-stone-300 px-3 py-2 text-center font-serif text-xl focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <span className="text-sm text-stone-500">/ 100</span>
            </div>
          </section>

          <section className="card border-stone-300 p-6">
            <h2 className="section-title">Comments ({comments.length})</h2>
            {comments.length === 0 ? (
              <p className="mt-4 text-sm text-stone-500">No comments yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {[...inlineComments, ...generalComments].map((c) => (
                  <li key={c.id} className="border border-stone-200 p-3">
                    <p className="text-xs text-stone-500">
                      {c.authorName}
                      {c.selectedText && ' · In-context'}
                    </p>
                    <p className="mt-1 text-sm text-stone-800">{renderCommentText(c.text)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <div className="mt-8 flex justify-end border-t border-stone-200 pt-6">
        <button
          type="button"
          onClick={handleMark}
          disabled={!canMark}
          className="btn-primary min-w-[120px]"
        >
          Mark
        </button>
      </div>
    </div>
  )
}
