import { SkillName } from './skill';

export type AttributeShortName = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';

export interface Attribute {
  id: number;
  name: string;
  shortName: AttributeShortName;
  description: string;
  skills: SkillName[];
}
