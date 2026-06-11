import {
  SpeciesChoice,
  SpeciesChoiceOption,
  SpeciesDetail,
  SpeciesSkillProficiencyChoices,
  SpeciesSubspecies,
  SpeciesTrait,
} from '@/app/types/species';
import { SKILL_NAMES, SkillName } from '@/app/types/skill';

type SpeciesRow = Record<string, unknown>;

function toNumber(value: unknown): number {
  return typeof value === 'number' ? value : Number(value);
}

function toString(value: unknown): string {
  return typeof value === 'string' ? value : String(value ?? '');
}

export function isSpeciesTrait(value: unknown): value is SpeciesTrait {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'description' in value &&
    typeof value.name === 'string' &&
    typeof value.description === 'string'
  );
}

export function parseSpecialTraits(value: unknown): SpeciesTrait[] {
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

function isSpeciesSubspecies(value: unknown): value is SpeciesSubspecies {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'slug' in value &&
    'description' in value &&
    typeof value.name === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.description === 'string'
  );
}

function slugifyValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getGrantedSkillProficiencies(): SkillName[] {
  return [];
}

function getSpeciesSkillProficiencyChoices(
  speciesSlug: string,
): SpeciesSkillProficiencyChoices | null {
  switch (speciesSlug) {
    case 'elf':
      return {
        choose: 1,
        options: ['Insight', 'Perception', 'Survival'],
      };
    case 'human':
      return {
        choose: 1,
        options: [...SKILL_NAMES],
      };
    default:
      return null;
  }
}

function getGrantedToolProficiencies(): string[] {
  return [];
}

function getGrantedLanguageProficiencies(): string[] {
  return [];
}

function getSpeciesChoiceTrait(
  specialTraits: SpeciesTrait[],
  subspecies: SpeciesSubspecies[],
): SpeciesTrait | null {
  if (subspecies.length === 0) {
    return null;
  }

  return (
    specialTraits.find((trait) =>
      /(lineage|ancestry|legacy)/i.test(trait.name),
    ) ??
    specialTraits.find((trait) =>
      /(choose|select)/i.test(trait.description),
    ) ??
    null
  );
}

function buildSpeciesChoiceOptions(
  subspecies: SpeciesSubspecies[],
): SpeciesChoiceOption[] {
  return subspecies.map((subspeciesItem) => ({
    name: subspeciesItem.name,
    slug: subspeciesItem.slug,
    description: subspeciesItem.description,
  }));
}

function getSpeciesChoices(
  specialTraits: SpeciesTrait[],
  subspecies: SpeciesSubspecies[],
): SpeciesChoice[] {
  const choiceTrait = getSpeciesChoiceTrait(specialTraits, subspecies);

  if (!choiceTrait) {
    return [];
  }

  return [
    {
      key: slugifyValue(choiceTrait.name),
      label: choiceTrait.name,
      description: choiceTrait.description,
      choose: 1,
      options: buildSpeciesChoiceOptions(subspecies),
    },
  ];
}

export function parseSubspecies(value: unknown): SpeciesSubspecies[] {
  let parsed = value;

  if (typeof value === 'string') {
    try {
      parsed = JSON.parse(value);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter(isSpeciesSubspecies).map((subspecies) => ({
    name: subspecies.name,
    slug: subspecies.slug,
    description: subspecies.description,
    specialTraits: Array.isArray(subspecies.specialTraits)
      ? subspecies.specialTraits.filter(isSpeciesTrait)
      : [],
  }));
}

export function formatSpeciesDetail(speciesItem: SpeciesRow): SpeciesDetail {
  const slug = toString(speciesItem.slug);
  const specialTraits = parseSpecialTraits(speciesItem.specialtraits);
  const subspecies = parseSubspecies(speciesItem.subspecies);

  return {
    id: toNumber(speciesItem.id),
    name: toString(speciesItem.name),
    slug,
    description: toString(speciesItem.description),
    creatureType: toString(speciesItem.creaturetype),
    size: toString(speciesItem.size),
    speed: toNumber(speciesItem.speed),
    specialTraits,
    subspecies,
    grantedSkillProficiencies: getGrantedSkillProficiencies(),
    speciesSkillProficiencyChoices: getSpeciesSkillProficiencyChoices(slug),
    grantedToolProficiencies: getGrantedToolProficiencies(),
    grantedLanguageProficiencies: getGrantedLanguageProficiencies(),
    speciesChoices: getSpeciesChoices(specialTraits, subspecies),
  };
}
