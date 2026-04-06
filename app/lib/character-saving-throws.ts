import {
  CharacterAbilityModifiers,
  CharacterClassDetails,
  CharacterSavingThrow,
  CharacterSavingThrowSource,
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

export function getCharacterSavingThrows(
  classDetails: CharacterClassDetails | null,
  level: number,
  abilityModifiers: CharacterAbilityModifiers | null,
): CharacterSavingThrow[] {
  if (!classDetails || !abilityModifiers) {
    return [];
  }

  const proficientSavingThrows = new Set(classDetails.savingThrows);
  const characterProficiencyBonus = getProficiencyBonus(level);

  return ABILITY_SCORE_KEYS.map((ability) => {
    const isProficient = proficientSavingThrows.has(ability);
    const abilityModifier = abilityModifiers[ability];
    const proficiencyBonus = isProficient ? characterProficiencyBonus : 0;
    const bonus = 0;
    const sources: CharacterSavingThrowSource[] = [
      {
        type: 'abilityModifier',
        value: abilityModifier,
      },
    ];

    if (isProficient) {
      sources.push({
        type: 'classProficiency',
        value: proficiencyBonus,
      });
    }

    return {
      ability,
      isProficient,
      abilityModifier,
      proficiencyBonus,
      bonus,
      total: abilityModifier + proficiencyBonus + bonus,
      sources,
    };
  });
}
