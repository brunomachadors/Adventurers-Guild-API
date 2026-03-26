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

export interface CharacterCreateRequestBody {
  name: string;
  classId?: number | null;
  speciesId?: number | null;
  backgroundId?: number | null;
  level?: number | null;
}

export interface CharacterUpdateRequestBody {
  name?: string;
  classId?: number | null;
  speciesId?: number | null;
  backgroundId?: number | null;
  level?: number | null;
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
  classDetails?: CharacterClassDetails | null;
  speciesDetails?: import('./species').SpeciesDetail | null;
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
