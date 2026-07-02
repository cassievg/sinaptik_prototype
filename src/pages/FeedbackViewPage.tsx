import { useState, useRef, useCallback, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import CommentBox, {
  buildMentionables,
  renderCommentText,
  type CommentEntry,
  type MentionableUser,
} from '../components/CommentBox'

export default function FeedbackViewPage() {
  const { learnerId } = useParams<{ learnerId: string }>()
  const { data, getSubmission, resolveSubmission } = useApp()
  const navigate = useNavigate()
  const contentRef = useRef<HTMLPreElement>(null)

  const learner = data.learners.find((l) => l.id === learnerId)
  const submission = learnerId ? getSubmission(learnerId) : undefined

  const mentors = useMemo(() => {
    const map = new Map<string, { id: string; name: string; avatar: string }>()
    map.set(data.currentUser.id, data.currentUser)
    data.learners.forEach((l) => {
      map.set(l.assignedMentor.id, {
        id: l.assignedMentor.id,
        name: l.assignedMentor.name,
        avatar: l.assignedMentor.avatar,
      })
    })
    return Array.from(map.values())
  }, [data.currentUser, data.learners])

  const mentionables = useMemo(
    () => buildMentionables(data.learners, mentors),
    [data.learners, mentors]
  )

  const [comments, setComments] = useState<CommentEntry[]>([])
  const [selection, setSelection] = useState<{
    text: string
    top: number
    left: number
  } | null>(null)
  const [resolved, setResolved] = useState(false)

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

  const handleResolve = () => {
    if (learnerId) {
      resolveSubmission(learnerId)
      setResolved(true)
      setTimeout(() => navigate('/mentor'), 1500)
    }
  }

  if (!learner) {
    return <p className="text-stone-500">Learner not found.</p>
  }

  if (!submission) {
    return (
      <div>
        <Link to={`/mentor/learner/${learnerId}`} className="text-sm text-accent hover:underline">
          Back to profile
        </Link>
        <p className="mt-4 text-stone-500">No submission available.</p>
      </div>
    )
  }

  const inlineComments = comments.filter((c) => c.selectedText)
  const generalComments = comments.filter((c) => !c.selectedText)

  return (
    <div>
      <div className="flex items-center justify-between">
        <Link to={`/mentor/learner/${learnerId}`} className="text-sm text-accent hover:underline">
          Back to {learner.name}
        </Link>
        <button onClick={handleResolve} disabled={resolved} className="btn-primary">
          {resolved ? 'Resolved' : 'Mark as resolved'}
        </button>
      </div>

      {resolved && (
        <div className="mt-4 border border-stone-400 bg-stone-50 px-4 py-3 text-sm text-stone-800">
          Submission resolved. Redirecting...
        </div>
      )}

      <h1 className="page-title mt-4">Review submission</h1>
      <p className="page-subtitle">
        {learner.name} — {submission.moduleTitle}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card border-stone-300">
            <div className="border-b border-stone-200 px-4 py-3">
              <h2 className="text-sm font-medium text-stone-800">
                Submission (highlight text for in-context comment)
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
                  className="absolute z-10 max-w-xs border border-stone-400 bg-white p-3"
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
            <h2 className="section-title">AI insights</h2>
            <p className="mt-4 font-serif text-3xl font-semibold text-stone-900">
              {submission.aiScore}
              <span className="text-lg font-normal text-stone-500"> / 100</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-stone-600">{submission.aiFeedback}</p>
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
                    {c.mentions.length > 0 && (
                      <p className="mt-2 text-xs text-stone-600">
                        Tagged: {c.mentions.map((m) => m.name).join(', ')}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card border-stone-300 p-4">
            <h2 className="text-sm font-medium text-stone-800">People in thread</h2>
            <ul className="mt-3 space-y-1 text-sm text-stone-700">
              {mentionables.map((u) => (
                <li key={u.id}>
                  {u.name} <span className="text-stone-500">({u.role.toLowerCase()})</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
