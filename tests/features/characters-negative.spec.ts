import { CharacterAbilityScoresInput, CharacterCreateRequestBody, CharacterCurrency, CharacterResponseBody } from '@/app/types/character';
import { expect, test } from '@playwright/test';

import { CharactersClient } from '../clients/characters.client';
import { CharactersAssert } from '../helpers/characters.assertions';
import { issueDemoToken, yenneferAbilityScoresInput } from './characters.shared';

test.describe(
  'Characters API - Geralt Of Rivia The Warlock Negative Flow',
  { tag: ['@characters', '@negative', '@warlock', '@dragonborn'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let geraltCharacterId: number;

    const buildGeraltWarlockPayload = (
      name: string,
      payload: Partial<Omit<CharacterCreateRequestBody, 'name'>> = {},
    ): CharacterCreateRequestBody => ({
      name,
      classId: 11,
      speciesId: 1,
      backgroundId: 1,
      level: 1,
      ...payload,
    });

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);

      const charactersClient = new CharactersClient(request);
      const createResponse = await charactersClient.createCharacter(
        buildGeraltWarlockPayload(`Geralt Of Rivia ${Date.now()}`),
        authToken,
      );

      expect(createResponse.status()).toBe(201);

      const character: CharacterResponseBody = await createResponse.json();
      geraltCharacterId = character.id;
    });

    test(
      'Create Geralt Without Token Is Unauthorized',
      { tag: ['@post', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.createCharacter(
          buildGeraltWarlockPayload('Geralt Of Rivia Unauthorized'),
        );

        await charactersAssert.unauthorized(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(body, 'Unauthorized');
      },
    );

    test(
      'Get Geralt Detail Without Token Is Public',
      { tag: ['@get', '@public', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          geraltCharacterId,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateId(character.id, geraltCharacterId);
        await charactersAssert.validateClassId(character.classId, 11);
        await charactersAssert.validateSpeciesId(character.speciesId, 1);
        await charactersAssert.validateBackgroundId(character.backgroundId, 1);
      },
    );

    test(
      'Patch Character Without Token Is Unauthorized',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          geraltCharacterId,
          {
            classId: 11,
          },
        );

        await charactersAssert.unauthorized(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(body, 'Unauthorized');
      },
    );

    test(
      'Delete Character Without Token Is Unauthorized',
      { tag: ['@delete', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.deleteCharacter(geraltCharacterId);

        await charactersAssert.unauthorized(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(body, 'Unauthorized');
      },
    );

    test(
      'Get Character Equipment Without Token Is Unauthorized',
      { tag: ['@get', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterEquipment(
          geraltCharacterId,
        );

        await charactersAssert.unauthorized(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(body, 'Unauthorized');
      },
    );

    test(
      'Add Character Equipment Without Token Is Unauthorized',
      { tag: ['@post', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.addCharacterEquipment(
          geraltCharacterId,
          {
            equipmentId: 1,
            quantity: 1,
            isEquipped: true,
          },
        );

        await charactersAssert.unauthorized(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(body, 'Unauthorized');
      },
    );

    test(
      'Patch Character Equipment Without Token Is Unauthorized',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.patchCharacterEquipment(
          geraltCharacterId,
          1,
          {
            quantity: 1,
          },
        );

        await charactersAssert.unauthorized(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(body, 'Unauthorized');
      },
    );

    test(
      'Delete Character Equipment Without Token Is Unauthorized',
      { tag: ['@delete', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.deleteCharacterEquipment(
          geraltCharacterId,
          1,
        );

        await charactersAssert.unauthorized(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(body, 'Unauthorized');
      },
    );

    test(
      'Get Non-Existent Character Returns Not Found',
      { tag: ['@get', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          999999,
          authToken,
        );

        await charactersAssert.notFound(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Character not found',
        );
      },
    );

    test(
      'Patch Non-Existent Character Returns Not Found',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          999999,
          { classId: 11 },
          authToken,
        );

        await charactersAssert.notFound(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Character not found',
        );
      },
    );

    test(
      'Delete Non-Existent Character Returns Not Found',
      { tag: ['@delete', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.deleteCharacter(
          999999,
          authToken,
        );

        await charactersAssert.notFound(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Character not found',
        );
      },
    );

    test(
      'Get Non-Existent Character Equipment Returns Not Found',
      { tag: ['@get', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterEquipment(
          999999,
          authToken,
        );

        await charactersAssert.notFound(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Character not found',
        );
      },
    );

    test(
      'Add Equipment To Non-Existent Character Returns Not Found',
      { tag: ['@post', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.addCharacterEquipment(
          999999,
          {
            equipmentId: 1,
            quantity: 1,
            isEquipped: true,
          },
          authToken,
        );

        await charactersAssert.notFound(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Character not found',
        );
      },
    );

    test(
      'Patch Equipment On Non-Existent Character Returns Not Found',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.patchCharacterEquipment(
          999999,
          1,
          {
            quantity: 1,
          },
          authToken,
        );

        await charactersAssert.notFound(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Character not found',
        );
      },
    );

    test(
      'Delete Equipment On Non-Existent Character Returns Not Found',
      { tag: ['@delete', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.deleteCharacterEquipment(
          999999,
          1,
          authToken,
        );

        await charactersAssert.notFound(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Character not found',
        );
      },
    );

    test(
      'Add Non-Existent Equipment To Geralt Returns Not Found',
      { tag: ['@post', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.addCharacterEquipment(
          geraltCharacterId,
          {
            equipmentId: 999999,
            quantity: 1,
            isEquipped: true,
          },
          authToken,
        );

        await charactersAssert.notFound(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Equipment not found',
        );
      },
    );

    test(
      'Patch Missing Geralt Equipment Returns Not Found',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.patchCharacterEquipment(
          geraltCharacterId,
          999999,
          {
            quantity: 1,
          },
          authToken,
        );

        await charactersAssert.notFound(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Character equipment not found',
        );
      },
    );

    test(
      'Delete Missing Geralt Equipment Returns Not Found',
      { tag: ['@delete', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.deleteCharacterEquipment(
          geraltCharacterId,
          999999,
          authToken,
        );

        await charactersAssert.notFound(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Character equipment not found',
        );
      },
    );

    test(
      'Add Geralt Equipment With Invalid Payload',
      { tag: ['@post', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.addCharacterEquipment(
          geraltCharacterId,
          {
            equipmentId: 1,
            quantity: 0,
            isEquipped: true,
          },
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character equipment request payload',
        );
      },
    );

    test(
      'Patch Character Equipment With Invalid Quantity',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.patchCharacterEquipment(
          geraltCharacterId,
          1,
          {
            quantity: 0,
          },
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character equipment request payload',
        );
      },
    );

    test(
      'Patch Character Equipment With Empty Payload',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.patchCharacterEquipment(
          geraltCharacterId,
          1,
          {},
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character equipment request payload',
        );
      },
    );

    test(
      'Patch Character Equipment With Non-Numeric Quantity',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.patchCharacterEquipment(
          geraltCharacterId,
          1,
          {
            quantity: '3',
          } as unknown as { quantity: number },
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character equipment request payload',
        );
      },
    );

    test(
      'Create Geralt With Invalid Payload',
      { tag: ['@post', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.createCharacter(
          {
            name: '',
            classId: 11,
            speciesId: 1,
            backgroundId: 1,
            level: 1,
          },
          authToken,
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
      'Patch Geralt With Invalid Payload',
      { tag: ['@post', '@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const updateResponse = await charactersClient.updateCharacter(
          geraltCharacterId,
          {
            level: 0,
          },
          authToken,
        );

        await charactersAssert.badRequest(updateResponse);

        const body: { error: string } = await updateResponse.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character request payload',
        );
      },
    );

    test(
      'Create Geralt With Incomplete Scores',
      { tag: ['@post', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.createCharacter(
          buildGeraltWarlockPayload(
            `Geralt Of Rivia Incomplete Scores ${Date.now()}`,
            {
              abilityScores: {
                base: {
                  STR: 15,
                },
                bonuses: {
                  STR: 2,
                },
              } as unknown as CharacterAbilityScoresInput,
            },
          ),
          authToken,
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
      'Put Geralt Scores With Base Above Creation Maximum',
      { tag: ['@put', '@negative', '@error', '@ability-scores'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacterAbilityScores(
          geraltCharacterId,
          {
            abilityScores: {
              ...yenneferAbilityScoresInput,
              base: {
                ...yenneferAbilityScoresInput.base,
                STR: 16,
              },
            },
          },
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character ability scores payload: base.STR must be between 8 and 15 for character levels 1 to 3; received 16',
        );
      },
    );

    test(
      'Put Geralt Scores With Base Below Creation Minimum',
      { tag: ['@put', '@negative', '@error', '@ability-scores'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacterAbilityScores(
          geraltCharacterId,
          {
            abilityScores: {
              ...yenneferAbilityScoresInput,
              base: {
                ...yenneferAbilityScoresInput.base,
                INT: 7,
              },
            },
          },
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character ability scores payload: base.INT must be between 8 and 15 for character levels 1 to 3; received 7',
        );
      },
    );

    test(
      'Put Geralt Scores With Bonus Above Maximum',
      { tag: ['@put', '@negative', '@error', '@ability-scores'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacterAbilityScores(
          geraltCharacterId,
          {
            abilityScores: {
              ...yenneferAbilityScoresInput,
              bonuses: {
                ...yenneferAbilityScoresInput.bonuses,
                WIS: 3,
              },
            },
          },
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character ability scores payload: bonuses.WIS must be between 0 and 2; received 3',
        );
      },
    );

    test(
      'Put Geralt Scores With Negative Bonus',
      { tag: ['@put', '@negative', '@error', '@ability-scores'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacterAbilityScores(
          geraltCharacterId,
          {
            abilityScores: {
              ...yenneferAbilityScoresInput,
              bonuses: {
                ...yenneferAbilityScoresInput.bonuses,
                WIS: -1,
              },
            },
          },
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character ability scores payload: bonuses.WIS must be between 0 and 2; received -1',
        );
      },
    );

    test(
      'Put Geralt Scores With Bonus Outside Background Choices',
      { tag: ['@put', '@negative', '@error', '@ability-scores'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacterAbilityScores(
          geraltCharacterId,
          {
            abilityScores: {
              ...yenneferAbilityScoresInput,
              bonuses: {
                STR: 1,
                DEX: 0,
                CON: 0,
                INT: 0,
                WIS: 0,
                CHA: 2,
              },
            },
          },
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          "Invalid character ability scores payload: bonuses.STR is not allowed by this character's background. Allowed abilities: INT, WIS, CHA",
        );
      },
    );

    test(
      'Put Geralt Scores With Bonus Total Mismatch',
      { tag: ['@put', '@negative', '@error', '@ability-scores'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacterAbilityScores(
          geraltCharacterId,
          {
            abilityScores: {
              ...yenneferAbilityScoresInput,
              bonuses: {
                STR: 0,
                DEX: 0,
                CON: 0,
                INT: 0,
                WIS: 2,
                CHA: 0,
              },
            },
          },
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character ability scores payload: bonuses must match one of the background ability score rules (+2/+1 across different allowed abilities or +1 to each background-allowed ability); received WIS +2',
        );
      },
    );

    test(
      'Put Geralt Scores With Incomplete Payload',
      { tag: ['@put', '@negative', '@error', '@ability-scores'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacterAbilityScores(
          geraltCharacterId,
          {
            abilityScores: {
              base: {
                STR: 15,
              },
              bonuses: yenneferAbilityScoresInput.bonuses,
            } as unknown as CharacterAbilityScoresInput,
          },
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character ability scores payload: abilityScores must contain exactly base and bonuses with integer STR, DEX, CON, INT, WIS, and CHA values',
        );
      },
    );

    test(
      'Patch Geralt Scores With Base Above Creation Maximum',
      { tag: ['@patch', '@negative', '@error', '@ability-scores'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          geraltCharacterId,
          {
            abilityScores: {
              ...yenneferAbilityScoresInput,
              base: {
                ...yenneferAbilityScoresInput.base,
                STR: 16,
              },
            },
          },
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character ability scores payload: base.STR must be between 8 and 15 for character levels 1 to 3; received 16',
        );
      },
    );

    test(
      'Create Geralt With Base Above Creation Maximum',
      { tag: ['@post', '@negative', '@error', '@ability-scores'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.createCharacter(
          buildGeraltWarlockPayload(
            `Geralt Of Rivia High Score ${Date.now()}`,
            {
              abilityScores: {
                ...yenneferAbilityScoresInput,
                base: {
                  ...yenneferAbilityScoresInput.base,
                  STR: 16,
                },
              },
            },
          ),
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character ability scores payload: base.STR must be between 8 and 15 for character levels 1 to 3; received 16',
        );
      },
    );

    test(
      'Patch Geralt With Non-Numeric Score',
      { tag: ['@post', '@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          geraltCharacterId,
          {
            abilityScores: {
              base: {
                STR: '15',
                DEX: 14,
                CON: 13,
                INT: 10,
                WIS: 12,
                CHA: 8,
              },
              bonuses: {
                STR: 2,
                DEX: 0,
                CON: 1,
                INT: 0,
                WIS: 0,
                CHA: 0,
              },
            } as unknown as CharacterAbilityScoresInput,
          },
          authToken,
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
      'Create Geralt With Incomplete Currency',
      { tag: ['@post', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.createCharacter(
          buildGeraltWarlockPayload(
            `Geralt Of Rivia Incomplete Currency ${Date.now()}`,
            {
              currency: {
                gp: 10,
              } as unknown as CharacterCurrency,
            },
          ),
          authToken,
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
      'Patch Geralt With Non-Numeric Currency',
      { tag: ['@post', '@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          geraltCharacterId,
          {
            currency: {
              cp: 0,
              sp: '5',
              ep: 0,
              gp: 12,
              pp: 0,
            } as unknown as CharacterCurrency,
          },
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character request payload',
        );
      },
    );
  },
);
