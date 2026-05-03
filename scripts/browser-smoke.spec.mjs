import { expect, test } from '@playwright/test';

const baseUrl = process.env.BROWSER_SMOKE_BASE_URL || 'http://127.0.0.1:5173';

function trackPageErrors(page) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  return errors;
}

test('public storefront core flow works', async ({ page }) => {
  const errors = trackPageErrors(page);

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: /Beautiful things deserve/i })).toBeVisible();
  await expect(page.locator('#productGrid .product-card')).toHaveCount(5);

  await page.getByPlaceholder('Search the collection').fill('tray');
  await expect(page.getByText('Silver Gallery Tray')).toBeVisible();
  await expect(page.locator('#productGrid .product-card')).toHaveCount(1);

  await page.getByRole('button', { name: 'View details' }).click();
  await expect(page.getByRole('dialog', { name: /Silver Gallery Tray/i })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();

  await page.getByPlaceholder('Search the collection').fill('');
  await page.getByRole('button', { name: 'Show sold archive' }).click();
  await expect(page.locator('#archiveGrid .product-card')).toHaveCount(1);

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.main-nav')).toBeVisible();
  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2);
  expect(hasHorizontalOverflow).toBe(false);
  expect(errors).toEqual([]);
});

test('local Studio is clearly prototype-only and validates Messenger URLs', async ({ page }) => {
  const errors = trackPageErrors(page);

  await page.goto(`${baseUrl}/admin.html`, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: /Prototype editing for this browser/i })).toBeVisible();
  await expect(page.getByText(/not a production admin system/i)).toBeVisible();

  await page.getByRole('button', { name: 'Open local Studio' }).click();
  await expect(page.getByRole('heading', { name: 'Collection control' })).toBeVisible();

  await page.getByLabel('Facebook Messenger page URL').fill('https://example.com/not-messenger');
  await page.getByRole('button', { name: 'Save settings' }).click();
  await expect(page.getByText('Use a valid https://m.me/... Messenger URL')).toBeVisible();

  await page.getByLabel('Title').fill('Test listing');
  await page.getByRole('button', { name: 'Generate draft' }).click();
  await expect(page.getByLabel('Description', { exact: true })).toHaveValue(/Test listing is/);
  expect(errors).toEqual([]);
});
