import {
  getCharacterAbilityScoreRules,
  parseCharacterAbilityScores,
} from '@/app/lib/characters';
import { getSql } from './db';

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function parseAllowedChoices(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is typeof item & string => typeof item === 'string')
    : [];
}

export async function getCharacterAbilityScoreSelectionContext(
  ownerId: number,
  characterId: number,
) {
  const sql = getSql();
  const characterRows = await sql`
    SELECT
      characters.id,
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
    backgroundId,
    backgroundName: character.backgroundname ?? null,
    selectionRules,
    selectedAbilityScores: parseCharacterAbilityScores(character.abilityscores),
    availableChoices: selectionRules?.allowedChoices ?? [],
  };
}
