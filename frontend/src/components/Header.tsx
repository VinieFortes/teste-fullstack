"use client";

import { useAuthStore } from '@/store/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  HomeIcon, 
  InvestmentIcon, 
  TransactionIcon, 
  LoginIcon, 
  LogoutIcon, 
  RegisterIcon, 
  WalletIcon,
  MenuIcon,
  CloseIcon
} from './icons';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(valor);
  };

  return (
    <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
              <div className="mr-2 p-2 bg-white rounded-full">
                <WalletIcon />
              </div>
              <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-white to-blue-100 text-transparent bg-clip-text">
                CarteiraDigital
              </span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center"
                >
                  <HomeIcon />
                  Dashboard
                </Link>
                <Link 
                  href="/investimentos" 
                  className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center"
                >
                  <InvestmentIcon />
                  Investimentos
                </Link>
                <Link 
                  href="/transacoes" 
                  className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center"
                >
                  <TransactionIcon />
                  Transações
                </Link>
                <div className="flex items-center ml-4 pl-4 border-l border-white/20">
                  <div className="flex flex-col items-end mr-3">
                    <span className="text-sm font-medium text-white">
                      {user?.nome || user?.email}
                    </span>
                    {user?.saldo !== undefined && (
                      <span className="text-xs font-bold text-green-300">
                        {formatarMoeda(user.saldo)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-blue-800 bg-white rounded-lg hover:bg-blue-50 shadow transition flex items-center"
                  >
                    <LogoutIcon />
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition flex items-center">
                  <LoginIcon />
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-blue-800 bg-white rounded-lg hover:bg-blue-50 shadow transition flex items-center"
                >
                  <RegisterIcon />
                  Registrar
                </Link>
              </>
            )}
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              className="text-white p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/20 space-y-2">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="block py-2 text-white/80 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/investimentos" 
                  className="block py-2 text-white/80 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Investimentos
                </Link>
                <Link 
                  href="/transacoes" 
                  className="block py-2 text-white/80 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Transações
                </Link>
                <div className="pt-2 border-t border-white/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white/80">
                      {user?.nome || user?.email}
                    </span>
                    {user?.saldo !== undefined && (
                      <span className="text-xs font-bold text-green-300">
                        Saldo: {formatarMoeda(user.saldo)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="mt-2 w-full px-4 py-2 text-sm font-medium text-blue-800 bg-white rounded-md hover:bg-gray-100 transition"
                  >
                    Sair
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="block py-2 text-white/80 hover:text-white transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="block mt-2 px-4 py-2 text-sm font-medium text-blue-800 bg-white rounded-md hover:bg-gray-100 transition text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Registrar
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
