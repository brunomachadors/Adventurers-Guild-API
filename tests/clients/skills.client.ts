import { APIRequestContext, APIResponse } from '@playwright/test';

export class SkillClient {
  constructor(private readonly request: APIRequestContext) {}

  async getSkills(): Promise<APIResponse> {
    return this.request.get('/api/skills');
  }

  async getSkillDetail(identifier: string | number): Promise<APIResponse> {
    return this.request.get(`/api/skills/${identifier}`);
  }
}
