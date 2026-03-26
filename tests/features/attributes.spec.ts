import { test } from '@playwright/test';
import { AttributesClient } from '../clients/attributes.client';
import { Assert } from '../helpers/attribute.assertions';
import { expectedAttributes } from '../data/attributes.expected';
import { Attribute } from '@/app/types/attribute';

test(
  'Validate attributes schema',
  { tag: ['@get', '@attributes', '@schema'] },
  async ({ request }) => {
    const attributesClient = new AttributesClient(request);
    const assert = new Assert();

    const response = await attributesClient.getAll();

    await assert.success(response);

    const body: Attribute[] = await response.json();

    await assert.validateSchema(body);
  },
);

for (const expectedAttribute of expectedAttributes) {
  test(
    `Validate ${expectedAttribute.shortname}`,
    { tag: ['@get', '@attributes', '@data'] },
    async ({ request }) => {
      const attributesClient = new AttributesClient(request);
      const assert = new Assert();

      const response = await attributesClient.getAll();

      await assert.success(response);

      const body: Attribute[] = await response.json();

      const attribute = body.find(
        (attr) => attr.shortname === expectedAttribute.shortname,
      )!;

      await assert.validateId(attribute.id, expectedAttribute.id);
      await assert.validateName(attribute.name, expectedAttribute.name);
      await assert.validateshortname(
        attribute.shortname,
        expectedAttribute.shortname,
      );
      await assert.validateDescription(
        attribute.description,
        expectedAttribute.description,
      );
      await assert.validateSkills(attribute.skills, expectedAttribute.skills);
    },
  );
}
