import { getSql } from '@/app/lib/db';
import {
  EquipmentArmorDetails,
  EquipmentDamage,
  EquipmentDetail,
  EquipmentDetails,
  EquipmentEffect,
  EquipmentGenericDetails,
  EquipmentMastery,
  EquipmentModifier,
  EquipmentProperty,
  EquipmentRange,
  EquipmentShieldDetails,
  EquipmentWeaponDetails,
} from '@/app/types/equipment';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    identifier: string;
  }>;
}

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function normalizeEquipmentValue(value: string): string {
  return value.trim().toLowerCase();
}

function parseJsonValue(value: unknown): unknown {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return value;
}

function parseEquipmentModifier(value: unknown): EquipmentModifier | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const modifier = value as Record<string, unknown>;

  if (
    typeof modifier.type !== 'string' ||
    typeof modifier.value !== 'number' ||
    (modifier.target !== null &&
      modifier.target !== undefined &&
      typeof modifier.target !== 'string') ||
    (modifier.condition !== null &&
      modifier.condition !== undefined &&
      typeof modifier.condition !== 'string')
  ) {
    return null;
  }

  return {
    type: modifier.type as EquipmentModifier['type'],
    value: modifier.value,
    target:
      modifier.target === undefined ? null : (modifier.target as string | null),
    condition:
      modifier.condition === undefined
        ? null
        : (modifier.condition as string | null),
  };
}

function parseEquipmentEffect(value: unknown): EquipmentEffect | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const effect = value as Record<string, unknown>;

  if (
    typeof effect.name !== 'string' ||
    typeof effect.description !== 'string'
  ) {
    return null;
  }

  return {
    name: effect.name,
    description: effect.description,
  };
}

function parseEquipmentRange(value: unknown): EquipmentRange | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const range = value as Record<string, unknown>;

  if (
    (range.normal !== null && typeof range.normal !== 'number') ||
    (range.long !== null && typeof range.long !== 'number') ||
    range.unit !== 'ft'
  ) {
    return null;
  }

  return {
    normal: range.normal as number | null,
    long: range.long as number | null,
    unit: 'ft',
  };
}

function parseEquipmentDamage(value: unknown): EquipmentDamage | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const damage = value as Record<string, unknown>;

  if (
    typeof damage.formula !== 'string' ||
    typeof damage.bonus !== 'number' ||
    typeof damage.damageType !== 'string' ||
    !Array.isArray(damage.dice)
  ) {
    return null;
  }

  const dice = damage.dice
    .map((entry) => {
      if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) {
        return null;
      }

      const die = entry as Record<string, unknown>;

      return typeof die.count === 'number' && typeof die.value === 'number'
        ? { count: die.count, value: die.value }
        : null;
    })
    .filter((entry): entry is EquipmentDamage['dice'][number] => entry !== null);

  if (dice.length !== damage.dice.length) {
    return null;
  }

  return {
    formula: damage.formula,
    dice,
    bonus: damage.bonus,
    damageType: damage.damageType,
  };
}

function parseEquipmentProperty(value: unknown): EquipmentProperty | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const property = value as Record<string, unknown>;

  if (typeof property.name !== 'string' || typeof property.slug !== 'string') {
    return null;
  }

  const range =
    property.range === undefined ? undefined : parseEquipmentRange(property.range);
  const damage =
    property.damage === undefined
      ? undefined
      : parseEquipmentDamage(property.damage);

  if (property.range !== undefined && range === null) {
    return null;
  }

  if (property.damage !== undefined && damage === null) {
    return null;
  }

  if (
    property.ammunitionType !== undefined &&
    property.ammunitionType !== null &&
    typeof property.ammunitionType !== 'string'
  ) {
    return null;
  }

  if (
    property.note !== undefined &&
    property.note !== null &&
    typeof property.note !== 'string'
  ) {
    return null;
  }

  return {
    name: property.name,
    slug: property.slug,
    range: range ?? undefined,
    ammunitionType:
      property.ammunitionType === undefined
        ? undefined
        : (property.ammunitionType as string | null),
    damage: damage ?? undefined,
    note:
      property.note === undefined ? undefined : (property.note as string | null),
  };
}

function parseEquipmentMastery(value: unknown): EquipmentMastery | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const mastery = value as Record<string, unknown>;

  if (typeof mastery.name !== 'string' || typeof mastery.slug !== 'string') {
    return null;
  }

  return {
    name: mastery.name,
    slug: mastery.slug,
  };
}

