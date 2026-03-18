import { ClassDetail, ClassListItem } from '../types/class';

export const classes: ClassDetail[] = [
  {
    id: 1,
    name: 'Fighter',
    primaryAttributes: ['STR', 'CON'],
    recommendedSkills: ['Athletics', 'Intimidation'],
    hitDie: 10,
    role: 'melee',
    description:
      'A master of martial combat, skilled with a variety of weapons and armor.',
  },
  {
    id: 2,
    name: 'Wizard',
    primaryAttributes: ['INT'],
    recommendedSkills: ['Arcana', 'History', 'Investigation'],
    hitDie: 6,
    role: 'caster',
    description:
      'A scholarly magic-user capable of manipulating the structures of reality.',
  },
  {
    id: 3,
    name: 'Rogue',
    primaryAttributes: ['DEX'],
    recommendedSkills: ['Stealth', 'Sleight of Hand', 'Deception'],
    hitDie: 8,
    role: 'stealth',
    description:
      'A sneaky and dexterous character who excels at stealth and precision attacks.',
  },
  {
    id: 4,
    name: 'Cleric',
    primaryAttributes: ['WIS'],
    recommendedSkills: ['Insight', 'Medicine', 'Religion'],
    hitDie: 8,
    role: 'support',
    description:
      'A divine spellcaster who channels the power of a deity to heal and protect.',
  },
  {
    id: 5,
    name: 'Ranger',
    primaryAttributes: ['DEX', 'WIS'],
    recommendedSkills: ['Survival', 'Nature', 'Animal Handling'],
    hitDie: 10,
    role: 'hybrid',
    description: 'A skilled hunter and tracker who thrives in the wilderness.',
  },
  {
    id: 6,
    name: 'Paladin',
    primaryAttributes: ['STR', 'CHA'],
    recommendedSkills: ['Persuasion', 'Athletics', 'Religion'],
    hitDie: 10,
    role: 'hybrid',
    description:
      'A holy warrior bound by oath, combining martial prowess with divine power.',
  },

  // 🔥 Novas classes

  {
    id: 7,
    name: 'Barbarian',
    primaryAttributes: ['STR', 'CON'],
    recommendedSkills: ['Athletics', 'Survival'],
    hitDie: 12,
    role: 'melee',
    description:
      'A fierce warrior of primitive background who can enter a battle rage.',
  },
  {
    id: 8,
    name: 'Bard',
    primaryAttributes: ['CHA'],
    recommendedSkills: ['Performance', 'Persuasion', 'Deception'],
    hitDie: 8,
    role: 'support',
    description:
      'An inspiring magician whose power echoes the music of creation.',
  },
  {
    id: 9,
    name: 'Druid',
    primaryAttributes: ['WIS'],
    recommendedSkills: ['Nature', 'Animal Handling', 'Survival'],
    hitDie: 8,
    role: 'caster',
    description:
      'A priest of the Old Faith, wielding the powers of nature and adopting animal forms.',
  },
  {
    id: 10,
    name: 'Monk',
    primaryAttributes: ['DEX', 'WIS'],
    recommendedSkills: ['Acrobatics', 'Stealth'],
    hitDie: 8,
    role: 'melee',
    description:
      'A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.',
  },
  {
    id: 11,
    name: 'Sorcerer',
    primaryAttributes: ['CHA'],
    recommendedSkills: ['Arcana', 'Deception'],
    hitDie: 6,
    role: 'caster',
    description:
      'A spellcaster who draws on inherent magic from a gift or bloodline.',
  },
  {
    id: 12,
    name: 'Warlock',
    primaryAttributes: ['CHA'],
    recommendedSkills: ['Arcana', 'Deception', 'Intimidation'],
    hitDie: 8,
    role: 'caster',
    description:
      'A wielder of magic derived from a bargain with an extraplanar entity.',
  },
];

export const classesList: ClassListItem[] = classes.map(({ id, name }) => ({
  id,
  name,
}));
