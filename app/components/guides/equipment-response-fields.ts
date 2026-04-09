export const equipmentListResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the equipment item.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Readable equipment name returned by the list endpoint.',
  },
  {
    name: 'category',
    type: 'string',
    description: 'Broad category such as Weapon, Armor, or Adventuring Gear.',
  },
  {
    name: 'type',
    type: 'string',
    description: 'More specific type label used to group similar items.',
  },
  {
    name: 'cost',
    type: 'string',
    description: 'Cost string exactly as exposed by the API.',
  },
  {
    name: 'weight',
    type: 'number | null',
    description: 'Item weight in pounds when available.',
  },
  {
    name: 'isMagical',
    type: 'boolean',
    description: 'Whether the item is marked as magical.',
  },
];

export const equipmentDetailResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the equipment item.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Readable equipment name.',
  },
  {
    name: 'slug',
    type: 'string',
    description: 'URL-friendly identifier accepted by the detail endpoint.',
  },
  {
    name: 'category',
    type: 'string',
    description: 'Broad category of the item.',
  },
  {
    name: 'type',
    type: 'string',
    description: 'Specific equipment type.',
  },
  {
    name: 'description',
    type: 'string',
    description: 'Narrative and gameplay description of the item.',
  },
  {
    name: 'cost',
    type: 'string',
    description: 'Item cost string as returned by the API.',
  },
  {
    name: 'weight',
    type: 'number | null',
    description: 'Item weight in pounds when known.',
  },
  {
    name: 'isMagical',
    type: 'boolean',
    description: 'Whether the item is magical.',
  },
  {
    name: 'modifiers',
    type: 'EquipmentModifier[]',
    description: 'Structured bonuses applied by the item.',
  },
  {
    name: 'effects',
    type: 'EquipmentEffect[]',
    description: 'Additional effects attached to the item.',
  },
  {
    name: 'details',
    type: 'EquipmentDetails',
    description: 'Typed detail payload that varies by equipment kind.',
  },
];
