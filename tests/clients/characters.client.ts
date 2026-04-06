import { APIRequestContext, APIResponse } from '@playwright/test';

import {
  CharacterAbilityScoresUpdateRequestBody,
  CharacterCreateRequestBody,
  CharacterEquipmentAddRequestBody,
  CharacterEquipmentUpdateRequestBody,
  CharacterSpellSelectionUpdateRequestBody,
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

  async getCharacterSpellOptions(
    id: number,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.get(`/api/characters/${id}/spell-options`, {
      headers: this.buildAuthHeaders(token),
    });
  }

  async getCharacterSpellSelection(
    id: number,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.get(`/api/characters/${id}/spell-selection`, {
      headers: this.buildAuthHeaders(token),
    });
  }

  async getCharacterAbilityScoreOptions(
    id: number,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.get(`/api/characters/${id}/ability-score-options`, {
      headers: this.buildAuthHeaders(token),
    });
  }

  async getCharacterSkills(id: number, token?: string): Promise<APIResponse> {
    return this.request.get(`/api/characters/${id}/skills`, {
      headers: this.buildAuthHeaders(token),
    });
  }

  async getCharacterEquipment(
    id: number,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.get(`/api/characters/${id}/equipment`, {
      headers: this.buildAuthHeaders(token),
    });
  }

  async addCharacterEquipment(
    id: number,
    payload: CharacterEquipmentAddRequestBody,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.post(`/api/characters/${id}/equipment`, {
      data: payload,
      headers: this.buildAuthHeaders(token),
    });
  }

  async patchCharacterEquipment(
    id: number,
    equipmentId: number,
    payload: CharacterEquipmentUpdateRequestBody,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/api/characters/${id}/equipment/${equipmentId}`, {
      data: payload,
      headers: this.buildAuthHeaders(token),
    });
  }

  async deleteCharacterEquipment(
    id: number,
    equipmentId: number,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.delete(`/api/characters/${id}/equipment/${equipmentId}`, {
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

  async updateCharacterSpells(
    id: number,
    payload: CharacterSpellSelectionUpdateRequestBody,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.put(`/api/characters/${id}/spells`, {
      data: payload,
      headers: this.buildAuthHeaders(token),
    });
  }

  async updateCharacterAbilityScores(
    id: number,
    payload: CharacterAbilityScoresUpdateRequestBody,
    token?: string,
  ): Promise<APIResponse> {
    return this.request.put(`/api/characters/${id}/ability-scores`, {
      data: payload,
      headers: this.buildAuthHeaders(token),
    });
  }

  async deleteCharacter(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/api/characters/${id}`, {
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
