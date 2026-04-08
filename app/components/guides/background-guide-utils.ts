'use client';

import type { Attribute } from '@/app/types/attribute';

export function getGuideAnchorSlug(value: string) {
  return value
    .toLowerCase()
    .replaceAll('&', 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getSkillAnchor(skillName: string) {
  return `skill-${getGuideAnchorSlug(skillName)}`;
}

export function getClassAnchor(className: string) {
  return `class-${getGuideAnchorSlug(className)}`;
}

export function getSpeciesAnchor(speciesName: string) {
  return `species-${getGuideAnchorSlug(speciesName)}`;
}

export function getBackgroundAnchor(backgroundName: string) {
  return `background-${getGuideAnchorSlug(backgroundName)}`;
}

export function getAttributeAnchor(attributeShortname: string) {
  return `attribute-${attributeShortname.toLowerCase()}`;
}

export function normalizeGuideReference(value: string) {
  return value.trim().toLowerCase();
}

export function findAttributeByReference(
  attributes: Attribute[],
  attributeReference: string,
) {
  const normalizedReference = normalizeGuideReference(attributeReference);

  return attributes.find((attribute) => {
    return (
      normalizeGuideReference(attribute.shortname) === normalizedReference ||
      normalizeGuideReference(attribute.name) === normalizedReference
    );
  });
}

export function splitEquipmentOptionItems(option: string) {
  return option
    .split(/\s*,\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}
