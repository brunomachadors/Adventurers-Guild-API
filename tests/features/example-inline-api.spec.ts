import { SpeciesDetail } from '@/app/types/species';
import { expect, test } from '@playwright/test';

test.describe(
  'Example API Spec - Inline Request Syntax',
  { tag: ['@example', '@species', '@inline'] },
  () => {
    test('GET /api/species/human returns 200 and the expected schema', async ({
      request,
    }) => {
      const response = await request.get('/api/species/human');

      expect(response.status()).toBe(200);
      expect(response.ok()).toBe(true);

      const body: SpeciesDetail = await response.json();

      expect(body).toHaveProperty('id');
      expect(body).toHaveProperty('name');
      expect(body).toHaveProperty('slug');
      expect(body).toHaveProperty('creatureType');
      expect(body).toHaveProperty('size');
      expect(body).toHaveProperty('speed');
      expect(body).toHaveProperty('specialTraits');
      expect(body).toHaveProperty('subspecies');

      expect(typeof body.id).toBe('number');
      expect(typeof body.name).toBe('string');
      expect(typeof body.slug).toBe('string');
      expect(typeof body.creatureType).toBe('string');
      expect(typeof body.size).toBe('string');
      expect(typeof body.speed).toBe('number');
      expect(Array.isArray(body.specialTraits)).toBe(true);
      expect(Array.isArray(body.subspecies)).toBe(true);
    });

    test('GET /api/species/human returns the expected business data', async ({
      request,
    }) => {
      const response = await request.get('/api/species/human');
      const body: SpeciesDetail = await response.json();

      expect(body.id).toBe(7);
      expect(body.name).toBe('Human');
      expect(body.slug).toBe('human');
      expect(body.speed).toBe(30);

      expect(body.speciesSkillProficiencyChoices).not.toBeNull();
      expect(body.speciesSkillProficiencyChoices?.choose).toBe(1);
      expect(body.speciesSkillProficiencyChoices?.options).toEqual(
        expect.arrayContaining(['Insight', 'Perception', 'Survival']),
      );

      expect(body.speciesChoices).toEqual([]);
    });
  },
);
