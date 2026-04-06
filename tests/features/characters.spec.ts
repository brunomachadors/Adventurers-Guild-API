import { TokenResponseBody } from '@/app/types/auth';
import {
  CharacterAbilityScoreOptionsResponseBody,
  CharacterAbilityScoresInput,
  CharacterAbilityScores,
  CharacterCurrency,
  CharacterEquipmentResponseBody,
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
import { expectedDetailedBackgrounds } from '../data/backgrounds.expected';
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

const patchedDraftAbilityScores: CharacterAbilityScores = {
  STR: 16,
  DEX: 12,
  CON: 14,
  INT: 10,
  WIS: 10,
  CHA: 8,
};

const barbarianAbilityBonuses: CharacterAbilityScores = {
  STR: 2,
  DEX: 0,
  CON: 1,
  INT: 0,
  WIS: 0,
  CHA: 0,
};

const wizardAbilityBonuses: CharacterAbilityScores = {
  STR: 0,
  DEX: 0,
  CON: 0,
  INT: 2,
  WIS: 1,
  CHA: 0,
};

const paladinAbilityBonuses: CharacterAbilityScores = {
  STR: 2,
  DEX: 0,
  CON: 0,
  INT: 0,
  WIS: 0,
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

const patchedDraftAbilityScoresInput: CharacterAbilityScoresInput = {
  base: patchedDraftAbilityScores,
  bonuses: {
    STR: 0,
    DEX: 0,
    CON: 0,
    INT: 0,
    WIS: 0,
    CHA: 0,
  },
};

const initialCurrency: CharacterCurrency = {
  cp: 0,
  sp: 5,
  ep: 0,
  gp: 12,
  pp: 0,
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
  gp: 14,
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
  'Characters API - Barbarian Flow',
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

  test(
    'Get Draft',
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
    },
  );

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
    'Get Barbarian',
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
      await charactersAssert.validateSpeciesId(character.speciesId, null);
      await charactersAssert.validateBackgroundId(character.backgroundId, null);
      await charactersAssert.validateMissingFields(character.missingFields, [
        'speciesId',
        'backgroundId',
      ]);
      await charactersAssert.validateAbilityScores(character.abilityScores, null);
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
    },
  );

  test(
    'Add Species Dwarf',
    { tag: ['@patch', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.updateCharacter(
        createdCharacterId,
        {
          speciesId: 2,
        },
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateClassId(character.classId, 1);
      await charactersAssert.validateSpeciesId(character.speciesId, 2);
      await charactersAssert.validateBackgroundId(character.backgroundId, null);
      await charactersAssert.validateMissingFields(character.missingFields, [
        'backgroundId',
      ]);
      await charactersAssert.validateAbilityScores(character.abilityScores, null);
      await charactersAssert.validateSpeciesDetailsPresence(
        character.speciesDetails ?? null,
        true,
      );

      if (character.speciesDetails) {
        await charactersAssert.validateId(character.speciesDetails.id, 2);
        await charactersAssert.validateName(
          character.speciesDetails.name,
          expectedDetailedSpecies.dwarf.name,
        );
        await charactersAssert.validateSpeciesDetailsSchema(
          character.speciesDetails,
        );
      }
    },
  );

  test(
    'Get Dwarf Barbarian',
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
      await charactersAssert.validateSpeciesId(character.speciesId, 2);
      await charactersAssert.validateBackgroundId(character.backgroundId, null);
      await charactersAssert.validateMissingFields(character.missingFields, [
        'backgroundId',
      ]);
      await charactersAssert.validateAbilityScores(character.abilityScores, null);
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

      const updatedCharacter: CharacterResponseBody = await updateResponse.json();

      await charactersAssert.validateCharacterResponseSchema(updatedCharacter);
      await charactersAssert.validateId(updatedCharacter.id, createdCharacterId);
      await charactersAssert.validateName(
        updatedCharacter.name,
        createdCharacterName,
      );
      await charactersAssert.validateStatus(updatedCharacter.status, 'complete');
      await charactersAssert.validateClassId(updatedCharacter.classId, 1);
      await charactersAssert.validateSpeciesId(updatedCharacter.speciesId, 2);
      await charactersAssert.validateBackgroundId(
        updatedCharacter.backgroundId,
        16,
      );
      await charactersAssert.validateLevel(updatedCharacter.level, 1);
      await charactersAssert.validateMissingFields(updatedCharacter.missingFields, []);
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

      if (updatedCharacter.speciesDetails) {
        await charactersAssert.validateId(updatedCharacter.speciesDetails.id, 2);
        await charactersAssert.validateName(
          updatedCharacter.speciesDetails.name,
          expectedDetailedSpecies.dwarf.name,
        );
        await charactersAssert.validateSpeciesDetailsSchema(
          updatedCharacter.speciesDetails,
        );
      }

      if (updatedCharacter.backgroundDetails) {
        await charactersAssert.validateId(updatedCharacter.backgroundDetails.id, 16);
        await charactersAssert.validateName(
          updatedCharacter.backgroundDetails.name,
          expectedDetailedBackgrounds.soldier.name,
        );
        await charactersAssert.validateBackgroundDetailsSchema(
          updatedCharacter.backgroundDetails,
        );
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
      await charactersAssert.validateSpeciesId(character.speciesId, 2);
      await charactersAssert.validateBackgroundId(character.backgroundId, 16);
      await charactersAssert.validateMissingFields(character.missingFields, []);
      await charactersAssert.validateAbilityScores(character.abilityScores, null);
      await charactersAssert.validateAbilityScoreRules(
        character.abilityScoreRules,
        expectedDetailedBackgrounds.soldier.abilityScores,
      );
      await charactersAssert.validateBackgroundDetailsPresence(
        character.backgroundDetails ?? null,
        true,
      );
    },
  );

  test(
    'Add Currency Soldier',
    { tag: ['@patch', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.updateCharacter(
        createdCharacterId,
        {
          currency: soldierCurrency,
        },
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateId(character.id, createdCharacterId);
      await charactersAssert.validateClassId(character.classId, 1);
      await charactersAssert.validateSpeciesId(character.speciesId, 2);
      await charactersAssert.validateBackgroundId(character.backgroundId, 16);
      await charactersAssert.validateStatus(character.status, 'complete');
      await charactersAssert.validateCurrency(character.currency, soldierCurrency);
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

      await charactersAssert.validateCharacterResponseSchema(updatedCharacter);
      await charactersAssert.validateId(updatedCharacter.id, createdCharacterId);
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
        abilityModifier: 1,
        level: 1,
      });
    },
  );

  test(
    'Add Equipment Barbarian',
    { tag: ['@post', '@data'] },
    async ({ request }) => {
      const charactersAssert = new CharactersAssert();

      const characterEquipment = await addCharacterEquipmentBySlug(
        request,
        createdCharacterId,
        authToken,
        [{ slug: 'greataxe', quantity: 1, isEquipped: true }],
      );

      await charactersAssert.validateCharacterEquipmentSchema(characterEquipment);
      await charactersAssert.validateId(
        characterEquipment.characterId,
        createdCharacterId,
      );
      await charactersAssert.validateCharacterEquipmentItems(characterEquipment, [
        { name: 'Greataxe', quantity: 1, isEquipped: true },
      ]);
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

      await charactersAssert.validateCharacterEquipmentSchema(characterEquipment);
      await charactersAssert.validateId(
        characterEquipment.characterId,
        createdCharacterId,
      );
      await charactersAssert.validateCharacterEquipmentItems(characterEquipment, [
        { name: 'Greataxe', quantity: 1, isEquipped: true },
      ]);
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

      const finalCharacter: CharacterResponseBody = await finalGetResponse.json();

      await charactersAssert.validateCharacterResponseSchema(finalCharacter);
      await charactersAssert.validateId(finalCharacter.id, createdCharacterId);
      await charactersAssert.validateName(finalCharacter.name, createdCharacterName);
      await charactersAssert.validateStatus(finalCharacter.status, 'complete');
      await charactersAssert.validateClassId(finalCharacter.classId, 1);
      await charactersAssert.validateSpeciesId(finalCharacter.speciesId, 2);
      await charactersAssert.validateBackgroundId(finalCharacter.backgroundId, 16);
      await charactersAssert.validateLevel(finalCharacter.level, 1);
      await charactersAssert.validateMissingFields(finalCharacter.missingFields, []);
      await charactersAssert.validateAbilityScores(
        finalCharacter.abilityScores,
        barbarianAbilityScores,
        barbarianAbilityBonuses,
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
        await charactersAssert.validateId(finalCharacter.speciesDetails.id, 2);
        await charactersAssert.validateName(
          finalCharacter.speciesDetails.name,
          expectedDetailedSpecies.dwarf.name,
        );
        await charactersAssert.validateSpeciesDetailsSchema(
          finalCharacter.speciesDetails,
        );
      }

      if (finalCharacter.backgroundDetails) {
        await charactersAssert.validateId(finalCharacter.backgroundDetails.id, 16);
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
  'Characters API - Create Complete Paladin',
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
    'Create Paladin Human Noble',
    { tag: ['@post', '@smoke', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      createdCharacterName = `Cedric ${Date.now()}`;

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
      await charactersAssert.validateName(character.name, createdCharacterName);
      await charactersAssert.validateStatus(character.status, 'complete');
      await charactersAssert.validateClassId(character.classId, 7);
      await charactersAssert.validateSpeciesId(character.speciesId, 7);
      await charactersAssert.validateBackgroundId(character.backgroundId, 12);
      await charactersAssert.validateLevel(character.level, 3);
      await charactersAssert.validateMissingFields(character.missingFields, []);
      await charactersAssert.validateAbilityScores(
        character.abilityScores,
        null,
      );
      await charactersAssert.validateCurrency(character.currency, nobleCurrency);
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
        await charactersAssert.validateName(character.classDetails.name, 'Paladin');
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
    'Get Paladin',
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
      await charactersAssert.validateName(character.name, createdCharacterName);
      await charactersAssert.validateStatus(character.status, 'complete');
      await charactersAssert.validateClassId(character.classId, 7);
      await charactersAssert.validateSpeciesId(character.speciesId, 7);
      await charactersAssert.validateBackgroundId(character.backgroundId, 12);
      await charactersAssert.validateLevel(character.level, 3);
      await charactersAssert.validateMissingFields(character.missingFields, []);
      await charactersAssert.validateAbilityScores(character.abilityScores, null);
      await charactersAssert.validateCurrency(character.currency, nobleCurrency);
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

      await charactersAssert.validateCharacterSpellOptionsSchema(spellOptions);
      await charactersAssert.validateId(spellOptions.characterId, createdCharacterId);
      await charactersAssert.validateClassId(spellOptions.classId, 7);
      await charactersAssert.validateClassName(spellOptions.className, 'Paladin');

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
      await charactersAssert.validateClassName(spellSelection.className, 'Paladin');
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
      await charactersAssert.validateClassName(spellSelection.className, 'Paladin');
      await charactersAssert.validateLevel(spellSelection.level, 3);

      await test.step('Validate selected paladin spells were persisted', async () => {
        expect(spellSelection.selectedSpells).toHaveLength(selectedSpellIds.length);
        expect(spellSelection.selectedSpells.map((spell) => spell.id)).toEqual(
          selectedSpellIds,
        );
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
      await charactersAssert.validateClassName(spellSelection.className, 'Paladin');
      await charactersAssert.validateLevel(spellSelection.level, 3);

      await test.step(
        'Validate selected paladin spells are returned on follow-up get',
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

      await charactersAssert.validateCharacterEquipmentSchema(characterEquipment);
      await charactersAssert.validateId(
        characterEquipment.characterId,
        createdCharacterId,
      );
      await charactersAssert.validateCharacterEquipmentItems(characterEquipment, [
        { name: 'Chain Mail', quantity: 1, isEquipped: true },
        { name: 'Longsword', quantity: 1, isEquipped: true },
        { name: 'Shield', quantity: 1, isEquipped: true },
      ]);
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

      await charactersAssert.validateCharacterEquipmentSchema(characterEquipment);
      await charactersAssert.validateId(
        characterEquipment.characterId,
        createdCharacterId,
      );
      await charactersAssert.validateCharacterEquipmentItems(characterEquipment, [
        { name: 'Chain Mail', quantity: 1, isEquipped: true },
        { name: 'Longsword', quantity: 1, isEquipped: true },
        { name: 'Shield', quantity: 1, isEquipped: true },
      ]);
    },
  );

  test(
    'Get Complete Paladin',
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
      await charactersAssert.validateName(character.name, createdCharacterName);
      await charactersAssert.validateStatus(character.status, 'complete');
      await charactersAssert.validateClassId(character.classId, 7);
      await charactersAssert.validateSpeciesId(character.speciesId, 7);
      await charactersAssert.validateBackgroundId(character.backgroundId, 12);
      await charactersAssert.validateLevel(character.level, 3);
      await charactersAssert.validateMissingFields(character.missingFields, []);
      await charactersAssert.validateAbilityScores(
        character.abilityScores,
        paladinAbilityScores,
        paladinAbilityBonuses,
      );
      await charactersAssert.validateCurrency(character.currency, nobleCurrency);
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
        await charactersAssert.validateName(character.classDetails.name, 'Paladin');
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
  'Characters API - Wizard Flow',
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
    'Create Draft',
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

  test(
    'Get Draft',
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
    },
  );

  test(
    'Add Class Wizard',
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
    'Get Wizard',
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
      await charactersAssert.validateBackgroundId(character.backgroundId, null);
      await charactersAssert.validateMissingFields(character.missingFields, [
        'speciesId',
        'backgroundId',
      ]);
      await charactersAssert.validateAbilityScores(character.abilityScores, null);
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
      await charactersAssert.validateBackgroundId(character.backgroundId, null);
      await charactersAssert.validateMissingFields(character.missingFields, [
        'backgroundId',
      ]);
      await charactersAssert.validateAbilityScores(character.abilityScores, null);
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

  test(
    'Get Elf Wizard',
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
      await charactersAssert.validateSpeciesId(character.speciesId, 3);
      await charactersAssert.validateBackgroundId(character.backgroundId, null);
      await charactersAssert.validateMissingFields(character.missingFields, [
        'backgroundId',
      ]);
      await charactersAssert.validateAbilityScores(character.abilityScores, null);
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

      const updatedCharacter: CharacterResponseBody = await updateResponse.json();

      await charactersAssert.validateCharacterResponseSchema(updatedCharacter);
      await charactersAssert.validateId(updatedCharacter.id, createdCharacterId);
      await charactersAssert.validateName(
        updatedCharacter.name,
        createdCharacterName,
      );
      await charactersAssert.validateStatus(updatedCharacter.status, 'complete');
      await charactersAssert.validateClassId(updatedCharacter.classId, 12);
      await charactersAssert.validateSpeciesId(updatedCharacter.speciesId, 3);
      await charactersAssert.validateBackgroundId(
        updatedCharacter.backgroundId,
        13,
      );
      await charactersAssert.validateLevel(updatedCharacter.level, 1);
      await charactersAssert.validateMissingFields(updatedCharacter.missingFields, []);
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
        await charactersAssert.validateId(updatedCharacter.backgroundDetails.id, 13);
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

  test(
    'Get Sage Wizard',
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
      await charactersAssert.validateSpeciesId(character.speciesId, 3);
      await charactersAssert.validateBackgroundId(character.backgroundId, 13);
      await charactersAssert.validateMissingFields(character.missingFields, []);
      await charactersAssert.validateAbilityScores(character.abilityScores, null);
      await charactersAssert.validateAbilityScoreRules(
        character.abilityScoreRules,
        expectedDetailedBackgrounds.sage.abilityScores,
      );
      await charactersAssert.validateBackgroundDetailsPresence(
        character.backgroundDetails ?? null,
        true,
      );
    },
  );

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
      await charactersAssert.validateCurrency(character.currency, sageCurrency);
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

      await charactersAssert.validateCharacterResponseSchema(updatedCharacter);
      await charactersAssert.validateId(updatedCharacter.id, createdCharacterId);
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

      await charactersAssert.validateCharacterEquipmentSchema(characterEquipment);
      await charactersAssert.validateId(
        characterEquipment.characterId,
        createdCharacterId,
      );
      await charactersAssert.validateCharacterEquipmentItems(characterEquipment, [
        { name: 'Quarterstaff', quantity: 1, isEquipped: true },
        { name: "Calligrapher's Supplies", quantity: 1, isEquipped: false },
        { name: 'Book', quantity: 1, isEquipped: false },
        { name: 'Parchment', quantity: 8, isEquipped: false },
        { name: 'Robe', quantity: 1, isEquipped: true },
      ]);
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

      await charactersAssert.validateCharacterEquipmentSchema(characterEquipment);
      await charactersAssert.validateId(
        characterEquipment.characterId,
        createdCharacterId,
      );
      await charactersAssert.validateCharacterEquipmentItems(characterEquipment, [
        { name: 'Quarterstaff', quantity: 1, isEquipped: true },
        { name: "Calligrapher's Supplies", quantity: 1, isEquipped: false },
        { name: 'Book', quantity: 1, isEquipped: false },
        { name: 'Parchment', quantity: 8, isEquipped: false },
        { name: 'Robe', quantity: 1, isEquipped: true },
      ]);
    },
  );

  test(
    'Get Complete Wizard',
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
      await charactersAssert.validateStatus(finalCharacter.status, 'complete');
      await charactersAssert.validateClassId(finalCharacter.classId, 12);
      await charactersAssert.validateSpeciesId(finalCharacter.speciesId, 3);
      await charactersAssert.validateBackgroundId(finalCharacter.backgroundId, 13);
      await charactersAssert.validateLevel(finalCharacter.level, 1);
      await charactersAssert.validateMissingFields(finalCharacter.missingFields, []);
      await charactersAssert.validateAbilityScores(
        finalCharacter.abilityScores,
        wizardAbilityScores,
        wizardAbilityBonuses,
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
        await charactersAssert.validateId(finalCharacter.speciesDetails.id, 3);
        await charactersAssert.validateName(
          finalCharacter.speciesDetails.name,
          expectedDetailedSpecies.elf.name,
        );
        await charactersAssert.validateSpeciesDetailsSchema(
          finalCharacter.speciesDetails,
        );
      }

      if (finalCharacter.backgroundDetails) {
        await charactersAssert.validateId(finalCharacter.backgroundDetails.id, 13);
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
  'Characters API - Ability Scores And Currency',
  { tag: ['@characters', '@ability-scores', '@currency'] },
  () => {
  test.describe.configure({ mode: 'serial' });

  let authToken: string;
  let noScoresCharacterId: number;
  let withScoresCharacterId: number;
  let patchScoresCharacterId: number;
  let noCurrencyCharacterId: number;
  let withCurrencyCharacterId: number;
  let patchCurrencyCharacterId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await issueDemoToken(request);
  });

  test(
    'Create No Scores',
    { tag: ['@post', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.createCharacter(
        {
          name: `No Scores ${Date.now()}`,
        },
        authToken,
      );

      await charactersAssert.created(response);

      const character: CharacterResponseBody = await response.json();
      noScoresCharacterId = character.id;

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateAbilityScores(character.abilityScores, null);
      await charactersAssert.validateCurrency(character.currency, null);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Get No Scores',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterDetail(
        noScoresCharacterId,
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateAbilityScores(character.abilityScores, null);
      await charactersAssert.validateCurrency(character.currency, null);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Create With Scores',
    { tag: ['@post', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.createCharacter(
        {
          name: `With Scores ${Date.now()}`,
          abilityScores: patchedDraftAbilityScoresInput,
        },
        authToken,
      );

      await charactersAssert.created(response);

      const character: CharacterResponseBody = await response.json();
      withScoresCharacterId = character.id;

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateAbilityScores(
        character.abilityScores,
        patchedDraftAbilityScores,
      );
      await charactersAssert.validateCurrency(character.currency, null);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Get With Scores',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterDetail(
        withScoresCharacterId,
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateAbilityScores(
        character.abilityScores,
        patchedDraftAbilityScores,
      );
      await charactersAssert.validateCurrency(character.currency, null);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Patch Scores',
    { tag: ['@patch', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const createResponse = await charactersClient.createCharacter(
        {
          name: `Patch Scores ${Date.now()}`,
        },
        authToken,
      );

      await charactersAssert.created(createResponse);

      const createdCharacter: CharacterResponseBody = await createResponse.json();
      patchScoresCharacterId = createdCharacter.id;

      const response = await charactersClient.updateCharacter(
        patchScoresCharacterId,
        {
          abilityScores: patchedDraftAbilityScoresInput,
        },
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateAbilityScores(
        character.abilityScores,
        patchedDraftAbilityScores,
      );
      await charactersAssert.validateCurrency(character.currency, null);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Get Patched Scores',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterDetail(
        patchScoresCharacterId,
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateAbilityScores(
        character.abilityScores,
        patchedDraftAbilityScores,
      );
      await charactersAssert.validateCurrency(character.currency, null);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Clear Scores',
    { tag: ['@patch', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.updateCharacter(
        patchScoresCharacterId,
        {
          abilityScores: null,
        },
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateAbilityScores(character.abilityScores, null);
      await charactersAssert.validateCurrency(character.currency, null);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Get Cleared Scores',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterDetail(
        patchScoresCharacterId,
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateAbilityScores(character.abilityScores, null);
      await charactersAssert.validateCurrency(character.currency, null);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Create No Currency',
    { tag: ['@post', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.createCharacter(
        {
          name: `No Currency ${Date.now()}`,
        },
        authToken,
      );

      await charactersAssert.created(response);

      const character: CharacterResponseBody = await response.json();
      noCurrencyCharacterId = character.id;

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateCurrency(character.currency, null);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Get No Currency',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterDetail(
        noCurrencyCharacterId,
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateCurrency(character.currency, null);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Create With Currency',
    { tag: ['@post', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.createCharacter(
        {
          name: `With Currency ${Date.now()}`,
          currency: initialCurrency,
        },
        authToken,
      );

      await charactersAssert.created(response);

      const character: CharacterResponseBody = await response.json();
      withCurrencyCharacterId = character.id;

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateCurrency(character.currency, initialCurrency);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Get With Currency',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterDetail(
        withCurrencyCharacterId,
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateCurrency(character.currency, initialCurrency);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Patch Currency',
    { tag: ['@patch', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const createResponse = await charactersClient.createCharacter(
        {
          name: `Patch Currency ${Date.now()}`,
        },
        authToken,
      );

      await charactersAssert.created(createResponse);

      const createdCharacter: CharacterResponseBody = await createResponse.json();
      patchCurrencyCharacterId = createdCharacter.id;

      const response = await charactersClient.updateCharacter(
        patchCurrencyCharacterId,
        {
          currency: patchedCurrency,
        },
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateCurrency(character.currency, patchedCurrency);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Get Patched Currency',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterDetail(
        patchCurrencyCharacterId,
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateCurrency(character.currency, patchedCurrency);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Clear Currency',
    { tag: ['@patch', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.updateCharacter(
        patchCurrencyCharacterId,
        {
          currency: null,
        },
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateCurrency(character.currency, null);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Get Cleared Currency',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterDetail(
        patchCurrencyCharacterId,
        authToken,
      );

      await charactersAssert.success(response);

      const character: CharacterResponseBody = await response.json();

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateCurrency(character.currency, null);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );
  },
);

test.describe(
  'Characters API - Equipment',
  { tag: ['@characters', '@equipment'] },
  () => {
  test.describe.configure({ mode: 'serial' });

  let authToken: string;
  let characterWithoutEquipmentId: number;
  let characterWithEquipmentId: number;
  let longswordEquipmentId: number;

  test.beforeAll(async ({ request }) => {
    authToken = await issueDemoToken(request);

    const equipmentClient = new EquipmentClient(request);
    const equipmentResponse = await equipmentClient.getEquipmentDetail('longsword');
    expect(equipmentResponse.status()).toBe(200);
    const equipment: EquipmentDetail = await equipmentResponse.json();
    expect(equipment.name).toBe('Longsword');
    longswordEquipmentId = equipment.id;
  });

  test(
    'Create Character Without Equipment',
    { tag: ['@post', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.createCharacter(
        {
          name: `No Equipment ${Date.now()}`,
        },
        authToken,
      );

      await charactersAssert.created(response);

      const character: CharacterResponseBody = await response.json();
      characterWithoutEquipmentId = character.id;

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Get Empty Equipment',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterEquipment(
        characterWithoutEquipmentId,
        authToken,
      );

      await charactersAssert.success(response);

      const characterEquipment: CharacterEquipmentResponseBody =
        await response.json();

      await charactersAssert.validateCharacterEquipmentSchema(characterEquipment);
      await charactersAssert.validateId(
        characterEquipment.characterId,
        characterWithoutEquipmentId,
      );

      await test.step('Validate character has no equipment', async () => {
        expect(characterEquipment.equipment).toEqual([]);
      });
    },
  );

  test(
    'Create Character With Equipment',
    { tag: ['@post', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.createCharacter(
        {
          name: `With Equipment ${Date.now()}`,
        },
        authToken,
      );

      await charactersAssert.created(response);

      const character: CharacterResponseBody = await response.json();
      characterWithEquipmentId = character.id;

      await charactersAssert.validateCharacterResponseSchema(character);
      await charactersAssert.validateStatus(character.status, 'draft');
    },
  );

  test(
    'Add Longsword Equipment',
    { tag: ['@post', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.addCharacterEquipment(
        characterWithEquipmentId,
        {
          equipmentId: longswordEquipmentId,
          quantity: 1,
          isEquipped: true,
        },
        authToken,
      );

      await charactersAssert.created(response);

      const characterEquipment: CharacterEquipmentResponseBody =
        await response.json();

      await charactersAssert.validateCharacterEquipmentSchema(characterEquipment);
      await charactersAssert.validateId(
        characterEquipment.characterId,
        characterWithEquipmentId,
      );
      await test.step('Validate character equipment items are returned', async () => {
        const longsword = characterEquipment.equipment.find(
          (item) => item.id === longswordEquipmentId,
        );

        expect(longsword).toBeDefined();
        expect(longsword?.name).toBe('Longsword');
        expect(longsword?.quantity).toBe(1);
        expect(longsword?.isEquipped).toBe(true);
      });
    },
  );

  test(
    'Get Added Equipment',
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

      await charactersAssert.validateCharacterEquipmentSchema(characterEquipment);
      await charactersAssert.validateId(
        characterEquipment.characterId,
        characterWithEquipmentId,
      );
      await test.step('Validate added equipment is returned', async () => {
        const longsword = characterEquipment.equipment.find(
          (item) => item.id === longswordEquipmentId,
        );

        expect(longsword).toBeDefined();
        expect(longsword?.quantity).toBe(1);
        expect(longsword?.isEquipped).toBe(true);
      });
    },
  );

  test(
    'Add Longsword Again',
    { tag: ['@post', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.addCharacterEquipment(
        characterWithEquipmentId,
        {
          equipmentId: longswordEquipmentId,
          quantity: 2,
          isEquipped: false,
        },
        authToken,
      );

      await charactersAssert.created(response);

      const characterEquipment: CharacterEquipmentResponseBody =
        await response.json();

      await charactersAssert.validateCharacterEquipmentSchema(characterEquipment);
      await charactersAssert.validateId(
        characterEquipment.characterId,
        characterWithEquipmentId,
      );
      await test.step('Validate quantity increments and equipped state updates', async () => {
        const longsword = characterEquipment.equipment.find(
          (item) => item.id === longswordEquipmentId,
        );

        expect(longsword).toBeDefined();
        expect(longsword?.quantity).toBe(3);
        expect(longsword?.isEquipped).toBe(false);
      });
    },
  );
  },
);

test.describe(
  'Characters API - Delete Flow',
  { tag: ['@characters', '@flow', '@delete'] },
  () => {
  test.describe.configure({ mode: 'serial' });

  let authToken: string;
  let createdCharacterId: number;
  let createdCharacterName: string;

  test.beforeAll(async ({ request }) => {
    authToken = await issueDemoToken(request);
  });

  test(
    'Create Rogue Orc Criminal',
    { tag: ['@post', '@smoke', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      createdCharacterName = `Shade ${Date.now()}`;

      const response = await charactersClient.createCharacter(
        {
          name: createdCharacterName,
          classId: 9,
          speciesId: 8,
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
      await charactersAssert.validateName(character.name, createdCharacterName);
      await charactersAssert.validateStatus(character.status, 'complete');
      await charactersAssert.validateClassId(character.classId, 9);
      await charactersAssert.validateSpeciesId(character.speciesId, 8);
      await charactersAssert.validateBackgroundId(character.backgroundId, 5);
      await charactersAssert.validateLevel(character.level, 1);
      await charactersAssert.validateMissingFields(character.missingFields, []);
    },
  );

  test(
    'Delete Rogue Orc Criminal',
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
    'Get Deleted Character',
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

      await charactersAssert.validateErrorResponse(body, 'Character not found');
    },
  );

  test(
    'List Without Deleted Character',
    { tag: ['@get', '@data'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacters(authToken);

      await charactersAssert.success(response);

      const characters: CharacterListItem[] = await response.json();

      await charactersAssert.validateCharacterListSchema(characters);

      await test.step('Validate deleted character is absent from list', async () => {
        expect(characters.some((character) => character.id === createdCharacterId)).toBe(false);
      });
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
    'Delete character without token',
    { tag: ['@delete', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.deleteCharacter(1);

      await charactersAssert.unauthorized(response);

      const body: { error: string } = await response.json();

      await charactersAssert.validateErrorResponse(body, 'Unauthorized');
    },
  );

  test(
    'Get character equipment without token',
    { tag: ['@get', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.getCharacterEquipment(1);

      await charactersAssert.unauthorized(response);

      const body: { error: string } = await response.json();

      await charactersAssert.validateErrorResponse(body, 'Unauthorized');
    },
  );

  test(
    'Add character equipment without token',
    { tag: ['@post', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();

      const response = await charactersClient.addCharacterEquipment(1, {
        equipmentId: 1,
        quantity: 1,
        isEquipped: true,
      });

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
    'Delete non-existent character',
    { tag: ['@delete', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const token = await issueDemoToken(request);

      const response = await charactersClient.deleteCharacter(999999, token);

      await charactersAssert.notFound(response);

      const body: { error: string } = await response.json();

      await charactersAssert.validateErrorResponse(body, 'Character not found');
    },
  );

  test(
    'Get non-existent character equipment',
    { tag: ['@get', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const token = await issueDemoToken(request);

      const response = await charactersClient.getCharacterEquipment(999999, token);

      await charactersAssert.notFound(response);

      const body: { error: string } = await response.json();

      await charactersAssert.validateErrorResponse(body, 'Character not found');
    },
  );

  test(
    'Add equipment to non-existent character',
    { tag: ['@post', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const token = await issueDemoToken(request);

      const response = await charactersClient.addCharacterEquipment(
        999999,
        {
          equipmentId: 1,
          quantity: 1,
          isEquipped: true,
        },
        token,
      );

      await charactersAssert.notFound(response);

      const body: { error: string } = await response.json();

      await charactersAssert.validateErrorResponse(body, 'Character not found');
    },
  );

  test(
    'Add non-existent equipment to character',
    { tag: ['@post', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const token = await issueDemoToken(request);

      const createResponse = await charactersClient.createCharacter(
        {
          name: `Invalid Equipment ${Date.now()}`,
        },
        token,
      );

      await charactersAssert.created(createResponse);

      const createdCharacter: CharacterResponseBody = await createResponse.json();

      const response = await charactersClient.addCharacterEquipment(
        createdCharacter.id,
        {
          equipmentId: 999999,
          quantity: 1,
          isEquipped: true,
        },
        token,
      );

      await charactersAssert.notFound(response);

      const body: { error: string } = await response.json();

      await charactersAssert.validateErrorResponse(body, 'Equipment not found');
    },
  );

  test(
    'Add character equipment with invalid payload',
    { tag: ['@post', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const token = await issueDemoToken(request);

      const createResponse = await charactersClient.createCharacter(
        {
          name: `Invalid Equipment Payload ${Date.now()}`,
        },
        token,
      );

      await charactersAssert.created(createResponse);

      const createdCharacter: CharacterResponseBody = await createResponse.json();

      const response = await charactersClient.addCharacterEquipment(
        createdCharacter.id,
        {
          equipmentId: 1,
          quantity: 0,
          isEquipped: true,
        },
        token,
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

  test(
    'Create character with incomplete scores',
    { tag: ['@post', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const token = await issueDemoToken(request);

      const response = await charactersClient.createCharacter(
        {
          name: `Incomplete Scores ${Date.now()}`,
          abilityScores: {
            base: {
              STR: 15,
            },
            bonuses: {
              STR: 2,
            },
          } as unknown as CharacterAbilityScoresInput,
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
    'Patch character with non-numeric score',
    { tag: ['@post', '@patch', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const token = await issueDemoToken(request);

      const createResponse = await charactersClient.createCharacter(
        {
          name: `Invalid Scores ${Date.now()}`,
        },
        token,
      );

      await charactersAssert.created(createResponse);

      const createdCharacter: CharacterResponseBody = await createResponse.json();

      const response = await charactersClient.updateCharacter(
        createdCharacter.id,
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
    'Create character with incomplete currency',
    { tag: ['@post', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const token = await issueDemoToken(request);

      const response = await charactersClient.createCharacter(
        {
          name: `Incomplete Currency ${Date.now()}`,
          currency: {
            gp: 10,
          } as unknown as CharacterCurrency,
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
    'Patch character with non-numeric currency',
    { tag: ['@post', '@patch', '@negative', '@error'] },
    async ({ request }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const token = await issueDemoToken(request);

      const createResponse = await charactersClient.createCharacter(
        {
          name: `Invalid Currency ${Date.now()}`,
        },
        token,
      );

      await charactersAssert.created(createResponse);

      const createdCharacter: CharacterResponseBody = await createResponse.json();

      const response = await charactersClient.updateCharacter(
        createdCharacter.id,
        {
          currency: {
            cp: 0,
            sp: '5',
            ep: 0,
            gp: 12,
            pp: 0,
          } as unknown as CharacterCurrency,
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
  },
);
