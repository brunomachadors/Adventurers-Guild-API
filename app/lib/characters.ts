import {
  CharacterAbilityModifiers,
  CharacterAbilityScores,
  CharacterAbilityScoresInput,
  CharacterResolvedAbilityScores,
  CharacterAbilityScoreBonusRules,
  CharacterAbilityScoreRuleOption,
  CharacterAbilityScoreRuleOptionPlusTwoPlusOne,
  CharacterCurrency,
  CharacterAbilityScoreRules,
  CharacterClassDetails,
  CharacterMissingField,
  CharacterResponseBody,
  CharacterStatus,
} from '@/app/types/character';
import { Attributeshortname } from '@/app/types/attribute';
import { BackgroundDetail } from '@/app/types/background';
import { SpeciesDetail, SpeciesTrait } from '@/app/types/species';
import { SKILL_NAMES, SkillName } from '@/app/types/skill';
import { getCharacterArmorClass } from './character-armor-class';
import { getSql } from './db';

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

export function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

export function isNullablePositiveInteger(
  value: unknown,
): value is number | null {
  return value === null || isPositiveInteger(value);
}

export function getCharacterMissingFields(character: {
  classId: number | null;
  speciesId: number | null;
  backgroundId: number | null;
}): CharacterMissingField[] {
  const missingFields: CharacterMissingField[] = [];

  if (character.classId === null) {
    missingFields.push('classId');
  }

  if (character.speciesId === null) {
    missingFields.push('speciesId');
  }

  if (character.backgroundId === null) {
    missingFields.push('backgroundId');
  }

  return missingFields;
}

export function getCharacterStatus(
  missingFields: CharacterMissingField[],
): CharacterStatus {
  return missingFields.length === 0 ? 'complete' : 'draft';
}

export async function getCharacterClassDetails(
  classId: number | null,
  characterLevel: number,
): Promise<CharacterClassDetails | null> {
  if (classId === null) {
    return null;
  }

  const sql = getSql();
  const classRows = await sql`
    SELECT
      id,
      name,
      slug,
      description,
      role,
      hitdie,
      primaryattributes,
      recommendedskills,
      savingthrows,
      spellcasting,
      subclasses,
      levelprogression
    FROM classes
    WHERE id = ${classId}
    LIMIT 1
  `;

  if (!classRows || classRows.length === 0) {
    return null;
  }

  const classItem = classRows[0];
  const levelProgression = Array.isArray(classItem.levelprogression)
    ? classItem.levelprogression
    : [];

  return {
    id: toNumber(classItem.id),
    name: classItem.name,
    slug: classItem.slug,
    description: classItem.description,
    role: classItem.role,
    hitDie: toNumber(classItem.hitdie),
    primaryAttributes: Array.isArray(classItem.primaryattributes)
      ? classItem.primaryattributes
      : [],
    recommendedSkills: Array.isArray(classItem.recommendedskills)
      ? classItem.recommendedskills
      : [],
    savingThrows: Array.isArray(classItem.savingthrows)
      ? classItem.savingthrows
      : [],
    spellcasting:
      classItem.spellcasting &&
      typeof classItem.spellcasting === 'object' &&
      !Array.isArray(classItem.spellcasting)
        ? classItem.spellcasting
        : null,
    subclasses: Array.isArray(classItem.subclasses) ? classItem.subclasses : [],
    featuresByLevel: levelProgression
      .filter(
        (item) =>
          typeof item === 'object' &&
          item !== null &&
          'level' in item &&
          typeof item.level === 'number' &&
          item.level <= characterLevel &&
          'features' in item &&
          Array.isArray(item.features),
      )
      .map((item) => ({
        level: item.level,
        features: item.features
          .filter((feature: unknown) => isRawClassFeature(feature))
          .map((feature: RawClassFeature) => ({
            name: feature.name,
            description: feature.description,
          })),
      })),
  };
}

function isSpeciesTrait(value: unknown): value is SpeciesTrait {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'description' in value &&
    typeof value.name === 'string' &&
    typeof value.description === 'string'
  );
}

function parseSpecialTraits(value: unknown): SpeciesTrait[] {
  if (Array.isArray(value)) {
    return value.filter(isSpeciesTrait);
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);

      return Array.isArray(parsed) ? parsed.filter(isSpeciesTrait) : [];
    } catch {
      return [];
    }
  }

  return [];
}

const ABILITY_SCORE_KEYS: Attributeshortname[] = [
  'STR',
  'DEX',
  'CON',
  'INT',
  'WIS',
  'CHA',
];

