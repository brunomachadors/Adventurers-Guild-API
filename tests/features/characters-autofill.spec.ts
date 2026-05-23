import { CharacterResponseBody } from '@/app/types/character';
import { SkillName } from '@/app/types/skill';
import { expect, test } from '@playwright/test';

import { CharactersClient } from '../clients/characters.client';
import { CharactersAssert } from '../helpers/characters.assertions';
import { expectedDetailedBackgrounds } from '../data/backgrounds.expected';
import {
  fighterExtraSkillProficiencies,
  fighterSkillProficiencies,
  issueDemoToken,
  monkExtraSkillProficiencies,
  monkSkillProficiencies,
  paladinExtraSkillProficiencies,
  paladinSkillProficiencies,
  rangerExtraSkillProficiencies,
  rangerSkillProficiencies,
  rogueExtraSkillProficiencies,
  rogueSkillProficiencies,
} from './characters.shared';

test.describe(
  'Characters API - Background Skill Autofill Coverage',
  { tag: ['@characters', '@skills', '@backgrounds', '@coverage'] },
  () => {
    const coverageCases: {
      label: string;
      classId: number;
      speciesId: number;
      backgroundId: number;
      expectedBackgroundSkills: SkillName[];
      extraSkillChoices: SkillName[];
      expectedFinalSkills: SkillName[];
    }[] = [
      {
        label: 'Monk Acolyte',
        classId: 6,
        speciesId: 7,
        backgroundId: 1,
        expectedBackgroundSkills:
          expectedDetailedBackgrounds.acolyte.skillProficiencies as SkillName[],
        extraSkillChoices: monkExtraSkillProficiencies,
        expectedFinalSkills: monkSkillProficiencies,
      },
      {
        label: 'Paladin Noble',
        classId: 7,
        speciesId: 7,
        backgroundId: 12,
        expectedBackgroundSkills:
          expectedDetailedBackgrounds.noble.skillProficiencies as SkillName[],
        extraSkillChoices: paladinExtraSkillProficiencies,
        expectedFinalSkills: paladinSkillProficiencies,
      },
      {
        label: 'Ranger Soldier',
        classId: 8,
        speciesId: 3,
        backgroundId: 16,
        expectedBackgroundSkills:
          expectedDetailedBackgrounds.soldier.skillProficiencies as SkillName[],
        extraSkillChoices: rangerExtraSkillProficiencies,
        expectedFinalSkills: rangerSkillProficiencies,
      },
      {
        label: 'Rogue Criminal',
        classId: 9,
        speciesId: 7,
        backgroundId: 5,
        expectedBackgroundSkills:
          expectedDetailedBackgrounds.criminal.skillProficiencies as SkillName[],
        extraSkillChoices: rogueExtraSkillProficiencies,
        expectedFinalSkills: rogueSkillProficiencies,
      },
      {
        label: 'Fighter Soldier',
        classId: 5,
        speciesId: 7,
        backgroundId: 16,
        expectedBackgroundSkills:
          expectedDetailedBackgrounds.soldier.skillProficiencies as SkillName[],
        extraSkillChoices: fighterExtraSkillProficiencies,
        expectedFinalSkills: fighterSkillProficiencies,
      },
    ];

    for (const coverageCase of coverageCases) {
      test(
        `Autofill background skills and merge chosen class skills - ${coverageCase.label}`,
        async ({ request }) => {
          const charactersClient = new CharactersClient(request);
          const charactersAssert = new CharactersAssert();
          const authToken = await issueDemoToken(request);
          let createdCharacterId: number | null = null;

          try {
            const createResponse = await charactersClient.createCharacter(
              {
                name: `${coverageCase.label} ${Date.now()}`,
                classId: coverageCase.classId,
                speciesId: coverageCase.speciesId,
                backgroundId: coverageCase.backgroundId,
                level: 1,
              },
              authToken,
            );

            await charactersAssert.created(createResponse);

            const createdCharacter: CharacterResponseBody =
              await createResponse.json();
            createdCharacterId = createdCharacter.id;

            await test.step(
              `Validate background skills are auto-applied for ${coverageCase.label}`,
              async () => {
                await charactersAssert.validateSkillProficiencies(
                  createdCharacter.skillProficiencies,
                  coverageCase.expectedBackgroundSkills,
                );
              },
            );

            const patchSkillsResponse = await charactersClient.updateCharacter(
              createdCharacter.id,
              {
                skillProficiencies: coverageCase.extraSkillChoices,
              },
              authToken,
            );

            await charactersAssert.success(patchSkillsResponse);

            const updatedCharacter: CharacterResponseBody =
              await patchSkillsResponse.json();

            await test.step(
              `Validate chosen skills merge with background skills for ${coverageCase.label}`,
              async () => {
                await charactersAssert.validateSkillProficiencies(
                  updatedCharacter.skillProficiencies,
                  coverageCase.expectedFinalSkills,
                );
              },
            );

            const detailResponse = await charactersClient.getCharacterDetail(
              createdCharacter.id,
              authToken,
            );

            await charactersAssert.success(detailResponse);

            const detailedCharacter: CharacterResponseBody =
              await detailResponse.json();

            await test.step(
              `Validate final detail keeps merged skills for ${coverageCase.label}`,
              async () => {
                await charactersAssert.validateSkillProficiencies(
                  detailedCharacter.skillProficiencies,
                  coverageCase.expectedFinalSkills,
                );
              },
            );
          } finally {
            if (createdCharacterId !== null) {
              const deleteResponse = await charactersClient.deleteCharacter(
                createdCharacterId,
                authToken,
              );

              expect(deleteResponse.ok()).toBe(true);
            }
          }
        },
      );
    }

    test('Reject invalid class skill selections for Barbarian', async ({
      request,
    }) => {
      const charactersClient = new CharactersClient(request);
      const charactersAssert = new CharactersAssert();
      const authToken = await issueDemoToken(request);

      const createResponse = await charactersClient.createCharacter(
        {
          name: `Invalid Barbarian Skills ${Date.now()}`,
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
        const wrongCountResponse = await charactersClient.updateCharacter(
          createdCharacter.id,
          {
            skillProficiencies: ['Athletics', 'Intimidation', 'Perception'],
          },
          authToken,
        );

        await charactersAssert.badRequest(wrongCountResponse);

        const wrongCountBody: { error: string } =
          await wrongCountResponse.json();

        await charactersAssert.validateErrorResponse(
          wrongCountBody,
          'Invalid character skill proficiencies payload: expected 2 class skill choices, received 1',
        );

        const invalidSkillResponse = await charactersClient.updateCharacter(
          createdCharacter.id,
          {
            skillProficiencies: [
              'Athletics',
              'Intimidation',
              'Arcana',
              'Perception',
            ],
          },
          authToken,
        );

        await charactersAssert.badRequest(invalidSkillResponse);

        const invalidSkillBody: { error: string } =
          await invalidSkillResponse.json();

        await charactersAssert.validateErrorResponse(
          invalidSkillBody,
          'Invalid character skill proficiencies payload: Arcana is not allowed by this class. Allowed skills: Animal Handling, Athletics, Intimidation, Nature, Perception, Survival',
        );
      } finally {
        const deleteResponse = await charactersClient.deleteCharacter(
          createdCharacter.id,
          authToken,
        );

        expect(deleteResponse.ok()).toBe(true);
      }
    });
  },
);