function parseWeaponDetails(value: unknown): EquipmentWeaponDetails | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const details = value as Record<string, unknown>;

  if (
    details.kind !== 'weapon' ||
    typeof details.weaponCategory !== 'string' ||
    typeof details.attackType !== 'string' ||
    typeof details.proficiencyType !== 'string'
  ) {
    return null;
  }

  const damage = parseEquipmentDamage(details.damage);
  const versatileDamage =
    details.versatileDamage === null
      ? null
      : parseEquipmentDamage(details.versatileDamage);
  const range =
    details.range === null ? null : parseEquipmentRange(details.range);
  const mastery = parseEquipmentMastery(details.mastery);

  if (
    damage === null ||
    versatileDamage === undefined ||
    range === undefined ||
    mastery === null ||
    !Array.isArray(details.properties)
  ) {
    return null;
  }

  const properties = details.properties
    .map(parseEquipmentProperty)
    .filter((property): property is EquipmentProperty => property !== null);

  if (properties.length !== details.properties.length) {
    return null;
  }

  if (
    details.ammunitionType !== undefined &&
    details.ammunitionType !== null &&
    typeof details.ammunitionType !== 'string'
  ) {
    return null;
  }

  return {
    kind: 'weapon',
    weaponCategory: details.weaponCategory,
    attackType: details.attackType,
    damage,
    versatileDamage,
    properties,
    mastery,
    range,
    proficiencyType: details.proficiencyType,
    ammunitionType:
      details.ammunitionType === undefined
        ? null
        : (details.ammunitionType as string | null),
  };
}

function parseArmorDetails(value: unknown): EquipmentArmorDetails | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const details = value as Record<string, unknown>;

  if (details.kind !== 'armor') {
    return null;
  }

  return details as unknown as EquipmentArmorDetails;
}

function parseShieldDetails(value: unknown): EquipmentShieldDetails | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null;
  }

  const details = value as Record<string, unknown>;

  if (details.kind !== 'shield') {
    return null;
  }

  return details as unknown as EquipmentShieldDetails;
}

function parseEquipmentDetails(value: unknown): EquipmentDetails {
  const parsedValue = parseJsonValue(value);

  return (
    parseWeaponDetails(parsedValue) ??
    parseArmorDetails(parsedValue) ??
    parseShieldDetails(parsedValue) ??
    ({ kind: 'generic' } satisfies EquipmentGenericDetails)
  );
}

function parseEquipmentModifiers(value: unknown): EquipmentModifier[] {
  const parsedValue = parseJsonValue(value);

  return Array.isArray(parsedValue)
    ? parsedValue
        .map(parseEquipmentModifier)
        .filter((modifier): modifier is EquipmentModifier => modifier !== null)
    : [];
}

function parseEquipmentEffects(value: unknown): EquipmentEffect[] {
  const parsedValue = parseJsonValue(value);

  return Array.isArray(parsedValue)
    ? parsedValue
        .map(parseEquipmentEffect)
        .filter((effect): effect is EquipmentEffect => effect !== null)
    : [];
}

export async function GET(_: Request, { params }: RouteContext) {
  const { identifier } = await params;
  const parsedId = Number(identifier);
  const sql = getSql();

  try {
    let equipmentRows;

    if (!Number.isNaN(parsedId)) {
      equipmentRows = await sql`
        SELECT
          id,
          name,
          slug,
          category,
          type,
          description,
          cost,
          weight,
          ismagical,
          details,
          modifiers,
          effects
        FROM equipment
        WHERE id = ${parsedId}
      `;
    } else {
      const normalizedIdentifier = normalizeEquipmentValue(identifier);

      equipmentRows = await sql`
        SELECT
          id,
          name,
          slug,
          category,
          type,
          description,
          cost,
          weight,
          ismagical,
          details,
          modifiers,
          effects
        FROM equipment
        WHERE LOWER(name) = ${normalizedIdentifier}
          OR LOWER(slug) = ${normalizedIdentifier}
      `;
    }

    if (!equipmentRows || equipmentRows.length === 0) {
      return NextResponse.json(
        { error: 'Equipment not found' },
        { status: 404 },
      );
    }

    const item = equipmentRows[0];

    const formattedEquipment: EquipmentDetail = {
      id: toNumber(item.id),
      name: item.name,
      slug: item.slug,
      category: item.category,
      type: item.type,
      description: item.description,
      cost: item.cost,
      weight: item.weight === null ? null : toNumber(item.weight),
      isMagical: Boolean(item.ismagical),
      modifiers: parseEquipmentModifiers(item.modifiers),
      effects: parseEquipmentEffects(item.effects),
      details: parseEquipmentDetails(item.details),
    };

    return NextResponse.json(formattedEquipment, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch equipment detail:', error);

    return NextResponse.json(
      { error: 'Failed to fetch equipment detail' },
      { status: 500 },
    );
  }
}
