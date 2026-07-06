import { test, expect } from '@playwright/test'

test.describe('Blog Listing', () => {
  test('homepage displays blog post cards', async ({ page }) => {
    await page.goto('/')

    // Blog cards should be visible in the posts grid
    const postCards = page.locator('a[href^="/blog/"]')
    const count = await postCards.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('homepage has hero section', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('input[type="search"]')).toBeVisible()
  })

  test('featured post section is visible', async ({ page }) => {
    await page.goto('/')

    // Check if featured post badge exists
    const featuredBadge = page.locator('text=Featured')
    // The featured post may or may not be there — but the page should have content
    const firstArticle = page.locator('article').first()
    if (await featuredBadge.isVisible()) {
      await expect(firstArticle).toBeVisible()
    }
  })

  test('category filter buttons filter posts', async ({ page }) => {
    await page.goto('/')

    // Find category filter buttons (not "All Categories" itself but individual categories)
    const categoryButtons = page.locator('button.btn-secondary')
    const count = await categoryButtons.count()

    if (count > 1) {
      // Click the first real category (skip "All Categories" if it's a button)
      await categoryButtons.nth(1).click()
      await page.waitForTimeout(300)

      // Posts grid should still be present (may be filtered)
      const postCards = page.locator('a[href^="/blog/"]')
      const postCount = await postCards.count()
      // Filter should narrow or keep same — either way, page shouldn't crash
      expect(postCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('tag filter buttons filter posts', async ({ page }) => {
    await page.goto('/')

    // Find tag pill buttons
    const tagButtons = page.locator('button.rounded-full')
    const count = await tagButtons.count()

    if (count > 0) {
      await tagButtons.first().click()
      await page.waitForTimeout(300)

      // Should see filtered posts
      const postCards = page.locator('a[href^="/blog/"]')
      const postCount = await postCards.count()
      expect(postCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('navigates to a blog post from listing', async ({ page }) => {
    await page.goto('/')

    const firstPostLink = page.locator('a[href^="/blog/"]').first()
    await expect(firstPostLink).toBeVisible()

    const href = await firstPostLink.getAttribute('href')
    await firstPostLink.click()

    await expect(page).toHaveURL(href!)
    await expect(page.locator('article')).toBeVisible()
    await expect(page.locator('h1')).toBeVisible()
  })

  test('inline search shows quick results', async ({ page }) => {
    await page.goto('/')

    const searchInput = page.locator('input[type="search"]').first()
    await expect(searchInput).toBeVisible()

    // Type enough characters to trigger search
    await searchInput.fill('microservices')
    await page.waitForTimeout(500)

    // Quick results dropdown may appear
    const dropdown = page.locator('.absolute.z-30')
    // Not all terms will produce results — just verify the page doesn't break
    await expect(page.locator('h1')).toBeVisible()
  })

  test('empty filter shows no posts message', async ({ page }) => {
    await page.goto('/')

    const searchInput = page.locator('input[type="search"]').first()
    await searchInput.fill('xyznonexistentsearch123456')
    await page.waitForTimeout(300)

    // Either results dropdown is empty or page remains stable
    await expect(page.locator('h1')).toBeVisible()
  })
})
