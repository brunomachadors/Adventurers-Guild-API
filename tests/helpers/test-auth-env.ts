import { loadEnvConfig } from '@next/env';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

loadEnvConfig(process.cwd());

function getFirstDefinedEnv(keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();

    if (value) {
      return value;
    }
  }

  return undefined;
}

function readEnvFileValue(filePath: string, key: string): string | undefined {
  if (!existsSync(filePath)) {
    return undefined;
  }

  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#') || !line.includes('=')) {
      continue;
    }

    const [rawKey, ...rawValueParts] = line.split('=');

    if (rawKey.trim() !== key) {
      continue;
    }

    const value = rawValueParts.join('=').trim().replace(/^['"]|['"]$/g, '');

    if (value) {
      return value;
    }
  }

  return undefined;
}

function getEnvWithFileFallback(keys: string[]): string | undefined {
  const envValue = getFirstDefinedEnv(keys);

  if (envValue) {
    return envValue;
  }

  const fallbackFiles = [
    resolve(process.cwd(), '.env.local'),
    resolve(process.cwd(), '.env.development.local'),
    resolve(process.cwd(), '.env.test'),
    resolve(process.cwd(), '.env'),
  ];

  for (const filePath of fallbackFiles) {
    for (const key of keys) {
      const value = readEnvFileValue(filePath, key);

      if (value) {
        return value;
      }
    }
  }

  return undefined;
}

export function getTestAuthCredentials() {
  const username = getEnvWithFileFallback([
    'E2E_AUTH_USERNAME',
    'TEST_AUTH_USERNAME',
    'AUTH_USERNAME',
  ]);
  const password = getEnvWithFileFallback([
    'E2E_AUTH_PASSWORD',
    'TEST_AUTH_PASSWORD',
    'AUTH_PASSWORD',
  ]);

  if (!username || !password) {
    throw new Error(
      'Missing auth credentials for E2E tests. Set E2E_AUTH_USERNAME/E2E_AUTH_PASSWORD or AUTH_USERNAME/AUTH_PASSWORD in your local env file and in GitHub Actions secrets.',
    );
  }

  return { username, password };
}
