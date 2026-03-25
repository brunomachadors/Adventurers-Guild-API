import { BackgroundDetail, BackgroundListItem } from '@/app/types/background';
import { expect, test } from '@playwright/test';

export class BackgroundAssert {
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

  async validateSchema(backgroundList: BackgroundListItem[]) {
    await test.step('Should validate backgrounds list is not empty', async () => {
      expect(backgroundList).toBeTruthy();
      expect(Array.isArray(backgroundList)).toBe(true);
      expect(backgroundList.length).toBeGreaterThan(0);
    });

    for (const background of backgroundList) {
      await test.step(`Validate schema for ${background.name}`, async () => {
        expect(background).toHaveProperty('id');
        expect(background).toHaveProperty('name');

        expect(typeof background.id).toBe('number');
        expect(typeof background.name).toBe('string');
      });
    }
  }

  async validateDetailSchema(background: BackgroundDetail) {
    await test.step(`Validate detail schema for ${background.name}`, async () => {
      expect(background).toHaveProperty('id');
      expect(background).toHaveProperty('name');
      expect(background).toHaveProperty('slug');
      expect(background).toHaveProperty('description');
      expect(background).toHaveProperty('abilityScores');
      expect(background).toHaveProperty('feat');
      expect(background).toHaveProperty('skillProficiencies');
      expect(background).toHaveProperty('toolProficiency');
      expect(background).toHaveProperty('equipmentOptions');

      expect(typeof background.id).toBe('number');
      expect(typeof background.name).toBe('string');
      expect(typeof background.slug).toBe('string');
      expect(typeof background.description).toBe('string');
      expect(Array.isArray(background.abilityScores)).toBe(true);
      expect(typeof background.feat).toBe('string');
      expect(Array.isArray(background.skillProficiencies)).toBe(true);
      expect(
        background.toolProficiency === null ||
          typeof background.toolProficiency === 'string',
      ).toBe(true);
      expect(Array.isArray(background.equipmentOptions)).toBe(true);
    });

    for (const abilityScore of background.abilityScores) {
      await test.step(
        `Validate ability score schema for ${abilityScore}`,
        async () => {
          expect(typeof abilityScore).toBe('string');
        },
      );
    }

    for (const skill of background.skillProficiencies) {
      await test.step(`Validate skill schema for ${skill}`, async () => {
        expect(typeof skill).toBe('string');
      });
    }

    for (const equipmentOption of background.equipmentOptions) {
      await test.step(
        `Validate equipment option schema for ${equipmentOption}`,
        async () => {
          expect(typeof equipmentOption).toBe('string');
        },
      );
    }
  }

  findBackgroundById(
    backgroundList: BackgroundListItem[],
    expectedId: number,
  ): BackgroundListItem {
    const background = backgroundList.find((item) => item.id === expectedId);

    if (!background) {
      throw new Error(`Background with id ${expectedId} not found`);
    }

    return background;
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

  async validateDescription(description: string, expectedDescription: string) {
    await test.step('Validate Description', async () => {
      expect(description).toBe(expectedDescription);
    });
  }

  async validateAbilityScores(
    abilityScores: BackgroundDetail['abilityScores'],
    expectedAbilityScores: BackgroundDetail['abilityScores'],
  ) {
    await test.step('Validate Ability Scores', async () => {
      expect(abilityScores).toEqual(expectedAbilityScores);
    });
  }

  async validateFeat(feat: string, expectedFeat: string) {
    await test.step('Validate Feat', async () => {
      expect(feat).toBe(expectedFeat);
    });
  }

  async validateSkillProficiencies(
    skillProficiencies: BackgroundDetail['skillProficiencies'],
    expectedSkillProficiencies: BackgroundDetail['skillProficiencies'],
  ) {
    await test.step('Validate Skill Proficiencies', async () => {
      expect(skillProficiencies).toEqual(expectedSkillProficiencies);
    });
  }

  async validateToolProficiency(
    toolProficiency: BackgroundDetail['toolProficiency'],
    expectedToolProficiency: BackgroundDetail['toolProficiency'],
  ) {
    await test.step('Validate Tool Proficiency', async () => {
      expect(toolProficiency).toBe(expectedToolProficiency);
    });
  }

  async validateEquipmentOptions(
    equipmentOptions: BackgroundDetail['equipmentOptions'],
    expectedEquipmentOptions: BackgroundDetail['equipmentOptions'],
  ) {
    await test.step('Validate Equipment Options', async () => {
      expect(equipmentOptions).toEqual(expectedEquipmentOptions);
    });
  }

  async validateErrorMessage(error: string, expectedError: string) {
    await test.step('Validate Error Message', async () => {
      expect(error).toBe(expectedError);
    });
  }

  async validateBackgroundInList(
    backgroundList: BackgroundListItem[],
    expectedBackground: BackgroundListItem,
  ) {
    const background = this.findBackgroundById(backgroundList, expectedBackground.id);

    await this.validateId(background.id, expectedBackground.id);
    await this.validateName(background.name, expectedBackground.name);
  }

  async validateBackgroundDetail(
    actualBackground: BackgroundDetail,
    expectedBackground: BackgroundDetail,
  ) {
    await this.validateDetailSchema(actualBackground);
    await this.validateId(actualBackground.id, expectedBackground.id);
    await this.validateName(actualBackground.name, expectedBackground.name);
    await this.validateSlug(actualBackground.slug, expectedBackground.slug);
    await this.validateDescription(
      actualBackground.description,
      expectedBackground.description,
    );
    await this.validateAbilityScores(
      actualBackground.abilityScores,
      expectedBackground.abilityScores,
    );
    await this.validateFeat(actualBackground.feat, expectedBackground.feat);
    await this.validateSkillProficiencies(
      actualBackground.skillProficiencies,
      expectedBackground.skillProficiencies,
    );
    await this.validateToolProficiency(
      actualBackground.toolProficiency,
      expectedBackground.toolProficiency,
    );
    await this.validateEquipmentOptions(
      actualBackground.equipmentOptions,
      expectedBackground.equipmentOptions,
    );
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
