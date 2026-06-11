import { CharacterCurrency, CharacterResponseBody } from '@/app/types/character';
import { SkillName } from '@/app/types/skill';
import { expect, test } from '@playwright/test';

import { CharactersClient } from '../clients/characters.client';
import { CharactersAssert } from '../helpers/characters.assertions';
import {
  dragonbornSelectedSpeciesChoices,
  drowSelectedSpeciesChoices,
  drowSelectedSpeciesSkillProficiencies,
  fighterBaseSkillProficienciesWithoutSpecies,
  gimliAbilityScoresInput,
  gnomeSelectedSpeciesChoices,
  goliathSelectedSpeciesChoices,
  issueDemoToken,
  sageCurrency,
  soldierCurrency,
  tieflingSelectedSpeciesChoices,
  wizardAbilityScoresInput,
  wizardBaseSkillProficienciesWithoutSpecies,
} from './characters.shared';

test.describe(
  'Characters API - The Last Dragonborn Species Choice Flow',
  { tag: ['@characters', '@flow', '@species', '@dragonborn'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let createdCharacterId: number;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create The Last Dragonborn With Pending Species Choice',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.createCharacter(
          {
            name: `The Last Dragonborn ${Date.now()}`,
            classId: 5,
            speciesId: 1,
            backgroundId: 16,
            level: 1,
            abilityScores: gimliAbilityScoresInput,
            skillProficiencies: [
              'Athletics',
              'Intimidation',
              'Perception',
              'Survival',
            ],
            currency: soldierCurrency,
          },
          authToken,
        );

        await charactersAssert.created(response);

        const character: CharacterResponseBody = await response.json();
        createdCharacterId = character.id;

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateStatus(character.status, 'in_progress');
        await charactersAssert.validateClassId(character.classId, 5);
        await charactersAssert.validateSpeciesId(character.speciesId, 1);
        await charactersAssert.validateBackgroundId(character.backgroundId, 16);
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          [],
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          {},
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'speciesChoiceSelection',
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
      },
    );

    test(
      'Select Dragonborn Species Choice',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            selectedSpeciesChoices: dragonbornSelectedSpeciesChoices,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateStatus(character.status, 'in_progress');
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          [],
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          dragonbornSelectedSpeciesChoices,
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
        await charactersAssert.validateSkillProficiencies(
          character.skillProficiencies,
          ['Athletics', 'Intimidation', 'Perception', 'Survival'],
        );
      },
    );

    test(
      'Get Selected Dragonborn Species Choice',
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
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          [],
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          dragonbornSelectedSpeciesChoices,
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
      },
    );
  },
);

test.describe(
  'Characters API - Drizzt The Drow Species Choice Flow',
  { tag: ['@characters', '@flow', '@species', '@elf', '@drow'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let createdCharacterId: number;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create Drizzt The Drow With Pending Species Choices',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.createCharacter(
          {
            name: `Drizzt The Drow ${Date.now()}`,
            classId: 12,
            speciesId: 3,
            backgroundId: 13,
            level: 1,
            abilityScores: wizardAbilityScoresInput,
            skillProficiencies: wizardBaseSkillProficienciesWithoutSpecies,
            currency: sageCurrency,
          },
          authToken,
        );

        await charactersAssert.created(response);

        const character: CharacterResponseBody = await response.json();
        createdCharacterId = character.id;

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateStatus(character.status, 'in_progress');
        await charactersAssert.validateClassId(character.classId, 12);
        await charactersAssert.validateSpeciesId(character.speciesId, 3);
        await charactersAssert.validateBackgroundId(character.backgroundId, 13);
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          [],
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          {},
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'speciesSkillSelection',
          'speciesChoiceSelection',
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
        await charactersAssert.validateSkillProficiencies(
          character.skillProficiencies,
          wizardBaseSkillProficienciesWithoutSpecies,
        );
      },
    );

    test(
      'Select Drow Species Choices',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            selectedSpeciesSkillProficiencies:
              drowSelectedSpeciesSkillProficiencies,
            selectedSpeciesChoices: drowSelectedSpeciesChoices,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateStatus(character.status, 'in_progress');
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          drowSelectedSpeciesSkillProficiencies,
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          drowSelectedSpeciesChoices,
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
        await charactersAssert.validateSkillProficiencies(
          character.skillProficiencies,
          [
            'Arcana',
            'History',
            'Perception',
            'Investigation',
            'Religion',
          ],
        );
      },
    );

    test(
      'Get Selected Drow Species Choices',
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
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          drowSelectedSpeciesSkillProficiencies,
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          drowSelectedSpeciesChoices,
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
        await charactersAssert.validateSpeciesDetailsPresence(
          character.speciesDetails ?? null,
          true,
        );
        await charactersAssert.validateSkillProficiencies(
          character.skillProficiencies,
          [
            'Arcana',
            'History',
            'Perception',
            'Investigation',
            'Religion',
          ],
        );
      },
    );
  },
);

