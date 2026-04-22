import { TokenResponseBody } from '@/app/types/auth';
import {
  CharacterAbilityScoreOptionsResponseBody,
  CharacterArmorClass,
  CharacterAbilityScoresInput,
  CharacterAbilityScores,
  CharacterCreateRequestBody,
  CharacterCurrency,
  CharacterEquipmentResponseBody,
  CharacterEquipmentPackageChoiceResponseBody,
  CharacterHitPoints,
  CharacterSkillItem,
  CharacterListItem,
  CharacterResponseBody,
  CharacterSpellOptionsResponseBody,
  CharacterSpellSelectionResponseBody,
} from '@/app/types/character';
import { EquipmentDetail } from '@/app/types/equipment';
import { SkillName } from '@/app/types/skill';
import { APIRequestContext, expect, test } from '@playwright/test';

import { AuthClient } from '../clients/auth.client';
import { CharactersClient } from '../clients/characters.client';
import { EquipmentClient } from '../clients/equipment.client';
import { AuthAssert } from '../helpers/auth.assertions';
import { CharactersAssert } from '../helpers/characters.assertions';
import { getTestAuthCredentials } from '../helpers/test-auth-env';
import { expectedDetailedBackgrounds } from '../data/backgrounds.expected';
import { expectedDetailedClasses } from '../data/classes.expected';
import { expectedDetailedSpecies } from '../data/species.expected';

const barbarianAbilityScores: CharacterAbilityScores = {
  STR: 15,
  DEX: 13,
  CON: 14,
  INT: 8,
  WIS: 12,
  CHA: 10,
};

const wizardAbilityScores: CharacterAbilityScores = {
  STR: 8,
  DEX: 14,
  CON: 13,
  INT: 15,
  WIS: 12,
  CHA: 10,
};

const paladinAbilityScores: CharacterAbilityScores = {
  STR: 15,
  DEX: 10,
  CON: 13,
  INT: 8,
  WIS: 12,
  CHA: 14,
};

const aangAbilityScores: CharacterAbilityScores = {
  STR: 10,
  DEX: 15,
  CON: 14,
  INT: 8,
  WIS: 15,
  CHA: 12,
};

const drizztAbilityScores: CharacterAbilityScores = {
  STR: 10,
  DEX: 15,
  CON: 13,
  INT: 8,
  WIS: 14,
  CHA: 12,
};

const gimliAbilityScores: CharacterAbilityScores = {
  STR: 15,
  DEX: 13,
  CON: 14,
  INT: 8,
  WIS: 12,
  CHA: 10,
};

const yenneferAbilityScores: CharacterAbilityScores = {
  STR: 8,
  DEX: 14,
  CON: 15,
  INT: 12,
  WIS: 10,
  CHA: 15,
};

const casterCoverageAbilityScores: CharacterAbilityScores = {
  STR: 8,
  DEX: 14,
  CON: 13,
  INT: 12,
  WIS: 15,
  CHA: 15,
};

const barbarianAbilityBonuses: CharacterAbilityScores = {
  STR: 1,
  DEX: 1,
  CON: 1,
  INT: 0,
  WIS: 0,
  CHA: 0,
};

const wizardAbilityBonuses: CharacterAbilityScores = {
  STR: 0,
  DEX: 0,
  CON: 1,
  INT: 1,
  WIS: 1,
  CHA: 0,
};

const paladinAbilityBonuses: CharacterAbilityScores = {
  STR: 1,
  DEX: 0,
  CON: 0,
  INT: 1,
  WIS: 0,
  CHA: 1,
};

const aangAbilityBonuses: CharacterAbilityScores = {
  STR: 0,
  DEX: 0,
  CON: 0,
  INT: 1,
  WIS: 1,
  CHA: 1,
};

const drizztAbilityBonuses: CharacterAbilityScores = {
  STR: 1,
  DEX: 1,
  CON: 1,
  INT: 0,
  WIS: 0,
  CHA: 0,
};

const gimliAbilityBonuses: CharacterAbilityScores = {
  STR: 1,
  DEX: 1,
  CON: 1,
  INT: 0,
  WIS: 0,
  CHA: 0,
};

const yenneferAbilityBonuses: CharacterAbilityScores = {
  STR: 0,
  DEX: 0,
  CON: 0,
  INT: 1,
  WIS: 1,
  CHA: 1,
};

const casterCoverageAbilityBonuses: CharacterAbilityScores = {
  STR: 0,
  DEX: 0,
  CON: 0,
  INT: 1,
  WIS: 1,
  CHA: 1,
};

const barbarianAbilityScoresInput: CharacterAbilityScoresInput = {
  base: barbarianAbilityScores,
  bonuses: barbarianAbilityBonuses,
};

const wizardAbilityScoresInput: CharacterAbilityScoresInput = {
  base: wizardAbilityScores,
  bonuses: wizardAbilityBonuses,
};

const paladinAbilityScoresInput: CharacterAbilityScoresInput = {
  base: paladinAbilityScores,
  bonuses: paladinAbilityBonuses,
};

const aangAbilityScoresInput: CharacterAbilityScoresInput = {
  base: aangAbilityScores,
  bonuses: aangAbilityBonuses,
};

const drizztAbilityScoresInput: CharacterAbilityScoresInput = {
  base: drizztAbilityScores,
  bonuses: drizztAbilityBonuses,
};

const gimliAbilityScoresInput: CharacterAbilityScoresInput = {
  base: gimliAbilityScores,
  bonuses: gimliAbilityBonuses,
};

const yenneferAbilityScoresInput: CharacterAbilityScoresInput = {
  base: yenneferAbilityScores,
  bonuses: yenneferAbilityBonuses,
};

const casterCoverageAbilityScoresInput: CharacterAbilityScoresInput = {
  base: casterCoverageAbilityScores,
  bonuses: casterCoverageAbilityBonuses,
};

const patchedCurrency: CharacterCurrency = {
  cp: 10,
  sp: 4,
  ep: 0,
  gp: 25,
  pp: 1,
};

const soldierCurrency: CharacterCurrency = {
  cp: 0,
  sp: 0,
  ep: 0,
  gp: 29,
  pp: 0,
};

const sageCurrency: CharacterCurrency = {
  cp: 0,
  sp: 0,
  ep: 0,
  gp: 8,
  pp: 0,
};

const nobleCurrency: CharacterCurrency = {
  cp: 0,
  sp: 0,
  ep: 0,
  gp: 29,
  pp: 0,
};

const acolyteCurrency: CharacterCurrency = {
  cp: 0,
  sp: 0,
  ep: 0,
  gp: 8,
  pp: 0,
};

const barbarianArmorClass: CharacterArmorClass = {
  total: 14,
  base: 10,
  dexModifierApplied: 2,
  classBonus: 2,
  shieldBonus: 0,
  sources: [
    { name: 'Base AC', type: 'base', value: 10 },
    { name: 'Unarmored Defense', type: 'class', value: 2 },
  ],
};

const wizardArmorClass: CharacterArmorClass = {
  total: 12,
  base: 10,
  dexModifierApplied: 2,
  classBonus: 0,
  shieldBonus: 0,
  sources: [{ name: 'Base AC', type: 'base', value: 10 }],
};

const paladinArmorClass: CharacterArmorClass = {
  total: 18,
  base: 16,
  dexModifierApplied: 0,
  classBonus: 0,
  shieldBonus: 2,
  sources: [
    { name: 'Chain Mail', type: 'armor', value: 16 },
    { name: 'Shield', type: 'shield', value: 2 },
  ],
};

const aangArmorClass: CharacterArmorClass = {
  total: 15,
  base: 10,
  dexModifierApplied: 2,
  classBonus: 3,
  shieldBonus: 0,
  sources: [
    { name: 'Base AC', type: 'base', value: 10 },
    { name: 'Unarmored Defense', type: 'class', value: 3 },
  ],
};

const barbarianHitPoints: CharacterHitPoints = {
  max: 14,
  current: 14,
  temporary: 0,
  hitDie: 12,
  conModifier: 2,
  calculation: '12 + 2',
};

const monkHitPoints: CharacterHitPoints = {
  max: 10,
  current: 10,
  temporary: 0,
  hitDie: 8,
  conModifier: 2,
  calculation: '8 + 2',
};

const paladinHitPoints: CharacterHitPoints = {
  max: 25,
  current: 25,
  temporary: 0,
  hitDie: 10,
  conModifier: 1,
  calculation: '10 + 1 + (2 * (6 + 1))',
};

const wizardHitPoints: CharacterHitPoints = {
  max: 8,
  current: 8,
  temporary: 0,
  hitDie: 6,
  conModifier: 2,
  calculation: '6 + 2',
};

const fighterHitPoints: CharacterHitPoints = {
  max: 12,
  current: 12,
  temporary: 0,
  hitDie: 10,
  conModifier: 2,
  calculation: '10 + 2',
};

const sorcererHitPoints: CharacterHitPoints = {
  max: 8,
  current: 8,
  temporary: 0,
  hitDie: 6,
  conModifier: 2,
  calculation: '6 + 2',
};

const barbarianSkillProficiencies: SkillName[] = [
  'Athletics',
  'Intimidation',
  'Perception',
  'Survival',
];

const wizardSkillProficiencies: SkillName[] = [
  'Arcana',
  'History',
  'Investigation',
  'Religion',
];

async function issueDemoToken(request: APIRequestContext) {
  const authCredentials = getTestAuthCredentials();
  const authClient = new AuthClient(request);
  const authAssert = new AuthAssert();

  const tokenResponse = await authClient.issueToken(authCredentials);

  await authAssert.success(tokenResponse);

  const tokenBody: TokenResponseBody = await tokenResponse.json();

  await authAssert.validateTokenResponse(tokenBody);

  return tokenBody.token;
}

async function addCharacterEquipmentBySlug(
  request: APIRequestContext,
  characterId: number,
  authToken: string,
  equipmentItems: { slug: string; quantity: number; isEquipped: boolean }[],
) {
  const equipmentClient = new EquipmentClient(request);
  const charactersClient = new CharactersClient(request);
  const charactersAssert = new CharactersAssert();
  let characterEquipment: CharacterEquipmentResponseBody | null = null;

  for (const equipmentItem of equipmentItems) {
    const equipmentResponse = await equipmentClient.getEquipmentDetail(
      equipmentItem.slug,
    );

    expect(equipmentResponse.status()).toBe(200);

    const equipment: EquipmentDetail = await equipmentResponse.json();
    const response = await charactersClient.addCharacterEquipment(
      characterId,
      {
        equipmentId: equipment.id,
        quantity: equipmentItem.quantity,
        isEquipped: equipmentItem.isEquipped,
      },
      authToken,
    );

    await charactersAssert.created(response);

    characterEquipment = await response.json();
  }

  expect(characterEquipment).not.toBeNull();

  return characterEquipment!;
}

