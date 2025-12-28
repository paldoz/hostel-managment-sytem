'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Plus, Search, DollarSign, Calendar } from 'lucide-react'

export default function FeesPage() {
    const [students, setStudents] = useState<any[]>([])
    const [fees, setFees] = useState<any[]>([])
    const [showModal, setShowModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [formData, setFormData] = useState({
        studentId: '',
        amount: '',
        month: new Date().toLocaleString('default', { month: 'long' }),
        status: 'paid',
        date: new Date().toISOString().split('T')[0]
    })
    const [userRole, setUserRole] = useState('')
    const [studentId, setStudentId] = useState('')
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    useEffect(() => {
        if (showModal && userRole === 'student' && studentId) {
            setFormData(prev => ({ ...prev, studentId: studentId, status: 'pending' }))
        }
    }, [showModal, userRole, studentId])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const role = localStorage.getItem('userRole')
            const sid = localStorage.getItem('studentId')
            setUserRole(role || '')
            setStudentId(sid || '')

            if (!role) {
                router.push('/login')
            } else {
                loadData(role, sid || undefined)
            }
        }
    }, [router])

    const loadData = async (role?: string, sid?: string) => {
        try {
            const currentRole = role || userRole
            const currentSid = sid || studentId

            const [studentsRes, feesRes] = await Promise.all([
                fetch('/api/students'),
                fetch('/api/fees')
            ])
            const studentsData = await studentsRes.json()
            const feesData = await feesRes.json()

            if (currentRole === 'student') {
                setStudents(studentsData.filter((s: any) => s.id === currentSid))
                setFees(feesData.filter((f: any) => f.studentId === currentSid))
            } else {
                setStudents(studentsData)
                setFees(feesData)
            }
        } catch (error) {
            console.error('Failed to load data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/fees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount)
                })
            })

            if (res.ok) {
                loadData()
                setShowModal(false)
                setFormData({
                    studentId: '',
                    amount: '',
                    month: new Date().toLocaleString('default', { month: 'long' }),
                    status: 'paid',
                    date: new Date().toISOString().split('T')[0]
                })
            }
        } catch (error) {
            console.error('Failed to record fee:', error)
        }
    }

    const handleApprove = async (feeId: string) => {
        try {
            const res = await fetch('/api/fees', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feeId, status: 'paid' })
            })

            if (res.ok) {
                loadData()
            }
        } catch (error) {
            console.error('Approval failed:', error)
        }
    }

    // Calculate stats
    const totalRevenue = fees.reduce((sum, fee) => fee.status === 'paid' ? sum + (fee.amount || 0) : sum, 0)
    const paidStudentsCount = students.filter(s => s.feeStatus === 'paid').length
    const unpaidStudentsCount = students.filter(s => s.feeStatus === 'unpaid').length
    const pendingApprovalsCount = fees.filter(f => f.status === 'pending').length

    const filteredStudents = students.map(student => {
        const studentPayments = fees.filter(f => f.studentId === student.id)
        const lastPayment = studentPayments.length > 0
            ? [...studentPayments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
            : null

        // Determine effective status: pending > paid > unpaid
        let displayStatus = student.feeStatus;
        if (lastPayment && lastPayment.status === 'pending') {
            displayStatus = 'pending';
        }

        return { ...student, displayStatus, lastPayment }
    }).filter(s => {
        const name = s.name || '';
        const id = s.id || '';
        const room = s.room || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || s.displayStatus === statusFilter;
        return matchesSearch && matchesStatus;
    })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Fee Management</h1>
                    <p className="text-gray-400">Track and manage student fee payments</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:shadow-xl transition-all shadow-lg font-bold"
                >
                    <Plus className="w-5 h-5" />
                    {userRole === 'admin' ? 'Record Payment' : 'Pay My Fee'}
                </button>
            </div>

            {/* Stats - Only show detailed stats to Admin */}
            {userRole === 'admin' ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-card p-6 relative overflow-hidden group border-b-4 border-green-500/30">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <CheckCircle className="w-20 h-20" />
                        </div>
                        <div className="text-4xl font-black text-green-400 mb-1">{paidStudentsCount}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Paid Students</div>
                    </div>
                    <div className="glass-card p-6 relative overflow-hidden group border-b-4 border-orange-500/30">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <DollarSign className="w-20 h-20" />
                        </div>
                        <div className="text-4xl font-black text-orange-400 mb-1">{pendingApprovalsCount}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Pending Approvals</div>
                    </div>
                    <div className="glass-card p-6 relative overflow-hidden group border-b-4 border-yellow-500/30">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Calendar className="w-20 h-20" />
                        </div>
                        <div className="text-4xl font-black text-yellow-400 mb-1">{unpaidStudentsCount}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Unpaid Students</div>
                    </div>
                    <div className="glass-card p-6 relative overflow-hidden group border-b-4 border-blue-500/30">
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <DollarSign className="w-20 h-20" />
                        </div>
                        <div className="text-4xl font-black text-blue-400 mb-1">${totalRevenue.toLocaleString()}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Revenue</div>
                    </div>
                </div>
            ) : (
                <div className="glass-card p-8 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border-l-4 border-purple-500">
                    <h2 className="text-2xl font-bold mb-2">My Fee Status: {students[0]?.feeStatus?.toUpperCase() || 'LOADING...'}</h2>
                    <p className="text-gray-400 text-sm italic">Please ensure your monthly fees are paid to avoid administrative warnings.</p>
                </div>
            )}

            {/* Search and Filters */}
            <div className="glass-card p-4 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search student, ID or room..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2 items-center">
                    {['all', 'paid', 'unpaid', 'pending'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tight transition-all ${statusFilter === s
                                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                                : 'bg-white/5 text-gray-500 hover:bg-white/10 border border-white/10'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Fee Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Student</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Room</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Last Payment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredStudents.map((student) => {
                                const { displayStatus, lastPayment } = student;

                                return (
                                    <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold border border-white/10">
                                                    {(student.name || '?').charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-100">{student.name}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono">{student.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-sm font-mono text-gray-400 bg-white/5 px-2 py-1 rounded">
                                                Room {student.room}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${displayStatus === 'paid'
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : displayStatus === 'pending'
                                                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                                                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                }`}>
                                                {displayStatus}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {lastPayment ? (
                                                <div className="flex justify-between items-center">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-200">${lastPayment.amount}</span>
                                                        <span className="text-[10px] text-gray-500 flex items-center gap-1 uppercase font-semibold">
                                                            <Calendar className="w-3 h-3" />
                                                            {lastPayment.month}
                                                        </span>
                                                    </div>
                                                    {lastPayment.status === 'pending' && userRole === 'admin' && (
                                                        <button
                                                            onClick={() => handleApprove(lastPayment.id)}
                                                            className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-[10px] font-bold hover:bg-green-500/30 transition-all uppercase"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-600 italic">No payments found</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-gray-500 italic">
                                        No students found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Payment Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">Record Payment</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Student</label>
                                <select
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-50"
                                    required
                                    disabled={userRole === 'student'}
                                >
                                    <option value="">Select Student</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Amount ($)</label>
                                    <input
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Month</label>
                                    <select
                                        value={formData.month}
                                        onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                    >
                                        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 mt-6">
                                <button type="submit" className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all">
                                    Save Payment
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
