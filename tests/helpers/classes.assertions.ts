import { ClassDetail, ClassListItem } from '@/app/types/class';
import { test, expect } from '@playwright/test';

type ExpectedClassDetail = Pick<
  ClassDetail,
  | 'id'
  | 'name'
  | 'slug'
  | 'primaryattributes'
  | 'recommendedskills'
  | 'hitdie'
  | 'role'
  | 'description'
> &
  Partial<
    Pick<
      ClassDetail,
      | 'savingthrows'
      | 'spellcasting'
      | 'skillProficiencyChoices'
      | 'weaponProficiencies'
      | 'armorTraining'
      | 'startingEquipmentOptions'
      | 'equipmentOptions'
      | 'subclasses'
      | 'levelprogression'
    >
  >;

export class ClassAssert {
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

  async validateDetailSchema(classItem: ClassDetail) {
    await test.step(`Validate detail schema for ${classItem.name}`, async () => {
      expect(classItem).toHaveProperty('id');
      expect(classItem).toHaveProperty('name');
      expect(classItem).toHaveProperty('slug');
      expect(classItem).toHaveProperty('primaryattributes');
      expect(classItem).toHaveProperty('recommendedskills');
      expect(classItem).toHaveProperty('savingthrows');
      expect(classItem).toHaveProperty('hitdie');
      expect(classItem).toHaveProperty('role');
      expect(classItem).toHaveProperty('description');
      expect(classItem).toHaveProperty('spellcasting');
      expect(classItem).toHaveProperty('skillProficiencyChoices');
      expect(classItem).toHaveProperty('weaponProficiencies');
      expect(classItem).toHaveProperty('armorTraining');
      expect(classItem).toHaveProperty('startingEquipmentOptions');
      expect(classItem).toHaveProperty('equipmentOptions');
      expect(classItem).toHaveProperty('subclasses');
      expect(classItem).toHaveProperty('levelprogression');

      expect(typeof classItem.id).toBe('number');
      expect(typeof classItem.name).toBe('string');
      expect(typeof classItem.slug).toBe('string');
      expect(Array.isArray(classItem.primaryattributes)).toBe(true);
      expect(Array.isArray(classItem.recommendedskills)).toBe(true);
      expect(Array.isArray(classItem.savingthrows)).toBe(true);
      expect(typeof classItem.hitdie).toBe('number');
      expect(typeof classItem.role).toBe('string');
      expect(typeof classItem.description).toBe('string');
      expect(
        classItem.spellcasting === null ||
          typeof classItem.spellcasting === 'object',
      ).toBe(true);
      expect(
        classItem.skillProficiencyChoices === null ||
          typeof classItem.skillProficiencyChoices === 'object',
      ).toBe(true);
      expect(Array.isArray(classItem.weaponProficiencies)).toBe(true);
      expect(Array.isArray(classItem.armorTraining)).toBe(true);
      expect(Array.isArray(classItem.startingEquipmentOptions)).toBe(true);
      expect(Array.isArray(classItem.equipmentOptions)).toBe(true);
      expect(Array.isArray(classItem.subclasses)).toBe(true);
      expect(Array.isArray(classItem.levelprogression)).toBe(true);
    });

    if (classItem.spellcasting) {
      const spellcasting = classItem.spellcasting;

      await test.step('Validate spellcasting schema', async () => {
        expect(spellcasting).toHaveProperty('ability');
        expect(typeof spellcasting.ability).toBe('string');

        if (spellcasting.usesSpellbook !== undefined) {
          expect(typeof spellcasting.usesSpellbook).toBe('boolean');
        }

        if (spellcasting.canCastRituals !== undefined) {
          expect(typeof spellcasting.canCastRituals).toBe('boolean');
        }
      });
    }

    await test.step('Validate derived class creation fields schema', async () => {
      expect(typeof classItem.skillProficiencyChoices.choose).toBe('number');
      expect(Array.isArray(classItem.skillProficiencyChoices.options)).toBe(true);
      expect(
        classItem.skillProficiencyChoices.options.every(
          (option) => typeof option === 'string',
        ),
      ).toBe(true);
      expect(
        classItem.weaponProficiencies.every(
          (proficiency) => typeof proficiency === 'string',
        ),
      ).toBe(true);
      expect(
        classItem.armorTraining.every((training) => typeof training === 'string'),
      ).toBe(true);
      expect(
        classItem.equipmentOptions.every((option) => typeof option === 'string'),
      ).toBe(true);
      expect(
        classItem.startingEquipmentOptions.every(
          (option) =>
            option !== null &&
            typeof option === 'object' &&
            (option.label === null || typeof option.label === 'string') &&
            Array.isArray(option.items),
        ),
      ).toBe(true);
    });

    for (const subclass of classItem.subclasses) {
      await test.step(`Validate subclass schema for ${subclass}`, async () => {
        expect(typeof subclass).toBe('string');
      });
    }

    for (const progression of classItem.levelprogression) {
      await test.step(
        `Validate level progression schema for level ${progression.level}`,
        async () => {
          expect(typeof progression.level).toBe('number');
          expect(Array.isArray(progression.features)).toBe(true);
        },
      );

      for (const feature of progression.features) {
        await test.step(
          `Validate level feature schema for ${feature.name}`,
          async () => {
            expect(feature).toHaveProperty('name');
            expect(feature).toHaveProperty('description');
            expect(typeof feature.name).toBe('string');
            expect(typeof feature.description).toBe('string');
          },
        );
      }
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

  async validateSlug(slug: string, expectedSlug: string) {
    await test.step('Validate Slug', async () => {
      expect(slug).toBe(expectedSlug);
    });
  }

  async validatePrimaryAttributes(
    primaryattributes: ClassDetail['primaryattributes'],
    expectedPrimaryAttributes: ClassDetail['primaryattributes'],
  ) {
    await test.step('Validate Primary Attributes', async () => {
      expect(primaryattributes).toEqual(expectedPrimaryAttributes);
    });
  }

  async validateRecommendedSkills(
    recommendedskills: ClassDetail['recommendedskills'],
    expectedRecommendedSkills: ClassDetail['recommendedskills'],
  ) {
    await test.step('Validate Recommended Skills', async () => {
      expect(recommendedskills).toEqual(expectedRecommendedSkills);
    });
  }

  async validateSavingThrows(
    savingthrows: ClassDetail['savingthrows'],
    expectedSavingThrows: ClassDetail['savingthrows'],
  ) {
    await test.step('Validate Saving Throws', async () => {
      expect(savingthrows).toEqual(expectedSavingThrows);
    });
  }

  async validateHitDie(hitdie: number, expectedHitDie: number) {
    await test.step('Validate Hit Die', async () => {
      expect(hitdie).toBe(expectedHitDie);
    });
  }

  async validateRole(role: ClassDetail['role'], expectedRole: ClassDetail['role']) {
    await test.step('Validate Role', async () => {
      expect(role).toBe(expectedRole);
    });
  }

  async validateDescription(description: string, expectedDescription: string) {
    await test.step('Validate Description', async () => {
      expect(description).toBe(expectedDescription);
    });
  }

  async validateErrorMessage(error: string, expectedError: string) {
    await test.step('Validate Error Message', async () => {
      expect(error).toBe(expectedError);
    });
  }

  async validateSpellcasting(
    spellcasting: ClassDetail['spellcasting'],
    expectedSpellcasting: ClassDetail['spellcasting'],
  ) {
    await test.step('Validate Spellcasting', async () => {
      expect(spellcasting).toEqual(expectedSpellcasting);
    });
  }

  async validateSubclasses(
    subclasses: ClassDetail['subclasses'],
    expectedSubclasses: ClassDetail['subclasses'],
  ) {
    await test.step('Validate Subclasses', async () => {
      expect(subclasses).toEqual(expectedSubclasses);
    });
  }

  async validateLevelProgression(
    levelprogression: ClassDetail['levelprogression'],
    expectedLevelProgression: ClassDetail['levelprogression'],
  ) {
    await test.step('Validate Level Progression', async () => {
      expect(levelprogression).toEqual(expectedLevelProgression);
    });
  }

  async validateSkillProficiencyChoices(
    skillProficiencyChoices: ClassDetail['skillProficiencyChoices'],
    expectedSkillProficiencyChoices: ClassDetail['skillProficiencyChoices'],
  ) {
    await test.step('Validate Skill Proficiency Choices', async () => {
      expect(skillProficiencyChoices).toEqual(expectedSkillProficiencyChoices);
    });
  }

  async validateWeaponProficiencies(
    weaponProficiencies: ClassDetail['weaponProficiencies'],
    expectedWeaponProficiencies: ClassDetail['weaponProficiencies'],
  ) {
    await test.step('Validate Weapon Proficiencies', async () => {
      expect(weaponProficiencies).toEqual(expectedWeaponProficiencies);
    });
  }

  async validateArmorTraining(
    armorTraining: ClassDetail['armorTraining'],
    expectedArmorTraining: ClassDetail['armorTraining'],
  ) {
    await test.step('Validate Armor Training', async () => {
      expect(armorTraining).toEqual(expectedArmorTraining);
    });
  }

  async validateStartingEquipmentOptions(
    startingEquipmentOptions: ClassDetail['startingEquipmentOptions'],
    expectedStartingEquipmentOptions: ClassDetail['startingEquipmentOptions'],
  ) {
    await test.step('Validate Starting Equipment Options', async () => {
      expect(startingEquipmentOptions).toEqual(expectedStartingEquipmentOptions);
    });
  }

  async validateEquipmentOptions(
    equipmentOptions: ClassDetail['equipmentOptions'],
    expectedEquipmentOptions: ClassDetail['equipmentOptions'],
  ) {
    await test.step('Validate Equipment Options', async () => {
      expect(equipmentOptions).toEqual(expectedEquipmentOptions);
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

  async validateClassDetail(
    actualClass: ClassDetail,
    expectedClass: ExpectedClassDetail,
  ) {
    await this.validateDetailSchema(actualClass);
    await this.validateId(actualClass.id, expectedClass.id);
    await this.validateName(actualClass.name, expectedClass.name);
    await this.validateSlug(actualClass.slug, expectedClass.slug);
    await this.validatePrimaryAttributes(
      actualClass.primaryattributes,
      expectedClass.primaryattributes,
    );
    await this.validateRecommendedSkills(
      actualClass.recommendedskills,
      expectedClass.recommendedskills,
    );
    await this.validateHitDie(actualClass.hitdie, expectedClass.hitdie);
    await this.validateRole(actualClass.role, expectedClass.role);
    await this.validateDescription(
      actualClass.description,
      expectedClass.description,
    );

    if (expectedClass.savingthrows) {
      await this.validateSavingThrows(
        actualClass.savingthrows,
        expectedClass.savingthrows,
      );
    }

    if (expectedClass.spellcasting !== undefined) {
      await this.validateSpellcasting(
        actualClass.spellcasting,
        expectedClass.spellcasting,
      );
    }

    if (expectedClass.skillProficiencyChoices) {
      await this.validateSkillProficiencyChoices(
        actualClass.skillProficiencyChoices,
        expectedClass.skillProficiencyChoices,
      );
    }

    if (expectedClass.weaponProficiencies) {
      await this.validateWeaponProficiencies(
        actualClass.weaponProficiencies,
        expectedClass.weaponProficiencies,
      );
    }

    if (expectedClass.armorTraining) {
      await this.validateArmorTraining(
        actualClass.armorTraining,
        expectedClass.armorTraining,
      );
    }

    if (expectedClass.startingEquipmentOptions) {
      await this.validateStartingEquipmentOptions(
        actualClass.startingEquipmentOptions,
        expectedClass.startingEquipmentOptions,
      );
    }

    if (expectedClass.equipmentOptions) {
      await this.validateEquipmentOptions(
        actualClass.equipmentOptions,
        expectedClass.equipmentOptions,
      );
    }

    if (expectedClass.subclasses) {
      await this.validateSubclasses(
        actualClass.subclasses,
        expectedClass.subclasses,
      );
    }

    if (expectedClass.levelprogression) {
      await this.validateLevelProgression(
        actualClass.levelprogression,
        expectedClass.levelprogression,
      );
    }
  }

  async validateErrorResponse(
    errorResponse: { error: string },
    expectedError: string,
  ) {
    await test.step('Validate error response schema', async () => {
      expect(errorResponse).toHaveProperty('error');
      expect(typeof errorResponse.error).toBe('string');
    });

    await this.validateErrorMessage(errorResponse.error, expectedError);
  }
}
