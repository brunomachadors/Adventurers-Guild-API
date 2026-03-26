import { getAuthenticatedOwnerFromRequest } from '@/app/lib/auth';
import { getCharacterSpellSelectionContext } from '@/app/lib/character-spells';
import { getSql } from '@/app/lib/db';
import {
  CharacterSpellOptionItem,
  CharacterSpellSelectionResponseBody,
  CharacterSpellSelectionUpdateRequestBody,
} from '@/app/types/character';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function isSpellSelectionUpdateRequestBody(
  value: unknown,
): value is CharacterSpellSelectionUpdateRequestBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'spellIds' in value &&
    Array.isArray(value.spellIds) &&
    value.spellIds.every(
      (spellId) =>
        typeof spellId === 'number' && Number.isInteger(spellId) && spellId > 0,
    )
  );
}

export async function PUT(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const parsedId = Number(id);
  const authenticatedOwner = getAuthenticatedOwnerFromRequest(request);

  if (!authenticatedOwner) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  try {
    const body = await request.json();

    if (!isSpellSelectionUpdateRequestBody(body)) {
      return NextResponse.json(
        { error: 'Invalid character spell selection payload' },
        { status: 400 },
      );
    }

    const context = await getCharacterSpellSelectionContext(
      authenticatedOwner.id,
      parsedId,
    );

    if (!context) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    if (!context.selectionRules.canSelectSpells || context.classId === null) {
      return NextResponse.json(
        { error: 'Spell selection is not available for this character' },
        { status: 400 },
      );
    }

    const uniqueSpellIds = [...new Set(body.spellIds)];

    if (uniqueSpellIds.length !== body.spellIds.length) {
      return NextResponse.json(
        { error: 'Duplicate spell ids are not allowed' },
        { status: 400 },
      );
    }

    const availableSpellMap = new Map<number, CharacterSpellOptionItem>(
      context.availableSpells.map((spell) => [spell.id, spell]),
    );

    const selectedSpells = uniqueSpellIds.map((spellId) =>
      availableSpellMap.get(spellId),
    );

    if (selectedSpells.some((spell) => !spell)) {
      return NextResponse.json(
        { error: 'One or more spells are invalid for this character' },
        { status: 400 },
      );
    }

    const cantrips = selectedSpells.filter((spell) => spell!.level === 0);
    const leveledSpells = selectedSpells.filter((spell) => spell!.level > 0);

    if (cantrips.length > context.selectionRules.maxCantrips) {
      return NextResponse.json(
        { error: 'Too many cantrips selected' },
        { status: 400 },
      );
    }

    if (leveledSpells.length > context.selectionRules.maxSpells) {
      return NextResponse.json(
        { error: 'Too many spells selected' },
        { status: 400 },
      );
    }

    const sql = getSql();
    await sql`
      DELETE FROM characterspells
      WHERE characterid = ${context.characterId}
    `;

    for (const spell of selectedSpells) {
      const selectionType =
        spell!.level === 0 ? 'cantrip' : context.selectionRules.selectionType;

      await sql`
        INSERT INTO characterspells (characterid, spellid, selectiontype)
        VALUES (${context.characterId}, ${spell!.id}, ${selectionType})
      `;
    }

    const updatedContext = await getCharacterSpellSelectionContext(
      authenticatedOwner.id,
      parsedId,
    );

    if (!updatedContext) {
      return NextResponse.json(
        { error: 'Character not found' },
        { status: 404 },
      );
    }

    const responseBody: CharacterSpellSelectionResponseBody = {
      characterId: updatedContext.characterId,
      classId: updatedContext.classId,
      className: updatedContext.className,
      level: updatedContext.level,
      selectionRules: updatedContext.selectionRules,
      selectedSpells: updatedContext.selectedSpells,
      availableSpells: updatedContext.availableSpells,
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error('Failed to update character spells:', error);

    return NextResponse.json(
      { error: 'Failed to update character spells' },
      { status: 500 },
    );
  }
}
