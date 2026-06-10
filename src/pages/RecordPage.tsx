import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '@/store'
import {
  Mic,
  MicOff,
  Upload,
  FileAudio,
  Clock,
  Play,
  Square,
  Check,
  AlertCircle,
  FileText,
  Edit2,
  X,
  Save,
  Plus
} from 'lucide-react'

const mockTranscription = [
  { speaker: '张经理', text: '今天我们来讨论一下第三季度的销售目标。', time: '00:01:23' },
  { speaker: '李主管', text: '好的，我已经准备了相关数据。', time: '00:01:45' },
  { speaker: '张经理', text: '上季度我们完成了目标的95%，希望这个季度能有所突破。', time: '00:02:10' },
  { speaker: '王助理', text: '我这边会配合做好数据分析工作。', time: '00:02:35' },
  { speaker: '张经理', text: '那我们就按照这个计划来推进。', time: '00:03:00' },
]

const speakerColors = ['bg-primary-500', 'bg-secondary-500', 'bg-accent-500', 'bg-orange-500', 'bg-green-500']

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [transcription, setTranscription] = useState<typeof mockTranscription>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null)
  const [editingSpeaker, setEditingSpeaker] = useState<string | null>(null)
  const [newSpeakerName, setNewSpeakerName] = useState('')
  const { addRecording } = useAppStore()
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
      
      let index = 0
      const addTextInterval = setInterval(() => {
        if (index < mockTranscription.length) {
          setTranscription(prev => [...prev, mockTranscription[index]])
          setActiveSpeaker(mockTranscription[index].speaker)
          index++
        } else {
          clearInterval(addTextInterval)
        }
      }, 2000)

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        clearInterval(addTextInterval)
      }
    }
  }, [isRecording])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setDuration(0)
    setTranscription([])
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    const speakers = [...new Set(transcription.map(t => t.speaker))].map((name, i) => ({
      id: name,
      name,
      color: speakerColors[i % speakerColors.length]
    }))
    
    addRecording({
      title: `会议记录 ${new Date().toLocaleDateString()}`,
      duration,
      status: 'completed',
      createdAt: new Date().toISOString(),
      transcription: transcription.map(t => `${t.speaker}: ${t.text}`).join('\n'),
      speakers
    })
    
    alert('录音已保存！')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      setIsProcessing(true)
      
      setTimeout(() => {
        setIsProcessing(false)
        setTranscription(mockTranscription)
        alert('音频文件处理完成！')
      }, 3000)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const getSpeakerColor = (speaker: string) => {
    const speakers = [...new Set(transcription.map(t => t.speaker))]
    const index = speakers.indexOf(speaker)
    return speakerColors[index % speakerColors.length]
  }

  const handleEditSpeaker = (oldName: string) => {
    setEditingSpeaker(oldName)
    setNewSpeakerName(oldName)
  }

  const handleSaveSpeakerName = () => {
    if (editingSpeaker && newSpeakerName.trim()) {
      setTranscription(transcription.map(t => 
        t.speaker === editingSpeaker 
          ? { ...t, speaker: newSpeakerName.trim() }
          : t
      ))
      if (activeSpeaker === editingSpeaker) {
        setActiveSpeaker(newSpeakerName.trim())
      }
    }
    setEditingSpeaker(null)
    setNewSpeakerName('')
  }

  const handleCancelEdit = () => {
    setEditingSpeaker(null)
    setNewSpeakerName('')
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">实时会议记录</h1>
          <p className="text-gray-500 mt-1">支持麦克风实时转写和音频文件上传</p>
        </div>
        {transcription.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const speakers = [...new Set(transcription.map(t => t.speaker))].map((name, i) => ({
                  id: name,
                  name,
                  color: speakerColors[i % speakerColors.length]
                }))
                addRecording({
                  title: `会议记录 ${new Date().toLocaleDateString()}`,
                  duration,
                  status: 'completed',
                  createdAt: new Date().toISOString(),
                  transcription: transcription.map(t => `${t.speaker}: ${t.text}`).join('\n'),
                  speakers
                })
                alert('记录已保存到知识库！')
              }}
              className="btn-primary flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              保存到知识库
            </button>
            <button
              onClick={() => {
                useAppStore.getState().setCurrentPage('minutes')
              }}
              className="btn-secondary flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              生成纪要
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">录音控制</h2>
          
          <div className="flex flex-col items-center py-8">
            <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
              isRecording 
                ? 'bg-red-100 animate-pulse' 
                : 'bg-primary-100 hover:bg-primary-200'
            }`}>
              {isRecording ? (
                <Mic className="w-16 h-16 text-red-500" />
              ) : (
                <MicOff className="w-16 h-16 text-primary-600" />
              )}
            </div>
            
            <p className="text-4xl font-bold text-gray-800 mb-2">{formatDuration(duration)}</p>
            <p className={`text-sm ${isRecording ? 'text-red-500' : 'text-gray-500'}`}>
              {isRecording ? '录音中...' : '准备就绪'}
            </p>
            
            <div className="flex items-center gap-4 mt-6">
              {!isRecording ? (
                <button
                  onClick={handleStartRecording}
                  className="btn-primary flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  开始录音
                </button>
              ) : (
                <button
                  onClick={handleStopRecording}
                  className="btn-danger flex items-center gap-2"
                >
                  <Square className="w-5 h-5" />
                  结束录音
                </button>
              )}
              
              <button
                onClick={handleUploadClick}
                className="btn-outline flex items-center gap-2"
              >
                <Upload className="w-5 h-5" />
                上传音频
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>

          {uploadedFile && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileAudio className="w-8 h-8 text-primary-500" />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 truncate">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                {isProcessing ? (
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-6 h-6 text-green-500" />
                )}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">发言人列表</h3>
              <button
                onClick={() => {
                  const newSpeaker = `发言人${transcription.length + 1}`
                  setTranscription([...transcription, { speaker: newSpeaker, text: '', time: formatDuration(duration) }])
                }}
                className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                title="添加发言人"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {[...new Set(transcription.map(t => t.speaker))].map((speaker) => (
                <div
                  key={speaker}
                  className="flex items-center gap-2"
                >
                  {editingSpeaker === speaker ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newSpeakerName}
                        onChange={(e) => setNewSpeakerName(e.target.value)}
                        className="input-field w-32"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveSpeakerName}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-gray-400 hover:bg-gray-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getSpeakerColor(speaker)} text-white flex items-center gap-2`}
                      >
                        <span className={`w-2 h-2 rounded-full ${activeSpeaker === speaker ? 'bg-white animate-pulse' : 'bg-white/70'}`} />
                        {speaker}
                      </span>
                      <button
                        onClick={() => handleEditSpeaker(speaker)}
                        className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        title="编辑发言人"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {transcription.length === 0 && (
                <p className="text-gray-500 text-sm">暂无发言人信息</p>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">转写内容</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              {formatDuration(duration)}
            </div>
          </div>
          
          <div className="h-96 overflow-y-auto scrollbar-thin bg-gray-50 rounded-lg p-4">
            {transcription.length > 0 ? (
              <div className="space-y-4">
                {transcription.map((item, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg transition-all ${
                      activeSpeaker === item.speaker ? 'bg-primary-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSpeakerColor(item.speaker)} text-white`}>
                        {item.speaker}
                      </span>
                      <span className="text-xs text-gray-400">{item.time}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{item.text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Mic className="w-12 h-12 mb-3 opacity-50" />
                <p>开始录音或上传音频文件</p>
                <p className="text-sm mt-1">转写内容将在此显示</p>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-500">系统自动进行语义断句和语气词过滤</span>
          </div>
        </div>
      </div>
    </div>
  )
}
