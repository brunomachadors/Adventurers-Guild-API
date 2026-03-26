import { APIRequestContext, APIResponse } from '@playwright/test';

export class SpeciesClient {
  constructor(private readonly request: APIRequestContext) {}

  async getSpecies(): Promise<APIResponse> {
    return this.request.get('/api/species');
  }

  async getSpeciesDetail(identifier: string | number): Promise<APIResponse> {
    return this.request.get(`/api/species/${identifier}`);
  }
}
