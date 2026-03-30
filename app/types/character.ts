import { Attributeshortname } from './attribute';
import { SkillName } from './skill';

export type CharacterStatus = 'draft' | 'complete';

export type CharacterMissingField =
  | 'classId'
  | 'speciesId'
  | 'backgroundId';

export interface CharacterClassFeatureItem {
  name: string;
  description: string;
}

export interface CharacterClassProgressionItem {
  level: number;
  features: CharacterClassFeatureItem[];
}

export interface CharacterClassDetails {
  id: number;
  name: string;
  slug: string;
  description: string;
  role: string;
  hitDie: number;
  primaryAttributes: string[];
  recommendedSkills: string[];
  savingThrows: string[];
  spellcasting: Record<string, unknown> | null;
  subclasses: string[];
  featuresByLevel: CharacterClassProgressionItem[];
}

export interface CharacterAbilityScores {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

export interface CharacterAbilityScoresInput {
  base: CharacterAbilityScores;
  bonuses: CharacterAbilityScores;
}

export interface CharacterResolvedAbilityScores {
  base: CharacterAbilityScores;
  bonuses: CharacterAbilityScores;
  final: CharacterAbilityScores;
}

export interface CharacterAbilityModifiers {
  STR: number;
  DEX: number;
  CON: number;
  INT: number;
  WIS: number;
  CHA: number;
}

export interface CharacterAbilityScoreBonusChoice {
  bonus: number;
  count: number;
  mustBeDifferentFromBonus?: number;
}

export interface CharacterAbilityScoreRuleOptionPlusTwoPlusOne {
  type: 'plus2_plus1';
  choices: CharacterAbilityScoreBonusChoice[];
}

export interface CharacterAbilityScoreRuleOptionPlusOneEachSuggested {
  type: 'plus1_each_suggested';
  basedOn: 'abilityscores';
}

export type CharacterAbilityScoreRuleOption =
  | CharacterAbilityScoreRuleOptionPlusTwoPlusOne
  | CharacterAbilityScoreRuleOptionPlusOneEachSuggested;

export interface CharacterAbilityScoreBonusRules {
  mode: 'standard_background';
  options: CharacterAbilityScoreRuleOption[];
}

export interface CharacterAbilityScoreRules {
  source: 'background';
  allowedChoices: Attributeshortname[];
  bonusRules: CharacterAbilityScoreBonusRules | null;
}

export interface CharacterCreateRequestBody {
  name: string;
  classId?: number | null;
  speciesId?: number | null;
  backgroundId?: number | null;
  level?: number | null;
  abilityScores?: CharacterAbilityScoresInput | null;
  skillProficiencies?: SkillName[];
}

export interface CharacterUpdateRequestBody {
  name?: string;
  classId?: number | null;
  speciesId?: number | null;
  backgroundId?: number | null;
  level?: number | null;
  abilityScores?: CharacterAbilityScoresInput | null;
  skillProficiencies?: SkillName[];
}

export interface CharacterListItem {
  id: number;
  name: string;
  status: CharacterStatus;
  level: number;
}

export interface CharacterResponseBody {
  id: number;
  name: string;
  status: CharacterStatus;
  classId: number | null;
  speciesId: number | null;
  backgroundId: number | null;
  level: number;
  missingFields: CharacterMissingField[];
  abilityScores: CharacterResolvedAbilityScores | null;
  abilityModifiers: CharacterAbilityModifiers | null;
  skillProficiencies: SkillName[];
  abilityScoreRules: CharacterAbilityScoreRules | null;
  classDetails?: CharacterClassDetails | null;
  speciesDetails?: import('./species').SpeciesDetail | null;
  backgroundDetails?: import('./background').BackgroundDetail | null;
}

export interface CharacterSpellOptionItem {
  id: number;
  name: string;
  level: number;
  levelLabel: string;
}

export interface CharacterSpellOptionsResponseBody {
  characterId: number;
  classId: number | null;
  className: string | null;
  spells: CharacterSpellOptionItem[];
}

export type CharacterSpellSelectionType = 'known' | 'prepared' | 'cantrip';

export interface CharacterSpellSelectionRule {
  canSelectSpells: boolean;
  selectionType: CharacterSpellSelectionType | null;
  maxCantrips: number;
  maxSpells: number;
}

export interface CharacterSelectedSpellItem extends CharacterSpellOptionItem {
  selectionType: CharacterSpellSelectionType;
}

export interface CharacterSpellSelectionResponseBody {
  characterId: number;
  classId: number | null;
  className: string | null;
  level: number;
  selectionRules: CharacterSpellSelectionRule;
  selectedSpells: CharacterSelectedSpellItem[];
  availableSpells: CharacterSpellOptionItem[];
}

export interface CharacterSpellSelectionUpdateRequestBody {
  spellIds: number[];
}

export interface CharacterAbilityScoreOptionsResponseBody {
  characterId: number;
  backgroundId: number | null;
  backgroundName: string | null;
  selectionRules: CharacterAbilityScoreRules | null;
  selectedAbilityScores: CharacterResolvedAbilityScores | null;
  availableChoices: Attributeshortname[];
}

export interface CharacterAbilityScoresUpdateRequestBody {
  abilityScores: CharacterAbilityScoresInput;
}

export interface CharacterSkillItem {
  name: SkillName;
  ability: Attributeshortname;
  isProficient: boolean;
  abilityModifier: number;
  proficiencyBonus: number;
  total: number;
}
