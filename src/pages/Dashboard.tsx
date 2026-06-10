import { useAppStore } from '@/store'
import {
  Calendar,
  FileText,
  Users,
  TrendingUp,
  Clock,
  ChevronRight,
  Mic,
  FolderOpen,
  Database,
  ArrowRight
} from 'lucide-react'

export default function Dashboard() {
  const { recordings, minutes, documents, user } = useAppStore()

  const stats = [
    {
      title: '本月会议',
      value: recordings.length,
      icon: Calendar,
      color: 'bg-primary-500',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600'
    },
    {
      title: '已生成纪要',
      value: minutes.length,
      icon: FileText,
      color: 'bg-secondary-500',
      bgColor: 'bg-secondary-50',
      textColor: 'text-secondary-600'
    },
    {
      title: '知识库文档',
      value: documents.length,
      icon: Database,
      color: 'bg-accent-500',
      bgColor: 'bg-accent-50',
      textColor: 'text-accent-600'
    },
    {
      title: '待处理任务',
      value: Math.floor(Math.random() * 10),
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
  ]

  const recentMinutes = minutes.slice(0, 3)
  const recentDocuments = documents.slice(0, 3)

  const quickActions = [
    { id: 'record', label: '开始录音', icon: Mic, color: 'from-primary-500 to-primary-600' },
    { id: 'minutes', label: '生成纪要', icon: FileText, color: 'from-secondary-500 to-secondary-600' },
    { id: 'organize', label: '整理文档', icon: FolderOpen, color: 'from-accent-500 to-accent-600' },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">欢迎回来，{user?.name}</h1>
          <p className="text-gray-500 mt-1">这是您的工作概览</p>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Users className="w-5 h-5" />
          <span className="text-sm">在线用户: 128</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          const isTaskCard = stat.title === '待处理任务'
          return (
            <div
              key={stat.title}
              className={`card ${isTaskCard ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
              onClick={() => isTaskCard && useAppStore.getState().setCurrentPage('tasks')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm text-gray-500">
                {isTaskCard ? (
                  <>
                    <span>点击查看详情</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>较上月增长 12%</span>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">快捷操作</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <div
                    key={action.id}
                    className={`bg-gradient-to-br ${action.color} p-5 rounded-xl text-white cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <Icon className="w-8 h-8 mb-3" />
                    <p className="font-medium">{action.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">最近纪要</h2>
              <button className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
                查看全部 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {recentMinutes.length > 0 ? (
                recentMinutes.map((minute) => (
                  <div key={minute.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{minute.title}</p>
                      <p className="text-sm text-gray-500 mt-1">{minute.createdAt.split('T')[0]}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      minute.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      minute.status === 'approved' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {minute.status === 'draft' ? '草稿' : minute.status === 'approved' ? '已审批' : '已归档'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-8">暂无纪要记录</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">知识库更新</h2>
            </div>
            <div className="space-y-3">
              {recentDocuments.length > 0 ? (
                recentDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Database className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{doc.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{doc.type === 'summary' ? '摘要' : doc.type === 'report' ? '报告' : doc.type === 'minute' ? '纪要' : '笔记'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6">暂无文档</p>
              )}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
            <h3 className="font-semibold mb-2">系统通知</h3>
            <p className="text-sm text-white/80">今日已有 3 条新会议记录待处理</p>
            <button className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
              查看详情
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
