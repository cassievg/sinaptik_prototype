import { useState, useRef, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import BackButton from '../components/BackButton'
import CommentBox, {
  buildMentionables,
  renderCommentText,
  type CommentEntry,
  type MentionableUser,
} from '../components/CommentBox'

export default function RequestedReviewPage() {
  const { requestId } = useParams<{ requestId: string }>()
  const { data, reviewRequests, getSubmissionById, resolveSubmission } = useApp()
  const navigate = useNavigate()
  const contentRef = useRef<HTMLPreElement>(null)

  const request = reviewRequests.find((r) => r.id === requestId)
  const submission = request ? getSubmissionById(request.submissionId) : undefined
  const learner = request ? data.learners.find((l) => l.id === request.learnerId) : undefined
  const isResolved = request?.status === 'RESOLVED'

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
  const [selection, setSelection] = useState<{ text: string; top: number } | null>(null)

  const canMark = !isResolved && comments.length > 0

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
    if (isResolved) return
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
    })
  }, [isResolved])

  const handleMark = () => {
    if (!learner || !canMark) return
    resolveSubmission(learner.id)
    navigate('/mentor/tasks')
  }

  if (!request || !submission || !learner) {
    return (
      <div>
        <BackButton to="/mentor/tasks" label="Back to tasks" />
        <p className="mt-4 text-stone-500">Review request not found.</p>
      </div>
    )
  }

  const inlineComments = comments.filter((c) => c.selectedText)
  const generalComments = comments.filter((c) => !c.selectedText)

  return (
    <div>
      <BackButton to={`/mentor/learner/${learner.id}`} label={`Back to ${learner.name}`} />

      <h1 className="page-title mt-4">Requested review</h1>
      <p className="page-subtitle">
        {submission.assignmentTitle} · {submission.moduleTitle} · {learner.name}
      </p>
      <p className="mt-1 text-sm text-stone-600">
        Reply with comments on the student&apos;s work — they receive your mentor feedback directly.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card border-stone-300 p-6">
            <h2 className="section-title">Student submission</h2>
            <div className="relative mt-4">
              <pre
                ref={contentRef}
                onMouseUp={handleMouseUp}
                className={`overflow-x-auto border border-stone-300 bg-stone-50 p-4 font-mono text-sm text-stone-800 ${
                  isResolved ? '' : 'select-text'
                }`}
              >
                {submission.content}
              </pre>
              {!isResolved && selection && (
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

          <section className="card border-amber-300 bg-amber-50/40 p-6">
            <h2 className="section-title">Student question</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-800">{request.studentMessage}</p>
          </section>

          {!isResolved && (
            <section className="card border-stone-300 p-4">
              <h2 className="section-title">Mentor response</h2>
              <p className="mt-1 text-xs text-stone-600">
                Highlight text above or type @ to tag {learner.name}.
              </p>
              <div className="mt-4">
                <CommentBox
                  mentionables={mentionables}
                  author={data.currentUser}
                  placeholder={`Answer @${learner.name} about their submission...`}
                  onSubmit={(text, mentions) => addComment(text, mentions)}
                />
              </div>
            </section>
          )}
        </div>

        <section className="card h-fit border-stone-300 p-6 lg:col-span-1">
          <h2 className="section-title">Comments ({comments.length})</h2>
          {isResolved && request.mentorFeedback ? (
            <div className="mt-4 border border-stone-200 p-3">
              <p className="text-xs text-stone-500">{data.currentUser.name}</p>
              <p className="mt-1 text-sm text-stone-800">{request.mentorFeedback}</p>
            </div>
          ) : comments.length === 0 ? (
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

      {!isResolved && (
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
      )}
    </div>
  )
}