test.describe(
  'Characters API - Boddynock The Gnome Species Choice Flow',
  { tag: ['@characters', '@flow', '@species', '@gnome'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let createdCharacterId: number;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create Boddynock The Gnome With Pending Species Choice',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.createCharacter(
          {
            name: `Boddynock The Gnome ${Date.now()}`,
            classId: 5,
            speciesId: 4,
            backgroundId: 16,
            level: 1,
            abilityScores: gimliAbilityScoresInput,
            skillProficiencies: fighterBaseSkillProficienciesWithoutSpecies,
            currency: soldierCurrency,
          },
          authToken,
        );

        await charactersAssert.created(response);

        const character: CharacterResponseBody = await response.json();
        createdCharacterId = character.id;

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateStatus(character.status, 'in_progress');
        await charactersAssert.validateClassId(character.classId, 5);
        await charactersAssert.validateSpeciesId(character.speciesId, 4);
        await charactersAssert.validateBackgroundId(character.backgroundId, 16);
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          [],
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          {},
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'speciesChoiceSelection',
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
      },
    );

    test(
      'Select Gnome Species Choice',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            selectedSpeciesChoices: gnomeSelectedSpeciesChoices,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateStatus(character.status, 'in_progress');
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          [],
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          gnomeSelectedSpeciesChoices,
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
        await charactersAssert.validateSkillProficiencies(
          character.skillProficiencies,
          fighterBaseSkillProficienciesWithoutSpecies,
        );
      },
    );

    test(
      'Get Selected Gnome Species Choice',
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
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          [],
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          gnomeSelectedSpeciesChoices,
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
        await charactersAssert.validateSpeciesDetailsPresence(
          character.speciesDetails ?? null,
          true,
        );
      },
    );
  },
);

test.describe(
  'Characters API - Grog The Goliath Species Choice Flow',
  { tag: ['@characters', '@flow', '@species', '@goliath'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let createdCharacterId: number;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create Grog The Goliath With Pending Species Choice',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.createCharacter(
          {
            name: `Grog The Goliath ${Date.now()}`,
            classId: 5,
            speciesId: 5,
            backgroundId: 16,
            level: 1,
            abilityScores: gimliAbilityScoresInput,
            skillProficiencies: fighterBaseSkillProficienciesWithoutSpecies,
            currency: soldierCurrency,
          },
          authToken,
        );

        await charactersAssert.created(response);

        const character: CharacterResponseBody = await response.json();
        createdCharacterId = character.id;

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateStatus(character.status, 'in_progress');
        await charactersAssert.validateClassId(character.classId, 5);
        await charactersAssert.validateSpeciesId(character.speciesId, 5);
        await charactersAssert.validateBackgroundId(character.backgroundId, 16);
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          [],
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          {},
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'speciesChoiceSelection',
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
      },
    );

    test(
      'Select Goliath Species Choice',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            selectedSpeciesChoices: goliathSelectedSpeciesChoices,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateStatus(character.status, 'in_progress');
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          [],
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          goliathSelectedSpeciesChoices,
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
      },
    );

    test(
      'Get Selected Goliath Species Choice',
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
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          [],
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          goliathSelectedSpeciesChoices,
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
        await charactersAssert.validateSpeciesDetailsPresence(
          character.speciesDetails ?? null,
          true,
        );
      },
    );
  },
);

