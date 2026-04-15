Instruções para GitHub Copilot — Desenvolvimento em React + Vite

Recomendações gerais
Seguir as decisões arquiteturais definidas em .docs/Architecture.md (estrutura modular, separação de responsabilidades).

Usar TypeScript com tipagem explícita sempre que possível.
Componentes devem ser funcionais e escritos em React Hooks.
Manter lógica de negócio separada em features/ e services/, evitando acoplamento dentro de componentes.
Utilizar Axios para chamadas HTTP, centralizando configuração em src/shared/services.
Nomes de variáveis, funções e componentes em inglês; comentários e documentação em pt-BR com acentuação adequada.
Estilização com TailwindCSS ou componentes reutilizáveis em shared/components.

Convenções de nomenclatura
PascalCase → componentes React (LoginPage, UserCard).
camelCase → variáveis e funções (handleSubmit, userName).
kebab-case → nomes de arquivos (login-page.tsx).
index.ts → usado para exportar módulos dentro de pastas.

Boas práticas
Separar responsabilidades:

Componentes → apenas UI.
Hooks → lógica de estado e efeitos.
Services → integração com backend.
Evitar duplicação: criar utilitários em shared/utils.
Rotas: manter definidas em src/routes, sempre em inglês (/login, /dashboard).
Testes: adicionar testes unitários para hooks e componentes críticos.

SOLID e Clean Code no Frontend
SRP: cada componente deve ter uma única responsabilidade.
OCP: componentes devem ser extensíveis via props, não modificados diretamente.
LSP: componentes genéricos devem poder ser substituídos por versões especializadas sem quebrar.
ISP: preferir hooks específicos em vez de hooks “gigantes”.
DIP: depender de abstrações (interfaces/types), não de implementações fixas.

Code Review
Verificar se o código segue a arquitetura definida.
Conferir clareza e legibilidade acima de “cleverness”.
Garantir que nomes sejam significativos e consistentes.
Validar que novos componentes tenham testes básicos.
Conferir se rotas e serviços estão documentados.

Estrutura recomendada
Código
src/
├── features/      # Lógica de domínio (auth, produtos, etc.)
├── pages/         # Páginas da aplicação
├── routes/        # Rotas centralizadas
├── shared/        # Componentes, hooks, utils e serviços comuns
├── App.tsx        # Componente raiz
└── main.tsx       # Ponto de entrada

Observações finais
Priorizar clareza e manutenibilidade.
Evitar mudanças que contrariem .docs/Architecture.md.
Manter este arquivo atualizado conforme o projeto evolui.