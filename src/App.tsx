import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LearnerLayout from './components/LearnerLayout'
import MentorLayout from './components/MentorLayout'
import LearnerSubmissionPage from './pages/LearnerSubmissionPage'
import LearnerModulesPage from './pages/LearnerModulesPage'
import LearnerProgressPage from './pages/LearnerProgressPage'
import LearnerTestsPage from './pages/LearnerTestsPage'
import MentorDashboardPage from './pages/MentorDashboardPage'
import MentorLearnersPage from './pages/MentorLearnersPage'
import MentorProgramsPage from './pages/MentorProgramsPage'
import MentorAlertsPage from './pages/MentorAlertsPage'
import LearnerProfilePage from './pages/LearnerProfilePage'
import FeedbackViewPage from './pages/FeedbackViewPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Learner portal — separate layout */}
      <Route path="/learner" element={<LearnerLayout />}>
        <Route index element={<LearnerSubmissionPage />} />
        <Route path="modules" element={<LearnerModulesPage />} />
        <Route path="tests" element={<LearnerTestsPage />} />
        <Route path="progress" element={<LearnerProgressPage />} />
      </Route>

      {/* Mentor portal — separate layout */}
      <Route path="/mentor" element={<MentorLayout />}>
        <Route index element={<MentorDashboardPage />} />
        <Route path="learners" element={<MentorLearnersPage />} />
        <Route path="programs" element={<MentorProgramsPage />} />
        <Route path="alerts" element={<MentorAlertsPage />} />
        <Route path="learner/:learnerId" element={<LearnerProfilePage />} />
        <Route path="feedback/:learnerId" element={<FeedbackViewPage />} />
      </Route>
    </Routes>
  )
}
