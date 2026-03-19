import { SkillDetail, SkillListItem } from '@/app/types/skill';
import { test, expect } from '@playwright/test';

export class SkillAssert {
  async success(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 200', async () => {
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
    });
  }

  async validateSchema(skillList: SkillListItem[]) {
    await test.step('Should validate skills list is not empty', async () => {
      expect(skillList).toBeTruthy();
      expect(Array.isArray(skillList)).toBe(true);
      expect(skillList.length).toBeGreaterThan(0);
    });

    for (const skill of skillList) {
      await test.step(`Validate schema for ${skill.name}`, async () => {
        expect(skill).toHaveProperty('id');
        expect(skill).toHaveProperty('name');

        expect(typeof skill.id).toBe('number');
        expect(typeof skill.name).toBe('string');
      });
    }
  }

  async validateDetailSchema(skill: SkillDetail) {
    await test.step(`Validate detail schema for ${skill.name}`, async () => {
      expect(skill).toHaveProperty('id');
      expect(skill).toHaveProperty('name');
      expect(skill).toHaveProperty('attribute');
      expect(skill).toHaveProperty('description');
      expect(skill).toHaveProperty('exampleOfUse');
      expect(skill).toHaveProperty('commonClasses');

      expect(typeof skill.id).toBe('number');
      expect(typeof skill.name).toBe('string');
      expect(typeof skill.attribute).toBe('string');
      expect(typeof skill.description).toBe('string');
      expect(typeof skill.exampleOfUse).toBe('string');
      expect(Array.isArray(skill.commonClasses)).toBe(true);
    });
  }

  findSkillById(skillList: SkillListItem[], expectedId: number): SkillListItem {
    const skill = skillList.find((item) => item.id === expectedId);

    if (!skill) {
      throw new Error(`Skill with id ${expectedId} not found`);
    }

    return skill;
  }

  async validateId(id: number, expectedId: number) {
    await test.step('Validate ID', async () => {
      expect(id).toBe(expectedId);
    });
  }

  async validateName(name: string, expectedName: string) {
    await test.step('Validate Name', async () => {
      expect(name).toBe(expectedName);
    });
  }

  async validateAttribute(attribute: string, expectedAttribute: string) {
    await test.step('Validate Attribute', async () => {
      expect(attribute).toBe(expectedAttribute);
    });
  }

  async validateDescription(description: string, expectedDescription: string) {
    await test.step('Validate Description', async () => {
      expect(description).toBe(expectedDescription);
    });
  }

  async validateExampleOfUse(
    exampleOfUse: string,
    expectedExampleOfUse: string,
  ) {
    await test.step('Validate Example Of Use', async () => {
      expect(exampleOfUse).toBe(expectedExampleOfUse);
    });
  }

  async validateCommonClasses(
    commonClasses: string[],
    expectedCommonClasses: string[],
  ) {
    await test.step('Validate Common Classes', async () => {
      expect(commonClasses).toEqual(expectedCommonClasses);
    });
  }

  async validateSkillInList(
    skillList: SkillListItem[],
    expectedSkill: SkillListItem,
  ) {
    const skill = this.findSkillById(skillList, expectedSkill.id);
    await this.validateId(skill.id, expectedSkill.id);
    await this.validateName(skill.name, expectedSkill.name);
  }

  async validateSkillDetail(
    actualSkill: SkillDetail,
    expectedSkill: SkillDetail,
  ) {
    await this.validateDetailSchema(actualSkill);
    await this.validateId(actualSkill.id, expectedSkill.id);
    await this.validateName(actualSkill.name, expectedSkill.name);
    await this.validateAttribute(
      actualSkill.attribute,
      expectedSkill.attribute,
    );
    await this.validateDescription(
      actualSkill.description,
      expectedSkill.description,
    );
    await this.validateExampleOfUse(
      actualSkill.exampleOfUse,
      expectedSkill.exampleOfUse,
    );
    await this.validateCommonClasses(
      actualSkill.commonClasses,
      expectedSkill.commonClasses,
    );
  }
}
