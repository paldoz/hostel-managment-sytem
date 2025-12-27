'use client'

import { useEffect, useState } from 'react'
import { Plus, CheckCircle, Droplet, Zap, Sparkles, Wrench, FileText } from 'lucide-react'

export default function ComplaintsPage() {
    const [complaints, setComplaints] = useState<any[]>([])
    const [filter, setFilter] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [userRole, setUserRole] = useState('')
    const [formData, setFormData] = useState({ category: '', description: '' })

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUserRole(localStorage.getItem('userRole') || '')
            loadComplaints()
        }
    }, [])

    const loadComplaints = async () => {
        try {
            const res = await fetch('/api/complaints')
            const data = await res.json()
            setComplaints(data)
        } catch (error) {
            console.error('Failed to load complaints:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const studentId = localStorage.getItem('studentId') || ''
        // For a real app, we'd fetch the student name from the DB or session too
        // Here we'll just send what we have

        try {
            const res = await fetch('/api/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId,
                    studentName: 'Student Name', // Simplified for now
                    category: formData.category,
                    description: formData.description,
                    status: 'pending',
                    date: new Date().toISOString().split('T')[0]
                })
            })

            if (res.ok) {
                loadComplaints()
                setShowModal(false)
                setFormData({ category: '', description: '' })
            }
        } catch (error) {
            console.error('Failed to submit complaint:', error)
        }
    }

    const updateComplaintStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/complaints/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                loadComplaints()
            }
        } catch (error) {
            console.error('Failed to update complaint status:', error)
        }
    }

    const categoryIcons: any = {
        Water: Droplet,
        Electricity: Zap,
        Cleaning: Sparkles,
        Maintenance: Wrench,
        Other: FileText
    }

    const filteredComplaints = filter === 'all'
        ? complaints
        : complaints.filter(c => c.status === filter)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Complaint Management</h1>
                    <p className="text-gray-400">Track and resolve student complaints</p>
                </div>
                {userRole === 'student' && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Submit Complaint
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="glass-card p-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-400 mr-2">Filter Status:</span>
                {['all', 'open', 'in-progress', 'resolved'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === f
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                    >
                        {f === 'in-progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            {/* Complaints Grid */}
            <div className="grid gap-6">
                {filteredComplaints.length === 0 ? (
                    <div className="glass-card p-12 text-center text-gray-500">
                        No complaints found for this category.
                    </div>
                ) : filteredComplaints.map((complaint) => {
                    const Icon = categoryIcons[complaint.category] || FileText
                    return (
                        <div key={complaint.id} className="glass-card p-6 hover:shadow-xl transition-all border border-transparent hover:border-white/10">
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <div className="flex gap-4 flex-1">
                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${complaint.status === 'resolved' ? 'from-green-600 to-emerald-600' : 'from-purple-600 to-indigo-600'} shadow-lg h-fit`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h3 className="text-xl font-extrabold">{complaint.category}</h3>
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${complaint.status === 'resolved'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                                : complaint.status === 'in-progress'
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                                }`}>
                                                {complaint.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed mb-4">{complaint.description}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-xs">
                                            <div className="flex items-center gap-1 text-gray-400">
                                                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                                                    {complaint.studentName.charAt(0)}
                                                </div>
                                                {complaint.studentName}
                                            </div>
                                            <span className="text-gray-600">•</span>
                                            <span className="text-gray-500 font-mono italic">{complaint.date}</span>
                                            <span className="text-gray-600">•</span>
                                            <span className="text-gray-500 font-mono">{complaint.id}</span>
                                        </div>
                                    </div>
                                </div>
                                {userRole === 'admin' && complaint.status !== 'resolved' && (
                                    <div className="flex gap-2 w-full md:w-auto">
                                        {complaint.status === 'open' && (
                                            <button
                                                onClick={() => updateComplaintStatus(complaint.id, 'in-progress')}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl hover:bg-blue-500/20 border border-blue-500/20 transition-all font-bold text-sm"
                                            >
                                                Start
                                            </button>
                                        )}
                                        <button
                                            onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/20 border border-green-500/20 transition-all font-bold text-sm"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Resolve
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Submit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">Submit Complaint</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Water">Water</option>
                                    <option value="Electricity">Electricity</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2 bg-white/10 rounded-lg"
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
