import { getSql } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const sql = getSql();

  const skills = await sql`
    SELECT id, name
    FROM skills
    ORDER BY id
  `;

  return NextResponse.json(skills, { status: 200 });
}
