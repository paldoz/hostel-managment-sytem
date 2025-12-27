export interface Student {
    id: string
    name: string
    phone: string
    email: string
    room: string
    feeStatus: 'paid' | 'unpaid'
    joinDate: string
}

export interface Room {
    number: string
    capacity: number
    occupied: number
    status: 'available' | 'full'
}

export interface Fee {
    studentId: string
    month: string
    amount: number
    status: 'paid' | 'unpaid'
    date: string
}

export interface Complaint {
    id: string
    studentId: string
    studentName: string
    category: 'Water' | 'Electricity' | 'Cleaning' | 'Maintenance' | 'Other'
    description: string
    status: 'pending' | 'resolved'
    date: string
}

export interface User {
    role: 'admin' | 'student'
    name: string
    studentId?: string
}

export interface DashboardStats {
    totalStudents: number
    totalRooms: number
    paidFees: number
    pendingComplaints: number
    availableRooms: number
    occupiedRooms: number
}
