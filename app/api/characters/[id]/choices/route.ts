import { getCharacterChoicesResponse } from '@/app/lib/character-choices';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  try {
    const responseBody = await getCharacterChoicesResponse(parsedId);

    if (!responseBody) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch character choices:', error);

    return NextResponse.json(
      { error: 'Failed to fetch character choices' },
      { status: 500 },
    );
  }
}
