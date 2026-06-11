import { CharacterEquipmentResponseBody, CharacterResponseBody } from '@/app/types/character';
import { EquipmentDetail } from '@/app/types/equipment';
import { expect, test } from '@playwright/test';

import { CharactersClient } from '../clients/characters.client';
import { EquipmentClient } from '../clients/equipment.client';
import { CharactersAssert } from '../helpers/characters.assertions';
import {
  addCharacterEquipmentBySlug,
  fighterHitPoints,
  gimliAbilityBonuses,
  gimliAbilityScores,
  gimliAbilityScoresInput,
  issueDemoToken,
} from './characters.shared';

test.describe(
  'Characters API - Gimli The Fighter Equipment Flow',
  { tag: ['@characters', '@equipment', '@fighter', '@dwarf'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let characterWithEquipmentId: number;
    let greataxeEquipmentId: number;
    let shortbowEquipmentId: number;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);

      const equipmentClient = new EquipmentClient(request);
      const greataxeResponse =
        await equipmentClient.getEquipmentDetail('greataxe');
      expect(greataxeResponse.status()).toBe(200);
      const greataxe: EquipmentDetail = await greataxeResponse.json();
      expect(greataxe.name).toBe('Greataxe');
      greataxeEquipmentId = greataxe.id;

      const shortbowResponse =
        await equipmentClient.getEquipmentDetail('shortbow');
      expect(shortbowResponse.status()).toBe(200);
      const shortbow: EquipmentDetail = await shortbowResponse.json();
      expect(shortbow.name).toBe('Shortbow');
      shortbowEquipmentId = shortbow.id;
    });

    test(
      'Create Gimli The Fighter',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.createCharacter(
          {
            name: `Gimli The Fighter ${Date.now()}`,
            classId: 5,
            speciesId: 2,
            backgroundId: 16,
            level: 1,
            abilityScores: gimliAbilityScoresInput,
          },
          authToken,
        );

        await charactersAssert.created(response);

        const character: CharacterResponseBody = await response.json();
        characterWithEquipmentId = character.id;

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateClassId(character.classId, 5);
        await charactersAssert.validateSpeciesId(character.speciesId, 2);
        await charactersAssert.validateBackgroundId(character.backgroundId, 16);
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          gimliAbilityScores,
          gimliAbilityBonuses,
        );
        await charactersAssert.validateHitPoints(
          character.hitPoints,
          fighterHitPoints,
        );
        await charactersAssert.validateStatus(character.status, 'in_progress');
      },
    );

    test(
      'Get Empty Equipment',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterEquipment(
          characterWithEquipmentId,
          authToken,
        );

        await charactersAssert.success(response);

        const characterEquipment: CharacterEquipmentResponseBody =
          await response.json();

        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateId(
          characterEquipment.characterId,
          characterWithEquipmentId,
        );

        await test.step('Validate character has no equipment', async () => {
          expect(characterEquipment.equipment).toEqual([]);
        });

        const detailResponse = await charactersClient.getCharacterDetail(
          characterWithEquipmentId,
          authToken,
        );

        await charactersAssert.success(detailResponse);

        const character: CharacterResponseBody = await detailResponse.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateHitPoints(
          character.hitPoints,
          fighterHitPoints,
        );
        await charactersAssert.validatePassivePerception(
          character.passivePerception,
          {
            skill: 'Perception',
            ability: 'WIS',
            base: 10,
            skillModifier: 1,
            bonus: 0,
            total: 11,
          },
        );
        await charactersAssert.validateMovement(
          character.movement,
          { baseSpeed: 30, unit: 'ft' },
          { type: 'species', name: 'Dwarf', value: 30 },
        );
        await charactersAssert.validateInventoryWeight(
          character.inventoryWeight,
          {
            total: 0,
            sources: [],
          },
        );

        await test.step('Validate character has no weapon attacks', async () => {
          expect(character.weaponAttacks).toEqual([]);
        });
      },
    );

    test(
      'Add Gimli Equipment',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersAssert = new CharactersAssert();

        const characterEquipment = await addCharacterEquipmentBySlug(
          request,
          characterWithEquipmentId,
          authToken,
          [
            { slug: 'greataxe', quantity: 1, isEquipped: true },
            { slug: 'shortbow', quantity: 1, isEquipped: true },
            { slug: 'dagger', quantity: 1, isEquipped: false },
            { slug: 'chain-mail', quantity: 1, isEquipped: true },
            { slug: 'shield', quantity: 1, isEquipped: true },
          ],
        );

        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateId(
          characterEquipment.characterId,
          characterWithEquipmentId,
        );
        await charactersAssert.validateCharacterEquipmentItem(
          characterEquipment,
          {
            id: greataxeEquipmentId,
            name: 'Greataxe',
            quantity: 1,
            isEquipped: true,
          },
        );
        await charactersAssert.validateCharacterEquipmentItems(
          characterEquipment,
          [
            { name: 'Greataxe', quantity: 1, isEquipped: true },
            { name: 'Shortbow', quantity: 1, isEquipped: true },
            { name: 'Dagger', quantity: 1, isEquipped: false },
            { name: 'Chain Mail', quantity: 1, isEquipped: true },
            { name: 'Shield', quantity: 1, isEquipped: true },
          ],
        );
      },
    );

    test(
      'Get Gimli Equipment',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterEquipment(
          characterWithEquipmentId,
          authToken,
        );

        await charactersAssert.success(response);

        const characterEquipment: CharacterEquipmentResponseBody =
          await response.json();

        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateId(
          characterEquipment.characterId,
          characterWithEquipmentId,
        );
        await charactersAssert.validateCharacterEquipmentItem(
          characterEquipment,
          {
            id: greataxeEquipmentId,
            quantity: 1,
            isEquipped: true,
          },
        );
        await charactersAssert.validateCharacterEquipmentItems(
          characterEquipment,
          [
            { name: 'Greataxe', quantity: 1, isEquipped: true },
            { name: 'Shortbow', quantity: 1, isEquipped: true },
            { name: 'Dagger', quantity: 1, isEquipped: false },
            { name: 'Chain Mail', quantity: 1, isEquipped: true },
            { name: 'Shield', quantity: 1, isEquipped: true },
          ],
        );
      },
    );

    test(
      'Get Gimli Weapon Attacks',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          characterWithEquipmentId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateHitPoints(
          character.hitPoints,
          fighterHitPoints,
        );
        await charactersAssert.validateInitiative(character.initiative, {
          ability: 'DEX',
          abilityModifier: 2,
          bonus: 0,
          total: 2,
        });
        await charactersAssert.validatePassivePerception(
          character.passivePerception,
          {
            skill: 'Perception',
            ability: 'WIS',
            base: 10,
            skillModifier: 1,
            bonus: 0,
            total: 11,
          },
        );
        await charactersAssert.validateMovement(
          character.movement,
          { baseSpeed: 30, unit: 'ft' },
          { type: 'species', name: 'Dwarf', value: 30 },
        );
        await charactersAssert.validateInventoryWeight(
          character.inventoryWeight,
          {
            total: 71,
            sources: [
              { name: 'Greataxe', quantity: 1, weight: 7, total: 7 },
              { name: 'Shortbow', quantity: 1, weight: 2, total: 2 },
              { name: 'Dagger', quantity: 1, weight: 1, total: 1 },
              { name: 'Chain Mail', quantity: 1, weight: 55, total: 55 },
              { name: 'Shield', quantity: 1, weight: 6, total: 6 },
            ],
          },
        );
        await charactersAssert.validateSavingThrowOrder(character.savingThrows);
        await charactersAssert.validateSavingThrow(character.savingThrows, {
          ability: 'STR',
          isProficient: true,
          abilityModifier: 3,
          proficiencyBonus: 2,
          bonus: 0,
          total: 5,
        });
        await charactersAssert.validateSavingThrow(character.savingThrows, {
          ability: 'CON',
          isProficient: true,
          abilityModifier: 2,
          proficiencyBonus: 2,
          bonus: 0,
          total: 4,
        });
        await charactersAssert.validateSavingThrow(character.savingThrows, {
          ability: 'DEX',
          isProficient: false,
          abilityModifier: 2,
          proficiencyBonus: 0,
          bonus: 0,
          total: 2,
        });
        await charactersAssert.validateWeaponAttack(character.weaponAttacks, {
          equipmentId: greataxeEquipmentId,
          name: 'Greataxe',
          attackType: 'melee',
          ability: 'STR',
          isProficient: true,
          abilityModifier: 3,
          proficiencyBonus: 2,
          attackBonus: 5,
          damage: {
            formula: '1d12 + 3',
            base: '1d12',
            modifier: 3,
            damageType: 'Slashing',
          },
          properties: ['Heavy', 'Two-Handed'],
          rangeExists: false,
        });
        await charactersAssert.validateWeaponAttack(character.weaponAttacks, {
          equipmentId: shortbowEquipmentId,
          name: 'Shortbow',
          attackType: 'ranged',
          ability: 'DEX',
          isProficient: true,
          abilityModifier: 2,
          proficiencyBonus: 2,
          attackBonus: 4,
          damage: {
            formula: '1d6 + 2',
            base: '1d6',
            modifier: 2,
            damageType: 'Piercing',
          },
          properties: ['Ammunition', 'Two-Handed'],
          rangeExists: true,
        });
        await charactersAssert.validateWeaponAttackAbsent(
          character.weaponAttacks,
          'Dagger',
        );
        await charactersAssert.validateWeaponAttackAbsent(
          character.weaponAttacks,
          'Chain Mail',
        );
        await charactersAssert.validateWeaponAttackAbsent(
          character.weaponAttacks,
          'Shield',
        );
      },
    );

    test(
      'Add Greataxe Again',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.addCharacterEquipment(
          characterWithEquipmentId,
          {
            equipmentId: greataxeEquipmentId,
            quantity: 2,
            isEquipped: false,
          },
          authToken,
        );

        await charactersAssert.created(response);

        const characterEquipment: CharacterEquipmentResponseBody =
          await response.json();

        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateId(
          characterEquipment.characterId,
          characterWithEquipmentId,
        );
        await charactersAssert.validateCharacterEquipmentItem(
          characterEquipment,
          {
            id: greataxeEquipmentId,
            quantity: 3,
            isEquipped: false,
          },
        );
        await charactersAssert.validateCharacterEquipmentItems(
          characterEquipment,
          [
            { name: 'Shortbow', quantity: 1, isEquipped: true },
            { name: 'Dagger', quantity: 1, isEquipped: false },
            { name: 'Chain Mail', quantity: 1, isEquipped: true },
            { name: 'Shield', quantity: 1, isEquipped: true },
          ],
        );
      },
    );

    test(
      'Patch Greataxe Equipment',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.patchCharacterEquipment(
          characterWithEquipmentId,
          greataxeEquipmentId,
          {
            quantity: 2,
            isEquipped: false,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const characterEquipment: CharacterEquipmentResponseBody =
          await response.json();

        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateId(
          characterEquipment.characterId,
          characterWithEquipmentId,
        );
        await charactersAssert.validateCharacterEquipmentItem(
          characterEquipment,
          {
            id: greataxeEquipmentId,
            quantity: 2,
            isEquipped: false,
          },
        );
      },
    );

    test(
      'Patch Greataxe Equipped',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.patchCharacterEquipment(
          characterWithEquipmentId,
          greataxeEquipmentId,
          {
            isEquipped: true,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const characterEquipment: CharacterEquipmentResponseBody =
          await response.json();

        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateId(
          characterEquipment.characterId,
          characterWithEquipmentId,
        );
        await charactersAssert.validateCharacterEquipmentItem(
          characterEquipment,
          {
            id: greataxeEquipmentId,
            quantity: 2,
            isEquipped: true,
          },
        );
      },
    );

    test(
      'Delete Greataxe Equipment',
      { tag: ['@delete', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.deleteCharacterEquipment(
          characterWithEquipmentId,
          greataxeEquipmentId,
          authToken,
        );

        await charactersAssert.success(response);

        const characterEquipment: CharacterEquipmentResponseBody =
          await response.json();

        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateId(
          characterEquipment.characterId,
          characterWithEquipmentId,
        );
        await charactersAssert.validateCharacterEquipmentItemAbsent(
          characterEquipment,
          greataxeEquipmentId,
        );
        await charactersAssert.validateCharacterEquipmentItems(
          characterEquipment,
          [
            { name: 'Shortbow', quantity: 1, isEquipped: true },
            { name: 'Dagger', quantity: 1, isEquipped: false },
            { name: 'Chain Mail', quantity: 1, isEquipped: true },
            { name: 'Shield', quantity: 1, isEquipped: true },
          ],
        );
      },
    );

    test(
      'Get Equipment Without Greataxe',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterEquipment(
          characterWithEquipmentId,
          authToken,
        );

        await charactersAssert.success(response);

        const characterEquipment: CharacterEquipmentResponseBody =
          await response.json();

        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateId(
          characterEquipment.characterId,
          characterWithEquipmentId,
        );
        await charactersAssert.validateCharacterEquipmentItemAbsent(
          characterEquipment,
          greataxeEquipmentId,
        );
        await charactersAssert.validateCharacterEquipmentItems(
          characterEquipment,
          [
            { name: 'Shortbow', quantity: 1, isEquipped: true },
            { name: 'Dagger', quantity: 1, isEquipped: false },
            { name: 'Chain Mail', quantity: 1, isEquipped: true },
            { name: 'Shield', quantity: 1, isEquipped: true },
          ],
        );

        const detailResponse = await charactersClient.getCharacterDetail(
          characterWithEquipmentId,
          authToken,
        );

        await charactersAssert.success(detailResponse);

        const character: CharacterResponseBody = await detailResponse.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateHitPoints(
          character.hitPoints,
          fighterHitPoints,
        );
        await charactersAssert.validateInventoryWeight(
          character.inventoryWeight,
          {
            total: 64,
            sources: [
              { name: 'Shortbow', quantity: 1, weight: 2, total: 2 },
              { name: 'Dagger', quantity: 1, weight: 1, total: 1 },
              { name: 'Chain Mail', quantity: 1, weight: 55, total: 55 },
              { name: 'Shield', quantity: 1, weight: 6, total: 6 },
            ],
          },
        );
        await charactersAssert.validateWeaponAttackAbsent(
          character.weaponAttacks,
          'Greataxe',
        );
        await charactersAssert.validateWeaponAttack(character.weaponAttacks, {
          equipmentId: shortbowEquipmentId,
          name: 'Shortbow',
          attackType: 'ranged',
          ability: 'DEX',
          isProficient: true,
          abilityModifier: 2,
          proficiencyBonus: 2,
          attackBonus: 4,
        });
        await charactersAssert.validateWeaponAttackAbsent(
          character.weaponAttacks,
          'Chain Mail',
        );
        await charactersAssert.validateWeaponAttackAbsent(
          character.weaponAttacks,
          'Shield',
        );
      },
    );
  },
);
