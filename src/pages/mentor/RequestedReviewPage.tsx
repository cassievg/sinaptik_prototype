import { useState, useRef, useCallback, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/layout/BackButton'
import { resolveBackNavigation, useReturnNavigation } from '../../utils/taskNavigation'
import CommentBox, {
  buildMentionables,
  renderCommentText,
  type CommentEntry,
  type MentionableUser,
} from '../../components/CommentBox'
import PageTitleWithIcon from '../../components/PageTitleWithIcon'

export default function RequestedReviewPage() {
  const { requestId } = useParams<{ requestId: string }>()
  const { data, reviewRequests, getSubmissionById, resolveReviewRequest } = useApp()
  const { t, dateLocale } = useLanguage()
  const { tasksReturn, backToLearner } = useReturnNavigation()
  const navigate = useNavigate()
  const location = useLocation()
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
    if (!learner || !canMark || !request) return
    const general = comments.find((c) => !c.selectedText)
    const reviewResponse =
      general?.text ?? comments[0]?.text ?? t('review.resolvedNote')
    resolveReviewRequest(request.id, reviewResponse)
    navigate('/tasks')
  }

  if (!request || !submission || !learner) {
    return (
      <div>
        <BackButton to={tasksReturn.returnTo} label={tasksReturn.returnLabel} />
        <p className="mt-4 text-stone-500">{t('review.notFound')}</p>
      </div>
    )
  }

  const inlineComments = comments.filter((c) => c.selectedText)
  const generalComments = comments.filter((c) => !c.selectedText)
  const back = resolveBackNavigation(
    location.state,
    `/learners/${learner.id}`,
    backToLearner(learner.name)
  )

  const hasPriorMentorGrading = submission.mentorScore !== undefined
  const scoreMax = submission.mentorScoreMax ?? 10
  const priorComments = submission.mentorComments ?? []

  return (
    <div>
      <BackButton to={back.to} label={back.label} />

      <PageTitleWithIcon title={t('review.title')} icon="review" className="mt-4" />
      <p className="page-subtitle">
        {submission.assignmentTitle} · {submission.moduleTitle} · {learner.name}
      </p>
      <p className="mt-1 text-sm text-stone-600">{t('review.subtitle')}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="card border-stone-300 p-6">
            <h2 className="section-title">{t('review.studentSubmission')}</h2>
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

          <section className="card border-stone-300 p-6">
            <h2 className="section-title">{t('review.priorFeedback')}</h2>
            <p className="mt-1 text-xs text-stone-500">{t('review.priorFeedbackDesc')}</p>

            {hasPriorMentorGrading ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl font-semibold text-stone-900">
                      {submission.mentorScore}
                    </span>
                    <span className="text-sm text-stone-500">/ {scoreMax}</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">{data.currentUser.name}</p>
                  {submission.mentorFeedback && (
                    <p className="mt-3 text-sm leading-relaxed text-stone-800">
                      {submission.mentorFeedback}
                    </p>
                  )}
                </div>

                {priorComments.length > 0 && (
                  <ul className="space-y-2">
                    {priorComments.map((c) => (
                      <li key={c.id} className="rounded-md border border-stone-200 bg-white p-3">
                        <p className="text-xs text-stone-500">
                          {c.authorName}
                          {c.selectedText && (
                            <>
                              {' '}
                              ·{' '}
                              {t('marking.onText', {
                                text:
                                  c.selectedText.slice(0, 40) +
                                  (c.selectedText.length > 40 ? '…' : ''),
                              })}
                            </>
                          )}
                        </p>
                        <p className="mt-1 text-sm text-stone-800">{renderCommentText(c.text)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-stone-500">{t('review.noMarking')}</p>
            )}
          </section>

          <section className="card border-amber-300 bg-amber-50/40 p-6">
            <h2 className="section-title">{t('review.studentQuestion')}</h2>
            <p className="mt-3 text-sm leading-relaxed text-stone-800">{request.studentMessage}</p>
            <p className="mt-2 text-xs text-stone-500">
              {learner.name} ·{' '}
              {new Date(request.createdAt).toLocaleDateString(dateLocale, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </section>

          <section className="card border-stone-300 p-6">
            <h2 className="section-title">{t('review.mentorResponse')}</h2>
            {isResolved && request.reviewResponse ? (
              <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs text-stone-500">
                  {data.currentUser.name}
                  {t('review.resolvedBadge')}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-stone-800">
                  {request.reviewResponse}
                </p>
              </div>
            ) : (
              <>
                <p className="mt-1 text-xs text-stone-600">
                  {t('review.tagHint', { name: learner.name })}
                </p>
                <div className="mt-4">
                  <CommentBox
                    mentionables={mentionables}
                    author={data.currentUser}
                    placeholder={t('review.answerPlaceholder', { name: learner.name })}
                    onSubmit={(text, mentions) => addComment(text, mentions)}
                  />
                </div>
              </>
            )}
          </section>
        </div>

        <section className="card h-fit border-stone-300 p-6 lg:col-span-1">
          <h2 className="section-title">{t('marking.comments', { count: comments.length })}</h2>
          {comments.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">{t('review.noComments')}</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {[...inlineComments, ...generalComments].map((c) => (
                <li key={c.id} className="border border-stone-200 p-3">
                  <p className="text-xs text-stone-500">
                    {c.authorName}
                    {c.selectedText && t('review.inContext')}
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
            {t('review.mark')}
          </button>
        </div>
      )}
    </div>
  )
}