test.describe(
  'Characters API - Wyll The Tiefling Species Choice Flow',
  { tag: ['@characters', '@flow', '@species', '@tiefling'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;
    let createdCharacterId: number;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Create Wyll The Tiefling With Pending Species Choice',
      { tag: ['@post', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.createCharacter(
          {
            name: `Wyll The Tiefling ${Date.now()}`,
            classId: 5,
            speciesId: 9,
            backgroundId: 16,
            level: 1,
            abilityScores: gimliAbilityScoresInput,
            skillProficiencies: fighterBaseSkillProficienciesWithoutSpecies,
            currency: soldierCurrency,
          },
          authToken,
        );

        await charactersAssert.created(response);

        const character: CharacterResponseBody = await response.json();
        createdCharacterId = character.id;

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateStatus(character.status, 'in_progress');
        await charactersAssert.validateClassId(character.classId, 5);
        await charactersAssert.validateSpeciesId(character.speciesId, 9);
        await charactersAssert.validateBackgroundId(character.backgroundId, 16);
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          [],
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          {},
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'speciesChoiceSelection',
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
      },
    );

    test(
      'Select Tiefling Species Choice',
      { tag: ['@patch', '@data'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const response = await charactersClient.updateCharacter(
          createdCharacterId,
          {
            selectedSpeciesChoices: tieflingSelectedSpeciesChoices,
          },
          authToken,
        );

        await charactersAssert.success(response);

        const character: CharacterResponseBody = await response.json();

        await charactersAssert.validateCharacterResponseSchema(character);
        await charactersAssert.validateStatus(character.status, 'in_progress');
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          [],
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          tieflingSelectedSpeciesChoices,
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
      },
    );

    test(
      'Get Selected Tiefling Species Choice',
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
        await charactersAssert.validateSelectedSpeciesSkillProficiencies(
          character.selectedSpeciesSkillProficiencies,
          [],
        );
        await charactersAssert.validateSelectedSpeciesChoices(
          character.selectedSpeciesChoices,
          tieflingSelectedSpeciesChoices,
        );
        await charactersAssert.validatePendingChoices(character.pendingChoices, [
          'classEquipmentSelection',
          'backgroundEquipmentSelection',
        ]);
        await charactersAssert.validateSpeciesDetailsPresence(
          character.speciesDetails ?? null,
          true,
        );
      },
    );
  },
);

test.describe(
  'Characters API - Species Selection Negative Coverage',
  { tag: ['@characters', '@negative', '@species'] },
  () => {
    test.describe.configure({ mode: 'serial' });

    let authToken: string;

    test.beforeAll(async ({ request }) => {
      authToken = await issueDemoToken(request);
    });

    test(
      'Reject Invalid Human Species Skill Payload',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const createResponse = await charactersClient.createCharacter(
          {
            name: `Invalid Human Species Skill ${Date.now()}`,
            classId: 1,
            speciesId: 7,
            backgroundId: 16,
            level: 1,
          },
          authToken,
        );

        await charactersAssert.created(createResponse);

        const createdCharacter: CharacterResponseBody =
          await createResponse.json();

        try {
          const response = await charactersClient.updateCharacter(
            createdCharacter.id,
            {
              selectedSpeciesSkillProficiencies: ['Flying'] as unknown as SkillName[],
            },
            authToken,
          );

          await charactersAssert.badRequest(response);

          const body: { error: string } = await response.json();

          await charactersAssert.validateErrorResponse(
            body,
            'Invalid character request payload',
          );
        } finally {
          const deleteResponse = await charactersClient.deleteCharacter(
            createdCharacter.id,
            authToken,
          );

          expect(deleteResponse.ok()).toBe(true);
        }
      },
    );

    test(
      'Reject Species Skill Not Allowed For Elf',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const createResponse = await charactersClient.createCharacter(
          {
            name: `Invalid Elf Species Skill ${Date.now()}`,
            classId: 12,
            speciesId: 3,
            backgroundId: 13,
            level: 1,
          },
          authToken,
        );

        await charactersAssert.created(createResponse);

        const createdCharacter: CharacterResponseBody =
          await createResponse.json();

        try {
          const response = await charactersClient.updateCharacter(
            createdCharacter.id,
            {
              selectedSpeciesSkillProficiencies: ['Athletics'],
            },
            authToken,
          );

          await charactersAssert.badRequest(response);

          const body: { error: string } = await response.json();

          await charactersAssert.validateErrorResponse(
            body,
            'Invalid character species selection payload: Athletics is not allowed by this species. Allowed skills: Insight, Perception, Survival',
          );
        } finally {
          const deleteResponse = await charactersClient.deleteCharacter(
            createdCharacter.id,
            authToken,
          );

          expect(deleteResponse.ok()).toBe(true);
        }
      },
    );

    test(
      'Reject Too Many Elf Species Skills',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const createResponse = await charactersClient.createCharacter(
          {
            name: `Too Many Elf Species Skills ${Date.now()}`,
            classId: 12,
            speciesId: 3,
            backgroundId: 13,
            level: 1,
          },
          authToken,
        );

        await charactersAssert.created(createResponse);

        const createdCharacter: CharacterResponseBody =
          await createResponse.json();

        try {
          const response = await charactersClient.updateCharacter(
            createdCharacter.id,
            {
              selectedSpeciesSkillProficiencies: ['Insight', 'Perception'],
            },
            authToken,
          );

          await charactersAssert.badRequest(response);

          const body: { error: string } = await response.json();

          await charactersAssert.validateErrorResponse(
            body,
            'Invalid character species selection payload: expected at most 1 species skill choice, received 2',
          );
        } finally {
          const deleteResponse = await charactersClient.deleteCharacter(
            createdCharacter.id,
            authToken,
          );

          expect(deleteResponse.ok()).toBe(true);
        }
      },
    );

    test(
      'Reject Invalid Dragonborn Species Choice',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const createResponse = await charactersClient.createCharacter(
          {
            name: `Invalid Dragonborn Choice ${Date.now()}`,
            classId: 5,
            speciesId: 1,
            backgroundId: 16,
            level: 1,
          },
          authToken,
        );

        await charactersAssert.created(createResponse);

        const createdCharacter: CharacterResponseBody =
          await createResponse.json();

        try {
          const response = await charactersClient.updateCharacter(
            createdCharacter.id,
            {
              selectedSpeciesChoices: {
                'draconic-ancestry': 'banana-dragon',
              },
            },
            authToken,
          );

          await charactersAssert.badRequest(response);

          const body: { error: string } = await response.json();

          await charactersAssert.validateErrorResponse(
            body,
            'Invalid character species selection payload: banana-dragon is not allowed for draconic-ancestry',
          );
        } finally {
          const deleteResponse = await charactersClient.deleteCharacter(
            createdCharacter.id,
            authToken,
          );

          expect(deleteResponse.ok()).toBe(true);
        }
      },
    );

    test(
      'Reject Invalid Dragonborn Species Choice Key',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const createResponse = await charactersClient.createCharacter(
          {
            name: `Invalid Dragonborn Choice Key ${Date.now()}`,
            classId: 5,
            speciesId: 1,
            backgroundId: 16,
            level: 1,
          },
          authToken,
        );

        await charactersAssert.created(createResponse);

        const createdCharacter: CharacterResponseBody =
          await createResponse.json();

        try {
          const response = await charactersClient.updateCharacter(
            createdCharacter.id,
            {
              selectedSpeciesChoices: {
                'wrong-key': 'high-elf',
              },
            },
            authToken,
          );

          await charactersAssert.badRequest(response);

          const body: { error: string } = await response.json();

          await charactersAssert.validateErrorResponse(
            body,
            'Invalid character species selection payload: wrong-key is not a valid species choice key',
          );
        } finally {
          const deleteResponse = await charactersClient.deleteCharacter(
            createdCharacter.id,
            authToken,
          );

          expect(deleteResponse.ok()).toBe(true);
        }
      },
    );

    test(
      'Reject Invalid Gnome Species Choice',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const createResponse = await charactersClient.createCharacter(
          {
            name: `Invalid Gnome Choice ${Date.now()}`,
            classId: 5,
            speciesId: 4,
            backgroundId: 16,
            level: 1,
          },
          authToken,
        );

        await charactersAssert.created(createResponse);

        const createdCharacter: CharacterResponseBody =
          await createResponse.json();

        try {
          const response = await charactersClient.updateCharacter(
            createdCharacter.id,
            {
              selectedSpeciesChoices: {
                'gnomish-lineage': 'banana-gnome',
              },
            },
            authToken,
          );

          await charactersAssert.badRequest(response);

          const body: { error: string } = await response.json();

          await charactersAssert.validateErrorResponse(
            body,
            'Invalid character species selection payload: banana-gnome is not allowed for gnomish-lineage',
          );
        } finally {
          const deleteResponse = await charactersClient.deleteCharacter(
            createdCharacter.id,
            authToken,
          );

          expect(deleteResponse.ok()).toBe(true);
        }
      },
    );

    test(
      'Reject Invalid Goliath Species Choice',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const createResponse = await charactersClient.createCharacter(
          {
            name: `Invalid Goliath Choice ${Date.now()}`,
            classId: 5,
            speciesId: 5,
            backgroundId: 16,
            level: 1,
          },
          authToken,
        );

        await charactersAssert.created(createResponse);

        const createdCharacter: CharacterResponseBody =
          await createResponse.json();

        try {
          const response = await charactersClient.updateCharacter(
            createdCharacter.id,
            {
              selectedSpeciesChoices: {
                'giant-ancestry': 'banana-giant',
              },
            },
            authToken,
          );

          await charactersAssert.badRequest(response);

          const body: { error: string } = await response.json();

          await charactersAssert.validateErrorResponse(
            body,
            'Invalid character species selection payload: banana-giant is not allowed for giant-ancestry',
          );
        } finally {
          const deleteResponse = await charactersClient.deleteCharacter(
            createdCharacter.id,
            authToken,
          );

          expect(deleteResponse.ok()).toBe(true);
        }
      },
    );

    test(
      'Reject Invalid Tiefling Species Choice',
      { tag: ['@patch', '@negative', '@error'] },
      async ({ request }) => {
        const charactersClient = new CharactersClient(request);
        const charactersAssert = new CharactersAssert();

        const createResponse = await charactersClient.createCharacter(
          {
            name: `Invalid Tiefling Choice ${Date.now()}`,
            classId: 5,
            speciesId: 9,
            backgroundId: 16,
            level: 1,
          },
          authToken,
        );

        await charactersAssert.created(createResponse);

        const createdCharacter: CharacterResponseBody =
          await createResponse.json();

        try {
          const response = await charactersClient.updateCharacter(
            createdCharacter.id,
            {
              selectedSpeciesChoices: {
                'fiendish-legacy': 'banana-legacy',
              },
            },
            authToken,
          );

          await charactersAssert.badRequest(response);

          const body: { error: string } = await response.json();

          await charactersAssert.validateErrorResponse(
            body,
            'Invalid character species selection payload: banana-legacy is not allowed for fiendish-legacy',
          );
        } finally {
          const deleteResponse = await charactersClient.deleteCharacter(
            createdCharacter.id,
            authToken,
          );

          expect(deleteResponse.ok()).toBe(true);
        }
      },
    );
  },
);
