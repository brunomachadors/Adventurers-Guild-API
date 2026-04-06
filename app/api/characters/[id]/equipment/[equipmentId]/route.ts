import { getAuthenticatedOwnerFromRequest } from '@/app/lib/auth';
import {
  characterBelongsToOwner,
  characterEquipmentExists,
  getCharacterEquipment,
  removeCharacterEquipment,
  updateCharacterEquipment,
} from '@/app/lib/character-equipment';
import { CharacterEquipmentUpdateRequestBody } from '@/app/types/character';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    id: string;
    equipmentId: string;
  }>;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function isCharacterEquipmentUpdateRequestBody(
  value: unknown,
): value is CharacterEquipmentUpdateRequestBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    (('quantity' in value && isPositiveInteger(value.quantity)) ||
      ('isEquipped' in value && typeof value.isEquipped === 'boolean')) &&
    (!('quantity' in value) || isPositiveInteger(value.quantity)) &&
    (!('isEquipped' in value) || typeof value.isEquipped === 'boolean')
  );
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id, equipmentId } = await params;
  const parsedId = Number(id);
  const parsedEquipmentId = Number(equipmentId);
  const authenticatedOwner = getAuthenticatedOwnerFromRequest(request);

  if (!authenticatedOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  if (!Number.isInteger(parsedEquipmentId) || parsedEquipmentId <= 0) {
    return NextResponse.json(
      { error: 'Character equipment not found' },
      { status: 404 },
    );
  }

  try {
    const body = await request.json();

    if (!isCharacterEquipmentUpdateRequestBody(body)) {
      return NextResponse.json(
        { error: 'Invalid character equipment request payload' },
        { status: 400 },
      );
    }

    if (!(await characterBelongsToOwner(authenticatedOwner.id, parsedId))) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    if (!(await characterEquipmentExists(parsedId, parsedEquipmentId))) {
      return NextResponse.json(
        { error: 'Character equipment not found' },
        { status: 404 },
      );
    }

    await updateCharacterEquipment(parsedId, parsedEquipmentId, {
      quantity: body.quantity,
      isEquipped: body.isEquipped,
    });

    const characterEquipment = await getCharacterEquipment(
      authenticatedOwner.id,
      parsedId,
    );

    return NextResponse.json(characterEquipment, { status: 200 });
  } catch (error) {
    console.error('Failed to update character equipment:', error);

    return NextResponse.json(
      { error: 'Failed to update character equipment' },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const { id, equipmentId } = await params;
  const parsedId = Number(id);
  const parsedEquipmentId = Number(equipmentId);
  const authenticatedOwner = getAuthenticatedOwnerFromRequest(_);

  if (!authenticatedOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  if (!Number.isInteger(parsedEquipmentId) || parsedEquipmentId <= 0) {
    return NextResponse.json(
      { error: 'Character equipment not found' },
      { status: 404 },
    );
  }

  try {
    if (!(await characterBelongsToOwner(authenticatedOwner.id, parsedId))) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    if (!(await characterEquipmentExists(parsedId, parsedEquipmentId))) {
      return NextResponse.json(
        { error: 'Character equipment not found' },
        { status: 404 },
      );
    }

    await removeCharacterEquipment(parsedId, parsedEquipmentId);

    const characterEquipment = await getCharacterEquipment(
      authenticatedOwner.id,
      parsedId,
    );

    return NextResponse.json(characterEquipment, { status: 200 });
  } catch (error) {
    console.error('Failed to remove character equipment:', error);

    return NextResponse.json(
      { error: 'Failed to remove character equipment' },
      { status: 500 },
    );
  }
}
