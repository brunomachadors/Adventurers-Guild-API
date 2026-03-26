import { getAuthenticatedOwnerFromRequest } from '@/app/lib/auth';
import { getSql } from '@/app/lib/db';
import { CharacterSpellOptionsResponseBody } from '@/app/types/character';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

export async function GET(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const parsedId = Number(id);
  const authenticatedOwner = getAuthenticatedOwnerFromRequest(request);

  if (!authenticatedOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  const sql = getSql();

  try {
    const characterRows = await sql`
      SELECT characters.id, characters.classid, classes.name AS classname, classes.spellcasting
      FROM characters
      LEFT JOIN classes ON classes.id = characters.classid
      WHERE characters.id = ${parsedId}
        AND characters.ownerid = ${authenticatedOwner.id}
      LIMIT 1
    `;

    if (!characterRows || characterRows.length === 0) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    const character = characterRows[0];
    const classId = character.classid === null ? null : toNumber(character.classid);

    if (
      classId === null ||
      character.spellcasting === null ||
      typeof character.spellcasting !== 'object' ||
      Array.isArray(character.spellcasting)
    ) {
      const responseBody: CharacterSpellOptionsResponseBody = {
        characterId: toNumber(character.id),
        classId,
        className: character.classname ?? null,
        spells: [],
      };

      return NextResponse.json(responseBody, { status: 200 });
    }

    const spellRows = await sql`
      SELECT spells.id, spells.name, spells.level, spells.levellabel
      FROM spellclasses
      INNER JOIN spells ON spells.id = spellclasses.spellid
      WHERE spellclasses.classid = ${classId}
      ORDER BY spells.level, spells.id
    `;

    const responseBody: CharacterSpellOptionsResponseBody = {
      characterId: toNumber(character.id),
      classId,
      className: character.classname ?? null,
      spells: spellRows.map((spell) => ({
        id: toNumber(spell.id),
        name: spell.name,
        level: toNumber(spell.level),
        levelLabel: spell.levellabel,
      })),
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch character spell options:', error);

    return NextResponse.json(
      { error: 'Failed to fetch character spell options' },
      { status: 500 },
    );
  }
}
