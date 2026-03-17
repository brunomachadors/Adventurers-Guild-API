import { test } from './fixtures/api.fixture';
import { SkillDetail, SkillListItem } from '@/app/types/skill';
import {
  expectedDetailedSkills,
  expectedSkillsList,
} from './data/skills.expected';

test.describe('Skills API - List', () => {
  test('Validate Schema', async ({ skillsClient, skillAssert }) => {
    const response = await skillsClient.getSkills();

    await skillAssert.success(response);

    const body: SkillListItem[] = await response.json();

    await skillAssert.validateSchema(body);
  });

  for (const expectedSkill of expectedSkillsList) {
    test(`Validate Skill ${expectedSkill.name}`, async ({
      skillsClient,
      skillAssert,
    }) => {
      const response = await skillsClient.getSkills();

      await skillAssert.success(response);

      const body: SkillListItem[] = await response.json();

      await skillAssert.validateSkillInList(body, expectedSkill);
    });
  }
});

test.describe('Skills API - Detail', () => {
  for (const [identifier, expectedSkill] of Object.entries(
    expectedDetailedSkills,
  )) {
    test(`Validate Skill Detail by id - ${expectedSkill.name}`, async ({
      skillsClient,
      skillAssert,
    }) => {
      const response = await skillsClient.getSkillDetail(expectedSkill.id);

      await skillAssert.success(response);

      const body: SkillDetail = await response.json();

      await skillAssert.validateSkillDetail(body, expectedSkill);
    });

    test(`Validate Skill Detail by name - ${expectedSkill.name}`, async ({
      skillsClient,
      skillAssert,
    }) => {
      const response = await skillsClient.getSkillDetail(identifier);

      await skillAssert.success(response);

      const body: SkillDetail = await response.json();

      await skillAssert.validateSkillDetail(body, expectedSkill);
    });
  }
});
