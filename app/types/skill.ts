import { AttributeShortName } from './attribute';

export type SkillName =
  | 'Athletics'
  | 'Acrobatics'
  | 'Sleight of Hand'
  | 'Stealth'
  | 'Arcana'
  | 'History'
  | 'Investigation'
  | 'Nature'
  | 'Religion'
  | 'Animal Handling'
  | 'Insight'
  | 'Medicine'
  | 'Perception'
  | 'Survival'
  | 'Deception'
  | 'Intimidation'
  | 'Performance'
  | 'Persuasion';

export interface SkillListItem {
  id: number;
  name: SkillName;
}

export interface SkillDetail {
  id: number;
  name: SkillName;
  attribute: AttributeShortName;
  description: string;
  exampleOfUse: string;
  commonClasses: string[];
}
