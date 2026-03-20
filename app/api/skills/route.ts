import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

export async function GET() {
  const skills = await sql`
    SELECT id, name
    FROM skills
    ORDER BY id
  `;

  return NextResponse.json(skills, { status: 200 });
}
