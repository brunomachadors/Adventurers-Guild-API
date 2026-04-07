import { getSql } from '@/app/lib/db';
import { formatSpeciesDetail } from '@/app/lib/species';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    identifier: string;
  }>;
}

function normalizeSpeciesValue(value: string): string {
  return value.trim().toLowerCase();
}

export async function GET(_: Request, { params }: RouteContext) {
  const { identifier } = await params;
  const parsedId = Number(identifier);
  const sql = getSql();

  try {
    let speciesRows;

    if (!Number.isNaN(parsedId)) {
      speciesRows = await sql`
        SELECT
          id,
          name,
          slug,
          description,
          creaturetype,
          size,
          speed,
          specialtraits,
          subspecies
        FROM species
        WHERE id = ${parsedId}
      `;
    } else {
      const normalizedIdentifier = normalizeSpeciesValue(identifier);

      speciesRows = await sql`
        SELECT
          id,
          name,
          slug,
          description,
          creaturetype,
          size,
          speed,
          specialtraits,
          subspecies
        FROM species
        WHERE LOWER(name) = ${normalizedIdentifier}
          OR LOWER(slug) = ${normalizedIdentifier}
      `;
    }

    if (!speciesRows || speciesRows.length === 0) {
      return NextResponse.json({ error: 'Species not found' }, { status: 404 });
    }

    const speciesItem = speciesRows[0];

    const formattedSpecies = formatSpeciesDetail(speciesItem);

    return NextResponse.json(formattedSpecies, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch species detail:', error);

    return NextResponse.json(
      { error: 'Failed to fetch species detail' },
      { status: 500 },
    );
  }
}
