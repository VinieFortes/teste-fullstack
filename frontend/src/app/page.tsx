"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    !isAuthenticated ? (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-800">Bem-vindo à sua Carteira Digital</h1>
      <p className="text-xl mb-8 max-w-lg text-gray-600">
        Gerencie seus investimentos de forma simples e segura, acompanhando seu saldo e rendimentos em tempo real.
      </p>
      
      <div className="flex gap-4">
        <Link 
          href="/login"
          className="px-8 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
        >
          Entrar
        </Link>
        <Link
          href="/register"
          className="px-8 py-3 text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 transition shadow-lg hover:shadow-xl"
        >
          Registrar
        </Link>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-100 rounded-full">
              <Image 
                src="/file.svg" 
                alt="Controle de Saldo" 
                width={40} 
                height={40}
                className="text-blue-600"
              />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-blue-800">Controle de Saldo</h3>
          <p className="text-gray-600">
            Acompanhe depósitos, saques e saldo disponível na sua conta com facilidade.
          </p>
        </div>
        
        <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-green-100 rounded-full">
              <Image 
                src="/window.svg" 
                alt="Carteira de Investimentos" 
                width={40} 
                height={40}
                className="text-green-600"
              />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-blue-800">Investimentos</h3>
          <p className="text-gray-600">
            Registre e acompanhe seus investimentos em ações, fundos, renda fixa e criptomoedas.
          </p>
        </div>
        
        <div className="p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-purple-100 rounded-full">
              <Image 
                src="/globe.svg" 
                alt="Histórico de Transações" 
                width={40} 
                height={40}
                className="text-purple-600"
              />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-blue-800">Transações</h3>
          <p className="text-gray-600">
            Histórico completo de todas as suas transações financeiras em um só lugar.
          </p>
        </div>
      </div>
    </div>
    ) : null
  );
}
