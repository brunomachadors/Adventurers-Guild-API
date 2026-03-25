import { getSql } from '@/app/lib/db';
import { SpellListItem } from '@/app/types/spell';
import { NextResponse } from 'next/server';

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

export async function GET() {
  const sql = getSql();

  try {
    const spellRows = await sql`
      SELECT id, name, level, levellabel
      FROM spells
      ORDER BY id
    `;

    const spells: SpellListItem[] = spellRows.map((spell) => ({
      id: toNumber(spell.id),
      name: spell.name,
      level: toNumber(spell.level),
      levelLabel: spell.levellabel,
    }));

    return NextResponse.json(spells, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch spells:', error);

    return NextResponse.json(
      { error: 'Failed to fetch spells' },
      { status: 500 },
    );
  }
}
