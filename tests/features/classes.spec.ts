import { test } from '@playwright/test';

import { ClassAssert } from '../helpers/classes.assertions';
import { expectedClassesList } from '../data/classes.expected';
import { ClassListItem } from '@/app/types/class';
import { ClassesClient } from '../clients/classes.client';

test.describe('Classes API', { tag: ['@classes'] }, () => {
  test('Validate Schema', { tag: ['@get', '@schema'] }, async ({ request }) => {
    const classesClient = new ClassesClient(request);
    const classAssert = new ClassAssert();
    const response = await classesClient.getClasses();
    await classAssert.success(response);
    const body: ClassListItem[] = await response.json();
    await classAssert.validateSchema(body);
  });

  for (const expectedClass of expectedClassesList) {
    test(
      `Validate Class ${expectedClass.name}`,
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const classesClient = new ClassesClient(request);
        const classAssert = new ClassAssert();
        const response = await classesClient.getClasses();
        await classAssert.success(response);
        const body: ClassListItem[] = await response.json();
        await classAssert.validateClassInList(body, expectedClass);
      },
    );
  }
});
