"use client";

import { useState } from 'react';
import { useInvestimentosStore } from '@/store/investimentos';

interface InvestimentoCardProps {
  id: string;
  nome: string;
  simbolo: string;
  tipo: 'ACAO' | 'FUNDO' | 'RENDA_FIXA' | 'CRIPTO';
  valorUnitario: number;
  quantidade: number;
  valorTotal: number;
  dataDaCompra: string;
}

export default function InvestimentoCard({
  id,
  nome,
  simbolo,
  tipo,
  valorUnitario,
  quantidade,
  valorTotal,
  dataDaCompra,
}: InvestimentoCardProps) {
  const { removerInvestimento } = useInvestimentosStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja remover este investimento?')) {
      try {
        setIsLoading(true);
        await removerInvestimento(id);
      } catch (error) {
        console.error('Falha ao remover investimento:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  const formatarData = (dataString: string) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const tipoFormatado = {
    ACAO: 'Ação',
    FUNDO: 'Fundo',
    RENDA_FIXA: 'Renda Fixa',
    CRIPTO: 'Criptomoeda'
  };

  const corTipo = {
    ACAO: 'bg-blue-100 text-blue-800',
    FUNDO: 'bg-purple-100 text-purple-800',
    RENDA_FIXA: 'bg-green-100 text-green-800',
    CRIPTO: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-4 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{nome}</h3>
            <p className="text-sm text-gray-500">{simbolo}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${corTipo[tipo]}`}>
            {tipoFormatado[tipo]}
          </span>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Valor Unitário</p>
            <p className="font-medium">{formatarMoeda(valorUnitario)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Quantidade</p>
            <p className="font-medium">{quantidade}</p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">Valor Total</p>
          <p className="text-lg font-bold text-blue-600">{formatarMoeda(valorTotal)}</p>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Data: {formatarData(dataDaCompra)}
        </span>
        
        <button
          onClick={handleDelete}
          className="text-sm text-red-500 hover:text-red-600 transition"
          disabled={isLoading}
        >
          {isLoading ? 'Removendo...' : 'Remover'}
        </button>
      </div>
    </div>
  );
}
