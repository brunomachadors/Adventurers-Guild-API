import { getAuthenticatedOwnerFromRequest } from '@/app/lib/auth';
import {
  addCharacterEquipment,
  characterBelongsToOwner,
  equipmentExists,
  getCharacterEquipment,
} from '@/app/lib/character-equipment';
import { CharacterEquipmentAddRequestBody } from '@/app/types/character';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

function isCharacterEquipmentAddRequestBody(
  value: unknown,
): value is CharacterEquipmentAddRequestBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'equipmentId' in value &&
    isPositiveInteger(value.equipmentId) &&
    (!('quantity' in value) || isPositiveInteger(value.quantity)) &&
    (!('isEquipped' in value) || typeof value.isEquipped === 'boolean')
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

  try {
    const characterEquipment = await getCharacterEquipment(
      authenticatedOwner.id,
      parsedId,
    );

    if (!characterEquipment) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(characterEquipment, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch character equipment:', error);

    return NextResponse.json(
      { error: 'Failed to fetch character equipment' },
      { status: 500 },
    );
  }
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

    if (!isCharacterEquipmentAddRequestBody(body)) {
      return NextResponse.json(
        { error: 'Invalid character equipment request payload' },
        { status: 400 },
      );
    }

    const characterExists = await characterBelongsToOwner(
      authenticatedOwner.id,
      parsedId,
    );

    if (!characterExists) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    if (!(await equipmentExists(body.equipmentId))) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 },
      );
    }

    await addCharacterEquipment(
      parsedId,
      body.equipmentId,
      body.quantity ?? 1,
      body.isEquipped ?? false,
    );

    const characterEquipment = await getCharacterEquipment(
      authenticatedOwner.id,
      parsedId,
    );

    return NextResponse.json(characterEquipment, { status: 201 });
  } catch (error) {
    console.error('Failed to add character equipment:', error);

    return NextResponse.json(
      { error: 'Failed to add character equipment' },
      { status: 500 },
    );
  }
}
