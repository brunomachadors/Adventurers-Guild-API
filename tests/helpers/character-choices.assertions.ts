import {
  CharacterChoicesResponseBody,
  CharacterChoicesEquipmentSelection,
  CharacterChoicesSkillSelection,
  CharacterChoicesSpeciesChoiceSelection,
  CharacterChoicesSpellSelection,
  CharacterPendingChoice,
  CharacterStatus,
} from '@/app/types/character';
import { expect, test } from '@playwright/test';

export class CharacterChoicesAssert {
  async validateCharacterChoicesSchema(
    characterChoices: CharacterChoicesResponseBody,
  ) {
    await test.step('Validate character choices response schema', async () => {
      expect(typeof characterChoices.characterId).toBe('number');
      expect(typeof characterChoices.status).toBe('string');
      expect(
        characterChoices.classId === null ||
          typeof characterChoices.classId === 'number',
      ).toBe(true);
      expect(
        characterChoices.speciesId === null ||
          typeof characterChoices.speciesId === 'number',
      ).toBe(true);
      expect(
        characterChoices.backgroundId === null ||
          typeof characterChoices.backgroundId === 'number',
      ).toBe(true);
      expect(typeof characterChoices.level).toBe('number');
      expect(Array.isArray(characterChoices.missingFields)).toBe(true);
      expect(Array.isArray(characterChoices.pendingChoices)).toBe(true);
    });

    await this.validateSkillSelectionSchema(
      characterChoices.classSkillSelection,
      'classSkillSelection',
    );
    await this.validateSkillSelectionSchema(
      characterChoices.speciesSkillSelection,
      'speciesSkillSelection',
    );
    await this.validateSpeciesChoiceSelectionSchema(
      characterChoices.speciesChoiceSelection,
    );
    await this.validateEquipmentSelectionSchema(
      characterChoices.classEquipmentSelection,
      'classEquipmentSelection',
    );
    await this.validateEquipmentSelectionSchema(
      characterChoices.backgroundEquipmentSelection,
      'backgroundEquipmentSelection',
    );
    await this.validateSpellSelectionSchema(characterChoices.spellSelection);
  }

  async validateBaseCharacterChoices(
    characterChoices: CharacterChoicesResponseBody,
    expected: {
      status: CharacterStatus;
      classId: number | null;
      speciesId: number | null;
      backgroundId: number | null;
      level: number;
      missingFields: string[];
      pendingChoices: CharacterPendingChoice[];
    },
  ) {
    await test.step('Validate base character choices fields', async () => {
      expect(characterChoices.status).toBe(expected.status);
      expect(characterChoices.classId).toBe(expected.classId);
      expect(characterChoices.speciesId).toBe(expected.speciesId);
      expect(characterChoices.backgroundId).toBe(expected.backgroundId);
      expect(characterChoices.level).toBe(expected.level);
      expect(characterChoices.missingFields).toEqual(expected.missingFields);
      expect(characterChoices.pendingChoices).toEqual(expected.pendingChoices);
    });
  }

  async validateSkillSelection(
    skillSelection: CharacterChoicesSkillSelection | null,
    expected:
      | null
      | {
          pending: boolean;
          choose: number;
          selected: string[];
          optionsIncludes?: string[];
          optionsEquals?: string[];
        },
    label: 'classSkillSelection' | 'speciesSkillSelection',
  ) {
    await test.step(`Validate ${label}`, async () => {
      if (expected === null) {
        expect(skillSelection).toBeNull();
        return;
      }

      expect(skillSelection).not.toBeNull();
      expect(skillSelection?.pending).toBe(expected.pending);
      expect(skillSelection?.choose).toBe(expected.choose);
      expect(skillSelection?.selected).toEqual(expected.selected);

      if (expected.optionsEquals) {
        expect(skillSelection?.options).toEqual(expected.optionsEquals);
      }

      if (expected.optionsIncludes) {
        expect(skillSelection?.options).toEqual(
          expect.arrayContaining(expected.optionsIncludes),
        );
      }
    });
  }

  async validateSpeciesChoiceSelection(
    speciesChoiceSelection: CharacterChoicesSpeciesChoiceSelection | null,
    expected:
      | null
      | {
          pending: boolean;
          selected: Record<string, string>;
          choiceKeys?: string[];
        },
  ) {
    await test.step('Validate speciesChoiceSelection', async () => {
      if (expected === null) {
        expect(speciesChoiceSelection).toBeNull();
        return;
      }

      expect(speciesChoiceSelection).not.toBeNull();
      expect(speciesChoiceSelection?.pending).toBe(expected.pending);
      expect(speciesChoiceSelection?.selected).toEqual(expected.selected);

      if (expected.choiceKeys) {
        expect(speciesChoiceSelection?.choices.map((choice) => choice.key)).toEqual(
          expect.arrayContaining(expected.choiceKeys),
        );
      }
    });
  }

  async validateEquipmentSelection(
    equipmentSelection: CharacterChoicesEquipmentSelection | null,
    expected:
      | null
      | {
          pending: boolean;
          minimumOptions?: number;
          expectedOptionLabels?: (string | null)[];
        },
    label: 'classEquipmentSelection' | 'backgroundEquipmentSelection',
  ) {
    await test.step(`Validate ${label}`, async () => {
      if (expected === null) {
        expect(equipmentSelection).toBeNull();
        return;
      }

      expect(equipmentSelection).not.toBeNull();
      expect(equipmentSelection?.pending).toBe(expected.pending);

      if (expected.minimumOptions !== undefined) {
        expect(equipmentSelection?.options.length ?? 0).toBeGreaterThanOrEqual(
          expected.minimumOptions,
        );
      }

      if (expected.expectedOptionLabels) {
        expect(equipmentSelection?.options.map((option) => option.label)).toEqual(
          expected.expectedOptionLabels,
        );
      }
    });
  }