function createEmptyAbilityScores(): CharacterAbilityScores {
  return {
    STR: 0,
    DEX: 0,
    CON: 0,
    INT: 0,
    WIS: 0,
    CHA: 0,
  };
}

function addAbilityScores(
  base: CharacterAbilityScores,
  bonuses: CharacterAbilityScores,
): CharacterAbilityScores {
  return {
    STR: base.STR + bonuses.STR,
    DEX: base.DEX + bonuses.DEX,
    CON: base.CON + bonuses.CON,
    INT: base.INT + bonuses.INT,
    WIS: base.WIS + bonuses.WIS,
    CHA: base.CHA + bonuses.CHA,
  };
}

function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function getCharacterAbilityModifiers(
  abilityScores: CharacterResolvedAbilityScores | CharacterAbilityScoresInput | CharacterAbilityScores | string | null,
): CharacterAbilityModifiers | null {
  const resolvedAbilityScores = parseCharacterAbilityScores(abilityScores);

  if (!resolvedAbilityScores) {
    return null;
  }

  return {
    STR: getAbilityModifier(resolvedAbilityScores.final.STR),
    DEX: getAbilityModifier(resolvedAbilityScores.final.DEX),
    CON: getAbilityModifier(resolvedAbilityScores.final.CON),
    INT: getAbilityModifier(resolvedAbilityScores.final.INT),
    WIS: getAbilityModifier(resolvedAbilityScores.final.WIS),
    CHA: getAbilityModifier(resolvedAbilityScores.final.CHA),
  };
}

function isSkillName(value: unknown): value is SkillName {
  return typeof value === 'string' && SKILL_NAMES.includes(value as SkillName);
}

export function isSkillProficiencies(value: unknown): value is SkillName[] {
  return Array.isArray(value) && value.every(isSkillName);
}

export function parseSkillProficiencies(value: unknown): SkillName[] {
  if (isSkillProficiencies(value)) {
    return [...new Set(value)];
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);

      return isSkillProficiencies(parsed) ? [...new Set(parsed)] : [];
    } catch {
      return [];
    }
  }

  return [];
}

export function serializeSkillProficiencies(value: SkillName[]): string {
  return JSON.stringify([...new Set(value)]);
}

export function isCharacterCurrency(value: unknown): value is CharacterCurrency {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const currency = value as Record<string, unknown>;

  return (
    typeof currency.cp === 'number' &&
    typeof currency.sp === 'number' &&
    typeof currency.ep === 'number' &&
    typeof currency.gp === 'number' &&
    typeof currency.pp === 'number'
  );
}

export function isCharacterCurrencyOrNull(
  value: unknown,
): value is CharacterCurrency | null {
  return value === null || isCharacterCurrency(value);
}

export function parseCharacterCurrency(value: unknown): CharacterCurrency | null {
  if (isCharacterCurrency(value)) {
    return {
      cp: value.cp,
      sp: value.sp,
      ep: value.ep,
      gp: value.gp,
      pp: value.pp,
    };
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);

      return parseCharacterCurrency(parsed);
    } catch {
      return null;
    }
  }

  return null;
}

export function serializeCharacterCurrency(
  value: CharacterCurrency,
): CharacterCurrency {
  return {
    cp: value.cp,
    sp: value.sp,
    ep: value.ep,
    gp: value.gp,
    pp: value.pp,
  };
}

export function getProficiencyBonus(level: number): number {
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

function normalizeAbilityScores(
  abilityScores: CharacterAbilityScores,
): CharacterAbilityScores {
  return {
    STR: abilityScores.STR,
    DEX: abilityScores.DEX,
    CON: abilityScores.CON,
    INT: abilityScores.INT,
    WIS: abilityScores.WIS,
    CHA: abilityScores.CHA,
  };
}

export function isCharacterAbilityScores(
  value: unknown,
): value is CharacterAbilityScores {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const abilityScores = value as Record<string, unknown>;

  return (
    ABILITY_SCORE_KEYS.every(
      (key) => typeof abilityScores[key] === 'number',
    )
  );
}

export function isCharacterAbilityScoresOrNull(
  value: unknown,
): value is CharacterAbilityScoresInput | null {
  return value === null || isCharacterAbilityScoresInput(value);
}

export function isCharacterAbilityScoresInput(
  value: unknown,
): value is CharacterAbilityScoresInput {
  return (
    typeof value === 'object' &&
    value !== null &&
    'base' in value &&
    'bonuses' in value &&
    isCharacterAbilityScores(value.base) &&
    isCharacterAbilityScores(value.bonuses)
  );
}

export function parseCharacterAbilityScores(
  value: unknown,
): CharacterResolvedAbilityScores | null {
  if (isCharacterAbilityScoresInput(value)) {
    const base = normalizeAbilityScores(value.base);
    const bonuses = normalizeAbilityScores(value.bonuses);

    return {
      base,
      bonuses,
      final: addAbilityScores(base, bonuses),
    };
  }

  if (isCharacterAbilityScores(value)) {
    const base = normalizeAbilityScores(value);
    const bonuses = createEmptyAbilityScores();

    return {
      base,
      bonuses,
      final: addAbilityScores(base, bonuses),
    };
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);

      return parseCharacterAbilityScores(parsed);
    } catch {
      return null;
    }
  }

  return null;
}

