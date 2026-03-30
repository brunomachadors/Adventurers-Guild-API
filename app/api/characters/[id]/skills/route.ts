import { getAuthenticatedOwnerFromRequest } from '@/app/lib/auth';
import { getCharacterSkills } from '@/app/lib/character-skills';
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
    const characterSkills = await getCharacterSkills(
      authenticatedOwner.id,
      parsedId,
    );

    if (!characterSkills) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(characterSkills, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch character skills:', error);

    return NextResponse.json(
      { error: 'Failed to fetch character skills' },
      { status: 500 },
    );
  }
}
