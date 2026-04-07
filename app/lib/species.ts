import {
  SpeciesDetail,
  SpeciesSubspecies,
  SpeciesTrait,
} from '@/app/types/species';

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
  return {
    id: toNumber(speciesItem.id),
    name: toString(speciesItem.name),
    slug: toString(speciesItem.slug),
    description: toString(speciesItem.description),
    creatureType: toString(speciesItem.creaturetype),
    size: toString(speciesItem.size),
    speed: toNumber(speciesItem.speed),
    specialTraits: parseSpecialTraits(speciesItem.specialtraits),
    subspecies: parseSubspecies(speciesItem.subspecies),
  };
}
