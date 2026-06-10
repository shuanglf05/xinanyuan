import { useState } from 'react'
import { useAppStore } from '@/store'
import {
  Database,
  Search,
  Filter,
  Tag,
  Calendar,
  FileText,
  Download,
  Trash2,
  Eye,
  ChevronRight,
  X,
  ArrowLeft,
  Upload,
  Plus
} from 'lucide-react'

const mockDocuments = [
  { id: '1', title: '第三季度销售目标部署会议纪要', type: 'minute', tags: ['会议', '销售', 'Q3'], createdAt: '2024-07-01' },
  { id: '2', title: '项目进度周报 - 第28周', type: 'report', tags: ['周报', '项目', '进度'], createdAt: '2024-06-30' },
  { id: '3', title: '技术方案设计文档', type: 'note', tags: ['技术', '设计', '方案'], createdAt: '2024-06-28' },
  { id: '4', title: '月度工作总结 - 6月', type: 'report', tags: ['月报', '总结'], createdAt: '2024-06-01' },
  { id: '5', title: '客户需求分析报告', type: 'summary', tags: ['客户', '需求', '分析'], createdAt: '2024-05-28' },
]

export default function KnowledgePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadTags, setUploadTags] = useState('')
  const { deleteDocument, addDocument } = useAppStore()

  const allTags = [...new Set(mockDocuments.flatMap(d => d.tags))]
  
  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => doc.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个文档吗？')) {
      deleteDocument(id)
    }
  }

  const handleUpload = () => {
    const tags = uploadTags.split(',').map(t => t.trim()).filter(t => t)
    addDocument({
      title: uploadTitle || '未命名文档',
      type: 'note',
      content: '手动上传的外部文档',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tags.length > 0 ? tags : ['外部文档']
    })
    setShowUploadModal(false)
    setUploadTitle('')
    setUploadTags('')
    alert('文档已成功上传到知识库！')
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      summary: '摘要',
      report: '报告',
      minute: '纪要',
      note: '笔记'
    }
    return types[type] || type
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      summary: 'bg-accent-100 text-accent-700',
      report: 'bg-secondary-100 text-secondary-700',
      minute: 'bg-primary-100 text-primary-700',
      note: 'bg-gray-100 text-gray-700'
    }
    return colors[type] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">知识库</h1>
          <p className="text-gray-500 mt-1">自动归档所有生成的纪要、总结和技术资料</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          上传文档
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索文档标题、内容..."
              className="input-field pl-10"
            />
          </div>
          <button className="btn-outline flex items-center gap-2">
            <Filter className="w-4 h-4" />
            高级筛选
          </button>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Tag className="w-3 h-3 inline mr-1" />
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">文档列表</h3>
              <span className="text-sm text-gray-500">共 {filteredDocuments.length} 个文档</span>
            </div>

            <div className="space-y-3">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocument(doc.id)}
                    className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{doc.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(doc.type)}`}>
                              {getTypeLabel(doc.type)}
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {doc.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3 ml-13">
                      {doc.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Database className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>暂无匹配的文档</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedDocument ? (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">文档详情</h3>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {(() => {
                const doc = mockDocuments.find(d => d.id === selectedDocument)
                if (!doc) return null
                
                return (
                  <>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{doc.title}</h4>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-2 py-1 rounded text-xs ${getTypeColor(doc.type)}`}>
                        {getTypeLabel(doc.type)}
                      </span>
                      <span className="text-sm text-gray-500">{doc.createdAt}</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                          这是文档的预览内容。系统会自动归档所有生成的纪要、总结和技术资料，支持按业务板块、时间范围、关键词进行精准搜索。
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 btn-primary flex items-center justify-center gap-2">
                        <Eye className="w-4 h-4" />
                        预览
                      </button>
                      <button className="btn-outline flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        下载
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="btn-danger flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )
              })()}
            </div>
          ) : (
            <div className="card bg-gradient-to-br from-primary-500 to-primary-700 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5" />
                <h3 className="font-semibold">操作提示</h3>
              </div>
              <p className="text-sm text-white/80 mb-4">
                点击左侧文档列表中的任意文档，在右侧查看详情、预览或下载
              </p>
              <div className="p-3 bg-white/10 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <ArrowLeft className="w-4 h-4" />
                  <span>选择一个文档查看详情</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary-600" />
                上传文档
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">文档标题</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="请输入文档标题"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">标签（用逗号分隔）</label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="例如：技术, 文档, 外部"
                  className="input-field"
                />
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
                <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">点击或拖拽文件到此处上传</p>
                <p className="text-xs text-gray-400 mt-1">支持 PDF、Word、Excel、图片等格式</p>
                <button className="mt-3 text-primary-600 text-sm hover:underline">
                  或选择文件
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="flex-1 btn-outline"
              >
                取消
              </button>
              <button
                onClick={handleUpload}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                确认上传
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
