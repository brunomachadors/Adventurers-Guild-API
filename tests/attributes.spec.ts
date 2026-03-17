import { test } from '@playwright/test';
import { AttributesClient } from './clients/attributes.client';
import { Assert } from './helpers/attribute.assertions';
import { expectedAttributes } from './data/attributes.expected';
import { Attribute } from '@/app/types/attribute';

test('Validate attributes schema', async ({ request }) => {
  const attributesClient = new AttributesClient(request);
  const assert = new Assert();

  const response = await attributesClient.getAll();
  await assert.success(response);
  const body: Attribute[] = await response.json();
  await assert.validateSchema(body);
});

for (const expectedAttribute of expectedAttributes) {
  test(`Validate ${expectedAttribute.shortName}`, async ({ request }) => {
    const attributesClient = new AttributesClient(request);
    const assert = new Assert();

    const response = await attributesClient.getAll();
    await assert.success(response);
    const body: Attribute[] = await response.json();
    const attribute = body.find(
      (attr) => attr.shortName === expectedAttribute.shortName,
    )!;
    await assert.validateId(attribute.id, expectedAttribute.id);
    await assert.validateName(attribute.name, expectedAttribute.name);
    await assert.validateShortName(
      attribute.shortName,
      expectedAttribute.shortName,
    );
    await assert.validateDescription(
      attribute.description,
      expectedAttribute.description,
    );
    await assert.validateSkills(attribute.skills, expectedAttribute.skills);
  });
}
