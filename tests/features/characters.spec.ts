import { TokenResponseBody } from '@/app/types/auth';
import {
  CharacterListItem,
  CharacterResponseBody,
  CharacterSpellOptionsResponseBody,
  CharacterSpellSelectionResponseBody,
} from '@/app/types/character';
import { APIRequestContext, expect, test } from '@playwright/test';

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
  'Characters API - Barbarian Flow',
  { tag: ['@characters', '@flow', '@barbarian'] },
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
    'Get character spell options',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const spellOptionsResponse = await charactersClient.getCharacterSpellOptions(
        createdCharacterId,
        authToken,
      );

      await charactersAssert.success(spellOptionsResponse);

      const spellOptions: CharacterSpellOptionsResponseBody =
        await spellOptionsResponse.json();

      await charactersAssert.validateCharacterSpellOptionsSchema(spellOptions);
      await charactersAssert.validateId(
        spellOptions.characterId,
        createdCharacterId,
      );
      await charactersAssert.validateClassId(spellOptions.classId, 1);
      await charactersAssert.validateClassName(
        spellOptions.className,
        'Barbarian',
      );

      await test.step('Validate barbarian has no spell options', async () => {
        expect(spellOptions.spells).toEqual([]);
      });
    },
  );

  test(
    'Get character spell selection',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const spellSelectionResponse =
        await charactersClient.getCharacterSpellSelection(
          createdCharacterId,
          authToken,
        );

      await charactersAssert.success(spellSelectionResponse);

      const spellSelection: CharacterSpellSelectionResponseBody =
        await spellSelectionResponse.json();

      await charactersAssert.validateCharacterSpellSelectionSchema(
        spellSelection,
      );
      await charactersAssert.validateId(
        spellSelection.characterId,
        createdCharacterId,
      );
      await charactersAssert.validateClassId(spellSelection.classId, 1);
      await charactersAssert.validateClassName(
        spellSelection.className,
        'Barbarian',
      );
      await charactersAssert.validateLevel(spellSelection.level, 1);

      await test.step(
        'Validate barbarian spell selection is unavailable',
        async () => {
          expect(spellSelection.selectionRules.canSelectSpells).toBe(false);
          expect(spellSelection.selectedSpells).toEqual([]);
          expect(spellSelection.availableSpells).toEqual([]);
        },
      );
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
  'Characters API - Wizard Flow',
  { tag: ['@characters', '@flow', '@wizard'] },
  () => {
  test.describe.configure({ mode: 'serial' });

  let authToken: string;
  let createdCharacterId: number;
  let createdCharacterName: string;
  let selectedSpellIds: number[];

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
      createdCharacterName = `Merien ${Date.now()}`;

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
          classId: 12,
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
      await charactersAssert.validateClassId(updatedCharacter.classId, 12);
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
        await charactersAssert.validateId(updatedCharacter.classDetails.id, 12);
        await charactersAssert.validateName(
          updatedCharacter.classDetails.name,
          'Wizard',
        );
        await charactersAssert.validateClassDetailsSchema(
          updatedCharacter.classDetails,
          updatedCharacter.level,
        );
      }
    },
  );

  test(
    'Get character spell options',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const spellOptionsResponse = await charactersClient.getCharacterSpellOptions(
        createdCharacterId,
        authToken,
      );

      await charactersAssert.success(spellOptionsResponse);

      const spellOptions: CharacterSpellOptionsResponseBody =
        await spellOptionsResponse.json();

      await charactersAssert.validateCharacterSpellOptionsSchema(spellOptions);
      await charactersAssert.validateId(
        spellOptions.characterId,
        createdCharacterId,
      );
      await charactersAssert.validateClassId(spellOptions.classId, 12);
      await charactersAssert.validateClassName(spellOptions.className, 'Wizard');

      await test.step('Validate wizard spell options are returned', async () => {
        expect(spellOptions.spells.length).toBeGreaterThan(0);
        expect(
          spellOptions.spells.some((spell) => spell.name === 'Acid Splash'),
        ).toBe(true);
      });
    },
  );

  test(
    'Get character spell selection',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const spellSelectionResponse =
        await charactersClient.getCharacterSpellSelection(
          createdCharacterId,
          authToken,
        );

      await charactersAssert.success(spellSelectionResponse);

      const spellSelection: CharacterSpellSelectionResponseBody =
        await spellSelectionResponse.json();

      await charactersAssert.validateCharacterSpellSelectionSchema(
        spellSelection,
      );
      await charactersAssert.validateId(
        spellSelection.characterId,
        createdCharacterId,
      );
      await charactersAssert.validateClassId(spellSelection.classId, 12);
      await charactersAssert.validateClassName(spellSelection.className, 'Wizard');
      await charactersAssert.validateLevel(spellSelection.level, 1);

      await test.step('Validate wizard spell selection rules', async () => {
        expect(spellSelection.selectionRules.canSelectSpells).toBe(true);
        expect(spellSelection.selectionRules.selectionType).toBe('prepared');
        expect(spellSelection.selectionRules.maxCantrips).toBe(3);
        expect(spellSelection.selectionRules.maxSpells).toBe(0);
        expect(spellSelection.selectedSpells).toEqual([]);
        expect(spellSelection.availableSpells.length).toBeGreaterThan(0);
      });

      const firstCantrip = spellSelection.availableSpells.find(
        (spell) => spell.level === 0,
      );
      const secondCantrip = spellSelection.availableSpells.find(
        (spell) => spell.level === 0 && spell.id !== firstCantrip?.id,
      );
      const thirdCantrip = spellSelection.availableSpells.find(
        (spell) =>
          spell.level === 0 &&
          spell.id !== firstCantrip?.id &&
          spell.id !== secondCantrip?.id,
      );
      const firstLeveledSpell = spellSelection.availableSpells.find(
        (spell) => spell.level > 0,
      );

      await test.step('Choose cantrips for wizard selection update', async () => {
        expect(firstCantrip).toBeDefined();
        expect(secondCantrip).toBeDefined();
        expect(thirdCantrip).toBeDefined();
        expect(firstLeveledSpell).toBeDefined();
      });

      selectedSpellIds = [firstCantrip!.id, secondCantrip!.id, thirdCantrip!.id];
    },
  );

  test(
    'Put character spell selection',
    { tag: ['@put', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const updateSpellSelectionResponse =
        await charactersClient.updateCharacterSpells(
          createdCharacterId,
          {
            spellIds: selectedSpellIds,
          },
          authToken,
        );

      await charactersAssert.success(updateSpellSelectionResponse);

      const spellSelection: CharacterSpellSelectionResponseBody =
        await updateSpellSelectionResponse.json();

      await charactersAssert.validateCharacterSpellSelectionSchema(
        spellSelection,
      );
      await charactersAssert.validateId(
        spellSelection.characterId,
        createdCharacterId,
      );
      await charactersAssert.validateClassId(spellSelection.classId, 12);
      await charactersAssert.validateClassName(spellSelection.className, 'Wizard');

      await test.step('Validate selected wizard spells were persisted', async () => {
        expect(spellSelection.selectedSpells).toHaveLength(selectedSpellIds.length);
        expect(spellSelection.selectedSpells.map((spell) => spell.id)).toEqual(
          selectedSpellIds,
        );
      });
    },
  );

  test(
    'Get updated character spell selection',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const spellSelectionResponse =
        await charactersClient.getCharacterSpellSelection(
          createdCharacterId,
          authToken,
        );

      await charactersAssert.success(spellSelectionResponse);

      const spellSelection: CharacterSpellSelectionResponseBody =
        await spellSelectionResponse.json();

      await charactersAssert.validateCharacterSpellSelectionSchema(
        spellSelection,
      );
      await charactersAssert.validateId(
        spellSelection.characterId,
        createdCharacterId,
      );
      await charactersAssert.validateClassId(spellSelection.classId, 12);
      await charactersAssert.validateClassName(spellSelection.className, 'Wizard');

      await test.step(
        'Validate selected wizard spells are returned on follow-up get',
        async () => {
          expect(spellSelection.selectedSpells).toHaveLength(selectedSpellIds.length);
          expect(spellSelection.selectedSpells.map((spell) => spell.id)).toEqual(
            selectedSpellIds,
          );
        },
      );
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
      await charactersAssert.validateClassId(finalCharacter.classId, 12);
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
        await charactersAssert.validateId(finalCharacter.classDetails.id, 12);
        await charactersAssert.validateName(
          finalCharacter.classDetails.name,
          'Wizard',
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
