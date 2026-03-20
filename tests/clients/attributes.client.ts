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

  async findByshortname(
    shortname: Attribute['shortname'],
  ): Promise<Attribute | undefined> {
    const attributes = await this.getAllAsJson();
    return attributes.find((attribute) => attribute.shortname === shortname);
  }
}
