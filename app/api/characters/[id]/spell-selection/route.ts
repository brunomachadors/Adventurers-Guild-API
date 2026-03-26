import { getAuthenticatedOwnerFromRequest } from '@/app/lib/auth';
import { getCharacterSpellSelectionContext } from '@/app/lib/character-spells';
import { CharacterSpellSelectionResponseBody } from '@/app/types/character';
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
    const context = await getCharacterSpellSelectionContext(
      authenticatedOwner.id,
      parsedId,
    );

    if (!context) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    const responseBody: CharacterSpellSelectionResponseBody = {
      characterId: context.characterId,
      classId: context.classId,
      className: context.className,
      level: context.level,
      selectionRules: context.selectionRules,
      selectedSpells: context.selectedSpells,
      availableSpells: context.availableSpells,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch character spell selection:', error);

    return NextResponse.json(
      { error: 'Failed to fetch character spell selection' },
      { status: 500 },
    );
  }
}
