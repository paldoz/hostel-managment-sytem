'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Users } from 'lucide-react'

export default function RoomsPage() {
    const [rooms, setRooms] = useState<any[]>([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({ number: '', capacity: 2, occupied: 0, status: 'available' })

    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const role = localStorage.getItem('userRole')
            if (role !== 'admin') {
                router.push('/dashboard')
            } else {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/rooms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                loadRooms()
                setShowModal(false)
                setFormData({ number: '', capacity: 2, occupied: 0, status: 'available' })
            }
        } catch (error) {
            console.error('Failed to save room:', error)
        }
    }

    const handleDelete = async (number: string) => {
        if (confirm(`Are you sure you want to delete room ${number}? This will also affect student assignments.`)) {
            try {
                const res = await fetch(`/api/rooms/${number}`, {
                    method: 'DELETE'
                })
                if (res.ok) {
                    loadRooms()
                } else {
                    const error = await res.json()
                    alert(error.error || 'Delete failed')
                }
            } catch (error) {
                console.error('Delete error:', error)
                alert('Connection error')
            }
        }
    }

    const [viewingRoom, setViewingRoom] = useState<any>(null)
    const [roomStudents, setRoomStudents] = useState<any[]>([])

    const viewStudents = async (roomNumber: string) => {
        try {
            // Fetch all students and filter (simple approach for now)
            // Ideally we'd have /api/students?room=R101
            const res = await fetch('/api/students')
            const allStudents = await res.json()
            const filtered = allStudents.filter((s: any) => {
                const sRoom = (s.room || '').toString().trim().toLowerCase();
                const rNum = roomNumber.toString().trim().toLowerCase();
                return sRoom === rNum;
            })
            setRoomStudents(filtered)
            const room = rooms.find(r => r.number === roomNumber)
            setViewingRoom(room)
        } catch (error) {
            console.error('Failed to load room students', error)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Room Management</h1>
                    <p className="text-gray-400">Manage hostel rooms and occupancy</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg"
                >
                    <Plus className="w-5 h-5" />
                    Add Room
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                    <div key={room.number} className="glass-card p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">{room.number}</h3>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${room.status === 'full'
                                    ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                    : room.status === 'occupied'
                                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                        : room.status === 'reserved'
                                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                            : 'bg-green-500/10 text-green-500 border-green-500/20'
                                    }`}>
                                    {room.status}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => viewStudents(room.number)}
                                    className="p-2 hover:bg-white/10 rounded-lg"
                                    title="View Students"
                                >
                                    <Users className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(room.number)}
                                    className="p-2 hover:bg-red-500/20 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Occupancy</span>
                                <span className="font-medium">{room.occupied} / {room.capacity}</span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                    className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all"
                                    style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Room Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-6">Add Room</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Room Number</label>
                                <input
                                    type="text"
                                    value={formData.number}
                                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                    placeholder="e.g., R101"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Capacity</label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                                    min="1"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
                                    Add Room
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

            {/* View Students Modal */}
            {viewingRoom && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="glass-card p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-2">Room {viewingRoom.number}</h2>
                        <p className="text-gray-400 mb-6">Residents List</p>

                        <div className="space-y-4 max-h-60 overflow-y-auto">
                            {roomStudents.length > 0 ? (
                                roomStudents.map(student => (
                                    <div key={student.id} className="p-3 bg-white/5 rounded-lg flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[10px] font-black overflow-hidden ring-1 ring-white/10">
                                                {student.avatar ? (
                                                    <img src={student.avatar} alt="" className="w-full h-full object-cover" />
                                                ) : student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{student.name}</p>
                                                <p className="text-[10px] text-gray-500 font-mono uppercase">{student.studentId || student.id}</p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400 font-medium">{student.phone}</div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">No students in this room.</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setViewingRoom(null)}
                                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
