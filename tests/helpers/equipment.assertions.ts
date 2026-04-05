import {
  EquipmentArmorDetails,
  EquipmentDetail,
  EquipmentGenericDetails,
  EquipmentListItem,
  EquipmentShieldDetails,
  EquipmentWeaponDetails,
} from '@/app/types/equipment';
import { expect, test } from '@playwright/test';

export class EquipmentAssert {
  async success(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 200', async () => {
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
    });
  }

  async notFound(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 404', async () => {
      expect(response.status()).toBe(404);
      expect(response.ok()).toBeFalsy();
    });
  }

  async validateEquipmentListSchema(items: EquipmentListItem[]) {
    await test.step('Validate equipment list schema', async () => {
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    for (const item of items) {
      await test.step(`Validate equipment list item schema for ${item.name}`, async () => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('type');
        expect(item).toHaveProperty('cost');
        expect(item).toHaveProperty('weight');
        expect(item).toHaveProperty('isMagical');

        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
        expect(typeof item.category).toBe('string');
        expect(typeof item.type).toBe('string');
        expect(typeof item.cost).toBe('string');
        expect(item.weight === null || typeof item.weight === 'number').toBe(true);
        expect(typeof item.isMagical).toBe('boolean');
      });
    }
  }

  async validateEquipmentDetailSchema(item: EquipmentDetail) {
    await test.step(`Validate equipment detail schema for ${item.name}`, async () => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('slug');
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('type');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('cost');
      expect(item).toHaveProperty('weight');
      expect(item).toHaveProperty('isMagical');
      expect(item).toHaveProperty('modifiers');
      expect(item).toHaveProperty('effects');
      expect(item).toHaveProperty('details');

      expect(typeof item.id).toBe('number');
      expect(typeof item.name).toBe('string');
      expect(typeof item.slug).toBe('string');
      expect(typeof item.category).toBe('string');
      expect(typeof item.type).toBe('string');
      expect(typeof item.description).toBe('string');
      expect(typeof item.cost).toBe('string');
      expect(item.weight === null || typeof item.weight === 'number').toBe(true);
      expect(typeof item.isMagical).toBe('boolean');
      expect(Array.isArray(item.modifiers)).toBe(true);
      expect(Array.isArray(item.effects)).toBe(true);
      expect(typeof item.details).toBe('object');
    });
  }

  async validateWeaponDetailsSchema(details: EquipmentWeaponDetails) {
    await test.step('Validate weapon details schema', async () => {
      expect(details.kind).toBe('weapon');
      expect(typeof details.weaponCategory).toBe('string');
      expect(typeof details.attackType).toBe('string');
      expect(typeof details.damage.formula).toBe('string');
      expect(Array.isArray(details.damage.dice)).toBe(true);
      expect(typeof details.damage.bonus).toBe('number');
      expect(typeof details.damage.damageType).toBe('string');
      expect(details.versatileDamage === null || typeof details.versatileDamage.formula === 'string').toBe(true);
      expect(Array.isArray(details.properties)).toBe(true);
      expect(typeof details.mastery.name).toBe('string');
      expect(typeof details.mastery.slug).toBe('string');
      expect(details.range === null || typeof details.range.unit === 'string').toBe(true);
      expect(typeof details.proficiencyType).toBe('string');
      expect(details.ammunitionType === null || typeof details.ammunitionType === 'string').toBe(true);
    });
  }

  async validateArmorDetailsSchema(details: EquipmentArmorDetails) {
    await test.step('Validate armor details schema', async () => {
      expect(details.kind).toBe('armor');
      expect(typeof details.armorType).toBe('string');
      expect(typeof details.trainingType).toBe('string');
      expect(typeof details.armorClass.base).toBe('number');
      expect(typeof details.armorClass.dexModifier.applies).toBe('boolean');
      expect(
        details.armorClass.dexModifier.max === null ||
          typeof details.armorClass.dexModifier.max === 'number',
      ).toBe(true);
      expect(
        details.strengthRequirement === null ||
          typeof details.strengthRequirement === 'number',
      ).toBe(true);
      expect(typeof details.stealthDisadvantage).toBe('boolean');
      expect(typeof details.donTime).toBe('string');
      expect(typeof details.doffTime).toBe('string');
    });
  }

  async validateShieldDetailsSchema(details: EquipmentShieldDetails) {
    await test.step('Validate shield details schema', async () => {
      expect(details.kind).toBe('shield');
      expect(typeof details.trainingType).toBe('string');
      expect(typeof details.armorClassBonus).toBe('number');
      expect(typeof details.donTime).toBe('string');
      expect(typeof details.doffTime).toBe('string');
    });
  }

  async validateGenericDetailsSchema(details: EquipmentGenericDetails) {
    await test.step('Validate generic details schema', async () => {
      expect(details.kind).toBe('generic');
    });
  }

  async validateErrorResponse(
    errorResponse: { error: string },
    expectedError: string,
  ) {
    await test.step('Validate error response schema', async () => {
      expect(errorResponse).toHaveProperty('error');
      expect(typeof errorResponse.error).toBe('string');
      expect(errorResponse.error).toBe(expectedError);
    });
  }
}
