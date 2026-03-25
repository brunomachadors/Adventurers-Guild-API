import { BackgroundDetail, BackgroundListItem } from '@/app/types/background';
import { test } from '@playwright/test';

import { BackgroundsClient } from '../clients/backgrounds.client';
import {
  expectedBackgroundsList,
  expectedDetailedBackgrounds,
} from '../data/backgrounds.expected';
import { BackgroundAssert } from '../helpers/backgrounds.assertions';

test.describe('Backgrounds API - List', { tag: ['@backgrounds', '@list'] }, () => {
  test('Validate Schema', { tag: ['@schema'] }, async ({ request }) => {
    const backgroundsClient = new BackgroundsClient(request);
    const backgroundAssert = new BackgroundAssert();

    const response = await backgroundsClient.getBackgrounds();

    await backgroundAssert.success(response);

    const body: BackgroundListItem[] = await response.json();

    await backgroundAssert.validateSchema(body);
  });

  for (const expectedBackground of expectedBackgroundsList) {
    test(
      `Validate Background ${expectedBackground.name}`,
      { tag: ['@data'] },
      async ({ request }) => {
        const backgroundsClient = new BackgroundsClient(request);
        const backgroundAssert = new BackgroundAssert();

        const response = await backgroundsClient.getBackgrounds();

        await backgroundAssert.success(response);

        const body: BackgroundListItem[] = await response.json();

        await backgroundAssert.validateBackgroundInList(body, expectedBackground);
      },
    );
  }
});

test.describe(
  'Backgrounds API - Detail',
  { tag: ['@backgrounds', '@detail'] },
  () => {
    test('Validate Schema', { tag: ['@schema'] }, async ({ request }) => {
      const backgroundsClient = new BackgroundsClient(request);
      const backgroundAssert = new BackgroundAssert();

      const firstExpectedBackground = Object.values(expectedDetailedBackgrounds)[0];
      const response = await backgroundsClient.getBackgroundDetail(
        firstExpectedBackground.id,
      );

      await backgroundAssert.success(response);

      const body: BackgroundDetail = await response.json();

      await backgroundAssert.validateDetailSchema(body);
    });

    for (const [identifier, expectedBackground] of Object.entries(
      expectedDetailedBackgrounds,
    )) {
      test(
        `Validate Background Detail by id - ${expectedBackground.name}`,
        { tag: ['@data'] },
        async ({ request }) => {
          const backgroundsClient = new BackgroundsClient(request);
          const backgroundAssert = new BackgroundAssert();

          const response = await backgroundsClient.getBackgroundDetail(
            expectedBackground.id,
          );

          await backgroundAssert.success(response);

          const body: BackgroundDetail = await response.json();

          await backgroundAssert.validateBackgroundDetail(body, expectedBackground);
        },
      );

      test(
        `Validate Background Detail by name - ${expectedBackground.name}`,
        { tag: ['@data'] },
        async ({ request }) => {
          const backgroundsClient = new BackgroundsClient(request);
          const backgroundAssert = new BackgroundAssert();

          const response = await backgroundsClient.getBackgroundDetail(
            expectedBackground.name,
          );

          await backgroundAssert.success(response);

          const body: BackgroundDetail = await response.json();

          await backgroundAssert.validateBackgroundDetail(body, expectedBackground);
        },
      );

      test(
        `Validate Background Detail by slug - ${expectedBackground.name}`,
        { tag: ['@data'] },
        async ({ request }) => {
          const backgroundsClient = new BackgroundsClient(request);
          const backgroundAssert = new BackgroundAssert();

          const response = await backgroundsClient.getBackgroundDetail(identifier);

          await backgroundAssert.success(response);

          const body: BackgroundDetail = await response.json();

          await backgroundAssert.validateBackgroundDetail(body, expectedBackground);
        },
      );
    }

    test(
      'Validate Background Detail by lowercase identifier',
      { tag: ['@data'] },
      async ({ request }) => {
        const backgroundsClient = new BackgroundsClient(request);
        const backgroundAssert = new BackgroundAssert();
        const expectedBackground = expectedDetailedBackgrounds.acolyte;

        const response = await backgroundsClient.getBackgroundDetail('acolyte');

        await backgroundAssert.success(response);

        const body: BackgroundDetail = await response.json();

        await backgroundAssert.validateBackgroundDetail(body, expectedBackground);
      },
    );

    test(
      'Validate Background Detail by uppercase identifier',
      { tag: ['@data'] },
      async ({ request }) => {
        const backgroundsClient = new BackgroundsClient(request);
        const backgroundAssert = new BackgroundAssert();
        const expectedBackground = expectedDetailedBackgrounds.soldier;

        const response = await backgroundsClient.getBackgroundDetail('SOLDIER');

        await backgroundAssert.success(response);

        const body: BackgroundDetail = await response.json();

        await backgroundAssert.validateBackgroundDetail(body, expectedBackground);
      },
    );

    test(
      'Validate Background Detail by invalid id',
      { tag: ['@negative', '@error'] },
      async ({ request }) => {
        const backgroundsClient = new BackgroundsClient(request);
        const backgroundAssert = new BackgroundAssert();

        const response = await backgroundsClient.getBackgroundDetail(9999);

        await backgroundAssert.notFound(response);

        const body: { error: string } = await response.json();

        await backgroundAssert.validateErrorResponse(
          body,
          'Background not found',
        );
      },
    );

    test(
      'Validate Background Detail by invalid identifier',
      { tag: ['@negative', '@error'] },
      async ({ request }) => {
        const backgroundsClient = new BackgroundsClient(request);
        const backgroundAssert = new BackgroundAssert();

        const response =
          await backgroundsClient.getBackgroundDetail('unknown-background');

        await backgroundAssert.notFound(response);

        const body: { error: string } = await response.json();

        await backgroundAssert.validateErrorResponse(
          body,
          'Background not found',
        );
      },
    );
  },
);