test.describe(
  'Characters API - Conan The Barbarian Full Progression Flow',
  { tag: ['@characters', '@flow', '@barbarian'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let createdCharacterId: number;
    let createdCharacterName: string;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'List Characters',
      { tag: ['@get', '@smoke', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const listResponse = await charactersClient.getCharacters(authToken);

        await charactersAssert.success(listResponse);

        const characters: CharacterListItem[] = await listResponse.json();

        await charactersAssert.validateCharacterListSchema(characters);
      },
    );

    test(
      'Create Draft',
      { tag: ['@post', '@smoke', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();
        createdCharacterName = `Conan The Barbarian ${Date.now()}`;

        const createResponse = await charactersClient.createCharacter(
          {
            name: createdCharacterName,
          },
          authToken,
        );

        await charactersAssert.created(createResponse);

        const createdCharacter: CharacterResponseBody =
          await createResponse.json();
        createdCharacterId = createdCharacter.id;

        await charactersAssert.validateCharacterResponseSchema(
          createdCharacter,
        );
        await charactersAssert.validateName(
          createdCharacter.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(createdCharacter.status, 'draft');
        await charactersAssert.validateClassId(createdCharacter.classId, null);
        await charactersAssert.validateSpeciesId(
          createdCharacter.speciesId,
          null,
        );
        await charactersAssert.validateBackgroundId(
          createdCharacter.backgroundId,
          null,
        );
        await charactersAssert.validateLevel(createdCharacter.level, 1);
        await charactersAssert.validateMissingFields(
          createdCharacter.missingFields,
          ['classId', 'speciesId', 'backgroundId'],
        );
        await charactersAssert.validatePendingChoices(
          createdCharacter.pendingChoices,
          [],
        );
        await charactersAssert.validateAbilityScores(
          createdCharacter.abilityScores,
          null,
        );
        await charactersAssert.validateAbilityScoreRules(
          createdCharacter.abilityScoreRules,
          null,
        );
        await charactersAssert.validateHitPoints(
          createdCharacter.hitPoints,
          null,
        );
        await charactersAssert.validateInitiative(
          createdCharacter.initiative,
          null,
        );
        await charactersAssert.validatePassivePerception(
          createdCharacter.passivePerception,
          null,
        );
        await charactersAssert.validateMovement(
          createdCharacter.movement,
          null,
        );
        await charactersAssert.validateInventoryWeight(
          createdCharacter.inventoryWeight,
          { total: 0, sources: [] },
        );
        await test.step('Validate draft character has no saving throws', async () => {
          expect(createdCharacter.savingThrows).toEqual([]);
        });
        await charactersAssert.validateClassDetailsPresence(
          createdCharacter.classDetails ?? null,
          false,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          createdCharacter.speciesDetails ?? null,
          false,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          createdCharacter.backgroundDetails ?? null,
          false,
        );
      },
    );

    test('Get Draft', { tag: ['@get', '@data'] }, async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const getResponse = await charactersClient.getCharacterDetail(
        createdCharacterId,
        authToken,
      );

      await charactersAssert.success(getResponse);

      const fetchedCharacter: CharacterResponseBody = await getResponse.json();

      await charactersAssert.validateCharacterResponseSchema(fetchedCharacter);
      await charactersAssert.validateId(
        fetchedCharacter.id,
        createdCharacterId,
      );
      await charactersAssert.validateName(
        fetchedCharacter.name,
        createdCharacterName,
      );
      await charactersAssert.validateStatus(fetchedCharacter.status, 'draft');
      await charactersAssert.validateClassId(fetchedCharacter.classId, null);
      await charactersAssert.validateSpeciesId(
        fetchedCharacter.speciesId,
        null,
      );
      await charactersAssert.validateBackgroundId(
        fetchedCharacter.backgroundId,
        null,
      );
      await charactersAssert.validateLevel(fetchedCharacter.level, 1);
      await charactersAssert.validateMissingFields(
        fetchedCharacter.missingFields,
        ['classId', 'speciesId', 'backgroundId'],
      );
      await charactersAssert.validatePendingChoices(
        fetchedCharacter.pendingChoices,
        [],
      );
      await charactersAssert.validateAbilityScores(
        fetchedCharacter.abilityScores,
        null,
      );
      await charactersAssert.validateAbilityScoreRules(
        fetchedCharacter.abilityScoreRules,
        null,
      );
      await charactersAssert.validateClassDetailsPresence(
        fetchedCharacter.classDetails ?? null,
        false,
      );
      await charactersAssert.validateSpeciesDetailsPresence(
        fetchedCharacter.speciesDetails ?? null,
        false,
      );
      await charactersAssert.validateBackgroundDetailsPresence(
        fetchedCharacter.backgroundDetails ?? null,
        false,
      );
    });

    test(
      'Add Class Barbarian',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const updateResponse = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            classId: 1,
            level: 1,
          },
          authToken,
        );

        await charactersAssert.success(updateResponse);

        const updatedCharacter: CharacterResponseBody =
          await updateResponse.json();

        await charactersAssert.validateCharacterResponseSchema(
          updatedCharacter,
        );
        await charactersAssert.validateId(
          updatedCharacter.id,
          createdCharacterId,
        );
        await charactersAssert.validateName(
          updatedCharacter.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(updatedCharacter.status, 'draft');
        await charactersAssert.validateClassId(updatedCharacter.classId, 1);
        await charactersAssert.validateSpeciesId(
          updatedCharacter.speciesId,
          null,
        );
        await charactersAssert.validateBackgroundId(
          updatedCharacter.backgroundId,
          null,
        );
        await charactersAssert.validateLevel(updatedCharacter.level, 1);
        await charactersAssert.validateMissingFields(
          updatedCharacter.missingFields,
          ['speciesId', 'backgroundId'],
        );
        await charactersAssert.validatePendingChoices(
          updatedCharacter.pendingChoices,
          ['classEquipmentSelection'],
        );
        await charactersAssert.validateAbilityScores(
          updatedCharacter.abilityScores,
          null,
        );
        await charactersAssert.validateHitPoints(
          updatedCharacter.hitPoints,
          null,
        );
        await charactersAssert.validateInitiative(
          updatedCharacter.initiative,
          null,
        );
        await charactersAssert.validatePassivePerception(
          updatedCharacter.passivePerception,
          null,
        );
        await charactersAssert.validateMovement(
          updatedCharacter.movement,
          null,
        );
        await test.step('Validate character without scores has no saving throws', async () => {
          expect(updatedCharacter.savingThrows).toEqual([]);
        });
        await charactersAssert.validateClassDetailsPresence(
          updatedCharacter.classDetails ?? null,
          true,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          updatedCharacter.speciesDetails ?? null,
          false,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          updatedCharacter.backgroundDetails ?? null,
          false,
        );

        if (updatedCharacter.classDetails) {
          const classDetails = updatedCharacter.classDetails;

          await charactersAssert.validateId(classDetails.id, 1);
          await charactersAssert.validateName(classDetails.name, 'Barbarian');
          await charactersAssert.validateClassDetailsSchema(
            classDetails,
            updatedCharacter.level,
          );
          await test.step('Validate barbarian class details creation fields', async () => {
            expect(classDetails.skillProficiencyChoices).toEqual(
              expectedDetailedClasses.barbarian.skillProficiencyChoices,
            );
            expect(classDetails.weaponProficiencies).toEqual(
              expectedDetailedClasses.barbarian.weaponProficiencies,
            );
            expect(classDetails.armorTraining).toEqual(
              expectedDetailedClasses.barbarian.armorTraining,
            );
            expect(classDetails.startingEquipmentOptions).toEqual(
              expectedDetailedClasses.barbarian.startingEquipmentOptions,
            );
            expect(classDetails.equipmentOptions).toEqual(
              expectedDetailedClasses.barbarian.equipmentOptions,
            );
          });
        }
      },
    );

    test('Get Barbarian', { tag: ['@get', '@data'] }, async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterDetail(
        createdCharacterId,
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateClassId(character.classId, 1);
      await charactersAssert.validateSpeciesId(character.speciesId, null);
      await charactersAssert.validateBackgroundId(character.backgroundId, null);
      await charactersAssert.validateMissingFields(character.missingFields, [
        'speciesId',
        'backgroundId',
      ]);
      await charactersAssert.validatePendingChoices(character.pendingChoices, [
        'classEquipmentSelection',
      ]);
      await charactersAssert.validateAbilityScores(
        character.abilityScores,
        null,
      );
      await charactersAssert.validateClassDetailsPresence(
        character.classDetails ?? null,
        true,
      );
      await charactersAssert.validateSpeciesDetailsPresence(
        character.speciesDetails ?? null,
        false,
      );
      await charactersAssert.validateBackgroundDetailsPresence(
        character.backgroundDetails ?? null,
        false,
      );
    });

    test(
      'Add Species Human',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            speciesId: 7,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateClassId(character.classId, 1);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(
          character.backgroundId,
          null,
        );
        await charactersAssert.validateMissingFields(character.missingFields, [
          'backgroundId',
        ]);
        await charactersAssert.validatePendingChoices(
          character.pendingChoices,
          ['classEquipmentSelection'],
        );
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          null,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          character.speciesDetails ?? null,
          true,
        );

        if (character.speciesDetails) {
          await charactersAssert.validateId(character.speciesDetails.id, 7);
          await charactersAssert.validateName(
            character.speciesDetails.name,
            expectedDetailedSpecies.human.name,
          );
          await charactersAssert.validateSpeciesDetailsSchema(
            character.speciesDetails,
          );
        }
      },
    );

    test(
      'Get Human Barbarian',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateClassId(character.classId, 1);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(
          character.backgroundId,
          null,
        );
        await charactersAssert.validateMissingFields(character.missingFields, [
          'backgroundId',
        ]);
        await charactersAssert.validatePendingChoices(
          character.pendingChoices,
          ['classEquipmentSelection'],
        );
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          null,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          character.speciesDetails ?? null,
          true,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          character.backgroundDetails ?? null,
          false,
        );
      },
    );

    test(
      'Add Background Soldier',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const updateResponse = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            backgroundId: 16,
          },
          authToken,
        );

        await charactersAssert.success(updateResponse);

        const updatedCharacter: CharacterResponseBody =
          await updateResponse.json();

        await charactersAssert.validateCharacterResponseSchema(
          updatedCharacter,
        );
        await charactersAssert.validateId(
          updatedCharacter.id,
          createdCharacterId,
        );
        await charactersAssert.validateName(
          updatedCharacter.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(
          updatedCharacter.status,
          'complete',
        );
        await charactersAssert.validateClassId(updatedCharacter.classId, 1);
        await charactersAssert.validateSpeciesId(updatedCharacter.speciesId, 7);
        await charactersAssert.validateBackgroundId(
          updatedCharacter.backgroundId,
          16,
        );
        await charactersAssert.validateLevel(updatedCharacter.level, 1);
        await charactersAssert.validateMissingFields(
          updatedCharacter.missingFields,
          [],
        );
        await charactersAssert.validatePendingChoices(
          updatedCharacter.pendingChoices,
          ['classEquipmentSelection', 'backgroundEquipmentSelection'],
        );
        await charactersAssert.validateAbilityScores(
          updatedCharacter.abilityScores,
          null,
        );
        await charactersAssert.validateClassDetailsPresence(
          updatedCharacter.classDetails ?? null,
          true,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          updatedCharacter.speciesDetails ?? null,
          true,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          updatedCharacter.backgroundDetails ?? null,
          true,
        );
        await charactersAssert.validateClassDetailsPresence(
          updatedCharacter.classDetails ?? null,
          true,
        );

        if (updatedCharacter.speciesDetails) {
          await charactersAssert.validateId(
            updatedCharacter.speciesDetails.id,
            7,
          );
          await charactersAssert.validateName(
            updatedCharacter.speciesDetails.name,
            expectedDetailedSpecies.human.name,
          );
          await charactersAssert.validateSpeciesDetailsSchema(
            updatedCharacter.speciesDetails,
          );
        }

        if (updatedCharacter.backgroundDetails) {
          await charactersAssert.validateId(
            updatedCharacter.backgroundDetails.id,
            16,
          );
          await charactersAssert.validateName(
            updatedCharacter.backgroundDetails.name,
            expectedDetailedBackgrounds.soldier.name,
          );
          await charactersAssert.validateBackgroundDetailsSchema(
            updatedCharacter.backgroundDetails,
          );
        }

        if (updatedCharacter.classDetails) {
          const classDetails = updatedCharacter.classDetails;

          await test.step('Validate barbarian class details still expose creation fields', async () => {
            expect(classDetails.skillProficiencyChoices).toEqual(
              expectedDetailedClasses.barbarian.skillProficiencyChoices,
            );
            expect(classDetails.weaponProficiencies).toEqual(
              expectedDetailedClasses.barbarian.weaponProficiencies,
            );
            expect(classDetails.armorTraining).toEqual(
              expectedDetailedClasses.barbarian.armorTraining,
            );
            expect(classDetails.startingEquipmentOptions).toEqual(
              expectedDetailedClasses.barbarian.startingEquipmentOptions,
            );
            expect(classDetails.equipmentOptions).toEqual(
              expectedDetailedClasses.barbarian.equipmentOptions,
            );
          });
        }
      },
    );

    test(
      'Get Soldier Barbarian',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateClassId(character.classId, 1);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(character.backgroundId, 16);
        await charactersAssert.validateMissingFields(
          character.missingFields,
          [],
        );
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          null,
        );
        await charactersAssert.validateAbilityScoreRules(
          character.abilityScoreRules,
          expectedDetailedBackgrounds.soldier.abilityScores,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          character.backgroundDetails ?? null,
          true,
        );
        await charactersAssert.validatePendingChoices(
          character.pendingChoices,
          ['classEquipmentSelection', 'backgroundEquipmentSelection'],
        );
      },
    );

    test(
      'Get character spell options',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const spellOptionsResponse =
          await charactersClient.getCharacterSpellOptions(
            createdCharacterId,
            authToken,
          );

        await charactersAssert.success(spellOptionsResponse);

        const spellOptions: CharacterSpellOptionsResponseBody =
          await spellOptionsResponse.json();

        await charactersAssert.validateCharacterSpellOptionsSchema(
          spellOptions,
        );
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

        await test.step('Validate barbarian spell selection is unavailable', async () => {
          expect(spellSelection.selectionRules.canSelectSpells).toBe(false);
          expect(spellSelection.selectedSpells).toEqual([]);
          expect(spellSelection.availableSpells).toEqual([]);
        });
      },
    );

    test(
      'Get Attribute Options Barbarian',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterAbilityScoreOptions(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const abilityScoreOptions: CharacterAbilityScoreOptionsResponseBody =
          await response.json();

        await charactersAssert.validateCharacterAbilityScoreOptionsSchema(
          abilityScoreOptions,
        );
        await charactersAssert.validateId(
          abilityScoreOptions.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateBackgroundId(
          abilityScoreOptions.backgroundId,
          16,
        );
        await charactersAssert.validateName(
          abilityScoreOptions.backgroundName ?? '',
          expectedDetailedBackgrounds.soldier.name,
        );
        await charactersAssert.validateSelectedAbilityScores(
          abilityScoreOptions.selectedAbilityScores,
          null,
        );
        await charactersAssert.validateAbilityScoreRules(
          abilityScoreOptions.selectionRules,
          expectedDetailedBackgrounds.soldier.abilityScores,
        );

        await test.step('Validate soldier available choices', async () => {
          expect(abilityScoreOptions.availableChoices).toEqual(
            expectedDetailedBackgrounds.soldier.abilityScores,
          );
        });
      },
    );

    test(
      'Select Scores Barbarian',
      { tag: ['@put', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacterAbilityScores(
          createdCharacterId,
          {
            abilityScores: barbarianAbilityScoresInput,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const abilityScoreOptions: CharacterAbilityScoreOptionsResponseBody =
          await response.json();

        await charactersAssert.validateCharacterAbilityScoreOptionsSchema(
          abilityScoreOptions,
        );
        await charactersAssert.validateId(
          abilityScoreOptions.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateBackgroundId(
          abilityScoreOptions.backgroundId,
          16,
        );
        await charactersAssert.validateName(
          abilityScoreOptions.backgroundName ?? '',
          expectedDetailedBackgrounds.soldier.name,
        );
        await charactersAssert.validateSelectedAbilityScores(
          abilityScoreOptions.selectedAbilityScores,
          barbarianAbilityScores,
          barbarianAbilityBonuses,
        );
        await charactersAssert.validateAbilityScoreRules(
          abilityScoreOptions.selectionRules,
          expectedDetailedBackgrounds.soldier.abilityScores,
        );

        await test.step('Validate soldier available choices after selection', async () => {
          expect(abilityScoreOptions.availableChoices).toEqual(
            expectedDetailedBackgrounds.soldier.abilityScores,
          );
        });
      },
    );

    test(
      'Add Skills Barbarian',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            skillProficiencies: barbarianSkillProficiencies,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const updatedCharacter: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(
          updatedCharacter,
        );
        await charactersAssert.validateId(
          updatedCharacter.id,
          createdCharacterId,
        );
        await charactersAssert.validateSkillProficiencies(
          updatedCharacter.skillProficiencies,
          barbarianSkillProficiencies,
        );
        await charactersAssert.validateAbilityScores(
          updatedCharacter.abilityScores,
          barbarianAbilityScores,
          barbarianAbilityBonuses,
        );
      },
    );

    test(
      'Get Skilled Barbarian',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateId(character.id, createdCharacterId);
        await charactersAssert.validateSkillProficiencies(
          character.skillProficiencies,
          barbarianSkillProficiencies,
        );
      },
    );

    test(
      'Get Skills Barbarian',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterSkills(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const skills: CharacterSkillItem[] = await response.json();

        await charactersAssert.validateCharacterSkillsSchema(skills);
        await charactersAssert.validateCharacterSkillCalculation(skills, {
          name: 'Athletics',
          ability: 'STR',
          isProficient: true,
          abilityModifier: 3,
          level: 1,
        });
        await charactersAssert.validateCharacterSkillCalculation(skills, {
          name: 'Stealth',
          ability: 'DEX',
          isProficient: false,
          abilityModifier: 2,
          level: 1,
        });
      },
    );

    test(
      'Choose Class Equipment Barbarian',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.chooseClassEquipmentPackage(
          createdCharacterId,
          { optionLabel: 'A' },
          authToken,
        );

        await charactersAssert.success(response);

        const body: CharacterEquipmentPackageChoiceResponseBody =
          await response.json();

        await charactersAssert.validateId(body.characterId, createdCharacterId);
        expect(body.appliedChoice).toEqual({
          source: 'class',
          label: 'A',
          optionIndex: 0,
        });
        expect(body.addedCurrency).toEqual({
          cp: 0,
          sp: 0,
          ep: 0,
          gp: 15,
          pp: 0,
        });
        expect(body.pendingChoices).toEqual(['backgroundEquipmentSelection']);
        expect(body.addedEquipment).toEqual(
          expect.arrayContaining([
            {
              id: expect.any(Number),
              name: 'Greataxe',
              quantity: 1,
              isEquipped: true,
            },
            {
              id: expect.any(Number),
              name: 'Handaxe',
              quantity: 4,
              isEquipped: false,
            },
            {
              id: expect.any(Number),
              name: 'Backpack',
              quantity: 1,
              isEquipped: false,
            },
            {
              id: expect.any(Number),
              name: 'Bedroll',
              quantity: 1,
              isEquipped: false,
            },
            {
              id: expect.any(Number),
              name: 'Tinderbox',
              quantity: 1,
              isEquipped: false,
            },
            {
              id: expect.any(Number),
              name: 'Torch',
              quantity: 10,
              isEquipped: false,
            },
            {
              id: expect.any(Number),
              name: 'Rations',
              quantity: 10,
              isEquipped: false,
            },
            {
              id: expect.any(Number),
              name: 'Waterskin',
              quantity: 1,
              isEquipped: false,
            },
            {
              id: expect.any(Number),
              name: 'Rope',
              quantity: 1,
              isEquipped: false,
            },
          ]),
        );
        expect(body.skippedItems).toEqual(
          expect.arrayContaining([
            {
              name: "Explorer's Pack: Mess Kit",
              reason: 'Kit component could not be mapped to the catalog',
            },
          ]),
        );

        const characterEquipment: CharacterEquipmentResponseBody = body;
        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateId(
          characterEquipment.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateCharacterEquipmentItems(
          characterEquipment,
          [
            { name: 'Greataxe', quantity: 1, isEquipped: true },
            { name: 'Handaxe', quantity: 4, isEquipped: false },
          ],
        );

        const detailResponse = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(detailResponse);

        const detailCharacter: CharacterResponseBody =
          await detailResponse.json();

        await charactersAssert.validatePendingChoices(
          detailCharacter.pendingChoices,
          ['backgroundEquipmentSelection'],
        );
        expect(detailCharacter.currency).toEqual({
          cp: 0,
          sp: 0,
          ep: 0,
          gp: 15,
          pp: 0,
        });
      },
    );

    test(
      'Choose Background Equipment Barbarian',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response =
          await charactersClient.chooseBackgroundEquipmentPackage(
            createdCharacterId,
            { optionIndex: 0 },
            authToken,
          );

        await charactersAssert.success(response);

        const body: CharacterEquipmentPackageChoiceResponseBody =
          await response.json();

        await charactersAssert.validateId(body.characterId, createdCharacterId);
        expect(body.appliedChoice).toEqual({
          source: 'background',
          label: null,
          optionIndex: 0,
        });
        expect(body.addedCurrency).toEqual({
          cp: 0,
          sp: 0,
          ep: 0,
          gp: 14,
          pp: 0,
        });
        expect(body.pendingChoices).toEqual([]);
        expect(body.addedEquipment).toEqual(
          expect.arrayContaining([
            {
              id: expect.any(Number),
              name: 'Spear',
              quantity: 1,
              isEquipped: true,
            },
            {
              id: expect.any(Number),
              name: 'Shortbow',
              quantity: 1,
              isEquipped: false,
            },
            {
              id: expect.any(Number),
              name: 'Arrows',
              quantity: 20,
              isEquipped: false,
            },
            {
              id: expect.any(Number),
              name: 'Quiver',
              quantity: 1,
              isEquipped: false,
            },
            {
              id: expect.any(Number),
              name: "Clothes, Traveler's",
              quantity: 1,
              isEquipped: false,
            },
          ]),
        );
        expect(body.skippedItems).toEqual(
          expect.arrayContaining([
            {
              name: 'Gaming Set (same as above)',
              reason:
                'Depends on a previous choice that is not handled by this endpoint',
            },
          ]),
        );

        const detailResponse = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(detailResponse);

        const detailCharacter: CharacterResponseBody =
          await detailResponse.json();

        await charactersAssert.validatePendingChoices(
          detailCharacter.pendingChoices,
          [],
        );
        expect(detailCharacter.currency).toEqual({
          cp: 0,
          sp: 0,
          ep: 0,
          gp: 29,
          pp: 0,
        });
      },
    );

    test(
      'Get Equipment Barbarian',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterEquipment(
          createdCharacterId,
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
          createdCharacterId,
        );
        await charactersAssert.validateCharacterEquipmentItems(
          characterEquipment,
          [
            { name: 'Greataxe', quantity: 1, isEquipped: true },
            { name: 'Handaxe', quantity: 4, isEquipped: false },
            { name: 'Backpack', quantity: 1, isEquipped: false },
            { name: 'Bedroll', quantity: 1, isEquipped: false },
            { name: 'Tinderbox', quantity: 1, isEquipped: false },
            { name: 'Torch', quantity: 10, isEquipped: false },
            { name: 'Rations', quantity: 10, isEquipped: false },
            { name: 'Waterskin', quantity: 1, isEquipped: false },
            { name: 'Rope', quantity: 1, isEquipped: false },
            { name: 'Spear', quantity: 1, isEquipped: true },
            { name: 'Shortbow', quantity: 1, isEquipped: false },
            { name: 'Arrows', quantity: 20, isEquipped: false },
            { name: 'Quiver', quantity: 1, isEquipped: false },
            { name: "Clothes, Traveler's", quantity: 1, isEquipped: false },
          ],
        );
      },
    );

    test(
      'Get Complete Barbarian',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const finalGetResponse = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(finalGetResponse);

        const finalCharacter: CharacterResponseBody =
          await finalGetResponse.json();

        await charactersAssert.validateCharacterResponseSchema(finalCharacter);
        await charactersAssert.validateId(
          finalCharacter.id,
          createdCharacterId,
        );
        await charactersAssert.validateName(
          finalCharacter.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(
          finalCharacter.status,
          'complete',
        );
        await charactersAssert.validateClassId(finalCharacter.classId, 1);
        await charactersAssert.validateSpeciesId(finalCharacter.speciesId, 7);
        await charactersAssert.validateBackgroundId(
          finalCharacter.backgroundId,
          16,
        );
        await charactersAssert.validateLevel(finalCharacter.level, 1);
        await charactersAssert.validateMissingFields(
          finalCharacter.missingFields,
          [],
        );
        await charactersAssert.validatePendingChoices(
          finalCharacter.pendingChoices,
          [],
        );
        await charactersAssert.validateAbilityScores(
          finalCharacter.abilityScores,
          barbarianAbilityScores,
          barbarianAbilityBonuses,
        );
        await charactersAssert.validateArmorClass(
          finalCharacter.armorClass,
          barbarianArmorClass,
        );
        await charactersAssert.validateHitPoints(
          finalCharacter.hitPoints,
          barbarianHitPoints,
        );
        await charactersAssert.validateInitiative(finalCharacter.initiative, {
          ability: 'DEX',
          abilityModifier: 2,
          bonus: 0,
          total: 2,
        });
        await charactersAssert.validatePassivePerception(
          finalCharacter.passivePerception,
          {
            skill: 'Perception',
            ability: 'WIS',
            base: 10,
            skillModifier: 3,
            bonus: 0,
            total: 13,
          },
        );
        await charactersAssert.validateMovement(
          finalCharacter.movement,
          { baseSpeed: 30, unit: 'ft' },
          { type: 'species', name: 'Human', value: 30 },
        );
        await charactersAssert.validateInventoryWeight(
          finalCharacter.inventoryWeight,
          {
            total: 98,
            sources: [
              { name: 'Greataxe', quantity: 1, weight: 7, total: 7 },
              { name: 'Handaxe', quantity: 4, weight: 2, total: 8 },
              { name: 'Backpack', quantity: 1, weight: 5, total: 5 },
              { name: 'Bedroll', quantity: 1, weight: 7, total: 7 },
              { name: 'Tinderbox', quantity: 1, weight: 1, total: 1 },
              { name: 'Torch', quantity: 10, weight: 1, total: 10 },
              { name: 'Rations', quantity: 10, weight: 2, total: 20 },
              { name: 'Waterskin', quantity: 1, weight: 5, total: 5 },
              { name: 'Rope', quantity: 1, weight: 5, total: 5 },
              { name: 'Spear', quantity: 1, weight: 3, total: 3 },
              { name: 'Shortbow', quantity: 1, weight: 2, total: 2 },
              { name: 'Arrows', quantity: 20, weight: 1, total: 20 },
              { name: 'Quiver', quantity: 1, weight: 1, total: 1 },
              { name: "Clothes, Traveler's", quantity: 1, weight: 4, total: 4 },
            ],
          },
        );
        await charactersAssert.validateSpellcastingSummary(
          finalCharacter.spellcastingSummary,
          {
            canCastSpells: false,
            ability: null,
            abilityModifier: null,
            spellSaveDc: null,
            spellAttackBonus: null,
            selectedSpellsCount: 0,
            selectedCantripsCount: 0,
          },
        );
        await test.step('Validate barbarian has no spell slots or selected spells', async () => {
          expect(finalCharacter.spellSlots).toEqual([]);
          expect(finalCharacter.selectedSpells).toEqual([]);
        });
        await charactersAssert.validateSavingThrowOrder(
          finalCharacter.savingThrows,
        );
        await charactersAssert.validateSavingThrow(
          finalCharacter.savingThrows,
          {
            ability: 'STR',
            isProficient: true,
            abilityModifier: 3,
            proficiencyBonus: 2,
            bonus: 0,
            total: 5,
          },
        );
        await charactersAssert.validateSavingThrow(
          finalCharacter.savingThrows,
          {
            ability: 'CON',
            isProficient: true,
            abilityModifier: 2,
            proficiencyBonus: 2,
            bonus: 0,
            total: 4,
          },
        );
        await charactersAssert.validateSavingThrow(
          finalCharacter.savingThrows,
          {
            ability: 'DEX',
            isProficient: false,
            abilityModifier: 2,
            proficiencyBonus: 0,
            bonus: 0,
            total: 2,
          },
        );
        await charactersAssert.validateWeaponAttack(
          finalCharacter.weaponAttacks,
          {
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
          },
        );
        await charactersAssert.validateWeaponAttack(
          finalCharacter.weaponAttacks,
          {
            name: 'Spear',
            attackType: 'melee',
            ability: 'STR',
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
            properties: ['Thrown', 'Versatile'],
            rangeExists: false,
            attackModes: [
              {
                mode: 'melee',
                attackType: 'melee',
                ability: 'STR',
                attackBonus: 5,
                damage: {
                  formula: '1d6 + 3',
                  base: '1d6',
                  modifier: 3,
                  damageType: 'Piercing',
                },
                range: null,
              },
              {
                mode: 'thrown',
                attackType: 'ranged',
                ability: 'STR',
                attackBonus: 5,
                damage: {
                  formula: '1d6 + 3',
                  base: '1d6',
                  modifier: 3,
                  damageType: 'Piercing',
                },
                range: {
                  normal: 20,
                  long: 60,
                  unit: 'ft',
                },
              },
              {
                mode: 'versatile',
                attackType: 'melee',
                ability: 'STR',
                attackBonus: 5,
                damage: {
                  formula: '1d8 + 3',
                  base: '1d8',
                  modifier: 3,
                  damageType: 'Piercing',
                },
                range: null,
              },
            ],
          },
        );
        await charactersAssert.validateWeaponAttackAbsent(
          finalCharacter.weaponAttacks,
          'Shortbow',
        );
        await charactersAssert.validateAbilityScoreRules(
          finalCharacter.abilityScoreRules,
          expectedDetailedBackgrounds.soldier.abilityScores,
        );
        await charactersAssert.validateCurrency(
          finalCharacter.currency,
          soldierCurrency,
        );
        await charactersAssert.validateSkillProficiencies(
          finalCharacter.skillProficiencies,
          barbarianSkillProficiencies,
        );
        await charactersAssert.validateClassDetailsPresence(
          finalCharacter.classDetails ?? null,
          true,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          finalCharacter.speciesDetails ?? null,
          true,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          finalCharacter.backgroundDetails ?? null,
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

        if (finalCharacter.speciesDetails) {
          await charactersAssert.validateId(
            finalCharacter.speciesDetails.id,
            7,
          );
          await charactersAssert.validateName(
            finalCharacter.speciesDetails.name,
            expectedDetailedSpecies.human.name,
          );
          await charactersAssert.validateSpeciesDetailsSchema(
            finalCharacter.speciesDetails,
          );
        }

        if (finalCharacter.backgroundDetails) {
          await charactersAssert.validateId(
            finalCharacter.backgroundDetails.id,
            16,
          );
          await charactersAssert.validateName(
            finalCharacter.backgroundDetails.name,
            expectedDetailedBackgrounds.soldier.name,
          );
          await charactersAssert.validateBackgroundDetailsSchema(
            finalCharacter.backgroundDetails,
          );
        }
      },
    );
  },
);

