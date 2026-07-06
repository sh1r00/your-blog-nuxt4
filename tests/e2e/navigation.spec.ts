import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('header navigation links are present', async ({ page }) => {
    await page.goto('/')

    const nav = page.locator('nav[aria-label="Main navigation"]')
    await expect(nav).toBeVisible()

    // Verify key nav links
    await expect(nav.locator('a[href="/"]')).toBeVisible()
    await expect(nav.locator('a[href="/about"]')).toBeVisible()
    await expect(nav.locator('a[href="/contact"]')).toBeVisible()
    await expect(nav.locator('a[href="/search"]')).toBeVisible()
  })

  test('logo links to homepage', async ({ page }) => {
    await page.goto('/about')
    const logo = page.locator('header a[aria-label="DevBlog Home"]')
    await expect(logo).toBeVisible()
    await logo.click()
    await expect(page).toHaveURL('/')
  })

  test('navigates to about page', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav[aria-label="Main navigation"] a[href="/about"]').click()
    await expect(page).toHaveURL('/about')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('navigates to contact page', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav[aria-label="Main navigation"] a[href="/contact"]').click()
    await expect(page).toHaveURL('/contact')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('navigates to search page', async ({ page }) => {
    await page.goto('/')
    await page.locator('nav[aria-label="Main navigation"] a[href="/search"]').click()
    await expect(page).toHaveURL('/search')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label="Open menu"]')
    await expect(menuButton).toBeVisible()

    // Open mobile menu
    await menuButton.click()

    // Mobile nav should appear
    const mobileNav = page.locator('nav[aria-label="Mobile navigation"]')
    await expect(mobileNav).toBeVisible()

    // Should have nav links
    const links = mobileNav.locator('a')
    const count = await links.count()
    expect(count).toBeGreaterThanOrEqual(3)

    // Close by clicking a link
    await links.first().click()
    await expect(page.locator('nav[aria-label="Mobile navigation"]')).not.toBeVisible()
  })

  test('skip-to-content link exists', async ({ page }) => {
    await page.goto('/')
    const skipLink = page.locator('a.skip-link')
    await expect(skipLink).toBeVisible()
    await expect(skipLink).toHaveAttribute('href', '#main-content')
  })

  test('footer renders on all main pages', async ({ page }) => {
    const pages = ['/', '/about', '/contact', '/search']

    for (const path of pages) {
      await page.goto(path)
      const footer = page.locator('footer[role="contentinfo"]')
      await expect(footer).toBeVisible()
    }
  })

  test('footer includes category links', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer[role="contentinfo"]')

    const categoryLinks = footer.locator('a[href^="/categories/"]')
    const count = await categoryLinks.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('footer includes tag links', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer[role="contentinfo"]')

    const tagLinks = footer.locator('a[href^="/tags/"]')
    const count = await tagLinks.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })
})
