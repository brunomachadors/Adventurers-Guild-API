import { attributes } from '@/app/data/attribute';
import { NextResponse } from 'next/server';


export async function GET() {
  return NextResponse.json(attributes, { status: 200 });
}