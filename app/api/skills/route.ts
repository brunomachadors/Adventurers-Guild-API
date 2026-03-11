import { skills } from '@/app/data/skills';
import { SkillListItem } from '@/app/types/skill';
import { NextResponse } from 'next/server';

export async function GET() {
  const skillList: SkillListItem[] = skills.map(({ id, name }) => ({
    id,
    name,
  }));

  return NextResponse.json(skillList, { status: 200 });
}
