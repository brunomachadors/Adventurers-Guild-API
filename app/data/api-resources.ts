export type ApiResource = {
  name: string;
  slug: string;
  listPath: string;
  detailPath: string;
  description: string;
  summary: string;
  listFields: string[];
};

export const apiResources: ApiResource[] = [
  {
    name: 'Attributes',
    slug: 'attributes',
    listPath: '/api/attributes',
    detailPath: '/api/attributes',
    description:
      'Core RPG attributes with descriptions and related skills for each ability score.',
    summary: 'Lookup for the six base attributes used across the project.',
    listFields: ['id', 'name', 'shortname', 'description', 'skills'],
  },
  {
    name: 'Backgrounds',
    slug: 'backgrounds',
    listPath: '/api/backgrounds',
    detailPath: '/api/backgrounds/{identifier}',
    description:
      'Background catalog with list and detail endpoints for starting identity, proficiencies, and equipment.',
    summary: 'Includes lightweight listing plus detailed background data.',
    listFields: ['id', 'name'],
  },
  {
    name: 'Skills',
    slug: 'skills',
    listPath: '/api/skills',
    detailPath: '/api/skills/{identifier}',
    description:
      'Skill collection with attribute mapping, descriptions, usage examples, and common class associations.',
    summary: 'Useful for quick lookups and detailed skill exploration.',
    listFields: ['id', 'name'],
  },
  {
    name: 'Classes',
    slug: 'classes',
    listPath: '/api/classes',
    detailPath: '/api/classes/{identifier}',
    description:
      'Playable class data with roles, primary attributes, saving throws, and spellcasting metadata.',
    summary: 'Supports list and detail access for class-oriented flows.',
    listFields: ['id', 'name'],
  },
  {
    name: 'Spells',
    slug: 'spells',
    listPath: '/api/spells',
    detailPath: '/api/spells/{identifier}',
    description:
      'Spell index with levels and detailed spell information such as school, range, duration, and scaling.',
    summary: 'Provides both compact spell listings and rich spell detail.',
    listFields: ['id', 'name', 'level', 'levelLabel'],
  },
  {
    name: 'Species',
    slug: 'species',
    listPath: '/api/species',
    detailPath: '/api/species/{identifier}',
    description:
      'Species catalog with list and detail endpoints covering creature type, size, speed, and special traits.',
    summary: 'Adds ancestry and creature profile data to the current API surface.',
    listFields: [
      'id',
      'name',
      'slug',
      'description',
      'creatureType',
      'size',
      'speed',
      'specialTraits',
    ],
  },
];

export const projectHighlights = [
  'Visual entrypoint for the API project',
  'Interactive documentation available in /docs',
  'API surface now includes species alongside core fantasy resources',
];
