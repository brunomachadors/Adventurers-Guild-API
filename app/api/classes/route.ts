import { sql } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const classes = await sql`
      SELECT id, name
      FROM classes
      ORDER BY id
    `;

    return NextResponse.json(classes, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch classes:', error);

    return NextResponse.json(
      { error: 'Failed to fetch classes' },
      { status: 500 },
    );
  }
}
