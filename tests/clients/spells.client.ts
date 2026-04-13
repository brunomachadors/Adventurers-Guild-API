import { APIRequestContext, APIResponse } from '@playwright/test';

export class SpellsClient {
  constructor(private readonly request: APIRequestContext) {}

  async getSpells(
    filters?: Record<string, string | number>,
  ): Promise<APIResponse> {
    const searchParams = new URLSearchParams();

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        searchParams.set(key, String(value));
      }
    }

    const queryString = searchParams.toString();

    return this.request.get(
      queryString ? `/api/spells?${queryString}` : '/api/spells',
    );
  }

  async getSpellDetail(identifier: string | number): Promise<APIResponse> {
    return this.request.get(`/api/spells/${identifier}`);
  }
}