export function serializeCharacterAbilityScoresInput(
  value: CharacterAbilityScoresInput,
): CharacterAbilityScoresInput {
  return {
    base: normalizeAbilityScores(value.base),
    bonuses: normalizeAbilityScores(value.bonuses),
  };
}

export async function getCharacterSpeciesDetails(
  speciesId: number | null,
): Promise<SpeciesDetail | null> {
  if (speciesId === null) {
    return null;
  }

  const sql = getSql();
  const speciesRows = await sql`
    SELECT
      id,
      name,
      slug,
      description,
      creaturetype,
      size,
      speed,
      specialtraits
    FROM species
    WHERE id = ${speciesId}
    LIMIT 1
  `;

  if (!speciesRows || speciesRows.length === 0) {
    return null;
  }

  const speciesItem = speciesRows[0];

  return {
    id: toNumber(speciesItem.id),
    name: speciesItem.name,
    slug: speciesItem.slug,
    description: speciesItem.description,
    creatureType: speciesItem.creaturetype,
    size: speciesItem.size,
    speed: toNumber(speciesItem.speed),
    specialTraits: parseSpecialTraits(speciesItem.specialtraits),
  };
}

export async function getCharacterBackgroundDetails(
  backgroundId: number | null,
): Promise<BackgroundDetail | null> {
  if (backgroundId === null) {
    return null;
  }

  const sql = getSql();
  const backgroundRows = await sql`
    SELECT
      id,
      name,
      slug,
      description,
      abilityscores,
      feat,
      skillproficiencies,
      toolproficiency,
      equipmentoptions
    FROM backgrounds
    WHERE id = ${backgroundId}
    LIMIT 1
  `;

  if (!backgroundRows || backgroundRows.length === 0) {
    return null;
  }

  const backgroundItem = backgroundRows[0];

  return {
    id: toNumber(backgroundItem.id),
    name: backgroundItem.name,
    slug: backgroundItem.slug,
    description: backgroundItem.description,
    abilityScores: Array.isArray(backgroundItem.abilityscores)
      ? backgroundItem.abilityscores
      : [],
    feat: backgroundItem.feat,
    skillProficiencies: Array.isArray(backgroundItem.skillproficiencies)
      ? backgroundItem.skillproficiencies
      : [],
    toolProficiency: backgroundItem.toolproficiency ?? null,
    equipmentOptions: Array.isArray(backgroundItem.equipmentoptions)
      ? backgroundItem.equipmentoptions
      : [],
  };
}

async function getBackgroundAbilityScoreRules(
  backgroundId: number | null,
): Promise<unknown> {
  if (backgroundId === null) {
    return null;
  }

  const sql = getSql();
  const backgroundRows = await sql`
    SELECT abilityscorerules
    FROM backgrounds
    WHERE id = ${backgroundId}
    LIMIT 1
  `;

  if (!backgroundRows || backgroundRows.length === 0) {
    return null;
  }

  return backgroundRows[0].abilityscorerules ?? null;
}

