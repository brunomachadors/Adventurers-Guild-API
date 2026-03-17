import { Attribute } from '@/app/types/attribute';

export const expectedAttributes: Attribute[] = [
  {
    id: 1,
    name: 'Strength',
    shortName: 'STR',
    description:
      'Measures physical power, carrying capacity, and effectiveness in brute-force actions such as lifting, pushing, and melee attacks.',
    skills: ['Athletics'],
  },
  {
    id: 2,
    name: 'Dexterity',
    shortName: 'DEX',
    description:
      'Measures agility, reflexes, balance, and coordination. It affects actions that require speed, precision, and stealth.',
    skills: ['Acrobatics', 'Sleight of Hand', 'Stealth'],
  },
  {
    id: 3,
    name: 'Constitution',
    shortName: 'CON',
    description:
      'Measures endurance, resilience, and physical toughness. It is commonly associated with health, stamina, and resistance to harm.',
    skills: [],
  },
  {
    id: 4,
    name: 'Intelligence',
    shortName: 'INT',
    description:
      'Measures reasoning, memory, knowledge, and analytical ability. It is linked to learning, investigation, and logical thinking.',
    skills: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'],
  },
  {
    id: 5,
    name: 'Wisdom',
    shortName: 'WIS',
    description:
      'Measures perception, intuition, awareness, and good judgment. It reflects how well a character understands the world around them.',
    skills: [
      'Animal Handling',
      'Insight',
      'Medicine',
      'Perception',
      'Survival',
    ],
  },
  {
    id: 6,
    name: 'Charisma',
    shortName: 'CHA',
    description:
      'Measures presence, confidence, influence, and social impact. It affects persuasion, leadership, and interpersonal interactions.',
    skills: ['Deception', 'Intimidation', 'Performance', 'Persuasion'],
  },
];
