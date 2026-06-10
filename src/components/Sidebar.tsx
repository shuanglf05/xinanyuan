import { useAppStore } from '@/store'
import {
  LayoutDashboard,
  Mic,
  FileText,
  FolderOpen,
  Database,
  Settings,
  LogOut,
  Building2,
  User,
  CheckSquare
} from 'lucide-react'

const menuItems = [
  { id: 'dashboard', label: '首页', icon: LayoutDashboard },
  { id: 'record', label: '实时记录', icon: Mic },
  { id: 'recordings', label: '历史记录', icon: FileText },
  { id: 'minutes', label: '纪要生成', icon: FolderOpen },
  { id: 'tasks', label: '我的任务', icon: CheckSquare },
  { id: 'organize', label: '智能整理', icon: Database },
  { id: 'knowledge', label: '知识库', icon: Settings },
]

export default function Sidebar() {
  const { currentPage, setCurrentPage, logout, user } = useAppStore()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-800">智能会议</h1>
            <p className="text-xs text-gray-500">记录系统</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <div
                  className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => setCurrentPage(item.id)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              </li>
            )
          })}
        </ul>

        {user?.role === 'administrator' && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div
              className={`sidebar-item ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentPage('admin')}
            >
              <Settings className="w-5 h-5" />
              <span>系统管理</span>
            </div>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500">
              {user?.role === 'administrator' && '管理员'}
              {user?.role === 'department_head' && '部门负责人'}
              {user?.role === 'employee' && '普通员工'}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
