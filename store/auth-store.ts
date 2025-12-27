import { create } from 'zustand'
import { User } from '@/types'

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    login: (user: User) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    login: (user) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('userRole', user.role)
            localStorage.setItem('userName', user.name)
            if (user.studentId) {
                localStorage.setItem('studentId', user.studentId)
            }
        }
        set({ user, isAuthenticated: true })
    },
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userRole')
            localStorage.removeItem('userName')
            localStorage.removeItem('studentId')
        }
        set({ user: null, isAuthenticated: false })
    },
}))
