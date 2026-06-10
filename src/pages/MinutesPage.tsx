import { useState } from 'react'
import { useAppStore } from '@/store'
import {
  FileText,
  Download,
  Edit2,
  Save,
  Users,
  Target,
  Clock,
  FileDown,
  Database,
  X,
  Check,
  Tag
} from 'lucide-react'

const mockMinutesContent = `# 会议纪要

## 一、会议主题
第三季度销售目标部署会议

## 二、参会人员
张经理、李主管、王助理、陈专员

## 三、会议议题
1. 上季度销售业绩回顾
2. 第三季度目标制定
3. 资源配置方案讨论
4. 绩效考核标准确定

## 四、部署内容
1. 销售目标：本季度销售额目标为500万元
2. 重点区域：华东、华南区域为重点突破市场
3. 营销策略：加大线上推广投入，优化线下渠道

## 五、责任主体与时限
| 责任人 | 任务 | 完成时限 |
|--------|------|----------|
| 李主管 | 制定区域销售计划 | 2024-07-15 |
| 王助理 | 数据分析与报表 | 每周五 |
| 陈专员 | 客户跟进与维护 | 持续进行 |

## 六、整改要求
1. 每月进行一次目标进度复盘
2. 及时上报异常情况
3. 确保数据真实准确

---
生成时间：2024-07-01 15:30
`

export default function MinutesPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(mockMinutesContent)
  const [selectedExport, setSelectedExport] = useState<string | null>(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [saveTags, setSaveTags] = useState<string>('')
  const [saveToKnowledge, setSaveToKnowledge] = useState(true)
  const { addMinute, updateMinute, minutes, addDocument } = useAppStore()

  const elements = {
    subject: '第三季度销售目标部署会议',
    participants: ['张经理', '李主管', '王助理', '陈专员'],
    topics: ['上季度销售业绩回顾', '第三季度目标制定', '资源配置方案讨论', '绩效考核标准确定'],
    deployments: ['销售目标：本季度销售额目标为500万元', '重点区域：华东、华南区域为重点突破市场', '营销策略：加大线上推广投入，优化线下渠道'],
    responsible: [
      { name: '李主管', task: '制定区域销售计划', deadline: '2024-07-15' },
      { name: '王助理', task: '数据分析与报表', deadline: '每周五' },
      { name: '陈专员', task: '客户跟进与维护', deadline: '持续进行' },
    ],
    requirements: ['每月进行一次目标进度复盘', '及时上报异常情况', '确保数据真实准确'],
  }

  const handleGenerate = () => {
    addMinute({
      title: elements.subject,
      content,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      elements,
    })
    alert('纪要已生成！')
  }

  const handleSave = () => {
    if (minutes.length > 0) {
      updateMinute(minutes[minutes.length - 1].id, { content })
    }
    setIsEditing(false)
    alert('修改已保存！')
  }

  const handleExport = (format: string) => {
    setSelectedExport(format)
    setTimeout(() => {
      setSelectedExport(null)
      alert(`已导出为${format === 'word' ? 'Word' : 'PDF'}格式！`)
    }, 1500)
  }

  const handleSaveToKnowledge = () => {
    if (saveToKnowledge) {
      const tags = saveTags.split(',').map(t => t.trim()).filter(t => t)
      addDocument({
        title: elements.subject,
        type: 'minute',
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: tags.length > 0 ? tags : ['会议纪要']
      })
    }
    setShowSaveModal(false)
    setSaveTags('')
    alert('纪要已保存到知识库！')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">会议纪要生成</h1>
          <p className="text-gray-500 mt-1">智能提取核心要素，自动生成标准格式纪要</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            className="btn-primary flex items-center gap-2"
          >
            <FileText className="w-5 h-5" />
            生成纪要
          </button>
          <button
            onClick={() => setShowSaveModal(true)}
            className="btn-accent flex items-center gap-2"
          >
            <Database className="w-5 h-5" />
            保存到知识库
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-gray-800">核心要素</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">会议主题</label>
                <input
                  type="text"
                  defaultValue={elements.subject}
                  className="input-field"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  <Users className="w-4 h-4 inline mr-1" />
                  参会人员
                </label>
                <div className="flex flex-wrap gap-2">
                  {elements.participants.map((p, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">会议议题</label>
                <ul className="space-y-2">
                  {elements.topics.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-secondary-600" />
              <h3 className="font-semibold text-gray-800">责任分工</h3>
            </div>
            <div className="space-y-3">
              {elements.responsible.map((item, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.deadline}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.task}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">纪要内容</h3>
              </div>
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    保存
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-outline flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      编辑
                    </button>
                    <div className="relative">
                      <button className="btn-outline flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        导出
                      </button>
                      <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                        <button
                          onClick={() => handleExport('word')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FileDown className="w-4 h-4" />
                          Word格式
                        </button>
                        <button
                          onClick={() => handleExport('pdf')}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <FileDown className="w-4 h-4" />
                          PDF格式
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {selectedExport && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-600">正在导出为{selectedExport === 'word' ? 'Word' : 'PDF'}格式...</span>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6">
              {isEditing ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-96 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none font-mono text-sm"
                />
              ) : (
                <div className="prose prose-sm max-w-none">
                  {content.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={i} className="text-xl font-bold text-gray-800 mt-4 first:mt-0">{line.replace('# ', '')}</h1>
                    }
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-lg font-semibold text-gray-700 mt-3">{line.replace('## ', '')}</h2>
                    }
                    if (line.startsWith('|')) {
                      const cells = line.split('|').filter(c => c.trim())
                      if (cells.length > 0 && !line.includes('-')) {
                        return (
                          <div key={i} className="grid grid-cols-3 gap-4 p-2 bg-white rounded border border-gray-200">
                            {cells.map((cell, j) => (
                              <span key={j} className="text-sm text-gray-700">{cell.trim()}</span>
                            ))}
                          </div>
                        )
                      }
                      return null
                    }
                    if (line.startsWith('- ')) {
                      return <li key={i} className="ml-4 text-gray-700">{line.replace('- ', '')}</li>
                    }
                    if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ') || line.startsWith('6. ')) {
                      return <li key={i} className="ml-4 text-gray-700">{line}</li>
                    }
                    if (line.startsWith('---')) {
                      return <hr key={i} className="my-4 border-gray-300" />
                    }
                    return <p key={i} className="text-gray-700">{line}</p>
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Database className="w-5 h-5 text-accent-600" />
                保存到知识库
              </h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveToKnowledge}
                    onChange={(e) => setSaveToKnowledge(e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">保存到知识库</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  添加标签（用逗号分隔）
                </label>
                <input
                  type="text"
                  value={saveTags}
                  onChange={(e) => setSaveTags(e.target.value)}
                  placeholder="例如：会议, 销售, Q3"
                  className="input-field"
                />
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  将保存：{elements.subject}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowSaveModal(false)}
                className="flex-1 btn-outline"
              >
                取消
              </button>
              <button
                onClick={handleSaveToKnowledge}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                确认保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
