"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useInvestimentosStore } from '@/store/investimentos';

interface InvestimentoFormProps {
  onClose: () => void;
}

interface FormData {
  nome: string;
  simbolo: string;
  tipo: 'ACAO' | 'FUNDO' | 'RENDA_FIXA' | 'CRIPTO';
  valorUnitario: number;
  quantidade: number;
}

export default function InvestimentoForm({ onClose }: InvestimentoFormProps) {
  const { adicionarInvestimento, error: investimentoError } = useInvestimentosStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      await adicionarInvestimento({
        ...data,
        valorUnitario: Number(data.valorUnitario),
        quantidade: Number(data.quantidade)
      });
      
      if (investimentoError) {
        setError(investimentoError);
        setIsLoading(false);
        return;
      }
      
      onClose();
    } catch (erro: any) {
      setError(erro?.message || 'Falha ao adicionar investimento');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (investimentoError) {
      setError(investimentoError);
    }
  }, [investimentoError]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-800">Novo Investimento</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Investimento
            </label>
            <input
              id="nome"
              type="text"
              {...register("nome", { required: "Nome é obrigatório" })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              placeholder="Ex: Petrobras"
            />
            {errors.nome && (
              <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="simbolo" className="block text-sm font-medium text-gray-700 mb-1">
              Símbolo/Código
            </label>
            <input
              id="simbolo"
              type="text"
              {...register("simbolo", { required: "Símbolo é obrigatório" })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              placeholder="Ex: PETR4"
            />
            {errors.simbolo && (
              <p className="text-red-500 text-sm mt-1">{errors.simbolo.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Investimento
          </label>
          <select
            id="tipo"
            {...register("tipo", { required: "Tipo é obrigatório" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          >
            <option value="ACAO">Ação</option>
            <option value="FUNDO">Fundo</option>
            <option value="RENDA_FIXA">Renda Fixa</option>
            <option value="CRIPTO">Criptomoeda</option>
          </select>
          {errors.tipo && (
            <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="valorUnitario" className="block text-sm font-medium text-gray-700 mb-1">
              Valor Unitário (R$)
            </label>
            <input
              id="valorUnitario"
              type="number"
              step="0.01"
              {...register("valorUnitario", { 
                required: "Valor unitário é obrigatório",
                min: { value: 0.01, message: "Valor deve ser maior que zero" } 
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              placeholder="0.00"
            />
            {errors.valorUnitario && (
              <p className="text-red-500 text-sm mt-1">{errors.valorUnitario.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade
            </label>
            <input
              id="quantidade"
              type="number"
              step="0.01"
              {...register("quantidade", { 
                required: "Quantidade é obrigatória",
                min: { value: 0.01, message: "Quantidade deve ser maior que zero" } 
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
              placeholder="0.00"
            />
            {errors.quantidade && (
              <p className="text-red-500 text-sm mt-1">{errors.quantidade.message}</p>
            )}
          </div>
        </div>
        
        {error && (
          <div className="p-3 border-l-4 border-red-500 bg-red-50 text-red-700 mb-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Investimento"}
          </button>
        </div>
      </form>
    </div>
  );
}
