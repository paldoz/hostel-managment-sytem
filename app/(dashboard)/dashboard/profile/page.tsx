'use client'

import { useEffect, useState } from 'react'
import { User, Mail, Phone, Home, DollarSign, MessageSquare, Save, Camera } from 'lucide-react'

export default function ProfilePage() {
    const [student, setStudent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [formData, setFormData] = useState({
        phone: '',
        email: '',
        password: '',
        avatar: ''
    })
    const [showPayModal, setShowPayModal] = useState(false)
    const [paymentData, setPaymentData] = useState({ month: '', amount: '500' })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        const studentId = localStorage.getItem('studentId')
        if (!studentId) {
            setLoading(false)
            return
        }

        try {
            const res = await fetch(`/api/profile?studentId=${studentId}`)
            const data = await res.json()
            setStudent(data)
            setFormData({
                phone: data.phone,
                email: data.email,
                password: data.password,
                avatar: data.avatar || ''
            })
        } catch (error) {
            console.error('Failed to load profile:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: student.studentId,
                    ...formData
                })
            })

            if (res.ok) {
                const updated = await res.json()
                setStudent({ ...student, ...updated })
                setEditing(false)
                alert('Profile updated successfully!')
            }
        } catch (error) {
            console.error('Update failed:', error)
        }
    }

    const handlePayFee = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            const res = await fetch('/api/fees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: student.studentId,
                    month: paymentData.month,
                    amount: paymentData.amount,
                    status: 'pending'
                })
            })

            if (res.ok) {
                alert('Payment request submitted! Admin will approve it soon.')
                setShowPayModal(false)
                loadProfile()
            }
        } catch (error) {
            console.error('Payment failed:', error)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-400">Loading profile...</div>
    if (!student) return <div className="p-8 text-center text-gray-400">Please log in as a student to view this page.</div>

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                <p className="text-gray-400">Manage your personal information and view records</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Basic Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="glass-card p-6 text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white/10 mx-auto overflow-hidden">
                                {formData.avatar ? (
                                    <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : student.name.charAt(0)}
                            </div>
                            {editing && (
                                <button className="absolute bottom-0 right-0 p-2 bg-slate-800 rounded-full border border-white/20 shadow-lg text-white hover:bg-slate-700">
                                    <Camera className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <h2 className="text-2xl font-bold mb-1">{student.name}</h2>
                        <p className="text-gray-500 font-mono text-sm mb-4">{student.studentId}</p>
                        <div className="flex justify-center gap-2">
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-500/30">
                                Room {student.room}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${student.feeStatus === 'paid' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                {student.feeStatus}
                            </span>
                        </div>
                    </div>

                    <div className="glass-card p-6 space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Contact Details
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-300">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">{student.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">{student.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form & Records */}
                <div className="md:col-span-2 space-y-6">
                    <div className="glass-card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Account Settings</h3>
                            <button
                                onClick={() => setEditing(!editing)}
                                className="text-sm text-purple-400 hover:text-purple-300 font-bold"
                            >
                                {editing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
                                    <input
                                        type="email"
                                        disabled={!editing}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
                                    <input
                                        type="tel"
                                        disabled={!editing}
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Password</label>
                                <input
                                    type="password"
                                    disabled={!editing}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                                />
                            </div>

                            {editing && (
                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-white font-bold shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Records Tabs */}
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-bold mb-6">Your Records</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Recent Fees
                                    </h4>
                                    <button
                                        onClick={() => setShowPayModal(true)}
                                        className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 rounded font-bold hover:bg-purple-500/30 transition-all border border-purple-500/30"
                                    >
                                        Pay Now
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {student.fees.length > 0 ? student.fees.map((fee: any) => (
                                        <div key={fee.id} className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
                                            <div>
                                                <div className="text-sm font-bold text-gray-200">{fee.month}</div>
                                                <div className="text-[10px] text-gray-500">{fee.date}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-green-400">${fee.amount}</div>
                                                <div className="text-[10px] text-gray-500 uppercase">{fee.status}</div>
                                            </div>
                                        </div>
                                    )) : <p className="text-xs text-gray-600 italic">No fee records found.</p>}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Your Complaints
                                </h4>
                                <div className="space-y-2">
                                    {student.complaints.length > 0 ? student.complaints.map((c: any) => (
                                        <div key={c.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="text-sm font-bold text-gray-200">{c.category}</div>
                                                <span className={`px-2 py-[2px] rounded-full text-[8px] font-black uppercase border ${c.status === 'resolved' ? 'border-green-500/30 text-green-400' : 'border-yellow-500/30 text-yellow-400'}`}>
                                                    {c.status}
                                                </span>
                                            </div>
                                            <div className="text-[10px] text-gray-400 truncate">{c.description}</div>
                                        </div>
                                    )) : <p className="text-xs text-gray-600 italic">No complaints submitted.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pay Fee Modal */}
            {showPayModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-8 w-full max-w-sm">
                        <h2 className="text-2xl font-bold mb-2">Pay Fee</h2>
                        <p className="text-sm text-gray-400 mb-6">Submit a payment request for approval</p>

                        <form onSubmit={handlePayFee} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Month</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
                                    required
                                    value={paymentData.month}
                                    onChange={(e) => setPaymentData({ ...paymentData, month: e.target.value })}
                                >
                                    <option value="" disabled className="bg-slate-900">Select Month</option>
                                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                        <option key={m} value={m} className="bg-slate-900">{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Amount ($)</label>
                                <input
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none"
                                    required
                                    value={paymentData.amount}
                                    onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 py-2 rounded-lg font-bold disabled:opacity-50"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Payment'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPayModal(false)}
                                    className="px-4 py-2 bg-white/10 rounded-lg font-bold"
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
