import { getSql } from '@/app/lib/db';
import { SpeciesListItem } from '@/app/types/species';
import { NextResponse } from 'next/server';

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

export async function GET() {
  const sql = getSql();

  try {
    const speciesRows = await sql`
      SELECT id, name
      FROM species
      ORDER BY id
    `;

    const species: SpeciesListItem[] = speciesRows.map((speciesItem) => ({
      id: toNumber(speciesItem.id),
      name: speciesItem.name,
    }));

    return NextResponse.json(species, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch species:', error);

    return NextResponse.json(
      { error: 'Failed to fetch species' },
      { status: 500 },
    );
  }
}
