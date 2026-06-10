import { create } from 'zustand'

export interface User {
  id: string
  name: string
  email: string
  role: 'administrator' | 'department_head' | 'employee'
}

export interface Recording {
  id: string
  title: string
  duration: number
  status: 'recording' | 'completed' | 'processing'
  createdAt: string
  transcription: string
  speakers: Array<{ id: string; name: string; color: string }>
}

export interface Minute {
  id: string
  title: string
  content: string
  status: 'draft' | 'approved' | 'archived'
  createdAt: string
  updatedAt: string
  elements: {
    subject: string
    participants: string[]
    topics: string[]
    deployments: string[]
    responsible: { name: string; task: string; deadline: string }[]
    requirements: string[]
  }
}

export interface Document {
  id: string
  title: string
  type: 'summary' | 'report' | 'minute' | 'note'
  content: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface Log {
  id: string
  userId: string
  userName: string
  action: string
  resourceType: string
  resourceId?: string
  createdAt: string
  ipAddress: string
}

interface AppState {
  user: User | null
  recordings: Recording[]
  minutes: Minute[]
  documents: Document[]
  logs: Log[]
  isLoggedIn: boolean
  currentPage: string
  
  login: (email: string, password: string) => void
  logout: () => void
  setCurrentPage: (page: string) => void
  addRecording: (recording: Omit<Recording, 'id'>) => void
  updateRecording: (id: string, updates: Partial<Recording>) => void
  addMinute: (minute: Omit<Minute, 'id'>) => void
  updateMinute: (id: string, updates: Partial<Minute>) => void
  addDocument: (document: Omit<Document, 'id'>) => void
  deleteDocument: (id: string) => void
  addLog: (log: Omit<Log, 'id'>) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  recordings: [],
  minutes: [],
  documents: [],
  logs: [],
  isLoggedIn: false,
  currentPage: 'dashboard',
  
  login: (email, password) => {
    const mockUsers: Record<string, User> = {
      'admin@company.com': { id: '1', name: '管理员', email: 'admin@company.com', role: 'administrator' },
      'manager@company.com': { id: '2', name: '部门负责人', email: 'manager@company.com', role: 'department_head' },
      'employee@company.com': { id: '3', name: '员工', email: 'employee@company.com', role: 'employee' },
    }
    
    const user = mockUsers[email]
    if (user && password === '123456') {
      set({ user, isLoggedIn: true })
    }
  },
  
  logout: () => set({ user: null, isLoggedIn: false, currentPage: 'dashboard' }),
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  addRecording: (recording) => set((state) => ({
    recordings: [...state.recordings, { ...recording, id: Date.now().toString() }]
  })),
  
  updateRecording: (id, updates) => set((state) => ({
    recordings: state.recordings.map(r => r.id === id ? { ...r, ...updates } : r)
  })),
  
  addMinute: (minute) => set((state) => ({
    minutes: [...state.minutes, { ...minute, id: Date.now().toString() }]
  })),
  
  updateMinute: (id, updates) => set((state) => ({
    minutes: state.minutes.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m)
  })),
  
  addDocument: (document) => set((state) => ({
    documents: [...state.documents, { ...document, id: Date.now().toString() }]
  })),
  
  deleteDocument: (id) => set((state) => ({
    documents: state.documents.filter(d => d.id !== id)
  })),
  
  addLog: (log) => set((state) => ({
    logs: [...state.logs, { ...log, id: Date.now().toString() }]
  })),
}))
