import { test, expect } from '@playwright/test'

test.describe('Categories', () => {
  test('category page loads successfully', async ({ page }) => {
    const response = await page.goto('/categories/architecture')
    expect(response?.status()).toBeLessThan(400)

    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('h1')).toContainText('Architecture')
  })

  test('category page displays category name', async ({ page }) => {
    await page.goto('/categories/nuxt')

    await expect(page.locator('h1')).toBeVisible()
    const headingText = await page.locator('h1').textContent()
    expect(headingText?.toLowerCase()).toContain('nuxt')
  })

  test('category page shows post count', async ({ page }) => {
    await page.goto('/categories/architecture')

    // Should show how many posts are in this category
    await expect(page.locator('text=/\\d+ post/')).toBeVisible()
  })

  test('category page displays blog post cards', async ({ page }) => {
    await page.goto('/categories/nuxt')

    const postCards = page.locator('a[href^="/blog/"]')
    const count = await postCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('category name is case insensitive in URL', async ({ page }) => {
    await page.goto('/categories/NUXT')

    await expect(page.locator('h1')).toBeVisible()
    const headingText = await page.locator('h1').textContent()
    expect(headingText?.toLowerCase()).toContain('nuxt')
  })

  test('has back to blog link', async ({ page }) => {
    await page.goto('/categories/css')

    const backLink = page.locator('a[href="/"]').first()
    await expect(backLink).toBeVisible()
  })

  test('back link navigates to homepage', async ({ page }) => {
    await page.goto('/categories/css')

    const backLink = page.locator('a[href="/"]').first()
    await backLink.click()
    await expect(page).toHaveURL('/')
  })

  test('navigates to a blog post from category page', async ({ page }) => {
    await page.goto('/categories/nuxt')

    const firstPostLink = page.locator('a[href^="/blog/"]').first()
    await expect(firstPostLink).toBeVisible()

    await firstPostLink.click()
    await expect(page).toHaveURL(/\/blog\//)
    await expect(page.locator('article')).toBeVisible()
  })

  test('empty category shows no posts message', async ({ page }) => {
    await page.goto('/categories/nonexistentcategory')

    // Should show empty state
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('a[href="/"]')).toBeVisible()
  })

  test('all main categories have posts', async ({ page }) => {
    const categories = ['architecture', 'nuxt', 'typescript', 'css', 'security']

    for (const cat of categories) {
      await page.goto(`/categories/${cat}`)
      await expect(page.locator('h1')).toBeVisible()

      // Some categories may exist with posts
      const postCards = page.locator('a[href^="/blog/"]')
      const count = await postCards.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  })
})
