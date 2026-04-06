import {
  CharacterAbilityScoreOptionsResponseBody,
  CharacterAbilityModifiers,
  CharacterArmorClass,
  CharacterAbilityScores,
  CharacterCurrency,
  CharacterResolvedAbilityScores,
  CharacterClassDetails,
  CharacterEquipmentResponseBody,
  CharacterListItem,
  CharacterSkillItem,
  CharacterSpellOptionsResponseBody,
  CharacterSpellSelectionResponseBody,
  CharacterResponseBody,
  CharacterStatus,
} from '@/app/types/character';
import { BackgroundDetail } from '@/app/types/background';
import { SpeciesDetail } from '@/app/types/species';
import { expect, test } from '@playwright/test';

export class CharactersAssert {
  private createEmptyAbilityScores(): CharacterAbilityScores {
    return {
      STR: 0,
      DEX: 0,
      CON: 0,
      INT: 0,
      WIS: 0,
      CHA: 0,
    };
  }

  private addAbilityScores(
    base: CharacterAbilityScores,
    bonuses: CharacterAbilityScores,
  ): CharacterAbilityScores {
    return {
      STR: base.STR + bonuses.STR,
      DEX: base.DEX + bonuses.DEX,
      CON: base.CON + bonuses.CON,
      INT: base.INT + bonuses.INT,
      WIS: base.WIS + bonuses.WIS,
      CHA: base.CHA + bonuses.CHA,
    };
  }

  private calculateAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  private createAbilityModifiers(
    finalAbilityScores: CharacterAbilityScores,
  ): CharacterAbilityModifiers {
    return {
      STR: this.calculateAbilityModifier(finalAbilityScores.STR),
      DEX: this.calculateAbilityModifier(finalAbilityScores.DEX),
      CON: this.calculateAbilityModifier(finalAbilityScores.CON),
      INT: this.calculateAbilityModifier(finalAbilityScores.INT),
      WIS: this.calculateAbilityModifier(finalAbilityScores.WIS),
      CHA: this.calculateAbilityModifier(finalAbilityScores.CHA),
    };
  }

  private createEmptyCurrency(): CharacterCurrency {
    return {
      cp: 0,
      sp: 0,
      ep: 0,
      gp: 0,
      pp: 0,
    };
  }

  private getProficiencyBonus(level: number): number {
    if (level >= 17) {
      return 6;
    }

    if (level >= 13) {
      return 5;
    }

    if (level >= 9) {
      return 4;
    }

    if (level >= 5) {
      return 3;
    }

    return 2;
  }

