import { test } from '@playwright/test';
import { SkillClient } from '../clients/skills.client';
import { SkillAssert } from '../helpers/skill.assertions';
import { SkillDetail, SkillListItem } from '@/app/types/skill';
import {
  expectedDetailedSkills,
  expectedSkillsList,
} from '../data/skills.expected';

test.describe('Skills API - List', { tag: ['@skills', '@list'] }, () => {
  test('Validate Schema', { tag: ['@get', '@schema'] }, async ({ request }) => {
    const skillsClient = new SkillClient(request);
    const skillAssert = new SkillAssert();
    const response = await skillsClient.getSkills();
    await skillAssert.success(response);
    const body: SkillListItem[] = await response.json();
    await skillAssert.validateSchema(body);
  });

  for (const expectedSkill of expectedSkillsList) {
    test(
      `Validate Skill ${expectedSkill.name}`,
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const skillsClient = new SkillClient(request);
        const skillAssert = new SkillAssert();
        const response = await skillsClient.getSkills();
        await skillAssert.success(response);
        const body: SkillListItem[] = await response.json();
        await skillAssert.validateSkillInList(body, expectedSkill);
      },
    );
  }
});

test.describe('Skills API - Detail', { tag: ['@skills', '@detail'] }, () => {
  for (const [identifier, expectedSkill] of Object.entries(
    expectedDetailedSkills,
  )) {
    test(
      `Validate Skill Detail by id - ${expectedSkill.name}`,
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const skillsClient = new SkillClient(request);
        const skillAssert = new SkillAssert();

        const response = await skillsClient.getSkillDetail(expectedSkill.id);

        await skillAssert.success(response);

        const body: SkillDetail = await response.json();

        await skillAssert.validateSkillDetail(body, expectedSkill);
      },
    );

    test(
      `Validate Skill Detail by name - ${expectedSkill.name}`,
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const skillsClient = new SkillClient(request);
        const skillAssert = new SkillAssert();

        const response = await skillsClient.getSkillDetail(identifier);

        await skillAssert.success(response);

        const body: SkillDetail = await response.json();

        await skillAssert.validateSkillDetail(body, expectedSkill);
      },
    );
  }
});
