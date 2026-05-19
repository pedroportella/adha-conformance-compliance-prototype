import { expect, test } from '@playwright/test';

test('loads the ADHA conformance portal dashboard', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Conformance evidence/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Conformance register' })).toBeVisible();
  await expect(page.getByText('River City Health Software')).toBeVisible();
});

test('captures a conformance submission into the register', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Attach sample evidence' }).click();
  await page.getByRole('button', { name: 'Submit to conformance register' }).click();

  await expect(page.getByText(/Submission captured locally|Submission sent/)).toBeVisible();
  await expect(page.getByText('Brisbane Digital Health Cooperative')).toBeVisible();
});
