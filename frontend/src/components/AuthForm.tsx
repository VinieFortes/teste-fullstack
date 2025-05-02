"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type FormData = {
  email: string;
  password: string;
  nome?: string;
};

export default function AuthForm({ isLogin = true }: { isLogin?: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await axios.post(`http://localhost:3001/api${endpoint}`, data);
      
      login(response.data.accessToken, response.data.user);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
      setErrorMessage(isLogin 
        ? 'Email ou senha inválidos' 
        : 'Falha no registro. Este email pode já estar em uso.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-blue-800">
          {isLogin ? 'Acesse sua conta' : 'Crie sua conta'}
        </h1>
        <p className="mt-2 text-gray-600 text-sm">
          {isLogin 
            ? 'Insira suas credenciais para acessar' 
            : 'Preencha os campos abaixo para se registrar'}
        </p>
      </div>
      
      {errorMessage && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              id="nome"
              type="text"
              {...register("nome", { required: !isLogin })}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              disabled={isLoading}
              placeholder="Seu nome completo"
            />
            {errors.nome && (
              <p className="text-red-500 text-sm mt-1">Nome é obrigatório</p>
            )}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: true })}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={isLoading}
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">Email é obrigatório</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Senha
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: true, minLength: 6 })}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            disabled={isLoading}
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password?.type === "required" && (
            <p className="text-red-500 text-sm mt-1">Senha é obrigatória</p>
          )}
          {errors.password?.type === "minLength" && (
            <p className="text-red-500 text-sm mt-1">
              Senha deve ter pelo menos 6 caracteres
            </p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg font-medium"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processando...</span>
            </div>
          ) : isLogin ? (
            "Entrar"
          ) : (
            "Registrar"
          )}
        </button>
      </form>
      
      <div className="text-center text-sm text-gray-600">
        {isLogin ? (
          <p>
            Não tem uma conta?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Registre-se aqui
            </Link>
          </p>
        ) : (
          <p>
            Já tem uma conta?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Entre aqui
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