test.describe(
  'Characters API - Aang The Monk Unarmored Defense Flow',
  { tag: ['@characters', '@flow', '@monk'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let createdCharacterId: number;
    const createdCharacterName = `Aang The Monk ${Date.now()}`;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create Aang The Monk',
      { tag: ['@post', '@smoke', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.createCharacter(
          {
            name: createdCharacterName,
            classId: 6,
            speciesId: 7,
            backgroundId: 1,
            level: 1,
            currency: acolyteCurrency,
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
        await charactersAssert.validateStatus(character.status, 'complete');
        await charactersAssert.validateClassId(character.classId, 6);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(character.backgroundId, 1);
        await charactersAssert.validateLevel(character.level, 1);
        await charactersAssert.validateMissingFields(
          character.missingFields,
          [],
        );
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          null,
        );
        await charactersAssert.validateHitPoints(character.hitPoints, null);
        await charactersAssert.validateInitiative(character.initiative, null);
        await charactersAssert.validatePassivePerception(
          character.passivePerception,
          null,
        );
        await charactersAssert.validateMovement(
          character.movement,
          { baseSpeed: 30, unit: 'ft' },
          { type: 'species', name: 'Human', value: 30 },
        );
        await test.step('Validate monk without scores has no saving throws', async () => {
          expect(character.savingThrows).toEqual([]);
        });
        await charactersAssert.validateCurrency(
          character.currency,
          acolyteCurrency,
        );
        await charactersAssert.validateAbilityScoreRules(
          character.abilityScoreRules,
          expectedDetailedBackgrounds.acolyte.abilityScores,
        );
        await charactersAssert.validateClassDetailsPresence(
          character.classDetails ?? null,
          true,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          character.speciesDetails ?? null,
          true,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          character.backgroundDetails ?? null,
          true,
        );

        if (character.classDetails) {
          await charactersAssert.validateName(
            character.classDetails.name,
            'Monk',
          );
        }

        if (character.speciesDetails) {
          await charactersAssert.validateName(
            character.speciesDetails.name,
            expectedDetailedSpecies.human.name,
          );
        }

        if (character.backgroundDetails) {
          await charactersAssert.validateName(
            character.backgroundDetails.name,
            expectedDetailedBackgrounds.acolyte.name,
          );
        }
      },
    );

    test(
      'Select Scores Aang',
      { tag: ['@put', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacterAbilityScores(
          createdCharacterId,
          {
            abilityScores: aangAbilityScoresInput,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const abilityScoreOptions = await response.json();

        await charactersAssert.validateCharacterAbilityScoreOptionsSchema(
          abilityScoreOptions,
        );
        await charactersAssert.validateSelectedAbilityScores(
          abilityScoreOptions.selectedAbilityScores,
          aangAbilityScores,
          aangAbilityBonuses,
        );
      },
    );

    test(
      'Add Quarterstaff Aang',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const characterEquipment = await addCharacterEquipmentBySlug(
          request,
          createdCharacterId,
          authToken,
          [{ slug: 'quarterstaff', quantity: 1, isEquipped: true }],
        );
        const charactersAssert = new CharactersAssert();

        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateCharacterEquipmentItems(
          characterEquipment,
          [{ name: 'Quarterstaff', quantity: 1, isEquipped: true }],
        );
      },
    );

    test(
      'Get Complete Aang The Monk',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateId(character.id, createdCharacterId);
        await charactersAssert.validateName(
          character.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(character.status, 'complete');
        await charactersAssert.validateClassId(character.classId, 6);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(character.backgroundId, 1);
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          aangAbilityScores,
          aangAbilityBonuses,
        );
        await charactersAssert.validateCurrency(
          character.currency,
          acolyteCurrency,
        );
        await charactersAssert.validateArmorClass(
          character.armorClass,
          aangArmorClass,
        );
        await charactersAssert.validateHitPoints(
          character.hitPoints,
          monkHitPoints,
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
            skillModifier: 3,
            bonus: 0,
            total: 13,
          },
        );
        await charactersAssert.validateMovement(
          character.movement,
          { baseSpeed: 30, unit: 'ft' },
          { type: 'species', name: 'Human', value: 30 },
        );
        await charactersAssert.validateInventoryWeight(
          character.inventoryWeight,
          {
            total: 4,
            sources: [
              { name: 'Quarterstaff', quantity: 1, weight: 4, total: 4 },
            ],
          },
        );
        await charactersAssert.validateWeaponAttack(character.weaponAttacks, {
          name: 'Quarterstaff',
          attackType: 'melee',
          ability: 'STR',
          isProficient: true,
          abilityModifier: 0,
          proficiencyBonus: 2,
          attackBonus: 2,
          damage: {
            formula: '1d6',
            base: '1d6',
            modifier: 0,
            damageType: 'Bludgeoning',
          },
          properties: ['Versatile'],
          rangeExists: false,
        });
      },
    );
  },
);

test.describe(
  'Characters API - Arthas The Paladin Complete Create Flow',
  { tag: ['@characters', '@flow', '@complete-create'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let createdCharacterId: number;
    let createdCharacterName: string;
    let selectedSpellIds: number[];

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create Arthas The Paladin',
      { tag: ['@post', '@smoke', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();
        createdCharacterName = `Arthas The Paladin ${Date.now()}`;

        const response = await charactersClient.createCharacter(
          {
            name: createdCharacterName,
            classId: 7,
            speciesId: 7,
            backgroundId: 12,
            level: 3,
            currency: nobleCurrency,
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
        await charactersAssert.validateStatus(character.status, 'complete');
        await charactersAssert.validateClassId(character.classId, 7);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(character.backgroundId, 12);
        await charactersAssert.validateLevel(character.level, 3);
        await charactersAssert.validateMissingFields(
          character.missingFields,
          [],
        );
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          null,
        );
        await charactersAssert.validateCurrency(
          character.currency,
          nobleCurrency,
        );
        await charactersAssert.validateAbilityScoreRules(
          character.abilityScoreRules,
          expectedDetailedBackgrounds.noble.abilityScores,
        );
        await charactersAssert.validateClassDetailsPresence(
          character.classDetails ?? null,
          true,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          character.speciesDetails ?? null,
          true,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          character.backgroundDetails ?? null,
          true,
        );

        if (character.classDetails) {
          await charactersAssert.validateId(character.classDetails.id, 7);
          await charactersAssert.validateName(
            character.classDetails.name,
            'Paladin',
          );
          await charactersAssert.validateClassDetailsSchema(
            character.classDetails,
            character.level,
          );
        }

        if (character.speciesDetails) {
          await charactersAssert.validateId(character.speciesDetails.id, 7);
          await charactersAssert.validateName(
            character.speciesDetails.name,
            expectedDetailedSpecies.human.name,
          );
          await charactersAssert.validateSpeciesDetailsSchema(
            character.speciesDetails,
          );
        }

        if (character.backgroundDetails) {
          await charactersAssert.validateId(character.backgroundDetails.id, 12);
          await charactersAssert.validateName(
            character.backgroundDetails.name,
            expectedDetailedBackgrounds.noble.name,
          );
          await charactersAssert.validateBackgroundDetailsSchema(
            character.backgroundDetails,
          );
        }
      },
    );

    test(
      'Get Arthas The Paladin',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateId(character.id, createdCharacterId);
        await charactersAssert.validateName(
          character.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(character.status, 'complete');
        await charactersAssert.validateClassId(character.classId, 7);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(character.backgroundId, 12);
        await charactersAssert.validateLevel(character.level, 3);
        await charactersAssert.validateMissingFields(
          character.missingFields,
          [],
        );
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          null,
        );
        await charactersAssert.validateCurrency(
          character.currency,
          nobleCurrency,
        );
        await charactersAssert.validateAbilityScoreRules(
          character.abilityScoreRules,
          expectedDetailedBackgrounds.noble.abilityScores,
        );
        await charactersAssert.validateClassDetailsPresence(
          character.classDetails ?? null,
          true,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          character.speciesDetails ?? null,
          true,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          character.backgroundDetails ?? null,
          true,
        );
      },
    );

    test(
      'Get Attribute Options Paladin',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterAbilityScoreOptions(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const abilityScoreOptions: CharacterAbilityScoreOptionsResponseBody =
          await response.json();

        await charactersAssert.validateCharacterAbilityScoreOptionsSchema(
          abilityScoreOptions,
        );
        await charactersAssert.validateId(
          abilityScoreOptions.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateBackgroundId(
          abilityScoreOptions.backgroundId,
          12,
        );
        await charactersAssert.validateName(
          abilityScoreOptions.backgroundName ?? '',
          expectedDetailedBackgrounds.noble.name,
        );
        await charactersAssert.validateSelectedAbilityScores(
          abilityScoreOptions.selectedAbilityScores,
          null,
        );
        await charactersAssert.validateAbilityScoreRules(
          abilityScoreOptions.selectionRules,
          expectedDetailedBackgrounds.noble.abilityScores,
        );

        await test.step('Validate noble available choices', async () => {
          expect(abilityScoreOptions.availableChoices).toEqual(
            expectedDetailedBackgrounds.noble.abilityScores,
          );
        });
      },
    );

    test(
      'Select Scores Paladin',
      { tag: ['@put', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacterAbilityScores(
          createdCharacterId,
          {
            abilityScores: paladinAbilityScoresInput,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const abilityScoreOptions: CharacterAbilityScoreOptionsResponseBody =
          await response.json();

        await charactersAssert.validateCharacterAbilityScoreOptionsSchema(
          abilityScoreOptions,
        );
        await charactersAssert.validateId(
          abilityScoreOptions.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateBackgroundId(
          abilityScoreOptions.backgroundId,
          12,
        );
        await charactersAssert.validateName(
          abilityScoreOptions.backgroundName ?? '',
          expectedDetailedBackgrounds.noble.name,
        );
        await charactersAssert.validateSelectedAbilityScores(
          abilityScoreOptions.selectedAbilityScores,
          paladinAbilityScores,
          paladinAbilityBonuses,
        );
        await charactersAssert.validateAbilityScoreRules(
          abilityScoreOptions.selectionRules,
          expectedDetailedBackgrounds.noble.abilityScores,
        );
      },
    );

    test(
      'Get Spell Options Paladin',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterSpellOptions(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const spellOptions: CharacterSpellOptionsResponseBody =
          await response.json();

        await charactersAssert.validateCharacterSpellOptionsSchema(
          spellOptions,
        );
        await charactersAssert.validateId(
          spellOptions.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateClassId(spellOptions.classId, 7);
        await charactersAssert.validateClassName(
          spellOptions.className,
          'Paladin',
        );

        await test.step('Validate paladin spell options are returned', async () => {
          expect(spellOptions.spells.length).toBeGreaterThan(0);
        });
      },
    );

    test(
      'Get Spell Selection Paladin',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterSpellSelection(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const spellSelection: CharacterSpellSelectionResponseBody =
          await response.json();

        await charactersAssert.validateCharacterSpellSelectionSchema(
          spellSelection,
        );
        await charactersAssert.validateId(
          spellSelection.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateClassId(spellSelection.classId, 7);
        await charactersAssert.validateClassName(
          spellSelection.className,
          'Paladin',
        );
        await charactersAssert.validateLevel(spellSelection.level, 3);

        await test.step('Validate paladin spell selection rules', async () => {
          expect(spellSelection.selectionRules.canSelectSpells).toBe(true);
          expect(spellSelection.selectionRules.selectionType).not.toBeNull();
          expect(spellSelection.availableSpells.length).toBeGreaterThan(0);
          expect(spellSelection.selectedSpells).toEqual([]);
        });

        const selectedCantripIds = spellSelection.availableSpells
          .filter((spell) => spell.level === 0)
          .slice(0, spellSelection.selectionRules.maxCantrips)
          .map((spell) => spell.id);

        const selectedLeveledSpellIds = spellSelection.availableSpells
          .filter((spell) => spell.level > 0)
          .slice(0, spellSelection.selectionRules.maxSpells)
          .map((spell) => spell.id);

        selectedSpellIds = [...selectedCantripIds, ...selectedLeveledSpellIds];

        await test.step('Choose paladin spells for selection update', async () => {
          expect(selectedSpellIds).toHaveLength(
            spellSelection.selectionRules.maxCantrips +
              spellSelection.selectionRules.maxSpells,
          );
        });
      },
    );

    test(
      'Select Spells Paladin',
      { tag: ['@put', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacterSpells(
          createdCharacterId,
          {
            spellIds: selectedSpellIds,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const spellSelection: CharacterSpellSelectionResponseBody =
          await response.json();

        await charactersAssert.validateCharacterSpellSelectionSchema(
          spellSelection,
        );
        await charactersAssert.validateId(
          spellSelection.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateClassId(spellSelection.classId, 7);
        await charactersAssert.validateClassName(
          spellSelection.className,
          'Paladin',
        );
        await charactersAssert.validateLevel(spellSelection.level, 3);

        await test.step('Validate selected paladin spells were persisted', async () => {
          expect(spellSelection.selectedSpells).toHaveLength(
            selectedSpellIds.length,
          );
          expect(
            spellSelection.selectedSpells.map((spell) => spell.id),
          ).toEqual(selectedSpellIds);
        });
      },
    );

    test(
      'Get Selected Spells Paladin',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterSpellSelection(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const spellSelection: CharacterSpellSelectionResponseBody =
          await response.json();

        await charactersAssert.validateCharacterSpellSelectionSchema(
          spellSelection,
        );
        await charactersAssert.validateId(
          spellSelection.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateClassId(spellSelection.classId, 7);
        await charactersAssert.validateClassName(
          spellSelection.className,
          'Paladin',
        );
        await charactersAssert.validateLevel(spellSelection.level, 3);

        await test.step('Validate selected paladin spells are returned on follow-up get', async () => {
          expect(spellSelection.selectedSpells).toHaveLength(
            selectedSpellIds.length,
          );
          expect(
            spellSelection.selectedSpells.map((spell) => spell.id),
          ).toEqual(selectedSpellIds);
        });
      },
    );

    test(
      'Add Equipment Paladin',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersAssert = new CharactersAssert();

        const characterEquipment = await addCharacterEquipmentBySlug(
          request,
          createdCharacterId,
          authToken,
          [
            { slug: 'chain-mail', quantity: 1, isEquipped: true },
            { slug: 'longsword', quantity: 1, isEquipped: true },
            { slug: 'shield', quantity: 1, isEquipped: true },
          ],
        );

        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateId(
          characterEquipment.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateCharacterEquipmentItems(
          characterEquipment,
          [
            { name: 'Chain Mail', quantity: 1, isEquipped: true },
            { name: 'Longsword', quantity: 1, isEquipped: true },
            { name: 'Shield', quantity: 1, isEquipped: true },
          ],
        );
      },
    );

    test(
      'Get Equipment Paladin',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterEquipment(
          createdCharacterId,
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
          createdCharacterId,
        );
        await charactersAssert.validateCharacterEquipmentItems(
          characterEquipment,
          [
            { name: 'Chain Mail', quantity: 1, isEquipped: true },
            { name: 'Longsword', quantity: 1, isEquipped: true },
            { name: 'Shield', quantity: 1, isEquipped: true },
          ],
        );
      },
    );

    test(
      'Get Complete Arthas The Paladin',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateId(character.id, createdCharacterId);
        await charactersAssert.validateName(
          character.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(character.status, 'complete');
        await charactersAssert.validateClassId(character.classId, 7);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(character.backgroundId, 12);
        await charactersAssert.validateLevel(character.level, 3);
        await charactersAssert.validateMissingFields(
          character.missingFields,
          [],
        );
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          paladinAbilityScores,
          paladinAbilityBonuses,
        );
        await charactersAssert.validateArmorClass(
          character.armorClass,
          paladinArmorClass,
        );
        await charactersAssert.validateHitPoints(
          character.hitPoints,
          paladinHitPoints,
        );
        await charactersAssert.validateInitiative(character.initiative, {
          ability: 'DEX',
          abilityModifier: 0,
          bonus: 0,
          total: 0,
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
          { type: 'species', name: 'Human', value: 30 },
        );
        await charactersAssert.validateInventoryWeight(
          character.inventoryWeight,
          {
            total: 64,
            sources: [
              { name: 'Chain Mail', quantity: 1, weight: 55, total: 55 },
              { name: 'Longsword', quantity: 1, weight: 3, total: 3 },
              { name: 'Shield', quantity: 1, weight: 6, total: 6 },
            ],
          },
        );
        await charactersAssert.validateSavingThrowOrder(character.savingThrows);
        await charactersAssert.validateSavingThrow(character.savingThrows, {
          ability: 'WIS',
          isProficient: true,
          abilityModifier: 1,
          proficiencyBonus: 2,
          bonus: 0,
          total: 3,
        });
        await charactersAssert.validateSavingThrow(character.savingThrows, {
          ability: 'CHA',
          isProficient: true,
          abilityModifier: 2,
          proficiencyBonus: 2,
          bonus: 0,
          total: 4,
        });
        await charactersAssert.validateSavingThrow(character.savingThrows, {
          ability: 'DEX',
          isProficient: false,
          abilityModifier: 0,
          proficiencyBonus: 0,
          bonus: 0,
          total: 0,
        });
        await charactersAssert.validateWeaponAttack(character.weaponAttacks, {
          name: 'Longsword',
          attackType: 'melee',
          ability: 'STR',
          isProficient: true,
          abilityModifier: 3,
          proficiencyBonus: 2,
          attackBonus: 5,
          damage: {
            formula: '1d8 + 3',
            base: '1d8',
            modifier: 3,
            damageType: 'Slashing',
          },
          properties: ['Versatile'],
          rangeExists: false,
        });
        await charactersAssert.validateWeaponAttackAbsent(
          character.weaponAttacks,
          'Chain Mail',
        );
        await charactersAssert.validateWeaponAttackAbsent(
          character.weaponAttacks,
          'Shield',
        );
        await charactersAssert.validateCurrency(
          character.currency,
          nobleCurrency,
        );
        await charactersAssert.validateAbilityScoreRules(
          character.abilityScoreRules,
          expectedDetailedBackgrounds.noble.abilityScores,
        );
        await charactersAssert.validateClassDetailsPresence(
          character.classDetails ?? null,
          true,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          character.speciesDetails ?? null,
          true,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          character.backgroundDetails ?? null,
          true,
        );

        if (character.classDetails) {
          await charactersAssert.validateId(character.classDetails.id, 7);
          await charactersAssert.validateName(
            character.classDetails.name,
            'Paladin',
          );
          await charactersAssert.validateClassDetailsSchema(
            character.classDetails,
            character.level,
          );
        }

        if (character.speciesDetails) {
          await charactersAssert.validateId(character.speciesDetails.id, 7);
          await charactersAssert.validateName(
            character.speciesDetails.name,
            expectedDetailedSpecies.human.name,
          );
          await charactersAssert.validateSpeciesDetailsSchema(
            character.speciesDetails,
          );
        }

        if (character.backgroundDetails) {
          await charactersAssert.validateId(character.backgroundDetails.id, 12);
          await charactersAssert.validateName(
            character.backgroundDetails.name,
            expectedDetailedBackgrounds.noble.name,
          );
          await charactersAssert.validateBackgroundDetailsSchema(
            character.backgroundDetails,
          );
        }
      },
    );
  },
);

test.describe(
  'Characters API - Gandalf The Wizard Spell Selection Flow',
  { tag: ['@characters', '@flow', '@wizard'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let createdCharacterId: number;
    let createdCharacterName: string;
    let selectedSpellIds: number[];

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'List Characters',
      { tag: ['@get', '@smoke', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const listResponse = await charactersClient.getCharacters(authToken);

        await charactersAssert.success(listResponse);

        const characters: CharacterListItem[] = await listResponse.json();

        await charactersAssert.validateCharacterListSchema(characters);
      },
    );

    test(
      'Create Gandalf The Wizard',
      { tag: ['@post', '@smoke', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();
        createdCharacterName = `Gandalf The Wizard ${Date.now()}`;

        const createResponse = await charactersClient.createCharacter(
          {
            name: createdCharacterName,
          },
          authToken,
        );

        await charactersAssert.created(createResponse);

        const createdCharacter: CharacterResponseBody =
          await createResponse.json();
        createdCharacterId = createdCharacter.id;

        await charactersAssert.validateCharacterResponseSchema(
          createdCharacter,
        );
        await charactersAssert.validateName(
          createdCharacter.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(createdCharacter.status, 'draft');
        await charactersAssert.validateClassId(createdCharacter.classId, null);
        await charactersAssert.validateSpeciesId(
          createdCharacter.speciesId,
          null,
        );
        await charactersAssert.validateBackgroundId(
          createdCharacter.backgroundId,
          null,
        );
        await charactersAssert.validateLevel(createdCharacter.level, 1);
        await charactersAssert.validateMissingFields(
          createdCharacter.missingFields,
          ['classId', 'speciesId', 'backgroundId'],
        );
        await charactersAssert.validateAbilityScores(
          createdCharacter.abilityScores,
          null,
        );
        await charactersAssert.validateAbilityScoreRules(
          createdCharacter.abilityScoreRules,
          null,
        );
        await charactersAssert.validateClassDetailsPresence(
          createdCharacter.classDetails ?? null,
          false,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          createdCharacter.speciesDetails ?? null,
          false,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          createdCharacter.backgroundDetails ?? null,
          false,
        );
      },
    );

    test('Get Draft', { tag: ['@get', '@data'] }, async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const getResponse = await charactersClient.getCharacterDetail(
        createdCharacterId,
        authToken,
      );

      await charactersAssert.success(getResponse);

      const fetchedCharacter: CharacterResponseBody = await getResponse.json();

      await charactersAssert.validateCharacterResponseSchema(fetchedCharacter);
      await charactersAssert.validateId(
        fetchedCharacter.id,
        createdCharacterId,
      );
      await charactersAssert.validateName(
        fetchedCharacter.name,
        createdCharacterName,
      );
      await charactersAssert.validateStatus(fetchedCharacter.status, 'draft');
      await charactersAssert.validateClassId(fetchedCharacter.classId, null);
      await charactersAssert.validateSpeciesId(
        fetchedCharacter.speciesId,
        null,
      );
      await charactersAssert.validateBackgroundId(
        fetchedCharacter.backgroundId,
        null,
      );
      await charactersAssert.validateLevel(fetchedCharacter.level, 1);
      await charactersAssert.validateMissingFields(
        fetchedCharacter.missingFields,
        ['classId', 'speciesId', 'backgroundId'],
      );
      await charactersAssert.validateAbilityScores(
        fetchedCharacter.abilityScores,
        null,
      );
      await charactersAssert.validateAbilityScoreRules(
        fetchedCharacter.abilityScoreRules,
        null,
      );
      await charactersAssert.validateClassDetailsPresence(
        fetchedCharacter.classDetails ?? null,
        false,
      );
      await charactersAssert.validateSpeciesDetailsPresence(
        fetchedCharacter.speciesDetails ?? null,
        false,
      );
      await charactersAssert.validateBackgroundDetailsPresence(
        fetchedCharacter.backgroundDetails ?? null,
        false,
      );
    });

    test(
      'Add Class Wizard To Gandalf',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const updateResponse = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            classId: 12,
            level: 1,
          },
          authToken,
        );

        await charactersAssert.success(updateResponse);

        const updatedCharacter: CharacterResponseBody =
          await updateResponse.json();

        await charactersAssert.validateCharacterResponseSchema(
          updatedCharacter,
        );
        await charactersAssert.validateId(
          updatedCharacter.id,
          createdCharacterId,
        );
        await charactersAssert.validateName(
          updatedCharacter.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(updatedCharacter.status, 'draft');
        await charactersAssert.validateClassId(updatedCharacter.classId, 12);
        await charactersAssert.validateSpeciesId(
          updatedCharacter.speciesId,
          null,
        );
        await charactersAssert.validateBackgroundId(
          updatedCharacter.backgroundId,
          null,
        );
        await charactersAssert.validateLevel(updatedCharacter.level, 1);
        await charactersAssert.validateMissingFields(
          updatedCharacter.missingFields,
          ['speciesId', 'backgroundId'],
        );
        await charactersAssert.validateAbilityScores(
          updatedCharacter.abilityScores,
          null,
        );
        await charactersAssert.validateClassDetailsPresence(
          updatedCharacter.classDetails ?? null,
          true,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          updatedCharacter.speciesDetails ?? null,
          false,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          updatedCharacter.backgroundDetails ?? null,
          false,
        );

        if (updatedCharacter.classDetails) {
          await charactersAssert.validateId(
            updatedCharacter.classDetails.id,
            12,
          );
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
      'Get Gandalf The Wizard',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateClassId(character.classId, 12);
        await charactersAssert.validateSpeciesId(character.speciesId, null);
        await charactersAssert.validateBackgroundId(
          character.backgroundId,
          null,
        );
        await charactersAssert.validateMissingFields(character.missingFields, [
          'speciesId',
          'backgroundId',
        ]);
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          null,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          character.speciesDetails ?? null,
          false,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          character.backgroundDetails ?? null,
          false,
        );
      },
    );

    test(
      'Add Species Elf',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            speciesId: 3,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateClassId(character.classId, 12);
        await charactersAssert.validateSpeciesId(character.speciesId, 3);
        await charactersAssert.validateBackgroundId(
          character.backgroundId,
          null,
        );
        await charactersAssert.validateMissingFields(character.missingFields, [
          'backgroundId',
        ]);
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          null,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          character.speciesDetails ?? null,
          true,
        );

        if (character.speciesDetails) {
          await charactersAssert.validateId(character.speciesDetails.id, 3);
          await charactersAssert.validateName(
            character.speciesDetails.name,
            expectedDetailedSpecies.elf.name,
          );
          await charactersAssert.validateSpeciesDetailsSchema(
            character.speciesDetails,
          );
        }
      },
    );

    test('Get Elf Wizard', { tag: ['@get', '@data'] }, async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterDetail(
        createdCharacterId,
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateClassId(character.classId, 12);
      await charactersAssert.validateSpeciesId(character.speciesId, 3);
      await charactersAssert.validateBackgroundId(character.backgroundId, null);
      await charactersAssert.validateMissingFields(character.missingFields, [
        'backgroundId',
      ]);
      await charactersAssert.validateAbilityScores(
        character.abilityScores,
        null,
      );
      await charactersAssert.validateSpeciesDetailsPresence(
        character.speciesDetails ?? null,
        true,
      );
      await charactersAssert.validateBackgroundDetailsPresence(
        character.backgroundDetails ?? null,
        false,
      );
    });

    test(
      'Add Background Sage',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const updateResponse = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            backgroundId: 13,
          },
          authToken,
        );

        await charactersAssert.success(updateResponse);

        const updatedCharacter: CharacterResponseBody =
          await updateResponse.json();

        await charactersAssert.validateCharacterResponseSchema(
          updatedCharacter,
        );
        await charactersAssert.validateId(
          updatedCharacter.id,
          createdCharacterId,
        );
        await charactersAssert.validateName(
          updatedCharacter.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(
          updatedCharacter.status,
          'complete',
        );
        await charactersAssert.validateClassId(updatedCharacter.classId, 12);
        await charactersAssert.validateSpeciesId(updatedCharacter.speciesId, 3);
        await charactersAssert.validateBackgroundId(
          updatedCharacter.backgroundId,
          13,
        );
        await charactersAssert.validateLevel(updatedCharacter.level, 1);
        await charactersAssert.validateMissingFields(
          updatedCharacter.missingFields,
          [],
        );
        await charactersAssert.validateAbilityScores(
          updatedCharacter.abilityScores,
          null,
        );
        await charactersAssert.validateClassDetailsPresence(
          updatedCharacter.classDetails ?? null,
          true,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          updatedCharacter.speciesDetails ?? null,
          true,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          updatedCharacter.backgroundDetails ?? null,
          true,
        );

        if (updatedCharacter.backgroundDetails) {
          await charactersAssert.validateId(
            updatedCharacter.backgroundDetails.id,
            13,
          );
          await charactersAssert.validateName(
            updatedCharacter.backgroundDetails.name,
            expectedDetailedBackgrounds.sage.name,
          );
          await charactersAssert.validateBackgroundDetailsSchema(
            updatedCharacter.backgroundDetails,
          );
        }
      },
    );

    test('Get Sage Wizard', { tag: ['@get', '@data'] }, async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterDetail(
        createdCharacterId,
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateClassId(character.classId, 12);
      await charactersAssert.validateSpeciesId(character.speciesId, 3);
      await charactersAssert.validateBackgroundId(character.backgroundId, 13);
      await charactersAssert.validateMissingFields(character.missingFields, []);
      await charactersAssert.validateAbilityScores(
        character.abilityScores,
        null,
      );
      await charactersAssert.validateAbilityScoreRules(
        character.abilityScoreRules,
        expectedDetailedBackgrounds.sage.abilityScores,
      );
      await charactersAssert.validateBackgroundDetailsPresence(
        character.backgroundDetails ?? null,
        true,
      );
    });

    test(
      'Add Currency Sage',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            currency: sageCurrency,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateId(character.id, createdCharacterId);
        await charactersAssert.validateClassId(character.classId, 12);
        await charactersAssert.validateSpeciesId(character.speciesId, 3);
        await charactersAssert.validateBackgroundId(character.backgroundId, 13);
        await charactersAssert.validateStatus(character.status, 'complete');
        await charactersAssert.validateCurrency(
          character.currency,
          sageCurrency,
        );
      },
    );

    test(
      'Get character spell options',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const spellOptionsResponse =
          await charactersClient.getCharacterSpellOptions(
            createdCharacterId,
            authToken,
          );

        await charactersAssert.success(spellOptionsResponse);

        const spellOptions: CharacterSpellOptionsResponseBody =
          await spellOptionsResponse.json();

        await charactersAssert.validateCharacterSpellOptionsSchema(
          spellOptions,
        );
        await charactersAssert.validateId(
          spellOptions.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateClassId(spellOptions.classId, 12);
        await charactersAssert.validateClassName(
          spellOptions.className,
          'Wizard',
        );

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
        await charactersAssert.validateClassName(
          spellSelection.className,
          'Wizard',
        );
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

        selectedSpellIds = [
          firstCantrip!.id,
          secondCantrip!.id,
          thirdCantrip!.id,
        ];
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
        await charactersAssert.validateClassName(
          spellSelection.className,
          'Wizard',
        );

        await test.step('Validate selected wizard spells were persisted', async () => {
          expect(spellSelection.selectedSpells).toHaveLength(
            selectedSpellIds.length,
          );
          expect(
            spellSelection.selectedSpells.map((spell) => spell.id),
          ).toEqual(selectedSpellIds);
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
        await charactersAssert.validateClassName(
          spellSelection.className,
          'Wizard',
        );

        await test.step('Validate selected wizard spells are returned on follow-up get', async () => {
          expect(spellSelection.selectedSpells).toHaveLength(
            selectedSpellIds.length,
          );
          expect(
            spellSelection.selectedSpells.map((spell) => spell.id),
          ).toEqual(selectedSpellIds);
        });
      },
    );

    test(
      'Get Attribute Options Wizard',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterAbilityScoreOptions(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const abilityScoreOptions: CharacterAbilityScoreOptionsResponseBody =
          await response.json();

        await charactersAssert.validateCharacterAbilityScoreOptionsSchema(
          abilityScoreOptions,
        );
        await charactersAssert.validateId(
          abilityScoreOptions.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateBackgroundId(
          abilityScoreOptions.backgroundId,
          13,
        );
        await charactersAssert.validateName(
          abilityScoreOptions.backgroundName ?? '',
          expectedDetailedBackgrounds.sage.name,
        );
        await charactersAssert.validateSelectedAbilityScores(
          abilityScoreOptions.selectedAbilityScores,
          null,
        );
        await charactersAssert.validateAbilityScoreRules(
          abilityScoreOptions.selectionRules,
          expectedDetailedBackgrounds.sage.abilityScores,
        );

        await test.step('Validate sage available choices', async () => {
          expect(abilityScoreOptions.availableChoices).toEqual(
            expectedDetailedBackgrounds.sage.abilityScores,
          );
        });
      },
    );

    test(
      'Select Scores Wizard',
      { tag: ['@put', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacterAbilityScores(
          createdCharacterId,
          {
            abilityScores: wizardAbilityScoresInput,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const abilityScoreOptions: CharacterAbilityScoreOptionsResponseBody =
          await response.json();

        await charactersAssert.validateCharacterAbilityScoreOptionsSchema(
          abilityScoreOptions,
        );
        await charactersAssert.validateId(
          abilityScoreOptions.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateBackgroundId(
          abilityScoreOptions.backgroundId,
          13,
        );
        await charactersAssert.validateName(
          abilityScoreOptions.backgroundName ?? '',
          expectedDetailedBackgrounds.sage.name,
        );
        await charactersAssert.validateSelectedAbilityScores(
          abilityScoreOptions.selectedAbilityScores,
          wizardAbilityScores,
          wizardAbilityBonuses,
        );
        await charactersAssert.validateAbilityScoreRules(
          abilityScoreOptions.selectionRules,
          expectedDetailedBackgrounds.sage.abilityScores,
        );

        await test.step('Validate sage available choices after selection', async () => {
          expect(abilityScoreOptions.availableChoices).toEqual(
            expectedDetailedBackgrounds.sage.abilityScores,
          );
        });
      },
    );

    test(
      'Add Skills Wizard',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            skillProficiencies: wizardSkillProficiencies,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const updatedCharacter: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(
          updatedCharacter,
        );
        await charactersAssert.validateId(
          updatedCharacter.id,
          createdCharacterId,
        );
        await charactersAssert.validateSkillProficiencies(
          updatedCharacter.skillProficiencies,
          wizardSkillProficiencies,
        );
        await charactersAssert.validateAbilityScores(
          updatedCharacter.abilityScores,
          wizardAbilityScores,
          wizardAbilityBonuses,
        );
      },
    );

    test(
      'Get Skilled Wizard',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateId(character.id, createdCharacterId);
        await charactersAssert.validateSkillProficiencies(
          character.skillProficiencies,
          wizardSkillProficiencies,
        );
      },
    );

    test(
      'Get Skills Wizard',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterSkills(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const skills: CharacterSkillItem[] = await response.json();

        await charactersAssert.validateCharacterSkillsSchema(skills);
        await charactersAssert.validateCharacterSkillCalculation(skills, {
          name: 'Arcana',
          ability: 'INT',
          isProficient: true,
          abilityModifier: 3,
          level: 1,
        });
        await charactersAssert.validateCharacterSkillCalculation(skills, {
          name: 'Stealth',
          ability: 'DEX',
          isProficient: false,
          abilityModifier: 2,
          level: 1,
        });
      },
    );

    test(
      'Add Equipment Wizard',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersAssert = new CharactersAssert();

        const characterEquipment = await addCharacterEquipmentBySlug(
          request,
          createdCharacterId,
          authToken,
          [
            { slug: 'quarterstaff', quantity: 1, isEquipped: true },
            { slug: 'calligraphers-supplies', quantity: 1, isEquipped: false },
            { slug: 'book', quantity: 1, isEquipped: false },
            { slug: 'parchment', quantity: 8, isEquipped: false },
            { slug: 'robe', quantity: 1, isEquipped: true },
          ],
        );

        await charactersAssert.validateCharacterEquipmentSchema(
          characterEquipment,
        );
        await charactersAssert.validateId(
          characterEquipment.characterId,
          createdCharacterId,
        );
        await charactersAssert.validateCharacterEquipmentItems(
          characterEquipment,
          [
            { name: 'Quarterstaff', quantity: 1, isEquipped: true },
            { name: "Calligrapher's Supplies", quantity: 1, isEquipped: false },
            { name: 'Book', quantity: 1, isEquipped: false },
            { name: 'Parchment', quantity: 8, isEquipped: false },
            { name: 'Robe', quantity: 1, isEquipped: true },
          ],
        );
      },
    );

    test(
      'Get Equipment Wizard',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterEquipment(
          createdCharacterId,
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
          createdCharacterId,
        );
        await charactersAssert.validateCharacterEquipmentItems(
          characterEquipment,
          [
            { name: 'Quarterstaff', quantity: 1, isEquipped: true },
            { name: "Calligrapher's Supplies", quantity: 1, isEquipped: false },
            { name: 'Book', quantity: 1, isEquipped: false },
            { name: 'Parchment', quantity: 8, isEquipped: false },
            { name: 'Robe', quantity: 1, isEquipped: true },
          ],
        );
      },
    );

    test(
      'Get Complete Gandalf The Wizard',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const finalGetResponse = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(finalGetResponse);

        const finalCharacter: CharacterResponseBody =
          await finalGetResponse.json();

        await charactersAssert.validateCharacterResponseSchema(finalCharacter);
        await charactersAssert.validateId(
          finalCharacter.id,
          createdCharacterId,
        );
        await charactersAssert.validateName(
          finalCharacter.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(
          finalCharacter.status,
          'complete',
        );
        await charactersAssert.validateClassId(finalCharacter.classId, 12);
        await charactersAssert.validateSpeciesId(finalCharacter.speciesId, 3);
        await charactersAssert.validateBackgroundId(
          finalCharacter.backgroundId,
          13,
        );
        await charactersAssert.validateLevel(finalCharacter.level, 1);
        await charactersAssert.validateMissingFields(
          finalCharacter.missingFields,
          [],
        );
        await charactersAssert.validateAbilityScores(
          finalCharacter.abilityScores,
          wizardAbilityScores,
          wizardAbilityBonuses,
        );
        await charactersAssert.validateArmorClass(
          finalCharacter.armorClass,
          wizardArmorClass,
        );
        await charactersAssert.validateHitPoints(
          finalCharacter.hitPoints,
          wizardHitPoints,
        );
        await charactersAssert.validateInitiative(finalCharacter.initiative, {
          ability: 'DEX',
          abilityModifier: 2,
          bonus: 0,
          total: 2,
        });
        await charactersAssert.validatePassivePerception(
          finalCharacter.passivePerception,
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
          finalCharacter.movement,
          { baseSpeed: 30, unit: 'ft' },
          { type: 'species', name: 'Elf', value: 30 },
        );
        await charactersAssert.validateSpellcastingSummary(
          finalCharacter.spellcastingSummary,
          {
            canCastSpells: true,
            ability: 'INT',
            abilityModifier: 3,
            spellSaveDc: 13,
            spellAttackBonus: 5,
            selectedSpellsCount: 0,
            selectedCantripsCount: selectedSpellIds.length,
          },
        );
        await charactersAssert.validateSpellSlot(finalCharacter.spellSlots, {
          level: 1,
          max: 2,
          used: 0,
          available: 2,
        });
        await test.step('Validate wizard selected spells are enriched', async () => {
          expect(finalCharacter.selectedSpells).toHaveLength(
            selectedSpellIds.length,
          );
          expect(
            finalCharacter.selectedSpells.map((spell) => spell.id),
          ).toEqual(selectedSpellIds);

          for (const spell of finalCharacter.selectedSpells) {
            expect(spell.level).toBe(0);
            expect(spell.selectionType).toBe('cantrip');
          }
        });
        await charactersAssert.validateSavingThrowOrder(
          finalCharacter.savingThrows,
        );
        await charactersAssert.validateSavingThrow(
          finalCharacter.savingThrows,
          {
            ability: 'INT',
            isProficient: true,
            abilityModifier: 3,
            proficiencyBonus: 2,
            bonus: 0,
            total: 5,
          },
        );
        await charactersAssert.validateSavingThrow(
          finalCharacter.savingThrows,
          {
            ability: 'WIS',
            isProficient: true,
            abilityModifier: 1,
            proficiencyBonus: 2,
            bonus: 0,
            total: 3,
          },
        );
        await charactersAssert.validateSavingThrow(
          finalCharacter.savingThrows,
          {
            ability: 'STR',
            isProficient: false,
            abilityModifier: -1,
            proficiencyBonus: 0,
            bonus: 0,
            total: -1,
          },
        );
        await charactersAssert.validateWeaponAttack(
          finalCharacter.weaponAttacks,
          {
            name: 'Quarterstaff',
            attackType: 'melee',
            ability: 'STR',
            isProficient: true,
            abilityModifier: -1,
            proficiencyBonus: 2,
            attackBonus: 1,
            damage: {
              formula: '1d6 - 1',
              base: '1d6',
              modifier: -1,
              damageType: 'Bludgeoning',
            },
            properties: ['Versatile'],
            rangeExists: false,
          },
        );
        await charactersAssert.validateWeaponAttackAbsent(
          finalCharacter.weaponAttacks,
          'Robe',
        );
        await charactersAssert.validateAbilityScoreRules(
          finalCharacter.abilityScoreRules,
          expectedDetailedBackgrounds.sage.abilityScores,
        );
        await charactersAssert.validateCurrency(
          finalCharacter.currency,
          sageCurrency,
        );
        await charactersAssert.validateSkillProficiencies(
          finalCharacter.skillProficiencies,
          wizardSkillProficiencies,
        );
        await charactersAssert.validateClassDetailsPresence(
          finalCharacter.classDetails ?? null,
          true,
        );
        await charactersAssert.validateSpeciesDetailsPresence(
          finalCharacter.speciesDetails ?? null,
          true,
        );
        await charactersAssert.validateBackgroundDetailsPresence(
          finalCharacter.backgroundDetails ?? null,
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

        if (finalCharacter.speciesDetails) {
          await charactersAssert.validateId(
            finalCharacter.speciesDetails.id,
            3,
          );
          await charactersAssert.validateName(
            finalCharacter.speciesDetails.name,
            expectedDetailedSpecies.elf.name,
          );
          await charactersAssert.validateSpeciesDetailsSchema(
            finalCharacter.speciesDetails,
          );
        }

        if (finalCharacter.backgroundDetails) {
          await charactersAssert.validateId(
            finalCharacter.backgroundDetails.id,
            13,
          );
          await charactersAssert.validateName(
            finalCharacter.backgroundDetails.name,
            expectedDetailedBackgrounds.sage.name,
          );
          await charactersAssert.validateBackgroundDetailsSchema(
            finalCharacter.backgroundDetails,
          );
        }
      },
    );
  },
);

test.describe(
  'Characters API - Drizzt The Ranger Ability Scores And Currency Flow',
  { tag: ['@characters', '@ranger', '@ability-scores', '@currency'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let drizztCharacterId: number;
    let drizztCharacterName: string;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    const buildDrizztRangerPayload = (
      name: string,
      payload: Partial<Omit<CharacterCreateRequestBody, 'name'>> = {},
    ): CharacterCreateRequestBody => ({
      name,
      classId: 8,
      speciesId: 3,
      backgroundId: 16,
      level: 1,
      ...payload,
    });

    async function validateDrizztRangerBuild(character: CharacterResponseBody) {
      await test.step('Validate Drizzt Ranger build', async () => {
        expect(character.classId).toBe(8);
        expect(character.speciesId).toBe(3);
        expect(character.backgroundId).toBe(16);
        expect(character.missingFields).toEqual([]);
      });
    }

    test(
      'Create Drizzt Without Scores And Currency',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        drizztCharacterName = `Drizzt The Ranger ${Date.now()}`;

        const response = await charactersClient.createCharacter(
          buildDrizztRangerPayload(drizztCharacterName),
          authToken,
        );

        await charactersAssert.created(response);

        const character: CharacterResponseBody = await response.json();
        drizztCharacterId = character.id;

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(
          character.name,
          drizztCharacterName,
        );
        await validateDrizztRangerBuild(character);
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          null,
        );
        await charactersAssert.validateCurrency(character.currency, null);
        await charactersAssert.validateStatus(character.status, 'complete');
      },
    );

    test(
      'Get Drizzt Without Scores And Currency',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          drizztCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(
          character.name,
          drizztCharacterName,
        );
        await validateDrizztRangerBuild(character);
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          null,
        );
        await charactersAssert.validateCurrency(character.currency, null);
        await charactersAssert.validateStatus(character.status, 'complete');
      },
    );

    test(
      'Patch Scores Drizzt',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          drizztCharacterId,
          {
            abilityScores: drizztAbilityScoresInput,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(
          character.name,
          drizztCharacterName,
        );
        await validateDrizztRangerBuild(character);
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          drizztAbilityScores,
          drizztAbilityBonuses,
        );
        await charactersAssert.validateCurrency(character.currency, null);
        await charactersAssert.validateStatus(character.status, 'complete');
      },
    );

    test(
      'Get Drizzt With Scores',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          drizztCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(
          character.name,
          drizztCharacterName,
        );
        await validateDrizztRangerBuild(character);
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          drizztAbilityScores,
          drizztAbilityBonuses,
        );
        await charactersAssert.validateCurrency(character.currency, null);
        await charactersAssert.validateStatus(character.status, 'complete');
      },
    );

    test(
      'Reject Invalid Drizzt Scores And Keep Previous Scores',
      { tag: ['@put', '@negative', '@error', '@ability-scores'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacterAbilityScores(
          drizztCharacterId,
          {
            abilityScores: {
              ...drizztAbilityScoresInput,
              base: {
                ...drizztAbilityScoresInput.base,
                DEX: 16,
              },
            },
          },
          authToken,
        );

        await charactersAssert.badRequest(response);

        const body: { error: string } = await response.json();

        await charactersAssert.validateErrorResponse(
          body,
          'Invalid character ability scores payload: base.DEX must be between 8 and 15 for character levels 1 to 3; received 16',
        );

        const detailResponse = await charactersClient.getCharacterDetail(
          drizztCharacterId,
          authToken,
        );

        await charactersAssert.success(detailResponse);

        const character: CharacterResponseBody = await detailResponse.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(
          character.name,
          drizztCharacterName,
        );
        await validateDrizztRangerBuild(character);
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          drizztAbilityScores,
          drizztAbilityBonuses,
        );
      },
    );

    test(
      'Clear Scores Drizzt',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          drizztCharacterId,
          {
            abilityScores: null,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(
          character.name,
          drizztCharacterName,
        );
        await validateDrizztRangerBuild(character);
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          null,
        );
        await charactersAssert.validateCurrency(character.currency, null);
        await charactersAssert.validateStatus(character.status, 'complete');
      },
    );

    test(
      'Get Cleared Scores Drizzt',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          drizztCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(
          character.name,
          drizztCharacterName,
        );
        await validateDrizztRangerBuild(character);
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          null,
        );
        await charactersAssert.validateCurrency(character.currency, null);
        await charactersAssert.validateStatus(character.status, 'complete');
      },
    );

    test(
      'Patch Currency Drizzt',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          drizztCharacterId,
          {
            currency: patchedCurrency,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(
          character.name,
          drizztCharacterName,
        );
        await validateDrizztRangerBuild(character);
        await charactersAssert.validateCurrency(
          character.currency,
          patchedCurrency,
        );
        await charactersAssert.validateStatus(character.status, 'complete');
      },
    );

    test(
      'Get Patched Currency Drizzt',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          drizztCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(
          character.name,
          drizztCharacterName,
        );
        await validateDrizztRangerBuild(character);
        await charactersAssert.validateCurrency(
          character.currency,
          patchedCurrency,
        );
        await charactersAssert.validateStatus(character.status, 'complete');
      },
    );

    test(
      'Clear Currency Drizzt',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          drizztCharacterId,
          {
            currency: null,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(
          character.name,
          drizztCharacterName,
        );
        await validateDrizztRangerBuild(character);
        await charactersAssert.validateCurrency(character.currency, null);
        await charactersAssert.validateStatus(character.status, 'complete');
      },
    );

    test(
      'Get Cleared Currency Drizzt',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          drizztCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(
          character.name,
          drizztCharacterName,
        );
        await validateDrizztRangerBuild(character);
        await charactersAssert.validateCurrency(character.currency, null);
        await charactersAssert.validateStatus(character.status, 'complete');
      },
    );
  },
);

test.describe(
  'Characters API - Yennefer The Sorcerer Saving Throws Flow',
  { tag: ['@characters', '@saving-throws', '@sorcerer', '@human'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let createdCharacterId: number;
    let createdCharacterName: string;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create Yennefer The Sorcerer For Saving Throws',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();
        createdCharacterName = `Yennefer The Sorcerer ${Date.now()}`;

        const response = await charactersClient.createCharacter(
          {
            name: createdCharacterName,
            classId: 10,
            speciesId: 7,
            backgroundId: 1,
            level: 1,
            abilityScores: yenneferAbilityScoresInput,
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
        await charactersAssert.validateStatus(character.status, 'complete');
        await charactersAssert.validateClassId(character.classId, 10);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(character.backgroundId, 1);
        await charactersAssert.validateLevel(character.level, 1);
        await charactersAssert.validateMissingFields(
          character.missingFields,
          [],
        );
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          yenneferAbilityScores,
          yenneferAbilityBonuses,
        );
        await charactersAssert.validateHitPoints(
          character.hitPoints,
          sorcererHitPoints,
        );
      },
    );

    test(
      'Get Yennefer Sorcerer Saving Throws',
      { tag: ['@get', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.getCharacterDetail(
          createdCharacterId,
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateId(character.id, createdCharacterId);
        await charactersAssert.validateName(
          character.name,
          createdCharacterName,
        );
        await charactersAssert.validateStatus(character.status, 'complete');
        await charactersAssert.validateClassId(character.classId, 10);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(character.backgroundId, 1);
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          yenneferAbilityScores,
          yenneferAbilityBonuses,
        );
        await charactersAssert.validateHitPoints(
          character.hitPoints,
          sorcererHitPoints,
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
            skillModifier: 0,
            bonus: 0,
            total: 10,
          },
        );
        await charactersAssert.validateMovement(
          character.movement,
          { baseSpeed: 30, unit: 'ft' },
          { type: 'species', name: 'Human', value: 30 },
        );
        await charactersAssert.validateSavingThrowOrder(character.savingThrows);
        await charactersAssert.validateSavingThrow(character.savingThrows, {
          ability: 'CON',
          isProficient: true,
          abilityModifier: 2,
          proficiencyBonus: 2,
          bonus: 0,
          total: 4,
        });
        await charactersAssert.validateSavingThrow(character.savingThrows, {
          ability: 'CHA',
          isProficient: true,
          abilityModifier: 3,
          proficiencyBonus: 2,
          bonus: 0,
          total: 5,
        });
        await charactersAssert.validateSavingThrow(character.savingThrows, {
          ability: 'DEX',
          isProficient: false,
          abilityModifier: 2,
          proficiencyBonus: 0,
          bonus: 0,
          total: 2,
        });
      },
    );
  },
);

test.describe(
  'Characters API - Scanlan The Bard Caster Coverage Flow',
  { tag: ['@characters', '@flow', '@class-coverage', '@bard', '@human'] },
  () => {
    let authToken: string;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create Scanlan The Bard For Caster Coverage',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();
        const characterName = `Scanlan The Bard ${Date.now()}`;

        const response = await charactersClient.createCharacter(
          {
            name: characterName,
            classId: 2,
            speciesId: 7,
            backgroundId: 1,
            level: 1,
            abilityScores: casterCoverageAbilityScoresInput,
          },
          authToken,
        );

        await charactersAssert.created(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(character.name, characterName);
        await charactersAssert.validateStatus(character.status, 'complete');
        await charactersAssert.validateClassId(character.classId, 2);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(character.backgroundId, 1);
        await charactersAssert.validateMissingFields(
          character.missingFields,
          [],
        );
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          casterCoverageAbilityScores,
          casterCoverageAbilityBonuses,
        );
        await charactersAssert.validateMovement(
          character.movement,
          { baseSpeed: 30, unit: 'ft' },
          { type: 'species', name: 'Human', value: 30 },
        );
        await charactersAssert.validateSpellcastingSummary(
          character.spellcastingSummary,
          {
            canCastSpells: true,
            ability: 'CHA',
            abilityModifier: 3,
            spellSaveDc: 13,
            spellAttackBonus: 5,
            selectedSpellsCount: 0,
            selectedCantripsCount: 0,
          },
        );
      },
    );
  },
);

