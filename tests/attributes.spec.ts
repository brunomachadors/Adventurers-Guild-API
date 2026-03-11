import { test, expect } from '@playwright/test';

test.describe('Attributes API', () => {
  test('should return all attributes with expected structure', async ({
    request,
  }) => {
    const response = await request.get('/api/attributes');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(6);

    for (const attribute of body) {
      expect(attribute).toHaveProperty('id');
      expect(attribute).toHaveProperty('name');
      expect(attribute).toHaveProperty('shortName');
      expect(attribute).toHaveProperty('description');
      expect(attribute).toHaveProperty('skills');

      expect(typeof attribute.id).toBe('number');
      expect(typeof attribute.name).toBe('string');
      expect(typeof attribute.shortName).toBe('string');
      expect(typeof attribute.description).toBe('string');
      expect(Array.isArray(attribute.skills)).toBe(true);
    }
  });

  test('should contain the six expected attribute short names', async ({
    request,
  }) => {
    const response = await request.get('/api/attributes');
    const body = await response.json();

    const shortNames = body.map(
      (attribute: { shortName: string }) => attribute.shortName,
    );

    expect(shortNames).toEqual(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']);
  });

  test('should return Dexterity with expected skills', async ({ request }) => {
    const response = await request.get('/api/attributes');
    const body = await response.json();

    const dexterity = body.find(
      (attribute: { shortName: string }) => attribute.shortName === 'DEX',
    );

    expect(dexterity).toBeDefined();
    expect(dexterity.name).toBe('Dexterity');
    expect(dexterity.skills).toEqual([
      'Acrobatics',
      'Sleight of Hand',
      'Stealth',
    ]);
  });

  test('should return Constitution with an empty skills array', async ({
    request,
  }) => {
    const response = await request.get('/api/attributes');
    const body = await response.json();

    const constitution = body.find(
      (attribute: { shortName: string }) => attribute.shortName === 'CON',
    );

    expect(constitution).toBeDefined();
    expect(constitution.name).toBe('Constitution');
    expect(constitution.skills).toEqual([]);
  });
});
