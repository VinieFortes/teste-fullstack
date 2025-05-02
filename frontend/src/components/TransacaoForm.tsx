"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTransacoesStore } from '@/store/transacoes';

interface TransacaoFormProps {
  onClose: () => void;
}

interface FormData {
  tipo: 'DEPOSITO' | 'SAQUE' | 'INVESTIMENTO' | 'RESGATE';
  valor: number;
  descricao: string;
}

export default function TransacaoForm({ onClose }: TransacaoFormProps) {
  const { adicionarTransacao, error: transacaoError } = useTransacoesStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    defaultValues: {
      tipo: 'DEPOSITO',
    },
  });

  const tipoSelecionado = watch('tipo');

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsLoading(true);
    
    try {
      await adicionarTransacao({
        ...data,
        valor: Number(data.valor)
      });
      
      // Se houver erro no store, mostra o erro
      if (transacaoError) {
        setError(transacaoError);
        setIsLoading(false);
        return;
      }
      
      // Se chegou aqui, a transação foi bem-sucedida
      onClose();
    } catch (erro: any) {
      setError(erro?.message || 'Falha ao adicionar transação');
      setIsLoading(false);
    }
  };

  // Atualiza o erro local quando o erro da store muda
  useEffect(() => {
    if (transacaoError) {
      setError(transacaoError);
    }
  }, [transacaoError]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-800">Nova Transação</h2>
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
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Transação
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className={`border rounded-md p-3 flex items-center cursor-pointer ${tipoSelecionado === 'DEPOSITO' ? 'bg-green-50 border-green-500' : 'border-gray-300'}`}>
              <input
                type="radio"
                value="DEPOSITO"
                {...register("tipo")}
                className="sr-only"
              />
              <svg className={`w-5 h-5 mr-2 ${tipoSelecionado === 'DEPOSITO' ? 'text-green-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span>Depósito</span>
            </label>
            <label className={`border rounded-md p-3 flex items-center cursor-pointer ${tipoSelecionado === 'SAQUE' ? 'bg-red-50 border-red-500' : 'border-gray-300'}`}>
              <input
                type="radio"
                value="SAQUE"
                {...register("tipo")}
                className="sr-only"
              />
              <svg className={`w-5 h-5 mr-2 ${tipoSelecionado === 'SAQUE' ? 'text-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
              </svg>
              <span>Saque</span>
            </label>
            <label className={`border rounded-md p-3 flex items-center cursor-pointer ${tipoSelecionado === 'INVESTIMENTO' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'}`}>
              <input
                type="radio"
                value="INVESTIMENTO"
                {...register("tipo")}
                className="sr-only"
              />
              <svg className={`w-5 h-5 mr-2 ${tipoSelecionado === 'INVESTIMENTO' ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>Investimento</span>
            </label>
            <label className={`border rounded-md p-3 flex items-center cursor-pointer ${tipoSelecionado === 'RESGATE' ? 'bg-purple-50 border-purple-500' : 'border-gray-300'}`}>
              <input
                type="radio"
                value="RESGATE"
                {...register("tipo")}
                className="sr-only"
              />
              <svg className={`w-5 h-5 mr-2 ${tipoSelecionado === 'RESGATE' ? 'text-purple-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
              <span>Resgate</span>
            </label>
          </div>
        </div>
        
        <div>
          <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">
            Valor (R$)
          </label>
          <input
            id="valor"
            type="number"
            step="0.01"
            {...register("valor", { 
              required: "Valor é obrigatório",
              min: { value: 0.01, message: "Valor deve ser maior que zero" } 
            })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
            placeholder="0.00"
          />
          {errors.valor && (
            <p className="text-red-500 text-sm mt-1">{errors.valor.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            id="descricao"
            {...register("descricao", { required: "Descrição é obrigatória" })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
            disabled={isLoading}
            placeholder="Informe uma descrição para esta transação"
          ></textarea>
          {errors.descricao && (
            <p className="text-red-500 text-sm mt-1">{errors.descricao.message}</p>
          )}
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
            {isLoading ? "Processando..." : "Confirmar Transação"}
          </button>
        </div>
      </form>
    </div>
  );
}
