# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: products.spec.ts >> Products E2E >> create new product and validate categories (with offline fallback)
- Location: tests\e2e\products.spec.ts:19:3

# Error details

```
TimeoutError: locator.getAttribute: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('#category option:not([value=""])').first()

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - link "CafeSystem Gestão de Comandas" [ref=e6] [cursor=pointer]:
      - /url: /dashboard
      - img [ref=e8]
      - generic [ref=e9]:
        - generic [ref=e10]: CafeSystem
        - generic [ref=e11]: Gestão de Comandas
    - generic [ref=e12]:
      - generic [ref=e13]:
        - generic [ref=e14]: UI
        - generic [ref=e15]:
          - generic [ref=e16]: Usuário não identificado
          - generic [ref=e17]: Atendente
      - navigation [ref=e18]:
        - link "📋 Comandas" [ref=e19] [cursor=pointer]:
          - /url: /orders
          - generic [ref=e20]: 📋
          - generic [ref=e21]: Comandas
        - link "📦 Produtos" [ref=e22] [cursor=pointer]:
          - /url: /products
          - generic [ref=e23]: 📦
          - generic [ref=e24]: Produtos
  - main [ref=e26]:
    - generic [ref=e27]:
      - generic [ref=e30]:
        - button [ref=e31] [cursor=pointer]:
          - img [ref=e32]
        - generic [ref=e34]:
          - heading "Novo Produto" [level=1] [ref=e35]
          - paragraph [ref=e36]: Cadastre um novo produto
      - main [ref=e37]:
        - generic [ref=e40]:
          - generic [ref=e41]:
            - generic [ref=e42]: Nome do Produto
            - textbox "Nome do Produto" [active] [ref=e43]:
              - /placeholder: "Ex: Café Expresso"
              - text: E2E Product
          - generic [ref=e44]:
            - generic [ref=e45]: Categoria Principal *
            - combobox "Categoria Principal *" [ref=e46]:
              - option "Selecione uma categoria" [selected]
          - generic [ref=e47]:
            - generic [ref=e48]: Subcategoria (opcional)
            - textbox "Subcategoria (opcional)" [ref=e49]
          - generic [ref=e50]:
            - generic [ref=e51]: Valor (R$)
            - spinbutton "Valor (R$)" [ref=e52]
          - generic [ref=e53]:
            - button "Cancelar" [ref=e54] [cursor=pointer]
            - button "Salvar Produto" [disabled] [ref=e55]:
              - img [ref=e56]
              - generic [ref=e60]: Salvar Produto
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Products E2E', () => {
  4   |   const email = 'teste@teste.com.br';
  5   |   const password = 'teste@1234567890';
  6   | 
  7   |   test.beforeEach(async ({ page }) => {
  8   |     await page.goto('/login');
  9   |     await page.getByPlaceholder('seu@email.com').fill(email);
  10  |     await page.getByPlaceholder('Senha').fill(password);
  11  |     await page.getByRole('button', { name: 'Entrar' }).click();
  12  |     await expect(page).toHaveURL(/.*dashboard/);
  13  |     // debug network requests for categories/products
  14  |     page.on('request', (req) => {
  15  |       const url = req.url();
  16  |       if (url.includes('/categories') || url.includes('/products')) console.log('REQUEST:', req.method(), url);
  17  |     });
  18  |   });
  19  |   test('create new product and validate categories (with offline fallback)', async ({ page }) => {
  20  |     await page.goto('/products/new');
  21  |     // try waiting for categories from real API; if backend not available, mock responses and reload
  22  |     let categoriesAvailable = true;
  23  |     try {
  24  |       await page.waitForResponse((r) => r.url().includes('/categories') && r.status() === 200, { timeout: 5000 });
  25  |     } catch (e) {
  26  |       categoriesAvailable = false;
  27  |     }
  28  | 
  29  |     if (!categoriesAvailable) {
  30  |       // provide simple mock data for categories and products so tests can run without backend
  31  |       await page.route('**/categories', (route) =>
  32  |         route.fulfill({
  33  |           status: 200,
  34  |           contentType: 'application/json',
  35  |           body: JSON.stringify([
  36  |             { id: 'bebidas', name: 'Bebidas', subcategories: ['Cafes', 'Sucos'] },
  37  |             { id: 'comidas', name: 'Comidas', subcategories: ['Lanches'] },
  38  |           ]),
  39  |         })
  40  |       );
  41  |       await page.route('**/products', (route) => {
  42  |         const req = route.request();
  43  |         if (req.method() === 'GET') {
  44  |           route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  45  |         } else if (req.method() === 'POST') {
  46  |           route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: 'mock-1', name: 'E2E Product' }) });
  47  |         } else {
  48  |           route.continue();
  49  |         }
  50  |       });
  51  |       await page.reload();
  52  |       await page.waitForSelector('#category option', { timeout: 5000 });
  53  |     }
  54  | 
  55  |     const optionCount = await page.locator('#category option').count();
  56  |     expect(optionCount).toBeGreaterThan(0);
  57  | 
  58  |     await page.getByLabel('Nome do Produto').fill('E2E Product');
> 59  |     const firstOption = await page.locator('#category option:not([value=""])').first().getAttribute('value');
      |                                                                                        ^ TimeoutError: locator.getAttribute: Timeout 10000ms exceeded.
  60  |     if (firstOption) await page.locator('#category').selectOption({ value: firstOption });
  61  |     await page.getByLabel('Valor (R$)').fill('5.50');
  62  | 
  63  |     // click save and wait for POST; if mocked, route will respond immediately
  64  |     const [postResponse] = await Promise.all([
  65  |       page.waitForResponse((r) => r.url().includes('/products') && r.request().method() === 'POST', { timeout: 10000 }).catch(() => null),
  66  |       page.getByRole('button', { name: /Salvar Produto/i }).click(),
  67  |     ]);
  68  | 
  69  |     // if navigation expected, wait for products page; otherwise ensure POST returned
  70  |     try {
  71  |       await page.waitForURL(/\/products/, { timeout: 5000 });
  72  |     } catch (e) {
  73  |       // not navigated, assert POST response or fallback to checking for success
  74  |       expect(postResponse).not.toBeNull();
  75  |     }
  76  |   });
  77  | 
  78  |   test('product page shows API categories and counts (with offline fallback)', async ({ page }) => {
  79  |     await page.goto('/products');
  80  |     let categoriesAvailable = true;
  81  |     try {
  82  |       await page.waitForResponse((r) => r.url().includes('/categories') && r.status() === 200, { timeout: 5000 });
  83  |       await page.waitForResponse((r) => r.url().includes('/products') && r.status() === 200, { timeout: 5000 });
  84  |     } catch (e) {
  85  |       categoriesAvailable = false;
  86  |     }
  87  | 
  88  |     if (!categoriesAvailable) {
  89  |       await page.route('**/categories', (route) =>
  90  |         route.fulfill({
  91  |           status: 200,
  92  |           contentType: 'application/json',
  93  |           body: JSON.stringify([{ id: 'mock', name: 'Mock Category', subcategories: [] }]),
  94  |         })
  95  |       );
  96  |       await page.route('**/products', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) }));
  97  |       await page.reload();
  98  |     }
  99  | 
  100 |     // sanity check DOM rendered
  101 |     await expect(page.locator('#root')).toBeVisible();
  102 |     // check category header or list exists
  103 |     const categoriesLocator = page.locator('text=Categorias').first();
  104 |     await expect(categoriesLocator).toBeVisible({ timeout: 5000 });
  105 |   });
  106 | });
  107 | 
```