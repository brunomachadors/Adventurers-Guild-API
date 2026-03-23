import { APIRequestContext, APIResponse } from '@playwright/test';

export class ClassesClient {
  constructor(private readonly request: APIRequestContext) {}

  async getClasses(): Promise<APIResponse> {
    return this.request.get('/api/classes');
  }

  async getClassDetail(identifier: string | number): Promise<APIResponse> {
    return this.request.get(`/api/classes/${identifier}`);
  }
}
