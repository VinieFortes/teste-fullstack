"use client";

import { Suspense, useEffect, useState } from 'react';
import { DateDisplay } from '@/components/DateDisplay';
import AuthGuard from '@/components/AuthGuard';
import { useAuthStore } from '@/store/auth';
import { useInvestimentosStore } from '@/store/investimentos';
import { useTransacoesStore } from '@/store/transacoes';
import Link from 'next/link';
import TransacaoCard from '@/components/TransacaoCard';
import InvestimentoCard from '@/components/InvestimentoCard';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { fetchInvestimentos, investimentos } = useInvestimentosStore();
  const { fetchTransacoes, transacoes } = useTransacoesStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchInvestimentos(),
        fetchTransacoes()
      ]);
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchInvestimentos, fetchTransacoes]);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };
  
  const calcularTotalInvestido = () => {
    return investimentos.reduce((total, inv) => total + inv.valorTotal, 0);
  };

  return (
    <AuthGuard requireAuth={true}>
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div className="relative bg-gradient-to-r from-blue-700 to-blue-900 p-8 rounded-2xl shadow-xl overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0 L100 0 L100 100 L0 100 Z" fill="url(#grid)" />
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Painel de Controle</h1>
                <p className="text-blue-100">Olá, <span className="font-semibold">{user?.nome || user?.email}</span>! Confira seu resumo financeiro.</p>
              </div>
              <Suspense fallback={
                <div className="mt-4 md:mt-0 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm">
                  <span>Carregando...</span>
                </div>
              }>
                <DateDisplay />
              </Suspense>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition transform hover:-translate-y-1">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-blue-500 rounded-full mr-3">
                    <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-blue-100 font-medium">Saldo Disponível</p>
                </div>
                <p className="text-3xl font-bold text-white">{formatarMoeda((user && user.saldo) ?? 0)}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition transform hover:-translate-y-1">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-green-500 rounded-full mr-3">
                    <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="text-blue-100 font-medium">Total Investido</p>
                </div>
                <p className="text-3xl font-bold text-white">{formatarMoeda(calcularTotalInvestido())}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition transform hover:-translate-y-1">
                <div className="flex items-center mb-2">
                  <div className="p-2 bg-purple-500 rounded-full mr-3">
                    <svg className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                  </div>
                  <p className="text-blue-100 font-medium">Patrimônio Total</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {formatarMoeda(((user && user.saldo) ?? 0) + calcularTotalInvestido())}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg text-gray-600">Carregando seus dados...</p>
          </div>
        ) : (
          <>
            {/* Investimentos recentes */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full mr-3">
                    <svg className="w-5 h-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-blue-800">Investimentos Recentes</h2>
                </div>
                <Link href="/investimentos" className="flex items-center text-blue-600 text-sm hover:underline font-medium bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition">
                  Ver todos 
                  <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              {investimentos.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Você ainda não possui investimentos registrados.</p>
                  <Link
                    href="/investimentos"
                    className="mt-2 inline-block text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Adicionar primeiro investimento
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {investimentos.slice(0, 3).map((investimento) => (
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
            
            {/* Transações recentes */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-full mr-3">
                    <svg className="w-5 h-5 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-blue-800">Transações Recentes</h2>
                </div>
                <Link href="/transacoes" className="flex items-center text-blue-600 text-sm hover:underline font-medium bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition">
                  Ver todas
                  <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              
              {transacoes.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Você ainda não possui transações registradas.</p>
                  <Link
                    href="/transacoes"
                    className="mt-2 inline-block text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Registrar primeira transação
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {transacoes.slice(0, 3).map((transacao) => (
                    <TransacaoCard
                      key={transacao.id}
                      id={transacao.id}
                      valor={transacao.valor}
                      tipo={transacao.tipo}
                      descricao={transacao.descricao}
                      data={transacao.data}
                    />
                  ))}
                </div>
              )}
            </div>
            
          </>
        )}
      </div>
    </AuthGuard>
  );
}
