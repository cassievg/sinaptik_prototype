import { useMemo, useState, useRef, useCallback, type ReactNode } from 'react'
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
import { getMarkingQuiz, getMcqAutoScore } from '../../data/markingQuizData'
import { getAiMarkingSuggestion } from '../../data/aiMarkingSuggestions'
import AiMarkingPanel from '../../components/AiMarkingPanel'
import PageTitleWithIcon from '../../components/PageTitleWithIcon'
import type { McqQuestion, StructureQuestion } from '../../types'

type MarkingTab = 'mcq' | 'structure'

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="text-emerald-600"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="text-red-600"
    >
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  )
}

function McqQuestionCard({ question }: { question: McqQuestion }) {
  const studentWrong = question.selectedOptionId !== question.correctOptionId

  return (
    <article className="overflow-hidden rounded-lg border border-stone-300 bg-white">
      <div className="border-b border-stone-200 bg-stone-100 px-4 py-3">
        <p className="text-sm font-medium text-stone-900">
          Q{question.number}. {question.prompt}
        </p>
      </div>
      <ul>
        {question.options.map((option) => {
          const isSelected = option.id === question.selectedOptionId
          const isCorrect = option.id === question.correctOptionId
          const showWrong = isSelected && !isCorrect
          const showCorrect = isCorrect && (isSelected || studentWrong)

          return (
            <li
              key={option.id}
              className={`flex items-center justify-between gap-3 border-t border-stone-200 px-4 py-3 text-sm ${
                showWrong ? 'bg-red-50' : showCorrect ? 'bg-emerald-50' : 'bg-white'
              }`}
            >
              <span
                className={
                  showWrong ? 'text-red-900' : showCorrect ? 'text-emerald-900' : 'text-stone-800'
                }
              >
                {option.label}
              </span>
              {isSelected && isCorrect && <CheckIcon />}
              {showWrong && <XIcon />}
              {!isSelected && isCorrect && studentWrong && <CheckIcon />}
            </li>
          )
        })}
      </ul>
    </article>
  )
}

