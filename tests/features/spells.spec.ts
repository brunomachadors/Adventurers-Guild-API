import { test, expect } from '@playwright/test';

import { SpellListItem, SpellDetail } from '@/app/types/spell';
import { SpellsClient } from '../clients/spells.client';
import { expectedDetailedSpells, expectedSpellsList } from '../data/spells.expected';
import { SpellAssert } from '../helpers/spells.assertions';

test.describe('Spells API - List', { tag: ['@spells', '@list'] }, () => {
  test('Validate Schema', { tag: ['@get', '@schema'] }, async ({ request }) => {
    const spellsClient = new SpellsClient(request);
    const spellAssert = new SpellAssert();

    const response = await spellsClient.getSpells();

    await spellAssert.success(response);

    const body: SpellListItem[] = await response.json();

    await spellAssert.validateSchema(body);
  });

  for (const expectedSpell of expectedSpellsList) {
    test(
      `Validate Spell ${expectedSpell.name}`,
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const spellsClient = new SpellsClient(request);
        const spellAssert = new SpellAssert();

        const response = await spellsClient.getSpells();

        await spellAssert.success(response);

        const body: SpellListItem[] = await response.json();

        await spellAssert.validateSpellInList(body, expectedSpell);
      },
    );
  }

  test(
    'Filter spells by level 1',
    { tag: ['@get', '@filters', '@data'] },
    async ({ request }) => {
      const spellsClient = new SpellsClient(request);
      const spellAssert = new SpellAssert();

      const response = await spellsClient.getSpells({ level: 1 });

      await spellAssert.success(response);

      const body: SpellListItem[] = await response.json();

      await spellAssert.validateSchema(body);
      await test.step('Validate all returned spells are level 1', async () => {
        expect(body.length).toBeGreaterThan(0);
        expect(body.every((spell) => spell.level === 1)).toBe(true);
      });
    },
  );

  test(
    'Filter spells by cantrip level alias',
    { tag: ['@get', '@filters', '@data'] },
    async ({ request }) => {
      const spellsClient = new SpellsClient(request);
      const spellAssert = new SpellAssert();

      const response = await spellsClient.getSpells({ level: 'cantrip' });

      await spellAssert.success(response);

      const body: SpellListItem[] = await response.json();

      await spellAssert.validateSchema(body);
      await test.step('Validate all returned spells are cantrips', async () => {
        expect(body.length).toBeGreaterThan(0);
        expect(body.every((spell) => spell.level === 0)).toBe(true);
      });
      await spellAssert.validateSpellInList(body, expectedSpellsList[0]);
    },
  );

  test(
    'Filter spells by school',
    { tag: ['@get', '@filters', '@data'] },
    async ({ request }) => {
      const spellsClient = new SpellsClient(request);
      const spellAssert = new SpellAssert();

      const response = await spellsClient.getSpells({ school: 'evocation' });

      await spellAssert.success(response);

      const body: SpellListItem[] = await response.json();

      await spellAssert.validateSchema(body);
      await spellAssert.validateSpellInList(body, expectedSpellsList[0]);
    },
  );

  test(
    'Filter spells by class',
    { tag: ['@get', '@filters', '@data'] },
    async ({ request }) => {
      const spellsClient = new SpellsClient(request);
      const spellAssert = new SpellAssert();

      const response = await spellsClient.getSpells({ class: 'wizard' });

      await spellAssert.success(response);

      const body: SpellListItem[] = await response.json();

      await spellAssert.validateSchema(body);
      await spellAssert.validateSpellInList(body, expectedSpellsList[0]);
      await spellAssert.validateSpellInList(body, expectedSpellsList[1]);
    },
  );

  test(
    'Filter spells by source',
    { tag: ['@get', '@filters', '@data'] },
    async ({ request }) => {
      const spellsClient = new SpellsClient(request);
      const spellAssert = new SpellAssert();

      const response = await spellsClient.getSpells({
        source: "player's handbook",
      });

      await spellAssert.success(response);

      const body: SpellListItem[] = await response.json();

      await spellAssert.validateSchema(body);
      await spellAssert.validateSpellInList(body, expectedSpellsList[0]);
    },
  );

  test(
    'Filter spells by partial name',
    { tag: ['@get', '@filters', '@data'] },
    async ({ request }) => {
      const spellsClient = new SpellsClient(request);
      const spellAssert = new SpellAssert();

      const response = await spellsClient.getSpells({ name: 'acid' });

      await spellAssert.success(response);

      const body: SpellListItem[] = await response.json();

      await spellAssert.validateSchema(body);
      await test.step('Validate filtered names match partial search', async () => {
        expect(body.length).toBeGreaterThan(0);
        expect(
          body.every((spell) => spell.name.toLowerCase().includes('acid')),
        ).toBe(true);
      });
      await spellAssert.validateSpellInList(body, expectedSpellsList[0]);
    },
  );

  test(
    'Combine spell filters with AND',
    { tag: ['@get', '@filters', '@data'] },
    async ({ request }) => {
      const spellsClient = new SpellsClient(request);
      const spellAssert = new SpellAssert();

      const response = await spellsClient.getSpells({
        level: 'cantrip',
        class: 'wizard',
        school: 'evocation',
        name: 'acid',
      });

      await spellAssert.success(response);

      const body: SpellListItem[] = await response.json();

      await spellAssert.validateSchema(body);
      await test.step('Validate combined filters narrowed the result set', async () => {
        expect(body).toEqual([
          {
            id: expectedDetailedSpells['acid-splash'].id,
            name: expectedDetailedSpells['acid-splash'].name,
            level: expectedDetailedSpells['acid-splash'].level,
            levelLabel: expectedDetailedSpells['acid-splash'].levelLabel,
          },
        ]);
      });
    },
  );

  test(
    'Reject invalid level filter',
    { tag: ['@get', '@filters', '@negative', '@error'] },
    async ({ request }) => {
      const spellsClient = new SpellsClient(request);
      const spellAssert = new SpellAssert();

      const response = await spellsClient.getSpells({ level: 'first' });

      await spellAssert.badRequest(response);

      const body: { error: string } = await response.json();

      await spellAssert.validateErrorResponse(body, 'Invalid level filter');
    },
  );
});

