import {
  CharacterInventoryWeight,
  CharacterMovement,
  CharacterPassivePerception,
  CharacterSkillItem,
} from '@/app/types/character';
import { SpeciesDetail } from '@/app/types/species';
import { getSql } from './db';

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

export function getCharacterPassivePerception(
  skills: CharacterSkillItem[],
): CharacterPassivePerception | null {
  const perception = skills.find((skill) => skill.name === 'Perception');

  if (!perception) {
    return null;
  }

  const base = 10;
  const bonus = 0;

  return {
    skill: 'Perception',
    ability: 'WIS',
    base,
    skillModifier: perception.total,
    bonus,
    total: base + perception.total + bonus,
    sources: [
      {
        type: 'base',
        value: base,
      },
      {
        type: 'skillModifier',
        value: perception.total,
      },
    ],
  };
}

export function getCharacterMovement(
  speciesDetails: SpeciesDetail | null,
): CharacterMovement | null {
  if (!speciesDetails || typeof speciesDetails.speed !== 'number') {
    return null;
  }

  return {
    baseSpeed: speciesDetails.speed,
    unit: 'ft',
    sources: [
      {
        type: 'species',
        name: speciesDetails.name,
        value: speciesDetails.speed,
      },
    ],
  };
}

export async function getCharacterInventoryWeight(
  characterId: number,
): Promise<CharacterInventoryWeight> {
  const sql = getSql();
  const equipmentRows = await sql`
    SELECT
      equipment.id,
      equipment.name,
      equipment.weight,
      characterequipment.quantity
    FROM characterequipment
    INNER JOIN equipment ON equipment.id = characterequipment.equipmentid
    WHERE characterequipment.characterid = ${characterId}
      AND equipment.weight IS NOT NULL
    ORDER BY characterequipment.id
  `;

  const sources = equipmentRows.map((item) => {
    const weight = toNumber(item.weight);
    const quantity = toNumber(item.quantity);

    return {
      equipmentId: toNumber(item.id),
      name: item.name,
      quantity,
      weight,
      total: weight * quantity,
    };
  });

  return {
    total: sources.reduce((sum, item) => sum + item.total, 0),
    unit: 'lb',
    sources,
  };
}
