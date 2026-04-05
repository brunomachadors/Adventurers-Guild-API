import { getSql } from '@/app/lib/db';
import { EquipmentListItem } from '@/app/types/equipment';
import { NextResponse } from 'next/server';

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

export async function GET() {
  const sql = getSql();

  try {
    const equipmentRows = await sql`
      SELECT id, name, category, type, cost, weight, ismagical
      FROM equipment
      ORDER BY id
    `;

    const equipment: EquipmentListItem[] = equipmentRows.map((item) => ({
      id: toNumber(item.id),
      name: item.name,
      category: item.category,
      type: item.type,
      cost: item.cost,
      weight: item.weight === null ? null : toNumber(item.weight),
      isMagical: Boolean(item.ismagical),
    }));

    return NextResponse.json(equipment, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch equipment:', error);

    return NextResponse.json(
      { error: 'Failed to fetch equipment' },
      { status: 500 },
    );
  }
}
