import { useState } from 'react'
import { useAppStore } from '@/store'
import {
  Mic,
  FileText,
  Clock,
  Calendar,
  Play,
  Trash2,
  ArrowRight,
  RefreshCw,
  Edit2,
  X,
  Save,
  Plus
} from 'lucide-react'

export default function RecordingListPage() {
  const { recordings, setCurrentPage, updateRecording } = useAppStore()
  const [editingRecordingId, setEditingRecordingId] = useState<string | null>(null)
  const [editingSpeakers, setEditingSpeakers] = useState<{ id: string; name: string; color: string }[]>([])
  const [editingSpeakerIndex, setEditingSpeakerIndex] = useState<number | null>(null)
  const [editingSpeakerName, setEditingSpeakerName] = useState('')

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recording':
        return 'bg-red-100 text-red-700'
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'processing':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'recording':
        return '录音中'
      case 'completed':
        return '已完成'
      case 'processing':
        return '处理中'
      default:
        return status
    }
  }

  const handleOpenSpeakerEdit = (recordingId: string, speakers: typeof recordings[0]['speakers']) => {
    setEditingRecordingId(recordingId)
    setEditingSpeakers([...speakers])
  }

  const handleCloseSpeakerEdit = () => {
    setEditingRecordingId(null)
    setEditingSpeakers([])
    setEditingSpeakerIndex(null)
    setEditingSpeakerName('')
  }

  const handleEditSpeakerName = (index: number) => {
    setEditingSpeakerIndex(index)
    setEditingSpeakerName(editingSpeakers[index].name)
  }

  const handleSaveSpeakerName = () => {
    if (editingSpeakerIndex !== null && editingSpeakerName.trim()) {
      const newSpeakers = [...editingSpeakers]
      newSpeakers[editingSpeakerIndex] = {
        ...newSpeakers[editingSpeakerIndex],
        name: editingSpeakerName.trim(),
        id: editingSpeakerName.trim()
      }
      setEditingSpeakers(newSpeakers)
    }
    setEditingSpeakerIndex(null)
    setEditingSpeakerName('')
  }

  const handleSaveSpeakers = () => {
    if (editingRecordingId) {
      updateRecording(editingRecordingId, { speakers: editingSpeakers })
      handleCloseSpeakerEdit()
      alert('发言人信息已更新！')
    }
  }

  const handleReTranscribe = (recordingId: string) => {
    if (confirm('确定要重新转写吗？这将重新处理录音文件。')) {
      updateRecording(recordingId, { status: 'processing' })
      setTimeout(() => {
        updateRecording(recordingId, { status: 'completed' })
        alert('重新转写完成！')
      }, 2000)
    }
  }

  const speakerColors = ['bg-primary-500', 'bg-secondary-500', 'bg-accent-500', 'bg-orange-500', 'bg-green-500']

  const handleAddSpeaker = () => {
    const newSpeaker = {
      id: `speaker-${Date.now()}`,
      name: `发言人${editingSpeakers.length + 1}`,
      color: speakerColors[editingSpeakers.length % speakerColors.length]
    }
    setEditingSpeakers([...editingSpeakers, newSpeaker])
  }

  const handleDeleteSpeaker = (index: number) => {
    if (editingSpeakers.length > 1) {
      setEditingSpeakers(editingSpeakers.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">历史会议记录</h1>
          <p className="text-gray-500 mt-1">查看和管理所有录音转写记录</p>
        </div>
        <button
          onClick={() => setCurrentPage('record')}
          className="btn-primary flex items-center gap-2"
        >
          <Mic className="w-5 h-5" />
          新建录音
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">会议列表</h3>
          <span className="text-sm text-gray-500">共 {recordings.length} 条记录</span>
        </div>

        {recordings.length > 0 ? (
          <div className="space-y-4">
            {recordings.map((recording) => (
              <div
                key={recording.id}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Mic className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{recording.title}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(recording.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(recording.duration)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(recording.status)}`}>
                          {getStatusLabel(recording.status)}
                        </span>
                      </div>
                      {recording.speakers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {recording.speakers.map((speaker) => (
                            <span
                              key={speaker.id}
                              className={`px-2 py-0.5 rounded text-xs text-white ${speaker.color}`}
                            >
                              {speaker.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                      <Play className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReTranscribe(recording.id)}
                      className="btn-outline flex items-center gap-2"
                      title="重新转写"
                    >
                      <RefreshCw className="w-4 h-4" />
                      重新转写
                    </button>
                    <button
                      onClick={() => handleOpenSpeakerEdit(recording.id, recording.speakers)}
                      className="btn-secondary flex items-center gap-2"
                      title="调整发言人"
                    >
                      <Edit2 className="w-4 h-4" />
                      调整发言人
                    </button>
                    <button
                      onClick={() => setCurrentPage('minutes')}
                      className="btn-primary flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      生成纪要
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>暂无会议记录</p>
            <button
              onClick={() => setCurrentPage('record')}
              className="mt-4 btn-primary"
            >
              开始第一次录音
            </button>
          </div>
        )}
      </div>

      {editingRecordingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary-600" />
                调整发言人
              </h3>
              <button
                onClick={handleCloseSpeakerEdit}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              {editingSpeakers.map((speaker, index) => (
                <div key={speaker.id} className="flex items-center gap-2">
                  {editingSpeakerIndex === index ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingSpeakerName}
                        onChange={(e) => setEditingSpeakerName(e.target.value)}
                        className="flex-1 input-field"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveSpeakerName}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingSpeakerIndex(null)}
                        className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1">
                      <span className={`w-6 h-6 rounded-full ${speaker.color} flex-shrink-0`} />
                      <span className="flex-1 text-gray-800">{speaker.name}</span>
                      <button
                        onClick={() => handleEditSpeakerName(index)}
                        className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSpeaker(index)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleAddSpeaker}
              className="w-full mt-4 py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              添加发言人
            </button>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleCloseSpeakerEdit}
                className="flex-1 btn-outline"
              >
                取消
              </button>
              <button
                onClick={handleSaveSpeakers}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                保存更改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