function isCodeLikeAnswer(text: string) {
  return /^\s*(import |def |print\(|class |#)/m.test(text) || (text.includes('\n') && /[=(){};]/.test(text))
}

function renderAnswerWithHighlights(text: string, comments: CommentEntry[]) {
  const phrases = [...new Set(comments.map((c) => c.selectedText).filter(Boolean))]
  const isCode = isCodeLikeAnswer(text)
  const baseClass = `select-text whitespace-pre-wrap text-sm leading-relaxed text-stone-800 ${
    isCode ? 'font-mono' : ''
  }`

  if (phrases.length === 0) {
    return <div className={baseClass}>{text}</div>
  }

  const elements: ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    let earliest = { index: -1, phrase: '' }
    for (const phrase of phrases) {
      const idx = remaining.indexOf(phrase)
      if (idx !== -1 && (earliest.index === -1 || idx < earliest.index)) {
        earliest = { index: idx, phrase }
      }
    }
    if (earliest.index === -1) {
      elements.push(<span key={key++}>{remaining}</span>)
      break
    }
    if (earliest.index > 0) {
      elements.push(<span key={key++}>{remaining.slice(0, earliest.index)}</span>)
    }
    elements.push(
      <mark key={key++} className="rounded bg-sky-200 px-0.5 text-stone-900">
        {earliest.phrase}
      </mark>
    )
    remaining = remaining.slice(earliest.index + earliest.phrase.length)
  }

  return <div className={baseClass}>{elements}</div>
}

function StructureQuestionCard({
  question,
  score,
  saved,
  aiAccepted,
  onScoreChange,
  onSaveScore,
  onAcceptAi,
  mentionables,
  author,
  learnerName,
  comments,
  onAddComment,
}: {
  question: StructureQuestion
  score: string
  saved: boolean
  aiAccepted: boolean
  onScoreChange: (value: string) => void
  onSaveScore: () => void
  onAcceptAi: () => void
  mentionables: MentionableUser[]
  author: { name: string; avatar: string }
  learnerName: string
  comments: CommentEntry[]
  onAddComment: (
    text: string,
    mentions: MentionableUser[],
    contextLabel?: string,
    offsetTop?: number
  ) => void
}) {
  const { t } = useLanguage()
  const answerRef = useRef<HTMLDivElement>(null)
  const [selection, setSelection] = useState<{ text: string; top: number } | null>(null)
  const aiSuggestion = useMemo(() => getAiMarkingSuggestion(question), [question])

  const inlineComments = comments.filter((c) => c.selectedText)
  const generalComments = comments.filter((c) => !c.selectedText)

  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || !answerRef.current) return

    const selectedText = sel.toString().trim()
    if (!selectedText) return

    const range = sel.getRangeAt(0)
    if (!answerRef.current.contains(range.commonAncestorContainer)) return

    const rect = range.getBoundingClientRect()
    const containerRect = answerRef.current.getBoundingClientRect()
    setSelection({
      text: selectedText,
      top: rect.bottom - containerRect.top + answerRef.current.scrollTop + 8,
    })
  }, [])

  const handleAddComment = (
    text: string,
    mentions: MentionableUser[],
    contextLabel?: string,
    offsetTop = 0
  ) => {
    onAddComment(text, mentions, contextLabel, offsetTop)
    setSelection(null)
    window.getSelection()?.removeAllRanges()
  }

  return (
    <article className="overflow-hidden rounded-lg border border-stone-300 bg-white">
      <div className="border-b border-stone-200 bg-stone-100 px-4 py-3">
        <p className="text-sm font-medium text-stone-900">
          Q{question.number}. {question.prompt}
        </p>
      </div>
      <div className="grid gap-0 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0">
          <div className="relative border-b border-stone-200 px-4 py-4">
            <p className="mb-2 text-xs text-stone-500">{t('marking.highlight')}</p>
            <div ref={answerRef} onMouseUp={handleMouseUp} className="relative">
              {renderAnswerWithHighlights(question.answer, comments)}

              {selection && (
                <div className="absolute z-20 w-full max-w-md" style={{ top: selection.top, left: 0 }}>
                  <CommentBox
                    mentionables={mentionables}
                    author={author}
                    contextLabel={selection.text}
                    compact
                    onSubmit={(text, mentions, ctx) =>
                      handleAddComment(text, mentions, ctx, selection.top)
                    }
                    onCancel={() => setSelection(null)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 px-4 py-5">
            <div>
              <p className="text-sm font-medium text-stone-900">{t('marking.score')}</p>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={question.maxScore}
                  value={score}
                  onChange={(e) => onScoreChange(e.target.value)}
                  placeholder="—"
                  className="w-20 rounded-md border border-stone-300 px-3 py-2 text-center font-serif text-lg focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
                <span className="text-sm text-stone-500">/ {question.maxScore}</span>
                <button
                  type="button"
                  onClick={onSaveScore}
                  disabled={score.trim() === ''}
                  className={`flex h-9 w-9 items-center justify-center rounded-md border transition ${
                    saved
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-stone-300 bg-white text-stone-600 hover:bg-stone-50'
                  }`}
                  aria-label={t('marking.saveScore')}
                  title={t('marking.saveScore')}
                >
                  <CheckIcon />
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-stone-900">{t('marking.comment')}</p>
              <p className="mt-1 text-xs text-stone-600">
                {t('marking.tagMentor', { name: learnerName })}
              </p>
              <div className="mt-3">
                <CommentBox
                  mentionables={mentionables}
                  author={author}
                  placeholder={t('marking.addComment')}
                  onSubmit={(text, mentions) => onAddComment(text, mentions)}
                />
              </div>
            </div>

            {comments.length > 0 && (
              <div>
                <p className="text-sm font-medium text-stone-900">
                  {t('marking.comments', { count: comments.length })}
                </p>
                <ul className="mt-3 space-y-2">
                  {[...inlineComments, ...generalComments].map((c) => (
                    <li key={c.id} className="border border-stone-200 bg-stone-50 p-3 text-sm">
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
                      <p className="mt-1 text-stone-800">{renderCommentText(c.text)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-stone-200 bg-stone-50/40 p-4 lg:border-l lg:border-t-0">
          <AiMarkingPanel
            suggestion={aiSuggestion}
            maxScore={question.maxScore}
            accepted={aiAccepted}
            onAccept={onAcceptAi}
          />
        </div>
      </div>
    </article>
  )
}

export default function MarkingPage() {
  const { submissionId } = useParams<{ submissionId: string }>()
  const { data, getSubmissionById, resolveSubmission, completeTaskBySubmission, saveSubmissionMentorGrading } =
    useApp()
  const { t } = useLanguage()
  const { tasksReturn, backToLearner } = useReturnNavigation()
  const navigate = useNavigate()
  const location = useLocation()

  const submission = submissionId ? getSubmissionById(submissionId) : undefined
  const learner = submission ? data.learners.find((l) => l.id === submission.learnerId) : undefined
  const quiz = submission ? getMarkingQuiz(submission) : null

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

  const [tab, setTab] = useState<MarkingTab>('mcq')
  const [structureScores, setStructureScores] = useState<Record<string, string>>({})
  const [savedScores, setSavedScores] = useState<Record<string, boolean>>({})
  const [structureComments, setStructureComments] = useState<Record<string, CommentEntry[]>>({})
  const [aiAccepted, setAiAccepted] = useState<Record<string, boolean>>({})

  const addStructureComment = (
    questionId: string,
    text: string,
    mentions: MentionableUser[],
    contextLabel?: string,
    offsetTop = 0
  ) => {
    setStructureComments((prev) => ({
      ...prev,
      [questionId]: [
        ...(prev[questionId] ?? []),
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
      ],
    }))
  }

  const acceptAiMarking = (question: StructureQuestion) => {
    const suggestion = getAiMarkingSuggestion(question)
    setStructureScores((prev) => ({ ...prev, [question.id]: String(suggestion.score) }))
    setSavedScores((prev) => ({ ...prev, [question.id]: true }))
    setAiAccepted((prev) => ({ ...prev, [question.id]: true }))
    setStructureComments((prev) => {
      const existing = prev[question.id] ?? []
      const alreadyHasAi = existing.some((c) => c.id.startsWith('ai-'))
      if (alreadyHasAi) return prev
      return {
        ...prev,
        [question.id]: [
          ...existing,
          {
            id: `ai-${question.id}`,
            text: suggestion.feedback,
            selectedText: '',
            offsetTop: 0,
            mentions: [],
            authorName: t('marking.aiAssistant'),
            authorAvatar: '',
            createdAt: new Date().toISOString(),
          },
        ],
      }
    })
  }

  const mcqScore = quiz ? getMcqAutoScore(quiz) : { earned: 0, total: 0 }

  const allStructureScored =
    quiz !== null &&
    quiz.structure.every((q) => {
      const raw = structureScores[q.id]?.trim() ?? ''
      if (raw === '') return false
      const n = Number(raw)
      return !Number.isNaN(n) && n >= 0 && n <= q.maxScore && savedScores[q.id]
    })

  const handleMark = () => {
    if (!learner || !submission || !allStructureScored || !quiz) return

    const structureTotal = quiz.structure.reduce((sum, q) => {
      const n = Number(structureScores[q.id])
      return sum + (Number.isNaN(n) ? 0 : n)
    }, 0)
    const structureMax = quiz.structure.reduce((sum, q) => sum + q.maxScore, 0)

    const allComments = quiz.structure.flatMap((q) => structureComments[q.id] ?? [])
    const generalComment = allComments.find((c) => !c.selectedText)
    const mentorFeedback =
      generalComment?.text ??
      allComments[0]?.text ??
      t('marking.markedFallback')

    saveSubmissionMentorGrading(submission.id, {
      mentorScore: structureTotal,
      mentorScoreMax: structureMax,
      mentorFeedback,
      mentorComments: allComments.map((c) => ({
        id: c.id,
        text: c.text,
        selectedText: c.selectedText || undefined,
        authorName: c.authorName,
        createdAt: c.createdAt,
      })),
    })

    resolveSubmission(learner.id)
    completeTaskBySubmission(submission.id)
    navigate('/tasks')
  }

  if (!submission || !learner || !quiz) {
    return (
      <div>
        <BackButton to={tasksReturn.returnTo} label={tasksReturn.returnLabel} />
        <p className="mt-4 text-stone-500">{t('marking.notFound')}</p>
      </div>
    )
  }

  const back = resolveBackNavigation(
    location.state,
    `/learners/${learner.id}`,
    backToLearner(learner.name)
  )

  return (
    <div>
      <BackButton to={back.to} label={back.label} />

      <PageTitleWithIcon title={t('marking.title')} icon="marking" className="mt-4" />
      <p className="page-subtitle">
        {submission.assignmentTitle} · {submission.moduleTitle}
      </p>
      <p className="mt-1 text-sm text-stone-600">{learner.name}</p>

      <div className="mt-8 border-b-2 border-stone-300">
        <nav className="-mb-0.5 flex gap-8">
          <button
            type="button"
            onClick={() => setTab('mcq')}
            className={`border-b-2 pb-2.5 text-sm transition ${
              tab === 'mcq'
                ? 'border-stone-900 font-medium text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t('marking.mcq')}
          </button>
          <button
            type="button"
            onClick={() => setTab('structure')}
            className={`border-b-2 pb-2.5 text-sm transition ${
              tab === 'structure'
                ? 'border-stone-900 font-medium text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {t('marking.structure')}
          </button>
        </nav>
      </div>

      {tab === 'mcq' ? (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-stone-600">
            {t('marking.autoGraded')}{' '}
            <span className="font-medium text-stone-900">
              {t('marking.correct', { earned: mcqScore.earned, total: mcqScore.total })}
            </span>
          </p>
          {quiz.multipleChoice.map((question) => (
            <McqQuestionCard key={question.id} question={question} />
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <p className="text-sm text-stone-600">{t('marking.mentorGraded')}</p>
          {quiz.structure.map((question) => (
            <StructureQuestionCard
              key={question.id}
              question={question}
              score={structureScores[question.id] ?? ''}
              saved={Boolean(savedScores[question.id])}
              aiAccepted={Boolean(aiAccepted[question.id])}
              onScoreChange={(value) => {
                setStructureScores((prev) => ({ ...prev, [question.id]: value }))
                setSavedScores((prev) => ({ ...prev, [question.id]: false }))
                setAiAccepted((prev) => ({ ...prev, [question.id]: false }))
              }}
              onSaveScore={() => {
                const raw = structureScores[question.id]?.trim() ?? ''
                const n = Number(raw)
                if (raw !== '' && !Number.isNaN(n) && n >= 0 && n <= question.maxScore) {
                  setSavedScores((prev) => ({ ...prev, [question.id]: true }))
                }
              }}
              onAcceptAi={() => acceptAiMarking(question)}
              mentionables={mentionables}
              author={data.currentUser}
              learnerName={learner.name}
              comments={structureComments[question.id] ?? []}
              onAddComment={(text, mentions, contextLabel, offsetTop) =>
                addStructureComment(question.id, text, mentions, contextLabel, offsetTop)
              }
            />
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end border-t border-stone-200 pt-6">
        <button
          type="button"
          onClick={handleMark}
          disabled={!allStructureScored}
          className="btn-primary min-w-[120px]"
        >
          {t('marking.mark')}
        </button>
      </div>
    </div>
  )
}
