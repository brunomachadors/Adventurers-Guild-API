import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

export function getTestAuthCredentials() {
  const username = process.env.E2E_AUTH_USERNAME;
  const password = process.env.E2E_AUTH_PASSWORD;

  if (!username || !password) {
    throw new Error(
      'Missing E2E auth credentials. Set E2E_AUTH_USERNAME and E2E_AUTH_PASSWORD in your local env file and in GitHub Actions secrets.',
    );
  }

  return { username, password };
}
