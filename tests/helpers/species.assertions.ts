import {
  SpeciesChoice,
  SpeciesDetail,
  SpeciesSkillProficiencyChoices,
  SpeciesListItem,
  SpeciesSubspecies,
  SpeciesTrait,
} from '@/app/types/species';
import { expect, test } from '@playwright/test';

export class SpeciesAssert {
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

  async validateSchema(speciesList: SpeciesListItem[]) {
    await test.step('Should validate species list is not empty', async () => {
      expect(speciesList).toBeTruthy();
      expect(Array.isArray(speciesList)).toBe(true);
      expect(speciesList.length).toBeGreaterThan(0);
    });

    for (const speciesItem of speciesList) {
      await test.step(`Validate schema for ${speciesItem.name}`, async () => {
        expect(speciesItem).toHaveProperty('id');
        expect(speciesItem).toHaveProperty('name');

        expect(typeof speciesItem.id).toBe('number');
        expect(typeof speciesItem.name).toBe('string');
      });
    }
  }

  async validateDetailSchema(species: SpeciesDetail) {
    await test.step(`Validate detail schema for ${species.name}`, async () => {
      expect(species).toHaveProperty('id');
      expect(species).toHaveProperty('name');
      expect(species).toHaveProperty('slug');
      expect(species).toHaveProperty('description');
      expect(species).toHaveProperty('creatureType');
      expect(species).toHaveProperty('size');
      expect(species).toHaveProperty('speed');
      expect(species).toHaveProperty('specialTraits');
      expect(species).toHaveProperty('subspecies');
      expect(species).toHaveProperty('grantedSkillProficiencies');
      expect(species).toHaveProperty('speciesSkillProficiencyChoices');
      expect(species).toHaveProperty('grantedToolProficiencies');
      expect(species).toHaveProperty('grantedLanguageProficiencies');
      expect(species).toHaveProperty('speciesChoices');

      expect(typeof species.id).toBe('number');
      expect(typeof species.name).toBe('string');
      expect(typeof species.slug).toBe('string');
      expect(typeof species.description).toBe('string');
      expect(typeof species.creatureType).toBe('string');
      expect(typeof species.size).toBe('string');
      expect(typeof species.speed).toBe('number');
      expect(Array.isArray(species.specialTraits)).toBe(true);
      expect(Array.isArray(species.subspecies)).toBe(true);
      expect(Array.isArray(species.grantedSkillProficiencies)).toBe(true);
      expect(
        species.speciesSkillProficiencyChoices === null ||
          typeof species.speciesSkillProficiencyChoices === 'object',
      ).toBe(true);
      expect(Array.isArray(species.grantedToolProficiencies)).toBe(true);
      expect(Array.isArray(species.grantedLanguageProficiencies)).toBe(true);
      expect(Array.isArray(species.speciesChoices)).toBe(true);
    });

    for (const trait of species.specialTraits) {
      await test.step(`Validate special trait schema for ${trait.name}`, async () => {
        expect(trait).toHaveProperty('name');
        expect(trait).toHaveProperty('description');
        expect(typeof trait.name).toBe('string');
        expect(typeof trait.description).toBe('string');
      });
    }

    for (const subspecies of species.subspecies) {
      await test.step(
        `Validate subspecies schema for ${subspecies.name}`,
        async () => {
          expect(subspecies).toHaveProperty('name');
          expect(subspecies).toHaveProperty('slug');
          expect(subspecies).toHaveProperty('description');
          expect(subspecies).toHaveProperty('specialTraits');
          expect(typeof subspecies.name).toBe('string');
          expect(typeof subspecies.slug).toBe('string');
          expect(typeof subspecies.description).toBe('string');
          expect(Array.isArray(subspecies.specialTraits)).toBe(true);
        },
      );

      for (const trait of subspecies.specialTraits) {
        await test.step(
          `Validate subspecies trait schema for ${subspecies.name}: ${trait.name}`,
          async () => {
            expect(trait).toHaveProperty('name');
            expect(trait).toHaveProperty('description');
            expect(typeof trait.name).toBe('string');
            expect(typeof trait.description).toBe('string');
          },
        );
      }
    }

    if (species.speciesSkillProficiencyChoices) {
      const skillChoices = species.speciesSkillProficiencyChoices;

      await test.step(
        `Validate species skill proficiency choices schema for ${species.name}`,
        async () => {
          expect(skillChoices).toHaveProperty('choose');
          expect(skillChoices).toHaveProperty('options');
          expect(typeof skillChoices.choose).toBe('number');
          expect(Array.isArray(skillChoices.options)).toBe(true);
          expect(
            skillChoices.options.every(
              (option) => typeof option === 'string',
            ),
          ).toBe(true);
        },
      );
    }

    for (const speciesChoice of species.speciesChoices) {
      await test.step(
        `Validate species choice schema for ${species.name}: ${speciesChoice.label}`,
        async () => {
          expect(speciesChoice).toHaveProperty('key');
          expect(speciesChoice).toHaveProperty('label');
          expect(speciesChoice).toHaveProperty('description');
          expect(speciesChoice).toHaveProperty('choose');
          expect(speciesChoice).toHaveProperty('options');
          expect(typeof speciesChoice.key).toBe('string');
          expect(typeof speciesChoice.label).toBe('string');
          expect(typeof speciesChoice.description).toBe('string');
          expect(typeof speciesChoice.choose).toBe('number');
          expect(Array.isArray(speciesChoice.options)).toBe(true);
          expect(
            speciesChoice.options.every(
              (option) =>
                typeof option === 'object' &&
                option !== null &&
                typeof option.name === 'string' &&
                typeof option.slug === 'string' &&
                typeof option.description === 'string',
            ),
          ).toBe(true);
        },
      );
    }
  }

