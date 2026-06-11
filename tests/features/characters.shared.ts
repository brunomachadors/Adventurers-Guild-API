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
import { APIRequestContext, expect } from '@playwright/test';

import { AuthClient } from '../clients/auth.client';
import { CharactersClient } from '../clients/characters.client';
import { EquipmentClient } from '../clients/equipment.client';
import { AuthAssert } from '../helpers/auth.assertions';
import { CharactersAssert } from '../helpers/characters.assertions';
import { getTestAuthCredentials } from '../helpers/test-auth-env';
import { expectedDetailedBackgrounds } from '../data/backgrounds.expected';
import { expectedDetailedClasses } from '../data/classes.expected';
import { expectedDetailedSpecies } from '../data/species.expected';

export const barbarianAbilityScores: CharacterAbilityScores = {
  STR: 15,
  DEX: 13,
  CON: 14,
  INT: 8,
  WIS: 12,
  CHA: 10,
};

export const wizardAbilityScores: CharacterAbilityScores = {
  STR: 8,
  DEX: 14,
  CON: 13,
  INT: 15,
  WIS: 12,
  CHA: 10,
};

export const paladinAbilityScores: CharacterAbilityScores = {
  STR: 15,
  DEX: 10,
  CON: 13,
  INT: 8,
  WIS: 12,
  CHA: 14,
};

export const aangAbilityScores: CharacterAbilityScores = {
  STR: 10,
  DEX: 15,
  CON: 14,
  INT: 8,
  WIS: 15,
  CHA: 12,
};

export const drizztAbilityScores: CharacterAbilityScores = {
  STR: 10,
  DEX: 15,
  CON: 13,
  INT: 8,
  WIS: 14,
  CHA: 12,
};

export const gimliAbilityScores: CharacterAbilityScores = {
  STR: 15,
  DEX: 13,
  CON: 14,
  INT: 8,
  WIS: 12,
  CHA: 10,
};

export const yenneferAbilityScores: CharacterAbilityScores = {
  STR: 8,
  DEX: 14,
  CON: 15,
  INT: 12,
  WIS: 10,
  CHA: 15,
};

export const casterCoverageAbilityScores: CharacterAbilityScores = {
  STR: 8,
  DEX: 14,
  CON: 13,
  INT: 12,
  WIS: 15,
  CHA: 15,
};

export const barbarianAbilityBonuses: CharacterAbilityScores = {
  STR: 1,
  DEX: 1,
  CON: 1,
  INT: 0,
  WIS: 0,
  CHA: 0,
};

export const wizardAbilityBonuses: CharacterAbilityScores = {
  STR: 0,
  DEX: 0,
  CON: 1,
  INT: 1,
  WIS: 1,
  CHA: 0,
};

export const paladinAbilityBonuses: CharacterAbilityScores = {
  STR: 1,
  DEX: 0,
  CON: 0,
  INT: 1,
  WIS: 0,
  CHA: 1,
};

export const aangAbilityBonuses: CharacterAbilityScores = {
  STR: 0,
  DEX: 0,
  CON: 0,
  INT: 1,
  WIS: 1,
  CHA: 1,
};

export const drizztAbilityBonuses: CharacterAbilityScores = {
  STR: 1,
  DEX: 1,
  CON: 1,
  INT: 0,
  WIS: 0,
  CHA: 0,
};

export const drizztPlusTwoPlusOneAbilityBonuses: CharacterAbilityScores = {
  STR: 0,
  DEX: 2,
  CON: 1,
  INT: 0,
  WIS: 0,
  CHA: 0,
};

export const gimliAbilityBonuses: CharacterAbilityScores = {
  STR: 1,
  DEX: 1,
  CON: 1,
  INT: 0,
  WIS: 0,
  CHA: 0,
};

export const yenneferAbilityBonuses: CharacterAbilityScores = {
  STR: 0,
  DEX: 0,
  CON: 0,
  INT: 1,
  WIS: 1,
  CHA: 1,
};

export const casterCoverageAbilityBonuses: CharacterAbilityScores = {
  STR: 0,
  DEX: 0,
  CON: 0,
  INT: 1,
  WIS: 1,
  CHA: 1,
};

