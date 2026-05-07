import { getAuthenticatedOwnerFromRequest } from '@/app/lib/auth';
import {
  getCharacterAbilityScoreRulesByBackgroundId,
  validateCharacterAbilityScoresInput,
} from '@/app/lib/character-ability-scores';
import {
  formatCharacterResponse,
  getCharacterSkillProficienciesWithBackground,
  isCharacterAbilityScoresOrNull,
  isCharacterCurrencyOrNull,
  isNullablePositiveInteger,
  isSkillProficiencies,
  serializeCharacterAbilityScoresInput,
  serializeCharacterCurrency,
  serializeSkillProficiencies,
  validateCharacterSkillProficienciesInput,
} from '@/app/lib/characters';
import { getSql } from '@/app/lib/db';
import {
  CharacterAbilityScoresInput,
  CharacterCreateRequestBody,
  CharacterListItem,
} from '@/app/types/character';
import { NextResponse } from 'next/server';

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
      isCharacterAbilityScoresOrNull(value.abilityScores)) &&
    (!('currency' in value) || isCharacterCurrencyOrNull(value.currency)) &&
    (!('skillProficiencies' in value) ||
      isSkillProficiencies(value.skillProficiencies))
  );
}

function getCharacterListStatus(
  character: Record<string, unknown>,
): CharacterListItem['status'] {
  const hasStarted =
    character.classid !== null ||
    character.speciesid !== null ||
    character.backgroundid !== null;

  if (!hasStarted) {
    return 'draft';
  }

  if (character.abilityscores === null) {
    return 'in_progress';
  }

  return character.status === 'complete' ? 'complete' : 'in_progress';
}

export async function GET(request: Request) {
  const authenticatedOwner = getAuthenticatedOwnerFromRequest(request);

  if (!authenticatedOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sql = getSql();
    const characterRows = await sql`
      SELECT
        id,
        name,
        status,
        classid,
        speciesid,
        backgroundid,
        level,
        abilityscores,
        currency,
        skillproficiencies
      FROM characters
      WHERE ownerid = ${authenticatedOwner.id}
      ORDER BY id
    `;

    const responseBody: CharacterListItem[] = characterRows.map((character) => ({
      id: Number(character.id),
      name: character.name,
      level: Number(character.level),
      status: getCharacterListStatus(character),
    }));

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
    let abilityScores: CharacterAbilityScoresInput | null = null;

    if (body.abilityScores !== undefined && body.abilityScores !== null) {
      const selectionRules =
        await getCharacterAbilityScoreRulesByBackgroundId(backgroundId);
      const validationResult = validateCharacterAbilityScoresInput({
        abilityScores: body.abilityScores,
        characterLevel: level,
        selectionRules,
      });

      if (!validationResult.valid) {
        return NextResponse.json(
          { error: validationResult.error },
          { status: 400 },
        );
      }

      abilityScores = serializeCharacterAbilityScoresInput(
        validationResult.abilityScores,
      );
    }
    const currency =
      body.currency === undefined || body.currency === null
        ? null
        : serializeCharacterCurrency(body.currency);
    let providedSkillProficiencies = body.skillProficiencies;

    if (body.skillProficiencies !== undefined) {
      const validationResult = await validateCharacterSkillProficienciesInput({
        classId,
        backgroundId,
        skillProficiencies: body.skillProficiencies,
      });

      if (!validationResult.valid) {
        return NextResponse.json(
          { error: validationResult.error },
          { status: 400 },
        );
      }

      providedSkillProficiencies = validationResult.skillProficiencies;
    }

    const skillProficiencies = serializeSkillProficiencies(
      await getCharacterSkillProficienciesWithBackground({
        existingSkillProficiencies: [],
        providedSkillProficiencies,
        previousBackgroundId: null,
        nextBackgroundId: backgroundId,
      }),
    );
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
        abilityscores,
        currency,
        skillproficiencies
      )
      VALUES (
        ${authenticatedOwner.id},
        ${name},
        ${status},
        ${classId},
        ${speciesId},
        ${backgroundId},
        ${level},
        ${abilityScores},
        ${currency},
        ${skillProficiencies}::jsonb
      )
      RETURNING id, name, classid, speciesid, backgroundid, level, abilityscores, currency, skillproficiencies
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
      currency: character.currency,
      skillProficiencies: character.skillproficiencies,
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
