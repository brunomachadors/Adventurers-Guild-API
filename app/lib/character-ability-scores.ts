import {
  getCharacterAbilityScoreRules,
  parseCharacterAbilityScores,
} from '@/app/lib/characters';
import { getSql } from './db';
import {
  CharacterAbilityScores,
  CharacterAbilityScoresInput,
  CharacterAbilityScoreRules,
  CharacterAbilityScoreRuleOption,
} from '@/app/types/character';
import { Attributeshortname } from '@/app/types/attribute';

const ABILITY_SCORE_KEYS: Attributeshortname[] = [
  'STR',
  'DEX',
  'CON',
  'INT',
  'WIS',
  'CHA',
];

const LEVEL_ONE_TO_THREE_BASE_MINIMUM = 8;
const LEVEL_ONE_TO_THREE_BASE_MAXIMUM = 15;
const BONUS_MINIMUM = 0;
const BONUS_MAXIMUM = 2;
const INVALID_ABILITY_SCORES_ERROR =
  'Invalid character ability scores payload';

type CharacterAbilityScoresValidationResult =
  | {
      valid: true;
      abilityScores: CharacterAbilityScoresInput;
    }
  | {
      valid: false;
      error: string;
    };

interface ValidateCharacterAbilityScoresInputParams {
  abilityScores: unknown;
  characterLevel: number;
  selectionRules: CharacterAbilityScoreRules | null;
}

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function parseAllowedChoices(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is typeof item & string => typeof item === 'string')
    : [];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasExactKeys(
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean {
  const valueKeys = Object.keys(value);

  return (
    valueKeys.length === keys.length &&
    keys.every((key) => Object.prototype.hasOwnProperty.call(value, key))
  );
}

function parseAbilityScores(
  value: unknown,
): CharacterAbilityScores | null {
  if (!isPlainObject(value) || !hasExactKeys(value, ABILITY_SCORE_KEYS)) {
    return null;
  }

  if (!ABILITY_SCORE_KEYS.every((key) => Number.isInteger(value[key]))) {
    return null;
  }

  return {
    STR: value.STR as number,
    DEX: value.DEX as number,
    CON: value.CON as number,
    INT: value.INT as number,
    WIS: value.WIS as number,
    CHA: value.CHA as number,
  };
}

function parseAbilityScoresInput(
  value: unknown,
): CharacterAbilityScoresInput | null {
  if (!isPlainObject(value) || !hasExactKeys(value, ['base', 'bonuses'])) {
    return null;
  }

  const base = parseAbilityScores(value.base);
  const bonuses = parseAbilityScores(value.bonuses);

  return base && bonuses ? { base, bonuses } : null;
}

function getInvalidBaseScoreMessage(
  abilityScores: CharacterAbilityScores,
  characterLevel: number,
): string | null {
  if (characterLevel < 1 || characterLevel > 3) {
    return null;
  }

  const invalidKey = ABILITY_SCORE_KEYS.find(
    (key) =>
      abilityScores[key] < LEVEL_ONE_TO_THREE_BASE_MINIMUM ||
      abilityScores[key] > LEVEL_ONE_TO_THREE_BASE_MAXIMUM,
  );

  if (!invalidKey) {
    return null;
  }

  return `${INVALID_ABILITY_SCORES_ERROR}: base.${invalidKey} must be between ${LEVEL_ONE_TO_THREE_BASE_MINIMUM} and ${LEVEL_ONE_TO_THREE_BASE_MAXIMUM} for character levels 1 to 3; received ${abilityScores[invalidKey]}`;
}

function getInvalidBonusRangeMessage(
  bonuses: CharacterAbilityScores,
): string | null {
  const invalidKey = ABILITY_SCORE_KEYS.find(
    (key) => bonuses[key] < BONUS_MINIMUM || bonuses[key] > BONUS_MAXIMUM,
  );

  if (!invalidKey) {
    return null;
  }

  return `${INVALID_ABILITY_SCORES_ERROR}: bonuses.${invalidKey} must be between ${BONUS_MINIMUM} and ${BONUS_MAXIMUM}; received ${bonuses[invalidKey]}`;
}

function getDisallowedBonusMessage(
  bonuses: CharacterAbilityScores,
  allowedChoices: Attributeshortname[],
): string | null {
  const allowedChoiceSet = new Set(allowedChoices);
  const invalidKey = ABILITY_SCORE_KEYS.find(
    (key) => bonuses[key] > 0 && !allowedChoiceSet.has(key),
  );

  if (!invalidKey) {
    return null;
  }

  return `${INVALID_ABILITY_SCORES_ERROR}: bonuses.${invalidKey} is not allowed by this character's background. Allowed abilities: ${allowedChoices.join(', ')}`;
}

function matchesPlusTwoPlusOneRule(
  bonuses: CharacterAbilityScores,
  option: Extract<CharacterAbilityScoreRuleOption, { type: 'plus2_plus1' }>,
): boolean {
  const positiveBonuses = ABILITY_SCORE_KEYS.filter((key) => bonuses[key] > 0);
  const expectedPositiveCount = option.choices.reduce(
    (total, choice) => total + choice.count,
    0,
  );
  const expectedTotalBonus = option.choices.reduce(
    (total, choice) => total + choice.bonus * choice.count,
    0,
  );
  const actualTotalBonus = ABILITY_SCORE_KEYS.reduce(
    (total, key) => total + bonuses[key],
    0,
  );

  if (
    positiveBonuses.length !== expectedPositiveCount ||
    actualTotalBonus !== expectedTotalBonus
  ) {
    return false;
  }

  return option.choices.every((choice) => {
    const matchingAbilities = ABILITY_SCORE_KEYS.filter(
      (key) => bonuses[key] === choice.bonus,
    );

    if (matchingAbilities.length !== choice.count) {
      return false;
    }

    if (choice.mustBeDifferentFromBonus === undefined) {
      return true;
    }

    return matchingAbilities.every(
      (key) => bonuses[key] !== choice.mustBeDifferentFromBonus,
    );
  });
}

function matchesPlusOneEachSuggestedRule(
  bonuses: CharacterAbilityScores,
  allowedChoices: Attributeshortname[],
): boolean {
  const allowedChoiceSet = new Set(allowedChoices);

  return ABILITY_SCORE_KEYS.every((key) =>
    allowedChoiceSet.has(key) ? bonuses[key] === 1 : bonuses[key] === 0,
  );
}

function matchesBonusRule(
  bonuses: CharacterAbilityScores,
  selectionRules: CharacterAbilityScoreRules,
): boolean {
  const options = selectionRules.bonusRules?.options ?? [];

  return options.some((option) => {
    if (option.type === 'plus2_plus1') {
      return matchesPlusTwoPlusOneRule(bonuses, option);
    }

    if (option.type === 'plus1_each_suggested') {
      return matchesPlusOneEachSuggestedRule(
        bonuses,
        selectionRules.allowedChoices,
      );
    }

    return false;
  });
}

function describeSelectedBonuses(bonuses: CharacterAbilityScores): string {
  const selectedBonuses = ABILITY_SCORE_KEYS.filter((key) => bonuses[key] > 0)
    .map((key) => `${key} +${bonuses[key]}`);

  return selectedBonuses.length > 0 ? selectedBonuses.join(', ') : 'none';
}

export function validateCharacterAbilityScoresInput({
  abilityScores,
  characterLevel,
  selectionRules,
}: ValidateCharacterAbilityScoresInputParams): CharacterAbilityScoresValidationResult {
  const parsedAbilityScores = parseAbilityScoresInput(abilityScores);

  if (!parsedAbilityScores) {
    return {
      valid: false,
      error: `${INVALID_ABILITY_SCORES_ERROR}: abilityScores must contain exactly base and bonuses with integer STR, DEX, CON, INT, WIS, and CHA values`,
    };
  }

  if (!selectionRules || !selectionRules.bonusRules) {
    return {
      valid: false,
      error: `${INVALID_ABILITY_SCORES_ERROR}: ability score selection rules are not available for this character`,
    };
  }

  const invalidBaseScoreMessage = getInvalidBaseScoreMessage(
    parsedAbilityScores.base,
    characterLevel,
  );

  if (invalidBaseScoreMessage) {
    return {
      valid: false,
      error: invalidBaseScoreMessage,
    };
  }

  const invalidBonusRangeMessage = getInvalidBonusRangeMessage(
    parsedAbilityScores.bonuses,
  );

  if (invalidBonusRangeMessage) {
    return {
      valid: false,
      error: invalidBonusRangeMessage,
    };
  }

  const disallowedBonusMessage = getDisallowedBonusMessage(
    parsedAbilityScores.bonuses,
    selectionRules.allowedChoices,
  );

  if (disallowedBonusMessage) {
    return {
      valid: false,
      error: disallowedBonusMessage,
    };
  }

  const hasPlusTwoPlusOneRule = selectionRules.bonusRules.options.some(
    (option) => option.type === 'plus2_plus1',
  );

  if (
    hasPlusTwoPlusOneRule &&
    !matchesBonusRule(parsedAbilityScores.bonuses, selectionRules)
  ) {
    return {
      valid: false,
      error: `${INVALID_ABILITY_SCORES_ERROR}: bonuses must follow a +2/+1 split across different allowed abilities; received ${describeSelectedBonuses(parsedAbilityScores.bonuses)}`,
    };
  }

  if (!matchesBonusRule(parsedAbilityScores.bonuses, selectionRules)) {
    return {
      valid: false,
      error: `${INVALID_ABILITY_SCORES_ERROR}: bonuses do not match the background ability score rules; received ${describeSelectedBonuses(parsedAbilityScores.bonuses)}`,
    };
  }

  return {
    valid: true,
    abilityScores: parsedAbilityScores,
  };
}

export async function getCharacterAbilityScoreRulesByBackgroundId(
  backgroundId: number | null,
): Promise<CharacterAbilityScoreRules | null> {
  if (backgroundId === null) {
    return null;
  }

  const sql = getSql();
  const backgroundRows = await sql`
    SELECT id, name, slug, description, abilityscores, feat, skillproficiencies, toolproficiency, equipmentoptions, abilityscorerules
    FROM backgrounds
    WHERE id = ${backgroundId}
    LIMIT 1
  `;

  if (!backgroundRows || backgroundRows.length === 0) {
    return null;
  }

  const background = backgroundRows[0];
  const backgroundDetails = {
    id: toNumber(background.id),
    name: background.name,
    slug: background.slug,
    description: background.description,
    abilityScores: parseAllowedChoices(background.abilityscores),
    feat: background.feat,
    skillProficiencies: Array.isArray(background.skillproficiencies)
      ? background.skillproficiencies
      : [],
    toolProficiency: background.toolproficiency ?? null,
    equipmentOptions: Array.isArray(background.equipmentoptions)
      ? background.equipmentoptions
      : [],
  };

  return getCharacterAbilityScoreRules(
    backgroundDetails,
    background.abilityscorerules,
  );
}

export async function getCharacterAbilityScoreSelectionContext(
  ownerId: number,
  characterId: number,
) {
  const sql = getSql();
  const characterRows = await sql`
    SELECT
      characters.id,
      characters.level,
      characters.backgroundid,
      characters.abilityscores,
      backgrounds.name AS backgroundname,
      backgrounds.abilityscores AS backgroundabilityscores,
      backgrounds.abilityscorerules AS backgroundabilityscorerules
    FROM characters
    LEFT JOIN backgrounds ON backgrounds.id = characters.backgroundid
    WHERE characters.id = ${characterId}
      AND characters.ownerid = ${ownerId}
    LIMIT 1
  `;

  if (!characterRows || characterRows.length === 0) {
    return null;
  }

  const character = characterRows[0];
  const backgroundId =
    character.backgroundid === null ? null : toNumber(character.backgroundid);
  const backgroundDetails =
    backgroundId === null
      ? null
      : {
          id: backgroundId,
          name: character.backgroundname ?? '',
          slug: '',
          description: '',
          abilityScores: parseAllowedChoices(character.backgroundabilityscores),
          feat: '',
          skillProficiencies: [],
          toolProficiency: null,
          equipmentOptions: [],
        };
  const selectionRules = getCharacterAbilityScoreRules(
    backgroundDetails,
    character.backgroundabilityscorerules,
  );

  return {
    characterId: toNumber(character.id),
    characterLevel: toNumber(character.level),
    backgroundId,
    backgroundName: character.backgroundname ?? null,
    selectionRules,
    selectedAbilityScores: parseCharacterAbilityScores(character.abilityscores),
    availableChoices: selectionRules?.allowedChoices ?? [],
  };
}
