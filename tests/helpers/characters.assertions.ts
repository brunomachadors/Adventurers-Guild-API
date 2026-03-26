import {
  CharacterClassDetails,
  CharacterListItem,
  CharacterSpellOptionsResponseBody,
  CharacterSpellSelectionResponseBody,
  CharacterResponseBody,
  CharacterStatus,
} from '@/app/types/character';
import { BackgroundDetail } from '@/app/types/background';
import { SpeciesDetail } from '@/app/types/species';
import { expect, test } from '@playwright/test';

export class CharactersAssert {
  async created(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 201', async () => {
      expect(response.status()).toBe(201);
      expect(response.ok()).toBeTruthy();
    });
  }

  async success(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 200', async () => {
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
    });
  }

  async unauthorized(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 401', async () => {
      expect(response.status()).toBe(401);
      expect(response.ok()).toBeFalsy();
    });
  }

  async badRequest(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 400', async () => {
      expect(response.status()).toBe(400);
      expect(response.ok()).toBeFalsy();
    });
  }

  async notFound(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 404', async () => {
      expect(response.status()).toBe(404);
      expect(response.ok()).toBeFalsy();
    });
  }

  async validateCharacterListSchema(characters: CharacterListItem[]) {
    await test.step('Validate character list schema', async () => {
      expect(characters).toBeTruthy();
      expect(Array.isArray(characters)).toBe(true);
    });

    for (const character of characters) {
      await test.step(`Validate character list item schema for ${character.name}`, async () => {
        expect(character).toHaveProperty('id');
        expect(character).toHaveProperty('name');
        expect(character).toHaveProperty('status');
        expect(character).toHaveProperty('level');

        expect(typeof character.id).toBe('number');
        expect(typeof character.name).toBe('string');
        expect(typeof character.status).toBe('string');
        expect(typeof character.level).toBe('number');
      });
    }
  }

  async validateCharacterSpellOptionsSchema(
    spellOptions: CharacterSpellOptionsResponseBody,
  ) {
    await test.step('Validate character spell options schema', async () => {
      expect(spellOptions).toHaveProperty('characterId');
      expect(spellOptions).toHaveProperty('classId');
      expect(spellOptions).toHaveProperty('className');
      expect(spellOptions).toHaveProperty('spells');

      expect(typeof spellOptions.characterId).toBe('number');
      expect(
        spellOptions.classId === null || typeof spellOptions.classId === 'number',
      ).toBe(true);
      expect(
        spellOptions.className === null ||
          typeof spellOptions.className === 'string',
      ).toBe(true);
      expect(Array.isArray(spellOptions.spells)).toBe(true);
    });

    for (const spell of spellOptions.spells) {
      await test.step(`Validate spell option schema for ${spell.name}`, async () => {
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

  async validateCharacterSpellSelectionSchema(
    spellSelection: CharacterSpellSelectionResponseBody,
  ) {
    await test.step('Validate character spell selection schema', async () => {
      expect(spellSelection).toHaveProperty('characterId');
      expect(spellSelection).toHaveProperty('classId');
      expect(spellSelection).toHaveProperty('className');
      expect(spellSelection).toHaveProperty('level');
      expect(spellSelection).toHaveProperty('selectionRules');
      expect(spellSelection).toHaveProperty('selectedSpells');
      expect(spellSelection).toHaveProperty('availableSpells');

      expect(typeof spellSelection.characterId).toBe('number');
      expect(
        spellSelection.classId === null ||
          typeof spellSelection.classId === 'number',
      ).toBe(true);
      expect(
        spellSelection.className === null ||
          typeof spellSelection.className === 'string',
      ).toBe(true);
      expect(typeof spellSelection.level).toBe('number');
      expect(Array.isArray(spellSelection.selectedSpells)).toBe(true);
      expect(Array.isArray(spellSelection.availableSpells)).toBe(true);
    });

    await test.step('Validate spell selection rules schema', async () => {
      expect(spellSelection.selectionRules).toHaveProperty('canSelectSpells');
      expect(spellSelection.selectionRules).toHaveProperty('selectionType');
      expect(spellSelection.selectionRules).toHaveProperty('maxCantrips');
      expect(spellSelection.selectionRules).toHaveProperty('maxSpells');

      expect(typeof spellSelection.selectionRules.canSelectSpells).toBe('boolean');
      expect(
        spellSelection.selectionRules.selectionType === null ||
          typeof spellSelection.selectionRules.selectionType === 'string',
      ).toBe(true);
      expect(typeof spellSelection.selectionRules.maxCantrips).toBe('number');
      expect(typeof spellSelection.selectionRules.maxSpells).toBe('number');
    });

    for (const spell of spellSelection.selectedSpells) {
      await test.step(`Validate selected spell schema for ${spell.name}`, async () => {
        expect(spell).toHaveProperty('id');
        expect(spell).toHaveProperty('name');
        expect(spell).toHaveProperty('level');
        expect(spell).toHaveProperty('levelLabel');
        expect(spell).toHaveProperty('selectionType');

        expect(typeof spell.id).toBe('number');
        expect(typeof spell.name).toBe('string');
        expect(typeof spell.level).toBe('number');
        expect(typeof spell.levelLabel).toBe('string');
        expect(typeof spell.selectionType).toBe('string');
      });
    }

    for (const spell of spellSelection.availableSpells) {
      await test.step(`Validate available spell schema for ${spell.name}`, async () => {
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

  async validateCharacterResponseSchema(character: CharacterResponseBody) {
    await test.step('Validate character response schema', async () => {
      expect(character).toHaveProperty('id');
      expect(character).toHaveProperty('name');
      expect(character).toHaveProperty('status');
      expect(character).toHaveProperty('classId');
      expect(character).toHaveProperty('speciesId');
      expect(character).toHaveProperty('backgroundId');
      expect(character).toHaveProperty('level');
      expect(character).toHaveProperty('missingFields');
      expect(character).toHaveProperty('classDetails');
      expect(character).toHaveProperty('speciesDetails');
      expect(character).toHaveProperty('backgroundDetails');

      expect(typeof character.id).toBe('number');
      expect(typeof character.name).toBe('string');
      expect(typeof character.status).toBe('string');
      expect(
        character.classId === null || typeof character.classId === 'number',
      ).toBe(true);
      expect(
        character.speciesId === null || typeof character.speciesId === 'number',
      ).toBe(true);
      expect(
        character.backgroundId === null ||
          typeof character.backgroundId === 'number',
      ).toBe(true);
      expect(typeof character.level).toBe('number');
      expect(Array.isArray(character.missingFields)).toBe(true);
      expect(
        character.classDetails === null ||
          typeof character.classDetails === 'object',
      ).toBe(true);
      expect(
        character.speciesDetails === null ||
          typeof character.speciesDetails === 'object',
      ).toBe(true);
      expect(
        character.backgroundDetails === null ||
          typeof character.backgroundDetails === 'object',
      ).toBe(true);
    });

    for (const missingField of character.missingFields) {
      await test.step(`Validate missing field schema for ${missingField}`, async () => {
        expect(typeof missingField).toBe('string');
      });
    }

    if (character.classDetails) {
      await this.validateClassDetailsSchema(character.classDetails, character.level);
    }

    if (character.speciesDetails) {
      await this.validateSpeciesDetailsSchema(character.speciesDetails);
    }

    if (character.backgroundDetails) {
      await this.validateBackgroundDetailsSchema(character.backgroundDetails);
    }
  }

  async validateClassDetailsSchema(
    classDetails: CharacterClassDetails,
    characterLevel: number,
  ) {
    await test.step(`Validate class details schema for ${classDetails.name}`, async () => {
      expect(classDetails).toHaveProperty('id');
      expect(classDetails).toHaveProperty('name');
      expect(classDetails).toHaveProperty('slug');
      expect(classDetails).toHaveProperty('description');
      expect(classDetails).toHaveProperty('role');
      expect(classDetails).toHaveProperty('hitDie');
      expect(classDetails).toHaveProperty('primaryAttributes');
      expect(classDetails).toHaveProperty('recommendedSkills');
      expect(classDetails).toHaveProperty('savingThrows');
      expect(classDetails).toHaveProperty('spellcasting');
      expect(classDetails).toHaveProperty('subclasses');
      expect(classDetails).toHaveProperty('featuresByLevel');

      expect(typeof classDetails.id).toBe('number');
      expect(typeof classDetails.name).toBe('string');
      expect(typeof classDetails.slug).toBe('string');
      expect(typeof classDetails.description).toBe('string');
      expect(typeof classDetails.role).toBe('string');
      expect(typeof classDetails.hitDie).toBe('number');
      expect(Array.isArray(classDetails.primaryAttributes)).toBe(true);
      expect(Array.isArray(classDetails.recommendedSkills)).toBe(true);
      expect(Array.isArray(classDetails.savingThrows)).toBe(true);
      expect(
        classDetails.spellcasting === null ||
          typeof classDetails.spellcasting === 'object',
      ).toBe(true);
      expect(Array.isArray(classDetails.subclasses)).toBe(true);
      expect(Array.isArray(classDetails.featuresByLevel)).toBe(true);
    });

    for (const progression of classDetails.featuresByLevel) {
      await test.step(
        `Validate class progression schema for level ${progression.level}`,
        async () => {
          expect(typeof progression.level).toBe('number');
          expect(progression.level).toBeLessThanOrEqual(characterLevel);
          expect(Array.isArray(progression.features)).toBe(true);
        },
      );

      for (const feature of progression.features) {
        await test.step(`Validate class feature schema for ${feature.name}`, async () => {
          expect(feature).toHaveProperty('name');
          expect(feature).toHaveProperty('description');
          expect(typeof feature.name).toBe('string');
          expect(typeof feature.description).toBe('string');
        });
      }
    }
  }

  async validateSpeciesDetailsSchema(speciesDetails: SpeciesDetail) {
    await test.step(
      `Validate species details schema for ${speciesDetails.name}`,
      async () => {
        expect(speciesDetails).toHaveProperty('id');
        expect(speciesDetails).toHaveProperty('name');
        expect(speciesDetails).toHaveProperty('slug');
        expect(speciesDetails).toHaveProperty('description');
        expect(speciesDetails).toHaveProperty('creatureType');
        expect(speciesDetails).toHaveProperty('size');
        expect(speciesDetails).toHaveProperty('speed');
        expect(speciesDetails).toHaveProperty('specialTraits');

        expect(typeof speciesDetails.id).toBe('number');
        expect(typeof speciesDetails.name).toBe('string');
        expect(typeof speciesDetails.slug).toBe('string');
        expect(typeof speciesDetails.description).toBe('string');
        expect(typeof speciesDetails.creatureType).toBe('string');
        expect(typeof speciesDetails.size).toBe('string');
        expect(typeof speciesDetails.speed).toBe('number');
        expect(Array.isArray(speciesDetails.specialTraits)).toBe(true);
      },
    );

    for (const trait of speciesDetails.specialTraits) {
      await test.step(
        `Validate species trait schema for ${trait.name}`,
        async () => {
          expect(trait).toHaveProperty('name');
          expect(trait).toHaveProperty('description');
          expect(typeof trait.name).toBe('string');
          expect(typeof trait.description).toBe('string');
        },
      );
    }
  }

  async validateBackgroundDetailsSchema(backgroundDetails: BackgroundDetail) {
    await test.step(
      `Validate background details schema for ${backgroundDetails.name}`,
      async () => {
        expect(backgroundDetails).toHaveProperty('id');
        expect(backgroundDetails).toHaveProperty('name');
        expect(backgroundDetails).toHaveProperty('slug');
        expect(backgroundDetails).toHaveProperty('description');
        expect(backgroundDetails).toHaveProperty('abilityScores');
        expect(backgroundDetails).toHaveProperty('feat');
        expect(backgroundDetails).toHaveProperty('skillProficiencies');
        expect(backgroundDetails).toHaveProperty('toolProficiency');
        expect(backgroundDetails).toHaveProperty('equipmentOptions');

        expect(typeof backgroundDetails.id).toBe('number');
        expect(typeof backgroundDetails.name).toBe('string');
        expect(typeof backgroundDetails.slug).toBe('string');
        expect(typeof backgroundDetails.description).toBe('string');
        expect(Array.isArray(backgroundDetails.abilityScores)).toBe(true);
        expect(typeof backgroundDetails.feat).toBe('string');
        expect(Array.isArray(backgroundDetails.skillProficiencies)).toBe(true);
        expect(
          backgroundDetails.toolProficiency === null ||
            typeof backgroundDetails.toolProficiency === 'string',
        ).toBe(true);
        expect(Array.isArray(backgroundDetails.equipmentOptions)).toBe(true);
      },
    );
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

  async validateStatus(status: CharacterStatus, expectedStatus: CharacterStatus) {
    await test.step('Validate Status', async () => {
      expect(status).toBe(expectedStatus);
    });
  }

  async validateClassId(classId: number | null, expectedClassId: number | null) {
    await test.step('Validate Class ID', async () => {
      expect(classId).toBe(expectedClassId);
    });
  }

  async validateSpeciesId(
    speciesId: number | null,
    expectedSpeciesId: number | null,
  ) {
    await test.step('Validate Species ID', async () => {
      expect(speciesId).toBe(expectedSpeciesId);
    });
  }

  async validateBackgroundId(
    backgroundId: number | null,
    expectedBackgroundId: number | null,
  ) {
    await test.step('Validate Background ID', async () => {
      expect(backgroundId).toBe(expectedBackgroundId);
    });
  }

  async validateLevel(level: number, expectedLevel: number) {
    await test.step('Validate Level', async () => {
      expect(level).toBe(expectedLevel);
    });
  }

  async validateClassName(
    className: string | null,
    expectedClassName: string | null,
  ) {
    await test.step('Validate Class Name', async () => {
      expect(className).toBe(expectedClassName);
    });
  }

  async validateMissingFields(
    missingFields: CharacterResponseBody['missingFields'],
    expectedMissingFields: CharacterResponseBody['missingFields'],
  ) {
    await test.step('Validate Missing Fields', async () => {
      expect(missingFields).toEqual(expectedMissingFields);
    });
  }

  async validateClassDetailsPresence(
    classDetails: CharacterResponseBody['classDetails'],
    shouldExist: boolean,
  ) {
    await test.step('Validate Class Details Presence', async () => {
      if (shouldExist) {
        expect(classDetails).not.toBeNull();
      } else {
        expect(classDetails).toBeNull();
      }
    });
  }

  async validateSpeciesDetailsPresence(
    speciesDetails: CharacterResponseBody['speciesDetails'],
    shouldExist: boolean,
  ) {
    await test.step('Validate Species Details Presence', async () => {
      if (shouldExist) {
        expect(speciesDetails).not.toBeNull();
      } else {
        expect(speciesDetails).toBeNull();
      }
    });
  }

  async validateBackgroundDetailsPresence(
    backgroundDetails: CharacterResponseBody['backgroundDetails'],
    shouldExist: boolean,
  ) {
    await test.step('Validate Background Details Presence', async () => {
      if (shouldExist) {
        expect(backgroundDetails).not.toBeNull();
      } else {
        expect(backgroundDetails).toBeNull();
      }
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
