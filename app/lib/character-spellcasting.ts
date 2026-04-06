import {
  CharacterAbilityModifiers,
  CharacterClassDetails,
  CharacterSelectedSpellDetail,
  CharacterSpellcastingSummary,
  CharacterSpellSelectionType,
  CharacterSpellSlot,
} from '@/app/types/character';
import { Attributeshortname } from '@/app/types/attribute';
import { getSql } from './db';

type SpellcastingConfig = {
  ability?: unknown;
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

function isAttributeShortName(value: unknown): value is Attributeshortname {
  return (
    value === 'STR' ||
    value === 'DEX' ||
    value === 'CON' ||
    value === 'INT' ||
    value === 'WIS' ||
    value === 'CHA'
  );
}

function parseSpellcastingConfig(value: unknown): SpellcastingConfig | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  return value as SpellcastingConfig;
}

function getSpellcastingAbility(
  classDetails: CharacterClassDetails | null,
): Attributeshortname | null {
  const config = parseSpellcastingConfig(classDetails?.spellcasting);

  return isAttributeShortName(config?.ability) ? config.ability : null;
}

function isCharacterSpellSelectionType(
  value: unknown,
): value is CharacterSpellSelectionType {
  return value === 'known' || value === 'prepared' || value === 'cantrip';
}

function getComponents(spell: {
  verbal: boolean;
  somatic: boolean;
  material: boolean;
}): string[] {
  const components: string[] = [];

  if (spell.verbal) {
    components.push('V');
  }

  if (spell.somatic) {
    components.push('S');
  }

  if (spell.material) {
    components.push('M');
  }

  return components;
}

export async function getCharacterSelectedSpellDetails(
  characterId: number,
): Promise<CharacterSelectedSpellDetail[]> {
  const sql = getSql();
  const spellRows = await sql`
    SELECT
      spells.id,
      spells.name,
      spells.slug,
      spells.level,
      spells.levellabel,
      spells.school,
      spells.castingtime,
      spells.range,
      spells.verbal,
      spells.somatic,
      spells.material,
      spells.duration,
      characterspells.selectiontype
    FROM characterspells
    INNER JOIN spells ON spells.id = characterspells.spellid
    WHERE characterspells.characterid = ${characterId}
    ORDER BY spells.level, spells.id
  `;

  return spellRows
    .filter((spell) => isCharacterSpellSelectionType(spell.selectiontype))
    .map((spell) => ({
      id: toNumber(spell.id),
      name: spell.name,
      slug: spell.slug,
      level: toNumber(spell.level),
      levelLabel: spell.levellabel,
      school: spell.school,
      castingTime: spell.castingtime,
      range: spell.range,
      components: getComponents({
        verbal: Boolean(spell.verbal),
        somatic: Boolean(spell.somatic),
        material: Boolean(spell.material),
      }),
      duration: spell.duration,
      selectionType: spell.selectiontype,
    }));
}

export function getCharacterSpellcastingSummary(
  classDetails: CharacterClassDetails | null,
  level: number,
  abilityModifiers: CharacterAbilityModifiers | null,
  selectedSpells: CharacterSelectedSpellDetail[],
): CharacterSpellcastingSummary {
  const canCastSpells = Boolean(classDetails?.spellcasting);
  const ability = getSpellcastingAbility(classDetails);
  const abilityModifier =
    ability && abilityModifiers ? abilityModifiers[ability] : null;
  const proficiencyBonus = getProficiencyBonus(level);

  return {
    canCastSpells,
    ability: canCastSpells ? ability : null,
    abilityModifier: canCastSpells ? abilityModifier : null,
    spellSaveDc:
      canCastSpells && abilityModifier !== null
        ? 8 + proficiencyBonus + abilityModifier
        : null,
    spellAttackBonus:
      canCastSpells && abilityModifier !== null
        ? proficiencyBonus + abilityModifier
        : null,
    selectedSpellsCount: selectedSpells.filter((spell) => spell.level > 0)
      .length,
    selectedCantripsCount: selectedSpells.filter((spell) => spell.level === 0)
      .length,
  };
}

function getFullCasterSlots(level: number): Record<number, number> {
  const table: Record<number, Record<number, number>> = {
    1: { 1: 2 },
    2: { 1: 3 },
    3: { 1: 4, 2: 2 },
    4: { 1: 4, 2: 3 },
    5: { 1: 4, 2: 3, 3: 2 },
    6: { 1: 4, 2: 3, 3: 3 },
    7: { 1: 4, 2: 3, 3: 3, 4: 1 },
    8: { 1: 4, 2: 3, 3: 3, 4: 2 },
    9: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    10: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
    11: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    12: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
    13: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    14: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
    15: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    16: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
    17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
    18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
    19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
    20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
  };

  return table[level] ?? {};
}

function getHalfCasterSlots(level: number): Record<number, number> {
  const table: Record<number, Record<number, number>> = {
    1: { 1: 2 },
    2: { 1: 2 },
    3: { 1: 3 },
    4: { 1: 3 },
    5: { 1: 4, 2: 2 },
    6: { 1: 4, 2: 2 },
    7: { 1: 4, 2: 3 },
    8: { 1: 4, 2: 3 },
    9: { 1: 4, 2: 3, 3: 2 },
    10: { 1: 4, 2: 3, 3: 2 },
    11: { 1: 4, 2: 3, 3: 3 },
    12: { 1: 4, 2: 3, 3: 3 },
    13: { 1: 4, 2: 3, 3: 3, 4: 1 },
    14: { 1: 4, 2: 3, 3: 3, 4: 1 },
    15: { 1: 4, 2: 3, 3: 3, 4: 2 },
    16: { 1: 4, 2: 3, 3: 3, 4: 2 },
    17: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    18: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
    19: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
    20: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
  };

  return table[level] ?? {};
}

function getSlotRecord(classSlug: string | null, level: number): Record<number, number> {
  const fullCasters = new Set([
    'bard',
    'cleric',
    'druid',
    'sorcerer',
    'wizard',
  ]);
  const halfCasters = new Set(['paladin', 'ranger']);

  if (classSlug && fullCasters.has(classSlug)) {
    return getFullCasterSlots(level);
  }

  if (classSlug && halfCasters.has(classSlug)) {
    return getHalfCasterSlots(level);
  }

  return {};
}

export function getCharacterSpellSlots(
  classDetails: CharacterClassDetails | null,
  level: number,
): CharacterSpellSlot[] {
  if (!classDetails?.spellcasting) {
    return [];
  }

  const slots = getSlotRecord(classDetails.slug, level);

  return Object.entries(slots).map(([slotLevel, max]) => {
    const used = 0;

    return {
      level: Number(slotLevel),
      max,
      used,
      available: max - used,
    };
  });
}
