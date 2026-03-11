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

export interface Skill {
  id: number;
  name: SkillName;
  attribute: AttributeShortName;
}
