import { SpellDetail, SpellListItem } from '@/app/types/spell';
import { test, expect } from '@playwright/test';

export class SpellAssert {
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

  async badRequest(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 400', async () => {
      expect(response.status()).toBe(400);
      expect(response.ok()).toBeFalsy();
    });
  }

  async validateSchema(spellList: SpellListItem[]) {
    await test.step('Should validate spells list is not empty', async () => {
      expect(spellList).toBeTruthy();
      expect(Array.isArray(spellList)).toBe(true);
      expect(spellList.length).toBeGreaterThan(0);
    });

    for (const spell of spellList) {
      await test.step(`Validate schema for ${spell.name}`, async () => {
        expect(spell).toHaveProperty('id');
        expect(spell).toHaveProperty('name');
        expect(spell).toHaveProperty('level');
        expect(spell).toHaveProperty('levelLabel');

        expect(typeof spell.id).toBe('number');
        expect(typeof spell.name).toBe('string');
        expect(typeof spell.level).toBe('number');
        expect(typeof spell.levelLabel).toBe('string');
      });
    }
  }

  async validateDetailSchema(spell: SpellDetail) {
    await test.step(`Validate detail schema for ${spell.name}`, async () => {
      expect(spell).toHaveProperty('id');
      expect(spell).toHaveProperty('name');
      expect(spell).toHaveProperty('slug');
      expect(spell).toHaveProperty('source');
      expect(spell).toHaveProperty('school');
      expect(spell).toHaveProperty('level');
      expect(spell).toHaveProperty('levelLabel');
      expect(spell).toHaveProperty('castingTime');
      expect(spell).toHaveProperty('range');
      expect(spell).toHaveProperty('components');
      expect(spell).toHaveProperty('duration');
      expect(spell).toHaveProperty('description');
      expect(spell).toHaveProperty('classes');
      expect(spell).toHaveProperty('scaling');

      expect(typeof spell.id).toBe('number');
      expect(typeof spell.name).toBe('string');
      expect(typeof spell.slug).toBe('string');
      expect(typeof spell.source).toBe('string');
      expect(typeof spell.school).toBe('string');
      expect(typeof spell.level).toBe('number');
      expect(typeof spell.levelLabel).toBe('string');
      expect(typeof spell.castingTime).toBe('string');
      expect(typeof spell.range).toBe('string');
      expect(typeof spell.duration).toBe('string');
      expect(typeof spell.description).toBe('string');
      expect(Array.isArray(spell.classes)).toBe(true);
      expect(
        spell.scaling === null || typeof spell.scaling === 'object',
      ).toBe(true);
    });

    await test.step('Validate components schema', async () => {
      expect(spell.components).toHaveProperty('verbal');
      expect(spell.components).toHaveProperty('somatic');
      expect(spell.components).toHaveProperty('material');
      expect(spell.components).toHaveProperty('materialDescription');

      expect(typeof spell.components.verbal).toBe('boolean');
      expect(typeof spell.components.somatic).toBe('boolean');
      expect(typeof spell.components.material).toBe('boolean');
      expect(
        spell.components.materialDescription === null ||
          typeof spell.components.materialDescription === 'string',
      ).toBe(true);
    });

    for (const className of spell.classes) {
      await test.step(`Validate class schema for ${className}`, async () => {
        expect(typeof className).toBe('string');
      });
    }

    if (spell.scaling) {
      for (const entry of spell.scaling.entries) {
        await test.step(
          `Validate scaling schema for level ${entry.level}`,
          async () => {
            expect(typeof entry.level).toBe('number');
            expect(typeof entry.description).toBe('string');
          },
        );
      }
    }
  }

  findSpellById(spellList: SpellListItem[], expectedId: number): SpellListItem {
    const spell = spellList.find((item) => item.id === expectedId);

    if (!spell) {
      throw new Error(`Spell with id ${expectedId} not found`);
    }

    return spell;
  }

  async validateSpellInList(
    spellList: SpellListItem[],
    expectedSpell: SpellListItem,
  ) {
    const spell = this.findSpellById(spellList, expectedSpell.id);

    await test.step('Validate spell list item', async () => {
      expect(spell).toEqual(expectedSpell);
    });
  }

  async validateSpellDetail(actualSpell: SpellDetail, expectedSpell: SpellDetail) {
    await this.validateDetailSchema(actualSpell);

    await test.step('Validate spell detail', async () => {
      expect(actualSpell).toEqual(expectedSpell);
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
