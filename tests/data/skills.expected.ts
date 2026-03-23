import { SkillDetail, SkillListItem } from '@/app/types/skill';

export const expectedSkillsList: SkillListItem[] = [
  { id: 1, name: 'Athletics' },
  { id: 2, name: 'Acrobatics' },
  { id: 3, name: 'Sleight of Hand' },
  { id: 4, name: 'Stealth' },
  { id: 5, name: 'Arcana' },
  { id: 6, name: 'History' },
  { id: 7, name: 'Investigation' },
  { id: 8, name: 'Nature' },
  { id: 9, name: 'Religion' },
  { id: 10, name: 'Animal Handling' },
  { id: 11, name: 'Insight' },
  { id: 12, name: 'Medicine' },
  { id: 13, name: 'Perception' },
  { id: 14, name: 'Survival' },
  { id: 15, name: 'Deception' },
  { id: 16, name: 'Intimidation' },
  { id: 17, name: 'Performance' },
  { id: 18, name: 'Persuasion' },
];

export const expectedDetailedSkills: Record<string, SkillDetail> = {
  athletics: {
    id: 1,
    name: 'Athletics',
    attribute: 'STR',
    description:
      'Represents physical capability in actions such as climbing, jumping, swimming, or forcing objects through strength.',
    exampleofuse:
      'Used when a character tries to climb a castle wall or force open a heavy gate.',
    commonclasses: ['Fighter', 'Barbarian', 'Paladin', 'Ranger'],
  },
  stealth: {
    id: 4,
    name: 'Stealth',
    attribute: 'DEX',
    description: 'Represents the ability to move silently and remain unseen.',
    exampleofuse: 'Used when sneaking past enemies or hiding.',
    commonclasses: ['Rogue', 'Ranger', 'Monk', 'Bard'],
  },
  'animal-handling': {
    id: 10,
    name: 'Animal Handling',
    attribute: 'WIS',
    description: 'Represents the ability to calm and control animals.',
    exampleofuse: 'Used when calming or directing animals.',
    commonclasses: ['Ranger', 'Druid', 'Barbarian'],
  },
};
