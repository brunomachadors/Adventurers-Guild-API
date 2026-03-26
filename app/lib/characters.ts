import {
  CharacterClassDetails,
  CharacterMissingField,
  CharacterResponseBody,
  CharacterStatus,
} from '@/app/types/character';
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

export async function formatCharacterResponse(character: {
  id: number | string;
  name: string;
  classId: number | string | null;
  speciesId: number | string | null;
  backgroundId: number | string | null;
  level: number | string;
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
  };

  const missingFields = getCharacterMissingFields(formattedCharacter);

  return {
    ...formattedCharacter,
    status: getCharacterStatus(missingFields),
    missingFields,
    classDetails: await getCharacterClassDetails(
      formattedCharacter.classId,
      formattedCharacter.level,
    ),
  };
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
