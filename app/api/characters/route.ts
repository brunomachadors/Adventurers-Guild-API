import { getAuthenticatedOwnerFromRequest } from '@/app/lib/auth';
import {
  formatCharacterResponse,
  getCharacterMissingFields,
  getCharacterStatus,
  isCharacterAbilityScoresOrNull,
  isNullablePositiveInteger,
} from '@/app/lib/characters';
import { getSql } from '@/app/lib/db';
import {
  CharacterCreateRequestBody,
  CharacterListItem,
} from '@/app/types/character';
import { NextResponse } from 'next/server';

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function isCharacterCreateRequestBody(
  value: unknown,
): value is CharacterCreateRequestBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof value.name === 'string' &&
    (!('classId' in value) || isNullablePositiveInteger(value.classId)) &&
    (!('speciesId' in value) || isNullablePositiveInteger(value.speciesId)) &&
    (!('backgroundId' in value) ||
      isNullablePositiveInteger(value.backgroundId)) &&
    (!('level' in value) || isNullablePositiveInteger(value.level)) &&
    (!('abilityScores' in value) ||
      isCharacterAbilityScoresOrNull(value.abilityScores))
  );
}

function formatCharacterListItem(character: {
  id: number | string;
  name: string;
  classId: number | string | null;
  speciesId: number | string | null;
  backgroundId: number | string | null;
  level: number | string;
}): CharacterListItem {
  const formattedCharacter = {
    id: toNumber(character.id),
    name: character.name,
    level: toNumber(character.level),
  };

  const missingFields = getCharacterMissingFields({
    classId:
      character.classId === null ? null : toNumber(character.classId),
    speciesId:
      character.speciesId === null ? null : toNumber(character.speciesId),
    backgroundId:
      character.backgroundId === null ? null : toNumber(character.backgroundId),
  });

  return {
    ...formattedCharacter,
    status: getCharacterStatus(missingFields),
  };
}

export async function GET(request: Request) {
  const authenticatedOwner = getAuthenticatedOwnerFromRequest(request);

  if (!authenticatedOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sql = getSql();
    const characterRows = await sql`
      SELECT id, name, classid, speciesid, backgroundid, level
      FROM characters
      WHERE ownerid = ${authenticatedOwner.id}
      ORDER BY id
    `;

    const responseBody = characterRows.map((character) =>
      formatCharacterListItem({
        id: character.id,
        name: character.name,
        classId: character.classid,
        speciesId: character.speciesid,
        backgroundId: character.backgroundid,
        level: character.level,
      }),
    );

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch characters:', error);

    return NextResponse.json(
      { error: 'Failed to fetch characters' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const authenticatedOwner = getAuthenticatedOwnerFromRequest(request);

  if (!authenticatedOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (!isCharacterCreateRequestBody(body)) {
      return NextResponse.json(
        { error: 'Invalid character request payload' },
        { status: 400 },
      );
    }

    const name = body.name.trim();

    if (!name) {
      return NextResponse.json(
        { error: 'Invalid character request payload' },
        { status: 400 },
      );
    }

    const classId = body.classId ?? null;
    const speciesId = body.speciesId ?? null;
    const backgroundId = body.backgroundId ?? null;
    const level = body.level ?? 1;
    const abilityScores = body.abilityScores ?? null;
    const status =
      classId !== null && speciesId !== null && backgroundId !== null
        ? 'complete'
        : 'draft';

    const sql = getSql();
    const characterRows = await sql`
      INSERT INTO characters (
        ownerid,
        name,
        status,
        classid,
        speciesid,
        backgroundid,
        level,
        abilityscores
      )
      VALUES (
        ${authenticatedOwner.id},
        ${name},
        ${status},
        ${classId},
        ${speciesId},
        ${backgroundId},
        ${level},
        ${abilityScores}
      )
      RETURNING id, name, classid, speciesid, backgroundid, level, abilityscores
    `;

    const character = characterRows[0];
    const responseBody = await formatCharacterResponse({
      id: character.id,
      name: character.name,
      classId: character.classid,
      speciesId: character.speciesid,
      backgroundId: character.backgroundid,
      level: character.level,
      abilityScores: character.abilityscores,
    });

    return NextResponse.json(responseBody, { status: 201 });
  } catch (error) {
    console.error('Failed to create character:', error);

    return NextResponse.json(
      { error: 'Failed to create character' },
      { status: 500 },
    );
  }
}
