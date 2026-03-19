import { APIRequestContext, APIResponse } from '@playwright/test';

export class ClassesClient {
  constructor(private readonly request: APIRequestContext) {}

  async getClasses(): Promise<APIResponse> {
    return this.request.get('/api/classes');
  }
}
