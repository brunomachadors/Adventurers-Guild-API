import { SpeciesDetail, SpeciesListItem } from '@/app/types/species';
import { test } from '@playwright/test';

import { SpeciesClient } from '../clients/species.client';
import {
  expectedDetailedSpecies,
  expectedSpeciesList,
} from '../data/species.expected';
import { SpeciesAssert } from '../helpers/species.assertions';

test.describe('Species API - List', { tag: ['@species', '@list'] }, () => {
  test('Validate Schema', { tag: ['@get', '@schema'] }, async ({ request }) => {
    const speciesClient = new SpeciesClient(request);
    const speciesAssert = new SpeciesAssert();

    const response = await speciesClient.getSpecies();

    await speciesAssert.success(response);

    const body: SpeciesListItem[] = await response.json();

    await speciesAssert.validateSchema(body);
  });

  for (const expectedSpecies of expectedSpeciesList) {
    test(
      `Validate Species ${expectedSpecies.name}`,
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const speciesClient = new SpeciesClient(request);
        const speciesAssert = new SpeciesAssert();

        const response = await speciesClient.getSpecies();

        await speciesAssert.success(response);

        const body: SpeciesListItem[] = await response.json();

        await speciesAssert.validateSpeciesInList(body, expectedSpecies);
      },
    );
  }
});

test.describe('Species API - Detail', { tag: ['@species', '@detail'] }, () => {
  test('Validate Schema', { tag: ['@get', '@schema'] }, async ({ request }) => {
    const speciesClient = new SpeciesClient(request);
    const speciesAssert = new SpeciesAssert();

    const firstExpectedSpecies = Object.values(expectedDetailedSpecies)[0];
    const response = await speciesClient.getSpeciesDetail(firstExpectedSpecies.id);

    await speciesAssert.success(response);

    const body: SpeciesDetail = await response.json();

    await speciesAssert.validateDetailSchema(body);
  });

  for (const [identifier, expectedSpecies] of Object.entries(
    expectedDetailedSpecies,
  )) {
    test(
      `Validate Species Detail by id - ${expectedSpecies.name}`,
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const speciesClient = new SpeciesClient(request);
        const speciesAssert = new SpeciesAssert();

        const response = await speciesClient.getSpeciesDetail(expectedSpecies.id);

        await speciesAssert.success(response);

        const body: SpeciesDetail = await response.json();

        await speciesAssert.validateSpeciesDetail(body, expectedSpecies);
      },
    );

    test(
      `Validate Species Detail by name - ${expectedSpecies.name}`,
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const speciesClient = new SpeciesClient(request);
        const speciesAssert = new SpeciesAssert();

        const response = await speciesClient.getSpeciesDetail(expectedSpecies.name);

        await speciesAssert.success(response);

        const body: SpeciesDetail = await response.json();

        await speciesAssert.validateSpeciesDetail(body, expectedSpecies);
      },
    );

    test(
      `Validate Species Detail by slug - ${expectedSpecies.name}`,
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const speciesClient = new SpeciesClient(request);
        const speciesAssert = new SpeciesAssert();

        const response = await speciesClient.getSpeciesDetail(identifier);

        await speciesAssert.success(response);

        const body: SpeciesDetail = await response.json();

        await speciesAssert.validateSpeciesDetail(body, expectedSpecies);
      },
    );
  }

  test(
    'Validate Species Detail by lowercase identifier',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const speciesClient = new SpeciesClient(request);
      const speciesAssert = new SpeciesAssert();
      const expectedSpecies = expectedDetailedSpecies.human;

      const response = await speciesClient.getSpeciesDetail('human');

      await speciesAssert.success(response);

      const body: SpeciesDetail = await response.json();

      await speciesAssert.validateSpeciesDetail(body, expectedSpecies);
    },
  );

  test(
    'Validate Species Detail by uppercase identifier',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const speciesClient = new SpeciesClient(request);
      const speciesAssert = new SpeciesAssert();
      const expectedSpecies = expectedDetailedSpecies.orc;

      const response = await speciesClient.getSpeciesDetail('ORC');

      await speciesAssert.success(response);

      const body: SpeciesDetail = await response.json();

      await speciesAssert.validateSpeciesDetail(body, expectedSpecies);
    },
  );

  test(
    'Validate Species Detail by invalid id',
    { tag: ['@get', '@negative', '@error'] },
    async ({ request }) => {
      const speciesClient = new SpeciesClient(request);
      const speciesAssert = new SpeciesAssert();

      const response = await speciesClient.getSpeciesDetail(9999);

      await speciesAssert.notFound(response);

      const body: { error: string } = await response.json();

      await speciesAssert.validateErrorResponse(body, 'Species not found');
    },
  );

  test(
    'Validate Species Detail by invalid identifier',
    { tag: ['@get', '@negative', '@error'] },
    async ({ request }) => {
      const speciesClient = new SpeciesClient(request);
      const speciesAssert = new SpeciesAssert();

      const response = await speciesClient.getSpeciesDetail('unknown-species');

      await speciesAssert.notFound(response);

      const body: { error: string } = await response.json();

      await speciesAssert.validateErrorResponse(body, 'Species not found');
    },
  );
});
