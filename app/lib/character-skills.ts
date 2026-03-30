import { getCharacterAbilityModifiers, getProficiencyBonus, parseSkillProficiencies } from '@/app/lib/characters';
import { getSql } from './db';
import { CharacterSkillItem } from '@/app/types/character';
import { Attributeshortname } from '@/app/types/attribute';
import { SkillName } from '@/app/types/skill';

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

export async function getCharacterSkills(
  ownerId: number,
  characterId: number,
): Promise<CharacterSkillItem[] | null> {
  const sql = getSql();
  const characterRows = await sql`
    SELECT id, level, abilityscores, skillproficiencies
    FROM characters
    WHERE id = ${characterId}
      AND ownerid = ${ownerId}
    LIMIT 1
  `;

  if (!characterRows || characterRows.length === 0) {
    return null;
  }

  const character = characterRows[0];
  const level = toNumber(character.level);
  const proficiencyBonus = getProficiencyBonus(level);
  const abilityModifiers = getCharacterAbilityModifiers(
    character.abilityscores,
  );
  const skillProficiencies = new Set<SkillName>(
    parseSkillProficiencies(character.skillproficiencies),
  );

  const skillRows = await sql`
    SELECT name, attribute
    FROM skills
    ORDER BY id
  `;

  return skillRows.map((skill) => {
    const isProficient = skillProficiencies.has(skill.name);
    const ability = skill.attribute as Attributeshortname;
    const abilityModifier = abilityModifiers?.[ability] ?? 0;
    const appliedProficiencyBonus = isProficient ? proficiencyBonus : 0;

    return {
      name: skill.name,
      ability,
      isProficient,
      abilityModifier,
      proficiencyBonus: appliedProficiencyBonus,
      total: abilityModifier + appliedProficiencyBonus,
    };
  });
}
