import { test, expect } from '@playwright/test';

test.describe('Skills API', () => {
  test('should return all skills with simplified structure', async ({
    request,
  }) => {
    const response = await request.get('/api/skills');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);

    for (const skill of body) {
      expect(skill).toHaveProperty('id');
      expect(skill).toHaveProperty('name');

      expect(typeof skill.id).toBe('number');
      expect(typeof skill.name).toBe('string');

      expect(skill).not.toHaveProperty('description');
      expect(skill).not.toHaveProperty('attribute');
      expect(skill).not.toHaveProperty('exampleOfUse');
      expect(skill).not.toHaveProperty('commonClasses');
    }
  });

  test('should include Stealth in the skills list', async ({ request }) => {
    const response = await request.get('/api/skills');
    const body = await response.json();

    const skillNames = body.map((skill: { name: string }) => skill.name);

    expect(skillNames).toContain('Stealth');
  });

  test('should return skill details when searching by id', async ({
    request,
  }) => {
    const response = await request.get('/api/skills/1');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(body.id).toBe(1);
    expect(body.name).toBe('Athletics');
    expect(body.attribute).toBe('STR');
    expect(typeof body.description).toBe('string');
    expect(body.description.length).toBeGreaterThan(10);
    expect(typeof body.exampleOfUse).toBe('string');
    expect(body.exampleOfUse.length).toBeGreaterThan(10);
    expect(Array.isArray(body.commonClasses)).toBe(true);
    expect(body.commonClasses.length).toBeGreaterThan(0);
  });

  test('should return skill details when searching by slug name', async ({
    request,
  }) => {
    const response = await request.get('/api/skills/stealth');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(body.name).toBe('Stealth');
    expect(body.attribute).toBe('DEX');
    expect(typeof body.description).toBe('string');
    expect(typeof body.exampleOfUse).toBe('string');
    expect(Array.isArray(body.commonClasses)).toBe(true);
  });

  test('should return skill details when searching by multi-word slug', async ({
    request,
  }) => {
    const response = await request.get('/api/skills/animal-handling');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(body.name).toBe('Animal Handling');
    expect(body.attribute).toBe('WIS');
  });

  test('should return 404 for an unknown skill id', async ({ request }) => {
    const response = await request.get('/api/skills/999');

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body).toEqual({
      error: 'Skill not found',
    });
  });

  test('should return 404 for an unknown skill name', async ({ request }) => {
    const response = await request.get('/api/skills/unknown-skill');

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body).toEqual({
      error: 'Skill not found',
    });
  });

  test('should keep consistency between skills list and skill detail', async ({
    request,
  }) => {
    const listResponse = await request.get('/api/skills');
    const listBody = await listResponse.json();

    const stealthFromList = listBody.find(
      (skill: { name: string }) => skill.name === 'Stealth',
    );

    expect(stealthFromList).toBeDefined();

    const detailResponse = await request.get('/api/skills/stealth');
    const detailBody = await detailResponse.json();

    expect(detailBody.id).toBe(stealthFromList.id);
    expect(detailBody.name).toBe(stealthFromList.name);
  });
});
