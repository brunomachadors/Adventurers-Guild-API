import { getSql } from '@/app/lib/db';
import { BackgroundDetail } from '@/app/types/background';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    identifier: string;
  }>;
}

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function normalizeBackgroundValue(value: string): string {
  return value.trim().toLowerCase();
}

export async function GET(_: Request, { params }: RouteContext) {
  const { identifier } = await params;
  const parsedId = Number(identifier);
  const sql = getSql();

  try {
    let backgroundRows;

    if (!Number.isNaN(parsedId)) {
      backgroundRows = await sql`
        SELECT
          id,
          name,
          slug,
          description,
          abilityscores,
          feat,
          skillproficiencies,
          toolproficiency,
          equipmentoptions
        FROM backgrounds
        WHERE id = ${parsedId}
      `;
    } else {
      const normalizedIdentifier = normalizeBackgroundValue(identifier);

      backgroundRows = await sql`
        SELECT
          id,
          name,
          slug,
          description,
          abilityscores,
          feat,
          skillproficiencies,
          toolproficiency,
          equipmentoptions
        FROM backgrounds
        WHERE LOWER(name) = ${normalizedIdentifier}
          OR LOWER(slug) = ${normalizedIdentifier}
      `;
    }

    if (!backgroundRows || backgroundRows.length === 0) {
      return NextResponse.json(
        { error: 'Background not found' },
        { status: 404 },
      );
    }

    const background = backgroundRows[0];

    const formattedBackground: BackgroundDetail = {
      id: toNumber(background.id),
      name: background.name,
      slug: background.slug,
      description: background.description,
      abilityScores: background.abilityscores,
      feat: background.feat,
      skillProficiencies: background.skillproficiencies,
      toolProficiency: background.toolproficiency,
      equipmentOptions: background.equipmentoptions,
    };

    return NextResponse.json(formattedBackground, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch background detail:', error);

    return NextResponse.json(
      { error: 'Failed to fetch background detail' },
      { status: 500 },
    );
  }
}
