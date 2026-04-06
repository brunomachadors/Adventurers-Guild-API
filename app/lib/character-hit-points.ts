import {
  CharacterAbilityModifiers,
  CharacterClassDetails,
  CharacterHitPoints,
} from '@/app/types/character';

function getAverageHitDie(hitDie: number): number | null {
  const averageHitDieByDie: Record<number, number> = {
    6: 4,
    8: 5,
    10: 6,
    12: 7,
  };

  return averageHitDieByDie[hitDie] ?? null;
}

export function getCharacterHitPoints(
  classDetails: CharacterClassDetails | null,
  level: number,
  abilityModifiers: CharacterAbilityModifiers | null,
): CharacterHitPoints | null {
  if (!classDetails || !abilityModifiers) {
    return null;
  }

  const hitDie = classDetails.hitDie;
  const averageHitDie = getAverageHitDie(hitDie);

  if (averageHitDie === null || level <= 0) {
    return null;
  }

  const conModifier = abilityModifiers.CON;
  const max =
    level === 1
      ? hitDie + conModifier
      : hitDie + conModifier + (level - 1) * (averageHitDie + conModifier);
  const calculation =
    level === 1
      ? `${hitDie} + ${conModifier}`
      : `${hitDie} + ${conModifier} + (${level - 1} * (${averageHitDie} + ${conModifier}))`;

  return {
    max,
    current: max,
    temporary: 0,
    hitDie,
    conModifier,
    calculation,
  };
}
