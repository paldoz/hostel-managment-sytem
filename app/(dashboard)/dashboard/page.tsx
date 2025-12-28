'use client'

import { useEffect, useState } from 'react'
import { Users, Home, DollarSign, AlertCircle, Megaphone, Bell, AlertTriangle } from 'lucide-react'

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null)
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const [userRole, setUserRole] = useState('')

    useEffect(() => {
        setUserRole(localStorage.getItem('userRole') || '')
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            const studentId = localStorage.getItem('studentId') || ''
            const role = localStorage.getItem('userRole') || ''

            // For students, pass studentId to filter announcements AND analytics
            const announcementsUrl = role === 'student' && studentId
                ? `/api/announcements?studentId=${studentId}`
                : '/api/announcements'

            const analyticsUrl = role === 'student' && studentId
                ? `/api/analytics?studentId=${studentId}`
                : '/api/analytics'

            const [analyticsRes, announcementsRes] = await Promise.all([
                fetch(analyticsUrl),
                fetch(announcementsUrl)
            ])
            const data = await analyticsRes.json()
            const annData = await announcementsRes.json()

            if (data.error) {
                console.error('API Error:', data.error)
            } else {
                setStats(data)
            }
            setAnnouncements(Array.isArray(annData) ? annData : [])
        } catch (error) {
            console.error('Failed to load dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || !stats || !stats.rooms) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                <p className="text-gray-400 font-medium">Loading dashboard statistics...</p>
                {!loading && !stats?.rooms && (
                    <p className="text-red-400 text-sm italic">Failed to load statistics. Please ensure database is connected.</p>
                )}
            </div>
        )
    }



    const statCards = [
        {
            title: userRole === 'student' ? 'Room Occupants' : 'Total Students',
            value: stats.rooms?.occupied || 0,
            icon: Users,
            gradient: 'from-purple-600 to-indigo-600'
        },
        {
            title: userRole === 'student' ? 'My Room Usage' : 'Room Occupancy',
            value: `${Math.round(stats.rooms?.rate || 0)}%`,
            icon: Home,
            gradient: 'from-pink-500 to-rose-600'
        },
        {
            title: userRole === 'student' ? 'My Paid Fees' : 'Collected Fees',
            value: `$${stats.fees?.collected || 0}`,
            icon: DollarSign,
            gradient: 'from-cyan-500 to-blue-600'
        },
        {
            title: userRole === 'student' ? 'My Pending Complaints' : 'Pending Complaints',
            value: stats.complaints?.pending || 0,
            icon: AlertCircle,
            gradient: 'from-orange-500 to-red-600'
        },
    ]

    const downloadBackup = async () => {
        try {
            const [students, fees, rooms, complaints, announcements] = await Promise.all([
                fetch('/api/students').then(r => r.json()),
                fetch('/api/fees').then(r => r.json()),
                fetch('/api/rooms').then(r => r.json()),
                fetch('/api/complaints').then(r => r.json()),
                fetch('/api/announcements').then(r => r.json())
            ])

            const backupData = {
                timestamp: new Date().toISOString(),
                students: Array.isArray(students) ? students : [],
                fees: Array.isArray(fees) ? fees : [],
                rooms: Array.isArray(rooms) ? rooms : [],
                complaints: Array.isArray(complaints) ? complaints : [],
                announcements: Array.isArray(announcements) ? announcements : []
            }

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `hostel-backup-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            alert('Backup downloaded successfully!')
        } catch (error) {
            console.error('Backup failed:', error)
            alert('Failed to download backup')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                    <p className="text-gray-400">
                        {userRole === 'student' ? 'My Hostel Overview' : 'Overview of hostel management statistics'}
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    {userRole === 'admin' && (
                        <button
                            onClick={downloadBackup}
                            className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2"
                        >
                            <DollarSign className="w-3 h-3" /> Download Backup
                        </button>
                    )}
                    <div className="text-sm text-gray-400">
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="glass-card p-6 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                            <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-3xl font-bold mb-1">{stat.value}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-semibold">{stat.title}</div>
                    </div>
                ))}
            </div>

            {/* Announcements Section */}
            <div className="glass-card p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-purple-400" />
                    Latest Announcements
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.isArray(announcements) && announcements.slice(0, 3).map((item) => (
                        <div key={item.id} className={`p-4 rounded-xl border animate-fade-in ${item.type === 'urgent' ? 'bg-red-500/5 border-red-500/20' :
                            item.type === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' :
                                'bg-white/5 border-white/10'
                            }`}>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-sm">{item.title}</h3>
                                {item.type === 'urgent' ? <AlertCircle className="w-4 h-4 text-red-500" /> :
                                    item.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-500" /> :
                                        <Bell className="w-4 h-4 text-blue-500" />}
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2 mb-2">{item.content}</p>
                            <span className="text-[10px] text-gray-500 uppercase font-mono">
                                {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                    {announcements.length === 0 && (
                        <p className="text-sm text-gray-500 italic py-4">No recent announcements.</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Room Occupancy Tracker */}
                <div className="lg:col-span-2 glass-card p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Home className="w-5 h-5 text-purple-400" />
                        {userRole === 'student' ? 'My Room Info' : 'Room Occupancy Tracker'}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {stats.rooms?.details?.map((room: any) => (
                            <div
                                key={room.id}
                                className={`p-4 rounded-xl border transition-all hover:scale-105 cursor-pointer ${room.status === 'full'
                                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                    : room.status === 'occupied'
                                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                        : room.status === 'reserved'
                                            ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                                            : 'bg-green-500/10 border-green-500/30 text-green-400'
                                    }`}
                                title={`${room.occupied}/${room.capacity} occupied`}
                            >
                                <div className="text-xs font-bold opacity-60 uppercase mb-1">Room</div>
                                <div className="text-xl font-bold">{room.number}</div>
                                <div className="mt-2 text-[10px] flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${room.status === 'full' ? 'bg-red-500' : 'bg-current'}`} />
                                    {room.status.toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Complaint Status Summary */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-400" />
                        {userRole === 'student' ? 'My Complaints' : 'Complaints Status'}
                    </h2>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Resolution Rate</span>
                                <span className="text-sm font-bold text-green-400">
                                    {stats.complaints.total > 0 ? Math.round((stats.complaints.resolved / stats.complaints.total) * 100) : 100}%
                                </span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500"
                                    style={{ width: `${stats.complaints.total > 0 ? (stats.complaints.resolved / stats.complaints.total) * 100 : 100}%` }}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                                <div className="text-2xl font-bold text-orange-400">{stats.complaints.pending}</div>
                                <div className="text-xs text-gray-400 uppercase">Pending</div>
                            </div>
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                                <div className="text-2xl font-bold text-green-400">{stats.complaints.resolved}</div>
                                <div className="text-xs text-gray-400 uppercase">Resolved</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}
