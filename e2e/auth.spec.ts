import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Authentication Flow
 * Tests: Register, Login, Logout, Protected Routes
 */

test.describe('Authentication Flow', () => {
  const testEmail = `test-${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  test('should register new user', async ({ page }) => {
    await page.goto('/inscription');

    // Fill registration form
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);

    // Accept terms
    await page.check('input[name="agreeToTerms"]');

    // Submit form
    await page.click('button[type="submit"]');

    // Check success message or redirect
    await expect(page).toHaveURL(/\/(connexion|compte)/);
    await page.waitForTimeout(1000);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/connexion');

    // Fill login form
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);

    // Submit form
    await page.click('button[type="submit"]');

    // Check redirect to dashboard
    await expect(page).toHaveURL('/compte');
    
    // Verify user is logged in (profile menu visible)
    await expect(page.locator('text=Profil')).toBeVisible({ timeout: 5000 });
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('/connexion');

    await page.fill('input[name="email"]', 'nonexistent@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    // Check error message appears
    await expect(page.locator('text=Email ou mot de passe invalide')).toBeVisible({ timeout: 5000 });
    
    // Should stay on login page
    await expect(page).toHaveURL('/connexion');
  });

  test('should require password confirmation match', async ({ page }) => {
    await page.goto('/inscription');

    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', `test2-${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'TestPassword123!');
    await page.fill('input[name="confirmPassword"]', 'DifferentPassword123!');

    // Submit form
    await page.click('button[type="submit"]');

    // Check validation error
    await expect(page.locator('text=ne correspond pas')).toBeVisible();
  });

  test('should protect authenticated routes', async ({ page }) => {
    // Try accessing protected route without auth
    await page.goto('/compte');

    // Should redirect to login
    await expect(page).toHaveURL('/connexion');
  });

  test('should logout user', async ({ page }) => {
    // First login
    await page.goto('/connexion');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/compte');

    // Click logout button
    await page.click('button:has-text("Déconnexion")');

    // Should redirect to home
    await expect(page).toHaveURL('/');
    
    // Token should be cleared
    const token = await page.evaluate(() => localStorage.getItem('auth_token'));
    expect(token).toBeNull();
  });
});
