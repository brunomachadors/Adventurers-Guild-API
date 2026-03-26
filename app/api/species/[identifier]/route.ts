import { getSql } from '@/app/lib/db';
import { SpeciesDetail, SpeciesTrait } from '@/app/types/species';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    identifier: string;
  }>;
}

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function normalizeSpeciesValue(value: string): string {
  return value.trim().toLowerCase();
}

function isSpeciesTrait(value: unknown): value is SpeciesTrait {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    'description' in value &&
    typeof value.name === 'string' &&
    typeof value.description === 'string'
  );
}

function parseSpecialTraits(value: unknown): SpeciesTrait[] {
  if (Array.isArray(value)) {
    return value.filter(isSpeciesTrait);
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);

      return Array.isArray(parsed) ? parsed.filter(isSpeciesTrait) : [];
    } catch {
      return [];
    }
  }

  return [];
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
          specialtraits
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
          specialtraits
        FROM species
        WHERE LOWER(name) = ${normalizedIdentifier}
          OR LOWER(slug) = ${normalizedIdentifier}
      `;
    }

    if (!speciesRows || speciesRows.length === 0) {
      return NextResponse.json({ error: 'Species not found' }, { status: 404 });
    }

    const speciesItem = speciesRows[0];

    const formattedSpecies: SpeciesDetail = {
      id: toNumber(speciesItem.id),
      name: speciesItem.name,
      slug: speciesItem.slug,
      description: speciesItem.description,
      creatureType: speciesItem.creaturetype,
      size: speciesItem.size,
      speed: toNumber(speciesItem.speed),
      specialTraits: parseSpecialTraits(speciesItem.specialtraits),
    };

    return NextResponse.json(formattedSpecies, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch species detail:', error);

    return NextResponse.json(
      { error: 'Failed to fetch species detail' },
      { status: 500 },
    );
  }
}
