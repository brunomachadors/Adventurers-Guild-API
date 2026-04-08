export const backgroundListResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the background.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Background name returned in the compact list response.',
  },
];

export const backgroundDetailResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the background.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Readable background name.',
  },
  {
    name: 'slug',
    type: 'string',
    description: 'URL-friendly identifier accepted by the detail endpoint.',
  },
  {
    name: 'description',
    type: 'string',
    description: 'Narrative summary of the background.',
  },
  {
    name: 'abilityScores',
    type: 'string[]',
    description: 'Ability score options linked to this background.',
  },
  {
    name: 'feat',
    type: 'string',
    description: 'Feat granted by the background.',
  },
  {
    name: 'skillProficiencies',
    type: 'string[]',
    description: 'Skill proficiencies granted by the background.',
  },
  {
    name: 'toolProficiency',
    type: 'string | null',
    description: 'Optional tool proficiency included in the background.',
  },
  {
    name: 'equipmentOptions',
    type: 'string[]',
    description: 'Starting equipment options for the background.',
  },
];
