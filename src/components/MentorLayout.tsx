import { useApp } from '../context/AppContext'
import SidebarShell from './SidebarShell'

export default function MentorLayout() {
  const { data } = useApp()
  const pendingCount = data.learners.filter((l) => l.status === 'PENDING_MENTOR').length
  const alertCount = data.activityLogs.filter((l) => l.requiresAction).length

  const navItems = [
    { to: '/mentor', label: 'Command center', end: true, badge: pendingCount || undefined },
    { to: '/mentor/learners', label: 'All learners' },
    { to: '/mentor/programs', label: 'Course catalog' },
    { to: '/mentor/alerts', label: 'Alerts & actions', badge: alertCount || undefined },
  ]

  return (
    <SidebarShell
      title="Sinaptik"
      subtitle="Mentor portal"
      navItems={navItems}
      user={{
        name: data.currentUser.name,
        avatar: data.currentUser.avatar,
        role: `Mentor · ${data.cohort.name}`,
      }}
    />
  )
}
