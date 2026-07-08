import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import { useSidebar } from '../../context/SidebarContext'
import { formatBadgeCount, getUnreadChatCount } from '../../utils/mockDataHelpers'
import NotificationBell from '../NotificationBell'
import LanguageSwitcher from '../LanguageSwitcher'

function IconBadge({ label }: { label: string }) {
  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
      {label}
    </span>
  )
}

export default function MentorHeader() {
  const { data, conversations } = useApp()
  const { t } = useLanguage()
  const { isOpen, toggle } = useSidebar()
  const location = useLocation()
  const onChat = location.pathname.startsWith('/chat')
  const chatBadge = formatBadgeCount(getUnreadChatCount(conversations))

  return (
    <header className="hidden items-center gap-3 border-b border-stone-300 bg-paper px-6 py-3 md:flex md:gap-4 md:px-10">
      <button
        type="button"
        onClick={toggle}
        className="rounded p-1.5 text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
        aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
        aria-expanded={isOpen}
      >
        <MenuIcon />
      </button>

      <div className="ml-auto flex items-center gap-3 md:gap-4">
        <Link
          to="/chat"
          className={`relative rounded p-1.5 transition hover:bg-stone-100 ${onChat ? 'bg-stone-200' : ''}`}
          title={t('header.chat')}
          aria-label={
            chatBadge
              ? t('header.openChatUnread', { count: chatBadge })
              : t('header.openChat')
          }
        >
          <ChatIcon />
          {chatBadge && <IconBadge label={chatBadge} />}
        </Link>
        <NotificationBell />
        <LanguageSwitcher />
        <img
          src={data.currentUser.avatar}
          alt={data.currentUser.name}
          className="h-8 w-8 rounded-full border border-stone-300 object-cover"
        />
      </div>
    </header>
  )
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}
