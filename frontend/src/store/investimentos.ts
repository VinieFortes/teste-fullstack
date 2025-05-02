import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './auth';

interface Investimento {
  id: string;
  nome: string;
  simbolo: string;
  tipo: 'ACAO' | 'FUNDO' | 'RENDA_FIXA' | 'CRIPTO';
  valorUnitario: number;
  quantidade: number;
  valorTotal: number;
  dataDaCompra: string;
}

interface InvestimentosState {
  investimentos: Investimento[];
  loading: boolean;
  error: string | null;
  fetchInvestimentos: () => Promise<void>;
  adicionarInvestimento: (investimento: {
    nome: string;
    simbolo: string;
    tipo: 'ACAO' | 'FUNDO' | 'RENDA_FIXA' | 'CRIPTO';
    valorUnitario: number;
    quantidade: number;
  }) => Promise<void>;
  atualizarInvestimento: (id: string, investimento: Partial<Investimento>) => Promise<void>;
  removerInvestimento: (id: string) => Promise<void>;
}

const API_URL = 'http://localhost:3001/api';

const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    if (error.response.data.message === 'Saldo insuficiente para esta operação') {
      return 'Saldo insuficiente para realizar este investimento. Por favor, verifique seu saldo disponível.';
    }
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  return error.message || 'Ocorreu um erro ao processar sua solicitação';
};

export const useInvestimentosStore = create<InvestimentosState>((set) => ({
  investimentos: [],
  loading: false,
  error: null,

  fetchInvestimentos: async () => {
    try {
      set({ loading: true, error: null });
      const token = useAuthStore.getState().token;
      
      const response = await axios.get(`${API_URL}/investimentos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set({ investimentos: response.data, loading: false });
    } catch (error: any) {
      set({ error: getErrorMessage(error), loading: false });
    }
  },

  adicionarInvestimento: async (investimento) => {
    try {
      set({ loading: true, error: null });
      const token = useAuthStore.getState().token;
      
      const response = await axios.post(`${API_URL}/investimentos`, investimento, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set((state) => ({
        investimentos: [response.data, ...state.investimentos],
        loading: false,
        error: null
      }));

      // Atualizar o saldo do usuário
      const userResponse = await axios.get(`${API_URL}/users/${useAuthStore.getState().user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      useAuthStore.getState().atualizarUsuario(userResponse.data);
      
    } catch (error: any) {
      set({ 
        error: getErrorMessage(error), 
        loading: false 
      });
      throw error;
    }
  },

  atualizarInvestimento: async (id, investimento) => {
    try {
      set({ loading: true, error: null });
      const token = useAuthStore.getState().token;
      
      const response = await axios.patch(`${API_URL}/investimentos/${id}`, investimento, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set((state) => ({
        investimentos: state.investimentos.map((i) => (i.id === id ? response.data : i)),
        loading: false,
      }));

      // Atualizar o saldo do usuário
      const userResponse = await axios.get(`${API_URL}/users/${useAuthStore.getState().user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      useAuthStore.getState().atualizarUsuario(userResponse.data);
      
    } catch (error: any) {
      set({ error: getErrorMessage(error), loading: false });
      throw error;
    }
  },

  removerInvestimento: async (id) => {
    try {
      set({ loading: true, error: null });
      const token = useAuthStore.getState().token;
      
      await axios.delete(`${API_URL}/investimentos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      set((state) => ({
        investimentos: state.investimentos.filter((investimento) => investimento.id !== id),
        loading: false,
      }));

      // Atualizar o saldo do usuário
      const userResponse = await axios.get(`${API_URL}/users/${useAuthStore.getState().user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      useAuthStore.getState().atualizarUsuario(userResponse.data);
      
    } catch (error: any) {
      set({ error: getErrorMessage(error), loading: false });
      throw error;
    }
  },
}));
