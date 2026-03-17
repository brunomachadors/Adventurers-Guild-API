import { test, expect } from '@playwright/test';
import { Attribute } from '@/app/types/attribute';

export class Assert {
  constructor() {}

  async success(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 200', async () => {
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
    });
  }

  async validateSchema(attributes: Attribute[]) {
    await test.step('Should validate attributes schema', async () => {
      expect(Array.isArray(attributes)).toBe(true);

      for (const attribute of attributes) {
        expect(attribute).toHaveProperty('id');
        expect(attribute).toHaveProperty('name');
        expect(attribute).toHaveProperty('shortName');
        expect(attribute).toHaveProperty('description');
        expect(attribute).toHaveProperty('skills');

        expect(typeof attribute.id).toBe('number');
        expect(typeof attribute.name).toBe('string');
        expect(typeof attribute.shortName).toBe('string');
        expect(typeof attribute.description).toBe('string');
        expect(Array.isArray(attribute.skills)).toBe(true);
      }
    });
  }

  async validateId(id: number, expectedId: number) {
    await test.step('Validate ID', async () => {
      expect(id).toBe(expectedId);
    });
  }

  async validateName(name: string, expectedName: string) {
    await test.step('Validate name', async () => {
      expect(name).toBe(expectedName);
    });
  }

  async validateShortName(shortName: string, expectedShortName: string) {
    await test.step('Validate shortName', async () => {
      expect(shortName).toBe(expectedShortName);
    });
  }

  async validateDescription(description: string, expectedDescription: string) {
    await test.step('Validate description', async () => {
      expect(description).toBe(expectedDescription);
    });
  }

  async validateSkills(skills: string[], expectedSkills: string[]) {
    await test.step('Validate skills', async () => {
      expect(skills).toEqual(expectedSkills);
    });
  }
}
