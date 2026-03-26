import { createHmac, scrypt, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

import { getSql } from '@/app/lib/db';
import { AuthTokenPayload, AuthenticatedOwner } from '@/app/types/auth';

const scryptAsync = promisify(scrypt);
const JWT_ALGORITHM = 'HS256';
const TOKEN_EXPIRATION_SECONDS = 60 * 60;

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function base64UrlEncode(value: string | Buffer): string {
  const buffer = typeof value === 'string' ? Buffer.from(value) : value;

  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(value: string): Buffer {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = (4 - (normalized.length % 4)) % 4;

  return Buffer.from(`${normalized}${'='.repeat(padding)}`, 'base64');
}

function getJwtSecret(): string {
  const secret = process.env.AUTH_JWT_SECRET ?? process.env.JWT_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'dev-only-jwt-secret-change-me';
  }

  throw new Error('JWT secret is not configured');
}

function signJwtSegment(value: string, secret: string): string {
  return base64UrlEncode(createHmac('sha256', secret).update(value).digest());
}

function parseStoredPasswordHash(passwordHash: string) {
  const [algorithm, salt, storedHash] = passwordHash.split(':');

  if (
    algorithm !== 'scrypt' ||
    !salt ||
    !storedHash ||
    passwordHash.split(':').length !== 3
  ) {
    throw new Error('Invalid password hash format');
  }

  return {
    salt,
    storedHash,
  };
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  try {
    const { salt, storedHash } = parseStoredPasswordHash(passwordHash);
    const storedBuffer = Buffer.from(storedHash, 'hex');
    const derivedBuffer = (await scryptAsync(
      password,
      salt,
      storedBuffer.length,
    )) as Buffer;

    if (storedBuffer.length !== derivedBuffer.length) {
      return false;
    }

    return timingSafeEqual(storedBuffer, derivedBuffer);
  } catch {
    return false;
  }
}

export function signAuthToken(owner: AuthenticatedOwner): string {
  const secret = getJwtSecret();
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: JWT_ALGORITHM,
    typ: 'JWT',
  };

  const payload: AuthTokenPayload = {
    sub: String(owner.id),
    ownerId: owner.id,
    username: owner.username,
    iat: now,
    exp: now + TOKEN_EXPIRATION_SECONDS,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = signJwtSegment(unsignedToken, secret);

  return `${unsignedToken}.${signature}`;
}

export function verifyAuthToken(token: string): AuthTokenPayload | null {
  try {
    const secret = getJwtSecret();
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      return null;
    }

    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = signJwtSegment(unsignedToken, secret);
    const providedSignature = base64UrlDecode(signature);
    const expectedSignatureBuffer = base64UrlDecode(expectedSignature);

    if (
      providedSignature.length !== expectedSignatureBuffer.length ||
      !timingSafeEqual(providedSignature, expectedSignatureBuffer)
    ) {
      return null;
    }

    const payload = JSON.parse(
      base64UrlDecode(encodedPayload).toString('utf8'),
    ) as Partial<AuthTokenPayload>;

    if (
      typeof payload.sub !== 'string' ||
      typeof payload.ownerId !== 'number' ||
      typeof payload.username !== 'string' ||
      typeof payload.iat !== 'number' ||
      typeof payload.exp !== 'number'
    ) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);

    if (payload.exp <= now) {
      return null;
    }

    return payload as AuthTokenPayload;
  } catch {
    return null;
  }
}

export function extractBearerToken(
  authorizationHeader: string | null,
): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

export async function getOwnerByUsername(
  username: string,
): Promise<(AuthenticatedOwner & { passwordHash: string }) | null> {
  const sql = getSql();
  const ownerRows = await sql`
    SELECT id, username, label, passwordhash
    FROM owners
    WHERE username = ${username}
    LIMIT 1
  `;

  if (!ownerRows || ownerRows.length === 0) {
    return null;
  }

  const owner = ownerRows[0];

  return {
    id: toNumber(owner.id),
    username: owner.username,
    label: owner.label ?? null,
    passwordHash: owner.passwordhash,
  };
}

export async function authenticateOwner(
  username: string,
  password: string,
): Promise<AuthenticatedOwner | null> {
  const owner = await getOwnerByUsername(username);

  if (!owner) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, owner.passwordHash);

  if (!isValidPassword) {
    return null;
  }

  return {
    id: owner.id,
    username: owner.username,
    label: owner.label,
  };
}

export function getAuthenticatedOwnerFromRequest(
  request: Request,
): AuthenticatedOwner | null {
  const token = extractBearerToken(request.headers.get('authorization'));

  if (!token) {
    return null;
  }

  const payload = verifyAuthToken(token);

  if (!payload) {
    return null;
  }

  return {
    id: payload.ownerId,
    username: payload.username,
    label: null,
  };
}
