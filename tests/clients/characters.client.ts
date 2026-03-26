import { APIRequestContext, APIResponse } from '@playwright/test';

import {
  CharacterCreateRequestBody,
  CharacterUpdateRequestBody,
} from '@/app/types/character';

export class CharactersClient {
  constructor(private readonly request: APIRequestContext) {}

  async getCharacters(token?: string): Promise<APIResponse> {
    return this.request.get('/api/characters', {
      headers: this.buildAuthHeaders(token),
    });
  }

  async createCharacter(
    payload: CharacterCreateRequestBody,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.post('/api/characters', {
      data: payload,
      headers: this.buildAuthHeaders(token),
    });
  }

  async getCharacterDetail(id: number, token?: string): Promise<APIResponse> {
    return this.request.get(`/api/characters/${id}`, {
      headers: this.buildAuthHeaders(token),
    });
  }

  async updateCharacter(
    id: number,
    payload: CharacterUpdateRequestBody,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/api/characters/${id}`, {
      data: payload,
      headers: this.buildAuthHeaders(token),
    });
  }

  private buildAuthHeaders(token?: string): Record<string, string> | undefined {
    if (!token) {
      return undefined;
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }
}
