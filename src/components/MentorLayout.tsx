import { useApp } from '../context/AppContext'
import SidebarShell from './SidebarShell'
import MentorHeader from './MentorHeader'
import CourseSwitcher from './CourseSwitcher'
import {
  getUnreadNotificationCount,
  getPendingTaskCount,
  formatBadgeCount,
} from '../utils/mockDataHelpers'

export default function MentorLayout() {
  const { data, notifications, tasks, selectedCourse } = useApp()
  const unreadNotifications = getUnreadNotificationCount(notifications)
  const pendingTasks = getPendingTaskCount(tasks)

  const navItems = [
    { to: '/', label: 'Dashboard', end: true },
    { to: '/tasks', label: 'Tasks', badge: formatBadgeCount(pendingTasks) },
    { to: '/learners', label: 'Learners' },
    {
      to: '/notifications',
      label: 'Inbox',
      badge: formatBadgeCount(unreadNotifications),
    },
    { to: '/programs', label: 'Course catalog' },
  ]

  return (
    <SidebarShell
      logoSrc="/sinaptik-logo.png"
      logoAlt="Sinaptik"
      subtitle="Mentor portal"
      belowTitle={<CourseSwitcher />}
      navItems={navItems}
      header={<MentorHeader />}
      user={{
        name: data.currentUser.name,
        avatar: data.currentUser.avatar,
        role: `Mentor · ${selectedCourse?.cohortName ?? data.cohort.name}`,
      }}
    />
  )
}
