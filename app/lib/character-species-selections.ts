import { CharacterPendingChoice } from '@/app/types/character';
import { SpeciesDetail } from '@/app/types/species';
import { SKILL_NAMES, SkillName } from '@/app/types/skill';

function isStringRecord(
  value: unknown,
): value is Record<string, string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((entry) => typeof entry === 'string')
  );
}

export function parseSelectedSpeciesChoices(
  value: unknown,
): Record<string, string> {
  if (isStringRecord(value)) {
    return value;
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);

      return isStringRecord(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  return {};
}

export function serializeSelectedSpeciesChoices(
  value: Record<string, string>,
): string {
  return JSON.stringify(value);
}

function isSkillName(value: unknown): value is SkillName {
  return typeof value === 'string' && SKILL_NAMES.includes(value as SkillName);
}

function parseSkillProficiencies(value: unknown): SkillName[] {
  if (Array.isArray(value) && value.every(isSkillName)) {
    return [...new Set(value)];
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);

      return Array.isArray(parsed) && parsed.every(isSkillName)
        ? [...new Set(parsed)]
        : [];
    } catch {
      return [];
    }
  }

  return [];
}

export function getSpeciesGrantedSkillProficiencies(
  speciesDetails: SpeciesDetail | null,
): SkillName[] {
  return parseSkillProficiencies(speciesDetails?.grantedSkillProficiencies ?? []);
}

export function getSpeciesEffectiveSkillProficiencies(
  speciesDetails: SpeciesDetail | null,
  selectedSpeciesSkillProficiencies: SkillName[],
): SkillName[] {
  return [
    ...new Set([
      ...getSpeciesGrantedSkillProficiencies(speciesDetails),
      ...selectedSpeciesSkillProficiencies,
    ]),
  ];
}

export function validateCharacterSpeciesSelections(
  speciesDetails: SpeciesDetail | null,
  selectedSpeciesSkillProficiencies: SkillName[],
  selectedSpeciesChoices: Record<string, string>,
):
  | {
      valid: true;
      selectedSpeciesSkillProficiencies: SkillName[];
      selectedSpeciesChoices: Record<string, string>;
    }
  | {
      valid: false;
      error: string;
    } {
  const normalizedSelectedSpeciesSkillProficiencies = [
    ...new Set(selectedSpeciesSkillProficiencies),
  ];

  if (!speciesDetails) {
    if (
      normalizedSelectedSpeciesSkillProficiencies.length > 0 ||
      Object.keys(selectedSpeciesChoices).length > 0
    ) {
      return {
        valid: false,
        error:
          'Invalid character species selection payload: this character does not have a species that supports selections',
      };
    }

    return {
      valid: true,
      selectedSpeciesSkillProficiencies: [],
      selectedSpeciesChoices: {},
    };
  }

  const speciesSkillChoices = speciesDetails.speciesSkillProficiencyChoices;

  if (!speciesSkillChoices) {
    if (normalizedSelectedSpeciesSkillProficiencies.length > 0) {
      return {
        valid: false,
        error:
          'Invalid character species selection payload: this species does not allow skill proficiency choices',
      };
    }
  } else if (
    normalizedSelectedSpeciesSkillProficiencies.length > speciesSkillChoices.choose
  ) {
    return {
      valid: false,
      error: `Invalid character species selection payload: expected at most ${speciesSkillChoices.choose} species skill choice${speciesSkillChoices.choose === 1 ? '' : 's'}, received ${normalizedSelectedSpeciesSkillProficiencies.length}`,
    };
  } else {
    const allowedSpeciesSkillSet = new Set(speciesSkillChoices.options);
    const invalidSpeciesSkill = normalizedSelectedSpeciesSkillProficiencies.find(
      (skill) => !allowedSpeciesSkillSet.has(skill),
    );

    if (invalidSpeciesSkill) {
      return {
        valid: false,
        error: `Invalid character species selection payload: ${invalidSpeciesSkill} is not allowed by this species. Allowed skills: ${speciesSkillChoices.options.join(', ')}`,
      };
    }
  }

  const requiredSpeciesChoiceKeys = new Set(
    speciesDetails.speciesChoices.map((choice) => choice.key),
  );
  const providedSpeciesChoiceKeys = Object.keys(selectedSpeciesChoices);
  const extraSpeciesChoiceKey = providedSpeciesChoiceKeys.find(
    (key) => !requiredSpeciesChoiceKeys.has(key),
  );

  if (extraSpeciesChoiceKey) {
    return {
      valid: false,
      error: `Invalid character species selection payload: ${extraSpeciesChoiceKey} is not a valid species choice key`,
    };
  }

  for (const choice of speciesDetails.speciesChoices) {
    const selectedValue = selectedSpeciesChoices[choice.key];

    if (selectedValue === undefined) {
      continue;
    }

    if (typeof selectedValue !== 'string' || selectedValue.trim().length === 0) {
      return {
        valid: false,
        error: `Invalid character species selection payload: invalid selection for ${choice.key}`,
      };
    }

    const allowedOptionSlugs = new Set(choice.options.map((option) => option.slug));

    if (!allowedOptionSlugs.has(selectedValue)) {
      return {
        valid: false,
        error: `Invalid character species selection payload: ${selectedValue} is not allowed for ${choice.key}`,
      };
    }
  }

  return {
    valid: true,
    selectedSpeciesSkillProficiencies: normalizedSelectedSpeciesSkillProficiencies,
    selectedSpeciesChoices,
  };
}

export function getSpeciesPendingChoices(
  speciesDetails: SpeciesDetail | null,
  selectedSpeciesSkillProficiencies: SkillName[],
  selectedSpeciesChoices: Record<string, string>,
): CharacterPendingChoice[] {
  const pendingChoices: CharacterPendingChoice[] = [];
  const speciesSkillChoices = speciesDetails?.speciesSkillProficiencyChoices;

  if (
    speciesSkillChoices &&
    selectedSpeciesSkillProficiencies.length !== speciesSkillChoices.choose
  ) {
    pendingChoices.push('speciesSkillSelection');
  }

  if (
    speciesDetails &&
    speciesDetails.speciesChoices.length > 0 &&
    speciesDetails.speciesChoices.some(
      (choice) => selectedSpeciesChoices[choice.key] === undefined,
    )
  ) {
    pendingChoices.push('speciesChoiceSelection');
  }

  return pendingChoices;
}
