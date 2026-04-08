import { SpeciesDetail, SpeciesListItem } from '@/app/types/species';

export const expectedSpeciesList: SpeciesListItem[] = [
  { id: 1, name: 'Dragonborn' },
  { id: 2, name: 'Dwarf' },
  { id: 3, name: 'Elf' },
  { id: 4, name: 'Gnome' },
  { id: 5, name: 'Goliath' },
  { id: 6, name: 'Halfling' },
  { id: 7, name: 'Human' },
  { id: 8, name: 'Orc' },
  { id: 9, name: 'Tiefling' },
  { id: 10, name: 'Aasimar' },
];

export const expectedDetailedSpecies: Record<string, SpeciesDetail> = {
  dragonborn: {
    id: 1,
    name: 'Dragonborn',
    slug: 'dragonborn',
    description:
      'Dragonborn look like wingless, bipedal dragons, with draconic coloration and features reminiscent of their ancestors.',
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
          'When you take the Attack action on your turn, you can replace one of your attacks with an exhalation of magical energy in either a 15-foot Cone or a 30-foot Line that is 5 feet wide. Each creature in that area must make a Dexterity saving throw (DC 8 plus your Constitution modifier and Proficiency Bonus). On a failed save, a creature takes 1d10 damage of the type determined by your Draconic Ancestry trait. On a successful save, a creature takes half as much damage. This damage increases by 1d10 at character levels 5, 11, and 17. You can use this Breath Weapon a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
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
          'When you reach character level 5, you can channel draconic magic to give yourself temporary flight. As a Bonus Action, you sprout spectral wings on your back that last for 10 minutes or until you retract the wings or have the Incapacitated condition. During that time, you have a Fly Speed equal to your Speed. Once you use this trait, you cannot use it again until you finish a Long Rest.',
      },
    ],
    subspecies: [
      {
        name: 'Black Dragon Ancestry',
        slug: 'black-dragon-ancestry',
        description:
          'A dragonborn ancestry tied to black dragons and acid damage.',
        specialTraits: [
          {
            name: 'Damage Type',
            description: 'Your Draconic Ancestry damage type is Acid.',
          },
        ],
      },
      {
        name: 'Blue Dragon Ancestry',
        slug: 'blue-dragon-ancestry',
        description:
          'A dragonborn ancestry tied to blue dragons and lightning damage.',
        specialTraits: [
          {
            name: 'Damage Type',
            description: 'Your Draconic Ancestry damage type is Lightning.',
          },
        ],
      },
      {
        name: 'Brass Dragon Ancestry',
        slug: 'brass-dragon-ancestry',
        description:
          'A dragonborn ancestry tied to brass dragons and fire damage.',
        specialTraits: [
          {
            name: 'Damage Type',
            description: 'Your Draconic Ancestry damage type is Fire.',
          },
        ],
      },
      {
        name: 'Bronze Dragon Ancestry',
        slug: 'bronze-dragon-ancestry',
        description:
          'A dragonborn ancestry tied to bronze dragons and lightning damage.',
        specialTraits: [
          {
            name: 'Damage Type',
            description: 'Your Draconic Ancestry damage type is Lightning.',
          },
        ],
      },
      {
        name: 'Copper Dragon Ancestry',
        slug: 'copper-dragon-ancestry',
        description:
          'A dragonborn ancestry tied to copper dragons and acid damage.',
        specialTraits: [
          {
            name: 'Damage Type',
            description: 'Your Draconic Ancestry damage type is Acid.',
          },
        ],
      },
      {
        name: 'Gold Dragon Ancestry',
        slug: 'gold-dragon-ancestry',
        description:
          'A dragonborn ancestry tied to gold dragons and fire damage.',
        specialTraits: [
          {
            name: 'Damage Type',
            description: 'Your Draconic Ancestry damage type is Fire.',
          },
        ],
      },
      {
        name: 'Green Dragon Ancestry',
        slug: 'green-dragon-ancestry',
        description:
          'A dragonborn ancestry tied to green dragons and poison damage.',
        specialTraits: [
          {
            name: 'Damage Type',
            description: 'Your Draconic Ancestry damage type is Poison.',
          },
        ],
      },
      {
        name: 'Red Dragon Ancestry',
        slug: 'red-dragon-ancestry',
        description: 'A dragonborn ancestry tied to red dragons and fire damage.',
        specialTraits: [
          {
            name: 'Damage Type',
            description: 'Your Draconic Ancestry damage type is Fire.',
          },
        ],
      },
      {
        name: 'Silver Dragon Ancestry',
        slug: 'silver-dragon-ancestry',
        description:
          'A dragonborn ancestry tied to silver dragons and cold damage.',
        specialTraits: [
          {
            name: 'Damage Type',
            description: 'Your Draconic Ancestry damage type is Cold.',
          },
        ],
      },
      {
        name: 'White Dragon Ancestry',
        slug: 'white-dragon-ancestry',
        description:
          'A dragonborn ancestry tied to white dragons and cold damage.',
        specialTraits: [
          {
            name: 'Damage Type',
            description: 'Your Draconic Ancestry damage type is Cold.',
          },
        ],
      },
    ],
  },
  dwarf: {
    id: 2,
    name: 'Dwarf',
    slug: 'dwarf',
    description:
      'Dwarves were raised from the earth in elder days by a deity of the forge, gaining an affinity for stone, metal, underground life, and mountain-like resilience.',
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
          'As a Bonus Action, you gain Tremorsense with a range of 60 feet for 10 minutes. You must be on a stone surface or touching a stone surface to use this Tremorsense. The stone can be natural or worked. You can use this Bonus Action a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
      },
    ],
    subspecies: [],
  },
  elf: {
    id: 3,
    name: 'Elf',
    slug: 'elf',
    description:
      'Created by the god Corellon, the first elves could change their forms at will. They lost this ability when Corellon cursed them for plotting with the deity Lolth, who tried and failed to usurp Corellon’s dominion. When Lolth was cast into the Abyss, most elves renounced her and earned Corellon’s forgiveness, but that which Corellon had taken from them was lost forever.\n\nNo longer able to shape-shift at will, the elves retreated to the Feywild, where their sorrow was deepened by that plane’s influence. Over time, curiosity led many of them to explore other planes of existence, including worlds in the Material Plane.\n\nElves have pointed ears and lack facial and body hair. They live for around 750 years, and they don’t sleep but instead enter a trance when they need to rest. In that state, they remain aware of their surroundings while immersing themselves in memories and meditations.',
    creatureType: 'Humanoid',
    size: 'Medium',
    speed: 30,
    specialTraits: [
      {
        name: 'Darkvision',
        description: 'You have Darkvision with a range of 60 feet.',
      },
      {
        name: 'Elven Lineage',
        description:
          'Choose a lineage from the Elven Lineages table. You gain the level 1 benefit, and at character levels 3 and 5 you learn additional spells tied to that lineage.',
      },
      {
        name: 'Fey Ancestry',
        description:
          'You have Advantage on saving throws you make to avoid or end the Charmed condition.',
      },
      {
        name: 'Keen Senses',
        description:
          'You have proficiency in the Insight, Perception, or Survival skill.',
      },
      {
        name: 'Trance',
        description:
          'You do not need to sleep, magic cannot put you to sleep, and you can finish a Long Rest in 4 hours through meditation while retaining awareness.',
      },
    ],
    subspecies: [
      {
        name: 'Drow',
        slug: 'drow',
        description: 'An elven lineage associated with the Underdark and innate magic.',
        specialTraits: [
          {
            name: 'Level 1',
            description:
              'The range of your Darkvision increases to 120 feet. You also know the Dancing Lights cantrip.',
          },
          { name: 'Level 3', description: 'You can cast Faerie Fire.' },
          { name: 'Level 5', description: 'You can cast Darkness.' },
        ],
      },
      {
        name: 'High Elf',
        slug: 'high-elf',
        description:
          'A magical elven lineage with an arcane cantrip and additional arcane magic.',
        specialTraits: [
          {
            name: 'Level 1',
            description:
              'You know the Prestidigitation cantrip. Whenever you finish a Long Rest, you can replace that cantrip with a different cantrip from the Wizard spell list.',
          },
          { name: 'Level 3', description: 'You can cast Detect Magic.' },
          { name: 'Level 5', description: 'You can cast Misty Step.' },
        ],
      },
      {
        name: 'Wood Elf',
        slug: 'wood-elf',
        description: 'An elven lineage tied to forests, speed, and primal magic.',
        specialTraits: [
          {
            name: 'Level 1',
            description:
              'Your Speed increases to 35 feet. You also know the Druidcraft cantrip.',
          },
          { name: 'Level 3', description: 'You can cast Longstrider.' },
          { name: 'Level 5', description: 'You can cast Pass without Trace.' },
        ],
      },
      {
        name: 'Lorwyn Elf',
        slug: 'lorwyn-elf',
        description: 'An elven lineage tied to primal magic from Lorwyn.',
        specialTraits: [
          {
            name: 'Level 1',
            description:
              'You know the Thorn Whip cantrip. Whenever you finish a Long Rest, you can replace that cantrip with a different cantrip from the Druid spell list.',
          },
          { name: 'Level 3', description: 'You can cast Command.' },
          { name: 'Level 5', description: 'You can cast Silence.' },
        ],
      },
      {
        name: 'Shadowmoor Elf',
        slug: 'shadowmoor-elf',
        description: 'An elven lineage tied to shadowed magic from Shadowmoor.',
        specialTraits: [
          {
            name: 'Level 1',
            description:
              'The range of your Darkvision increases to 120 feet. You also know the Starry Wisp cantrip.',
          },
          { name: 'Level 3', description: 'You can cast Heroism.' },
          { name: 'Level 5', description: 'You can cast Gentle Repose.' },
        ],
      },
    ],
  },
  gnome: {
    id: 4,
    name: 'Gnome',
    slug: 'gnome',
    description:
      'Gnomes are magical folk created by gods of invention, illusions, and life underground, known for cleverness, secrecy, and supernatural lineages.',
    creatureType: 'Humanoid',
    size: 'Small',
    speed: 30,
    specialTraits: [
      { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
      {
        name: 'Gnomish Cunning',
        description:
          'You have Advantage on Intelligence, Wisdom, and Charisma saving throws.',
      },
      {
        name: 'Gnomish Lineage',
        description:
          'You are part of a lineage that grants you supernatural abilities. Choose Forest Gnome or Rock Gnome. Intelligence, Wisdom, or Charisma is your spellcasting ability for the spells you cast with this trait; choose the ability when you select the lineage.',
      },
    ],
    subspecies: [
      {
        name: 'Forest Gnome',
        slug: 'forest-gnome',
        description:
          'A gnomish lineage connected to forests, illusion, and communication with animals.',
        specialTraits: [
          { name: 'Minor Illusion', description: 'You know the Minor Illusion cantrip.' },
          {
            name: 'Speak with Animals',
            description:
              'You always have the Speak with Animals spell prepared. You can cast it without a spell slot a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest. You can also use any spell slots you have to cast the spell.',
          },
        ],
      },
      {
        name: 'Rock Gnome',
        slug: 'rock-gnome',
        description:
          'A gnomish lineage connected to invention, mending, and small clockwork devices.',
        specialTraits: [
          {
            name: 'Mending and Prestidigitation',
            description: 'You know the Mending and Prestidigitation cantrips.',
          },
          {
            name: 'Clockwork Device',
            description:
              'You can spend 10 minutes casting Prestidigitation to create a Tiny clockwork device (AC 5, 1 HP), such as a toy, fire starter, or music box. When you create the device, you determine its function by choosing one effect from Prestidigitation. The device produces that effect whenever you or another creature takes a Bonus Action to activate it with a touch. You can have three such devices in existence at a time, and each falls apart 8 hours after its creation or when you dismantle it with a touch as a Utilize action.',
          },
        ],
      },
    ],
  },
  goliath: {
    id: 5,
    name: 'Goliath',
    slug: 'goliath',
    description:
      'Goliaths are towering descendants of giants, bearing supernatural boons from giant ancestry and the ability to briefly approach the stature of their gigantic kin.',
    creatureType: 'Humanoid',
    size: 'Medium',
    speed: 35,
    specialTraits: [
      {
        name: 'Giant Ancestry',
        description:
          'You are descended from Giants. Choose one supernatural boon from your ancestry. You can use the chosen benefit a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Long Rest.',
      },
      {
        name: 'Large Form',
        description:
          'Starting at character level 5, you can change your size to Large as a Bonus Action if you are in a big enough space. This transformation lasts for 10 minutes or until you end it. For that duration, you have Advantage on Strength checks, and your Speed increases by 10 feet. Once you use this trait, you cannot use it again until you finish a Long Rest.',
      },
      {
        name: 'Powerful Build',
        description:
          'You have Advantage on any ability check you make to end the Grappled condition. You also count as one size larger when determining your carrying capacity.',
      },
    ],
    subspecies: [
      {
        name: 'Cloud Giant Ancestry',
        slug: 'cloud-giant-ancestry',
        description:
          'A goliath ancestry tied to cloud giants and magical movement.',
        specialTraits: [
          {
            name: "Cloud's Jaunt",
            description:
              'As a Bonus Action, you magically teleport up to 30 feet to an unoccupied space you can see.',
          },
        ],
      },
      {
        name: 'Fire Giant Ancestry',
        slug: 'fire-giant-ancestry',
        description: 'A goliath ancestry tied to fire giants and fiery attacks.',
        specialTraits: [
          {
            name: "Fire's Burn",
            description:
              'When you hit a target with an attack roll and deal damage to it, you can also deal 1d10 Fire damage to that target.',
          },
        ],
      },
      {
        name: 'Frost Giant Ancestry',
        slug: 'frost-giant-ancestry',
        description:
          'A goliath ancestry tied to frost giants and chilling strikes.',
        specialTraits: [
          {
            name: "Frost's Chill",
            description:
              'When you hit a target with an attack roll and deal damage to it, you can also deal 1d6 Cold damage to that target and reduce its Speed by 10 feet until the start of your next turn.',
          },
        ],
      },
      {
        name: 'Hill Giant Ancestry',
        slug: 'hill-giant-ancestry',
        description:
          'A goliath ancestry tied to hill giants and knocking foes down.',
        specialTraits: [
          {
            name: "Hill's Tumble",
            description:
              'When you hit a Large or smaller creature with an attack roll and deal damage to it, you can give that target the Prone condition.',
          },
        ],
      },
      {
        name: 'Stone Giant Ancestry',
        slug: 'stone-giant-ancestry',
        description:
          'A goliath ancestry tied to stone giants and supernatural endurance.',
        specialTraits: [
          {
            name: "Stone's Endurance",
            description:
              'When you take damage, you can take a Reaction to roll 1d12. Add your Constitution modifier to the number rolled and reduce the damage by that total.',
          },
        ],
      },
      {
        name: 'Storm Giant Ancestry',
        slug: 'storm-giant-ancestry',
        description:
          'A goliath ancestry tied to storm giants and retaliatory thunder.',
        specialTraits: [
          {
            name: "Storm's Thunder",
            description:
              'When you take damage from a creature within 60 feet of you, you can take a Reaction to deal 1d8 Thunder damage to that creature.',
          },
        ],
      },
    ],
  },
  halfling: {
    id: 6,
    name: 'Halfling',
    slug: 'halfling',
    description:
      'Halflings are small folk guided by gods of life, home, and hearth, known for bravery, luck, community, and an adventurous spirit.',
    creatureType: 'Humanoid',
    size: 'Small',
    speed: 30,
    specialTraits: [
      {
        name: 'Brave',
        description:
          'You have Advantage on saving throws you make to avoid or end the Frightened condition.',
      },
      {
        name: 'Halfling Nimbleness',
        description:
          'You can move through the space of any creature that is a size larger than you, but you cannot stop in the same space.',
      },
      {
        name: 'Luck',
        description:
          'When you roll a 1 on the d20 of a D20 Test, you can reroll the die, and you must use the new roll.',
      },
      {
        name: 'Naturally Stealthy',
        description:
          'You can take the Hide action even when you are obscured only by a creature that is at least one size larger than you.',
      },
    ],
    subspecies: [],
  },
  human: {
    id: 7,
    name: 'Human',
    slug: 'human',
    description:
      'Humans are found throughout the multiverse, varied, numerous, ambitious, and resourceful, striving to achieve much in the years they are given.',
    creatureType: 'Humanoid',
    size: 'Medium or Small',
    speed: 30,
    specialTraits: [
      {
        name: 'Resourceful',
        description: 'You gain Heroic Inspiration whenever you finish a Long Rest.',
      },
      {
        name: 'Skillful',
        description: 'You gain proficiency in one skill of your choice.',
      },
      {
        name: 'Versatile',
        description: 'You gain an Origin feat of your choice. Skilled is recommended.',
      },
    ],
    subspecies: [],
  },
  orc: {
    id: 8,
    name: 'Orc',
    slug: 'orc',
    description:
      'Orcs trace their creation to Gruumsh and retain gifts of endurance, determination, and darkvision suited to wandering harsh lands and facing dangerous monsters.',
    creatureType: 'Humanoid',
    size: 'Medium',
    speed: 30,
    specialTraits: [
      {
        name: 'Adrenaline Rush',
        description:
          'You can take the Dash action as a Bonus Action. When you do so, you gain a number of Temporary Hit Points equal to your Proficiency Bonus. You can use this trait a number of times equal to your Proficiency Bonus, and you regain all expended uses when you finish a Short or Long Rest.',
      },
      {
        name: 'Darkvision',
        description: 'You have Darkvision with a range of 120 feet.',
      },
      {
        name: 'Relentless Endurance',
        description:
          'When you are reduced to 0 Hit Points but not killed outright, you can drop to 1 Hit Point instead. Once you use this trait, you cannot do so again until you finish a Long Rest.',
      },
    ],
    subspecies: [],
  },
  tiefling: {
    id: 9,
    name: 'Tiefling',
    slug: 'tiefling',
    description:
      'Tieflings are mortals linked by blood to devils, demons, or other Fiends from the Lower Planes, inheriting a fiendish legacy that grants supernatural power.',
    creatureType: 'Humanoid',
    size: 'Medium or Small',
    speed: 30,
    specialTraits: [
      { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
      {
        name: 'Fiendish Legacy',
        description:
          'You are the recipient of a legacy that grants you supernatural abilities. Choose a legacy from the Fiendish Legacies table. You gain the level 1 benefit of the chosen legacy. When you reach character levels 3 and 5, you learn a higher-level spell shown for that legacy. You always have that spell prepared, can cast it once without a spell slot, regain that use when you finish a Long Rest, and can also cast it using spell slots of the appropriate level. Intelligence, Wisdom, or Charisma is your spellcasting ability for the spells you cast with this trait, chosen when you select the legacy.',
      },
      {
        name: 'Otherworldly Presence',
        description:
          'You know the Thaumaturgy cantrip. When you cast it with this trait, the spell uses the same spellcasting ability you use for your Fiendish Legacy trait.',
      },
    ],
    subspecies: [
      {
        name: 'Abyssal Legacy',
        slug: 'abyssal-legacy',
        description:
          'A tiefling legacy touched by the Abyss, Pandemonium, and Carceri, often associated with demonic ancestry.',
        specialTraits: [
          {
            name: 'Level 1',
            description:
              'You have Resistance to Poison damage. You also know the Poison Spray cantrip.',
          },
          {
            name: 'Level 3',
            description: 'You learn Ray of Sickness and always have it prepared.',
          },
          {
            name: 'Level 5',
            description: 'You learn Hold Person and always have it prepared.',
          },
        ],
      },
      {
        name: 'Chthonic Legacy',
        slug: 'chthonic-legacy',
        description:
          'A tiefling legacy touched by Carceri, Gehenna, and Hades, associated with neutral evil fiendish ancestry.',
        specialTraits: [
          {
            name: 'Level 1',
            description:
              'You have Resistance to Necrotic damage. You also know the Chill Touch cantrip.',
          },
          {
            name: 'Level 3',
            description: 'You learn False Life and always have it prepared.',
          },
          {
            name: 'Level 5',
            description:
              'You learn Ray of Enfeeblement and always have it prepared.',
          },
        ],
      },
      {
        name: 'Infernal Legacy',
        slug: 'infernal-legacy',
        description:
          'A tiefling legacy connected to Gehenna, the Nine Hells, and Acheron, often associated with devilish ancestry.',
        specialTraits: [
          {
            name: 'Level 1',
            description:
              'You have Resistance to Fire damage. You also know the Fire Bolt cantrip.',
          },
          {
            name: 'Level 3',
            description:
              'You learn Hellish Rebuke and always have it prepared.',
          },
          {
            name: 'Level 5',
            description: 'You learn Darkness and always have it prepared.',
          },
        ],
      },
    ],
  },
  aasimar: {
    id: 10,
    name: 'Aasimar',
    slug: 'aasimar',
    description:
      'Aasimar are mortals who carry a spark of the Upper Planes within their souls, marked by celestial heritage and able to reveal heavenly power.',
    creatureType: 'Humanoid',
    size: 'Medium or Small',
    speed: 30,
    specialTraits: [
      {
        name: 'Celestial Resistance',
        description: 'You have Resistance to Necrotic damage and Radiant damage.',
      },
      { name: 'Darkvision', description: 'You have Darkvision with a range of 60 feet.' },
      {
        name: 'Healing Hands',
        description:
          'As a Magic action, you touch a creature and roll a number of d4s equal to your Proficiency Bonus. The creature regains a number of Hit Points equal to the total rolled. Once you use this trait, you cannot use it again until you finish a Long Rest.',
      },
      {
        name: 'Light Bearer',
        description: 'You know the Light cantrip. Charisma is your spellcasting ability for it.',
      },
      {
        name: 'Celestial Revelation',
        description:
          'When you reach character level 3, you can transform as a Bonus Action using Heavenly Wings, Inner Radiance, or Necrotic Shroud. The transformation lasts for 1 minute or until you end it. Once on each of your turns before the transformation ends, you can deal extra damage to one target when you deal damage to it with an attack or a spell. The extra damage equals your Proficiency Bonus and is Necrotic for Necrotic Shroud or Radiant for Heavenly Wings and Inner Radiance. Once you transform, you cannot do so again until you finish a Long Rest.',
      },
      {
        name: 'Heavenly Wings',
        description:
          'Two spectral wings sprout from your back temporarily. Until the transformation ends, you have a Fly Speed equal to your Speed.',
      },
      {
        name: 'Inner Radiance',
        description:
          'Searing light temporarily radiates from your eyes and mouth. For the duration, you shed Bright Light in a 10-foot radius and Dim Light for an additional 10 feet, and at the end of each of your turns, each creature within 10 feet of you takes Radiant damage equal to your Proficiency Bonus.',
      },
      {
        name: 'Necrotic Shroud',
        description:
          'Your eyes briefly become pools of darkness, and flightless wings sprout from your back temporarily. Creatures other than your allies within 10 feet of you must succeed on a Charisma saving throw (DC 8 plus your Charisma modifier and Proficiency Bonus) or have the Frightened condition until the end of your next turn.',
      },
    ],
    subspecies: [],
  },
};
