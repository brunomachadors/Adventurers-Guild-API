import {
  CharacterAbilityModifiers,
  CharacterArmorClass,
  CharacterArmorClassSource,
} from '@/app/types/character';
import { EquipmentArmorDetails, EquipmentShieldDetails } from '@/app/types/equipment';
import { getSql } from './db';

type EquippedArmorItem = {
  name: string;
  details: EquipmentArmorDetails;
};

type EquippedShieldItem = {
  name: string;
  details: EquipmentShieldDetails;
};

function parseJsonValue(value: unknown): unknown {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return value;
}

function parseArmorDetails(value: unknown): EquipmentArmorDetails | null {
  const details = parseJsonValue(value);

  if (typeof details !== 'object' || details === null || Array.isArray(details)) {
    return null;
  }

  const armor = details as Record<string, unknown>;
  const armorClass = armor.armorClass as Record<string, unknown> | undefined;
  const dexModifier = armorClass?.dexModifier as
    | Record<string, unknown>
    | undefined;

  if (
    armor.kind !== 'armor' ||
    typeof armor.armorType !== 'string' ||
    typeof armor.trainingType !== 'string' ||
    typeof armorClass?.base !== 'number' ||
    typeof dexModifier?.applies !== 'boolean' ||
    (dexModifier.max !== null &&
      dexModifier.max !== undefined &&
      typeof dexModifier.max !== 'number') ||
    (armor.strengthRequirement !== null &&
      armor.strengthRequirement !== undefined &&
      typeof armor.strengthRequirement !== 'number') ||
    typeof armor.stealthDisadvantage !== 'boolean' ||
    typeof armor.donTime !== 'string' ||
    typeof armor.doffTime !== 'string'
  ) {
    return null;
  }

  return {
    kind: 'armor',
    armorType: armor.armorType,
    trainingType: armor.trainingType,
    armorClass: {
      base: armorClass.base,
      dexModifier: {
        applies: dexModifier.applies,
        max: dexModifier.max === undefined ? null : (dexModifier.max as number | null),
      },
    },
    strengthRequirement:
      armor.strengthRequirement === undefined
        ? null
        : (armor.strengthRequirement as number | null),
    stealthDisadvantage: armor.stealthDisadvantage,
    donTime: armor.donTime,
    doffTime: armor.doffTime,
  };
}

function parseShieldDetails(value: unknown): EquipmentShieldDetails | null {
  const details = parseJsonValue(value);

  if (typeof details !== 'object' || details === null || Array.isArray(details)) {
    return null;
  }

  const shield = details as Record<string, unknown>;

  if (
    shield.kind !== 'shield' ||
    typeof shield.trainingType !== 'string' ||
    typeof shield.armorClassBonus !== 'number' ||
    typeof shield.donTime !== 'string' ||
    typeof shield.doffTime !== 'string'
  ) {
    return null;
  }

  return {
    kind: 'shield',
    trainingType: shield.trainingType,
    armorClassBonus: shield.armorClassBonus,
    donTime: shield.donTime,
    doffTime: shield.doffTime,
  };
}

function getDexModifierApplied(
  dexModifier: number,
  armor: EquippedArmorItem | null,
): number {
  if (!armor) {
    return dexModifier;
  }

  const { applies, max } = armor.details.armorClass.dexModifier;

  if (!applies) {
    return 0;
  }

  return max === null ? dexModifier : Math.min(dexModifier, max);
}

function getClassArmorBonus(
  classSlug: string | null,
  equippedArmor: EquippedArmorItem | null,
  equippedShield: EquippedShieldItem | null,
  abilityModifiers: CharacterAbilityModifiers | null,
): number {
  if (equippedArmor) {
    return 0;
  }

  if (classSlug === 'barbarian') {
    return abilityModifiers?.CON ?? 0;
  }

  if (classSlug === 'monk' && !equippedShield) {
    return abilityModifiers?.WIS ?? 0;
  }

  return 0;
}

export async function getCharacterArmorClass(
  characterId: number,
  classDetails: {
    slug: string;
  } | null,
  abilityModifiers: CharacterAbilityModifiers | null,
): Promise<CharacterArmorClass> {
  const sql = getSql();
  const equipmentRows = await sql`
    SELECT equipment.name, equipment.details
    FROM characterequipment
    INNER JOIN equipment ON equipment.id = characterequipment.equipmentid
    WHERE characterequipment.characterid = ${characterId}
      AND characterequipment.isequipped = true
    ORDER BY characterequipment.id
  `;

  const equippedArmor = equipmentRows.reduce<EquippedArmorItem | null>(
    (selectedArmor, item) => {
      if (selectedArmor) {
        return selectedArmor;
      }

      const details = parseArmorDetails(item.details);

      return details ? { name: item.name, details } : null;
    },
    null,
  );

  const equippedShield = equipmentRows.reduce<EquippedShieldItem | null>(
    (selectedShield, item) => {
      if (selectedShield) {
        return selectedShield;
      }

      const details = parseShieldDetails(item.details);

      return details ? { name: item.name, details } : null;
    },
    null,
  );

  const dexModifier = abilityModifiers?.DEX ?? 0;
  const base = equippedArmor?.details.armorClass.base ?? 10;
  const dexModifierApplied = getDexModifierApplied(dexModifier, equippedArmor);
  const classBonus = getClassArmorBonus(
    classDetails?.slug ?? null,
    equippedArmor,
    equippedShield,
    abilityModifiers,
  );
  const shieldBonus = equippedShield?.details.armorClassBonus ?? 0;
  const sources: CharacterArmorClassSource[] = equippedArmor
    ? [
        {
          name: equippedArmor.name,
          type: 'armor',
          value: equippedArmor.details.armorClass.base,
        },
      ]
    : [{ name: 'Base AC', type: 'base', value: 10 }];

  if (equippedShield) {
    sources.push({
      name: equippedShield.name,
      type: 'shield',
      value: equippedShield.details.armorClassBonus,
    });
  }

  if (classBonus !== 0) {
    sources.push({
      name: 'Unarmored Defense',
      type: 'class',
      value: classBonus,
    });
  }

  return {
    total: base + dexModifierApplied + classBonus + shieldBonus,
    base,
    dexModifierApplied,
    classBonus,
    shieldBonus,
    sources,
  };
}
