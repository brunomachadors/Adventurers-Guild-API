import { BackgroundDetail, BackgroundListItem } from '@/app/types/background';

export const expectedBackgroundsList: BackgroundListItem[] = [
  { id: 1, name: 'Acolyte' },
  { id: 5, name: 'Criminal' },
  { id: 13, name: 'Sage' },
  { id: 16, name: 'Soldier' },
];

export const expectedDetailedBackgrounds: Record<string, BackgroundDetail> = {
  acolyte: {
    id: 1,
    name: 'Acolyte',
    slug: 'acolyte',
    description:
      "You devoted yourself to service in a temple, either nestled in a town or secluded in a sacred grove. There you performed rites in honor of a god or pantheon. You served under a priest and studied religion. Thanks to your priest's instruction and your own devotion, you also learned how to channel a modicum of divine power in service to your place of worship and the people who prayed there.",
    abilityScores: ['INT', 'WIS', 'CHA'],
    feat: 'Magic Initiate (Cleric)',
    skillProficiencies: ['Insight', 'Religion'],
    toolProficiency: "Calligrapher's Supplies",
    equipmentOptions: [
      "Calligrapher's Supplies, Book (prayers), Holy Symbol, Parchment (10 sheets), Robe, 8 GP",
      '50 GP',
    ],
  },
  criminal: {
    id: 5,
    name: 'Criminal',
    slug: 'criminal',
    description:
      "You eked out a living in dark alleyways, cutting purses or burgling shops. Perhaps you were part of a small gang of like-minded wrongdoers who looked out for each other. Or maybe you were a lone wolf, fending for yourself against the local thieves' guild and more fearsome lawbreakers.",
    abilityScores: ['DEX', 'CON', 'INT'],
    feat: 'Alert',
    skillProficiencies: ['Sleight of Hand', 'Stealth'],
    toolProficiency: "Thieves' Tools",
    equipmentOptions: [
      "2 Daggers, Thieves' Tools, Crowbar, 2 Pouches, Traveler's Clothes, 16 GP",
      '50 GP',
    ],
  },
  sage: {
    id: 13,
    name: 'Sage',
    slug: 'sage',
    description:
      'You spent your formative years traveling between manors and monasteries, performing various odd jobs and services in exchange for access to their libraries. You whiled away many a long evening studying books and scrolls, learning the lore of the multiverse - even the rudiments of magic - and your mind yearns for more.',
    abilityScores: ['CON', 'INT', 'WIS'],
    feat: 'Magic Initiate (Wizard)',
    skillProficiencies: ['Arcana', 'History'],
    toolProficiency: "Calligrapher's Supplies",
    equipmentOptions: [
      "Quarterstaff, Calligrapher's Supplies, Book (history), Parchment (8 sheets), Robe, 8 GP",
      '50 GP',
    ],
  },
  soldier: {
    id: 16,
    name: 'Soldier',
    slug: 'soldier',
    description:
      'You began training for war as soon as you reached adulthood and carry precious few memories of life before you took up arms. Battle is in your blood. Sometimes you catch yourself reflexively performing the basic fighting exercises you learned first. Eventually, you put that training to use on the battlefield, protecting the realm by waging war.',
    abilityScores: ['STR', 'DEX', 'CON'],
    feat: 'Savage Attacker',
    skillProficiencies: ['Athletics', 'Intimidation'],
    toolProficiency: 'One kind of Gaming Set',
    equipmentOptions: [
      "Spear, Shortbow, 20 Arrows, Gaming Set (same as above), Healer's Kit, Quiver, Traveler's Clothes, 14 GP",
      '50 GP',
    ],
  },
};
