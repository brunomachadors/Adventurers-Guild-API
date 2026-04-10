import { getAuthenticatedOwnerFromRequest } from '@/app/lib/auth';
import {
  buildCharacterEquipmentPackageChoiceResponse,
  isCharacterEquipmentPackageChoiceRequestBody,
  resolveCharacterEquipmentPackageChoice,
} from '@/app/lib/character-equipment-package-choices';
import { getOwnedCharacterResponse } from '@/app/lib/characters';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(request: Request, { params }: RouteContext) {
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

    if (!isCharacterEquipmentPackageChoiceRequestBody(body)) {
      return NextResponse.json(
        { error: 'Invalid character equipment choice payload' },
        { status: 400 },
      );
    }

    const character = await getOwnedCharacterResponse(
      authenticatedOwner.id,
      parsedId,
    );

    if (!character) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    const selection = await resolveCharacterEquipmentPackageChoice({
      ownerId: authenticatedOwner.id,
      characterId: parsedId,
      source: 'background',
      body,
      character,
    });
    const updatedCharacter = await getOwnedCharacterResponse(
      authenticatedOwner.id,
      parsedId,
    );

    if (!updatedCharacter) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      buildCharacterEquipmentPackageChoiceResponse({
        characterId: parsedId,
        selection,
        pendingChoices: updatedCharacter.pendingChoices,
      }),
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'No background equipment selection pending' ||
        error.message === 'Invalid character equipment choice payload'
      ) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (error.message === 'Selected package option not found') {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }
    }

    console.error('Failed to resolve background equipment choice:', error);

    return NextResponse.json(
      { error: 'Failed to resolve background equipment choice' },
      { status: 500 },
    );
  }
}
