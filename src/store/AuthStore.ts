import { create } from 'zustand';

type Role = 'student' | 'teacher' | 'admin' | null;

interface AuthState {
  isAuthenticated: boolean;
  role: Role;
  userId: string | null;
  login: (role: Role, userId: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  userId: null,
  login: (role, userId) => set({ isAuthenticated: true, role, userId }),
  logout: () => set({ isAuthenticated: false, role: null, userId: null }),
}));
