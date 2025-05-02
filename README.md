# Carteira Digital - Sistema de Gestão de Investimentos

Sistema completo para gestão de investimentos pessoais com controle de transações financeiras.

## Funcionalidades

- Controle de saldo e transações
- Gestão de investimentos
- Autenticação segura
- Interface responsiva
- Dashboard com visão geral
- Depósitos e saques
- Histórico de transações

##  Tecnologias Utilizadas

### Backend
- NestJS
- TypeORM
- SQLite
- JWT Authentication
- TypeScript

### Frontend
- Next.js 13+ (App Router)
- Zustand
- TailwindCSS
- TypeScript
- Axios

##  Pré-requisitos

- Node.js 18+
- npm ou yarn

##  Instalação

### Backend

1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Execute as migrações:
```bash
npm run typeorm:run-migrations
```

5. Inicie o servidor:
```bash
npm run start:dev
```

O servidor estará rodando em `http://localhost:3001`

### Frontend

1. Entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

## Principais Recursos

### Autenticação
- Registro de usuários
- Login seguro com JWT
- Proteção de rotas

### Transações
- Depósitos
- Saques
- Histórico completo
- Reversão de transações
- Validação de saldo

### Investimentos
- Múltiplos tipos (Ações, Fundos, Renda Fixa, Cripto)
- Registro de compra e venda
- Controle de posição
- Histórico de operações

### Dashboard
- Visão geral do saldo
- Resumo de investimentos
- Últimas transações
- Gráficos e estatísticas

## Segurança

- Autenticação JWT
- Senha com hash seguro
- Validação de saldo
- Proteção contra transações duplicadas
- Transações atômicas

## Interface

- Design responsivo
- Tema claro e moderno
- Componentes reutilizáveis
- Feedback visual de ações
- Loading states
- Tratamento de erros

## Estrutura do Projeto

### Backend
```
backend/
  ├── src/
  │   ├── auth/         # Autenticação
  │   ├── users/        # Gestão de usuários
  │   ├── transacoes/   # Controle de transações
  │   ├── investimentos/# Gestão de investimentos
  │   └── common/       # Código compartilhado
  └── test/            # Testes
```

### Frontend
```
frontend/
  ├── src/
  │   ├── app/         # Páginas (App Router)
  │   ├── components/  # Componentes React
  │   ├── store/       # Estados globais
  │   └── styles/      # Estilos e temas
  └── public/         # Arquivos estáticos

