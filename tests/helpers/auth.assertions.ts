import { TokenResponseBody } from '@/app/types/auth';
import { expect, test } from '@playwright/test';

export class AuthAssert {
  async success(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 200', async () => {
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
    });
  }

  async badRequest(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 400', async () => {
      expect(response.status()).toBe(400);
      expect(response.ok()).toBeFalsy();
    });
  }

  async unauthorized(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 401', async () => {
      expect(response.status()).toBe(401);
      expect(response.ok()).toBeFalsy();
    });
  }

  async validateTokenResponse(body: TokenResponseBody) {
    await test.step('Validate token response schema', async () => {
      expect(body).toHaveProperty('token');
      expect(typeof body.token).toBe('string');
      expect(body.token.length).toBeGreaterThan(0);
    });

    await this.validateJwtLikeFormat(body.token);
  }

  async validateJwtLikeFormat(token: string) {
    await test.step('Validate token has JWT-like format', async () => {
      const parts = token.split('.');

      expect(parts).toHaveLength(3);
      for (const part of parts) {
        expect(part.length).toBeGreaterThan(0);
      }
    });
  }

  async validateErrorResponse(
    errorResponse: { error: string },
    expectedError: string,
  ) {
    await test.step('Validate error response schema', async () => {
      expect(errorResponse).toHaveProperty('error');
      expect(typeof errorResponse.error).toBe('string');
      expect(errorResponse.error).toBe(expectedError);
    });
  }
}