test.describe(
  'Characters API - Pike The Cleric Caster Coverage Flow',
  {
    tag: ['@characters', '@flow', '@class-coverage', '@cleric', '@dragonborn'],
  },
  () => {
    let authToken: string;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create Pike The Cleric For Caster Coverage',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();
        const characterName = `Pike The Cleric ${Date.now()}`;

        const response = await charactersClient.createCharacter(
          {
            name: characterName,
            classId: 3,
            speciesId: 1,
            backgroundId: 1,
            level: 1,
            abilityScores: casterCoverageAbilityScoresInput,
          },
          authToken,
        );

        await charactersAssert.created(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(character.name, characterName);
        await charactersAssert.validateStatus(character.status, 'complete');
        await charactersAssert.validateClassId(character.classId, 3);
        await charactersAssert.validateSpeciesId(character.speciesId, 1);
        await charactersAssert.validateBackgroundId(character.backgroundId, 1);
        await charactersAssert.validateMissingFields(
          character.missingFields,
          [],
        );
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          casterCoverageAbilityScores,
          casterCoverageAbilityBonuses,
        );
        await charactersAssert.validateMovement(
          character.movement,
          { baseSpeed: 30, unit: 'ft' },
          { type: 'species', name: 'Dragonborn', value: 30 },
        );
        await charactersAssert.validateSpellcastingSummary(
          character.spellcastingSummary,
          {
            canCastSpells: true,
            ability: 'WIS',
            abilityModifier: 3,
            spellSaveDc: 13,
            spellAttackBonus: 5,
            selectedSpellsCount: 0,
            selectedCantripsCount: 0,
          },
        );
      },
    );
  },
);

