import { Attributeshortname } from './attribute';
import { SkillName } from './skill';

export type ClassRole = 'melee' | 'caster' | 'support' | 'stealth' | 'hybrid';

export interface ClassListItem {
  id: number;
  name: string;
}

export interface ClassDetail {
  id: number;
  name: string;
  primaryAttributes: Attributeshortname[];
  recommendedSkills: SkillName[];
  hitDie: number;
  role: ClassRole;
  description: string;
}
