import { APIRequestContext, expect, test } from '@playwright/test';

import { EquipmentClient } from '../clients/equipment.client';
import { expectedEquipmentListSamples, expectedEquipmentSamples } from '../data/equipment.expected';
import { EquipmentAssert } from '../helpers/equipment.assertions';
import {
  EquipmentDetail,
  EquipmentListItem,
} from '@/app/types/equipment';

test.describe('Equipment API', { tag: ['@equipment'] }, () => {
  async function getEquipmentDetailBySlug(
    request: APIRequestContext,
    slug: string,
  ) {
    const equipmentClient = new EquipmentClient(request);
    const equipmentAssert = new EquipmentAssert();

    const response = await equipmentClient.getEquipmentDetail(slug);
    await equipmentAssert.success(response);

    const equipment: EquipmentDetail = await response.json();

    await equipmentAssert.validateEquipmentDetailSchema(equipment);
    expect(equipment.details.kind).not.toBe('generic');

    return { equipment, equipmentAssert };
  }

  test(
    'List equipment',
    { tag: ['@get', '@smoke', '@data'] },
    async ({ request }) => {
      const equipmentClient = new EquipmentClient(request);
      const equipmentAssert = new EquipmentAssert();

      const response = await equipmentClient.getEquipment();

      await equipmentAssert.success(response);

      const equipment: EquipmentListItem[] = await response.json();

      await equipmentAssert.validateEquipmentListSchema(equipment);

      await test.step('Validate sample weapon and armor are present in list', async () => {
        expect(
          equipment.some((item) => item.name === expectedEquipmentListSamples[0].name),
        ).toBe(true);
        expect(
          equipment.some((item) => item.name === expectedEquipmentListSamples[1].name),
        ).toBe(true);
      });
    },
  );

  test(
    'Weapon simple melee light',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const { equipment, equipmentAssert } = await getEquipmentDetailBySlug(
        request,
        expectedEquipmentSamples.club.slug,
      );

      if (equipment.details.kind === 'weapon') {
        await equipmentAssert.validateWeaponDetailsSchema(equipment.details);
        expect(equipment.name).toBe(expectedEquipmentSamples.club.name);
        expect(equipment.details.attackType).toBe(
          expectedEquipmentSamples.club.attackType,
        );
        expect(equipment.details.versatileDamage).toBeNull();
        expect(equipment.details.range).toBeNull();
        expect(equipment.details.ammunitionType).toBeNull();
        expect(
          equipment.details.properties.map((property) => property.slug),
        ).toEqual(
          expect.arrayContaining(expectedEquipmentSamples.club.propertySlugs),
        );
      }
    },
  );

  test(
    'Weapon simple melee thrown',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const { equipment, equipmentAssert } = await getEquipmentDetailBySlug(
        request,
        expectedEquipmentSamples.dagger.slug,
      );

      if (equipment.details.kind === 'weapon') {
        await equipmentAssert.validateWeaponDetailsSchema(equipment.details);
        expect(equipment.name).toBe(expectedEquipmentSamples.dagger.name);
        expect(equipment.details.attackType).toBe(
          expectedEquipmentSamples.dagger.attackType,
        );
        expect(equipment.details.range).toBeNull();
        expect(equipment.details.ammunitionType).toBeNull();
        expect(
          equipment.details.properties.map((property) => property.slug),
        ).toEqual(
          expect.arrayContaining(expectedEquipmentSamples.dagger.propertySlugs),
        );

        const thrownProperty = equipment.details.properties.find(
          (property) => property.slug === 'thrown',
        );

        expect(thrownProperty?.range).toEqual(
          expectedEquipmentSamples.dagger.thrownRange,
        );
      }
    },
  );

  test(
    'Weapon simple melee versatile',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const { equipment, equipmentAssert } = await getEquipmentDetailBySlug(
        request,
        expectedEquipmentSamples.quarterstaff.slug,
      );

      if (equipment.details.kind === 'weapon') {
        await equipmentAssert.validateWeaponDetailsSchema(equipment.details);
        expect(equipment.details.versatileDamage).not.toBeNull();
        expect(equipment.details.range).toBeNull();

        const versatileProperty = equipment.details.properties.find(
          (property) => property.slug === 'versatile',
        );

        expect(versatileProperty?.damage).not.toBeNull();
      }
    },
  );

  test(
    'Weapon simple melee thrown versatile',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const { equipment, equipmentAssert } = await getEquipmentDetailBySlug(
        request,
        expectedEquipmentSamples.spear.slug,
      );

      if (equipment.details.kind === 'weapon') {
        await equipmentAssert.validateWeaponDetailsSchema(equipment.details);
        expect(equipment.name).toBe(expectedEquipmentSamples.spear.name);
        expect(equipment.details.attackType).toBe(
          expectedEquipmentSamples.spear.attackType,
        );
        expect(equipment.details.versatileDamage).not.toBeNull();
        expect(equipment.details.range).toBeNull();
        expect(equipment.details.ammunitionType).toBeNull();
        expect(equipment.details.proficiencyType).toBe(
          expectedEquipmentSamples.spear.proficiencyType,
        );
        expect(equipment.details.mastery.slug).toBe(
          expectedEquipmentSamples.spear.masterySlug,
        );
        expect(
          equipment.details.properties.map((property) => property.slug),
        ).toEqual(
          expect.arrayContaining(expectedEquipmentSamples.spear.propertySlugs),
        );

        const thrownProperty = equipment.details.properties.find(
          (property) => property.slug === 'thrown',
        );
        const versatileProperty = equipment.details.properties.find(
          (property) => property.slug === 'versatile',
        );

        expect(thrownProperty?.range).toEqual(
          expectedEquipmentSamples.spear.thrownRange,
        );
        expect(versatileProperty?.damage).not.toBeNull();
      }
    },
  );

  test(
    'Weapon simple ranged ammunition',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const { equipment, equipmentAssert } = await getEquipmentDetailBySlug(
        request,
        expectedEquipmentSamples.shortbow.slug,
      );

      if (equipment.details.kind === 'weapon') {
        await equipmentAssert.validateWeaponDetailsSchema(equipment.details);
        expect(equipment.details.attackType).toBe(
          expectedEquipmentSamples.shortbow.attackType,
        );
        expect(equipment.details.range).not.toBeNull();
        expect(equipment.details.ammunitionType).toBe(
          expectedEquipmentSamples.shortbow.ammunitionType,
        );

        const ammunitionProperty = equipment.details.properties.find(
          (property) => property.slug === 'ammunition',
        );

        expect(ammunitionProperty?.range).not.toBeNull();
        expect(ammunitionProperty?.ammunitionType).toBe(
          expectedEquipmentSamples.shortbow.ammunitionType,
        );
        expect(
          equipment.details.properties.map((property) => property.slug),
        ).toEqual(
          expect.arrayContaining(expectedEquipmentSamples.shortbow.propertySlugs),
        );
      }
    },
  );

  test(
    'Weapon simple ranged bullet',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const { equipment, equipmentAssert } = await getEquipmentDetailBySlug(
        request,
        expectedEquipmentSamples.sling.slug,
      );

      if (equipment.details.kind === 'weapon') {
        await equipmentAssert.validateWeaponDetailsSchema(equipment.details);
        expect(equipment.details.attackType).toBe(
          expectedEquipmentSamples.sling.attackType,
        );
        expect(equipment.details.ammunitionType).toBe(
          expectedEquipmentSamples.sling.ammunitionType,
        );
        expect(equipment.details.damage.damageType).toBe(
          expectedEquipmentSamples.sling.damageType,
        );
      }
    },
  );

  test(
    'Weapon martial melee heavy reach two-handed',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const { equipment, equipmentAssert } = await getEquipmentDetailBySlug(
        request,
        expectedEquipmentSamples.glaive.slug,
      );

      if (equipment.details.kind === 'weapon') {
        await equipmentAssert.validateWeaponDetailsSchema(equipment.details);
        expect(equipment.details.mastery.slug).toBe(
          expectedEquipmentSamples.glaive.masterySlug,
        );
        expect(
          equipment.details.properties.map((property) => property.slug),
        ).toEqual(
          expect.arrayContaining(expectedEquipmentSamples.glaive.propertySlugs),
        );
      }
    },
  );

  test(
    'Weapon martial melee finesse',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const { equipment, equipmentAssert } = await getEquipmentDetailBySlug(
        request,
        expectedEquipmentSamples.rapier.slug,
      );

      if (equipment.details.kind === 'weapon') {
        await equipmentAssert.validateWeaponDetailsSchema(equipment.details);
        expect(equipment.details.versatileDamage).toBeNull();
        expect(
          equipment.details.properties.map((property) => property.slug),
        ).toEqual(expectedEquipmentSamples.rapier.propertySlugs);
      }
    },
  );

  test(
    'Weapon martial melee conditional two-handed',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const { equipment, equipmentAssert } = await getEquipmentDetailBySlug(
        request,
        expectedEquipmentSamples.lance.slug,
      );

      if (equipment.details.kind === 'weapon') {
        await equipmentAssert.validateWeaponDetailsSchema(equipment.details);
        const twoHandedProperty = equipment.details.properties.find(
          (property) => property.slug === 'two-handed',
        );

        expect(
          equipment.details.properties.map((property) => property.slug),
        ).toEqual(
          expect.arrayContaining(expectedEquipmentSamples.lance.propertySlugs),
        );
        expect(twoHandedProperty?.note).toBe(
          expectedEquipmentSamples.lance.twoHandedNote,
        );
      }
    },
  );

  test(
    'Weapon martial ranged ammunition loading',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const { equipment, equipmentAssert } = await getEquipmentDetailBySlug(
        request,
        expectedEquipmentSamples.pistol.slug,
      );

      if (equipment.details.kind === 'weapon') {
        await equipmentAssert.validateWeaponDetailsSchema(equipment.details);
        expect(equipment.details.range).not.toBeNull();
        expect(equipment.details.ammunitionType).toBe(
          expectedEquipmentSamples.pistol.ammunitionType,
        );
        expect(
          equipment.details.properties.map((property) => property.slug),
        ).toEqual(
          expect.arrayContaining(expectedEquipmentSamples.pistol.propertySlugs),
        );
      }
    },
  );

  test(
    'Weapon martial ranged fixed damage',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const { equipment, equipmentAssert } = await getEquipmentDetailBySlug(
        request,
        expectedEquipmentSamples.blowgun.slug,
      );

      if (equipment.details.kind === 'weapon') {
        await equipmentAssert.validateWeaponDetailsSchema(equipment.details);
        expect(equipment.details.damage.formula).toBe(
          expectedEquipmentSamples.blowgun.damageFormula,
        );
        expect(equipment.details.damage.dice).toEqual([]);
        expect(equipment.details.damage.bonus).toBe(
          expectedEquipmentSamples.blowgun.damageBonus,
        );
        expect(equipment.details.ammunitionType).toBe(
          expectedEquipmentSamples.blowgun.ammunitionType,
        );
      }
    },
  );

  test(
    'Armor detail by slug',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const equipmentClient = new EquipmentClient(request);
      const equipmentAssert = new EquipmentAssert();

      const response = await equipmentClient.getEquipmentDetail(
        expectedEquipmentSamples.chainMail.slug,
      );

      await equipmentAssert.success(response);

      const equipment: EquipmentDetail = await response.json();

      await equipmentAssert.validateEquipmentDetailSchema(equipment);
      expect(equipment.details.kind).toBe('armor');

      if (equipment.details.kind === 'armor') {
        await equipmentAssert.validateArmorDetailsSchema(equipment.details);
        expect(equipment.name).toBe(expectedEquipmentSamples.chainMail.name);
        expect(equipment.details.strengthRequirement).toBe(
          expectedEquipmentSamples.chainMail.strengthRequirement,
        );
        expect(equipment.details.stealthDisadvantage).toBe(
          expectedEquipmentSamples.chainMail.stealthDisadvantage,
        );
      }
    },
  );

  test(
    'Shield detail by slug',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const equipmentClient = new EquipmentClient(request);
      const equipmentAssert = new EquipmentAssert();

      const response = await equipmentClient.getEquipmentDetail(
        expectedEquipmentSamples.shield.slug,
      );

      await equipmentAssert.success(response);

      const equipment: EquipmentDetail = await response.json();

      await equipmentAssert.validateEquipmentDetailSchema(equipment);
      expect(equipment.details.kind).toBe('shield');

      if (equipment.details.kind === 'shield') {
        await equipmentAssert.validateShieldDetailsSchema(equipment.details);
        expect(equipment.details.trainingType).toBe(
          expectedEquipmentSamples.shield.trainingType,
        );
        expect(equipment.details.armorClassBonus).toBe(
          expectedEquipmentSamples.shield.armorClassBonus,
        );
      }
    },
  );

  test(
    'Generic detail by slug',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const equipmentClient = new EquipmentClient(request);
      const equipmentAssert = new EquipmentAssert();

      const response = await equipmentClient.getEquipmentDetail(
        expectedEquipmentSamples.thievesTools.slug,
      );

      await equipmentAssert.success(response);

      const equipment: EquipmentDetail = await response.json();

      await equipmentAssert.validateEquipmentDetailSchema(equipment);
      expect(equipment.name).toBe(expectedEquipmentSamples.thievesTools.name);
      expect(equipment.details.kind).toBe('generic');

      if (equipment.details.kind === 'generic') {
        await equipmentAssert.validateGenericDetailsSchema(equipment.details);
      }
    },
  );

  test(
    'Lookup by id and by name',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const equipmentClient = new EquipmentClient(request);
      const equipmentAssert = new EquipmentAssert();

      const slugResponse = await equipmentClient.getEquipmentDetail(
        expectedEquipmentSamples.shield.slug,
      );

      await equipmentAssert.success(slugResponse);

      const bySlug: EquipmentDetail = await slugResponse.json();

      const idResponse = await equipmentClient.getEquipmentDetail(bySlug.id);
      await equipmentAssert.success(idResponse);
      const byId: EquipmentDetail = await idResponse.json();

      const nameResponse = await equipmentClient.getEquipmentDetail(bySlug.name);
      await equipmentAssert.success(nameResponse);
      const byName: EquipmentDetail = await nameResponse.json();

      await equipmentAssert.validateEquipmentDetailSchema(bySlug);
      await equipmentAssert.validateEquipmentDetailSchema(byId);
      await equipmentAssert.validateEquipmentDetailSchema(byName);

      await test.step('Validate lookup returns the same item for slug, id and name', async () => {
        expect(byId).toEqual(bySlug);
        expect(byName).toEqual(bySlug);
      });
    },
  );

  test(
    'Equipment not found',
    { tag: ['@get', '@negative', '@error'] },
    async ({ request }) => {
      const equipmentClient = new EquipmentClient(request);
      const equipmentAssert = new EquipmentAssert();

      const response = await equipmentClient.getEquipmentDetail(999999);

      await equipmentAssert.notFound(response);

      const body: { error: string } = await response.json();

      await equipmentAssert.validateErrorResponse(body, 'Equipment not found');
    },
  );
});