  async created(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 201', async () => {
      expect(response.status()).toBe(201);
      expect(response.ok()).toBeTruthy();
    });
  }

  async success(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 200', async () => {
      expect(response.status()).toBe(200);
      expect(response.ok()).toBeTruthy();
    });
  }

  async unauthorized(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 401', async () => {
      expect(response.status()).toBe(401);
      expect(response.ok()).toBeFalsy();
    });
  }

  async badRequest(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 400', async () => {
      expect(response.status()).toBe(400);
      expect(response.ok()).toBeFalsy();
    });
  }

  async notFound(response: { status(): number; ok(): boolean }) {
    await test.step('Should return status code 404', async () => {
      expect(response.status()).toBe(404);
      expect(response.ok()).toBeFalsy();
    });
  }

  async validateCharacterListSchema(characters: CharacterListItem[]) {
    await test.step('Validate character list schema', async () => {
      expect(characters).toBeTruthy();
      expect(Array.isArray(characters)).toBe(true);
    });

    for (const character of characters) {
      await test.step(`Validate character list item schema for ${character.name}`, async () => {
        expect(character).toHaveProperty('id');
        expect(character).toHaveProperty('name');
        expect(character).toHaveProperty('status');
        expect(character).toHaveProperty('level');

        expect(typeof character.id).toBe('number');
        expect(typeof character.name).toBe('string');
        expect(typeof character.status).toBe('string');
        expect(typeof character.level).toBe('number');
      });
    }
  }

  async validateCharacterSpellOptionsSchema(
    spellOptions: CharacterSpellOptionsResponseBody,
  ) {
    await test.step('Validate character spell options schema', async () => {
      expect(spellOptions).toHaveProperty('characterId');
      expect(spellOptions).toHaveProperty('classId');
      expect(spellOptions).toHaveProperty('className');
      expect(spellOptions).toHaveProperty('spells');

      expect(typeof spellOptions.characterId).toBe('number');
      expect(
        spellOptions.classId === null || typeof spellOptions.classId === 'number',
      ).toBe(true);
      expect(
        spellOptions.className === null ||
          typeof spellOptions.className === 'string',
      ).toBe(true);
      expect(Array.isArray(spellOptions.spells)).toBe(true);
    });

    for (const spell of spellOptions.spells) {
      await test.step(`Validate spell option schema for ${spell.name}`, async () => {
        expect(spell).toHaveProperty('id');
        expect(spell).toHaveProperty('name');
        expect(spell).toHaveProperty('level');
        expect(spell).toHaveProperty('levelLabel');

        expect(typeof spell.id).toBe('number');
        expect(typeof spell.name).toBe('string');
        expect(typeof spell.level).toBe('number');
        expect(typeof spell.levelLabel).toBe('string');
      });
    }
  }

  async validateCharacterSkillsSchema(skills: CharacterSkillItem[]) {
    await test.step('Validate character skills schema', async () => {
      expect(Array.isArray(skills)).toBe(true);
    });

    for (const skill of skills) {
      await test.step(`Validate character skill schema for ${skill.name}`, async () => {
        expect(skill).toHaveProperty('name');
        expect(skill).toHaveProperty('ability');
        expect(skill).toHaveProperty('isProficient');
        expect(skill).toHaveProperty('abilityModifier');
        expect(skill).toHaveProperty('proficiencyBonus');
        expect(skill).toHaveProperty('total');

        expect(typeof skill.name).toBe('string');
        expect(typeof skill.ability).toBe('string');
        expect(typeof skill.isProficient).toBe('boolean');
        expect(typeof skill.abilityModifier).toBe('number');
        expect(typeof skill.proficiencyBonus).toBe('number');
        expect(typeof skill.total).toBe('number');
      });
    }
  }

  async validateCharacterEquipmentSchema(
    characterEquipment: CharacterEquipmentResponseBody,
  ) {
    await test.step('Validate character equipment response schema', async () => {
      expect(characterEquipment).toHaveProperty('characterId');
      expect(characterEquipment).toHaveProperty('equipment');

      expect(typeof characterEquipment.characterId).toBe('number');
      expect(Array.isArray(characterEquipment.equipment)).toBe(true);
    });

    for (const item of characterEquipment.equipment) {
      await test.step(`Validate character equipment item schema for ${item.name}`, async () => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('type');
        expect(item).toHaveProperty('quantity');
        expect(item).toHaveProperty('isEquipped');

        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
        expect(typeof item.category).toBe('string');
        expect(typeof item.type).toBe('string');
        expect(typeof item.quantity).toBe('number');
        expect(typeof item.isEquipped).toBe('boolean');
      });
    }
  }

  async validateCharacterEquipmentItems(
    characterEquipment: CharacterEquipmentResponseBody,
    expectedItems: { name: string; quantity: number; isEquipped: boolean }[],
  ) {
    await test.step('Validate expected character equipment items', async () => {
      for (const expectedItem of expectedItems) {
        const equipmentItem = characterEquipment.equipment.find(
          (item) => item.name === expectedItem.name,
        );

        expect(equipmentItem).toBeDefined();
        expect(equipmentItem?.quantity).toBe(expectedItem.quantity);
        expect(equipmentItem?.isEquipped).toBe(expectedItem.isEquipped);
      }
    });
  }

  async validateCharacterEquipmentItem(
    characterEquipment: CharacterEquipmentResponseBody,
    expectedItem: { id: number; quantity: number; isEquipped: boolean; name?: string },
  ) {
    await test.step('Validate expected character equipment item', async () => {
      const equipmentItem = characterEquipment.equipment.find(
        (item) => item.id === expectedItem.id,
      );

      expect(equipmentItem).toBeDefined();

      if (expectedItem.name !== undefined) {
        expect(equipmentItem?.name).toBe(expectedItem.name);
      }

      expect(equipmentItem?.quantity).toBe(expectedItem.quantity);
      expect(equipmentItem?.isEquipped).toBe(expectedItem.isEquipped);
    });
  }

  async validateCharacterEquipmentItemAbsent(
    characterEquipment: CharacterEquipmentResponseBody,
    equipmentId: number,
  ) {
    await test.step('Validate character equipment item is absent', async () => {
      expect(
        characterEquipment.equipment.some((item) => item.id === equipmentId),
      ).toBe(false);
    });
  }

  async validateCharacterSpellSelectionSchema(
    spellSelection: CharacterSpellSelectionResponseBody,
  ) {
    await test.step('Validate character spell selection schema', async () => {
      expect(spellSelection).toHaveProperty('characterId');
      expect(spellSelection).toHaveProperty('classId');
      expect(spellSelection).toHaveProperty('className');
      expect(spellSelection).toHaveProperty('level');
      expect(spellSelection).toHaveProperty('selectionRules');
      expect(spellSelection).toHaveProperty('selectedSpells');
      expect(spellSelection).toHaveProperty('availableSpells');

      expect(typeof spellSelection.characterId).toBe('number');
      expect(
        spellSelection.classId === null ||
          typeof spellSelection.classId === 'number',
      ).toBe(true);
      expect(
        spellSelection.className === null ||
          typeof spellSelection.className === 'string',
      ).toBe(true);
      expect(typeof spellSelection.level).toBe('number');
      expect(Array.isArray(spellSelection.selectedSpells)).toBe(true);
      expect(Array.isArray(spellSelection.availableSpells)).toBe(true);
    });

    await test.step('Validate spell selection rules schema', async () => {
      expect(spellSelection.selectionRules).toHaveProperty('canSelectSpells');
      expect(spellSelection.selectionRules).toHaveProperty('selectionType');
      expect(spellSelection.selectionRules).toHaveProperty('maxCantrips');
      expect(spellSelection.selectionRules).toHaveProperty('maxSpells');

      expect(typeof spellSelection.selectionRules.canSelectSpells).toBe('boolean');
      expect(
        spellSelection.selectionRules.selectionType === null ||
          typeof spellSelection.selectionRules.selectionType === 'string',
      ).toBe(true);
      expect(typeof spellSelection.selectionRules.maxCantrips).toBe('number');
      expect(typeof spellSelection.selectionRules.maxSpells).toBe('number');
    });

    for (const spell of spellSelection.selectedSpells) {
      await test.step(`Validate selected spell schema for ${spell.name}`, async () => {
        expect(spell).toHaveProperty('id');
        expect(spell).toHaveProperty('name');
        expect(spell).toHaveProperty('level');
        expect(spell).toHaveProperty('levelLabel');
        expect(spell).toHaveProperty('selectionType');

        expect(typeof spell.id).toBe('number');
        expect(typeof spell.name).toBe('string');
        expect(typeof spell.level).toBe('number');
        expect(typeof spell.levelLabel).toBe('string');
        expect(typeof spell.selectionType).toBe('string');
      });
    }

    for (const spell of spellSelection.availableSpells) {
      await test.step(`Validate available spell schema for ${spell.name}`, async () => {
        expect(spell).toHaveProperty('id');
        expect(spell).toHaveProperty('name');
        expect(spell).toHaveProperty('level');
        expect(spell).toHaveProperty('levelLabel');

        expect(typeof spell.id).toBe('number');
        expect(typeof spell.name).toBe('string');
        expect(typeof spell.level).toBe('number');
        expect(typeof spell.levelLabel).toBe('string');
      });
    }
  }

  async validateCharacterAbilityScoreOptionsSchema(
    abilityScoreOptions: CharacterAbilityScoreOptionsResponseBody,
  ) {
    await test.step('Validate character ability score options schema', async () => {
      expect(abilityScoreOptions).toHaveProperty('characterId');
      expect(abilityScoreOptions).toHaveProperty('backgroundId');
      expect(abilityScoreOptions).toHaveProperty('backgroundName');
      expect(abilityScoreOptions).toHaveProperty('selectionRules');
      expect(abilityScoreOptions).toHaveProperty('selectedAbilityScores');
      expect(abilityScoreOptions).toHaveProperty('availableChoices');

      expect(typeof abilityScoreOptions.characterId).toBe('number');
      expect(
        abilityScoreOptions.backgroundId === null ||
          typeof abilityScoreOptions.backgroundId === 'number',
      ).toBe(true);
      expect(
        abilityScoreOptions.backgroundName === null ||
          typeof abilityScoreOptions.backgroundName === 'string',
      ).toBe(true);
      expect(
        abilityScoreOptions.selectionRules === null ||
          typeof abilityScoreOptions.selectionRules === 'object',
      ).toBe(true);
      expect(
        abilityScoreOptions.selectedAbilityScores === null ||
          typeof abilityScoreOptions.selectedAbilityScores === 'object',
      ).toBe(true);
      expect(Array.isArray(abilityScoreOptions.availableChoices)).toBe(true);
    });

    if (abilityScoreOptions.selectionRules) {
      await this.validateAbilityScoreRulesSchema(
        abilityScoreOptions.selectionRules,
      );
    }

    if (abilityScoreOptions.selectedAbilityScores) {
      await this.validateSelectedAbilityScores(
        abilityScoreOptions.selectedAbilityScores,
        abilityScoreOptions.selectedAbilityScores.base,
        abilityScoreOptions.selectedAbilityScores.bonuses,
      );
    }
  }

  async validateCharacterResponseSchema(character: CharacterResponseBody) {
    await test.step('Validate character response schema', async () => {
      expect(character).toHaveProperty('id');
      expect(character).toHaveProperty('name');
      expect(character).toHaveProperty('status');
      expect(character).toHaveProperty('classId');
      expect(character).toHaveProperty('speciesId');
      expect(character).toHaveProperty('backgroundId');
      expect(character).toHaveProperty('level');
      expect(character).toHaveProperty('missingFields');
      expect(character).toHaveProperty('abilityScores');
      expect(character).toHaveProperty('abilityModifiers');
      expect(character).toHaveProperty('armorClass');
      expect(character).toHaveProperty('currency');
      expect(character).toHaveProperty('skillProficiencies');
      expect(character).toHaveProperty('abilityScoreRules');
      expect(character).toHaveProperty('classDetails');
      expect(character).toHaveProperty('speciesDetails');
      expect(character).toHaveProperty('backgroundDetails');

      expect(typeof character.id).toBe('number');
      expect(typeof character.name).toBe('string');
      expect(typeof character.status).toBe('string');
      expect(
        character.classId === null || typeof character.classId === 'number',
      ).toBe(true);
      expect(
        character.speciesId === null || typeof character.speciesId === 'number',
      ).toBe(true);
      expect(
        character.backgroundId === null ||
          typeof character.backgroundId === 'number',
      ).toBe(true);
      expect(typeof character.level).toBe('number');
      expect(Array.isArray(character.missingFields)).toBe(true);
      expect(
        character.abilityScores === null ||
          typeof character.abilityScores === 'object',
      ).toBe(true);
      expect(
        character.abilityModifiers === null ||
          typeof character.abilityModifiers === 'object',
      ).toBe(true);
      expect(typeof character.armorClass).toBe('object');
      expect(
        character.currency === null || typeof character.currency === 'object',
      ).toBe(true);
      expect(Array.isArray(character.skillProficiencies)).toBe(true);
      expect(
        character.abilityScoreRules === null ||
          typeof character.abilityScoreRules === 'object',
      ).toBe(true);
      expect(
        character.classDetails === null ||
          typeof character.classDetails === 'object',
      ).toBe(true);
      expect(
        character.speciesDetails === null ||
          typeof character.speciesDetails === 'object',
      ).toBe(true);
      expect(
        character.backgroundDetails === null ||
          typeof character.backgroundDetails === 'object',
      ).toBe(true);
    });

    for (const missingField of character.missingFields) {
      await test.step(`Validate missing field schema for ${missingField}`, async () => {
        expect(typeof missingField).toBe('string');
      });
    }

    for (const skillProficiency of character.skillProficiencies) {
      await test.step(
        `Validate skill proficiency schema for ${skillProficiency}`,
        async () => {
          expect(typeof skillProficiency).toBe('string');
        },
      );
    }

    if (character.abilityScores) {
      await this.validateResolvedAbilityScoresSchema(character.abilityScores);
    }

    if (character.abilityModifiers) {
      await this.validateAbilityModifiersSchema(character.abilityModifiers);
    }

    await this.validateArmorClassSchema(character.armorClass);

    if (character.currency) {
      await this.validateCurrencySchema(character.currency);
    }

    await test.step(
      'Validate ability modifiers consistency with final ability scores',
      async () => {
        if (character.abilityScores === null) {
          expect(character.abilityModifiers).toBeNull();

          return;
        }

        expect(character.abilityModifiers).not.toBeNull();
        expect(character.abilityModifiers).toEqual(
          this.createAbilityModifiers(character.abilityScores.final),
        );
      },
    );

    if (character.abilityScoreRules) {
      await this.validateAbilityScoreRulesSchema(character.abilityScoreRules);
    }

    if (character.classDetails) {
      await this.validateClassDetailsSchema(character.classDetails, character.level);
    }

    if (character.speciesDetails) {
      await this.validateSpeciesDetailsSchema(character.speciesDetails);
    }

    if (character.backgroundDetails) {
      await this.validateBackgroundDetailsSchema(character.backgroundDetails);
    }
  }

  async validateClassDetailsSchema(
    classDetails: CharacterClassDetails,
    characterLevel: number,
  ) {
    await test.step(`Validate class details schema for ${classDetails.name}`, async () => {
      expect(classDetails).toHaveProperty('id');
      expect(classDetails).toHaveProperty('name');
      expect(classDetails).toHaveProperty('slug');
      expect(classDetails).toHaveProperty('description');
      expect(classDetails).toHaveProperty('role');
      expect(classDetails).toHaveProperty('hitDie');
      expect(classDetails).toHaveProperty('primaryAttributes');
      expect(classDetails).toHaveProperty('recommendedSkills');
      expect(classDetails).toHaveProperty('savingThrows');
      expect(classDetails).toHaveProperty('spellcasting');
      expect(classDetails).toHaveProperty('subclasses');
      expect(classDetails).toHaveProperty('featuresByLevel');

      expect(typeof classDetails.id).toBe('number');
      expect(typeof classDetails.name).toBe('string');
      expect(typeof classDetails.slug).toBe('string');
      expect(typeof classDetails.description).toBe('string');
      expect(typeof classDetails.role).toBe('string');
      expect(typeof classDetails.hitDie).toBe('number');
      expect(Array.isArray(classDetails.primaryAttributes)).toBe(true);
      expect(Array.isArray(classDetails.recommendedSkills)).toBe(true);
      expect(Array.isArray(classDetails.savingThrows)).toBe(true);
      expect(
        classDetails.spellcasting === null ||
          typeof classDetails.spellcasting === 'object',
      ).toBe(true);
      expect(Array.isArray(classDetails.subclasses)).toBe(true);
      expect(Array.isArray(classDetails.featuresByLevel)).toBe(true);
    });

    for (const progression of classDetails.featuresByLevel) {
      await test.step(
        `Validate class progression schema for level ${progression.level}`,
        async () => {
          expect(typeof progression.level).toBe('number');
          expect(progression.level).toBeLessThanOrEqual(characterLevel);
          expect(Array.isArray(progression.features)).toBe(true);
        },
      );

      for (const feature of progression.features) {
        await test.step(`Validate class feature schema for ${feature.name}`, async () => {
          expect(feature).toHaveProperty('name');
          expect(feature).toHaveProperty('description');
          expect(typeof feature.name).toBe('string');
          expect(typeof feature.description).toBe('string');
        });
      }
    }
  }

  async validateSpeciesDetailsSchema(speciesDetails: SpeciesDetail) {
    await test.step(
      `Validate species details schema for ${speciesDetails.name}`,
      async () => {
        expect(speciesDetails).toHaveProperty('id');
        expect(speciesDetails).toHaveProperty('name');
        expect(speciesDetails).toHaveProperty('slug');
        expect(speciesDetails).toHaveProperty('description');
        expect(speciesDetails).toHaveProperty('creatureType');
        expect(speciesDetails).toHaveProperty('size');
        expect(speciesDetails).toHaveProperty('speed');
        expect(speciesDetails).toHaveProperty('specialTraits');

        expect(typeof speciesDetails.id).toBe('number');
        expect(typeof speciesDetails.name).toBe('string');
        expect(typeof speciesDetails.slug).toBe('string');
        expect(typeof speciesDetails.description).toBe('string');
        expect(typeof speciesDetails.creatureType).toBe('string');
        expect(typeof speciesDetails.size).toBe('string');
        expect(typeof speciesDetails.speed).toBe('number');
        expect(Array.isArray(speciesDetails.specialTraits)).toBe(true);
      },
    );

    for (const trait of speciesDetails.specialTraits) {
      await test.step(
        `Validate species trait schema for ${trait.name}`,
        async () => {
          expect(trait).toHaveProperty('name');
          expect(trait).toHaveProperty('description');
          expect(typeof trait.name).toBe('string');
          expect(typeof trait.description).toBe('string');
        },
      );
    }
  }

  async validateBackgroundDetailsSchema(backgroundDetails: BackgroundDetail) {
    await test.step(
      `Validate background details schema for ${backgroundDetails.name}`,
      async () => {
        expect(backgroundDetails).toHaveProperty('id');
        expect(backgroundDetails).toHaveProperty('name');
        expect(backgroundDetails).toHaveProperty('slug');
        expect(backgroundDetails).toHaveProperty('description');
        expect(backgroundDetails).toHaveProperty('abilityScores');
        expect(backgroundDetails).toHaveProperty('feat');
        expect(backgroundDetails).toHaveProperty('skillProficiencies');
        expect(backgroundDetails).toHaveProperty('toolProficiency');
        expect(backgroundDetails).toHaveProperty('equipmentOptions');

        expect(typeof backgroundDetails.id).toBe('number');
        expect(typeof backgroundDetails.name).toBe('string');
        expect(typeof backgroundDetails.slug).toBe('string');
        expect(typeof backgroundDetails.description).toBe('string');
        expect(Array.isArray(backgroundDetails.abilityScores)).toBe(true);
        expect(typeof backgroundDetails.feat).toBe('string');
        expect(Array.isArray(backgroundDetails.skillProficiencies)).toBe(true);
        expect(
          backgroundDetails.toolProficiency === null ||
            typeof backgroundDetails.toolProficiency === 'string',
        ).toBe(true);
        expect(Array.isArray(backgroundDetails.equipmentOptions)).toBe(true);
      },
    );
  }

  async validateAbilityScoresSchema(abilityScores: CharacterAbilityScores) {
    await test.step('Validate ability scores schema', async () => {
      expect(abilityScores).toHaveProperty('STR');
      expect(abilityScores).toHaveProperty('DEX');
      expect(abilityScores).toHaveProperty('CON');
      expect(abilityScores).toHaveProperty('INT');
      expect(abilityScores).toHaveProperty('WIS');
      expect(abilityScores).toHaveProperty('CHA');

      expect(typeof abilityScores.STR).toBe('number');
      expect(typeof abilityScores.DEX).toBe('number');
      expect(typeof abilityScores.CON).toBe('number');
      expect(typeof abilityScores.INT).toBe('number');
      expect(typeof abilityScores.WIS).toBe('number');
      expect(typeof abilityScores.CHA).toBe('number');
    });
  }

  async validateResolvedAbilityScoresSchema(
    abilityScores: CharacterResolvedAbilityScores,
  ) {
    await test.step('Validate resolved ability scores schema', async () => {
      expect(abilityScores).toHaveProperty('base');
      expect(abilityScores).toHaveProperty('bonuses');
      expect(abilityScores).toHaveProperty('final');
    });

    await this.validateAbilityScoresSchema(abilityScores.base);
    await this.validateAbilityScoresSchema(abilityScores.bonuses);
    await this.validateAbilityScoresSchema(abilityScores.final);
  }

  async validateAbilityModifiersSchema(
    abilityModifiers: CharacterAbilityModifiers,
  ) {
    await test.step('Validate ability modifiers schema', async () => {
      expect(abilityModifiers).toHaveProperty('STR');
      expect(abilityModifiers).toHaveProperty('DEX');
      expect(abilityModifiers).toHaveProperty('CON');
      expect(abilityModifiers).toHaveProperty('INT');
      expect(abilityModifiers).toHaveProperty('WIS');
      expect(abilityModifiers).toHaveProperty('CHA');

      expect(typeof abilityModifiers.STR).toBe('number');
      expect(typeof abilityModifiers.DEX).toBe('number');
      expect(typeof abilityModifiers.CON).toBe('number');
      expect(typeof abilityModifiers.INT).toBe('number');
      expect(typeof abilityModifiers.WIS).toBe('number');
      expect(typeof abilityModifiers.CHA).toBe('number');
    });
  }

  async validateArmorClassSchema(armorClass: CharacterArmorClass) {
    await test.step('Validate armor class schema', async () => {
      expect(armorClass).toHaveProperty('total');
      expect(armorClass).toHaveProperty('base');
      expect(armorClass).toHaveProperty('dexModifierApplied');
      expect(armorClass).toHaveProperty('classBonus');
      expect(armorClass).toHaveProperty('shieldBonus');
      expect(armorClass).toHaveProperty('sources');

      expect(typeof armorClass.total).toBe('number');
      expect(typeof armorClass.base).toBe('number');
      expect(typeof armorClass.dexModifierApplied).toBe('number');
      expect(typeof armorClass.classBonus).toBe('number');
      expect(typeof armorClass.shieldBonus).toBe('number');
      expect(Array.isArray(armorClass.sources)).toBe(true);
    });

    for (const source of armorClass.sources) {
      await test.step(`Validate armor class source schema for ${source.name}`, async () => {
        expect(source).toHaveProperty('name');
        expect(source).toHaveProperty('type');
        expect(source).toHaveProperty('value');

        expect(typeof source.name).toBe('string');
        expect(['base', 'armor', 'shield', 'class']).toContain(source.type);
        expect(typeof source.value).toBe('number');
      });
    }
  }

  async validateArmorClass(
    armorClass: CharacterArmorClass,
    expectedArmorClass: CharacterArmorClass,
  ) {
    await test.step('Validate Armor Class', async () => {
      expect(armorClass).toEqual(expectedArmorClass);
    });

    await this.validateArmorClassSchema(armorClass);
  }

  async validateCurrencySchema(currency: CharacterCurrency) {
    await test.step('Validate currency schema', async () => {
      expect(currency).toHaveProperty('cp');
      expect(currency).toHaveProperty('sp');
      expect(currency).toHaveProperty('ep');
      expect(currency).toHaveProperty('gp');
      expect(currency).toHaveProperty('pp');

      expect(typeof currency.cp).toBe('number');
      expect(typeof currency.sp).toBe('number');
      expect(typeof currency.ep).toBe('number');
      expect(typeof currency.gp).toBe('number');
      expect(typeof currency.pp).toBe('number');
    });
  }

  async validateAbilityScoreRulesSchema(
    abilityScoreRules: CharacterResponseBody['abilityScoreRules'],
  ) {
    await test.step('Validate ability score rules schema', async () => {
      expect(abilityScoreRules).not.toBeNull();
      expect(abilityScoreRules).toHaveProperty('source');
      expect(abilityScoreRules).toHaveProperty('allowedChoices');
      expect(abilityScoreRules).toHaveProperty('bonusRules');

      expect(abilityScoreRules?.source).toBe('background');
      expect(Array.isArray(abilityScoreRules?.allowedChoices)).toBe(true);
      expect(
        abilityScoreRules?.bonusRules === null ||
          typeof abilityScoreRules?.bonusRules === 'object',
      ).toBe(true);
    });

    for (const allowedChoice of abilityScoreRules?.allowedChoices ?? []) {
      await test.step(
        `Validate ability score rule choice schema for ${allowedChoice}`,
        async () => {
          expect(typeof allowedChoice).toBe('string');
        },
      );
    }

    const bonusRules = abilityScoreRules?.bonusRules;

    if (bonusRules) {
      await test.step('Validate ability score bonus rules schema', async () => {
        expect(bonusRules).toHaveProperty('mode');
        expect(bonusRules).toHaveProperty('options');

        expect(bonusRules.mode).toBe('standard_background');
        expect(Array.isArray(bonusRules.options)).toBe(true);
      });

      for (const option of bonusRules.options) {
        await test.step(
          `Validate ability score bonus rule option schema for ${option.type}`,
          async () => {
            expect(option).toHaveProperty('type');
            expect(typeof option.type).toBe('string');

            if (option.type === 'plus2_plus1') {
              expect(option).toHaveProperty('choices');
              expect(Array.isArray(option.choices)).toBe(true);

              for (const choice of option.choices) {
                expect(choice).toHaveProperty('bonus');
                expect(choice).toHaveProperty('count');
                expect(typeof choice.bonus).toBe('number');
                expect(typeof choice.count).toBe('number');

                if (choice.mustBeDifferentFromBonus !== undefined) {
                  expect(typeof choice.mustBeDifferentFromBonus).toBe('number');
                }
              }
            }

            if (option.type === 'plus1_each_suggested') {
              expect(option).toHaveProperty('basedOn');
              expect(option.basedOn).toBe('abilityscores');
            }
          },
        );
      }
    }
  }

  async validateId(id: number, expectedId: number) {
    await test.step('Validate ID', async () => {
      expect(id).toBe(expectedId);
    });
  }

  async validateName(name: string, expectedName: string) {
    await test.step('Validate Name', async () => {
      expect(name).toBe(expectedName);
    });
  }

  async validateStatus(status: CharacterStatus, expectedStatus: CharacterStatus) {
    await test.step('Validate Status', async () => {
      expect(status).toBe(expectedStatus);
    });
  }

  async validateClassId(classId: number | null, expectedClassId: number | null) {
    await test.step('Validate Class ID', async () => {
      expect(classId).toBe(expectedClassId);
    });
  }

  async validateSpeciesId(
    speciesId: number | null,
    expectedSpeciesId: number | null,
  ) {
    await test.step('Validate Species ID', async () => {
      expect(speciesId).toBe(expectedSpeciesId);
    });
  }

  async validateBackgroundId(
    backgroundId: number | null,
    expectedBackgroundId: number | null,
  ) {
    await test.step('Validate Background ID', async () => {
      expect(backgroundId).toBe(expectedBackgroundId);
    });
  }

  async validateLevel(level: number, expectedLevel: number) {
    await test.step('Validate Level', async () => {
      expect(level).toBe(expectedLevel);
    });
  }

  async validateClassName(
    className: string | null,
    expectedClassName: string | null,
  ) {
    await test.step('Validate Class Name', async () => {
      expect(className).toBe(expectedClassName);
    });
  }

  async validateMissingFields(
    missingFields: CharacterResponseBody['missingFields'],
    expectedMissingFields: CharacterResponseBody['missingFields'],
  ) {
    await test.step('Validate Missing Fields', async () => {
      expect(missingFields).toEqual(expectedMissingFields);
    });
  }

  async validateAbilityScores(
    abilityScores: CharacterResponseBody['abilityScores'],
    expectedBaseAbilityScores: CharacterAbilityScores | null,
    expectedBonusAbilityScores?: CharacterAbilityScores,
  ) {
    await test.step('Validate Ability Scores', async () => {
      if (expectedBaseAbilityScores === null) {
        expect(abilityScores).toBeNull();

        return;
      }

      expect(abilityScores).not.toBeNull();
      expect(abilityScores?.base).toEqual(expectedBaseAbilityScores);
      expect(abilityScores?.bonuses).toEqual(
        expectedBonusAbilityScores ?? this.createEmptyAbilityScores(),
      );
      expect(abilityScores?.final).toEqual(
        this.addAbilityScores(
          expectedBaseAbilityScores,
          expectedBonusAbilityScores ?? this.createEmptyAbilityScores(),
        ),
      );
    });

    if (abilityScores) {
      await this.validateResolvedAbilityScoresSchema(abilityScores);
    }
  }

  async validateCurrency(
    currency: CharacterResponseBody['currency'],
    expectedCurrency: CharacterCurrency | null,
  ) {
    await test.step('Validate Currency', async () => {
      if (expectedCurrency === null) {
        expect(currency).toBeNull();

        return;
      }

      expect(currency).not.toBeNull();
      expect(currency).toEqual(expectedCurrency);
    });

    if (currency) {
      await this.validateCurrencySchema(currency);
    }
  }

  async validateSelectedAbilityScores(
    abilityScores: CharacterResolvedAbilityScores | null,
    expectedBaseAbilityScores: CharacterAbilityScores | null,
    expectedBonusAbilityScores?: CharacterAbilityScores,
  ) {
    await test.step('Validate Selected Ability Scores', async () => {
      if (expectedBaseAbilityScores === null) {
        expect(abilityScores).toBeNull();

        return;
      }

      expect(abilityScores).not.toBeNull();
      expect(abilityScores?.base).toEqual(expectedBaseAbilityScores);
      expect(abilityScores?.bonuses).toEqual(
        expectedBonusAbilityScores ?? this.createEmptyAbilityScores(),
      );
      expect(abilityScores?.final).toEqual(
        this.addAbilityScores(
          expectedBaseAbilityScores,
          expectedBonusAbilityScores ?? this.createEmptyAbilityScores(),
        ),
      );
    });

    if (abilityScores) {
      await this.validateResolvedAbilityScoresSchema(abilityScores);
    }
  }

  async validateAbilityScoreRules(
    abilityScoreRules: CharacterResponseBody['abilityScoreRules'],
    expectedAllowedChoices: string[] | null,
  ) {
    await test.step('Validate Ability Score Rules', async () => {
      if (expectedAllowedChoices === null) {
        expect(abilityScoreRules).toBeNull();

        return;
      }

      expect(abilityScoreRules).not.toBeNull();
      expect(abilityScoreRules?.source).toBe('background');
      expect(abilityScoreRules?.allowedChoices).toEqual(expectedAllowedChoices);
      expect(abilityScoreRules?.bonusRules).not.toBeNull();
      expect(abilityScoreRules?.bonusRules?.mode).toBe('standard_background');
      expect(abilityScoreRules?.bonusRules?.options).toHaveLength(2);
    });

    if (abilityScoreRules) {
      await this.validateAbilityScoreRulesSchema(abilityScoreRules);
    }

    const bonusRules = abilityScoreRules?.bonusRules;

    if (bonusRules) {
      await test.step('Validate Ability Score Bonus Rules', async () => {
        const plusTwoPlusOneOption = bonusRules.options.find(
          (option) => option.type === 'plus2_plus1',
        );
        const plusOneEachSuggestedOption = bonusRules.options.find(
          (option) => option.type === 'plus1_each_suggested',
        );

        expect(plusTwoPlusOneOption).toBeDefined();
        expect(plusOneEachSuggestedOption).toBeDefined();

        expect(plusTwoPlusOneOption).toEqual({
          type: 'plus2_plus1',
          choices: [
            { bonus: 2, count: 1 },
            { bonus: 1, count: 1, mustBeDifferentFromBonus: 2 },
          ],
        });

        expect(plusOneEachSuggestedOption).toEqual({
          type: 'plus1_each_suggested',
          basedOn: 'abilityscores',
        });
      });
    }
  }

  async validateSkillProficiencies(
    skillProficiencies: CharacterResponseBody['skillProficiencies'],
    expectedSkillProficiencies: string[],
  ) {
    await test.step('Validate Skill Proficiencies', async () => {
      expect(skillProficiencies).toEqual(expectedSkillProficiencies);
    });
  }

  async validateCharacterSkillCalculation(
    skills: CharacterSkillItem[],
    expected: {
      name: string;
      ability: string;
      isProficient: boolean;
      abilityModifier: number;
      level: number;
    },
  ) {
    await test.step(`Validate calculated skill for ${expected.name}`, async () => {
      const skill = skills.find((item) => item.name === expected.name);

      expect(skill).toBeDefined();
      expect(skill?.ability).toBe(expected.ability);
      expect(skill?.isProficient).toBe(expected.isProficient);
      expect(skill?.abilityModifier).toBe(expected.abilityModifier);

      const proficiencyBonus = expected.isProficient
        ? this.getProficiencyBonus(expected.level)
        : 0;

      expect(skill?.proficiencyBonus).toBe(proficiencyBonus);
      expect(skill?.total).toBe(expected.abilityModifier + proficiencyBonus);
    });
  }

  async validateClassDetailsPresence(
    classDetails: CharacterResponseBody['classDetails'],
    shouldExist: boolean,
  ) {
    await test.step('Validate Class Details Presence', async () => {
      if (shouldExist) {
        expect(classDetails).not.toBeNull();
      } else {
        expect(classDetails).toBeNull();
      }
    });
  }

  async validateSpeciesDetailsPresence(
    speciesDetails: CharacterResponseBody['speciesDetails'],
    shouldExist: boolean,
  ) {
    await test.step('Validate Species Details Presence', async () => {
      if (shouldExist) {
        expect(speciesDetails).not.toBeNull();
      } else {
        expect(speciesDetails).toBeNull();
      }
    });
  }

  async validateBackgroundDetailsPresence(
    backgroundDetails: CharacterResponseBody['backgroundDetails'],
    shouldExist: boolean,
  ) {
    await test.step('Validate Background Details Presence', async () => {
      if (shouldExist) {
        expect(backgroundDetails).not.toBeNull();
      } else {
        expect(backgroundDetails).toBeNull();
      }
    });
  }

  async validateErrorResponse(
    errorResponse: { error: string },
    expectedError: string,
  ) {
    await test.step('Validate error response schema', async () => {
      expect(errorResponse).toHaveProperty('error');
      expect(typeof errorResponse.error).toBe('string');
      expect(errorResponse.error).toBe(expectedError);
    });
  }

  async validateMessageResponse(
    responseBody: { message: string },
    expectedMessage: string,
  ) {
    await test.step('Validate message response schema', async () => {
      expect(responseBody).toHaveProperty('message');
      expect(typeof responseBody.message).toBe('string');
      expect(responseBody.message).toBe(expectedMessage);
    });
  }
}
