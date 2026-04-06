import { CharacterEquipmentResponseBody } from '@/app/types/character';
import { getSql } from './db';

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

export async function characterBelongsToOwner(
  ownerId: number,
  characterId: number,
): Promise<boolean> {
  const sql = getSql();
  const characterRows = await sql`
    SELECT id
    FROM characters
    WHERE id = ${characterId}
      AND ownerid = ${ownerId}
    LIMIT 1
  `;

  return Boolean(characterRows && characterRows.length > 0);
}

export async function equipmentExists(equipmentId: number): Promise<boolean> {
  const sql = getSql();
  const equipmentRows = await sql`
    SELECT id
    FROM equipment
    WHERE id = ${equipmentId}
    LIMIT 1
  `;

  return Boolean(equipmentRows && equipmentRows.length > 0);
}

export async function addCharacterEquipment(
  characterId: number,
  equipmentId: number,
  quantity: number,
  isEquipped: boolean,
): Promise<void> {
  const sql = getSql();

  await sql`
    INSERT INTO characterequipment (
      characterid,
      equipmentid,
      quantity,
      isequipped
    )
    VALUES (
      ${characterId},
      ${equipmentId},
      ${quantity},
      ${isEquipped}
    )
    ON CONFLICT (characterid, equipmentid)
    DO UPDATE SET
      quantity = characterequipment.quantity + EXCLUDED.quantity,
      isequipped = EXCLUDED.isequipped,
      updatedat = NOW()
  `;
}

export async function characterEquipmentExists(
  characterId: number,
  equipmentId: number,
): Promise<boolean> {
  const sql = getSql();
  const equipmentRows = await sql`
    SELECT id
    FROM characterequipment
    WHERE characterid = ${characterId}
      AND equipmentid = ${equipmentId}
    LIMIT 1
  `;

  return Boolean(equipmentRows && equipmentRows.length > 0);
}

export async function updateCharacterEquipment(
  characterId: number,
  equipmentId: number,
  updates: {
    quantity?: number;
    isEquipped?: boolean;
  },
): Promise<void> {
  const sql = getSql();

  const existingRows = await sql`
    SELECT quantity, isequipped
    FROM characterequipment
    WHERE characterid = ${characterId}
      AND equipmentid = ${equipmentId}
    LIMIT 1
  `;

  const existingItem = existingRows[0];
  const nextQuantity = updates.quantity ?? toNumber(existingItem.quantity);
  const nextIsEquipped = updates.isEquipped ?? Boolean(existingItem.isequipped);

  await sql`
    UPDATE characterequipment
    SET
      quantity = ${nextQuantity},
      isequipped = ${nextIsEquipped},
      updatedat = NOW()
    WHERE characterid = ${characterId}
      AND equipmentid = ${equipmentId}
  `;
}

export async function removeCharacterEquipment(
  characterId: number,
  equipmentId: number,
): Promise<void> {
  const sql = getSql();

  await sql`
    DELETE FROM characterequipment
    WHERE characterid = ${characterId}
      AND equipmentid = ${equipmentId}
  `;
}

export async function getCharacterEquipment(
  ownerId: number,
  characterId: number,
): Promise<CharacterEquipmentResponseBody | null> {
  if (!(await characterBelongsToOwner(ownerId, characterId))) {
    return null;
  }

  const sql = getSql();
  const equipmentRows = await sql`
    SELECT
      equipment.id,
      equipment.name,
      equipment.category,
      equipment.type,
      characterequipment.quantity,
      characterequipment.isequipped
    FROM characterequipment
    INNER JOIN equipment ON equipment.id = characterequipment.equipmentid
    WHERE characterequipment.characterid = ${characterId}
    ORDER BY characterequipment.id
  `;

  return {
    characterId,
    equipment: equipmentRows.map((item) => ({
      id: toNumber(item.id),
      name: item.name,
      category: item.category,
      type: item.type,
      quantity: toNumber(item.quantity),
      isEquipped: Boolean(item.isequipped),
    })),
  };
}
