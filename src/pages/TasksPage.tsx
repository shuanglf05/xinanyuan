import { useState } from 'react'
import {
  CheckCircle,
  Circle,
  Calendar,
  User,
  Clock,
  Filter,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Save
} from 'lucide-react'

const mockTasks = [
  { id: '1', title: '制定区域销售计划', assignee: '李主管', deadline: '2024-07-15', status: 'pending', source: '第三季度销售会议纪要', priority: 'high' },
  { id: '2', title: '数据分析与报表', assignee: '王助理', deadline: '每周五', status: 'pending', source: '第三季度销售会议纪要', priority: 'medium' },
  { id: '3', title: '客户跟进与维护', assignee: '陈专员', deadline: '持续进行', status: 'in_progress', source: '第三季度销售会议纪要', priority: 'low' },
  { id: '4', title: '准备项目复盘材料', assignee: '张经理', deadline: '2024-07-20', status: 'pending', source: '项目周会纪要', priority: 'high' },
  { id: '5', title: '更新技术文档', assignee: '技术组', deadline: '2024-07-18', status: 'completed', source: '技术评审会议纪要', priority: 'medium' },
]

export default function TasksPage() {
  const [tasks, setTasks] = useState(mockTasks)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [editingTask, setEditingTask] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
        : task
    ))
  }

  const handleEdit = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      setEditingTask(taskId)
      setEditTitle(task.title)
    }
  }

  const handleSaveEdit = () => {
    if (editingTask && editTitle.trim()) {
      setTasks(tasks.map(task =>
        task.id === editingTask
          ? { ...task, title: editTitle.trim() }
          : task
      ))
    }
    setEditingTask(null)
    setEditTitle('')
  }

  const handleDelete = (taskId: string) => {
    if (confirm('确定要删除这个任务吗？')) {
      setTasks(tasks.filter(task => task.id !== taskId))
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '高优先级'
      case 'medium': return '中优先级'
      case 'low': return '低优先级'
      default: return priority
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'in_progress': return 'bg-blue-100 text-blue-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '已完成'
      case 'in_progress': return '进行中'
      default: return '待处理'
    }
  }

  const pendingCount = tasks.filter(t => t.status !== 'completed').length
  const completedCount = tasks.filter(t => t.status === 'completed').length

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">任务管理</h1>
          <p className="text-gray-500 mt-1">查看和管理从会议纪要中提取的任务</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          添加任务
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">待处理任务</p>
              <p className="text-3xl font-bold mt-1">{pendingCount}</p>
            </div>
            <Circle className="w-12 h-12 text-white/20" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">已完成任务</p>
              <p className="text-3xl font-bold mt-1">{completedCount}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-white/20" />
          </div>
        </div>
        <div className="card bg-gradient-to-br from-accent-500 to-accent-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">任务总数</p>
              <p className="text-3xl font-bold mt-1">{tasks.length}</p>
            </div>
            <Clock className="w-12 h-12 text-white/20" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索任务..."
                className="input-field pl-10 w-64"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field w-32"
              >
                <option value="all">全部状态</option>
                <option value="pending">待处理</option>
                <option value="in_progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all ${
                task.status === 'completed'
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-1"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 hover:text-primary-500" />
                  )}
                </button>
                <div className="flex-1">
                  {editingTask === task.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="input-field flex-1"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingTask(null)}
                        className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <h4 className={`font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                      {task.title}
                    </h4>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {task.assignee}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {task.deadline}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">来源: {task.source}</p>
                </div>
                <div className="flex items-center gap-2">
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleEdit(task.id)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>暂无任务</p>
            <button className="mt-4 btn-primary">
              添加任务
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
