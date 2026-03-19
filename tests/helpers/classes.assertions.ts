import { ClassListItem } from '@/app/types/class';
import { test, expect } from '@playwright/test';

export class ClassAssert {
  async success(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 200', async () => {
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
    });
  }

  async validateSchema(classList: ClassListItem[]) {
    await test.step('Should validate classes list is not empty', async () => {
      expect(classList).toBeTruthy();
      expect(Array.isArray(classList)).toBe(true);
      expect(classList.length).toBeGreaterThan(0);
    });

    for (const classItem of classList) {
      await test.step(`Validate schema for ${classItem.name}`, async () => {
        expect(classItem).toHaveProperty('id');
        expect(classItem).toHaveProperty('name');

        expect(typeof classItem.id).toBe('number');
        expect(typeof classItem.name).toBe('string');
      });
    }
  }

  findClassById(classList: ClassListItem[], expectedId: number): ClassListItem {
    const classItem = classList.find((item) => item.id === expectedId);
    if (!classItem) {
      throw new Error(`Class with id ${expectedId} not found`);
    }
    return classItem;
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

  async validateClassInList(
    classList: ClassListItem[],
    expectedClass: ClassListItem,
  ) {
    const classItem = this.findClassById(classList, expectedClass.id);

    await this.validateId(classItem.id, expectedClass.id);
    await this.validateName(classItem.name, expectedClass.name);
  }
}
