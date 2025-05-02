"use client";

import AuthGuard from "@/components/AuthGuard";
import { useEffect, useState } from "react";
import { useInvestimentosStore } from "@/store/investimentos";
import { useAuthStore } from "@/store/auth";
import InvestimentoCard from "@/components/InvestimentoCard";
import InvestimentoForm from "@/components/InvestimentoForm";

export default function InvestimentosPage() {
  const { investimentos, fetchInvestimentos, loading, error } = useInvestimentosStore();
  const { user } = useAuthStore();
  const [isAddingInvestimento, setIsAddingInvestimento] = useState(false);

  useEffect(() => {
    fetchInvestimentos();
  }, [fetchInvestimentos]);

  const calcularTotalInvestido = () => {
    return investimentos.reduce((total, inv) => total + inv.valorTotal, 0);
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
              <h1 className="text-2xl font-bold text-blue-800">Meus Investimentos</h1>
              <p className="text-gray-600">Gerencie sua carteira de investimentos</p>
            </div>
            
            <div className="flex space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Investido</p>
                <p className="text-xl font-bold text-blue-700">{formatarMoeda(calcularTotalInvestido())}</p>
              </div>
              
              <button
                onClick={() => setIsAddingInvestimento(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow transition"
              >
                Adicionar Investimento
              </button>
            </div>
          </div>
        </div>
        
        {/* Formulário de adição */}
        {isAddingInvestimento && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-lg w-full">
              <InvestimentoForm onClose={() => setIsAddingInvestimento(false)} />
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
        
        {/* Lista de investimentos */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-600">Carregando investimentos...</p>
            </div>
          ) : investimentos.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow-md">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mt-4 text-lg text-gray-600">Você ainda não possui investimentos</p>
              <button
                onClick={() => setIsAddingInvestimento(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Adicionar seu primeiro investimento
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {investimentos.map((investimento) => (
                <InvestimentoCard
                  key={investimento.id}
                  id={investimento.id}
                  nome={investimento.nome}
                  simbolo={investimento.simbolo}
                  tipo={investimento.tipo}
                  valorUnitario={investimento.valorUnitario}
                  quantidade={investimento.quantidade}
                  valorTotal={investimento.valorTotal}
                  dataDaCompra={investimento.dataDaCompra}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
