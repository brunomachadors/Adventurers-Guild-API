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
  subclasses: string[];
  levelprogression: ClassLevelProgressionItem[];
}
