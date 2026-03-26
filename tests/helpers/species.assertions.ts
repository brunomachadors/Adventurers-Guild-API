import { SpeciesDetail, SpeciesListItem, SpeciesTrait } from '@/app/types/species';
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

      expect(typeof species.id).toBe('number');
      expect(typeof species.name).toBe('string');
      expect(typeof species.slug).toBe('string');
      expect(typeof species.description).toBe('string');
      expect(typeof species.creatureType).toBe('string');
      expect(typeof species.size).toBe('string');
      expect(typeof species.speed).toBe('number');
      expect(Array.isArray(species.specialTraits)).toBe(true);
    });

    for (const trait of species.specialTraits) {
      await test.step(`Validate special trait schema for ${trait.name}`, async () => {
        expect(trait).toHaveProperty('name');
        expect(trait).toHaveProperty('description');
        expect(typeof trait.name).toBe('string');
        expect(typeof trait.description).toBe('string');
      });
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
