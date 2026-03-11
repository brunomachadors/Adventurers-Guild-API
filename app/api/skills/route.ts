import { skills } from '@/app/data/skills';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(skills, { status: 200 });
}
