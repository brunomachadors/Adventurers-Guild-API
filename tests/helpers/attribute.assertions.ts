import { test, expect } from '@playwright/test';
import { Attribute } from '@/app/types/attribute';

export class Assert {
  async success(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 200', async () => {
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
    });
  }

  async validateSchema(attributes: Attribute[]) {
    await test.step('Should validate attributes schema', async () => {
      expect(Array.isArray(attributes)).toBe(true);
      expect(attributes.length).toBeGreaterThan(0);

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

  findAttributeByShortName(
    attributes: Attribute[],
    expectedShortName: Attribute['shortName'],
  ): Attribute {
    const attribute = attributes.find(
      (item) => item.shortName === expectedShortName,
    );

    if (!attribute) {
      throw new Error(`Attribute ${expectedShortName} not found`);
    }

    return attribute;
  }

  async validateId(id: number, expectedId: number) {
    await test.step('Validate ID', async () => {
      expect(id).toBe(expectedId);
    });
  }

  async validateName(name: string, expectedName: string) {
    await test.step('Validate Name', async () => {
      expect(name).toBe(expectedName);
    });
  }

  async validateShortName(shortName: string, expectedShortName: string) {
    await test.step('Validate Short Name', async () => {
      expect(shortName).toBe(expectedShortName);
    });
  }

  async validateDescription(description: string, expectedDescription: string) {
    await test.step('Validate Description', async () => {
      expect(description).toBe(expectedDescription);
    });
  }

  async validateSkills(skills: string[], expectedSkills: string[]) {
    await test.step('Validate Skills', async () => {
      expect(skills).toEqual(expectedSkills);
    });
  }

  async validateAttributeInList(
    attributes: Attribute[],
    expectedAttribute: Attribute,
  ) {
    const attribute = this.findAttributeByShortName(
      attributes,
      expectedAttribute.shortName,
    );

    await this.validateId(attribute.id, expectedAttribute.id);
    await this.validateName(attribute.name, expectedAttribute.name);
    await this.validateShortName(
      attribute.shortName,
      expectedAttribute.shortName,
    );
    await this.validateDescription(
      attribute.description,
      expectedAttribute.description,
    );
    await this.validateSkills(attribute.skills, expectedAttribute.skills);
  }
}
