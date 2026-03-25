import { getSql } from '@/app/lib/db';
import { BackgroundListItem } from '@/app/types/background';
import { NextResponse } from 'next/server';

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

export async function GET() {
  const sql = getSql();

  try {
    const backgroundRows = await sql`
      SELECT id, name
      FROM backgrounds
      ORDER BY id
    `;

    const backgrounds: BackgroundListItem[] = backgroundRows.map(
      (background) => ({
        id: toNumber(background.id),
        name: background.name,
      }),
    );

    return NextResponse.json(backgrounds, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch backgrounds:', error);

    return NextResponse.json(
      { error: 'Failed to fetch backgrounds' },
      { status: 500 },
    );
  }
}
