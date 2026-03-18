import { NextResponse } from 'next/server';
import { classesList } from '@/app/data/classes';

export async function GET() {
  return NextResponse.json(classesList, { status: 200 });
}
