import { getSql } from '@/app/lib/db';
import { SpellListItem } from '@/app/types/spell';
import { NextResponse } from 'next/server';

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function normalizeFilterValue(value: string) {
  return value.trim().toLowerCase();
}

function getSingleFilterValue(
  searchParams: URLSearchParams,
  key: string,
): string | null {
  const value = searchParams.get(key);

  if (value === null) {
    return null;
  }

  return value.trim();
}

function parseLevelFilter(value: string | null) {
  if (value === null) {
    return { value: null, error: null as string | null };
  }

  const normalizedValue = normalizeFilterValue(value);

  if (normalizedValue === 'cantrip') {
    return { value: 0, error: null as string | null };
  }

  if (!/^\d+$/.test(normalizedValue)) {
    return { value: null, error: 'Invalid level filter' };
  }

  return { value: Number(normalizedValue), error: null as string | null };
}

function validateStringFilter(
  value: string | null,
  filterName: string,
): string | null {
  if (value === null) {
    return null;
  }

  return value.length > 0 ? null : `Invalid ${filterName} filter`;
}

async function getSpellClassesMap(sql: ReturnType<typeof getSql>) {
  const spellClassRows = await sql`
    SELECT spellclasses.spellid, classes.slug AS classslug, classes.name AS classname
    FROM spellclasses
    INNER JOIN classes ON classes.id = spellclasses.classid
    ORDER BY spellclasses.spellid, classes.id
  `;

  const classesBySpellId = new Map<number, { slug: string; name: string }[]>();

  for (const row of spellClassRows) {
    const spellId = toNumber(row.spellid);
    const existingRows = classesBySpellId.get(spellId) ?? [];

    existingRows.push({
      slug: normalizeFilterValue(row.classslug),
      name: normalizeFilterValue(row.classname),
    });

    classesBySpellId.set(spellId, existingRows);
  }

  return classesBySpellId;
}

export async function GET(request: Request) {
  const sql = getSql();
  const { searchParams } = new URL(request.url);
  const levelFilter = parseLevelFilter(getSingleFilterValue(searchParams, 'level'));
  const schoolFilter = getSingleFilterValue(searchParams, 'school');
  const classFilter = getSingleFilterValue(searchParams, 'class');
  const sourceFilter = getSingleFilterValue(searchParams, 'source');
  const nameFilter = getSingleFilterValue(searchParams, 'name');

  const validationError =
    levelFilter.error ??
    validateStringFilter(schoolFilter, 'school') ??
    validateStringFilter(classFilter, 'class') ??
    validateStringFilter(sourceFilter, 'source') ??
    validateStringFilter(nameFilter, 'name');

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const spellRows = await sql`
      SELECT id, name, level, levellabel, source, school
      FROM spells
      ORDER BY id
    `;
    const classesBySpellId =
      classFilter !== null ? await getSpellClassesMap(sql) : null;
    const normalizedSchoolFilter =
      schoolFilter === null ? null : normalizeFilterValue(schoolFilter);
    const normalizedClassFilter =
      classFilter === null ? null : normalizeFilterValue(classFilter);
    const normalizedSourceFilter =
      sourceFilter === null ? null : normalizeFilterValue(sourceFilter);
    const normalizedNameFilter =
      nameFilter === null ? null : normalizeFilterValue(nameFilter);

    const spells: SpellListItem[] = spellRows.map((spell) => ({
      id: toNumber(spell.id),
      name: spell.name,
      level: toNumber(spell.level),
      levelLabel: spell.levellabel,
    }))
      .filter((spell, index) => {
        const spellRow = spellRows[index];

        if (levelFilter.value !== null && spell.level !== levelFilter.value) {
          return false;
        }

        if (
          normalizedSchoolFilter !== null &&
          normalizeFilterValue(spellRow.school) !== normalizedSchoolFilter
        ) {
          return false;
        }

        if (
          normalizedSourceFilter !== null &&
          normalizeFilterValue(spellRow.source) !== normalizedSourceFilter
        ) {
          return false;
        }

        if (
          normalizedNameFilter !== null &&
          !normalizeFilterValue(spell.name).includes(normalizedNameFilter)
        ) {
          return false;
        }

        if (normalizedClassFilter !== null) {
          const spellClasses = classesBySpellId?.get(spell.id) ?? [];
          const matchesClass = spellClasses.some(
            (spellClass) =>
              spellClass.slug === normalizedClassFilter ||
              spellClass.name === normalizedClassFilter,
          );

          if (!matchesClass) {
            return false;
          }
        }

        return true;
      });

    return NextResponse.json(spells, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch spells:', error);

    return NextResponse.json(
      { error: 'Failed to fetch spells' },
      { status: 500 },
    );
  }
}
