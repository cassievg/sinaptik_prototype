import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import BackButton from '../../components/layout/BackButton'
import LearnerProfileDetail from '../../components/LearnerProfileDetail'
import { buildChatLearnerList, formatBadgeCount } from '../../utils/mockDataHelpers'
import { resolveBackNavigation, useReturnNavigation } from '../../utils/taskNavigation'

import NotificationBell from '../../components/NotificationBell'

function ChatHeaderIcons() {
  const { t } = useLanguage()
  return (
    <div className="flex items-center gap-3">
      <Link to="/chat" className="rounded p-1.5 bg-stone-200" aria-label={t('header.chat')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      </Link>
      <NotificationBell />
    </div>
  )
}

export default function MentorChatPage() {
  const { data, conversations, markConversationRead } = useApp()
  const { t } = useLanguage()
  const { backToDashboard } = useReturnNavigation()
  const { learnerId: paramLearnerId } = useParams<{ learnerId?: string }>()
  const location = useLocation()

  const myLearners = useMemo(
    () => data.learners.filter((l) => l.assignedMentor.id === data.currentUser.id),
    [data.learners, data.currentUser.id]
  )

  const learnerList = useMemo(
    () => buildChatLearnerList(conversations, myLearners),
    [conversations, myLearners]
  )

  const activeId = paramLearnerId
  const activeConversation = activeId
    ? conversations.find((c) => c.learnerId === activeId)
    : undefined
  const activeLearner = activeId ? data.learners.find((l) => l.id === activeId) : undefined

  const [draft, setDraft] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)

  const headerLabel =
    activeConversation?.courseLabel ?? activeLearner?.enrollmentLabel ?? t('chat.learnerChat')

  const back = resolveBackNavigation(location.state, '/', backToDashboard)
  const listBack = { to: '/chat', label: t('chat.title') }

  const activityLogs = useMemo(
    () =>
      activeLearner
        ? data.activityLogs
            .filter((log) => log.learnerId === activeLearner.id)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        : [],
    [data.activityLogs, activeLearner]
  )

  useEffect(() => {
    if (paramLearnerId) markConversationRead(paramLearnerId)
  }, [paramLearnerId, markConversationRead])

  useEffect(() => {
    setProfileOpen(false)
  }, [paramLearnerId])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-paper">
      <div className="flex shrink-0 items-center gap-4 border-b border-stone-300 px-4 py-3 md:px-6">
        <BackButton to={activeId ? listBack.to : back.to} label={activeId ? listBack.label : back.label} />
        <h1 className="font-serif text-lg font-semibold text-stone-900">{t('chat.title')}</h1>
        <div className="ml-auto">
          <ChatHeaderIcons />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside
          className={`w-full shrink-0 overflow-y-auto border-r border-stone-300 bg-stone-50 md:w-72 ${
            activeConversation ? 'hidden md:block' : 'block'
          }`}
        >
          <p className="border-b border-stone-200 px-4 py-3 text-xs font-medium uppercase tracking-wide text-stone-500">
            {t('chat.learners')}
          </p>
          <ul>
            {learnerList.map((item) => {
              const active = item.learnerId === activeId
              const unreadBadge = formatBadgeCount(item.unreadCount)
              const hasUnread = item.unreadCount > 0

              return (
                <li key={item.learnerId}>
                  <Link
                    to={`/chat/${item.learnerId}`}
                    className={`flex gap-3 border-l-2 px-3 py-3 transition ${
                      active
                        ? 'border-stone-900 bg-white'
                        : hasUnread
                          ? 'border-transparent bg-amber-50/60 hover:bg-amber-50'
                          : 'border-transparent hover:bg-stone-100'
                    }`}
                  >
                    <img
                      src={`https://i.pravatar.cc/150?u=${item.learnerId}`}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-full border border-stone-300"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`truncate text-sm ${
                            hasUnread ? 'font-semibold text-stone-900' : 'font-medium text-stone-900'
                          }`}
                        >
                          {item.name}
                        </p>
                        {unreadBadge && (
                          <span className="flex h-5 min-w-[1.25rem] shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                            {unreadBadge}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-stone-500">{item.courseLabel}</p>
                      {item.lastMessage && (
                        <p
                          className={`mt-0.5 truncate text-xs ${
                            hasUnread ? 'font-medium text-stone-700' : 'text-stone-400'
                          }`}
                        >
                          {item.lastMessage}
                        </p>
                      )}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </aside>

        <div
          className={`min-h-0 min-w-0 flex-1 ${activeConversation ? 'flex' : 'hidden md:flex'}`}
        >
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            {activeConversation && activeLearner ? (
              <>
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  className={`flex w-full shrink-0 items-center gap-3 border-b border-stone-200 px-6 py-4 text-left transition hover:bg-stone-50 ${
                    profileOpen ? 'bg-stone-50' : ''
                  }`}
                >
                  <img
                    src={activeLearner.avatar}
                    alt=""
                    className="h-10 w-10 rounded-full border border-stone-300"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-stone-900">{activeConversation.learnerName}</p>
                    <p className="text-xs text-stone-500">{headerLabel}</p>
                  </div>
                  <span className="shrink-0 text-xs text-accent">
                    {profileOpen ? t('chat.hideProfile') : t('chat.viewProfile')}
                  </span>
                </button>

                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6">
                  {activeConversation.messages.map((msg) => {
                    const isMentor = msg.senderRole === 'MENTOR'
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMentor ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-lg rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
                            isMentor
                              ? 'bg-stone-200 text-stone-900'
                              : 'border border-stone-300 bg-white text-stone-800'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="shrink-0 border-t border-stone-300 bg-paper p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={t('chat.placeholder')}
                      className="flex-1 rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    <button type="button" className="btn-primary px-4" aria-label={t('chat.sendAria')}>
                      {t('chat.send')}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-sm text-stone-500">
                {t('chat.selectLearner')}
              </div>
            )}
          </div>

          {profileOpen && activeLearner && (
            <aside className="hidden w-[360px] shrink-0 overflow-y-auto border-l border-stone-300 bg-paper p-4 lg:block">
              <LearnerProfileDetail learner={activeLearner} logs={activityLogs} compact />
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