test.describe(
  'Characters API - Keyleth The Druid Caster Coverage Flow',
  { tag: ['@characters', '@flow', '@class-coverage', '@druid', '@elf'] },
  () => {
    let authToken: string;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create Keyleth The Druid For Caster Coverage',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();
        const characterName = `Keyleth The Druid ${Date.now()}`;

        const response = await charactersClient.createCharacter(
          {
            name: characterName,
            classId: 4,
            speciesId: 3,
            backgroundId: 1,
            level: 1,
            abilityScores: casterCoverageAbilityScoresInput,
          },
          authToken,
        );

        await charactersAssert.created(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(character.name, characterName);
        await charactersAssert.validateStatus(character.status, 'complete');
        await charactersAssert.validateClassId(character.classId, 4);
        await charactersAssert.validateSpeciesId(character.speciesId, 3);
        await charactersAssert.validateBackgroundId(character.backgroundId, 1);
        await charactersAssert.validateMissingFields(
          character.missingFields,
          [],
        );
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          casterCoverageAbilityScores,
          casterCoverageAbilityBonuses,
        );
        await charactersAssert.validateMovement(
          character.movement,
          { baseSpeed: 30, unit: 'ft' },
          { type: 'species', name: 'Elf', value: 30 },
        );
        await charactersAssert.validateSpellcastingSummary(
          character.spellcastingSummary,
          {
            canCastSpells: true,
            ability: 'WIS',
            abilityModifier: 3,
            spellSaveDc: 13,
            spellAttackBonus: 5,
            selectedSpellsCount: 0,
            selectedCantripsCount: 0,
          },
        );
      },
    );
  },
);