export const bilboAbilityScores: CharacterAbilityScores = {
  STR: 8,
  DEX: 15,
  CON: 13,
  INT: 12,
  WIS: 10,
  CHA: 14,
};

export const bilboAbilityBonuses: CharacterAbilityScores = {
  STR: 0,
  DEX: 1,
  CON: 1,
  INT: 1,
  WIS: 0,
  CHA: 0,
};

export const barbarianAbilityScoresInput: CharacterAbilityScoresInput = {
  base: barbarianAbilityScores,
  bonuses: barbarianAbilityBonuses,
};

export const wizardAbilityScoresInput: CharacterAbilityScoresInput = {
  base: wizardAbilityScores,
  bonuses: wizardAbilityBonuses,
};

export const paladinAbilityScoresInput: CharacterAbilityScoresInput = {
  base: paladinAbilityScores,
  bonuses: paladinAbilityBonuses,
};

export const aangAbilityScoresInput: CharacterAbilityScoresInput = {
  base: aangAbilityScores,
  bonuses: aangAbilityBonuses,
};

export const drizztAbilityScoresInput: CharacterAbilityScoresInput = {
  base: drizztAbilityScores,
  bonuses: drizztAbilityBonuses,
};

export const gimliAbilityScoresInput: CharacterAbilityScoresInput = {
  base: gimliAbilityScores,
  bonuses: gimliAbilityBonuses,
};

export const yenneferAbilityScoresInput: CharacterAbilityScoresInput = {
  base: yenneferAbilityScores,
  bonuses: yenneferAbilityBonuses,
};

export const casterCoverageAbilityScoresInput: CharacterAbilityScoresInput = {
  base: casterCoverageAbilityScores,
  bonuses: casterCoverageAbilityBonuses,
};

export const bilboAbilityScoresInput: CharacterAbilityScoresInput = {
  base: bilboAbilityScores,
  bonuses: bilboAbilityBonuses,
};

export const patchedCurrency: CharacterCurrency = {
  cp: 10,
  sp: 4,
  ep: 0,
  gp: 25,
  pp: 1,
};

export const soldierCurrency: CharacterCurrency = {
  cp: 0,
  sp: 0,
  ep: 0,
  gp: 29,
  pp: 0,
};

export const sageCurrency: CharacterCurrency = {
  cp: 0,
  sp: 0,
  ep: 0,
  gp: 8,
  pp: 0,
};

export const nobleCurrency: CharacterCurrency = {
  cp: 0,
  sp: 0,
  ep: 0,
  gp: 29,
  pp: 0,
};

export const acolyteCurrency: CharacterCurrency = {
  cp: 0,
  sp: 0,
  ep: 0,
  gp: 8,
  pp: 0,
};

