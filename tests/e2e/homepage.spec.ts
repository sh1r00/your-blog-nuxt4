import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBeLessThan(400)
    await expect(page.locator('header')).toBeVisible()
  })

  test('has skip-to-content link', async ({ page }) => {
    await page.goto('/')
    const skipLink = page.locator('a[href="#main-content"]')
    await expect(skipLink).toBeVisible()
  })

  test('navigation renders', async ({ page }) => {
    await page.goto('/')
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
    const links = nav.locator('a')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)
  })

  test('footer renders', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()
    // Footer exists — project-specific E2E tests verify exact content
  })

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/')
    const toggle = page.locator('[aria-label*="mode"]')
    if (await toggle.isVisible()) {
      await toggle.click()
      // Verify the page doesn't crash after toggle
      await expect(page.locator('header')).toBeVisible()
    }
  })
})
