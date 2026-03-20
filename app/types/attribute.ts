import { SkillName } from './skill';

export type Attributeshortname = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export interface Attribute {
  id: number;
  name: string;
  shortname: Attributeshortname;
  description: string;
  skills: SkillName[];
}
