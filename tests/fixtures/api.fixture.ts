/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from '@playwright/test';
import { AttributesClient } from '../clients/attributes.client';
import { SkillClient } from '../clients/skills.client';
import { Assert as AttributeAssert } from '../helpers/attribute.assertions';
import { SkillAssert } from '../helpers/skill.assertions';

type ApiFixtures = {
  attributesClient: AttributesClient;
  skillsClient: SkillClient;
  attributeAssert: AttributeAssert;
  skillAssert: SkillAssert;
};

export const test = base.extend<ApiFixtures>({
  attributesClient: async ({ request }, useFixture) => {
    await useFixture(new AttributesClient(request));
  },

  skillsClient: async ({ request }, useFixture) => {
    await useFixture(new SkillClient(request));
  },

  attributeAssert: async ({}, useFixture) => {
    await useFixture(new AttributeAssert());
  },

  skillAssert: async ({}, useFixture) => {
    await useFixture(new SkillAssert());
  },
});

export { expect } from '@playwright/test';
