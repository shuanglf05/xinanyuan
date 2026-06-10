import { useState } from 'react'
import { useAppStore } from '@/store'
import { LogIn, Mail, Lock, Building2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAppStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('请填写完整的登录信息')
      return
    }
    
    login(email, password)
    
    setTimeout(() => {
      if (!useAppStore.getState().isLoggedIn) {
        setError('邮箱或密码错误')
      }
    }, 100)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="w-full max-w-md">
        <div className="card shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
              <Building2 className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">智能会议记录系统</h1>
            <p className="text-gray-500">内网统一认证登录</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="请输入邮箱地址"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="请输入密码"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              登录系统
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              测试账号：admin@company.com / 123456
            </p>
            <p className="text-center text-sm text-gray-500 mt-1">
              manager@company.com / 123456 | employee@company.com / 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
