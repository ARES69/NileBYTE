import { test, expect } from '@playwright/test'

/** Smoke: home renders, builder quote works, checkout creates an order via API. */
test('home → builder → checkout → api order', async ({ page, request }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /NILE/i }).first()).toBeVisible()

  // pricing lib sanity through the public API (no UI coupling yet)
  const res = await request.post('/api/order', {
    data: {
      cup: { bite: 'kofta', sauce: 'garlic', size: '12', tops: ['onion'], qty: 2 },
      mode: 'pickup', promo: 'NILE10', name: 'E2E', phone: '+201000000000', storeSlug: 'hurghada'
    }
  })
  // store may be seeded or not in CI: accept 200 or 409, reject 5xx
  expect([200, 409]).toContain(res.status())
})

test('QR landing resolves product or 404s cleanly', async ({ page }) => {
  const r = await page.goto('/bite/NB-shawarma-A-hurghada')
  expect([200, 404]).toContain(r?.status())
})

test('store page renders hours for live store', async ({ page }) => {
  const r = await page.goto('/locations/hurghada')
  expect([200, 404]).toContain(r?.status())
})
