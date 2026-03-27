import { getAuthenticatedOwnerFromRequest } from '@/app/lib/auth';
import { getCharacterAbilityScoreSelectionContext } from '@/app/lib/character-ability-scores';
import { CharacterAbilityScoreOptionsResponseBody } from '@/app/types/character';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
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

  try {
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

    const responseBody: CharacterAbilityScoreOptionsResponseBody = {
      characterId: context.characterId,
      backgroundId: context.backgroundId,
      backgroundName: context.backgroundName,
      selectionRules: context.selectionRules,
      selectedAbilityScores: context.selectedAbilityScores,
      availableChoices: context.availableChoices,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch character ability score options:', error);

    return NextResponse.json(
      { error: 'Failed to fetch character ability score options' },
      { status: 500 },
    );
  }
}
