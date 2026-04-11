# projeto-integrador-univesp-frontend
Projeto integrador Univesp

Sobre o projeto
Este repositório contém o frontend do sistema CafeSystem, parte do Projeto Integrador UNIVESP.
O objetivo é fornecer uma interface web moderna e responsiva para gerenciamento de comandas em cafeterias/restaurantes simples, integrando-se ao backend em C# .NET.

Este projeto tem foco didático, aplicando boas práticas modernas de desenvolvimento frontend, mantendo a complexidade adequada para um time iniciante.
Os membros do grupo poderão aprender conceitos importantes como:
Organização de componentes e páginas
Gerenciamento de estado
Integração com APIs REST
Responsividade e boas práticas de UI/UX
Testes de interface

Objetivos do Frontend
O sistema permitirá:
Autenticação de usuários (login/logout)
Cadastro e gerenciamento de usuários
Cadastro e gerenciamento de produtos e categorias
Abertura e gerenciamento de comandas
Inclusão, alteração e remoção de itens em comandas
Fechamento de comandas

Arquitetura
O frontend utiliza React + TypeScript com Vite como bundler.
A organização segue uma estrutura modular, separando responsabilidades em pastas:

Código
src/
├── features/      # Lógica de funcionalidades (ex: autenticação, produtos)
├── pages/         # Páginas da aplicação (Login, Dashboard, etc.)
├── routes/        # Definição de rotas
├── shared/        # Componentes reutilizáveis
├── App.tsx        # Componente raiz
└── main.tsx       # Ponto de entrada

Tecnologias
React 24
TypeScript
Vite
Axios (integração com backend)
React Router DOM (navegação)
TailwindCSS (estilização responsiva)

Instalação e execução
Pré-requisitos
Node.js 20+
npm
Passos
bash

# Clonar o repositório
git clone https://github.com/seu-usuario/projeto-integrador-univesp-frontend.git

# Entrar na pasta
cd projeto-integrador-univesp-frontend

# Instalar dependências
npm install

# Rodar em ambiente de desenvolvimento
npm run dev
O servidor será iniciado em http://localhost:5173.

Scripts disponíveis
npm run dev → inicia o servidor de desenvolvimento
npm run build → gera a versão de produção
npm run preview → pré-visualiza a versão de produção

Testes
O frontend incluirá:
Testes unitários para componentes e hooks
Testes de integração para rotas e páginas
Testes end-to-end simulando o fluxo completo do usuário

Objetivo educacional
Este projeto foi estruturado para permitir que todos os participantes aprendam:
Boas práticas de frontend moderno
Integração com APIs REST
Organização modular de projetos React
Testes automatizados
Responsividade e acessibilidade