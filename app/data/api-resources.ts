export type ApiResource = {
  name: string;
  slug: string;
  description: string;
  summary: string;
  listFields: string[];
  previewFields?: string[];
  previewEndpoints?: string[];
  endpoints: string[];
};

export const apiResources: ApiResource[] = [
  {
    name: 'Attributes',
    slug: 'attributes',
    description:
      'Core RPG attributes with descriptions and related skills for each ability score.',
    summary: 'Lookup for the six base attributes used across the project.',
    listFields: ['id', 'name', 'shortname', 'description', 'skills'],
    endpoints: ['GET /api/attributes'],
  },
  {
    name: 'Backgrounds',
    slug: 'backgrounds',
    description:
      'Background catalog with list and detail endpoints for starting identity, proficiencies, and equipment.',
    summary: 'Includes lightweight listing plus detailed background data.',
    listFields: ['id', 'name'],
    endpoints: [
      'GET /api/backgrounds',
      'GET /api/backgrounds/{identifier}',
    ],
  },
  {
    name: 'Equipment',
    slug: 'equipment',
    description:
      'Equipment catalog with list and detail endpoints covering weapons, armor, shields, and generic adventuring gear.',
    summary:
      'Provides lightweight listing plus richer detail payloads with typed equipment-specific fields.',
    listFields: [
      'id',
      'name',
      'category',
      'type',
      'cost',
      'weight',
      'isMagical',
    ],
    previewFields: ['category', 'type', 'cost', 'details'],
    endpoints: ['GET /api/equipment', 'GET /api/equipment/{identifier}'],
  },
  {
    name: 'Skills',
    slug: 'skills',
    description:
      'Skill collection with attribute mapping, descriptions, usage examples, and common class associations.',
    summary: 'Useful for quick lookups and detailed skill exploration.',
    listFields: ['id', 'name'],
    endpoints: ['GET /api/skills', 'GET /api/skills/{identifier}'],
  },
  {
    name: 'Classes',
    slug: 'classes',
    description:
      'Playable class data with roles, primary attributes, saving throws, and spellcasting metadata.',
    summary: 'Supports list and detail access for class-oriented flows.',
    listFields: ['id', 'name'],
    endpoints: ['GET /api/classes', 'GET /api/classes/{identifier}'],
  },
  {
    name: 'Spells',
    slug: 'spells',
    description:
      'Spell index with levels and detailed spell information such as school, range, duration, and scaling.',
    summary: 'Provides both compact spell listings and rich spell detail.',
    listFields: ['id', 'name', 'level', 'levelLabel'],
    endpoints: ['GET /api/spells', 'GET /api/spells/{identifier}'],
  },
  {
    name: 'Species',
    slug: 'species',
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
    endpoints: ['GET /api/species', 'GET /api/species/{identifier}'],
  },
  {
    name: 'Auth',
    slug: 'auth',
    description:
      'Authentication entrypoint used to issue bearer tokens for protected character workflows.',
    summary: 'Provides token issuance for authenticated requests.',
    listFields: ['token'],
    endpoints: ['POST /api/auth/token'],
  },
  {
    name: 'Characters',
    slug: 'characters',
    description:
      'Protected character management flow with creation, updates, deletion, character equipment add/update/removal, ability score selection, armor class calculation, initiative, passive perception, movement, inventory weight, weapon attack calculation, hit point calculation, saving throw calculation, skill calculation, spell selection, and enriched responses.',
    summary:
      'Introduces authenticated player-oriented workflows with richer character payloads, nested campaign context, calculated initiative, passive perception, movement, inventory weight, armor class, derived weapon attacks, hit points, saving throws, skill totals, and full character equipment tracking.',
    listFields: [
      'id',
      'name',
      'status',
      'classId',
      'speciesId',
      'backgroundId',
      'level',
      'missingFields',
      'abilityScores',
      'abilityModifiers',
      'armorClass',
      'weaponAttacks',
      'hitPoints',
      'savingThrows',
      'initiative',
      'passivePerception',
      'movement',
      'inventoryWeight',
      'currency',
      'skillProficiencies',
      'abilityScoreRules',
      'classDetails',
      'speciesDetails',
      'backgroundDetails',
    ],
    previewFields: [
      'status',
      'abilityScores',
      'abilityModifiers',
      'armorClass',
      'weaponAttacks',
      'hitPoints',
      'savingThrows',
      'initiative',
      'passivePerception',
      'movement',
      'inventoryWeight',
      'currency',
      'skillProficiencies',
      'equipment',
    ],
    previewEndpoints: [
      'GET /api/characters/{id}/equipment',
      'POST /api/characters/{id}/equipment',
      'PATCH /api/characters/{id}/equipment/{equipmentId}',
      'DELETE /api/characters/{id}/equipment/{equipmentId}',
    ],
    endpoints: [
      'GET /api/characters',
      'POST /api/characters',
      'GET /api/characters/{id}',
      'PATCH /api/characters/{id}',
      'DELETE /api/characters/{id}',
      'GET /api/characters/{id}/ability-score-options',
      'PUT /api/characters/{id}/ability-scores',
      'GET /api/characters/{id}/skills',
      'GET /api/characters/{id}/equipment',
      'POST /api/characters/{id}/equipment',
      'PATCH /api/characters/{id}/equipment/{equipmentId}',
      'DELETE /api/characters/{id}/equipment/{equipmentId}',
      'GET /api/characters/{id}/spell-options',
      'GET /api/characters/{id}/spell-selection',
      'PUT /api/characters/{id}/spells',
    ],
  },
];

export const projectHighlights = [
  'Visual entrypoint for the API project',
  'Interactive documentation available in /docs',
  'Catalog coverage now includes equipment alongside classes, spells, species, and backgrounds',
  'Character flows now support adding, updating, and removing equipment from a character',
  'Character detail now includes initiative, passive perception, movement, inventory weight, armor class, weapon attacks, hit points, and saving throws',
];
