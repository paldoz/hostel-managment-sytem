'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    Users,
    Home,
    DollarSign,
    MessageSquare,
    LogOut,
    Menu,
    X,
    TrendingUp,
    User
} from 'lucide-react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const [userName, setUserName] = useState('User')
    const [userRole, setUserRole] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(true)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const role = localStorage.getItem('userRole')
            const name = localStorage.getItem('userName')

            if (!role) {
                router.push('/login')
            } else {
                setUserRole(role)
                setUserName(name || 'User')
            }
        }
    }, [router])

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userRole')
            localStorage.removeItem('userName')
            localStorage.removeItem('studentId')
        }
        router.push('/login')
    }

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'student'] },
        { name: 'Students', href: '/dashboard/students', icon: Users, roles: ['admin'] },
        { name: 'Rooms', href: '/dashboard/rooms', icon: Home, roles: ['admin'] },
        { name: 'Fees', href: '/dashboard/fees', icon: DollarSign, roles: ['admin', 'student'] },
        { name: 'Complaints', href: '/dashboard/complaints', icon: MessageSquare, roles: ['admin', 'student'] },
        { name: 'Announcements', href: '/dashboard/announcements', icon: TrendingUp, roles: ['admin'] },
        { name: 'Profile', href: '/dashboard/profile', icon: User, roles: ['student'] },
        { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp, roles: ['admin'] },
    ]

    const filteredNavItems = navItems.filter(item => item.roles.includes(userRole))

    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full glass-card border-r border-white/20 transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-0'
                } overflow-hidden`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            🏨 Hostel Manager
                        </h2>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <p className="text-sm text-gray-400 mb-6">Welcome, {userName}</p>

                    <nav className="space-y-2">
                        {filteredNavItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition-all font-medium"
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-500/20 transition-all w-full mt-8"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                <header className="glass-card border-b border-white/20 p-4">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
