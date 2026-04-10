import { test, expect } from '@playwright/test';

import { ClassDetail } from '@/app/types/class';
import { ClassesClient } from '../clients/classes.client';
import {
  expectedClassSubclasses,
  expectedDetailedClasses,
} from '../data/classes.expected';
import { ClassAssert } from '../helpers/classes.assertions';

test.describe('Classes API - Detail', { tag: ['@classes', '@detail'] }, () => {
  test('Validate Schema', { tag: ['@get', '@schema'] }, async ({ request }) => {
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
      { tag: ['@get', '@data'] },
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
      { tag: ['@get', '@data'] },
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

  for (const expectedClass of expectedClassSubclasses) {
    test(
      `Validate Class Subclasses - ${expectedClass.name}`,
      { tag: ['@get', '@data', '@subclasses'] },
      async ({ request }) => {
        const classesClient = new ClassesClient(request);
        const classAssert = new ClassAssert();

        const response = await classesClient.getClassDetail(expectedClass.id);

        await classAssert.success(response);

        const body: ClassDetail = await response.json();

        await classAssert.validateDetailSchema(body);
        await classAssert.validateId(body.id, expectedClass.id);
        await classAssert.validateName(body.name, expectedClass.name);
        await classAssert.validateSubclasses(
          body.subclasses,
          expectedClass.subclasses,
        );
      },
    );
  }

  for (const identifier of ['fighter', 'wizard', 'rogue', 'cleric'] as const) {
    test(
      `Validate Class Creation Fields Schema - ${identifier}`,
      { tag: ['@get', '@data', '@creation-fields'] },
      async ({ request }) => {
        const classesClient = new ClassesClient(request);
        const classAssert = new ClassAssert();

        const response = await classesClient.getClassDetail(identifier);

        await classAssert.success(response);

        const body: ClassDetail = await response.json();

        await classAssert.validateDetailSchema(body);
        await test.step('Validate new class creation fields exist', async () => {
          expect(body.skillProficiencyChoices).toBeTruthy();
          expect(Array.isArray(body.weaponProficiencies)).toBe(true);
          expect(Array.isArray(body.armorTraining)).toBe(true);
          expect(Array.isArray(body.startingEquipmentOptions)).toBe(true);
          expect(Array.isArray(body.equipmentOptions)).toBe(true);
        });
      },
    );
  }

  test(
    'Validate Class Detail by invalid id',
    { tag: ['@get', '@negative', '@error'] },
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
    { tag: ['@get', '@negative', '@error'] },
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
