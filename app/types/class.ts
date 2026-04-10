import { Attributeshortname } from './attribute';
import { SkillName } from './skill';

export type ClassRole = 'melee' | 'caster' | 'support' | 'stealth' | 'hybrid';

export interface ClassListItem {
  id: number;
  name: string;
}

export interface ClassFeatureItem {
  name: string;
  description: string;
}

export interface ClassLevelProgressionItem {
  level: number;
  features: ClassFeatureItem[];
}

export interface ClassSpellcasting {
  ability: Attributeshortname;
  usesSpellbook?: boolean;
  canCastRituals?: boolean;
  selection?: ClassSpellSelection;
}

export type ClassSpellSelectionType = 'known' | 'prepared';

export interface ClassSpellSelection {
  selectionType: ClassSpellSelectionType;
  cantrips?: Record<string, number>;
  spells?: Record<string, number>;
  preparedSpells?: Record<string, number>;
  spellbookSpells?: Record<string, number>;
  spellsAddedPerLevel?: number;
  mode?: string;
  changesWhen?: string;
}

export interface ClassSkillProficiencyChoices {
  choose: number;
  options: SkillName[];
}

export interface ClassStartingEquipmentOption {
  label: string | null;
  items: string[];
}

export interface ClassDetail {
  id: number;
  name: string;
  slug: string;
  primaryattributes: Attributeshortname[];
  recommendedskills: SkillName[];
  savingthrows: Attributeshortname[];
  hitdie: number;
  role: ClassRole;
  description: string;
  spellcasting: ClassSpellcasting | null;
  skillProficiencyChoices: ClassSkillProficiencyChoices;
  weaponProficiencies: string[];
  armorTraining: string[];
  startingEquipmentOptions: ClassStartingEquipmentOption[];
  equipmentOptions: string[];
  subclasses: string[];
  levelprogression: ClassLevelProgressionItem[];
}
