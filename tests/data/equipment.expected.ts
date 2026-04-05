import { EquipmentListItem } from '@/app/types/equipment';

export const expectedEquipmentSamples = {
  club: {
    name: 'Club',
    slug: 'club',
    kind: 'weapon' as const,
    attackType: 'Melee',
    propertySlugs: ['light'],
  },
  dagger: {
    name: 'Dagger',
    slug: 'dagger',
    kind: 'weapon' as const,
    attackType: 'Melee',
    propertySlugs: ['finesse', 'light', 'thrown'],
    thrownRange: { normal: 20, long: 60, unit: 'ft' as const },
  },
  quarterstaff: {
    name: 'Quarterstaff',
    slug: 'quarterstaff',
    kind: 'weapon' as const,
    attackType: 'Melee',
    propertySlugs: ['versatile'],
  },
  spear: {
    name: 'Spear',
    slug: 'spear',
    kind: 'weapon' as const,
    attackType: 'Melee',
    proficiencyType: 'Simple Weapons',
    propertySlugs: ['thrown', 'versatile'],
    thrownRange: { normal: 20, long: 60, unit: 'ft' as const },
    masterySlug: 'sap',
  },
  shortbow: {
    name: 'Shortbow',
    slug: 'shortbow',
    kind: 'weapon' as const,
    attackType: 'Ranged',
    propertySlugs: ['ammunition', 'two-handed'],
    ammunitionType: 'Arrow',
  },
  sling: {
    name: 'Sling',
    slug: 'sling',
    kind: 'weapon' as const,
    attackType: 'Ranged',
    ammunitionType: 'Bullet',
    damageType: 'Bludgeoning',
  },
  glaive: {
    name: 'Glaive',
    slug: 'glaive',
    kind: 'weapon' as const,
    attackType: 'Melee',
    propertySlugs: ['heavy', 'reach', 'two-handed'],
    masterySlug: 'graze',
  },
  rapier: {
    name: 'Rapier',
    slug: 'rapier',
    kind: 'weapon' as const,
    attackType: 'Melee',
    propertySlugs: ['finesse'],
  },
  lance: {
    name: 'Lance',
    slug: 'lance',
    kind: 'weapon' as const,
    attackType: 'Melee',
    propertySlugs: ['reach', 'two-handed'],
    twoHandedNote: 'unless mounted',
  },
  pistol: {
    name: 'Pistol',
    slug: 'pistol',
    kind: 'weapon' as const,
    attackType: 'Ranged',
    propertySlugs: ['ammunition', 'loading'],
    ammunitionType: 'Bullet',
  },
  blowgun: {
    name: 'Blowgun',
    slug: 'blowgun',
    kind: 'weapon' as const,
    attackType: 'Ranged',
    ammunitionType: 'Needle',
    damageFormula: '1',
    damageBonus: 1,
  },
  chainMail: {
    name: 'Chain Mail',
    slug: 'chain-mail',
    kind: 'armor' as const,
    strengthRequirement: 13,
    stealthDisadvantage: true,
  },
  shield: {
    name: 'Shield',
    slug: 'shield',
    kind: 'shield' as const,
    trainingType: 'Shield',
    armorClassBonus: 2,
  },
  thievesTools: {
    name: "Thieves' Tools",
    slug: 'thieves-tools',
    kind: 'generic' as const,
  },
};

export const expectedEquipmentListSamples: Pick<
  EquipmentListItem,
  'name' | 'category' | 'type'
>[] = [
  {
    name: expectedEquipmentSamples.spear.name,
    category: 'Weapon',
    type: 'Weapon',
  },
  {
    name: expectedEquipmentSamples.chainMail.name,
    category: 'Armor',
    type: 'Armor',
  },
];
