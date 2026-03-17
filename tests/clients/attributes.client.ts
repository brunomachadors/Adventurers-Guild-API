import { Attribute } from '@/app/types/attribute';
import { APIRequestContext, APIResponse } from '@playwright/test';

export class AttributesClient {
  constructor(private readonly request: APIRequestContext) {}

  async getAll(): Promise<APIResponse> {
    return this.request.get('/api/attributes');
  }

  async getAllAsJson(): Promise<Attribute[]> {
    const response = await this.getAll();
    return response.json();
  }

  async findByShortName(
    shortName: Attribute['shortName'],
  ): Promise<Attribute | undefined> {
    const attributes = await this.getAllAsJson();
    return attributes.find((attribute) => attribute.shortName === shortName);
  }
}
