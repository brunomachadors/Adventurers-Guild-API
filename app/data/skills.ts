import { SkillDetail } from '../types/skill';

export const skills: SkillDetail[] = [
  {
    id: 1,
    name: 'Athletics',
    attribute: 'STR',
    description:
      'Represents physical capability in actions such as climbing, jumping, swimming, or forcing objects through strength.',
    exampleofuse:
      'Used when a character tries to climb a castle wall or force open a heavy gate.',
    commonclasses: ['Fighter', 'Barbarian', 'Paladin'],
  },
  {
    id: 2,
    name: 'Acrobatics',
    attribute: 'DEX',
    description:
      'Represents agility, balance, and coordination in movements that require body control.',
    exampleofuse:
      'Used when a character tries to keep balance on a narrow ledge or move safely across unstable terrain.',
    commonclasses: ['Rogue', 'Monk', 'Bard'],
  },
  {
    id: 3,
    name: 'Sleight of Hand',
    attribute: 'DEX',
    description:
      'Represents fine motor control and precision when manipulating objects quickly or discreetly.',
    exampleofuse:
      'Used when a character tries to pick a pocket or hide a small object in their sleeve.',
    commonclasses: ['Rogue', 'Bard'],
  },
  {
    id: 4,
    name: 'Stealth',
    attribute: 'DEX',
    description:
      'Represents the ability to move silently, remain unseen, and avoid detection.',
    exampleofuse:
      'Used when a character sneaks past guards or hides in the shadows.',
    commonclasses: ['Rogue', 'Ranger', 'Monk'],
  },
  {
    id: 5,
    name: 'Arcana',
    attribute: 'INT',
    description:
      'Represents knowledge about magic, spells, mystical traditions, and supernatural phenomena.',
    exampleofuse:
      'Used when a character tries to identify a magical rune or understand an enchanted artifact.',
    commonclasses: ['Wizard', 'Warlock', 'Sorcerer'],
  },
  {
    id: 6,
    name: 'History',
    attribute: 'INT',
    description:
      'Represents knowledge of historical events, ancient kingdoms, wars, legends, and notable figures.',
    exampleofuse:
      'Used when a character tries to remember details about a forgotten empire or an old battle.',
    commonclasses: ['Wizard', 'Cleric', 'Bard'],
  },
  {
    id: 7,
    name: 'Investigation',
    attribute: 'INT',
    description:
      'Represents the ability to analyze clues, inspect details, and draw conclusions from evidence.',
    exampleofuse:
      'Used when a character searches a room for hidden mechanisms or studies footprints.',
    commonclasses: ['Rogue', 'Wizard', 'Bard'],
  },
  {
    id: 8,
    name: 'Nature',
    attribute: 'INT',
    description:
      'Represents knowledge of terrain, plants, animals, weather, and natural ecosystems.',
    exampleofuse:
      'Used when a character identifies a poisonous plant or recalls information about a wild beast.',
    commonclasses: ['Druid', 'Ranger', 'Wizard'],
  },
  {
    id: 9,
    name: 'Religion',
    attribute: 'INT',
    description:
      'Represents knowledge of deities, sacred rites, divine symbols, and religious traditions.',
    exampleofuse:
      'Used when a character tries to recognize a holy symbol or understand a ritual.',
    commonclasses: ['Cleric', 'Paladin', 'Wizard'],
  },
  {
    id: 10,
    name: 'Animal Handling',
    attribute: 'WIS',
    description:
      'Represents the ability to calm, guide, or control animals through intuition and experience.',
    exampleofuse:
      'Used when a character tries to calm a frightened horse or direct a beast companion.',
    commonclasses: ['Ranger', 'Druid'],
  },
  {
    id: 11,
    name: 'Insight',
    attribute: 'WIS',
    description:
      'Represents the ability to read emotions, intentions, and hidden motives in others.',
    exampleofuse:
      'Used when a character tries to determine whether someone is lying or hiding something.',
    commonclasses: ['Cleric', 'Monk', 'Bard'],
  },
  {
    id: 12,
    name: 'Medicine',
    attribute: 'WIS',
    description:
      'Represents practical knowledge of injuries, illnesses, and emergency treatment.',
    exampleofuse:
      'Used when a character stabilizes a wounded ally or examines symptoms of a disease.',
    commonclasses: ['Cleric', 'Druid'],
  },
  {
    id: 13,
    name: 'Perception',
    attribute: 'WIS',
    description:
      'Represents awareness of surroundings and the ability to notice details, danger, or hidden elements.',
    exampleofuse:
      'Used when a character tries to hear footsteps behind a door or spot a hidden trap.',
    commonclasses: ['Ranger', 'Cleric', 'Druid'],
  },
  {
    id: 14,
    name: 'Survival',
    attribute: 'WIS',
    description:
      'Represents practical knowledge for enduring and navigating harsh environments.',
    exampleofuse:
      'Used when a character tracks a creature, finds food in the wild, or predicts weather conditions.',
    commonclasses: ['Ranger', 'Druid', 'Barbarian'],
  },
  {
    id: 15,
    name: 'Deception',
    attribute: 'CHA',
    description:
      'Represents the ability to mislead others through lies, disguise, or manipulation.',
    exampleofuse:
      'Used when a character tries to bluff a guard or hide their true intentions.',
    commonclasses: ['Bard', 'Rogue', 'Warlock'],
  },
  {
    id: 16,
    name: 'Intimidation',
    attribute: 'CHA',
    description:
      'Represents the ability to influence others through fear, pressure, or overwhelming presence.',
    exampleofuse:
      'Used when a character threatens an enemy or forces cooperation through presence.',
    commonclasses: ['Barbarian', 'Paladin', 'Warlock'],
  },
  {
    id: 17,
    name: 'Performance',
    attribute: 'CHA',
    description:
      'Represents skill in entertaining or expressing through music, acting, storytelling, or other performance arts.',
    exampleofuse:
      'Used when a character sings in a tavern or performs to impress an audience.',
    commonclasses: ['Bard'],
  },
  {
    id: 18,
    name: 'Persuasion',
    attribute: 'CHA',
    description:
      'Represents the ability to influence others through diplomacy, tact, and social confidence.',
    exampleofuse:
      'Used when a character negotiates a deal or convinces a noble to offer assistance.',
    commonclasses: ['Bard', 'Paladin', 'Warlock'],
  },
];