export const barbarianArmorClass: CharacterArmorClass = {
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

export const wizardArmorClass: CharacterArmorClass = {
  total: 12,
  base: 10,
  dexModifierApplied: 2,
  classBonus: 0,
  shieldBonus: 0,
  sources: [{ name: 'Base AC', type: 'base', value: 10 }],
};

export const paladinArmorClass: CharacterArmorClass = {
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

export const aangArmorClass: CharacterArmorClass = {
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

export const barbarianHitPoints: CharacterHitPoints = {
  max: 14,
  current: 14,
  temporary: 0,
  hitDie: 12,
  conModifier: 2,
  calculation: '12 + 2',
};

export const monkHitPoints: CharacterHitPoints = {
  max: 10,
  current: 10,
  temporary: 0,
  hitDie: 8,
  conModifier: 2,
  calculation: '8 + 2',
};

export const paladinHitPoints: CharacterHitPoints = {
  max: 25,
  current: 25,
  temporary: 0,
  hitDie: 10,
  conModifier: 1,
  calculation: '10 + 1 + (2 * (6 + 1))',
};

export const wizardHitPoints: CharacterHitPoints = {
  max: 8,
  current: 8,
  temporary: 0,
  hitDie: 6,
  conModifier: 2,
  calculation: '6 + 2',
};

export const fighterHitPoints: CharacterHitPoints = {
  max: 12,
  current: 12,
  temporary: 0,
  hitDie: 10,
  conModifier: 2,
  calculation: '10 + 2',
};

export const sorcererHitPoints: CharacterHitPoints = {
  max: 8,
  current: 8,
  temporary: 0,
  hitDie: 6,
  conModifier: 2,
  calculation: '6 + 2',
};

export const barbarianSkillProficiencies: SkillName[] = [
  'Athletics',
  'Intimidation',
  'Insight',
  'Perception',
  'Survival',
];

export const wizardSkillProficiencies: SkillName[] = [
  'Arcana',
  'History',
  'Insight',
  'Investigation',
  'Religion',
];

export const wizardBaseSkillProficienciesWithoutSpecies: SkillName[] = [
  'Arcana',
  'History',
  'Investigation',
  'Religion',
];

export const humanSelectedSpeciesSkillProficiencies: SkillName[] = ['Insight'];

export const elfSelectedSpeciesSkillProficiencies: SkillName[] = ['Insight'];

export const elfSelectedSpeciesChoices = {
  'elven-lineage': 'high-elf',
};

export const drowSelectedSpeciesSkillProficiencies: SkillName[] = ['Perception'];

export const drowSelectedSpeciesChoices = {
  'elven-lineage': 'drow',
};

export const dragonbornSelectedSpeciesChoices = {
  'draconic-ancestry': 'blue-dragon-ancestry',
};

export const gnomeSelectedSpeciesChoices = {
  'gnomish-lineage': 'forest-gnome',
};

export const goliathSelectedSpeciesChoices = {
  'giant-ancestry': 'storm-giant-ancestry',
};

export const tieflingSelectedSpeciesChoices = {
  'fiendish-legacy': 'infernal-legacy',
};

export const monkExtraSkillProficiencies: SkillName[] = ['Acrobatics', 'Stealth'];

export const monkSkillProficiencies: SkillName[] = [
  ...(expectedDetailedBackgrounds.acolyte.skillProficiencies as SkillName[]),
  ...monkExtraSkillProficiencies,
];

export const paladinExtraSkillProficiencies: SkillName[] = ['Athletics', 'Insight'];

export const paladinSkillProficiencies: SkillName[] = [
  ...(expectedDetailedBackgrounds.noble.skillProficiencies as SkillName[]),
  ...paladinExtraSkillProficiencies,
];

export const rangerExtraSkillProficiencies: SkillName[] = [
  'Perception',
  'Stealth',
  'Survival',
];

export const rangerSkillProficiencies: SkillName[] = [
  ...(expectedDetailedBackgrounds.soldier.skillProficiencies as SkillName[]),
  ...rangerExtraSkillProficiencies,
];

export const fighterBaseSkillProficienciesWithoutSpecies: SkillName[] = [
  'Athletics',
  'Intimidation',
  'Perception',
  'Survival',
];

export const rogueExtraSkillProficiencies: SkillName[] = [
  'Acrobatics',
  'Athletics',
  'Perception',
  'Persuasion',
];

export const rogueSkillProficiencies: SkillName[] = [
  ...(expectedDetailedBackgrounds.criminal.skillProficiencies as SkillName[]),
  ...rogueExtraSkillProficiencies,
];

export const fighterExtraSkillProficiencies: SkillName[] = [
  'Perception',
  'Survival',
];

export const fighterSkillProficiencies: SkillName[] = [
  ...(expectedDetailedBackgrounds.soldier.skillProficiencies as SkillName[]),
  ...fighterExtraSkillProficiencies,
];

export async function issueDemoToken(request: APIRequestContext) {
  const authCredentials = getTestAuthCredentials();
  const authClient = new AuthClient(request);
  const authAssert = new AuthAssert();

  const tokenResponse = await authClient.issueToken(authCredentials);

  await authAssert.success(tokenResponse);

  const tokenBody: TokenResponseBody = await tokenResponse.json();

  await authAssert.validateTokenResponse(tokenBody);

  return tokenBody.token;
}

export async function addCharacterEquipmentBySlug(
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

