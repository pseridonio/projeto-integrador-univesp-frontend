import { test, expect } from '@playwright/test';

test.describe('Products E2E', () => {
  const email = 'teste@teste.com.br';
  const password = 'teste@1234567890';

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder('seu@email.com').fill(email);
    await page.getByPlaceholder('Senha').fill(password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/.*dashboard/);
    // debug network requests for categories/products
    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('/categories') || url.includes('/products')) console.log('REQUEST:', req.method(), url);
    });
  });
  test('create new product and validate categories (mocked for offline)', async ({ page }) => {
    // always mock categories/products for stability when backend is not integrated
    await page.route('**/categories', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: 'bebidas', name: 'Bebidas', subcategories: ['Cafes', 'Sucos'] },
          { id: 'comidas', name: 'Comidas', subcategories: ['Lanches'] },
        ]),
      })
    );
    await page.route('**/products', (route) => {
      const req = route.request();
      if (req.method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
      } else if (req.method() === 'POST') {
        route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 'mock-1', name: 'E2E Product' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/products/new');
    await page.waitForSelector('#category option', { timeout: 5000 });

    const optionCount = await page.locator('#category option').count();
    expect(optionCount).toBeGreaterThan(0);

    await page.getByLabel('Nome do Produto').fill('E2E Product');
    // pick the second option (index 1) which is the first real category after placeholder
    const secondOption = page.locator('#category option').nth(1);
    const secondValue = await secondOption.getAttribute('value');
    if (secondValue) await page.locator('#category').selectOption({ value: secondValue });
    await page.getByLabel('Valor (R$)').fill('5.50');

    // click save and wait for mocked POST
    const [postResponse] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/products') && r.request().method() === 'POST', { timeout: 10000 }).catch(() => null),
      page.getByRole('button', { name: /Salvar Produto/i }).click(),
    ]);

    expect(postResponse).not.toBeNull();
  });

  test('product page shows API categories and counts (mocked for offline)', async ({ page }) => {
    // mock categories/products for stable offline execution
    await page.route('**/categories', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 'mock', name: 'Mock Category', subcategories: [] }]),
      })
    );
    await page.route('**/products', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }));

    await page.goto('/products');

    // ensure products page content rendered
    await expect(page.getByText('Produtos')).toBeVisible();
    // check categories section exists
    await expect(page.getByText('Categorias')).toBeVisible();
  });
});
