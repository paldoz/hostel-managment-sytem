'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Users, GraduationCap } from 'lucide-react'

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<'admin' | 'student'>('admin')
    const [adminUsername, setAdminUsername] = useState('')
    const [adminPassword, setAdminPassword] = useState('')
    const [studentId, setStudentId] = useState('')
    const [studentPassword, setStudentPassword] = useState('')

    const router = useRouter()

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault()

        if (adminUsername === 'admin' && adminPassword === 'admin123') {
            if (typeof window !== 'undefined') {
                localStorage.setItem('userRole', 'admin')
                localStorage.setItem('userName', 'Admin')
            }
            router.push('/dashboard')
        } else {
            alert('Invalid admin credentials!')
        }
    }

    const handleStudentLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('/api/auth/student-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, password: studentPassword })
            })

            const data = await response.json()

            if (response.ok) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('userRole', 'student')
                    localStorage.setItem('userName', data.name)
                    localStorage.setItem('studentId', studentId)
                }
                router.push('/dashboard')
            } else {
                alert(data.error || 'Invalid student credentials!')
            }
        } catch (error) {
            console.error('Login failed:', error)
            alert('Something went wrong. Please try again.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-width-md glass-card border-white/20 animate-fade-in p-8 rounded-2xl">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                        Hostel Manager
                    </h1>
                    <p className="text-gray-300">
                        Welcome back! Please login to continue
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'admin'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                        onClick={() => setActiveTab('admin')}
                    >
                        <Users className="w-5 h-5" />
                        Admin
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === 'student'
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                        onClick={() => setActiveTab('student')}
                    >
                        <GraduationCap className="w-5 h-5" />
                        Student
                    </button>
                </div>

                {/* Admin Form */}
                {activeTab === 'admin' && (
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Enter admin username"
                                value={adminUsername}
                                onChange={(e) => setAdminUsername(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:shadow-lg transition-all"
                        >
                            Login as Admin
                        </button>
                    </form>
                )}

                {/* Student Form */}
                {activeTab === 'student' && (
                    <form onSubmit={handleStudentLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Student ID
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your student ID"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={studentPassword}
                                onChange={(e) => setStudentPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:shadow-lg transition-all"
                        >
                            Login as Student
                        </button>
                    </form>
                )}

                <p className="text-xs text-center text-gray-400 mt-6">
                    Demo: Admin - admin/admin123 | Student - STU001/student123
                </p>
            </div>

            <style jsx>{`
        .max-width-md {
          max-width: 28rem;
        }
      `}</style>
        </div>
    )
}
