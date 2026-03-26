import { TokenResponseBody } from '@/app/types/auth';
import { CharacterListItem, CharacterResponseBody } from '@/app/types/character';
import { APIRequestContext, test } from '@playwright/test';

import { AuthClient } from '../clients/auth.client';
import { CharactersClient } from '../clients/characters.client';
import { AuthAssert } from '../helpers/auth.assertions';
import { CharactersAssert } from '../helpers/characters.assertions';

async function issueDemoToken(request: APIRequestContext) {
  const authClient = new AuthClient(request);
  const authAssert = new AuthAssert();

  const tokenResponse = await authClient.issueToken({
    username: 'demo',
    password: 'demo123',
  });

  await authAssert.success(tokenResponse);

  const tokenBody: TokenResponseBody = await tokenResponse.json();

  await authAssert.validateTokenResponse(tokenBody);

  return tokenBody.token;
}

test.describe(
  'Characters API - Flow',
  { tag: ['@characters', '@flow'] },
  () => {
  test.describe.configure({ mode: 'serial' });

  let authToken: string;
  let createdCharacterId: number;
  let createdCharacterName: string;

  test(
    'List characters for authenticated owner',
    { tag: ['@get', '@smoke', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      authToken = await issueDemoToken(request);

      const listResponse = await charactersClient.getCharacters(authToken);

      await charactersAssert.success(listResponse);

      const characters: CharacterListItem[] = await listResponse.json();

      await charactersAssert.validateCharacterListSchema(characters);
    },
  );

  test(
    'Create draft character',
    { tag: ['@post', '@smoke', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      createdCharacterName = `Arin ${Date.now()}`;

      const createResponse = await charactersClient.createCharacter(
        {
          name: createdCharacterName,
        },
        authToken,
      );

      await charactersAssert.created(createResponse);

      const createdCharacter: CharacterResponseBody = await createResponse.json();
      createdCharacterId = createdCharacter.id;

      await charactersAssert.validateCharacterResponseSchema(createdCharacter);
      await charactersAssert.validateName(
        createdCharacter.name,
        createdCharacterName,
      );
      await charactersAssert.validateStatus(createdCharacter.status, 'draft');
      await charactersAssert.validateClassId(createdCharacter.classId, null);
      await charactersAssert.validateSpeciesId(createdCharacter.speciesId, null);
      await charactersAssert.validateBackgroundId(
        createdCharacter.backgroundId,
        null,
      );
      await charactersAssert.validateLevel(createdCharacter.level, 1);
      await charactersAssert.validateMissingFields(createdCharacter.missingFields, [
        'classId',
        'speciesId',
        'backgroundId',
      ]);
      await charactersAssert.validateClassDetailsPresence(
        createdCharacter.classDetails ?? null,
        false,
      );
    },
  );

  test(
    'Get created draft character',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const getResponse = await charactersClient.getCharacterDetail(
        createdCharacterId,
        authToken,
      );

      await charactersAssert.success(getResponse);

      const fetchedCharacter: CharacterResponseBody = await getResponse.json();

      await charactersAssert.validateCharacterResponseSchema(fetchedCharacter);
      await charactersAssert.validateId(fetchedCharacter.id, createdCharacterId);
      await charactersAssert.validateName(
        fetchedCharacter.name,
        createdCharacterName,
      );
      await charactersAssert.validateStatus(fetchedCharacter.status, 'draft');
      await charactersAssert.validateClassId(fetchedCharacter.classId, null);
      await charactersAssert.validateSpeciesId(fetchedCharacter.speciesId, null);
      await charactersAssert.validateBackgroundId(
        fetchedCharacter.backgroundId,
        null,
      );
      await charactersAssert.validateLevel(fetchedCharacter.level, 1);
      await charactersAssert.validateMissingFields(fetchedCharacter.missingFields, [
        'classId',
        'speciesId',
        'backgroundId',
      ]);
      await charactersAssert.validateClassDetailsPresence(
        fetchedCharacter.classDetails ?? null,
        false,
      );
    },
  );

  test(
    'Patch character class',
    { tag: ['@patch', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const updateResponse = await charactersClient.updateCharacter(
        createdCharacterId,
        {
          classId: 1,
        },
        authToken,
      );

      await charactersAssert.success(updateResponse);

      const updatedCharacter: CharacterResponseBody = await updateResponse.json();

      await charactersAssert.validateCharacterResponseSchema(updatedCharacter);
      await charactersAssert.validateId(updatedCharacter.id, createdCharacterId);
      await charactersAssert.validateName(
        updatedCharacter.name,
        createdCharacterName,
      );
      await charactersAssert.validateStatus(updatedCharacter.status, 'draft');
      await charactersAssert.validateClassId(updatedCharacter.classId, 1);
      await charactersAssert.validateSpeciesId(updatedCharacter.speciesId, null);
      await charactersAssert.validateBackgroundId(
        updatedCharacter.backgroundId,
        null,
      );
      await charactersAssert.validateLevel(updatedCharacter.level, 1);
      await charactersAssert.validateMissingFields(updatedCharacter.missingFields, [
        'speciesId',
        'backgroundId',
      ]);
      await charactersAssert.validateClassDetailsPresence(
        updatedCharacter.classDetails ?? null,
        true,
      );

      if (updatedCharacter.classDetails) {
        await charactersAssert.validateId(updatedCharacter.classDetails.id, 1);
        await charactersAssert.validateName(
          updatedCharacter.classDetails.name,
          'Barbarian',
        );
        await charactersAssert.validateClassDetailsSchema(
          updatedCharacter.classDetails,
          updatedCharacter.level,
        );
      }
    },
  );

  test(
    'Get updated character',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const finalGetResponse = await charactersClient.getCharacterDetail(
        createdCharacterId,
        authToken,
      );

      await charactersAssert.success(finalGetResponse);

      const finalCharacter: CharacterResponseBody = await finalGetResponse.json();

      await charactersAssert.validateCharacterResponseSchema(finalCharacter);
      await charactersAssert.validateId(finalCharacter.id, createdCharacterId);
      await charactersAssert.validateName(finalCharacter.name, createdCharacterName);
      await charactersAssert.validateStatus(finalCharacter.status, 'draft');
      await charactersAssert.validateClassId(finalCharacter.classId, 1);
      await charactersAssert.validateSpeciesId(finalCharacter.speciesId, null);
      await charactersAssert.validateBackgroundId(finalCharacter.backgroundId, null);
      await charactersAssert.validateLevel(finalCharacter.level, 1);
      await charactersAssert.validateMissingFields(finalCharacter.missingFields, [
        'speciesId',
        'backgroundId',
      ]);
      await charactersAssert.validateClassDetailsPresence(
        finalCharacter.classDetails ?? null,
        true,
      );

      if (finalCharacter.classDetails) {
        await charactersAssert.validateId(finalCharacter.classDetails.id, 1);
        await charactersAssert.validateName(
          finalCharacter.classDetails.name,
          'Barbarian',
        );
        await charactersAssert.validateClassDetailsSchema(
          finalCharacter.classDetails,
          finalCharacter.level,
        );
      }
    },
  );
  },
);

test.describe(
  'Characters API - Negative',
  { tag: ['@characters', '@negative'] },
  () => {
  test(
    'Create character without token',
    { tag: ['@post', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.createCharacter({
        name: 'Unauthorized Character',
      });

      await charactersAssert.unauthorized(response);

      const body: { error: string } = await response.json();

      await charactersAssert.validateErrorResponse(body, 'Unauthorized');
    },
  );

  test(
    'Get character without token',
    { tag: ['@get', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterDetail(1);

      await charactersAssert.unauthorized(response);

      const body: { error: string } = await response.json();

      await charactersAssert.validateErrorResponse(body, 'Unauthorized');
    },
  );

  test(
    'Patch character without token',
    { tag: ['@patch', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.updateCharacter(1, { classId: 1 });

      await charactersAssert.unauthorized(response);

      const body: { error: string } = await response.json();

      await charactersAssert.validateErrorResponse(body, 'Unauthorized');
    },
  );

  test(
    'Get non-existent character',
    { tag: ['@get', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const token = await issueDemoToken(request);

      const response = await charactersClient.getCharacterDetail(999999, token);

      await charactersAssert.notFound(response);

      const body: { error: string } = await response.json();

      await charactersAssert.validateErrorResponse(body, 'Character not found');
    },
  );

  test(
    'Patch non-existent character',
    { tag: ['@patch', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const token = await issueDemoToken(request);

      const response = await charactersClient.updateCharacter(
        999999,
        { classId: 1 },
        token,
      );

      await charactersAssert.notFound(response);

      const body: { error: string } = await response.json();

      await charactersAssert.validateErrorResponse(body, 'Character not found');
    },
  );

  test(
    'Create character with invalid payload',
    { tag: ['@post', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const token = await issueDemoToken(request);

      const response = await charactersClient.createCharacter(
        {
          name: '',
        },
        token,
      );

      await charactersAssert.badRequest(response);

      const body: { error: string } = await response.json();

      await charactersAssert.validateErrorResponse(
        body,
        'Invalid character request payload',
      );
    },
  );

  test(
    'Patch character with invalid payload',
    { tag: ['@post', '@patch', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const token = await issueDemoToken(request);

      const createResponse = await charactersClient.createCharacter(
        {
          name: `Invalid Patch ${Date.now()}`,
        },
        token,
      );

      await charactersAssert.created(createResponse);

      const createdCharacter: CharacterResponseBody = await createResponse.json();

      const updateResponse = await charactersClient.updateCharacter(
        createdCharacter.id,
        {
          level: 0,
        },
        token,
      );

      await charactersAssert.badRequest(updateResponse);

      const body: { error: string } = await updateResponse.json();

      await charactersAssert.validateErrorResponse(
        body,
        'Invalid character request payload',
      );
    },
  );
  },
);
