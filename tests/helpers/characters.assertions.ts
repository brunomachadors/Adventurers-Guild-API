import {
  CharacterClassDetails,
  CharacterListItem,
  CharacterResponseBody,
  CharacterStatus,
} from '@/app/types/character';
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
    });

    for (const missingField of character.missingFields) {
      await test.step(`Validate missing field schema for ${missingField}`, async () => {
        expect(typeof missingField).toBe('string');
      });
    }

    if (character.classDetails) {
      await this.validateClassDetailsSchema(character.classDetails, character.level);
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
