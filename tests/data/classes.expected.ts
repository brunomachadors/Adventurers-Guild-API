import { ClassDetail, ClassListItem } from '@/app/types/class';

export const expectedClassesList: ClassListItem[] = [
  { id: 1, name: 'Barbarian' },
  { id: 2, name: 'Bard' },
  { id: 3, name: 'Cleric' },
  { id: 4, name: 'Druid' },
  { id: 5, name: 'Fighter' },
  { id: 6, name: 'Monk' },
  { id: 7, name: 'Paladin' },
  { id: 8, name: 'Ranger' },
  { id: 9, name: 'Rogue' },
  { id: 10, name: 'Sorcerer' },
  { id: 11, name: 'Warlock' },
  { id: 12, name: 'Wizard' },
];

export type ExpectedClassDetail = Pick<
  ClassDetail,
  | 'id'
  | 'name'
  | 'slug'
  | 'primaryattributes'
  | 'recommendedskills'
  | 'hitdie'
  | 'role'
  | 'description'
> &
  Partial<
    Pick<
      ClassDetail,
      'savingthrows' | 'spellcasting' | 'subclasses' | 'levelprogression'
    >
  >;

export const expectedDetailedClasses: Record<string, ExpectedClassDetail> = {
  barbarian: {
    id: 1,
    name: 'Barbarian',
    slug: 'barbarian',
    primaryattributes: ['STR'],
    recommendedskills: ['Athletics', 'Survival', 'Intimidation'],
    savingthrows: ['STR', 'CON'],
    spellcasting: null,
    subclasses: ['Berserker', 'Wild Heart', 'World Tree'],
    hitdie: 12,
    role: 'melee',
    description:
      'A fierce warrior who relies on raw strength and primal fury to overcome enemies.',
  },
  fighter: {
    id: 5,
    name: 'Fighter',
    slug: 'fighter',
    primaryattributes: ['STR', 'DEX'],
    recommendedskills: [
      'Athletics',
      'Perception',
      'Intimidation',
      'Survival',
      'Acrobatics',
    ],
    savingthrows: ['STR', 'CON'],
    spellcasting: null,
    subclasses: ['Champion'],
    hitdie: 10,
    role: 'melee',
    description:
      'A master of weapons and armor who dominates the battlefield through martial skill, endurance, and tactical expertise.',
  },
  wizard: {
    id: 12,
    name: 'Wizard',
    slug: 'wizard',
    primaryattributes: ['INT'],
    recommendedskills: [
      'Arcana',
      'Investigation',
      'History',
      'Nature',
      'Religion',
    ],
    savingthrows: ['INT', 'WIS'],
    spellcasting: {
      ability: 'INT',
      usesSpellbook: true,
      canCastRituals: true,
    },
    subclasses: ['Evoker'],
    hitdie: 6,
    role: 'caster',
    description:
      'A learned arcane scholar who studies the inner workings of magic to prepare spells, master rituals, and wield unmatched magical versatility.',
  },
};
