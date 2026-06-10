import { useState } from 'react'
import { useAppStore } from '@/store'
import {
  FolderOpen,
  FileText,
  Calendar,
  Sparkles,
  Plus,
  ChevronDown,
  Check,
  Tag,
  TrendingUp,
  Download,
  FileDown,
  Edit2,
  X,
  Save
} from 'lucide-react'

const templates = [
  { id: 'weekly', name: '周报模板', description: '每周工作汇报标准格式', sections: ['本周工作完成情况', '工作亮点', '存在问题', '下周计划'] },
  { id: 'monthly', name: '月报模板', description: '月度工作总结模板', sections: ['本月工作完成情况', '工作亮点', '存在问题', '下月计划'] },
  { id: 'special', name: '专项总结', description: '项目专项报告模板', sections: ['项目概况', '完成情况', '经验总结', '改进措施'] },
  { id: 'review', name: '复盘材料', description: '项目复盘分析模板', sections: ['项目回顾', '成功经验', '失败教训', '改进计划'] },
]

const mockSummary = `## 文档摘要

### 核心要点
1. **项目进度**: 已完成80%，预计下月中旬可交付
2. **关键问题**: 第三方接口响应延迟，正在协调优化
3. **资源需求**: 需要增加测试人员支持

### 数据统计
- 本周完成任务: 15项
- 待处理任务: 8项
- 延期任务: 2项

### 下一步计划
1. 完成剩余功能开发
2. 启动性能测试
3. 准备用户培训材料
`

const mockReport = `# 2024年7月工作总结

## 一、本月工作完成情况

### 1. 项目开发
- 完成用户管理模块开发
- 优化系统性能，响应时间提升30%
- 修复线上bug 12个

### 2. 团队协作
- 组织技术分享会2次
- 完成新人培训计划
- 参与跨部门协作项目

## 二、工作亮点
- 提出的优化方案节省服务器成本20%
- 主导的代码审查覆盖率达到95%

## 三、存在问题
- 部分需求变更频繁，影响开发进度
- 测试环境资源不足

## 四、下月计划
- 完成项目二期开发
- 推进自动化测试建设
- 优化部署流程
`

