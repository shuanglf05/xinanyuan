import { useAppStore } from '@/store'
import LoginPage from '@/components/LoginPage'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/pages/Dashboard'
import RecordPage from '@/pages/RecordPage'
import RecordingListPage from '@/pages/RecordingListPage'
import TasksPage from '@/pages/TasksPage'
import MinutesPage from '@/pages/MinutesPage'
import OrganizePage from '@/pages/OrganizePage'
import KnowledgePage from '@/pages/KnowledgePage'
import AdminPage from '@/pages/AdminPage'

export default function App() {
  const { isLoggedIn, currentPage, user } = useAppStore()

  if (!isLoggedIn) {
    return <LoginPage />
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'record':
        return <RecordPage />
      case 'recordings':
        return <RecordingListPage />
      case 'tasks':
        return <TasksPage />
      case 'minutes':
        return <MinutesPage />
      case 'organize':
        return <OrganizePage />
      case 'knowledge':
        return <KnowledgePage />
      case 'admin':
        if (user?.role === 'administrator') {
          return <AdminPage />
        }
        return <Dashboard />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        {renderPage()}
      </main>
    </div>
  )
}
