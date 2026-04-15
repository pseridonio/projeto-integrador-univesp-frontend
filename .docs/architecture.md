Architecture — CafeSystem Frontend

Objetivo
Este documento descreve as decisões arquiteturais do CafeSystem Frontend.
O objetivo é equilibrar:

boas práticas modernas de frontend;
simplicidade de implementação;


Visão Geral
O frontend utiliza React + TypeScript com Vite.
A arquitetura segue princípios de Monólito Modular e Vertical Slice, inspirados em Clean Architecture e DDD, adaptados ao contexto de UI.

Essa combinação permite:
separação clara de responsabilidades,
código fácil de navegar,
evolução futura para microfrontends,
facilidade de testes.

Estrutura de Pastas
Código
src/
├── features/      # Lógica de funcionalidades (auth, produtos, pedidos)
├── pages/         # Páginas da aplicação (Login, Dashboard, etc.)
├── routes/        # Definição centralizada de rotas
├── shared/        # Componentes, hooks, utils e serviços comuns
├── App.tsx        # Componente raiz
└── main.tsx       # Ponto de entrada

Camadas e Responsabilidades
Domain (conceitual)  
Representado por types, interfaces e regras de negócio no frontend.
Ex.: User, Product, Order.

Application  
Implementa casos de uso via hooks e services.
Ex.: useLogin, useFetchProducts.

API  
Integração com o backend via Axios.
Ex.: authService.login(), orderService.create().

UI (Client)  
Componentes React e páginas, responsáveis apenas pela apresentação.
Ex.: LoginPage, ProductList.

Vertical Slice Architecture
Cada funcionalidade é organizada em sua própria pasta dentro de features/.
Exemplo:

Código
features/
 ├── auth/
 │   ├── components/
 │   ├── hooks/
 │   ├── services/
 │   └── types.ts
 ├── products/
 └── orders/
Isso facilita:

entendimento do fluxo,
manutenção,
isolamento de responsabilidades.

Convenções
Nomes em inglês para código.
Comentários e documentação em pt-BR com acentuação.
PascalCase para componentes, camelCase para variáveis e funções.
Rotas em inglês (/login, /orders).
Estilização com TailwindCSS ou componentes reutilizáveis em shared/components.

Testes
Unitários: hooks e serviços.
Integração: páginas e rotas.
End-to-End: fluxo completo com ferramentas como Playwright ou Cypress.

Evolução Arquitetural
O frontend foi projetado para permitir evolução futura:
controle de acesso por perfil,
dashboards administrativos,
suporte a múltiplos métodos de pagamento,
eventual migração para microfrontends.

Filosofia de Desenvolvimento
Seguir esta ordem:
Definição das entidades e tipos (Domain).
Implementação dos casos de uso (Application).
Integração com backend (API).
Construção das páginas e componentes (UI).
Testes.