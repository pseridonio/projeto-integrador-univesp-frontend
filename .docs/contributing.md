# Contributing — CafeSystem Frontend

Obrigado por contribuir com o **CafeSystem Frontend**.

Este projeto possui um objetivo educacional e busca seguir boas práticas de engenharia de software e desenvolvimento frontend moderno.

Este documento descreve como contribuir corretamente para o projeto.

---

## Objetivo Educacional
Este projeto foi estruturado para permitir que todos os participantes aprendam:
- arquitetura de software aplicada ao frontend
- organização de projetos React + TypeScript
- integração com APIs REST
- testes automatizados (unitários, integração e end-to-end)
- trabalho colaborativo em equipe

Por isso, decisões de implementação devem sempre considerar **clareza e aprendizado**, não apenas velocidade.

---

## Fluxo de Desenvolvimento
O desenvolvimento deve seguir a seguinte ordem:
1. Definição das entidades e tipos (Domain)
2. Implementação dos casos de uso (hooks e services)
3. Integração com backend (API)
4. Construção das páginas e componentes (UI)
5. Implementação dos testes

Evite começar diretamente pelas páginas sem definir a lógica de negócio.

---

## Padrões de Código
Algumas diretrizes importantes:
- **Responsabilidade única**: cada componente ou hook deve ter uma responsabilidade clara.
- **Domínio isolado**: tipos e regras de negócio não devem depender de UI.
- **UI sem regra de negócio**: páginas e componentes não devem conter lógica de negócio.
- **Vertical Slice**: cada funcionalidade deve ser organizada em sua própria pasta dentro de `features/`.

Exemplo:
features/
└── auth/
├── components/
├── hooks/
├── services/
└── types.ts

Código

---

## Commits
- Seguir [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat:` → nova funcionalidade
  - `fix:` → correção de bug
  - `docs:` → alterações na documentação
  - `chore:` → tarefas de manutenção/configuração
  - `style:` → ajustes de estilo
  - `refactor:` → refatoração de código

Exemplo:
feat(auth): adiciona tela de login

Código

---

## Pull Requests
Para contribuir com código:
1. Crie uma branch a partir de `develop`
2. Implemente a funcionalidade
3. Adicione testes
4. Abra um Pull Request para `develop`

---

## Boas Práticas
Sempre que possível:
- escreva testes
- mantenha funções pequenas
- use nomes claros
- evite duplicação de código
- siga convenções definidas em `.docs/Architecture.md` e `.docs/instructions.md`

---

## Código Limpo
Algumas recomendações importantes:
- prefira nomes descritivos
- evite funções muito longas
- evite componentes com muitas responsabilidades
- mantenha o código simples e legível

---

## Testes
Sempre que uma funcionalidade nova for implementada, deve haver:
- testes unitários (hooks, serviços)
- testes de integração (páginas, rotas)
- testes end-to-end (fluxos completos)

Testes ajudam a garantir que o sistema continue funcionando corretamente.

---

## Comunicação
Caso haja dúvidas sobre arquitetura ou implementação:
- discuta com o grupo
- evite decisões isoladas
- registre decisões importantes

---

## Princípio mais importante
Priorize sempre:

**clareza > complexidade**

O código deve ser fácil de entender para qualquer membro da equipe.