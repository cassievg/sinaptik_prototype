import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/layout/BackButton'
import LearnerProfileDetail from '../../components/LearnerProfileDetail'
import { resolveBackNavigation, useReturnNavigation } from '../../utils/taskNavigation'

function MessageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

export default function LearnerProfilePage() {
  const { learnerId } = useParams<{ learnerId: string }>()
  const { data } = useApp()
  const { t } = useLanguage()
  const { backToLearners } = useReturnNavigation()
  const location = useLocation()

  const learner = data.learners.find((l) => l.id === learnerId)

  const logs = useMemo(
    () =>
      data.activityLogs
        .filter((log) => log.learnerId === learnerId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [data.activityLogs, learnerId]
  )

  if (!learner) {
    return <p className="text-stone-500">{t('profile.notFound')}</p>
  }

  const back = resolveBackNavigation(location.state, '/learners', backToLearners)

  return (
    <div>
      <BackButton to={back.to} label={back.label} />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <h1 className="page-title">{learner.name}</h1>
        <Link
          to={`/chat/${learner.id}`}
          className="rounded p-1 text-stone-600 hover:bg-stone-100 hover:text-stone-900"
          title={t('chat.messageLearner')}
        >
          <MessageIcon />
        </Link>
      </div>

      <div className="mt-6">
        <LearnerProfileDetail learner={learner} logs={logs} />
      </div>
    </div>
  )
}
