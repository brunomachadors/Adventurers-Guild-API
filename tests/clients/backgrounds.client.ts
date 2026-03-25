import { APIRequestContext, APIResponse } from '@playwright/test';

export class BackgroundsClient {
  constructor(private readonly request: APIRequestContext) {}

  async getBackgrounds(): Promise<APIResponse> {
    return this.request.get('/api/backgrounds');
  }

  async getBackgroundDetail(identifier: string | number): Promise<APIResponse> {
    return this.request.get(`/api/backgrounds/${identifier}`);
  }
}
