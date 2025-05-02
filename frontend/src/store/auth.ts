import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: {
    id: string;
    email: string;
    nome: string;
    saldo: number;
  } | null;
  isAuthenticated: boolean;
  init: () => void;
  login: (token: string, user: any) => void;
  logout: () => void;
  atualizarUsuario: (user: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  init: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      set({ 
        token, 
        user, 
        isAuthenticated: !!token 
      });
    }
  },
  
  login: async (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null, isAuthenticated: false });
  },
  
  atualizarUsuario: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
}));
