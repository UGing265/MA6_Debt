import { test, expect } from '@playwright/test';

test.describe('Homepage Smoke Tests', () => {
  test('homepage loads and shows hero section', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toContainText('Track your money');
  });

  test('CTA button navigates to login page', async ({ page }) => {
    await page.goto('/');
    
    const ctaButton = page.locator('a[href="/login"]').first();
    await expect(ctaButton).toBeVisible();
    
    await ctaButton.click();
    
    await expect(page).toHaveURL('/login');
  });

  test('mobile viewport has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    
    await expect(page.locator('h1')).toBeVisible();
    
    // Check no horizontal scrollbar
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('capture QA evidence screenshots', async ({ page }) => {
    // Desktop hero
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.locator('h1').first().waitFor();
    await page.screenshot({ path: '.sisyphus/evidence/clone-hero-desktop.png', fullPage: false });
    
    // Desktop mid-lower sections
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.screenshot({ path: '.sisyphus/evidence/clone-mid-lower.png', fullPage: false });
    
    // Mobile CTA
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('a[href="/login"]').first().waitFor();
    await page.screenshot({ path: '.sisyphus/evidence/clone-mobile-cta.png', fullPage: false });
  });
});
