import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
	test.beforeEach(async ({ page }) => {
		//page = await browser.newPage();
		await page.goto('http://localhost:5173/');
	});

	test.afterEach(async ({ page }) => {
		await page.close();
	});

	test('has title', async ({ page }) => {
		// Expect a title "to contain" a substring.
		await expect(page).toHaveTitle(/Home • PDF Analyser/);
	});

	test('should authenticate with Metamask and access PDF upload functionality', async ({
		page
	}) => {
		// Simulate Metamask login
		await page.click('auth-button');

		// Access PDF upload functionality
	});
});
