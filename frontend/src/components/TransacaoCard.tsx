"use client";

import { useState } from 'react';

interface TransacaoCardProps {
  id: string;
  valor: number;
  tipo: 'DEPOSITO' | 'SAQUE' | 'INVESTIMENTO' | 'RESGATE';
  descricao: string;
  data: string;
  status?: 'ATIVA' | 'REVERTIDA';
  revertidaEm?: string;
  motivoReversao?: string;
  onDelete?: (id: string) => void;
  onReverter?: (id: string, motivo: string) => void;
}

export default function TransacaoCard({
  id,
  valor,
  tipo,
  descricao,
  data,
  status,
  revertidaEm,
  motivoReversao: transacaoMotivoReversao,
  onDelete,
  onReverter
}: TransacaoCardProps) {
  const [showReversaoModal, setShowReversaoModal] = useState(false);
  const [motivoReversao, setMotivoReversao] = useState('');
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tipoClass = {
    DEPOSITO: 'bg-green-100 text-green-800',
    SAQUE: 'bg-red-100 text-red-800',
    INVESTIMENTO: 'bg-blue-100 text-blue-800',
    RESGATE: 'bg-purple-100 text-purple-800'
  };
  
  const tipoIcon = {
    DEPOSITO: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
    ),
    SAQUE: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
      </svg>
    ),
    INVESTIMENTO: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    ),
    RESGATE: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
      </svg>
    )
  };

  const tipoTexto = {
    DEPOSITO: 'Depósito',
    SAQUE: 'Saque',
    INVESTIMENTO: 'Investimento',
    RESGATE: 'Resgate'
  };

  const valorClass = tipo === 'DEPOSITO' || tipo === 'RESGATE' ? 'text-green-600' : 'text-red-600';
  const valorPrefix = tipo === 'DEPOSITO' || tipo === 'RESGATE' ? '+' : '-';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${tipoClass[tipo]}`}>
              {tipoIcon[tipo]}
            </div>
            <div>
              <span className="font-medium">{tipoTexto[tipo]}</span>
              <p className="text-xs text-gray-500">{formatarData(data)}</p>
            </div>
          </div>
          <span className={`font-bold ${valorClass}`}>
            {valorPrefix}{formatarMoeda(valor)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm border-t border-gray-100 pt-3">
          {descricao}
        </p>
        
        {onDelete && (
          <div className="mt-3 space-y-2">
            {status === 'REVERTIDA' ? (
              <div className="text-sm text-gray-500">
                <p>Transação revertida em {formatarData(revertidaEm || '')}</p>
                {motivoReversao && <p>Motivo: {motivoReversao}</p>}
              </div>
            ) : (
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => onDelete?.(id)}
                  className="text-xs text-red-500 hover:text-red-600 transition"
                >
                  Excluir transação
                </button>
                <button
                  onClick={() => setShowReversaoModal(true)}
                  className="text-xs text-blue-500 hover:text-blue-600 transition"
                >
                  Reverter transação
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {showReversaoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Reverter Transação</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo da reversão
              </label>
              <textarea
                value={motivoReversao}
                onChange={(e) => setMotivoReversao(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                placeholder="Descreva o motivo da reversão..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowReversaoModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                  onClick={() => {
                  if (motivoReversao.trim() && onReverter) {
                    onReverter(id, motivoReversao);
                    setShowReversaoModal(false);
                    setMotivoReversao('');
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!motivoReversao.trim()}
              >
                Confirmar Reversão
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
