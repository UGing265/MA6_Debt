import { test, expect } from '@playwright/test';

test.describe('Homepage Smoke Tests', () => {
  test('homepage loads and shows hero section', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toContainText('Manage your money');
  });

  test('CTA button navigates to login page', async ({ page }) => {
    await page.goto('/');
    
    const ctaButton = page.locator('a[href="/login"]').first();
    await expect(ctaButton).toBeVisible();
    
    await ctaButton.click();
    
    await expect(page).toHaveURL('/login');
  });
});
