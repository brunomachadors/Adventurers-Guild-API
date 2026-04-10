import { NextResponse } from 'next/server';
import { getSql } from '@/app/lib/db';
import {
  parseClassEquipmentOptions,
  normalizeSubclassName,
  parseClassSkillProficiencyChoices,
  parseClassStartingEquipmentOptions,
  parseStringArray,
} from '@/app/lib/class';

interface RouteContext {
  params: Promise<{
    identifier: string;
  }>;
}

function normalizeClassName(value: string): string {
  return value.trim().toLowerCase();
}

function slugifyClassName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, '-');
}

export async function GET(_: Request, { params }: RouteContext) {
  const { identifier } = await params;
  const parsedId = Number(identifier);

  const sql = getSql();

  let classRows;

  try {
    if (!Number.isNaN(parsedId)) {
      try {
        classRows = await sql`
          SELECT
            id,
            name,
            slug,
            description,
            role,
            hitdie,
            primaryattributes,
            recommendedskills,
            savingthrows,
            spellcasting,
            skillproficiencychoicescount,
            skillproficiencyoptions,
            weaponproficiencies,
            armortraining,
            equipmentoptions,
            subclasses,
            levelprogression
          FROM classes
          WHERE id = ${parsedId}
        `;
      } catch {
        classRows = await sql`
          SELECT
            id,
            name,
            slug,
            description,
            role,
            hitdie,
            primaryattributes,
            recommendedskills,
            savingthrows,
            spellcasting,
            subclasses,
            levelprogression
          FROM classes
          WHERE id = ${parsedId}
        `;
      }
    } else {
      let allClasses;

      try {
        allClasses = await sql`
          SELECT
            id,
            name,
            slug,
            description,
            role,
            hitdie,
            primaryattributes,
            recommendedskills,
            savingthrows,
            spellcasting,
            skillproficiencychoicescount,
            skillproficiencyoptions,
            weaponproficiencies,
            armortraining,
            equipmentoptions,
            subclasses,
            levelprogression
          FROM classes
        `;
      } catch {
        allClasses = await sql`
          SELECT
            id,
            name,
            slug,
            description,
            role,
            hitdie,
            primaryattributes,
            recommendedskills,
            savingthrows,
            spellcasting,
            subclasses,
            levelprogression
          FROM classes
        `;
      }

      const normalizedIdentifier = normalizeClassName(identifier);

      classRows = allClasses.filter((classItem) => {
        const normalizedName = normalizeClassName(classItem.name);
        const slugifiedName = slugifyClassName(classItem.name);
        const normalizedSlug = normalizeClassName(classItem.slug);

        return (
          normalizedName === normalizedIdentifier ||
          slugifiedName === normalizedIdentifier ||
          normalizedSlug === normalizedIdentifier
        );
      });
    }

    if (!classRows || classRows.length === 0) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    const classItem = classRows[0];

    const formattedClass = {
      id: classItem.id,
      name: classItem.name,
      slug: classItem.slug,
      description: classItem.description,
      role: classItem.role,
      hitdie: classItem.hitdie,
      primaryattributes: parseStringArray(classItem.primaryattributes),
      recommendedskills: parseStringArray(classItem.recommendedskills),
      savingthrows: parseStringArray(classItem.savingthrows),
      spellcasting: classItem.spellcasting,
      skillProficiencyChoices: parseClassSkillProficiencyChoices(
        classItem.skillproficiencychoicescount,
        classItem.skillproficiencyoptions,
      ),
      weaponProficiencies: parseStringArray(classItem.weaponproficiencies),
      armorTraining: parseStringArray(classItem.armortraining),
      startingEquipmentOptions: parseClassStartingEquipmentOptions(
        classItem.equipmentoptions,
      ),
      equipmentOptions: parseClassEquipmentOptions(classItem.equipmentoptions),
      levelprogression: classItem.levelprogression,
      subclasses: Array.isArray(classItem.subclasses)
        ? classItem.subclasses
            .map((subclass) => normalizeSubclassName(subclass))
            .filter((subclassName): subclassName is string =>
              Boolean(subclassName),
            )
        : [],
    };

    return NextResponse.json(formattedClass, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch class detail:', error);

    return NextResponse.json(
      { error: 'Failed to fetch class detail' },
      { status: 500 },
    );
  }
}