test.describe('Spells API - Detail', { tag: ['@spells', '@detail'] }, () => {
  test('Validate Schema', { tag: ['@get', '@schema'] }, async ({ request }) => {
    const spellsClient = new SpellsClient(request);
    const spellAssert = new SpellAssert();

    const firstExpectedSpell = Object.values(expectedDetailedSpells)[0];
    const response = await spellsClient.getSpellDetail(firstExpectedSpell.id);

    await spellAssert.success(response);

    const body: SpellDetail = await response.json();

    await spellAssert.validateDetailSchema(body);
  });

  for (const [identifier, expectedSpell] of Object.entries(
    expectedDetailedSpells,
  )) {
    test(
      `Validate Spell Detail by id - ${expectedSpell.name}`,
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const spellsClient = new SpellsClient(request);
        const spellAssert = new SpellAssert();

        const response = await spellsClient.getSpellDetail(expectedSpell.id);

        await spellAssert.success(response);

        const body: SpellDetail = await response.json();

        await spellAssert.validateSpellDetail(body, expectedSpell);
      },
    );

    test(
      `Validate Spell Detail by identifier - ${expectedSpell.name}`,
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const spellsClient = new SpellsClient(request);
        const spellAssert = new SpellAssert();

        const response = await spellsClient.getSpellDetail(identifier);

        await spellAssert.success(response);

        const body: SpellDetail = await response.json();

        await spellAssert.validateSpellDetail(body, expectedSpell);
      },
    );
  }

  test(
    'Validate detailed spells are present in list with matching base fields',
    { tag: ['@get', '@consistency', '@data'] },
    async ({ request }) => {
      const spellsClient = new SpellsClient(request);
      const spellAssert = new SpellAssert();

      const response = await spellsClient.getSpells();

      await spellAssert.success(response);

      const body: SpellListItem[] = await response.json();

      for (const expectedSpell of Object.values(expectedDetailedSpells)) {
        await spellAssert.validateSpellInList(body, {
          id: expectedSpell.id,
          name: expectedSpell.name,
          level: expectedSpell.level,
          levelLabel: expectedSpell.levelLabel,
        });
      }
    },
  );

  for (const [identifier, expectedSpell] of Object.entries(
    expectedDetailedSpells,
  )) {
    test(
      `Validate Spell Detail consistency by id and identifier - ${expectedSpell.name}`,
      { tag: ['@get', '@consistency', '@data'] },
      async ({ request }) => {
        const spellsClient = new SpellsClient(request);
        const spellAssert = new SpellAssert();

        const responseById = await spellsClient.getSpellDetail(expectedSpell.id);
        const responseByIdentifier = await spellsClient.getSpellDetail(identifier);

        await spellAssert.success(responseById);
        await spellAssert.success(responseByIdentifier);

        const bodyById: SpellDetail = await responseById.json();
        const bodyByIdentifier: SpellDetail = await responseByIdentifier.json();

        await spellAssert.validateSpellDetail(bodyById, expectedSpell);
        await spellAssert.validateSpellDetail(bodyByIdentifier, expectedSpell);

        await test.step(
          'Validate payload consistency between id and identifier',
          async () => {
          expect(bodyById).toEqual(bodyByIdentifier);
          },
        );
      },
    );
  }

  test(
    'Validate Spell Detail by invalid id',
    { tag: ['@get', '@negative', '@error'] },
    async ({ request }) => {
      const spellsClient = new SpellsClient(request);
      const spellAssert = new SpellAssert();

      const response = await spellsClient.getSpellDetail(9999);

      await spellAssert.notFound(response);

      const body: { error: string } = await response.json();

      await spellAssert.validateErrorResponse(body, 'Spell not found');
    },
  );

  test(
    'Validate Spell Detail by invalid identifier',
    { tag: ['@get', '@negative', '@error'] },
    async ({ request }) => {
      const spellsClient = new SpellsClient(request);
      const spellAssert = new SpellAssert();

      const response = await spellsClient.getSpellDetail('unknown-spell');

      await spellAssert.notFound(response);

      const body: { error: string } = await response.json();

      await spellAssert.validateErrorResponse(body, 'Spell not found');
    },
  );
});
