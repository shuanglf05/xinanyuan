import { useState } from 'react'
import {
  Users,
  Shield,
  FileText,
  Settings,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Download
} from 'lucide-react'

const mockUsers = [
  { id: '1', name: '管理员', email: 'admin@company.com', role: 'administrator', status: 'active' },
  { id: '2', name: '部门负责人', email: 'manager@company.com', role: 'department_head', status: 'active' },
  { id: '3', name: '员工', email: 'employee@company.com', role: 'employee', status: 'active' },
  { id: '4', name: '测试用户', email: 'test@company.com', role: 'employee', status: 'inactive' },
]

const mockLogs = [
  { id: '1', user: '管理员', action: '登录系统', resource: '-', time: '2024-07-01 15:30:22', ip: '192.168.1.100' },
  { id: '2', user: '员工', action: '生成纪要', resource: '第三季度销售会议纪要', time: '2024-07-01 14:22:15', ip: '192.168.1.101' },
  { id: '3', user: '部门负责人', action: '导出文档', resource: '项目进度周报', time: '2024-07-01 11:05:33', ip: '192.168.1.102' },
  { id: '4', user: '员工', action: '上传音频', resource: '会议录音.mp3', time: '2024-06-30 16:45:18', ip: '192.168.1.101' },
  { id: '5', user: '管理员', action: '查看日志', resource: '操作日志', time: '2024-06-30 09:15:47', ip: '192.168.1.100' },
]

const roles = [
  { value: 'administrator', label: '管理员' },
  { value: 'department_head', label: '部门负责人' },
  { value: 'employee', label: '普通员工' },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'logs'>('users')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editRole, setEditRole] = useState('')

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLogs = mockLogs.filter(log =>
    log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleEdit = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId)
    if (user) {
      setEditingUser(userId)
      setEditRole(user.role)
    }
  }

  const handleSaveEdit = () => {
    setEditingUser(null)
    alert('用户角色已更新！')
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
  }

  const getRoleLabel = (role: string) => {
    return roles.find(r => r.value === role)?.label || role
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      administrator: 'bg-red-100 text-red-700',
      department_head: 'bg-orange-100 text-orange-700',
      employee: 'bg-green-100 text-green-700'
    }
    return colors[role] || 'bg-gray-100 text-gray-700'
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-gray-100 text-gray-700'
  }

  const tabs = [
    { id: 'users', label: '用户管理', icon: Users },
    { id: 'roles', label: '权限配置', icon: Shield },
    { id: 'logs', label: '操作日志', icon: FileText },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">系统管理</h1>
          <p className="text-gray-500 mt-1">用户管理、权限配置和操作审计</p>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Settings className="w-5 h-5" />
          <span className="text-sm">管理员面板</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'users' | 'roles' | 'logs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="card">
        {activeTab === 'users' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">用户列表</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索用户..."
                  className="input-field pl-10 w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">姓名</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">邮箱</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">角色</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">状态</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-gray-500" />
                          </div>
                          <span className="font-medium text-gray-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{user.email}</td>
                      <td className="py-4 px-4">
                        {editingUser === user.id ? (
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="input-field w-32"
                          >
                            {roles.map((role) => (
                              <option key={role.value} value={role.value}>
                                {role.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className={`px-2 py-1 rounded text-xs ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(user.status)}`}>
                          {user.status === 'active' ? '活跃' : '停用'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {editingUser === user.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(user.id)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'roles' && (
          <>
            <h3 className="font-semibold text-gray-800 mb-4">权限配置</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-red-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">管理员</h4>
                    <p className="text-sm text-gray-500">系统最高权限</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-500" />
                    系统管理
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-500" />
                    权限配置
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-500" />
                    数据审计
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-500" />
                    敏感词管理
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">部门负责人</h4>
                    <p className="text-sm text-gray-500">部门级权限</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-orange-500" />
                    部门资料管理
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-orange-500" />
                    审批权限
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-orange-500" />
                    团队成员管理
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="w-4 h-4 text-gray-300" />
                    系统管理
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">普通员工</h4>
                    <p className="text-sm text-gray-500">基础权限</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    会议记录
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    纪要查看
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    文档整理
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    知识库检索
                  </li>
                </ul>
              </div>
            </div>
          </>
        )}

        {activeTab === 'logs' && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">操作日志</h3>
              <button className="btn-outline flex items-center gap-2">
                <Download className="w-4 h-4" />
                导出日志
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">用户</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">操作</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">资源</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">时间</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">IP地址</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium text-gray-800">{log.user}</td>
                      <td className="py-4 px-4 text-gray-600">{log.action}</td>
                      <td className="py-4 px-4 text-gray-500">{log.resource}</td>
                      <td className="py-4 px-4 text-gray-500 text-sm">{log.time}</td>
                      <td className="py-4 px-4 text-gray-500 text-sm">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>显示 1-5 条，共 128 条</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 hover:bg-gray-100 rounded">上一页</button>
                <span className="px-3 py-1 bg-primary-500 text-white rounded">1</span>
                <button className="px-3 py-1 hover:bg-gray-100 rounded">2</button>
                <button className="px-3 py-1 hover:bg-gray-100 rounded">3</button>
                <button className="px-3 py-1 hover:bg-gray-100 rounded">下一页</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
