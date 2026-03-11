import { skills } from '@/app/data/skills';
import { NextResponse } from 'next/server';

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

  if (!Number.isNaN(parsedId)) {
    const skillById = skills.find((skill) => skill.id === parsedId);

    if (!skillById) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json(skillById, { status: 200 });
  }

  const normalizedIdentifier = normalizeSkillName(identifier);

  const skillByName = skills.find((skill) => {
    const normalizedName = normalizeSkillName(skill.name);
    const slugifiedName = slugifySkillName(skill.name);

    return (
      normalizedName === normalizedIdentifier ||
      slugifiedName === normalizedIdentifier
    );
  });

  if (!skillByName) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
  }

  return NextResponse.json(skillByName, { status: 200 });
}
