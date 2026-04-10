import {
  ClassSkillProficiencyChoices,
  ClassStartingEquipmentOption,
} from '@/app/types/class';
import { SKILL_NAMES, SkillName } from '@/app/types/skill';

function parseJsonValue(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function getStringProperty(
  record: Record<string, unknown>,
  propertyNames: string[],
) {
  const propertyValue = propertyNames
    .map((propertyName) => record[propertyName])
    .find((value) => typeof value === 'string');

  return typeof propertyValue === 'string' ? propertyValue : null;
}

export function normalizeSubclassName(subclass: unknown) {
  if (typeof subclass === 'string') {
    return subclass;
  }

  if (!subclass || typeof subclass !== 'object') {
    return null;
  }

  return getStringProperty(subclass as Record<string, unknown>, [
    'name',
    'subclassName',
    'subclass',
    'title',
  ]);
}

export function parseStringArray(value: unknown): string[] {
  const parsedValue = parseJsonValue(value);

  return Array.isArray(parsedValue)
    ? parsedValue.filter((item): item is string => typeof item === 'string')
    : [];
}

function stringifyEquipmentItems(items: string[]) {
  if (items.length === 0) {
    return null;
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

function isSkillName(value: unknown): value is SkillName {
  return typeof value === "string" && SKILL_NAMES.includes(value as SkillName);
}

export function parseSkillNameArray(value: unknown): SkillName[] {
  const parsedValue = parseJsonValue(value);

  return Array.isArray(parsedValue) ? parsedValue.filter(isSkillName) : [];
}

export function parseClassSkillProficiencyChoices(
  countValue: unknown,
  optionsValue: unknown,
): ClassSkillProficiencyChoices {
  return {
    choose:
      typeof countValue === 'number' && Number.isInteger(countValue)
        ? countValue
        : typeof countValue === 'string' && Number.isInteger(Number(countValue))
          ? Number(countValue)
          : 0,
    options: parseSkillNameArray(optionsValue),
  };
}

function toEquipmentOptionLabel(index: number) {
  return index < 26 ? String.fromCharCode(65 + index) : null;
}

function parseClassStartingEquipmentOption(
  value: unknown,
  index: number,
): ClassStartingEquipmentOption | null {
  if (typeof value === 'string') {
    return {
      label: toEquipmentOptionLabel(index),
      items: [value],
    };
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const items = parseStringArray(record.items);

  return {
    label: getStringProperty(record, ['label', 'name', 'option']) ?? toEquipmentOptionLabel(index),
    items,
  };
}

export function parseClassStartingEquipmentOptions(
  value: unknown,
): ClassStartingEquipmentOption[] {
  const parsedValue = parseJsonValue(value);

  if (!Array.isArray(parsedValue)) {
    return [];
  }

  return parsedValue
    .map((item, index) => parseClassStartingEquipmentOption(item, index))
    .filter(
      (item): item is ClassStartingEquipmentOption =>
        item !== null && item.items.length > 0,
    );
}

export function parseClassEquipmentOptions(value: unknown): string[] {
  const parsedValue = parseJsonValue(value);

  if (!Array.isArray(parsedValue)) {
    return [];
  }

  return parsedValue
    .map((item, index) => {
      if (typeof item === 'string') {
        return item;
      }

      const parsedOption = parseClassStartingEquipmentOption(item, index);

      return parsedOption ? stringifyEquipmentItems(parsedOption.items) : null;
    })
    .filter((item): item is string => typeof item === 'string');
}