export default function OrganizePage() {
  const [activeTab, setActiveTab] = useState<'summary' | 'report'>('summary')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [inputText, setInputText] = useState('')
  const [generatedContent, setGeneratedContent] = useState('')
  const [selectedExport, setSelectedExport] = useState<string | null>(null)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [customTemplates, setCustomTemplates] = useState<typeof templates>([])
  const [editingTemplate, setEditingTemplate] = useState<typeof templates[0] | null>(null)
  const { addDocument } = useAppStore()

  const allTemplates = [...templates, ...customTemplates]

  const handleGenerateSummary = () => {
    if (!inputText.trim()) {
      setGeneratedContent(mockSummary)
    } else {
      setGeneratedContent(`## 文档摘要\n\n根据您提供的内容，智能分析如下：\n\n${inputText}\n\n### 核心要点\n- 待分析内容已收到\n- 系统正在处理...\n\n### 建议后续步骤\n- 补充更多上下文信息\n- 明确分析重点`)
    }
  }

  const handleGenerateReport = (templateId: string) => {
    setSelectedTemplate(templateId)
    const template = allTemplates.find(t => t.id === templateId)
    if (template) {
      const content = `# ${template.name.replace('模板', '')}\n\n${template.sections.map((section, i) => `## ${i + 1}. ${section}\n\n- 请填写${section}内容\n`).join('\n')}`
      setGeneratedContent(content)
    } else {
      setGeneratedContent(mockReport)
    }
  }

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      if (editingTemplate.id) {
        setCustomTemplates(customTemplates.map(t => t.id === editingTemplate.id ? editingTemplate : t))
      } else {
        setCustomTemplates([...customTemplates, {
          ...editingTemplate,
          id: `custom-${Date.now()}`
        }])
      }
    }
    setEditingTemplate(null)
    setShowTemplateModal(false)
    alert('模板已保存！')
  }

  const handleCreateTemplate = () => {
    setEditingTemplate({
      id: '',
      name: '新模板',
      description: '',
      sections: ['章节一', '章节二', '章节三']
    })
    setShowTemplateModal(true)
  }

  const handleSaveDocument = () => {
    const docType = activeTab === 'summary' ? 'summary' : 'report'
    addDocument({
      title: activeTab === 'summary' ? '文档摘要' : '周期性报告',
      type: docType,
      content: generatedContent || (activeTab === 'summary' ? mockSummary : mockReport),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['智能生成', docType],
    })
    alert('文档已保存到知识库！')
  }

  const handleExport = (format: string) => {
    setSelectedExport(format)
    setShowExportMenu(false)
    setTimeout(() => {
      setSelectedExport(null)
      alert(`已导出为${format === 'word' ? 'Word' : 'PDF'}格式！`)
    }, 1500)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">智能整理</h1>
          <p className="text-gray-500 mt-1">智能整编素材，自动生成摘要和报告</p>
        </div>
        {generatedContent && (
          <div className="flex items-center gap-3">
            <button onClick={handleSaveDocument} className="btn-primary flex items-center gap-2">
              <Check className="w-4 h-4" />
              保存到知识库
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="btn-outline flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                导出
              </button>
              {showExportMenu && (
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
              )}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent-600" />
              <h3 className="font-semibold text-gray-800">功能选择</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab('summary')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  activeTab === 'summary'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileText className={`w-8 h-8 mb-2 mx-auto ${activeTab === 'summary' ? 'text-primary-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${activeTab === 'summary' ? 'text-primary-700' : 'text-gray-700'}`}>摘要生成</p>
              </button>
              <button
                onClick={() => setActiveTab('report')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  activeTab === 'report'
                    ? 'border-secondary-500 bg-secondary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Calendar className={`w-8 h-8 mb-2 mx-auto ${activeTab === 'report' ? 'text-secondary-600' : 'text-gray-400'}`} />
                <p className={`text-sm font-medium ${activeTab === 'report' ? 'text-secondary-700' : 'text-gray-700'}`}>周期报告</p>
              </button>
            </div>
          </div>

          {activeTab === 'summary' ? (
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">输入内容</h3>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="请输入需要生成摘要的文档内容..."
                className="w-full h-48 input-field resize-none"
              />
              <button
                onClick={handleGenerateSummary}
                className="mt-4 btn-primary w-full flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                生成摘要
              </button>
            </div>
          ) : (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">选择模板</h3>
                <button
                  onClick={handleCreateTemplate}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="创建自定义模板"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {allTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleGenerateReport(template.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedTemplate === template.id
                        ? 'border-secondary-500 bg-secondary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`font-medium ${selectedTemplate === template.id ? 'text-secondary-700' : 'text-gray-800'}`}>
                            {template.name}
                          </p>
                          {template.id.startsWith('custom') && (
                            <span className="px-2 py-0.5 bg-accent-100 text-accent-700 text-xs rounded">自定义</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                      </div>
                      <ChevronDown className={`w-5 h-5 ${selectedTemplate === template.id ? 'text-secondary-500' : 'text-gray-400'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="card bg-gradient-to-br from-accent-500 to-accent-700 text-white">
            <h3 className="font-semibold mb-2">自定义模板</h3>
            <p className="text-sm text-white/80 mb-4">支持按部门或业务类型定制输出格式</p>
            <button className="w-full px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              创建模板
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-800">
                  {activeTab === 'summary' ? '摘要内容' : '报告内容'}
                </h3>
              </div>
              {generatedContent && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Tag className="w-4 h-4" />
                  <span>已添加标签: 智能生成</span>
                </div>
              )}
            </div>

            {selectedExport && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-gray-600">正在导出为{selectedExport === 'word' ? 'Word' : 'PDF'}格式...</span>
              </div>
            )}
            
            <div className="bg-gray-50 rounded-lg p-6 min-h-[500px]">
              {generatedContent ? (
                <div className="prose prose-sm max-w-none">
                  {generatedContent.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={i} className="text-xl font-bold text-gray-800 mt-4 first:mt-0">{line.replace('# ', '')}</h1>
                    }
                    if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-lg font-semibold text-gray-700 mt-3">{line.replace('## ', '')}</h2>
                    }
                    if (line.startsWith('### ')) {
                      return <h3 key={i} className="text-base font-semibold text-gray-700 mt-2">{line.replace('### ', '')}</h3>
                    }
                    if (line.startsWith('- ')) {
                      return <li key={i} className="ml-4 text-gray-700">{line.replace('- ', '')}</li>
                    }
                    if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                      return <li key={i} className="ml-4 text-gray-700">{line}</li>
                    }
                    return <p key={i} className="text-gray-700">{line}</p>
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <TrendingUp className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg font-medium">开始智能整理</p>
                  <p className="text-sm mt-2">
                    {activeTab === 'summary' 
                      ? '在左侧输入文档内容，点击生成摘要' 
                      : '选择一个报告模板，自动生成报告'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showTemplateModal && editingTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary-600" />
                {editingTemplate.id ? '编辑模板' : '创建自定义模板'}
              </h3>
              <button
                onClick={() => {
                  setShowTemplateModal(false)
                  setEditingTemplate(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">模板名称</label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="input-field"
                  placeholder="例如：销售周报模板"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">模板描述</label>
                <input
                  type="text"
                  value={editingTemplate.description}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, description: e.target.value })}
                  className="input-field"
                  placeholder="简要描述模板用途"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">章节设置</label>
                <div className="space-y-2">
                  {editingTemplate.sections.map((section, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 w-6">{index + 1}.</span>
                      <input
                        type="text"
                        value={section}
                        onChange={(e) => {
                          const newSections = [...editingTemplate.sections]
                          newSections[index] = e.target.value
                          setEditingTemplate({ ...editingTemplate, sections: newSections })
                        }}
                        className="flex-1 input-field"
                      />
                      <button
                        onClick={() => {
                          if (editingTemplate.sections.length > 1) {
                            const newSections = editingTemplate.sections.filter((_, i) => i !== index)
                            setEditingTemplate({ ...editingTemplate, sections: newSections })
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setEditingTemplate({ ...editingTemplate, sections: [...editingTemplate.sections, `章节${editingTemplate.sections.length + 1}`] })}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  添加章节
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => {
                  setShowTemplateModal(false)
                  setEditingTemplate(null)
                }}
                className="flex-1 btn-outline"
              >
                取消
              </button>
              <button
                onClick={handleSaveTemplate}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存模板
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
