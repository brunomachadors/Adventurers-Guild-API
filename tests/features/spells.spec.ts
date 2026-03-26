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
