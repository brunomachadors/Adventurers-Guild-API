import { sql } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  const attributes = await sql`SELECT * FROM attributes ORDER BY id`;
  const skills = await sql`SELECT name, attribute FROM skills`;

  const formatted = attributes.map((attr) => ({
    id: attr.id,
    name: attr.name,
    shortname: attr.shortname,
    description: attr.description,
    skills: skills
      .filter((skill) => skill.attribute === attr.shortname)
      .map((skill) => skill.name),
  }));

  return NextResponse.json(formatted);
}
