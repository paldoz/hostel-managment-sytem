'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Edit, Trash2, X, UserCircle, Filter, ChevronDown, SortAsc, SortDesc } from 'lucide-react'

export default function StudentsPage() {
    const router = useRouter()
    const [students, setStudents] = useState<any[]>([])
    const [rooms, setRooms] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState<'name' | 'id'>('name')
    const [selectedRoom, setSelectedRoom] = useState('All')
    const [showModal, setShowModal] = useState(false)
    const [editingStudent, setEditingStudent] = useState<any>(null)
    const [formData, setFormData] = useState({
        id: '',
        studentId: '', // For database
        name: '',
        phone: '',
        email: '',
        room: '',
        feeStatus: 'unpaid',
        joinDate: '',
        avatar: ''
    })

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const role = localStorage.getItem('userRole')
            if (role !== 'admin') {
                router.push('/dashboard')
            } else {
                loadStudents()
                loadRooms()
            }
        }
    }, [router])

    const loadRooms = async () => {
        try {
            const res = await fetch('/api/rooms')
            const data = await res.json()
            setRooms(data)
        } catch (error) {
            console.error('Failed to load rooms:', error)
        }
    }

    const loadStudents = async () => {
        try {
            const res = await fetch('/api/students')
            const data = await res.json()
            setStudents(data)
        } catch (error) {
            console.error('Failed to load students:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = editingStudent ? `/api/students/${editingStudent.id}` : '/api/students';
            const method = editingStudent ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                studentId: formData.id // Ensure consistency
            }

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                loadStudents()
                setShowModal(false)
                resetForm()
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error || 'Operation failed'}${errorData.details ? '\nDetails: ' + errorData.details : ''}`);
            }
        } catch (error) {
            console.error('Failed to save student:', error)
            alert('Failed to save student');
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this student?')) {
            try {
                const res = await fetch(`/api/students/${id}`, { method: 'DELETE' })
                if (res.ok) {
                    loadStudents()
                } else {
                    alert('Delete failed')
                }
            } catch (error) {
                console.error('Delete error:', error)
            }
        }
    }

    const openAddModal = () => {
        resetForm()
        setFormData({
            ...formData,
            id: 'STU' + Date.now().toString().slice(-6),
            joinDate: new Date().toISOString().split('T')[0]
        })
        setShowModal(true)
    }

    const openEditModal = (student: any) => {
        setEditingStudent(student)
        setFormData({
            ...student,
            id: student.studentId || student.id // Map correctly
        })
        setShowModal(true)
    }

    const resetForm = () => {
        setEditingStudent(null)
        setFormData({
            id: '',
            studentId: '',
            name: '',
            phone: '',
            email: '',
            room: '',
            feeStatus: 'unpaid',
            joinDate: '',
            avatar: ''
        })
    }

    // Get unique rooms for filter
    const uniqueRooms = useMemo(() => {
        return ['All', ...Array.from(new Set(students.map(s => s.room)))]
    }, [students])

    const filteredStudents = useMemo(() => {
        return students
            .filter(s =>
                (s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    s.room.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (selectedRoom === 'All' || s.room === selectedRoom)
            )
            .sort((a, b) => {
                if (sortBy === 'name') return a.name.localeCompare(b.name)
                return (a.studentId || '').localeCompare(b.studentId || '')
            })
    }, [students, searchTerm, selectedRoom, sortBy])

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Student Management</h1>
                    <p className="text-gray-400">Manage hostel students and their information</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:shadow-xl transition-all shadow-lg font-bold"
                >
                    <Plus className="w-5 h-5" />
                    Add New Student
                </button>
            </div>

            {/* Search and Filters */}
            <div className="glass-card p-4 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search name, ID or room..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                    />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Sort:</span>
                    <select
                        value={sortBy}
                        onChange={(e: any) => setSortBy(e.target.value)}
                        className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none cursor-pointer hover:bg-slate-800 transition-colors"
                    >
                        <option value="name">Name</option>
                        <option value="id">ID</option>
                    </select>
                </div>

                <div className="flex gap-2 items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Room:</span>
                    <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none cursor-pointer hover:bg-slate-800 transition-colors"
                    >
                        {uniqueRooms.map(room => (
                            <option key={room} value={room}>{room}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Students Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-gray-300">
                                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest">Student Info</th>
                                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest">Phone</th>
                                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest">Room</th>
                                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest">Fee Status</th>
                                <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-xl group-hover:scale-110 transition-transform overflow-hidden ring-2 ring-white/10">
                                                {student.avatar ? (
                                                    <img src={student.avatar} alt="" className="w-full h-full object-cover" />
                                                ) : student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-extrabold text-gray-100">{student.name}</div>
                                                <div className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">{student.studentId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-400 font-medium">{student.phone}</td>
                                    <td className="py-4 px-6">
                                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-black font-mono text-purple-400 uppercase">
                                            Room {student.room}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${student.feeStatus === 'paid'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                            }`}>
                                            {student.feeStatus}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(student)}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-gray-500 italic">
                                        <div className="flex flex-col items-center gap-3">
                                            <Search className="w-10 h-10 opacity-20" />
                                            <span>No students found matching your criteria.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-8 w-full max-w-lg shadow-2xl animate-fade-in border-white/20">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-black">{editingStudent ? 'Update' : 'Register'} Student</h2>
                                <p className="text-sm text-gray-500">Enter student details below</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Student ID</label>
                                    <input
                                        type="text"
                                        value={formData.id}
                                        onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                        required
                                        placeholder="STU-001"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                        required
                                        placeholder="+1234567890"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                        required
                                        placeholder="student@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Room Number</label>
                                    <select
                                        value={formData.room}
                                        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:ring-2 focus:ring-purple-500/50 outline-none transition-all cursor-pointer"
                                        required
                                    >
                                        <option value="" disabled className="bg-slate-900">Select Room</option>
                                        {rooms.map(room => (
                                            <option key={room.id} value={room.number} className="bg-slate-900">
                                                {room.number} ({room.occupied}/{room.capacity})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Join Date</label>
                                    <input
                                        type="date"
                                        value={formData.joinDate}
                                        onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Avatar URL (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.avatar}
                                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl text-white font-black uppercase tracking-widest hover:shadow-2xl hover:shadow-purple-500/20 active:scale-[0.98] transition-all shadow-xl"
                                >
                                    {editingStudent ? 'Update Records' : 'Register Student'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-4 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all uppercase text-[10px] tracking-widest"
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
