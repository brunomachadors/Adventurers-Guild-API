import { TokenResponseBody } from '@/app/types/auth';
import { test } from '@playwright/test';

import { AuthClient } from '../clients/auth.client';
import { AuthAssert } from '../helpers/auth.assertions';

test.describe('Auth API - Token', { tag: ['@auth', '@token'] }, () => {
  test(
    'Validate token issuance with valid credentials',
    { tag: ['@post', '@smoke', '@data'] },
    async ({ request }) => {
      const authClient = new AuthClient(request);
      const authAssert = new AuthAssert();

      const response = await authClient.issueToken({
        username: 'demo',
        password: 'demo123',
      });

      await authAssert.success(response);

      const body: TokenResponseBody = await response.json();

      await authAssert.validateTokenResponse(body);
    },
  );

  test(
    'Validate token issuance with invalid payload',
    { tag: ['@post', '@negative', '@error'] },
    async ({ request }) => {
      const authClient = new AuthClient(request);
      const authAssert = new AuthAssert();

      const response = await authClient.issueToken({
        username: '',
        password: '',
      });

      await authAssert.badRequest(response);

      const body: { error: string } = await response.json();

      await authAssert.validateErrorResponse(
        body,
        'Invalid token request payload',
      );
    },
  );

  test(
    'Validate token issuance with invalid credentials',
    { tag: ['@post', '@negative', '@error'] },
    async ({ request }) => {
      const authClient = new AuthClient(request);
      const authAssert = new AuthAssert();

      const response = await authClient.issueToken({
        username: 'demo',
        password: 'invalid-password',
      });

      await authAssert.unauthorized(response);

      const body: { error: string } = await response.json();

      await authAssert.validateErrorResponse(body, 'Invalid credentials');
    },
  );
});
