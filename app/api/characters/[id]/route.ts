import { getAuthenticatedOwnerFromRequest } from '@/app/lib/auth';
import {
  formatCharacterResponse,
  isCharacterAbilityScoresOrNull,
  isNullablePositiveInteger,
} from '@/app/lib/characters';
import { getSql } from '@/app/lib/db';
import { CharacterUpdateRequestBody } from '@/app/types/character';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function isCharacterUpdateRequestBody(
  value: unknown,
): value is CharacterUpdateRequestBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    (!('name' in value) || typeof value.name === 'string') &&
    (!('classId' in value) || isNullablePositiveInteger(value.classId)) &&
    (!('speciesId' in value) || isNullablePositiveInteger(value.speciesId)) &&
    (!('backgroundId' in value) ||
      isNullablePositiveInteger(value.backgroundId)) &&
    (!('level' in value) || isNullablePositiveInteger(value.level)) &&
    (!('abilityScores' in value) ||
      isCharacterAbilityScoresOrNull(value.abilityScores))
  );
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const parsedId = Number(id);
  const authenticatedOwner = getAuthenticatedOwnerFromRequest(request);

  if (!authenticatedOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  const sql = getSql();

  try {
    const characterRows = await sql`
      SELECT id, name, classid, speciesid, backgroundid, level, abilityscores
      FROM characters
      WHERE id = ${parsedId}
        AND ownerid = ${authenticatedOwner.id}
      LIMIT 1
    `;

    if (!characterRows || characterRows.length === 0) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

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

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch character detail:', error);

    return NextResponse.json(
      { error: 'Failed to fetch character detail' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const parsedId = Number(id);
  const authenticatedOwner = getAuthenticatedOwnerFromRequest(request);

  if (!authenticatedOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  try {
    const body = await request.json();

    if (!isCharacterUpdateRequestBody(body)) {
      return NextResponse.json(
        { error: 'Invalid character request payload' },
        { status: 400 },
      );
    }

    const sql = getSql();
    const existingRows = await sql`
      SELECT id, name, classid, speciesid, backgroundid, level, abilityscores
      FROM characters
      WHERE id = ${parsedId}
        AND ownerid = ${authenticatedOwner.id}
      LIMIT 1
    `;

    if (!existingRows || existingRows.length === 0) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    const existingCharacter = existingRows[0];
    const nextName =
      body.name !== undefined ? body.name.trim() : existingCharacter.name;

    if (!nextName) {
      return NextResponse.json(
        { error: 'Invalid character request payload' },
        { status: 400 },
      );
    }

    const nextClassId =
      body.classId !== undefined ? body.classId : existingCharacter.classid;
    const nextSpeciesId =
      body.speciesId !== undefined
        ? body.speciesId
        : existingCharacter.speciesid;
    const nextBackgroundId =
      body.backgroundId !== undefined
        ? body.backgroundId
        : existingCharacter.backgroundid;
    const nextLevel =
      body.level !== undefined ? body.level : Number(existingCharacter.level);
    const nextAbilityScores =
      body.abilityScores !== undefined
        ? body.abilityScores
        : existingCharacter.abilityscores;
    const nextStatus =
      nextClassId !== null &&
      nextSpeciesId !== null &&
      nextBackgroundId !== null
        ? 'complete'
        : 'draft';

    const characterRows = await sql`
      UPDATE characters
      SET
        name = ${nextName},
        status = ${nextStatus},
        classid = ${nextClassId},
        speciesid = ${nextSpeciesId},
        backgroundid = ${nextBackgroundId},
        level = ${nextLevel},
        abilityscores = ${nextAbilityScores},
        updatedat = NOW()
      WHERE id = ${parsedId}
        AND ownerid = ${authenticatedOwner.id}
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

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error('Failed to update character:', error);

    return NextResponse.json(
      { error: 'Failed to update character' },
      { status: 500 },
    );
  }
}
