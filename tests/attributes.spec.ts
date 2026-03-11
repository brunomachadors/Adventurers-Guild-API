import { test, expect } from '@playwright/test';

test('ATTRIBUTES LIST', async ({ request }) => {
  const response = await request.get('/api/attributes');
  expect(response.status()).toBe(200);
});
