import {
  CharacterChoicesEquipmentOption,
  CharacterChoicesResponseBody,
  CharacterResponseBody,
} from '@/app/types/character';
import { SkillName } from '@/app/types/skill';
import { getCharacterSpellSelectionContextByCharacterId } from './character-spells';
import { getSpeciesEffectiveSkillProficiencies } from './character-species-selections';
import { getCharacterResponse, parseSkillProficiencies } from './characters';

function getManualClassSkills(character: CharacterResponseBody): SkillName[] {
  const backgroundSkills = parseSkillProficiencies(
    character.backgroundDetails?.skillProficiencies ?? [],
  );
  const speciesSkills = getSpeciesEffectiveSkillProficiencies(
    character.speciesDetails ?? null,
    character.selectedSpeciesSkillProficiencies,
  );
  const autoSkillSet = new Set([...backgroundSkills, ...speciesSkills]);

  return character.skillProficiencies.filter((skill) => !autoSkillSet.has(skill));
}

function buildClassEquipmentOptions(
  character: CharacterResponseBody,
): CharacterChoicesEquipmentOption[] {
  return (character.classDetails?.startingEquipmentOptions ?? []).map(
    (option, optionIndex) => ({
      optionIndex,
      label: option.label ?? null,
      items: option.items,
    }),
  );
}

function buildBackgroundEquipmentOptions(
  character: CharacterResponseBody,
): CharacterChoicesEquipmentOption[] {
  return (character.backgroundDetails?.equipmentOptions ?? []).map(
    (option, optionIndex) => ({
      optionIndex,
      label: null,
      items: [option],
    }),
  );
}

export async function getCharacterChoicesResponse(
  characterId: number,
): Promise<CharacterChoicesResponseBody | null> {
  const character = await getCharacterResponse(characterId);

  if (!character) {
    return null;
  }

  const manualClassSkills = getManualClassSkills(character);
  const classSkillChoiceConfig = character.classDetails?.skillProficiencyChoices;
  const classSkillSelection =
    character.classDetails && classSkillChoiceConfig
      ? {
          pending: manualClassSkills.length !== classSkillChoiceConfig.choose,
          choose: classSkillChoiceConfig.choose,
          selected: manualClassSkills,
          options: classSkillChoiceConfig.options,
        }
      : null;

  const speciesSkillChoiceConfig =
    character.speciesDetails?.speciesSkillProficiencyChoices ?? null;
  const speciesSkillSelection = speciesSkillChoiceConfig
    ? {
        pending: character.pendingChoices.includes('speciesSkillSelection'),
        choose: speciesSkillChoiceConfig.choose,
        selected: character.selectedSpeciesSkillProficiencies,
        options: speciesSkillChoiceConfig.options,
      }
    : null;

  const speciesChoiceSelection =
    character.speciesDetails && character.speciesDetails.speciesChoices.length > 0
      ? {
          pending: character.pendingChoices.includes('speciesChoiceSelection'),
          selected: character.selectedSpeciesChoices,
          choices: character.speciesDetails.speciesChoices,
        }
      : null;

  const classEquipmentOptions = buildClassEquipmentOptions(character);
  const backgroundEquipmentOptions = buildBackgroundEquipmentOptions(character);
  const spellSelectionContext =
    await getCharacterSpellSelectionContextByCharacterId(characterId);
  const spellSelection =
    spellSelectionContext &&
    (spellSelectionContext.selectionRules.canSelectSpells ||
      spellSelectionContext.selectedSpells.length > 0)
      ? {
          pending:
            spellSelectionContext.selectedSpells.filter((spell) => spell.level === 0)
              .length !== spellSelectionContext.selectionRules.maxCantrips ||
            spellSelectionContext.selectedSpells.filter((spell) => spell.level > 0)
              .length !== spellSelectionContext.selectionRules.maxSpells,
          selectionRules: spellSelectionContext.selectionRules,
          selectedSpells: spellSelectionContext.selectedSpells,
          availableSpells: spellSelectionContext.availableSpells,
          remainingCantrips: Math.max(
            spellSelectionContext.selectionRules.maxCantrips -
              spellSelectionContext.selectedSpells.filter((spell) => spell.level === 0)
                .length,
            0,
          ),
          remainingSpells: Math.max(
            spellSelectionContext.selectionRules.maxSpells -
              spellSelectionContext.selectedSpells.filter((spell) => spell.level > 0)
                .length,
            0,
          ),
        }
      : null;

  return {
    characterId: character.id,
    status: character.status,
    classId: character.classId,
    speciesId: character.speciesId,
    backgroundId: character.backgroundId,
    level: character.level,
    missingFields: character.missingFields,
    pendingChoices: character.pendingChoices,
    classSkillSelection,
    speciesSkillSelection,
    speciesChoiceSelection,
    classEquipmentSelection:
      classEquipmentOptions.length > 0
        ? {
            pending: character.pendingChoices.includes('classEquipmentSelection'),
            options: classEquipmentOptions,
          }
        : null,
    backgroundEquipmentSelection:
      backgroundEquipmentOptions.length > 0
        ? {
            pending: character.pendingChoices.includes(
              'backgroundEquipmentSelection',
            ),
            options: backgroundEquipmentOptions,
          }
        : null,
    spellSelection,
  };
}
