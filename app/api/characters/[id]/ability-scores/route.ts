import { getAuthenticatedOwnerFromRequest } from '@/app/lib/auth';
import { getCharacterAbilityScoreSelectionContext } from '@/app/lib/character-ability-scores';
import {
  isCharacterAbilityScoresInput,
  serializeCharacterAbilityScoresInput,
} from '@/app/lib/characters';
import { getSql } from '@/app/lib/db';
import {
  CharacterAbilityScoreOptionsResponseBody,
  CharacterAbilityScoresUpdateRequestBody,
} from '@/app/types/character';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function isCharacterAbilityScoresUpdateRequestBody(
  value: unknown,
): value is CharacterAbilityScoresUpdateRequestBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'abilityScores' in value &&
    isCharacterAbilityScoresInput(value.abilityScores)
  );
}

export async function PUT(request: Request, { params }: RouteContext) {
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

    if (!isCharacterAbilityScoresUpdateRequestBody(body)) {
      return NextResponse.json(
        { error: 'Invalid character ability scores payload' },
        { status: 400 },
      );
    }

    const context = await getCharacterAbilityScoreSelectionContext(
      authenticatedOwner.id,
      parsedId,
    );

    if (!context) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    if (!context.selectionRules || context.backgroundId === null) {
      return NextResponse.json(
        { error: 'Ability score selection is not available for this character' },
        { status: 400 },
      );
    }

    const sql = getSql();
    await sql`
      UPDATE characters
      SET abilityscores = ${serializeCharacterAbilityScoresInput(body.abilityScores)}, updatedat = NOW()
      WHERE id = ${parsedId}
        AND ownerid = ${authenticatedOwner.id}
    `;

    const updatedContext = await getCharacterAbilityScoreSelectionContext(
      authenticatedOwner.id,
      parsedId,
    );

    if (!updatedContext) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    const responseBody: CharacterAbilityScoreOptionsResponseBody = {
      characterId: updatedContext.characterId,
      backgroundId: updatedContext.backgroundId,
      backgroundName: updatedContext.backgroundName,
      selectionRules: updatedContext.selectionRules,
      selectedAbilityScores: updatedContext.selectedAbilityScores,
      availableChoices: updatedContext.availableChoices,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error('Failed to update character ability scores:', error);

    return NextResponse.json(
      { error: 'Failed to update character ability scores' },
      { status: 500 },
    );
  }
}
