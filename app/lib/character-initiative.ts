import {
  CharacterAbilityModifiers,
  CharacterInitiative,
} from '@/app/types/character';

export function getCharacterInitiative(
  abilityModifiers: CharacterAbilityModifiers | null,
): CharacterInitiative | null {
  if (!abilityModifiers) {
    return null;
  }

  const abilityModifier = abilityModifiers.DEX;
  const bonus = 0;

  return {
    ability: 'DEX',
    abilityModifier,
    bonus,
    total: abilityModifier + bonus,
    sources: [
      {
        type: 'abilityModifier',
        ability: 'DEX',
        value: abilityModifier,
      },
    ],
  };
}
