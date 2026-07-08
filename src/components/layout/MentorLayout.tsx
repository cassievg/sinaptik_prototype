import { useApp } from '../../context/AppContext'
import { useLanguage } from '../../context/LanguageContext'
import SidebarShell from './SidebarShell'
import MentorHeader from './MentorHeader'
import CourseSwitcher from '../CourseSwitcher'
import {
  getUnreadNotificationCount,
  getPendingTaskCount,
  formatBadgeCount,
} from '../../utils/mockDataHelpers'

export default function MentorLayout() {
  const { data, notifications, tasks, selectedCourse } = useApp()
  const { t } = useLanguage()
  const unreadNotifications = getUnreadNotificationCount(notifications)
  const pendingTasks = getPendingTaskCount(tasks)

  const navItems = [
    { to: '/', label: t('nav.dashboard'), end: true },
    { to: '/tasks', label: t('nav.tasks'), badge: formatBadgeCount(pendingTasks) },
    { to: '/learners', label: t('nav.learners') },
    {
      to: '/notifications',
      label: t('nav.inbox'),
      badge: formatBadgeCount(unreadNotifications),
    },
    { to: '/programs', label: t('nav.courseCatalog') },
  ]

  return (
    <SidebarShell
      logoSrc="/sinaptik-logo.png"
      logoAlt="Sinaptik"
      subtitle={t('nav.mentorPortal')}
      belowTitle={<CourseSwitcher />}
      navItems={navItems}
      header={<MentorHeader />}
      user={{
        name: data.currentUser.name,
        avatar: data.currentUser.avatar,
        role: t('nav.mentorRole', {
          cohort: selectedCourse?.cohortName ?? data.cohort.name,
        }),
      }}
    />
  )
}
