import { Attributeshortname } from './attribute';

export const SKILL_NAMES = [
  'Athletics',
  'Acrobatics',
  'Sleight of Hand',
  'Stealth',
  'Arcana',
  'History',
  'Investigation',
  'Nature',
  'Religion',
  'Animal Handling',
  'Insight',
  'Medicine',
  'Perception',
  'Survival',
  'Deception',
  'Intimidation',
  'Performance',
  'Persuasion',
] as const;

export type SkillName = (typeof SKILL_NAMES)[number];

export interface SkillListItem {
  id: number;
  name: SkillName;
}

export interface SkillDetail {
  id: number;
  name: SkillName;
  attribute: Attributeshortname;
  description: string;
  exampleofuse: string;
  commonclasses: string[];
}
