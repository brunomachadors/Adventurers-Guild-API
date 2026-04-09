export const spellListResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the spell.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Display name used in indexes and spell selection flows.',
  },
  {
    name: 'level',
    type: 'number',
    description: 'Spell level, where 0 represents a cantrip.',
  },
  {
    name: 'levelLabel',
    type: 'string',
    description: 'Friendly label for the spell level.',
  },
];

export const spellDetailResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the spell.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Spell name.',
  },
  {
    name: 'slug',
    type: 'string',
    description: 'Stable text identifier for slug-based lookups.',
  },
  {
    name: 'source',
    type: 'string',
    description: 'Source book or ruleset reference.',
  },
  {
    name: 'school',
    type: 'string',
    description: 'Magic school classification, such as Evocation or Illusion.',
  },
  {
    name: 'level',
    type: 'number',
    description: 'Spell level, where 0 is a cantrip.',
  },
  {
    name: 'levelLabel',
    type: 'string',
    description: 'Friendly label for the spell level.',
  },
  {
    name: 'castingTime',
    type: 'string',
    description: 'How long it takes to cast the spell.',
  },
  {
    name: 'range',
    type: 'string',
    description: 'Casting distance or targeting range.',
  },
  {
    name: 'components',
    type: 'SpellComponents',
    description: 'Verbal, somatic, and material casting requirements.',
  },
  {
    name: 'duration',
    type: 'string',
    description: 'How long the spell lasts after being cast.',
  },
  {
    name: 'description',
    type: 'string',
    description: 'Full spell rules text.',
  },
  {
    name: 'classes',
    type: 'string[]',
    description: 'Classes that can normally access the spell.',
  },
  {
    name: 'scaling',
    type: 'SpellScaling | null',
    description: 'Optional scaling entries for stronger versions of the spell.',
  },
];