test.describe(
  'Characters API - Elric The Warlock Caster Coverage Flow',
  { tag: ['@characters', '@flow', '@class-coverage', '@warlock', '@orc'] },
  () => {
    let authToken: string;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create Elric The Warlock For Caster Coverage',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();
        const characterName = `Elric The Warlock ${Date.now()}`;

        const response = await charactersClient.createCharacter(
          {
            name: characterName,
            classId: 11,
            speciesId: 8,
            backgroundId: 1,
            level: 1,
            abilityScores: casterCoverageAbilityScoresInput,
          },
          authToken,
        );

        await charactersAssert.created(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateName(character.name, characterName);
        await charactersAssert.validateStatus(character.status, 'complete');
        await charactersAssert.validateClassId(character.classId, 11);
        await charactersAssert.validateSpeciesId(character.speciesId, 8);
        await charactersAssert.validateBackgroundId(character.backgroundId, 1);
        await charactersAssert.validateMissingFields(
          character.missingFields,
          [],
        );
        await charactersAssert.validateAbilityScores(
          character.abilityScores,
          casterCoverageAbilityScores,
          casterCoverageAbilityBonuses,
        );
        await charactersAssert.validateMovement(
          character.movement,
          { baseSpeed: 30, unit: 'ft' },
          { type: 'species', name: 'Orc', value: 30 },
        );
        await charactersAssert.validateSpellcastingSummary(
          character.spellcastingSummary,
          {
            canCastSpells: true,
            ability: 'CHA',
            abilityModifier: 3,
            spellSaveDc: 13,
            spellAttackBonus: 5,
            selectedSpellsCount: 0,
            selectedCantripsCount: 0,
          },
        );
      },
    );
  },
);

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
        await charactersAssert.validateStatus(character.status, 'complete');
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
        await charactersAssert.validateStatus(character.status, 'complete');
        await charactersAssert.validateClassId(character.classId, 9);
        await charactersAssert.validateSpeciesId(character.speciesId, 7);
        await charactersAssert.validateBackgroundId(character.backgroundId, 5);
        await charactersAssert.validateLevel(character.level, 1);
        await charactersAssert.validateMissingFields(
          character.missingFields,
          [],
        );
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
          'Invalid character ability scores payload: bonuses must apply +1 to each background-allowed ability; received WIS +2',
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
