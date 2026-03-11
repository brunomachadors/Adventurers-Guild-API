import { Attribute } from "../types/attribute";


export const attributes: Attribute[] = [
  {
    id: 1,
    name: 'Strength',
    shortName: 'STR',
    description:
      'Measures physical power, carrying capacity, and effectiveness in brute-force actions such as lifting, pushing, and melee attacks.',
  },
  {
    id: 2,
    name: 'Dexterity',
    shortName: 'DEX',
    description:
      'Measures agility, reflexes, balance, and coordination. It affects actions that require speed, precision, and stealth.',
  },
  {
    id: 3,
    name: 'Constitution',
    shortName: 'CON',
    description:
      'Measures endurance, resilience, and physical toughness. It is commonly associated with health, stamina, and resistance to harm.',
  },
  {
    id: 4,
    name: 'Intelligence',
    shortName: 'INT',
    description:
      'Measures reasoning, memory, knowledge, and analytical ability. It is linked to learning, investigation, and logical thinking.',
  },
  {
    id: 5,
    name: 'Wisdom',
    shortName: 'WIS',
    description:
      'Measures perception, intuition, awareness, and good judgment. It reflects how well a character understands the world around them.',
  },
  {
    id: 6,
    name: 'Charisma',
    shortName: 'CHA',
    description:
      'Measures presence, confidence, influence, and social impact. It affects persuasion, leadership, and interpersonal interactions.',
  },
];