export async function formatCharacterResponse(character: {
  id: number | string;
  name: string;
  classId: number | string | null;
  speciesId: number | string | null;
  backgroundId: number | string | null;
  level: number | string;
  abilityScores?:
    | CharacterAbilityScores
    | CharacterAbilityScoresInput
    | CharacterResolvedAbilityScores
    | string
    | null;
  currency?: CharacterCurrency | string | null;
  skillProficiencies?: SkillName[] | string | null;
}): Promise<CharacterResponseBody> {
  const formattedCharacter = {
    id: toNumber(character.id),
    name: character.name,
    classId:
      character.classId === null ? null : toNumber(character.classId),
    speciesId:
      character.speciesId === null ? null : toNumber(character.speciesId),
    backgroundId:
      character.backgroundId === null ? null : toNumber(character.backgroundId),
    level: toNumber(character.level),
    abilityScores: parseCharacterAbilityScores(
      character.abilityScores ?? null,
    ),
    currency: parseCharacterCurrency(character.currency ?? null),
    skillProficiencies: parseSkillProficiencies(
      character.skillProficiencies ?? [],
    ),
  };

  const missingFields = getCharacterMissingFields(formattedCharacter);
  const classDetails = await getCharacterClassDetails(
    formattedCharacter.classId,
    formattedCharacter.level,
  );
  const speciesDetails = await getCharacterSpeciesDetails(
    formattedCharacter.speciesId,
  );
  const backgroundDetails = await getCharacterBackgroundDetails(
    formattedCharacter.backgroundId,
  );
  const backgroundAbilityScoreRules = await getBackgroundAbilityScoreRules(
    formattedCharacter.backgroundId,
  );
  const abilityScoreRules = getCharacterAbilityScoreRules(
    backgroundDetails,
    backgroundAbilityScoreRules,
  );
  const abilityModifiers = getCharacterAbilityModifiers(
    formattedCharacter.abilityScores,
  );
  const armorClass = await getCharacterArmorClass(
    formattedCharacter.id,
    classDetails,
    abilityModifiers,
  );

  return {
    ...formattedCharacter,
    status: getCharacterStatus(missingFields),
    missingFields,
    abilityScores: formattedCharacter.abilityScores,
    abilityModifiers,
    armorClass,
    currency: formattedCharacter.currency,
    skillProficiencies: formattedCharacter.skillProficiencies,
    abilityScoreRules,
    classDetails,
    speciesDetails,
    backgroundDetails,
  };
}


export function getCharacterAbilityScoreRules(
  backgroundDetails: BackgroundDetail | null,
  backgroundAbilityScoreRules: unknown = null,
): CharacterAbilityScoreRules | null {
  if (
    !backgroundDetails ||
    !Array.isArray(backgroundDetails.abilityScores) ||
    backgroundDetails.abilityScores.length === 0
  ) {
    return null;
  }

  const allowedChoices = backgroundDetails.abilityScores.filter(
    (abilityScore): abilityScore is Attributeshortname =>
      ABILITY_SCORE_KEYS.includes(abilityScore as Attributeshortname),
  );

  if (allowedChoices.length === 0) {
    return null;
  }

  return {
    source: 'background',
    allowedChoices,
    bonusRules: parseCharacterAbilityScoreBonusRules(backgroundAbilityScoreRules),
  };
}

function parseCharacterAbilityScoreBonusRules(
  value: unknown,
): CharacterAbilityScoreBonusRules | null {
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);

      return parseCharacterAbilityScoreBonusRules(parsed);
    } catch {
      return null;
    }
  }

  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const rules = value as Record<string, unknown>;

  if (rules.mode !== 'standard_background' || !Array.isArray(rules.options)) {
    return null;
  }

  const options = rules.options
    .map(parseCharacterAbilityScoreRuleOption)
    .filter((option): option is CharacterAbilityScoreRuleOption => option !== null);

  if (options.length === 0) {
    return null;
  }

  return {
    mode: 'standard_background',
    options,
  };
}

function parseCharacterAbilityScoreRuleOption(
  value: unknown,
): CharacterAbilityScoreRuleOption | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const option = value as Record<string, unknown>;

  if (option.type === 'plus2_plus1' && Array.isArray(option.choices)) {
    const choices = option.choices.filter(
      (choice): choice is CharacterAbilityScoreRuleOptionPlusTwoPlusOne['choices'][number] =>
        typeof choice === 'object' &&
        choice !== null &&
        'bonus' in choice &&
        'count' in choice &&
        typeof choice.bonus === 'number' &&
        typeof choice.count === 'number' &&
        (!('mustBeDifferentFromBonus' in choice) ||
          typeof choice.mustBeDifferentFromBonus === 'number'),
    );

    if (choices.length === 0) {
      return null;
    }

    return {
      type: 'plus2_plus1',
      choices,
    };
  }

  if (
    option.type === 'plus1_each_suggested' &&
    option.basedOn === 'abilityscores'
  ) {
    return {
      type: 'plus1_each_suggested',
      basedOn: 'abilityscores',
    };
  }

  return null;
}

type RawClassFeature = {
  name: string;
  description: string;
};

function isRawClassFeature(value: unknown): value is RawClassFeature {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'description' in value &&
    typeof value.name === 'string' &&
    typeof value.description === 'string'
  );
}
