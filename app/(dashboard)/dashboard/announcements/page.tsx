'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Megaphone, Bell, AlertTriangle, ShieldCheck } from 'lucide-react'

export default function AnnouncementsPage() {
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [students, setStudents] = useState<any[]>([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        type: 'info',
        targetStudentIds: [] as string[]
    })
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const role = localStorage.getItem('userRole')
            if (role !== 'admin') {
                router.push('/dashboard')
            } else {
                loadData()
            }
        }
    }, [router])

    const loadData = async () => {
        try {
            const [announcementsRes, studentsRes] = await Promise.all([
                fetch('/api/announcements'),
                fetch('/api/students')
            ])
            const annData = await announcementsRes.json()
            const studData = await studentsRes.json()
            setAnnouncements(Array.isArray(annData) ? annData : [])
            setStudents(Array.isArray(studData) ? studData : [])
        } catch (error) {
            console.error('Failed to load data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            // Temporarily send without targetStudentIds until DB is synced
            const { targetStudentIds, ...dataToSend } = formData;

            const res = await fetch('/api/announcements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            })

            if (res.ok) {
                loadData()
                setShowModal(false)
                setFormData({ title: '', content: '', type: 'info', targetStudentIds: [] })
                alert('✓ Announcement posted successfully!')
            } else {
                const error = await res.json()
                alert(`Failed to post announcement: ${error.error || 'Unknown error'}`)
            }
        } catch (error) {
            console.error('Failed to save announcement:', error)
            alert('Failed to save announcement. Check console for details.')
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Delete this announcement?')) {
            try {
                const res = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' })
                if (res.ok) loadData()
            } catch (error) {
                console.error('Delete failed:', error)
            }
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'urgent': return <ShieldCheck className="w-5 h-5 text-red-400" />
            case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
            default: return <Bell className="w-5 h-5 text-blue-400" />
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Announcements</h1>
                    <p className="text-gray-400">Post warnings and updates for students</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all font-bold text-sm"
                >
                    <Plus className="w-5 h-5" />
                    New Announcement
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {Array.isArray(announcements) && announcements.map((item) => (
                    <div key={item.id} className="glass-card p-6 flex justify-between items-start animate-fade-in border-l-4 border-l-purple-500">
                        <div className="flex gap-4">
                            <div className={`p-3 rounded-xl bg-white/5 border border-white/10`}>
                                {getTypeIcon(item.type)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-1 flex items-center gap-2 flex-wrap">
                                    {item.title}
                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${item.type === 'urgent' ? 'border-red-500/30 text-red-500' :
                                        item.type === 'warning' ? 'border-yellow-500/30 text-yellow-500' :
                                            'border-blue-500/30 text-blue-500'
                                        }`}>
                                        {item.type}
                                    </span>
                                    {item.targetStudentIds && item.targetStudentIds.length > 0 && (
                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded border border-purple-500/30 text-purple-400 bg-purple-500/10">
                                            📍 {item.targetStudentIds.length} Student{item.targetStudentIds.length > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </h3>
                                <p className="text-gray-400 mb-2">{item.content}</p>
                                {item.targetStudentIds && item.targetStudentIds.length > 0 && (
                                    <div className="text-[10px] text-purple-400 mb-2 flex flex-wrap gap-1">
                                        <span className="font-bold">Visible to:</span>
                                        {students.filter(s => item.targetStudentIds.includes(s.id)).map((s: any) => (
                                            <span key={s.id} className="bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                                                {s.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <span className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">
                                    Posted: {new Date(item.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                {announcements.length === 0 && (
                    <div className="glass-card p-20 text-center text-gray-500 italic">
                        <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        No announcements posted yet.
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="glass-card w-full max-w-lg shadow-2xl border border-white/20 my-8 max-h-[90vh] flex flex-col">
                        {/* Fixed Header */}
                        <div className="p-6 pb-4 border-b border-white/10">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Megaphone className="w-6 h-6 text-purple-400" />
                                Post New Announcement
                            </h2>
                        </div>

                        {/* Scrollable Form Body */}
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="e.g., Late Fee Warning"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none"
                                        >
                                            <option value="info" className="bg-slate-900">Information</option>
                                            <option value="warning" className="bg-slate-900">Warning</option>
                                            <option value="urgent" className="bg-slate-900">Urgent</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center flex-wrap gap-2">
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Target Students (Optional)</label>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, targetStudentIds: students.map(s => s.id) })}
                                                className="text-[10px] px-2 py-1 bg-purple-500/20 text-purple-400 rounded hover:bg-purple-500/30 transition-all"
                                            >
                                                Select All
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, targetStudentIds: [] })}
                                                className="text-[10px] px-2 py-1 bg-white/5 text-gray-400 rounded hover:bg-white/10 transition-all"
                                            >
                                                Select None
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 max-h-[180px] overflow-y-auto">
                                        {students.length === 0 ? (
                                            <p className="text-xs text-gray-500 italic">No students available</p>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-2">
                                                {students.map((student: any) => (
                                                    <label key={student.id} className="flex items-center gap-2 cursor-pointer hover:bg-white/5 p-2 rounded transition-all">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.targetStudentIds.includes(student.id)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setFormData({ ...formData, targetStudentIds: [...formData.targetStudentIds, student.id] })
                                                                } else {
                                                                    setFormData({ ...formData, targetStudentIds: formData.targetStudentIds.filter(id => id !== student.id) })
                                                                }
                                                            }}
                                                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-2 focus:ring-purple-500 flex-shrink-0"
                                                        />
                                                        <span className="text-sm text-gray-300 flex-1 min-w-0 truncate">{student.name}</span>
                                                        <span className="text-[10px] text-gray-500 font-mono flex-shrink-0">Room {student.room}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-500 italic">
                                        {formData.targetStudentIds.length === 0
                                            ? '⚠️ Leaving this empty will show the announcement to ALL students'
                                            : `✓ Selected ${formData.targetStudentIds.length} student${formData.targetStudentIds.length > 1 ? 's' : ''}`}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Message Content</label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px] resize-none"
                                        placeholder="Enter your message here..."
                                        required
                                    />
                                </div>
                            </div>

                            {/* Sticky Footer with Buttons */}
                            <div className="p-6 pt-4 border-t border-white/10 bg-slate-900/50 backdrop-blur-sm">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl hover:shadow-purple-500/20 transition-all">
                                        Post Announcement
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
