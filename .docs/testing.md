# TESTING GUIDE — CafeSystem Frontend

Este documento define os padrões para implementação de testes no **CafeSystem Frontend**.

O objetivo é garantir:
- qualidade de código
- consistência entre os membros do time
- facilidade de manutenção
- aprendizado de boas práticas

---

## Tipos de Teste

O projeto utiliza três tipos principais de testes:

### Testes Unitários
Testam unidades isoladas do sistema:
- hooks
- serviços
- componentes pequenos

Sem acesso a:
- API real
- infraestrutura externa

### Testes de Integração
Testam a integração real entre componentes, incluindo:
- páginas completas
- rotas
- fluxo entre componentes

### Testes End-to-End (E2E)
Simulam o funcionamento completo do sistema através da interface:
- login
- abertura de comanda
- inclusão de itens
- fechamento de comanda

---

## Bibliotecas Recomendadas

- **Unitários e Integração**
  - [Jest](https://jestjs.io/)
  - [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

- **End-to-End**
  - [Cypress](https://www.cypress.io/) ou [Playwright](https://playwright.dev/)

---

## Estrutura dos Testes

Cada teste deve seguir o padrão:

**Arrange → Act → Assert**

### Exemplo correto
```tsx
test("Should_Display_Error_When_Login_Fails", async () => {
  // Arrange
  render(<LoginPage />);
  const emailInput = screen.getByPlaceholderText("Email");
  const passwordInput = screen.getByPlaceholderText("Senha");
  const submitButton = screen.getByRole("button", { name: /entrar/i });

  // Act
  fireEvent.change(emailInput, { target: { value: "user@test.com" } });
  fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
  fireEvent.click(submitButton);

  // Assert
  expect(await screen.findByText(/credenciais inválidas/i)).toBeInTheDocument();
});
Exemplo incorreto (EVITAR)
tsx
test("Test1", () => {
  render(<LoginPage />);
  fireEvent.click(screen.getByText("Entrar"));
  expect(screen.getByText("Erro")).toBeTruthy();
});
Problemas:

nome ruim

sem separação de etapas

difícil de entender

Nomeação de Testes
Padrão recomendado:

Should_<ExpectedBehavior>When<Condition>

Exemplo:

Should_Render_LoginPage_When_User_Is_NotAuthenticated

Should_Show_Error_When_API_Returns_401

Uso de Mocks
Use mocks apenas quando necessário, especialmente para chamadas de API.

Exemplo:

tsx
jest.spyOn(authService, "login").mockResolvedValue({ token: "fake-token" });
Evitar:

❌ Mockar tudo sem necessidade

❌ Testar implementação de mocks

✔ Testar comportamento esperado

O que testar
Testar:

regras de negócio em hooks e serviços

validações de formulários

comportamento esperado de componentes

Não testar:

getters/setters triviais

código puramente visual sem lógica

Testes End-to-End
Objetivo: garantir que o sistema funciona como um todo.

Características:

utilizam navegador real (headless ou não)

simulam interação do usuário

fazem chamadas HTTP reais ao backend

Exemplo de teste E2E (Cypress):

js
it("Should_Login_Successfully", () => {
  cy.visit("/login");
  cy.get("input[name=email]").type("user@test.com");
  cy.get("input[name=password]").type("123456");
  cy.get("button[type=submit]").click();
  cy.url().should("include", "/dashboard");
});

Organização dos Testes
Estrutura recomendada:

Código
tests/
 ├── features/
 │   ├── auth/
 │   └── products/
 ├── pages/
 └── e2e/
Boas práticas
Testes devem ser independentes.

Evitar dependência entre testes.

Um comportamento por teste.

Não usar strings exatas frágeis, prefira validar estrutura ou comportamento.

Testes são parte do código: devem ser legíveis e simples.

Princípio mais importante
Um bom teste deve ser fácil de entender por alguém que não escreveu o código.

Resumo
✔ Use testes unitários para lógica
✔ Use testes de integração para fluxo entre componentes
✔ Use testes end-to-end para simular o usuário
✔ Mantenha testes simples e claros
✔ Nomeie bem os testes
✔ Evite complexidade desnecessária