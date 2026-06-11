import { CharacterListItem, CharacterResponseBody } from '@/app/types/character';
import { expect, test } from '@playwright/test';

import { CharactersClient } from '../clients/characters.client';
import { CharactersAssert } from '../helpers/characters.assertions';
import {
  addCharacterEquipmentBySlug,
  bilboAbilityBonuses,
  bilboAbilityScores,
  bilboAbilityScoresInput,
  issueDemoToken,
} from './characters.shared';

test.describe(
  'Characters API - Bilbo The Rogue Delete Flow',
  { tag: ['@characters', '@flow', '@delete', '@rogue'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let createdCharacterId: number;
    let createdCharacterName: string;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create Bilbo The Rogue For Delete',
      { tag: ['@post', '@smoke', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();
        createdCharacterName = `Bilbo The Rogue ${Date.now()}`;

        const response = await charactersClient.createCharacter(
          {
            name: createdCharacterName,
            classId: 9,
            speciesId: 7,
            backgroundId: 5,
            level: 1,
            abilityScores: bilboAbilityScoresInput,
          },
          authToken,
        );

        await charactersAssert.created(response);

        const character: CharacterResponseBody = await response.json();
        createdCharacterId = character.id;

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateId(character.id, createdCharacterId);
        await charactersAssert.validateName(
          character.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(character.status, 'in_progress');
        await charactersAssert.validateClassId(character.classId, 9);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(character.backgroundId, 5);
        await charactersAssert.validateLevel(character.level, 1);
        await charactersAssert.validateMissingFields(
          character.missingFields,
          [],
        );
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          bilboAbilityScores,
          bilboAbilityBonuses,
        );
      },
    );

    test(
      'Add Bilbo Finesse Weapon And Bow',
      { tag: ['@post', '@get', '@data', '@equipment', '@rogue'] },
      async ({ request }) => {
        const charactersAssert = new CharactersAssert();
        const charactersClient = new CharactersClient(request);

        const characterEquipment = await addCharacterEquipmentBySlug(
          request,
          createdCharacterId,
          authToken,
          [
            { slug: 'dagger', quantity: 1, isEquipped: true },
            { slug: 'shortbow', quantity: 1, isEquipped: true },
          ],
        );

        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateCharacterEquipmentItems(characterEquipment, [
          { name: 'Dagger', quantity: 1, isEquipped: true },
          { name: 'Shortbow', quantity: 1, isEquipped: true },
        ]);

        const detailResponse = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(detailResponse);

        const character: CharacterResponseBody = await detailResponse.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateWeaponAttack(character.weaponAttacks, {
          name: 'Dagger',
          attackType: 'melee',
          ability: 'DEX',
          isProficient: true,
          abilityModifier: 3,
          proficiencyBonus: 2,
          attackBonus: 5,
          damage: {
            formula: '1d4 + 3',
            base: '1d4',
            modifier: 3,
            damageType: 'Piercing',
          },
          properties: ['Finesse', 'Light', 'Thrown'],
          rangeExists: false,
          attackModes: [
            {
              mode: 'melee',
              attackType: 'melee',
              ability: 'DEX',
              attackBonus: 5,
              damage: {
                formula: '1d4 + 3',
                base: '1d4',
                modifier: 3,
                damageType: 'Piercing',
              },
              range: null,
            },
            {
              mode: 'thrown',
              attackType: 'ranged',
              ability: 'DEX',
              attackBonus: 5,
              damage: {
                formula: '1d4 + 3',
                base: '1d4',
                modifier: 3,
                damageType: 'Piercing',
              },
              range: {
                normal: 20,
                long: 60,
                unit: 'ft',
              },
            },
          ],
        });
        await charactersAssert.validateWeaponAttack(character.weaponAttacks, {
          name: 'Shortbow',
          attackType: 'ranged',
          ability: 'DEX',
          isProficient: true,
          abilityModifier: 3,
          proficiencyBonus: 2,
          attackBonus: 5,
          damage: {
            formula: '1d6 + 3',
            base: '1d6',
            modifier: 3,
            damageType: 'Piercing',
          },
          properties: ['Ammunition', 'Two-Handed'],
          rangeExists: true,
        });
      },
    );

    test(
      'Delete Bilbo The Rogue',
      { tag: ['@delete', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.deleteCharacter(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const body: { message: string } = await response.json();

        await charactersAssert.validateMessageResponse(
          body,
          'Character deleted successfully',
        );
      },
    );

    test(
      'Get Deleted Bilbo Returns Not Found',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          createdCharacterId,
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
      'List Excludes Deleted Bilbo',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacters(authToken);

        await charactersAssert.success(response);

        const characters: CharacterListItem[] = await response.json();

        await charactersAssert.validateCharacterListSchema(characters);

        await test.step('Validate deleted character is absent from list', async () => {
          expect(
            characters.some((character) => character.id === createdCharacterId),
          ).toBe(false);
        });
      },
    );
  },
);

test.describe(
  'Characters API - Robin The Rogue Equipment Preview Flow',
  { tag: ['@characters', '@flow', '@rogue', '@equipment', '@preview'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let createdCharacterId: number;
    let createdCharacterName: string;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create Robin The Rogue For Equipment Preview',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();
        createdCharacterName = `Robin The Rogue ${Date.now()}`;

        const response = await charactersClient.createCharacter(
          {
            name: createdCharacterName,
            classId: 9,
            speciesId: 7,
            backgroundId: 5,
            level: 1,
            abilityScores: bilboAbilityScoresInput,
          },
          authToken,
        );

        await charactersAssert.created(response);

        const character: CharacterResponseBody = await response.json();
        createdCharacterId = character.id;

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateId(character.id, createdCharacterId);
        await charactersAssert.validateName(
          character.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(character.status, 'in_progress');
        await charactersAssert.validateClassId(character.classId, 9);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(character.backgroundId, 5);
        await charactersAssert.validateLevel(character.level, 1);
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          bilboAbilityScores,
          bilboAbilityBonuses,
        );
      },
    );

    test(
      'Add Robin Finesse Weapon And Bow',
      { tag: ['@post', '@get', '@data'] },
      async ({ request }) => {
        const charactersAssert = new CharactersAssert();
        const charactersClient = new CharactersClient(request);

        const characterEquipment = await addCharacterEquipmentBySlug(
          request,
          createdCharacterId,
          authToken,
          [
            { slug: 'dagger', quantity: 1, isEquipped: true },
            { slug: 'shortbow', quantity: 1, isEquipped: true },
          ],
        );

        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateCharacterEquipmentItems(characterEquipment, [
          { name: 'Dagger', quantity: 1, isEquipped: true },
          { name: 'Shortbow', quantity: 1, isEquipped: true },
        ]);

        const detailResponse = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(detailResponse);

        const character: CharacterResponseBody = await detailResponse.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateWeaponAttack(character.weaponAttacks, {
          name: 'Dagger',
          attackType: 'melee',
          ability: 'DEX',
          isProficient: true,
          abilityModifier: 3,
          proficiencyBonus: 2,
          attackBonus: 5,
          damage: {
            formula: '1d4 + 3',
            base: '1d4',
            modifier: 3,
            damageType: 'Piercing',
          },
          properties: ['Finesse', 'Light', 'Thrown'],
          rangeExists: false,
          attackModes: [
            {
              mode: 'melee',
              attackType: 'melee',
              ability: 'DEX',
              attackBonus: 5,
              damage: {
                formula: '1d4 + 3',
                base: '1d4',
                modifier: 3,
                damageType: 'Piercing',
              },
              range: null,
            },
            {
              mode: 'thrown',
              attackType: 'ranged',
              ability: 'DEX',
              attackBonus: 5,
              damage: {
                formula: '1d4 + 3',
                base: '1d4',
                modifier: 3,
                damageType: 'Piercing',
              },
              range: {
                normal: 20,
                long: 60,
                unit: 'ft',
              },
            },
          ],
        });
        await charactersAssert.validateWeaponAttack(character.weaponAttacks, {
          name: 'Shortbow',
          attackType: 'ranged',
          ability: 'DEX',
          isProficient: true,
          abilityModifier: 3,
          proficiencyBonus: 2,
          attackBonus: 5,
          damage: {
            formula: '1d6 + 3',
            base: '1d6',
            modifier: 3,
            damageType: 'Piercing',
          },
          properties: ['Ammunition', 'Two-Handed'],
          rangeExists: true,
        });
      },
    );
  },
);
