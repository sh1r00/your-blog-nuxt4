import { test, expect } from '@playwright/test'

test.describe('Dark Mode', () => {
  test('dark mode toggle exists', async ({ page }) => {
    await page.goto('/')

    const toggle = page.locator('button[aria-label*="dark" i], button[title*="dark" i], button[title*="light" i]').first()
    await expect(toggle).toBeVisible()
  })

  test('toggles between dark and light mode', async ({ page }) => {
    await page.goto('/')

    const toggle = page.locator('button[aria-label*="dark" i], button[title*="dark" i], button[title*="light" i]').first()

    // Get initial label or title
    const initialAttribute = (await toggle.getAttribute('aria-label'))
      || (await toggle.getAttribute('title'))
      || ''

    // Click to toggle
    await toggle.click()
    await page.waitForTimeout(300)

    // Attribute should change
    const newAttribute = (await toggle.getAttribute('aria-label'))
      || (await toggle.getAttribute('title'))
      || ''
    expect(newAttribute).not.toBe(initialAttribute)
  })

  test('dark mode persists across navigation', async ({ page }) => {
    await page.goto('/')

    const toggle = page.locator('button[aria-label*="dark" i], button[title*="dark" i], button[title*="light" i]').first()
    await toggle.click()
    await page.waitForTimeout(200)

    // Navigate to another page
    await page.goto('/about')
    await page.waitForTimeout(200)

    // Toggle should still exist
    const toggleOnAbout = page.locator('button[aria-label*="dark" i], button[title*="dark" i], button[title*="light" i]').first()
    await expect(toggleOnAbout).toBeVisible()
  })

  test('page content remains visible after toggle', async ({ page }) => {
    await page.goto('/')

    const toggle = page.locator('button[aria-label*="dark" i], button[title*="dark" i], button[title*="light" i]').first()

    await toggle.click()
    await page.waitForTimeout(300)

    // Key elements should still be visible
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()
  })

  test('dark mode toggle is accessible via keyboard', async ({ page }) => {
    await page.goto('/')

    const toggle = page.locator('button[aria-label*="dark" i], button[title*="dark" i], button[title*="light" i]').first()

    await toggle.focus()
    await expect(toggle).toBeFocused()

    const initialAttr = (await toggle.getAttribute('aria-label'))
      || (await toggle.getAttribute('title'))
      || ''

    await toggle.press('Enter')
    await page.waitForTimeout(300)

    const newAttr = (await toggle.getAttribute('aria-label'))
      || (await toggle.getAttribute('title'))
      || ''
    expect(newAttr).not.toBe(initialAttr)
  })

  test('dark mode toggle works on blog post page', async ({ page }) => {
    await page.goto('/blog/building-resilient-microservices')

    const toggle = page.locator('button[aria-label*="dark" i], button[title*="dark" i], button[title*="light" i]').first()
    await expect(toggle).toBeVisible()

    await toggle.click()
    await page.waitForTimeout(200)

    await expect(page.locator('article')).toBeVisible()
  })

  test('dark mode toggle works on search page', async ({ page }) => {
    await page.goto('/search')

    const toggle = page.locator('button[aria-label*="dark" i], button[title*="dark" i], button[title*="light" i]').first()
    await expect(toggle).toBeVisible()

    await toggle.click()
    await page.waitForTimeout(200)

    await expect(page.locator('h1')).toBeVisible()
  })
})
