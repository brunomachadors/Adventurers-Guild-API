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

export const expectedClassSubclasses: Pick<
  ClassDetail,
  'id' | 'name' | 'subclasses'
>[] = [
  {
    id: 1,
    name: 'Barbarian',
    subclasses: ['Berserker', 'Wild Heart', 'World Tree', 'Zealot'],
  },
  {
    id: 2,
    name: 'Bard',
    subclasses: [
      'College of Dance',
      'College of Glamour',
      'College of Lore',
      'College of Valor',
    ],
  },
  {
    id: 3,
    name: 'Cleric',
    subclasses: ['Life Domain', 'Light Domain', 'Trickery Domain', 'War Domain'],
  },
  {
    id: 4,
    name: 'Druid',
    subclasses: [
      'Circle of the Land',
      'Circle of the Moon',
      'Circle of the Sea',
      'Circle of the Stars',
    ],
  },
  {
    id: 5,
    name: 'Fighter',
    subclasses: ['Battle Master', 'Champion', 'Eldritch Knight', 'Psi Warrior'],
  },
  {
    id: 6,
    name: 'Monk',
    subclasses: [
      'Warrior of Mercy',
      'Warrior of Shadow',
      'Warrior of the Elements',
      'Warrior of the Open Hand',
    ],
  },
  {
    id: 7,
    name: 'Paladin',
    subclasses: [
      'Oath of Devotion',
      'Oath of Glory',
      'Oath of the Ancients',
      'Oath of Vengeance',
    ],
  },
  {
    id: 8,
    name: 'Ranger',
    subclasses: ['Beast Master', 'Fey Wanderer', 'Gloom Stalker', 'Hunter'],
  },
  {
    id: 9,
    name: 'Rogue',
    subclasses: ['Arcane Trickster', 'Assassin', 'Soulknife', 'Thief'],
  },
  {
    id: 10,
    name: 'Sorcerer',
    subclasses: [
      'Aberrant Sorcery',
      'Clockwork Sorcery',
      'Draconic Sorcery',
      'Wild Magic Sorcery',
    ],
  },
  {
    id: 11,
    name: 'Warlock',
    subclasses: [
      'Archfey Patron',
      'Celestial Patron',
      'Fiend Patron',
      'Great Old One Patron',
    ],
  },
  {
    id: 12,
    name: 'Wizard',
    subclasses: ['Abjurer', 'Diviner', 'Evoker', 'Illusionist'],
  },
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
      | 'savingthrows'
      | 'spellcasting'
      | 'skillProficiencyChoices'
      | 'weaponProficiencies'
      | 'armorTraining'
      | 'startingEquipmentOptions'
      | 'equipmentOptions'
      | 'subclasses'
      | 'levelprogression'
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
    skillProficiencyChoices: {
      choose: 2,
      options: [
        'Animal Handling',
        'Athletics',
        'Intimidation',
        'Nature',
        'Perception',
        'Survival',
      ],
    },
    weaponProficiencies: ['Simple Weapons', 'Martial Weapons'],
    armorTraining: ['Light Armor', 'Medium Armor', 'Shield'],
    startingEquipmentOptions: [
      {
        label: 'A',
        items: ['Greataxe', '4 Handaxes', "Explorer's Pack", '15 GP'],
      },
      {
        label: 'B',
        items: ['75 GP'],
      },
    ],
    equipmentOptions: [
      "Greataxe, 4 Handaxes, Explorer's Pack, and 15 GP",
      '75 GP',
    ],
    subclasses: ['Berserker', 'Wild Heart', 'World Tree', 'Zealot'],
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
    subclasses: ['Battle Master', 'Champion', 'Eldritch Knight', 'Psi Warrior'],
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
      selection: {
        mode: 'spellbook_plus_prepared',
        selectionType: 'prepared',
        changesWhen: 'long_rest',
        cantrips: {
          1: 3,
        },
        preparedSpells: {
          1: 4,
        },
        spellbookSpells: {
          1: 6,
        },
        spellsAddedPerLevel: 2,
      },
    },
    subclasses: ['Abjurer', 'Diviner', 'Evoker', 'Illusionist'],
    hitdie: 6,
    role: 'caster',
    description:
      'A learned arcane scholar who studies the inner workings of magic to prepare spells, master rituals, and wield unmatched magical versatility.',
  },
};
