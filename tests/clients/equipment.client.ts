import { APIRequestContext, APIResponse } from '@playwright/test';

export class EquipmentClient {
  constructor(private readonly request: APIRequestContext) {}

  async getEquipment(): Promise<APIResponse> {
    return this.request.get('/api/equipment');
  }

  async getEquipmentDetail(identifier: number | string): Promise<APIResponse> {
    return this.request.get(`/api/equipment/${identifier}`);
  }
}
