import { create } from 'zustand'
import { User } from '../types'

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    token: string | null
    login: (user: User, token: string | null) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    token: null,
    login: (user, token) => set({ user: user, isAuthenticated: true, token: token }),
    logout: () => set({ user: null, isAuthenticated: false, token: null }),
}))
