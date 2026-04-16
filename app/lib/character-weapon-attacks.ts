import {
  CharacterAbilityModifiers,
  CharacterWeaponAttack,
} from '@/app/types/character';
import {
  EquipmentDamage,
  EquipmentMastery,
  EquipmentProperty,
  EquipmentRange,
  EquipmentWeaponDetails,
} from '@/app/types/equipment';
import { Attributeshortname } from '@/app/types/attribute';
import { getSql } from './db';

type EquippedWeaponItem = {
  id: number;
  name: string;
  details: EquipmentWeaponDetails;
};

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function getProficiencyBonus(level: number): number {
  if (level >= 17) {
    return 6;
  }

  if (level >= 13) {
    return 5;
  }

  if (level >= 9) {
    return 4;
  }

  if (level >= 5) {
    return 3;
  }

  return 2;
}

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

function parseEquipmentRange(value: unknown): EquipmentRange | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const range = value as Record<string, unknown>;

  if (
    (range.normal !== null && typeof range.normal !== 'number') ||
    (range.long !== null && typeof range.long !== 'number') ||
    range.unit !== 'ft'
  ) {
    return null;
  }

  return {
    normal: range.normal as number | null,
    long: range.long as number | null,
    unit: 'ft',
  };
}

function parseEquipmentDamage(value: unknown): EquipmentDamage | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const damage = value as Record<string, unknown>;

  if (
    typeof damage.formula !== 'string' ||
    typeof damage.bonus !== 'number' ||
    typeof damage.damageType !== 'string' ||
    !Array.isArray(damage.dice)
  ) {
    return null;
  }

  const dice = damage.dice
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
        return null;
      }

      const die = entry as Record<string, unknown>;

      return typeof die.count === 'number' && typeof die.value === 'number'
        ? { count: die.count, value: die.value }
        : null;
    })
    .filter((entry): entry is EquipmentDamage['dice'][number] => entry !== null);

  if (dice.length !== damage.dice.length) {
    return null;
  }

  return {
    formula: damage.formula,
    dice,
    bonus: damage.bonus,
    damageType: damage.damageType,
  };
}

function parseEquipmentProperty(value: unknown): EquipmentProperty | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const property = value as Record<string, unknown>;

  if (typeof property.name !== 'string' || typeof property.slug !== 'string') {
    return null;
  }

  const range =
    property.range === undefined ? undefined : parseEquipmentRange(property.range);
  const damage =
    property.damage === undefined
      ? undefined
      : parseEquipmentDamage(property.damage);

  if (property.range !== undefined && range === null) {
    return null;
  }

  if (property.damage !== undefined && damage === null) {
    return null;
  }

  return {
    name: property.name,
    slug: property.slug,
    range: range ?? undefined,
    ammunitionType:
      property.ammunitionType === undefined
        ? undefined
        : (property.ammunitionType as string | null),
    damage: damage ?? undefined,
    note:
      property.note === undefined ? undefined : (property.note as string | null),
  };
}

function parseEquipmentMastery(value: unknown): EquipmentMastery | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const mastery = value as Record<string, unknown>;

  if (typeof mastery.name !== 'string' || typeof mastery.slug !== 'string') {
    return null;
  }

  return {
    name: mastery.name,
    slug: mastery.slug,
  };
}

function parseWeaponDetails(value: unknown): EquipmentWeaponDetails | null {
  const parsedValue = parseJsonValue(value);

  if (
    typeof parsedValue !== 'object' ||
    parsedValue === null ||
    Array.isArray(parsedValue)
  ) {
    return null;
  }

  const details = parsedValue as Record<string, unknown>;

  if (
    details.kind !== 'weapon' ||
    typeof details.weaponCategory !== 'string' ||
    typeof details.attackType !== 'string' ||
    typeof details.proficiencyType !== 'string' ||
    !Array.isArray(details.properties)
  ) {
    return null;
  }

  const damage = parseEquipmentDamage(details.damage);
  const versatileDamage =
    details.versatileDamage === null
      ? null
      : parseEquipmentDamage(details.versatileDamage);
  const range =
    details.range === null ? null : parseEquipmentRange(details.range);
  const mastery = parseEquipmentMastery(details.mastery);
  const properties = details.properties
    .map(parseEquipmentProperty)
    .filter((property): property is EquipmentProperty => property !== null);

  if (
    damage === null ||
    versatileDamage === undefined ||
    range === undefined ||
    mastery === null ||
    properties.length !== details.properties.length
  ) {
    return null;
  }

  return {
    kind: 'weapon',
    weaponCategory: details.weaponCategory,
    attackType: details.attackType,
    damage,
    versatileDamage,
    properties,
    mastery,
    range,
    proficiencyType: details.proficiencyType,
    ammunitionType:
      details.ammunitionType === undefined
        ? null
        : (details.ammunitionType as string | null),
  };
}

