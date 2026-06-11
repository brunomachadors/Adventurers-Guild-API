import {
  CharacterChoicesResponseBody,
  CharacterResponseBody,
} from '@/app/types/character';
import { expect, test } from '@playwright/test';

import { CharactersClient } from '../clients/characters.client';
import { CharacterChoicesAssert } from '../helpers/character-choices.assertions';
import { CharactersAssert } from '../helpers/characters.assertions';
import {
  barbarianAbilityScoresInput,
  barbarianSkillProficiencies,
  dragonbornSelectedSpeciesChoices,
  elfSelectedSpeciesChoices,
  elfSelectedSpeciesSkillProficiencies,
  fighterBaseSkillProficienciesWithoutSpecies,
  gimliAbilityScoresInput,
  humanSelectedSpeciesSkillProficiencies,
  issueDemoToken,
  sageCurrency,
  soldierCurrency,
  wizardAbilityScoresInput,
  wizardBaseSkillProficienciesWithoutSpecies,
} from './characters.shared';

test.describe(
  'Characters API - Character Choices Endpoint',
  { tag: ['@characters', '@choices', '@flow'] },
  () => {
    test.describe(
      'Draft Character Choices Flow',
      () => {
        test.describe.configure({ mode: 'serial' });

        let authToken: string;
        let characterId: number;

        test.beforeAll(async ({ request }) => {
          authToken = await issueDemoToken(request);
        });

        test('Create Draft Character', async ({ request }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();

          const response = await charactersClient.createCharacter(
            {
              name: `Draft Choices ${Date.now()}`,
            },
            authToken,
          );

          await charactersAssert.created(response);

          const character: CharacterResponseBody = await response.json();
          characterId = character.id;
        });

        test('Get Draft Character Choices', async ({ request }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();
          const characterChoicesAssert = new CharacterChoicesAssert();

          const response = await charactersClient.getCharacterChoices(
            characterId,
            authToken,
          );

          await charactersAssert.success(response);

          const characterChoices: CharacterChoicesResponseBody =
            await response.json();

          await characterChoicesAssert.validateCharacterChoicesSchema(
            characterChoices,
          );
          await characterChoicesAssert.validateBaseCharacterChoices(
            characterChoices,
            {
              status: 'draft',
              classId: null,
              speciesId: null,
              backgroundId: null,
              level: 1,
              missingFields: ['classId', 'speciesId', 'backgroundId'],
              pendingChoices: [],
            },
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.classSkillSelection,
            null,
            'classSkillSelection',
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.speciesSkillSelection,
            null,
            'speciesSkillSelection',
          );
          await characterChoicesAssert.validateSpeciesChoiceSelection(
            characterChoices.speciesChoiceSelection,
            null,
          );
          await characterChoicesAssert.validateEquipmentSelection(
            characterChoices.classEquipmentSelection,
            null,
            'classEquipmentSelection',
          );
          await characterChoicesAssert.validateEquipmentSelection(
            characterChoices.backgroundEquipmentSelection,
            null,
            'backgroundEquipmentSelection',
          );
          await characterChoicesAssert.validateSpellSelection(
            characterChoices.spellSelection,
            null,
          );
        });
      },
    );

    test.describe(
      'Class Only Wizard Choices Flow',
      () => {
        test.describe.configure({ mode: 'serial' });

        let authToken: string;
        let characterId: number;

        test.beforeAll(async ({ request }) => {
          authToken = await issueDemoToken(request);
        });

        test('Create Draft Wizard Choices Character', async ({ request }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();

          const response = await charactersClient.createCharacter(
            {
              name: `Class Only Wizard Choices ${Date.now()}`,
            },
            authToken,
          );

          await charactersAssert.created(response);
          const character: CharacterResponseBody = await response.json();
          characterId = character.id;
        });

        test('Add Class Only To Wizard Choices Character', async ({ request }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();

          const response = await charactersClient.updateCharacter(
            characterId,
            {
              classId: 12,
              level: 1,
            },
            authToken,
          );

          await charactersAssert.success(response);
        });

        test('Get Class Only Wizard Choices', async ({ request }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();
          const characterChoicesAssert = new CharacterChoicesAssert();

          const response = await charactersClient.getCharacterChoices(
            characterId,
            authToken,
          );

          await charactersAssert.success(response);

          const characterChoices: CharacterChoicesResponseBody =
            await response.json();

          await characterChoicesAssert.validateCharacterChoicesSchema(
            characterChoices,
          );
          await characterChoicesAssert.validateBaseCharacterChoices(
            characterChoices,
            {
              status: 'in_progress',
              classId: 12,
              speciesId: null,
              backgroundId: null,
              level: 1,
              missingFields: ['speciesId', 'backgroundId'],
              pendingChoices: ['classEquipmentSelection'],
            },
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.classSkillSelection,
            {
              pending: true,
              choose: 2,
              selected: [],
              optionsIncludes: ['Arcana', 'Investigation', 'History'],
            },
            'classSkillSelection',
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.speciesSkillSelection,
            null,
            'speciesSkillSelection',
          );
          await characterChoicesAssert.validateSpeciesChoiceSelection(
            characterChoices.speciesChoiceSelection,
            null,
          );
          await characterChoicesAssert.validateEquipmentSelection(
            characterChoices.classEquipmentSelection,
            {
              pending: true,
              minimumOptions: 1,
            },
            'classEquipmentSelection',
          );
          await characterChoicesAssert.validateEquipmentSelection(
            characterChoices.backgroundEquipmentSelection,
            null,
            'backgroundEquipmentSelection',
          );
          await characterChoicesAssert.validateSpellSelection(
            characterChoices.spellSelection,
            {
              pending: true,
              canSelectSpells: true,
              maxCantrips: 3,
              maxSpells: 6,
              remainingCantrips: 3,
              remainingSpells: 6,
              selectedCount: 0,
              availableMinimum: 1,
            },
          );
        });
      },
    );

    test.describe(
      'Human Species Skill Choices Flow',
      () => {
        test.describe.configure({ mode: 'serial' });

        let authToken: string;
        let characterId: number;

        test.beforeAll(async ({ request }) => {
          authToken = await issueDemoToken(request);
        });

        test('Create Human Character With Pending Species Skill', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();

          const response = await charactersClient.createCharacter(
            {
              name: `Human Species Choices ${Date.now()}`,
              classId: 5,
              speciesId: 7,
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
          characterId = character.id;
        });

        test('Get Human Choices With Pending Species Skill', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();
          const characterChoicesAssert = new CharacterChoicesAssert();

          const response = await charactersClient.getCharacterChoices(
            characterId,
            authToken,
          );

          await charactersAssert.success(response);
          const characterChoices: CharacterChoicesResponseBody =
            await response.json();

          await characterChoicesAssert.validateCharacterChoicesSchema(
            characterChoices,
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.speciesSkillSelection,
            {
              pending: true,
              choose: 1,
              selected: [],
              optionsIncludes: ['Insight', 'Perception', 'Survival'],
            },
            'speciesSkillSelection',
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.classSkillSelection,
            {
              pending: false,
              choose: 2,
              selected: ['Perception', 'Survival'],
              optionsIncludes: ['Athletics', 'Perception', 'Survival'],
            },
            'classSkillSelection',
          );
          expect(characterChoices.pendingChoices).toEqual(
            expect.arrayContaining(['speciesSkillSelection']),
          );
        });

        test('Select Human Species Skill', async ({ request }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();

          const response = await charactersClient.updateCharacter(
            characterId,
            {
              selectedSpeciesSkillProficiencies:
                humanSelectedSpeciesSkillProficiencies,
            },
            authToken,
          );

          await charactersAssert.success(response);
        });

        test('Get Human Choices After Species Skill Selection', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();
          const characterChoicesAssert = new CharacterChoicesAssert();

          const response = await charactersClient.getCharacterChoices(
            characterId,
            authToken,
          );

          await charactersAssert.success(response);
          const characterChoices: CharacterChoicesResponseBody =
            await response.json();

          await characterChoicesAssert.validateCharacterChoicesSchema(
            characterChoices,
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.speciesSkillSelection,
            {
              pending: false,
              choose: 1,
              selected: ['Insight'],
              optionsIncludes: ['Insight', 'Perception', 'Survival'],
            },
            'speciesSkillSelection',
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.classSkillSelection,
            {
              pending: false,
              choose: 2,
              selected: ['Perception', 'Survival'],
              optionsIncludes: ['Athletics', 'Perception', 'Survival'],
            },
            'classSkillSelection',
          );
          expect(characterChoices.pendingChoices).not.toContain(
            'speciesSkillSelection',
          );
        });
      },
    );

    test.describe(
      'Elf Species Choices Flow',
      () => {
        test.describe.configure({ mode: 'serial' });

        let authToken: string;
        let characterId: number;

        test.beforeAll(async ({ request }) => {
          authToken = await issueDemoToken(request);
        });

        test('Create Elf Character With Pending Species Choices', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();

          const response = await charactersClient.createCharacter(
            {
              name: `Elf Species Choices ${Date.now()}`,
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
          characterId = character.id;
        });

        test('Get Elf Choices With Pending Skill And Lineage', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();
          const characterChoicesAssert = new CharacterChoicesAssert();

          const response = await charactersClient.getCharacterChoices(
            characterId,
            authToken,
          );

          await charactersAssert.success(response);
          const characterChoices: CharacterChoicesResponseBody =
            await response.json();

          await characterChoicesAssert.validateCharacterChoicesSchema(
            characterChoices,
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.speciesSkillSelection,
            {
              pending: true,
              choose: 1,
              selected: [],
              optionsEquals: ['Insight', 'Perception', 'Survival'],
            },
            'speciesSkillSelection',
          );
          await characterChoicesAssert.validateSpeciesChoiceSelection(
            characterChoices.speciesChoiceSelection,
            {
              pending: true,
              selected: {},
              choiceKeys: ['elven-lineage'],
            },
          );
        });

        test('Select Elf Species Skill And Lineage', async ({ request }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();

          const response = await charactersClient.updateCharacter(
            characterId,
            {
              selectedSpeciesSkillProficiencies:
                elfSelectedSpeciesSkillProficiencies,
              selectedSpeciesChoices: elfSelectedSpeciesChoices,
            },
            authToken,
          );

          await charactersAssert.success(response);
        });

        test('Get Elf Choices After Species Selection', async ({ request }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();
          const characterChoicesAssert = new CharacterChoicesAssert();

          const response = await charactersClient.getCharacterChoices(
            characterId,
            authToken,
          );

          await charactersAssert.success(response);
          const characterChoices: CharacterChoicesResponseBody =
            await response.json();

          await characterChoicesAssert.validateCharacterChoicesSchema(
            characterChoices,
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.speciesSkillSelection,
            {
              pending: false,
              choose: 1,
              selected: ['Insight'],
              optionsEquals: ['Insight', 'Perception', 'Survival'],
            },
            'speciesSkillSelection',
          );
          await characterChoicesAssert.validateSpeciesChoiceSelection(
            characterChoices.speciesChoiceSelection,
            {
              pending: false,
              selected: { 'elven-lineage': 'high-elf' },
              choiceKeys: ['elven-lineage'],
            },
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.classSkillSelection,
            {
              pending: false,
              choose: 2,
              selected: ['Investigation', 'Religion'],
              optionsIncludes: ['Arcana', 'Investigation', 'Religion'],
            },
            'classSkillSelection',
          );
        });
      },
    );

    test.describe(
      'Dragonborn Species Choices Flow',
      () => {
        test.describe.configure({ mode: 'serial' });

        let authToken: string;
        let characterId: number;

        test.beforeAll(async ({ request }) => {
          authToken = await issueDemoToken(request);
        });

        test('Create Dragonborn Character With Pending Ancestry', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();

          const response = await charactersClient.createCharacter(
            {
              name: `Dragonborn Species Choices ${Date.now()}`,
              classId: 5,
              speciesId: 1,
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
          characterId = character.id;
        });

        test('Get Dragonborn Choices With Pending Ancestry', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();
          const characterChoicesAssert = new CharacterChoicesAssert();

          const response = await charactersClient.getCharacterChoices(
            characterId,
            authToken,
          );

          await charactersAssert.success(response);
          const characterChoices: CharacterChoicesResponseBody =
            await response.json();

          await characterChoicesAssert.validateCharacterChoicesSchema(
            characterChoices,
          );
          await characterChoicesAssert.validateSpeciesChoiceSelection(
            characterChoices.speciesChoiceSelection,
            {
              pending: true,
              selected: {},
              choiceKeys: ['draconic-ancestry'],
            },
          );
        });

        test('Select Dragonborn Ancestry', async ({ request }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();

          const response = await charactersClient.updateCharacter(
            characterId,
            {
              selectedSpeciesChoices: dragonbornSelectedSpeciesChoices,
            },
            authToken,
          );

          await charactersAssert.success(response);
        });

        test('Get Dragonborn Choices After Ancestry Selection', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();
          const characterChoicesAssert = new CharacterChoicesAssert();

          const response = await charactersClient.getCharacterChoices(
            characterId,
            authToken,
          );

          await charactersAssert.success(response);
          const characterChoices: CharacterChoicesResponseBody =
            await response.json();

          await characterChoicesAssert.validateCharacterChoicesSchema(
            characterChoices,
          );
          await characterChoicesAssert.validateSpeciesChoiceSelection(
            characterChoices.speciesChoiceSelection,
            {
              pending: false,
              selected: { 'draconic-ancestry': 'blue-dragon-ancestry' },
              choiceKeys: ['draconic-ancestry'],
            },
          );
        });
      },
    );

    test.describe(
      'Complete Barbarian Choices Flow',
      () => {
        test.describe.configure({ mode: 'serial' });

        let authToken: string;
        let characterId: number;

        test.beforeAll(async ({ request }) => {
          authToken = await issueDemoToken(request);
        });

        test('Create Nearly Complete Barbarian With Pending Equipment', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();

          const response = await charactersClient.createCharacter(
            {
              name: `Complete Choices Conan ${Date.now()}`,
              classId: 1,
              speciesId: 7,
              backgroundId: 16,
              level: 1,
              abilityScores: barbarianAbilityScoresInput,
              skillProficiencies: barbarianSkillProficiencies,
              selectedSpeciesSkillProficiencies:
                humanSelectedSpeciesSkillProficiencies,
            },
            authToken,
          );

          await charactersAssert.created(response);
          const character: CharacterResponseBody = await response.json();
          characterId = character.id;
        });

        test('Get Complete Barbarian Choices Before Equipment', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();
          const characterChoicesAssert = new CharacterChoicesAssert();

          const response = await charactersClient.getCharacterChoices(
            characterId,
            authToken,
          );

          await charactersAssert.success(response);
          const characterChoices: CharacterChoicesResponseBody =
            await response.json();

          await characterChoicesAssert.validateCharacterChoicesSchema(
            characterChoices,
          );
          await characterChoicesAssert.validateBaseCharacterChoices(
            characterChoices,
            {
              status: 'in_progress',
              classId: 1,
              speciesId: 7,
              backgroundId: 16,
              level: 1,
              missingFields: [],
              pendingChoices: [
                'classEquipmentSelection',
                'backgroundEquipmentSelection',
              ],
            },
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.classSkillSelection,
            {
              pending: false,
              choose: 2,
              selected: ['Perception', 'Survival'],
              optionsIncludes: ['Athletics', 'Perception', 'Survival'],
            },
            'classSkillSelection',
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.speciesSkillSelection,
            {
              pending: false,
              choose: 1,
              selected: ['Insight'],
              optionsIncludes: ['Insight', 'Perception', 'Survival'],
            },
            'speciesSkillSelection',
          );
          await characterChoicesAssert.validateEquipmentSelection(
            characterChoices.classEquipmentSelection,
            {
              pending: true,
              minimumOptions: 1,
            },
            'classEquipmentSelection',
          );
          await characterChoicesAssert.validateEquipmentSelection(
            characterChoices.backgroundEquipmentSelection,
            {
              pending: true,
              minimumOptions: 1,
            },
            'backgroundEquipmentSelection',
          );
          await characterChoicesAssert.validateSpellSelection(
            characterChoices.spellSelection,
            null,
          );
        });

        test('Resolve Barbarian Equipment Choices', async ({ request }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();

          const classResponse =
            await charactersClient.chooseClassEquipmentPackage(
              characterId,
              { optionLabel: 'A' },
              authToken,
            );

          await charactersAssert.success(classResponse);

          const backgroundResponse =
            await charactersClient.chooseBackgroundEquipmentPackage(
              characterId,
              { optionIndex: 0 },
              authToken,
            );

          await charactersAssert.success(backgroundResponse);
        });

        test('Get Complete Barbarian Choices After Equipment', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();
          const characterChoicesAssert = new CharacterChoicesAssert();

          const response = await charactersClient.getCharacterChoices(
            characterId,
            authToken,
          );

          await charactersAssert.success(response);
          const characterChoices: CharacterChoicesResponseBody =
            await response.json();

          await characterChoicesAssert.validateCharacterChoicesSchema(
            characterChoices,
          );
          await characterChoicesAssert.validateBaseCharacterChoices(
            characterChoices,
            {
              status: 'complete',
              classId: 1,
              speciesId: 7,
              backgroundId: 16,
              level: 1,
              missingFields: [],
              pendingChoices: [],
            },
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.classSkillSelection,
            {
              pending: false,
              choose: 2,
              selected: ['Perception', 'Survival'],
              optionsIncludes: ['Athletics', 'Perception', 'Survival'],
            },
            'classSkillSelection',
          );
          await characterChoicesAssert.validateSkillSelection(
            characterChoices.speciesSkillSelection,
            {
              pending: false,
              choose: 1,
              selected: ['Insight'],
              optionsIncludes: ['Insight', 'Perception', 'Survival'],
            },
            'speciesSkillSelection',
          );
          await characterChoicesAssert.validateEquipmentSelection(
            characterChoices.classEquipmentSelection,
            {
              pending: false,
              minimumOptions: 1,
            },
            'classEquipmentSelection',
          );
          await characterChoicesAssert.validateEquipmentSelection(
            characterChoices.backgroundEquipmentSelection,
            {
              pending: false,
              minimumOptions: 1,
            },
            'backgroundEquipmentSelection',
          );
          await characterChoicesAssert.validateSpellSelection(
            characterChoices.spellSelection,
            null,
          );
        });
      },
    );

    test.describe(
      'Wizard Spell Choices Flow',
      () => {
        test.describe.configure({ mode: 'serial' });

        let authToken: string;
        let characterId: number;
        let selectedSpellIds: number[] = [];

        test.beforeAll(async ({ request }) => {
          authToken = await issueDemoToken(request);
        });

        test('Create Wizard With Pending Spell Selection', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();

          const response = await charactersClient.createCharacter(
            {
              name: `Wizard Spell Choices ${Date.now()}`,
              classId: 12,
              speciesId: 3,
              backgroundId: 13,
              level: 1,
              abilityScores: wizardAbilityScoresInput,
              skillProficiencies: [
                'Arcana',
                'History',
                'Insight',
                'Investigation',
                'Religion',
              ],
              selectedSpeciesSkillProficiencies:
                elfSelectedSpeciesSkillProficiencies,
              selectedSpeciesChoices: elfSelectedSpeciesChoices,
              currency: sageCurrency,
            },
            authToken,
          );

          await charactersAssert.created(response);
          const character: CharacterResponseBody = await response.json();
          characterId = character.id;
        });

        test('Get Wizard Spell Choices Before Selection', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();
          const characterChoicesAssert = new CharacterChoicesAssert();

          const response = await charactersClient.getCharacterChoices(
            characterId,
            authToken,
          );

          await charactersAssert.success(response);
          const characterChoices: CharacterChoicesResponseBody =
            await response.json();

          await characterChoicesAssert.validateCharacterChoicesSchema(
            characterChoices,
          );
          await characterChoicesAssert.validateSpellSelection(
            characterChoices.spellSelection,
            {
              pending: true,
              canSelectSpells: true,
              maxCantrips: 3,
              maxSpells: 6,
              remainingCantrips: 3,
              remainingSpells: 6,
              selectedCount: 0,
              availableMinimum: 4,
            },
          );

          const cantripIds =
            characterChoices.spellSelection?.availableSpells
              .filter((spell) => spell.level === 0)
              .slice(0, 3)
              .map((spell) => spell.id) ?? [];
          const leveledSpellIds =
            characterChoices.spellSelection?.availableSpells
              .filter((spell) => spell.level === 1)
              .slice(0, 6)
              .map((spell) => spell.id) ?? [];

          selectedSpellIds = [...cantripIds, ...leveledSpellIds];

          expect(cantripIds).toHaveLength(3);
          expect(leveledSpellIds).toHaveLength(6);
        });

        test('Select Wizard Spells Through Spells Endpoint', async ({
          request,
        }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();

          const response = await charactersClient.updateCharacterSpells(
            characterId,
            {
              spellIds: selectedSpellIds,
            },
            authToken,
          );

          await charactersAssert.success(response);
        });

        test('Get Wizard Spell Choices After Selection', async ({ request }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();
          const characterChoicesAssert = new CharacterChoicesAssert();

          const response = await charactersClient.getCharacterChoices(
            characterId,
            authToken,
          );

          await charactersAssert.success(response);
          const characterChoices: CharacterChoicesResponseBody =
            await response.json();

          await characterChoicesAssert.validateCharacterChoicesSchema(
            characterChoices,
          );
          await characterChoicesAssert.validateSpellSelection(
            characterChoices.spellSelection,
            {
              pending: false,
              canSelectSpells: true,
              maxCantrips: 3,
              maxSpells: 6,
              remainingCantrips: 0,
              remainingSpells: 0,
              selectedCount: 9,
              availableMinimum: 4,
            },
          );
        });
      },
    );
  },
);
