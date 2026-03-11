import { Skill } from './skill';

export interface Attribute {
  id: number;
  name: string;
  shortName: AttributeShortName;
  description: string;
  skills: Skill[];
}

export type AttributeShortName = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
