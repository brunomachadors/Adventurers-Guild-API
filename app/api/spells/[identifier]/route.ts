import { getSql } from '@/app/lib/db';
import { SpellDetail } from '@/app/types/spell';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    identifier: string;
  }>;
}

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function normalizeSpellValue(value: string): string {
  return value.trim().toLowerCase();
}

async function getSpellClasses(
  sql: ReturnType<typeof getSql>,
  spellId: number | string,
) {
  try {
    return await sql`
      SELECT classes.name
      FROM spellclasses
      INNER JOIN classes ON classes.id = spellclasses.classid
      WHERE spellclasses.spellid = ${spellId}
      ORDER BY classes.id
    `;
  } catch (error) {
    console.warn('Failed to fetch spell classes:', error);
    return [];
  }
}

async function getSpellScaling(
  sql: ReturnType<typeof getSql>,
  spellId: number | string,
) {
  try {
    return await sql`
      SELECT characterlevel AS level, description
      FROM spellscaling
      WHERE spellid = ${spellId}
      ORDER BY characterlevel
    `;
  } catch (error) {
    console.warn('Failed to fetch spell scaling:', error);
    return [];
  }
}

export async function GET(_: Request, { params }: RouteContext) {
  const { identifier } = await params;
  const parsedId = Number(identifier);
  const sql = getSql();

  try {
    let spellRows;

    if (!Number.isNaN(parsedId)) {
      spellRows = await sql`
        SELECT
          id,
          name,
          slug,
          source,
          school,
          level,
          levellabel,
          castingtime,
          range,
          verbal,
          somatic,
          material,
          materialdescription,
          duration,
          description
        FROM spells
        WHERE id = ${parsedId}
      `;
    } else {
      const normalizedIdentifier = normalizeSpellValue(identifier);

      spellRows = await sql`
        SELECT
          id,
          name,
          slug,
          source,
          school,
          level,
          levellabel,
          castingtime,
          range,
          verbal,
          somatic,
          material,
          materialdescription,
          duration,
          description
        FROM spells
        WHERE LOWER(name) = ${normalizedIdentifier}
          OR LOWER(slug) = ${normalizedIdentifier}
      `;
    }

    if (!spellRows || spellRows.length === 0) {
      return NextResponse.json({ error: 'Spell not found' }, { status: 404 });
    }

    const spell = spellRows[0];

    const classRows = await getSpellClasses(sql, spell.id);
    const scalingRows = await getSpellScaling(sql, spell.id);

    const formattedSpell: SpellDetail = {
      id: toNumber(spell.id),
      name: spell.name,
      slug: spell.slug,
      source: spell.source,
      school: spell.school,
      level: toNumber(spell.level),
      levelLabel: spell.levellabel,
      castingTime: spell.castingtime,
      range: spell.range,
      components: {
        verbal: spell.verbal,
        somatic: spell.somatic,
        material: spell.material,
        materialDescription: spell.materialdescription,
      },
      duration: spell.duration,
      description: spell.description,
      classes: classRows.map((row) => row.name),
      scaling:
        scalingRows.length > 0
          ? {
              entries: scalingRows.map((row) => ({
                level: toNumber(row.level),
                description: row.description,
              })),
            }
          : null,
    };

    return NextResponse.json(formattedSpell, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch spell detail:', error);

    return NextResponse.json(
      { error: 'Failed to fetch spell detail' },
      { status: 500 },
    );
  }
}
