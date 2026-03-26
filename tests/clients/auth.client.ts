import { APIRequestContext, APIResponse } from '@playwright/test';

import { TokenRequestBody } from '@/app/types/auth';

export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  async issueToken(payload: TokenRequestBody): Promise<APIResponse> {
    return this.request.post('/api/auth/token', {
      data: payload,
    });
  }
}
