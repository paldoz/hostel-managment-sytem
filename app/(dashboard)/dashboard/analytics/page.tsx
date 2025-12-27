'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Users, DollarSign, AlertCircle, Download } from 'lucide-react'
import { generateStudentReport, generateFeeReport, generateComplaintReport, generateMonthlyReport } from '@/lib/pdf-generator'

export default function AnalyticsPage() {
    const router = useRouter()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const role = localStorage.getItem('userRole')
            if (role !== 'admin') {
                router.push('/dashboard')
            } else {
                loadAnalytics()
            }
        }
    }, [router])

    const loadAnalytics = async () => {
        try {
            const res = await fetch('/api/analytics')
            const data = await res.json()
            setStats(data)
        } catch (error) {
            console.error('Failed to load analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading || !stats) return <div className="p-8 text-center text-gray-400">Loading analytics...</div>

    // Format data for charts
    const feeData = [
        { name: 'Collected', value: stats.fees.collected, color: '#10b981' },
        { name: 'Pending', value: stats.fees.pending, color: '#f59e0b' }
    ]

    const occupancyData = stats.rooms.details.map((r: any) => ({
        room: r.number,
        occupied: r.occupied,
        capacity: r.capacity
    }))

    const complaintData = [
        { name: 'Pending', value: stats.complaints.pending, color: '#f59e0b' },
        { name: 'Resolved', value: stats.complaints.resolved, color: '#10b981' }
    ]

    const revenueData = stats.fees.monthly;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-400">Comprehensive insights and reports</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => generateStudentReport(students)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:shadow-lg transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Student Report
                    </button>
                    <button
                        onClick={() => generateFeeReport(students)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:shadow-lg transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Fee Report
                    </button>
                    <button
                        onClick={() => generateComplaintReport(complaints)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg hover:shadow-lg transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Complaint Report
                    </button>
                    <button
                        onClick={() => generateMonthlyReport(students, rooms, complaints)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:shadow-lg transition-all"
                    >
                        <Download className="w-4 h-4" />
                        Monthly Summary
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="glass-card p-6 border-b-4 border-purple-500 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-purple-400" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Occupancy</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <div className="text-3xl font-black">{stats.rooms.occupied}</div>
                        <div className="text-sm text-gray-500 mb-1">/ {stats.rooms.capacity}</div>
                    </div>
                    <div className="mt-2 text-xs text-purple-400 font-bold">{stats.rooms.rate.toFixed(1)}% Fill Rate</div>
                </div>
                <div className="glass-card p-6 border-b-4 border-green-500 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Revenue</span>
                    </div>
                    <div className="text-3xl font-black text-green-400">${stats.fees.collected.toLocaleString()}</div>
                    <div className="mt-2 text-xs text-gray-500 font-bold">${stats.fees.pending.toLocaleString()} Pending</div>
                </div>
                <div className="glass-card p-6 border-b-4 border-blue-500 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Growth</span>
                    </div>
                    <div className="text-3xl font-black text-blue-400">+{revenueData.length > 1 ? (((revenueData[revenueData.length - 1].revenue - revenueData[revenueData.length - 2].revenue) / revenueData[revenueData.length - 2].revenue) * 100).toFixed(0) : 0}%</div>
                    <div className="mt-2 text-xs text-gray-500 font-bold">MoM Revenue</div>
                </div>
                <div className="glass-card p-6 border-b-4 border-orange-500 shadow-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-5 h-5 text-orange-400" />
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Issues</span>
                    </div>
                    <div className="text-3xl font-black text-orange-400">{stats.complaints.pending}</div>
                    <div className="mt-2 text-xs text-gray-500 font-bold">{stats.complaints.resolved} Resolved</div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4">Monthly Revenue Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                            <XAxis dataKey="month" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Fee Collection Pie Chart */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4">Fee Collection Status</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={feeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {feeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Room Occupancy Chart */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4">Room Occupancy</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={occupancyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                            <XAxis dataKey="room" stroke="#9ca3af" />
                            <YAxis stroke="#9ca3af" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                            />
                            <Legend />
                            <Bar dataKey="occupied" fill="#8b5cf6" />
                            <Bar dataKey="capacity" fill="#ec4899" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Complaint Status Pie Chart */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-bold mb-4">Complaint Resolution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={complaintData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {complaintData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
