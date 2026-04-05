export interface EquipmentListItem {
  id: number;
  name: string;
  category: string;
  type: string;
  cost: string;
  weight: number | null;
  isMagical: boolean;
}

export interface EquipmentDamageDice {
  count: number;
  value: number;
}

export interface EquipmentDamage {
  formula: string;
  dice: EquipmentDamageDice[];
  bonus: number;
  damageType: string;
}

export interface EquipmentRange {
  normal: number | null;
  long: number | null;
  unit: 'ft';
}

export interface EquipmentProperty {
  name: string;
  slug: string;
  range?: EquipmentRange | null;
  ammunitionType?: string | null;
  damage?: EquipmentDamage | null;
  note?: string | null;
}

export interface EquipmentMastery {
  name: string;
  slug: string;
}

export interface EquipmentArmorClass {
  base: number;
  dexModifier: {
    applies: boolean;
    max: number | null;
  };
}

export interface EquipmentModifier {
  type:
    | 'attackBonus'
    | 'damageBonus'
    | 'armorClassBonus'
    | 'abilityScoreBonus'
    | 'skillBonus'
    | 'savingThrowBonus'
    | 'speedBonus';
  value: number;
  target: string | null;
  condition: string | null;
}

export interface EquipmentEffect {
  name: string;
  description: string;
}

export interface EquipmentWeaponDetails {
  kind: 'weapon';
  weaponCategory: string;
  attackType: string;
  damage: EquipmentDamage;
  versatileDamage: EquipmentDamage | null;
  properties: EquipmentProperty[];
  mastery: EquipmentMastery;
  range: EquipmentRange | null;
  proficiencyType: string;
  ammunitionType: string | null;
}

export interface EquipmentArmorDetails {
  kind: 'armor';
  armorType: string;
  trainingType: string;
  armorClass: EquipmentArmorClass;
  strengthRequirement: number | null;
  stealthDisadvantage: boolean;
  donTime: string;
  doffTime: string;
}

export interface EquipmentShieldDetails {
  kind: 'shield';
  trainingType: string;
  armorClassBonus: number;
  donTime: string;
  doffTime: string;
}

export interface EquipmentGenericDetails {
  kind: 'generic';
}

export type EquipmentDetails =
  | EquipmentWeaponDetails
  | EquipmentArmorDetails
  | EquipmentShieldDetails
  | EquipmentGenericDetails;

export interface EquipmentDetail {
  id: number;
  name: string;
  slug: string;
  category: string;
  type: string;
  description: string;
  cost: string;
  weight: number | null;
  isMagical: boolean;
  modifiers: EquipmentModifier[];
  effects: EquipmentEffect[];
  details: EquipmentDetails;
}
