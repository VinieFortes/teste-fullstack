import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './auth';

interface Transacao {
  id: string;
  valor: number;
  tipo: 'DEPOSITO' | 'SAQUE' | 'INVESTIMENTO' | 'RESGATE';
  descricao: string;
  data: string;
  status: 'ATIVA' | 'REVERTIDA';
  revertidaEm?: string;
  motivoReversao?: string;
}

interface TransacoesState {
  transacoes: Transacao[];
  loading: boolean;
  error: string | null;
  fetchTransacoes: () => Promise<void>;
  adicionarTransacao: (transacao: { 
    valor: number; 
    tipo: 'DEPOSITO' | 'SAQUE' | 'INVESTIMENTO' | 'RESGATE';
    descricao: string;
  }) => Promise<void>;
  removerTransacao: (id: string) => Promise<void>;
  reverterTransacao: (id: string, motivo: string) => Promise<void>;
}

const API_URL = 'http://localhost:3001/api';

const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  return error.message || 'Ocorreu um erro na operação';
};

export const useTransacoesStore = create<TransacoesState>((set) => ({
  transacoes: [],
  loading: false,
  error: null,

  fetchTransacoes: async () => {
    try {
      set({ loading: true, error: null });
      const token = useAuthStore.getState().token;
      
      const response = await axios.get(`${API_URL}/transacoes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set({ transacoes: response.data, loading: false });
    } catch (error: any) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },

  adicionarTransacao: async (transacao) => {
    try {
      set({ loading: true, error: null });
      const token = useAuthStore.getState().token;
      
      const response = await axios.post(`${API_URL}/transacoes`, transacao, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set((state) => ({
        transacoes: [response.data, ...state.transacoes],
        loading: false,
        error: null
      }));
      
      const userResponse = await axios.get(`${API_URL}/users/${useAuthStore.getState().user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      useAuthStore.getState().atualizarUsuario(userResponse.data);
      
    } catch (error: any) {
      // Exibir mensagem amigável para saldo insuficiente
      if (error.response?.data?.message === 'Saldo insuficiente para esta operação') {
        set({ 
          error: 'Saldo insuficiente para realizar esta operação. Por favor, verifique seu saldo disponível.', 
          loading: false 
        });
      } else {
        set({ error: getErrorMessage(error), loading: false });
      }
    }
  },

  removerTransacao: async (id) => {
    try {
      set({ loading: true, error: null });
      const token = useAuthStore.getState().token;
      
      await axios.delete(`${API_URL}/transacoes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      await useTransacoesStore.getState().fetchTransacoes();
      
      const userResponse = await axios.get(`${API_URL}/users/${useAuthStore.getState().user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      useAuthStore.getState().atualizarUsuario(userResponse.data);
      
    } catch (error: any) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },

  reverterTransacao: async (id, motivo) => {
    try {
      set({ loading: true, error: null });
      const token = useAuthStore.getState().token;
      
      await axios.post(`${API_URL}/transacoes/${id}/reverter`, { motivo }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      await useTransacoesStore.getState().fetchTransacoes();
      
      const userResponse = await axios.get(`${API_URL}/users/${useAuthStore.getState().user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      useAuthStore.getState().atualizarUsuario(userResponse.data);
      
    } catch (error: any) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },
}));
