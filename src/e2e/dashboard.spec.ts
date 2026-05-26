import { test, expect } from '@playwright/test';

test.describe('Personalized Content Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the sign-in page first
    await page.goto('/auth/signin');
  });

  test('should sign in using Credentials provider', async ({ page }) => {
    // Input test account details
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
    
    // Check if greeting or feed loads
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('should toggle light and dark themes', async ({ page }) => {
    // Sign in
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Theme toggle button
    const themeBtn = page.locator('button[aria-label="Toggle Theme"]');
    await expect(themeBtn).toBeVisible();
    await themeBtn.click();

    // Check if html root element has or does not have 'dark' class
    const htmlClass = await page.locator('html').getAttribute('class');
    // Default config starts in dark mode, so toggle will set it to light
    expect(htmlClass).not.toContain('dark');
  });

  test('should search across feeds and filter content', async ({ page }) => {
    // Sign in
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Enter query in search bar
    const searchInput = page.locator('input[placeholder*="Search across"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('NASA');

    // Debounce wait time
    await page.waitForTimeout(1000);

    // Verify search results are filtered (should contain matching content or empty message)
    const cardTitle = page.locator('h3').first();
    await expect(cardTitle).toBeVisible();
  });

  test('should support language switching between English and Hindi', async ({ page }) => {
    // Sign in
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Switch to Hindi
    const hindiBtn = page.locator('button:has-text("हिंदी")');
    await expect(hindiBtn).toBeVisible();
    await hindiBtn.click();

    // Verify dashboard heading updates to Hindi
    const heading = page.locator('h1');
    await expect(heading).toContainText('व्यक्तिगत सामग्री हब');
  });

  test('should add cards to favorites', async ({ page }) => {
    // Sign in
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');

    // Select the first bookmark icon
    const bookmarkBtn = page.locator('button[aria-label="Bookmark article"]').first();
    await expect(bookmarkBtn).toBeVisible();
    await bookmarkBtn.click();

    // Navigate to favorites tab
    await page.goto('/favorites');

    // Verify card is added
    const favCard = page.locator('h3').first();
    await expect(favCard).toBeVisible();
  });
});
