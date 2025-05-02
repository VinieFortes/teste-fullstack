"use client";

import AuthGuard from "@/components/AuthGuard";
import { useEffect, useState } from "react";
import { useTransacoesStore } from "@/store/transacoes";
import { useAuthStore } from "@/store/auth";
import TransacaoCard from "@/components/TransacaoCard";
import TransacaoForm from "@/components/TransacaoForm";

export default function TransacoesPage() {
  const { transacoes, fetchTransacoes, removerTransacao, reverterTransacao, loading, error } = useTransacoesStore();
  const { user } = useAuthStore();
  const [isAddingTransacao, setIsAddingTransacao] = useState(false);

  useEffect(() => {
    fetchTransacoes();
  }, [fetchTransacoes]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      await removerTransacao(id);
    }
  };

  const handleReverter = async (id: string, motivo: string) => {
    await reverterTransacao(id, motivo);
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="space-y-6">
        {/* Cabeçalho e estatísticas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-blue-800">Minhas Transações</h1>
              <p className="text-gray-600">Histórico completo de suas movimentações financeiras</p>
            </div>
            
            <div className="flex space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Saldo Atual</p>
                <p className="text-xl font-bold text-green-600">{formatarMoeda(user?.saldo || 0)}</p>
              </div>
              
              <button
                onClick={() => setIsAddingTransacao(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow transition"
              >
                Nova Transação
              </button>
            </div>
          </div>
        </div>
        
        {/* Formulário de adição */}
        {isAddingTransacao && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-lg w-full">
              <TransacaoForm onClose={() => setIsAddingTransacao(false)} />
            </div>
          </div>
        )}
        
        {/* Mensagem de erro */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
            <div className="flex">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        {/* Lista de transações */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-600">Carregando transações...</p>
            </div>
          ) : transacoes.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mt-4 text-lg text-gray-600">Você ainda não registrou nenhuma transação</p>
              <button
                onClick={() => setIsAddingTransacao(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Registrar sua primeira transação
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transacoes.map((transacao) => (
                <TransacaoCard
                  key={transacao.id}
                  id={transacao.id}
                  valor={transacao.valor}
                  tipo={transacao.tipo}
                  descricao={transacao.descricao}
                  data={transacao.data}
                  status={transacao.status}
                  revertidaEm={transacao.revertidaEm}
                  motivoReversao={transacao.motivoReversao}
                  onDelete={handleDelete}
                  onReverter={handleReverter}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