function getClassWeaponProficiencies(classSlug: string | null): Set<string> {
  const simpleAndMartial = new Set([
    'barbarian',
    'fighter',
    'paladin',
    'ranger',
  ]);

  if (classSlug && simpleAndMartial.has(classSlug)) {
    return new Set(['Simple Weapons', 'Martial Weapons']);
  }

  if (classSlug) {
    return new Set(['Simple Weapons']);
  }

  return new Set();
}

function getAttackAbility(attackType: string): Attributeshortname {
  return attackType.toLowerCase() === 'ranged' ? 'DEX' : 'STR';
}

function formatDamageFormula(baseFormula: string, modifier: number): string {
  if (modifier === 0) {
    return baseFormula;
  }

  return modifier > 0
    ? `${baseFormula} + ${modifier}`
    : `${baseFormula} - ${Math.abs(modifier)}`;
}

function formatWeaponAttack(
  weapon: EquippedWeaponItem,
  classSlug: string | null,
  abilityModifiers: CharacterAbilityModifiers | null,
  proficiencyBonus: number,
): CharacterWeaponAttack {
  const ability = getAttackAbility(weapon.details.attackType);
  const abilityModifier = abilityModifiers?.[ability] ?? 0;
  const weaponProficiencies = getClassWeaponProficiencies(classSlug);
  const isProficient = weaponProficiencies.has(weapon.details.proficiencyType);
  const appliedProficiencyBonus = isProficient ? proficiencyBonus : 0;

  return {
    equipmentId: weapon.id,
    name: weapon.name,
    attackType: weapon.details.attackType.toLowerCase(),
    ability,
    isProficient,
    abilityModifier,
    proficiencyBonus: appliedProficiencyBonus,
    attackBonus: abilityModifier + appliedProficiencyBonus,
    damage: {
      formula: formatDamageFormula(
        weapon.details.damage.formula,
        abilityModifier,
      ),
      base: weapon.details.damage.formula,
      modifier: abilityModifier,
      damageType: weapon.details.damage.damageType,
    },
    properties: weapon.details.properties.map((property) => property.name),
    mastery: weapon.details.mastery,
    range: weapon.details.range,
  };
}

export async function getCharacterWeaponAttacks(
  characterId: number,
  characterLevel: number,
  classSlug: string | null,
  abilityModifiers: CharacterAbilityModifiers | null,
): Promise<CharacterWeaponAttack[]> {
  const sql = getSql();
  const equipmentRows = await sql`
    SELECT equipment.id, equipment.name, equipment.details
    FROM characterequipment
    INNER JOIN equipment ON equipment.id = characterequipment.equipmentid
    WHERE characterequipment.characterid = ${characterId}
      AND characterequipment.isequipped = true
    ORDER BY characterequipment.id
  `;

  const proficiencyBonus = getProficiencyBonus(characterLevel);

  return equipmentRows
    .map((item) => {
      const details = parseWeaponDetails(item.details);

      return details
        ? {
            id: toNumber(item.id),
            name: item.name,
            details,
          }
        : null;
    })
    .filter((item): item is EquippedWeaponItem => item !== null)
    .map((weapon) =>
      formatWeaponAttack(
        weapon,
        classSlug,
        abilityModifiers,
        proficiencyBonus,
      ),
    );
}
