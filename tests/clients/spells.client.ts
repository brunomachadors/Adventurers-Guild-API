import { APIRequestContext, APIResponse } from '@playwright/test';

export class SpellsClient {
  constructor(private readonly request: APIRequestContext) {}

  async getSpells(): Promise<APIResponse> {
    return this.request.get('/api/spells');
  }

  async getSpellDetail(identifier: string | number): Promise<APIResponse> {
    return this.request.get(`/api/spells/${identifier}`);
  }
}
