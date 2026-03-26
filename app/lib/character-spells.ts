import {
  CharacterSelectedSpellItem,
  CharacterSpellOptionItem,
  CharacterSpellSelectionRule,
  CharacterSpellSelectionType,
} from '@/app/types/character';
import { getSql } from './db';

type CharacterSpellcastingSelection = {
  selectionType: CharacterSpellSelectionType;
  spells?: Record<string, number>;
  cantrips?: Record<string, number>;
};

type CharacterSpellcastingConfig = {
  selection?: CharacterSpellcastingSelection;
};

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function isCharacterSpellSelectionType(
  value: unknown,
): value is CharacterSpellSelectionType {
  return value === 'known' || value === 'prepared' || value === 'cantrip';
}

function isNumberRecord(value: unknown): value is Record<string, number> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((item) => typeof item === 'number')
  );
}

function parseSpellcastingConfig(value: unknown): CharacterSpellcastingConfig | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  return value as CharacterSpellcastingConfig;
}

function getSelectionLimitByLevel(
  record: Record<string, number> | undefined,
  level: number,
): number {
  if (!record) {
    return 0;
  }

  return record[String(level)] ?? 0;
}

export function getSpellSelectionRule(
  spellcasting: unknown,
  level: number,
): CharacterSpellSelectionRule {
  const config = parseSpellcastingConfig(spellcasting);
  const selection = config?.selection;

  if (
    !selection ||
    !isCharacterSpellSelectionType(selection.selectionType) ||
    (!selection.spells && !selection.cantrips)
  ) {
    return {
      canSelectSpells: false,
      selectionType: null,
      maxCantrips: 0,
      maxSpells: 0,
    };
  }

  const spells = isNumberRecord(selection.spells) ? selection.spells : undefined;
  const cantrips = isNumberRecord(selection.cantrips)
    ? selection.cantrips
    : undefined;

  return {
    canSelectSpells: true,
    selectionType: selection.selectionType,
    maxCantrips: getSelectionLimitByLevel(cantrips, level),
    maxSpells: getSelectionLimitByLevel(spells, level),
  };
}

export async function getCharacterSpellSelectionContext(
  ownerId: number,
  characterId: number,
) {
  const sql = getSql();
  const characterRows = await sql`
    SELECT
      characters.id,
      characters.level,
      characters.classid,
      classes.name AS classname,
      classes.spellcasting
    FROM characters
    LEFT JOIN classes ON classes.id = characters.classid
    WHERE characters.id = ${characterId}
      AND characters.ownerid = ${ownerId}
    LIMIT 1
  `;

  if (!characterRows || characterRows.length === 0) {
    return null;
  }

  const character = characterRows[0];
  const parsedCharacterId = toNumber(character.id);
  const classId = character.classid === null ? null : toNumber(character.classid);
  const level = toNumber(character.level);
  const selectionRules = getSpellSelectionRule(character.spellcasting, level);

  let availableSpells: CharacterSpellOptionItem[] = [];

  if (classId !== null) {
    const spellRows = await sql`
      SELECT spells.id, spells.name, spells.level, spells.levellabel
      FROM spellclasses
      INNER JOIN spells ON spells.id = spellclasses.spellid
      WHERE spellclasses.classid = ${classId}
      ORDER BY spells.level, spells.id
    `;

    availableSpells = spellRows.map((spell) => ({
      id: toNumber(spell.id),
      name: spell.name,
      level: toNumber(spell.level),
      levelLabel: spell.levellabel,
    }));
  }

  const selectedSpellRows = await sql`
    SELECT spells.id, spells.name, spells.level, spells.levellabel, characterspells.selectiontype
    FROM characterspells
    INNER JOIN spells ON spells.id = characterspells.spellid
    WHERE characterspells.characterid = ${parsedCharacterId}
    ORDER BY spells.level, spells.id
  `;

  const selectedSpells: CharacterSelectedSpellItem[] = selectedSpellRows
    .filter((spell) => isCharacterSpellSelectionType(spell.selectiontype))
    .map((spell) => ({
      id: toNumber(spell.id),
      name: spell.name,
      level: toNumber(spell.level),
      levelLabel: spell.levellabel,
      selectionType: spell.selectiontype,
    }));

  return {
    characterId: parsedCharacterId,
    classId,
    className: character.classname ?? null,
    level,
    selectionRules,
    availableSpells,
    selectedSpells,
  };
}