  findSpeciesById(
    speciesList: SpeciesListItem[],
    expectedId: number,
  ): SpeciesListItem {
    const species = speciesList.find((item) => item.id === expectedId);

    if (!species) {
      throw new Error(`Species with id ${expectedId} not found`);
    }

    return species;
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

  async validateCreatureType(
    creatureType: string,
    expectedCreatureType: string,
  ) {
    await test.step('Validate Creature Type', async () => {
      expect(creatureType).toBe(expectedCreatureType);
    });
  }

  async validateSize(size: string, expectedSize: string) {
    await test.step('Validate Size', async () => {
      expect(size).toBe(expectedSize);
    });
  }

  async validateSpeed(speed: number, expectedSpeed: number) {
    await test.step('Validate Speed', async () => {
      expect(speed).toBe(expectedSpeed);
    });
  }

  async validateSpecialTraits(
    specialTraits: SpeciesTrait[],
    expectedSpecialTraits: SpeciesTrait[],
  ) {
    await test.step('Validate Special Traits', async () => {
      expect(specialTraits).toEqual(expectedSpecialTraits);
    });
  }

  async validateSubspecies(
    subspecies: SpeciesSubspecies[],
    expectedSubspecies: SpeciesSubspecies[],
  ) {
    await test.step('Validate Subspecies', async () => {
      expect(subspecies).toEqual(expectedSubspecies);
    });
  }

  async validateGrantedSkillProficiencies(
    grantedSkillProficiencies: SpeciesDetail['grantedSkillProficiencies'],
    expectedGrantedSkillProficiencies: SpeciesDetail['grantedSkillProficiencies'],
  ) {
    await test.step('Validate Granted Skill Proficiencies', async () => {
      expect(grantedSkillProficiencies).toEqual(
        expectedGrantedSkillProficiencies,
      );
    });
  }

  async validateSpeciesSkillProficiencyChoices(
    speciesSkillProficiencyChoices: SpeciesSkillProficiencyChoices | null,
    expectedSpeciesSkillProficiencyChoices: SpeciesSkillProficiencyChoices | null,
  ) {
    await test.step('Validate Species Skill Proficiency Choices', async () => {
      expect(speciesSkillProficiencyChoices).toEqual(
        expectedSpeciesSkillProficiencyChoices,
      );
    });
  }

  async validateGrantedToolProficiencies(
    grantedToolProficiencies: SpeciesDetail['grantedToolProficiencies'],
    expectedGrantedToolProficiencies: SpeciesDetail['grantedToolProficiencies'],
  ) {
    await test.step('Validate Granted Tool Proficiencies', async () => {
      expect(grantedToolProficiencies).toEqual(
        expectedGrantedToolProficiencies,
      );
    });
  }

  async validateGrantedLanguageProficiencies(
    grantedLanguageProficiencies: SpeciesDetail['grantedLanguageProficiencies'],
    expectedGrantedLanguageProficiencies: SpeciesDetail['grantedLanguageProficiencies'],
  ) {
    await test.step('Validate Granted Language Proficiencies', async () => {
      expect(grantedLanguageProficiencies).toEqual(
        expectedGrantedLanguageProficiencies,
      );
    });
  }

  async validateSpeciesChoices(
    speciesChoices: SpeciesChoice[],
    expectedSpeciesChoices: SpeciesChoice[],
  ) {
    await test.step('Validate Species Choices', async () => {
      expect(speciesChoices).toEqual(expectedSpeciesChoices);
    });
  }

  async validateErrorMessage(error: string, expectedError: string) {
    await test.step('Validate Error Message', async () => {
      expect(error).toBe(expectedError);
    });
  }

  async validateSpeciesInList(
    speciesList: SpeciesListItem[],
    expectedSpecies: SpeciesListItem,
  ) {
    const species = this.findSpeciesById(speciesList, expectedSpecies.id);

    await this.validateId(species.id, expectedSpecies.id);
    await this.validateName(species.name, expectedSpecies.name);
  }

  async validateSpeciesDetail(
    actualSpecies: SpeciesDetail,
    expectedSpecies: SpeciesDetail,
  ) {
    await this.validateDetailSchema(actualSpecies);
    await this.validateId(actualSpecies.id, expectedSpecies.id);
    await this.validateName(actualSpecies.name, expectedSpecies.name);
    await this.validateSlug(actualSpecies.slug, expectedSpecies.slug);
    await this.validateDescription(
      actualSpecies.description,
      expectedSpecies.description,
    );
    await this.validateCreatureType(
      actualSpecies.creatureType,
      expectedSpecies.creatureType,
    );
    await this.validateSize(actualSpecies.size, expectedSpecies.size);
    await this.validateSpeed(actualSpecies.speed, expectedSpecies.speed);
    await this.validateSpecialTraits(
      actualSpecies.specialTraits,
      expectedSpecies.specialTraits,
    );
    await this.validateSubspecies(
      actualSpecies.subspecies,
      expectedSpecies.subspecies,
    );
    await this.validateGrantedSkillProficiencies(
      actualSpecies.grantedSkillProficiencies,
      expectedSpecies.grantedSkillProficiencies,
    );
    await this.validateSpeciesSkillProficiencyChoices(
      actualSpecies.speciesSkillProficiencyChoices,
      expectedSpecies.speciesSkillProficiencyChoices,
    );
    await this.validateGrantedToolProficiencies(
      actualSpecies.grantedToolProficiencies,
      expectedSpecies.grantedToolProficiencies,
    );
    await this.validateGrantedLanguageProficiencies(
      actualSpecies.grantedLanguageProficiencies,
      expectedSpecies.grantedLanguageProficiencies,
    );
    await this.validateSpeciesChoices(
      actualSpecies.speciesChoices,
      expectedSpecies.speciesChoices,
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
