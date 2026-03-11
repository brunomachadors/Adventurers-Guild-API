import { SkillDetail } from '../types/skill';

export const skills: SkillDetail[] = [
  {
    id: 1,
    name: 'Athletics',
    attribute: 'STR',
    description:
      'Represents physical capability in actions such as climbing, jumping, swimming, or forcing objects through strength.',
    exampleOfUse:
      'Used when a character tries to climb a castle wall or force open a heavy gate.',
    commonClasses: ['Fighter', 'Barbarian', 'Paladin'],
  },
  {
    id: 2,
    name: 'Acrobatics',
    attribute: 'DEX',
    description:
      'Represents agility, balance, and coordination in movements that require body control.',
    exampleOfUse:
      'Used when a character tries to keep balance on a narrow ledge or move safely across unstable terrain.',
    commonClasses: ['Rogue', 'Monk', 'Bard'],
  },
  {
    id: 3,
    name: 'Sleight of Hand',
    attribute: 'DEX',
    description:
      'Represents fine motor control and precision when manipulating objects quickly or discreetly.',
    exampleOfUse:
      'Used when a character tries to pick a pocket or hide a small object in their sleeve.',
    commonClasses: ['Rogue', 'Bard'],
  },
  {
    id: 4,
    name: 'Stealth',
    attribute: 'DEX',
    description:
      'Represents the ability to move silently, remain unseen, and avoid detection.',
    exampleOfUse:
      'Used when a character sneaks past guards or hides in the shadows.',
    commonClasses: ['Rogue', 'Ranger', 'Monk'],
  },
  {
    id: 5,
    name: 'Arcana',
    attribute: 'INT',
    description:
      'Represents knowledge about magic, spells, mystical traditions, and supernatural phenomena.',
    exampleOfUse:
      'Used when a character tries to identify a magical rune or understand an enchanted artifact.',
    commonClasses: ['Wizard', 'Warlock', 'Sorcerer'],
  },
  {
    id: 6,
    name: 'History',
    attribute: 'INT',
    description:
      'Represents knowledge of historical events, ancient kingdoms, wars, legends, and notable figures.',
    exampleOfUse:
      'Used when a character tries to remember details about a forgotten empire or an old battle.',
    commonClasses: ['Wizard', 'Cleric', 'Bard'],
  },
  {
    id: 7,
    name: 'Investigation',
    attribute: 'INT',
    description:
      'Represents the ability to analyze clues, inspect details, and draw conclusions from evidence.',
    exampleOfUse:
      'Used when a character searches a room for hidden mechanisms or studies footprints.',
    commonClasses: ['Rogue', 'Wizard', 'Bard'],
  },
  {
    id: 8,
    name: 'Nature',
    attribute: 'INT',
    description:
      'Represents knowledge of terrain, plants, animals, weather, and natural ecosystems.',
    exampleOfUse:
      'Used when a character identifies a poisonous plant or recalls information about a wild beast.',
    commonClasses: ['Druid', 'Ranger', 'Wizard'],
  },
  {
    id: 9,
    name: 'Religion',
    attribute: 'INT',
    description:
      'Represents knowledge of deities, sacred rites, divine symbols, and religious traditions.',
    exampleOfUse:
      'Used when a character tries to recognize a holy symbol or understand a ritual.',
    commonClasses: ['Cleric', 'Paladin', 'Wizard'],
  },
  {
    id: 10,
    name: 'Animal Handling',
    attribute: 'WIS',
    description:
      'Represents the ability to calm, guide, or control animals through intuition and experience.',
    exampleOfUse:
      'Used when a character tries to calm a frightened horse or direct a beast companion.',
    commonClasses: ['Ranger', 'Druid'],
  },
  {
    id: 11,
    name: 'Insight',
    attribute: 'WIS',
    description:
      'Represents the ability to read emotions, intentions, and hidden motives in others.',
    exampleOfUse:
      'Used when a character tries to determine whether someone is lying or hiding something.',
    commonClasses: ['Cleric', 'Monk', 'Bard'],
  },
  {
    id: 12,
    name: 'Medicine',
    attribute: 'WIS',
    description:
      'Represents practical knowledge of injuries, illnesses, and emergency treatment.',
    exampleOfUse:
      'Used when a character stabilizes a wounded ally or examines symptoms of a disease.',
    commonClasses: ['Cleric', 'Druid'],
  },
  {
    id: 13,
    name: 'Perception',
    attribute: 'WIS',
    description:
      'Represents awareness of surroundings and the ability to notice details, danger, or hidden elements.',
    exampleOfUse:
      'Used when a character tries to hear footsteps behind a door or spot a hidden trap.',
    commonClasses: ['Ranger', 'Cleric', 'Druid'],
  },
  {
    id: 14,
    name: 'Survival',
    attribute: 'WIS',
    description:
      'Represents practical knowledge for enduring and navigating harsh environments.',
    exampleOfUse:
      'Used when a character tracks a creature, finds food in the wild, or predicts weather conditions.',
    commonClasses: ['Ranger', 'Druid', 'Barbarian'],
  },
  {
    id: 15,
    name: 'Deception',
    attribute: 'CHA',
    description:
      'Represents the ability to mislead others through lies, disguise, or manipulation.',
    exampleOfUse:
      'Used when a character tries to bluff a guard or hide their true intentions.',
    commonClasses: ['Bard', 'Rogue', 'Warlock'],
  },
  {
    id: 16,
    name: 'Intimidation',
    attribute: 'CHA',
    description:
      'Represents the ability to influence others through fear, pressure, or overwhelming presence.',
    exampleOfUse:
      'Used when a character threatens an enemy or forces cooperation through presence.',
    commonClasses: ['Barbarian', 'Paladin', 'Warlock'],
  },
  {
    id: 17,
    name: 'Performance',
    attribute: 'CHA',
    description:
      'Represents skill in entertaining or expressing through music, acting, storytelling, or other performance arts.',
    exampleOfUse:
      'Used when a character sings in a tavern or performs to impress an audience.',
    commonClasses: ['Bard'],
  },
  {
    id: 18,
    name: 'Persuasion',
    attribute: 'CHA',
    description:
      'Represents the ability to influence others through diplomacy, tact, and social confidence.',
    exampleOfUse:
      'Used when a character negotiates a deal or convinces a noble to offer assistance.',
    commonClasses: ['Bard', 'Paladin', 'Warlock'],
  },
];
