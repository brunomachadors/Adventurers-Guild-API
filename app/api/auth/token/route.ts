import { authenticateOwner, signAuthToken } from '@/app/lib/auth';
import { TokenRequestBody, TokenResponseBody } from '@/app/types/auth';
import { NextResponse } from 'next/server';

function isTokenRequestBody(value: unknown): value is TokenRequestBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'username' in value &&
    'password' in value &&
    typeof value.username === 'string' &&
    typeof value.password === 'string'
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isTokenRequestBody(body)) {
      return NextResponse.json(
        { error: 'Invalid token request payload' },
        { status: 400 },
      );
    }

    const username = body.username.trim();
    const password = body.password;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Invalid token request payload' },
        { status: 400 },
      );
    }

    const owner = await authenticateOwner(username, password);

    if (!owner) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 },
      );
    }

    const token = signAuthToken(owner);
    const responseBody: TokenResponseBody = { token };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error('Failed to issue token:', error);

    return NextResponse.json(
      { error: 'Failed to issue token' },
      { status: 500 },
    );
  }
}
