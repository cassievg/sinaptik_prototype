import { useApp } from '../context/AppContext'
import SidebarShell from './SidebarShell'
import { programs } from '../data/sinaptikCatalog'

const navItems = [
  { to: '/learner', label: 'Current assignment', end: true },
  { to: '/learner/modules', label: 'My modules' },
  { to: '/learner/tests', label: 'Skill assessments' },
  { to: '/learner/progress', label: 'My progress' },
]

export default function LearnerLayout() {
  const { data } = useApp()
  const user = data.learnerSession.currentUser
  const mentor = data.learnerSession.assignedMentor
  const program = programs.find((p) => p.id === data.learnerSession.programId)

  return (
    <SidebarShell
      title="Sinaptik Learn"
      subtitle={program?.name ?? 'Learner portal'}
      navItems={navItems}
      user={{ name: user.name, avatar: user.avatar, role: 'Learner' }}
      footer={
        <p>
          Mentor: <span className="font-medium text-stone-900">{mentor.name}</span>
        </p>
      }
    />
  )
}
