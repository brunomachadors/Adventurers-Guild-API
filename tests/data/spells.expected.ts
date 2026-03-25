import { SpellDetail, SpellListItem } from '@/app/types/spell';

export const expectedSpellsList: SpellListItem[] = [
  {
    id: 1,
    name: 'Acid Splash',
    level: 0,
    levelLabel: 'Cantrip',
  },
  {
    id: 18,
    name: 'Alarm',
    level: 1,
    levelLabel: 'Level 1',
  },
  {
    id: 20,
    name: 'Animal Friendship',
    level: 1,
    levelLabel: 'Level 1',
  },
];

export const expectedDetailedSpells: Record<string, SpellDetail> = {
  'acid-splash': {
    id: 1,
    name: 'Acid Splash',
    slug: 'acid-splash',
    source: "Player's Handbook",
    school: 'Evocation',
    level: 0,
    levelLabel: 'Cantrip',
    castingTime: 'Action',
    range: '60 feet',
    components: {
      verbal: true,
      somatic: true,
      material: false,
      materialDescription: null,
    },
    duration: 'Instantaneous',
    description:
      'You create an acidic bubble at a point within range, where it explodes in a 5-foot-radius Sphere. Each creature in that Sphere must succeed on a Dexterity saving throw or take 1d6 Acid damage.',
    classes: ['Sorcerer', 'Wizard'],
    scaling: {
      entries: [
        {
          level: 5,
          description: 'damage increases to 2d6',
        },
        {
          level: 11,
          description: 'damage increases to 3d6',
        },
        {
          level: 17,
          description: 'damage increases to 4d6',
        },
      ],
    },
  },
  alarm: {
    id: 18,
    name: 'Alarm',
    slug: 'alarm',
    source: "Player's Handbook",
    school: 'Abjuration',
    level: 1,
    levelLabel: 'Level 1',
    castingTime: '1 minute or Ritual',
    range: '30 feet',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a bell and silver wire',
    },
    duration: '8 hours',
    description:
      'You set an alarm against intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot Cube. Until the spell ends, an alarm alerts you whenever a creature touches or enters the warded area. When you cast the spell, you can designate creatures that won’t set off the alarm. You also choose whether the alarm is audible or mental:\n\nAudible Alarm. The alarm produces the sound of a handbell for 10 seconds within 60 feet of the warded area.\n\nMental Alarm. You are alerted by a mental ping if you are within 1 mile of the warded area. This ping awakens you if you’re asleep.',
    classes: ['Ranger', 'Wizard'],
    scaling: null,
  },
  'animal-friendship': {
    id: 20,
    name: 'Animal Friendship',
    slug: 'animal-friendship',
    source: "Player's Handbook",
    school: 'Enchantment',
    level: 1,
    levelLabel: 'Level 1',
    castingTime: 'Action',
    range: '30 feet',
    components: {
      verbal: true,
      somatic: true,
      material: true,
      materialDescription: 'a morsel of food',
    },
    duration: '24 hours',
    description:
      'Target a Beast that you can see within range. The target must succeed on a Wisdom saving throw or have the Charmed condition for the duration. If you or one of your allies deals damage to the target, the spell ends.\n\nUsing a Higher-Level Spell Slot. You can target one additional Beast for each spell slot level above 1.',
    classes: ['Bard', 'Druid', 'Ranger'],
    scaling: null,
  },
};
