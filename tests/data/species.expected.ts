import { SpeciesDetail, SpeciesListItem } from '@/app/types/species';

export const expectedSpeciesList: SpeciesListItem[] = [
  { id: 1, name: 'Dragonborn' },
  { id: 2, name: 'Dwarf' },
  { id: 7, name: 'Human' },
  { id: 8, name: 'Orc' },
];

export const expectedDetailedSpecies: Record<string, SpeciesDetail> = {
  dragonborn: {
    id: 1,
    name: 'Dragonborn',
    slug: 'dragonborn',
    description:
      'The ancestors of dragonborn hatched from the eggs of chromatic and metallic dragons. One story holds that these eggs were blessed by the dragon gods Bahamut and Tiamat, who wanted to populate the multiverse with people created in their image. Another story claims that dragons created the first dragonborn without the gods’ blessings. Whatever their origin, dragonborn have made homes for themselves on the Material Plane.\n\nDragonborn look like wingless, bipedal dragons—scaly, bright-eyed, and thick-boned with horns on their heads—and their coloration and other features are reminiscent of their draconic ancestors.',
    creatureType: 'Humanoid',
    size: 'Medium',
    speed: 30,
    specialTraits: [
      {
        name: 'Draconic Ancestry',
        description:
          'Your lineage stems from a dragon progenitor. Choose the kind of dragon from the Draconic Ancestors table. Your choice affects your Breath Weapon and Damage Resistance traits as well as your appearance.',
      },
      {
        name: 'Breath Weapon',
        description:
          'When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in either a 15-foot Cone or a 30-foot Line that is 5 feet wide. Each creature in that area must make a Dexterity saving throw (DC 8 plus your Constitution modifier and Proficiency Bonus). On a failed save, a creature takes 1d10 damage of the type determined by your Draconic Ancestry trait; half on a success. This damage increases at levels 5, 11, and 17. You can use this trait a number of times equal to your Proficiency Bonus, regaining all uses on a Long Rest.',
      },
      {
        name: 'Damage Resistance',
        description:
          'You have Resistance to the damage type determined by your Draconic Ancestry trait.',
      },
      {
        name: 'Darkvision',
        description: 'You have Darkvision with a range of 60 feet.',
      },
      {
        name: 'Draconic Flight',
        description:
          'Starting at character level 5, as a Bonus Action you can sprout spectral wings for 10 minutes, granting a Fly Speed equal to your Speed. Once used, this trait refreshes on a Long Rest.',
      },
    ],
  },
  dwarf: {
    id: 2,
    name: 'Dwarf',
    slug: 'dwarf',
    description:
      'Dwarves were raised from the earth in the elder days by a deity of the forge. Called by various names on different worlds—Moradin, Reorx, and others—that god gave dwarves an affinity for stone and metal and for living underground. The god also made them resilient like the mountains, with a life span of about 350 years.\n\nSquat and often bearded, the original dwarves carved cities and strongholds into mountainsides and under the earth. Their oldest legends tell of conflicts with the monsters of mountaintops and the Underdark, whether those monsters were towering giants or subterranean horrors. Inspired by those tales, dwarves of any culture often sing of valorous deeds—especially of the little overcoming the mighty.',
    creatureType: 'Humanoid',
    size: 'Medium',
    speed: 30,
    specialTraits: [
      {
        name: 'Darkvision',
        description: 'You have Darkvision with a range of 120 feet.',
      },
      {
        name: 'Dwarven Resilience',
        description:
          'You have Resistance to Poison damage. You also have Advantage on saving throws you make to avoid or end the Poisoned condition.',
      },
      {
        name: 'Dwarven Toughness',
        description:
          'Your Hit Point maximum increases by 1, and it increases by 1 again whenever you gain a level.',
      },
      {
        name: 'Stonecunning',
        description:
          'As a Bonus Action, you gain Tremorsense with a range of 60 feet for 10 minutes while on or touching stone. You can use this a number of times equal to your Proficiency Bonus, regaining all uses on a Long Rest.',
      },
    ],
  },
  human: {
    id: 7,
    name: 'Human',
    slug: 'human',
    description:
      'Found throughout the multiverse, humans are as varied as they are numerous, and they endeavor to achieve as much as they can in the years they are given. Their ambition and resourcefulness are commended, respected, and feared on many worlds.',
    creatureType: 'Humanoid',
    size: 'Medium or Small',
    speed: 30,
    specialTraits: [
      {
        name: 'Resourceful',
        description:
          'You gain Heroic Inspiration whenever you finish a Long Rest.',
      },
      {
        name: 'Skillful',
        description: 'You gain proficiency in one skill of your choice.',
      },
      {
        name: 'Versatile',
        description:
          'You gain an Origin feat of your choice. Skilled is recommended.',
      },
    ],
  },
  orc: {
    id: 8,
    name: 'Orc',
    slug: 'orc',
    description:
      'Orcs trace their creation to Gruumsh, a powerful god who roamed the wide open spaces of the Material Plane. Gruumsh equipped his children with gifts to help them wander great plains, vast caverns, and churning seas and to face the monsters that lurk there.',
    creatureType: 'Humanoid',
    size: 'Medium',
    speed: 30,
    specialTraits: [
      {
        name: 'Adrenaline Rush',
        description:
          'You can take the Dash action as a Bonus Action. When you do so, you gain Temporary Hit Points equal to your Proficiency Bonus. Uses equal Proficiency Bonus, refreshing on a Short or Long Rest.',
      },
      {
        name: 'Darkvision',
        description: 'You have Darkvision with a range of 120 feet.',
      },
      {
        name: 'Relentless Endurance',
        description:
          'When reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Refreshes on a Long Rest.',
      },
    ],
  },
};
