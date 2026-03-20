import { NextResponse } from 'next/server';
import { sql } from '@/app/lib/db';

interface RouteContext {
  params: Promise<{
    identifier: string;
  }>;
}

function normalizeSkillName(value: string): string {
  return value.trim().toLowerCase();
}

function slugifySkillName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

export async function GET(_: Request, { params }: RouteContext) {
  const { identifier } = await params;
  const parsedId = Number(identifier);

  let skillRows;

  if (!Number.isNaN(parsedId)) {
    skillRows = await sql`
      SELECT id, name, attribute, description, exampleofuse
      FROM skills
      WHERE id = ${parsedId}
    `;
  } else {
    const allSkills = await sql`
      SELECT id, name, attribute, description, exampleofuse
      FROM skills
    `;

    const normalizedIdentifier = normalizeSkillName(identifier);

    skillRows = allSkills.filter((skill) => {
      const normalizedName = normalizeSkillName(skill.name);
      const slugifiedName = slugifySkillName(skill.name);

      return (
        normalizedName === normalizedIdentifier ||
        slugifiedName === normalizedIdentifier
      );
    });
  }

  if (!skillRows || skillRows.length === 0) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
  }

  const skill = skillRows[0];

  const classRows = await sql`
    SELECT className
    FROM skillClasses
    WHERE skillId = ${skill.id}
  `;

  const formattedSkill = {
    id: skill.id,
    name: skill.name,
    attribute: skill.attribute,
    description: skill.description,
    exampleofuse: skill.exampleofuse,
    commonclasses: classRows.map((row) => row.classname),
  };

  return NextResponse.json(formattedSkill, { status: 200 });
}