  async validateSpellSelection(
    spellSelection: CharacterChoicesSpellSelection | null,
    expected:
      | null
      | {
          pending: boolean;
          canSelectSpells: boolean;
          maxCantrips: number;
          maxSpells: number;
          remainingCantrips: number;
          remainingSpells: number;
          selectedCount?: number;
          availableMinimum?: number;
        },
  ) {
    await test.step('Validate spellSelection', async () => {
      if (expected === null) {
        expect(spellSelection).toBeNull();
        return;
      }

      expect(spellSelection).not.toBeNull();
      expect(spellSelection?.pending).toBe(expected.pending);
      expect(spellSelection?.selectionRules.canSelectSpells).toBe(
        expected.canSelectSpells,
      );
      expect(spellSelection?.selectionRules.maxCantrips).toBe(
        expected.maxCantrips,
      );
      expect(spellSelection?.selectionRules.maxSpells).toBe(
        expected.maxSpells,
      );
      expect(spellSelection?.remainingCantrips).toBe(expected.remainingCantrips);
      expect(spellSelection?.remainingSpells).toBe(expected.remainingSpells);

      if (expected.selectedCount !== undefined) {
        expect(spellSelection?.selectedSpells).toHaveLength(expected.selectedCount);
      }

      if (expected.availableMinimum !== undefined) {
        expect(spellSelection?.availableSpells.length ?? 0).toBeGreaterThanOrEqual(
          expected.availableMinimum,
        );
      }
    });
  }

  private async validateSkillSelectionSchema(
    skillSelection: CharacterChoicesSkillSelection | null,
    label: 'classSkillSelection' | 'speciesSkillSelection',
  ) {
    await test.step(`Validate ${label} schema`, async () => {
      if (skillSelection === null) {
        expect(skillSelection).toBeNull();
        return;
      }

      expect(typeof skillSelection.pending).toBe('boolean');
      expect(typeof skillSelection.choose).toBe('number');
      expect(Array.isArray(skillSelection.selected)).toBe(true);
      expect(Array.isArray(skillSelection.options)).toBe(true);
      expect(skillSelection.selected.every((item) => typeof item === 'string')).toBe(
        true,
      );
      expect(skillSelection.options.every((item) => typeof item === 'string')).toBe(
        true,
      );
    });
  }

  private async validateSpeciesChoiceSelectionSchema(
    speciesChoiceSelection: CharacterChoicesSpeciesChoiceSelection | null,
  ) {
    await test.step('Validate speciesChoiceSelection schema', async () => {
      if (speciesChoiceSelection === null) {
        expect(speciesChoiceSelection).toBeNull();
        return;
      }

      expect(typeof speciesChoiceSelection.pending).toBe('boolean');
      expect(typeof speciesChoiceSelection.selected).toBe('object');
      expect(speciesChoiceSelection.selected).not.toBeNull();
      expect(Array.isArray(speciesChoiceSelection.choices)).toBe(true);

      for (const choice of speciesChoiceSelection.choices) {
        expect(typeof choice.key).toBe('string');
        expect(typeof choice.label).toBe('string');
        expect(typeof choice.description).toBe('string');
        expect(typeof choice.choose).toBe('number');
        expect(Array.isArray(choice.options)).toBe(true);

        for (const option of choice.options) {
          expect(typeof option.name).toBe('string');
          expect(typeof option.slug).toBe('string');
          expect(typeof option.description).toBe('string');
        }
      }
    });
  }

  private async validateEquipmentSelectionSchema(
    equipmentSelection: CharacterChoicesEquipmentSelection | null,
    label: 'classEquipmentSelection' | 'backgroundEquipmentSelection',
  ) {
    await test.step(`Validate ${label} schema`, async () => {
      if (equipmentSelection === null) {
        expect(equipmentSelection).toBeNull();
        return;
      }

      expect(typeof equipmentSelection.pending).toBe('boolean');
      expect(Array.isArray(equipmentSelection.options)).toBe(true);

      for (const option of equipmentSelection.options) {
        expect(typeof option.optionIndex).toBe('number');
        expect(option.label === null || typeof option.label === 'string').toBe(
          true,
        );
        expect(Array.isArray(option.items)).toBe(true);
        expect(option.items.every((item) => typeof item === 'string')).toBe(true);
      }
    });
  }

  private async validateSpellSelectionSchema(
    spellSelection: CharacterChoicesSpellSelection | null,
  ) {
    await test.step('Validate spellSelection schema', async () => {
      if (spellSelection === null) {
        expect(spellSelection).toBeNull();
        return;
      }

      expect(typeof spellSelection.pending).toBe('boolean');
      expect(typeof spellSelection.selectionRules.canSelectSpells).toBe('boolean');
      expect(
        spellSelection.selectionRules.selectionType === null ||
          typeof spellSelection.selectionRules.selectionType === 'string',
      ).toBe(true);
      expect(typeof spellSelection.selectionRules.maxCantrips).toBe('number');
      expect(typeof spellSelection.selectionRules.maxSpells).toBe('number');
      expect(Array.isArray(spellSelection.selectedSpells)).toBe(true);
      expect(Array.isArray(spellSelection.availableSpells)).toBe(true);
      expect(typeof spellSelection.remainingCantrips).toBe('number');
      expect(typeof spellSelection.remainingSpells).toBe('number');
    });
  }
}
