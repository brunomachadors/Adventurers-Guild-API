import { test } from '@playwright/test';

import { ClassDetail } from '@/app/types/class';
import { ClassesClient } from '../clients/classes.client';
import { expectedDetailedClasses } from '../data/classes.expected';
import { ClassAssert } from '../helpers/classes.assertions';

test.describe('Classes API - Detail', { tag: ['@classes', '@detail'] }, () => {
  test('Validate Schema', { tag: ['@schema'] }, async ({ request }) => {
    const classesClient = new ClassesClient(request);
    const classAssert = new ClassAssert();

    const firstExpectedClass = Object.values(expectedDetailedClasses)[0];
    const response = await classesClient.getClassDetail(firstExpectedClass.id);

    await classAssert.success(response);

    const body: ClassDetail = await response.json();

    await classAssert.validateDetailSchema(body);
  });

  for (const [identifier, expectedClass] of Object.entries(
    expectedDetailedClasses,
  )) {
    test(
      `Validate Class Detail by id - ${expectedClass.name}`,
      { tag: ['@data'] },
      async ({ request }) => {
        const classesClient = new ClassesClient(request);
        const classAssert = new ClassAssert();

        const response = await classesClient.getClassDetail(expectedClass.id);

        await classAssert.success(response);

        const body: ClassDetail = await response.json();

        await classAssert.validateClassDetail(body, expectedClass);
      },
    );

    test(
      `Validate Class Detail by name - ${expectedClass.name}`,
      { tag: ['@data'] },
      async ({ request }) => {
        const classesClient = new ClassesClient(request);
        const classAssert = new ClassAssert();

        const response = await classesClient.getClassDetail(identifier);

        await classAssert.success(response);

        const body: ClassDetail = await response.json();

        await classAssert.validateClassDetail(body, expectedClass);
      },
    );
  }

  test(
    'Validate Class Detail by invalid id',
    { tag: ['@negative', '@error'] },
    async ({ request }) => {
      const classesClient = new ClassesClient(request);
      const classAssert = new ClassAssert();

      const response = await classesClient.getClassDetail(9999);

      await classAssert.notFound(response);

      const body: { error: string } = await response.json();

      await classAssert.validateErrorResponse(body, 'Class not found');
    },
  );

  test(
    'Validate Class Detail by invalid name',
    { tag: ['@negative', '@error'] },
    async ({ request }) => {
      const classesClient = new ClassesClient(request);
      const classAssert = new ClassAssert();

      const response = await classesClient.getClassDetail('necromancer');

      await classAssert.notFound(response);

      const body: { error: string } = await response.json();

      await classAssert.validateErrorResponse(body, 'Class not found');
    },
  );
});
