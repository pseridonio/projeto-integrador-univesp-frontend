import { test, expect } from '@playwright/test';

test.describe('Comandas E2E', () => {
  const email = 'teste@teste.com.br';
  const password = 'teste@1234567890';

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.getByPlaceholder('Senha').fill(password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('open -> add item -> close -> finalize (local seed)', async ({ page }) => {
    // seed a comanda in localStorage so tests don't depend on backend
    await page.addInitScript(() => {
      const comandas = [
        {
          id: 9999,
          number: 500,
          status: 'DISPONIVEL',
          pedidos: [],
          total: 0,
          items: 0,
          openedAt: '12:00',
        },
      ];
      try {
        localStorage.setItem('comandas', JSON.stringify(comandas));
      } catch (e) {
        // ignore
      }
    });

    await page.goto('/orders/9999');

    const abrirBtn = page.getByRole('button', { name: 'Abrir comanda' });
    await expect(abrirBtn).toBeVisible();
    await abrirBtn.click();

    await page.getByPlaceholder('Nome do produto').fill('Test Item');
    await page.getByPlaceholder('Preço').fill('9.90');
    await page.getByRole('button', { name: 'Adicionar' }).click();
    await expect(page.getByText('Test Item')).toBeVisible();

    await page.getByRole('button', { name: 'Fechar comanda' }).click();
    const finalizarBtn = page.getByRole('button', { name: 'Finalizar pagamento' });
    await expect(finalizarBtn).toBeVisible();
    await finalizarBtn.click();
    await expect(page.getByText('Disponível')).toBeVisible();
  });
});
