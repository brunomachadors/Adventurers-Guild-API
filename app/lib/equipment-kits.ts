import { getSql } from './db';

interface EquipmentKitComponentDefinition {
  name: string;
  quantity: number;
  aliases?: string[];
}

interface EquipmentKitDefinition {
  name: string;
  slug: string;
  description: string;
  components: EquipmentKitComponentDefinition[];
}

export interface EquipmentKitItem {
  componentName: string;
  quantity: number;
  equipmentId: number | null;
}

export interface EquipmentKitDetail {
  id: number;
  name: string;
  slug: string;
  items: EquipmentKitItem[];
}

const DEFAULT_EQUIPMENT_KITS: EquipmentKitDefinition[] = [
  {
    name: "Explorer's Pack",
    slug: 'explorers-pack',
    description: 'A field pack with basic travel and wilderness supplies.',
    components: [
      { name: 'Backpack', quantity: 1 },
      { name: 'Bedroll', quantity: 1 },
      { name: 'Mess Kit', quantity: 1 },
      { name: 'Tinderbox', quantity: 1 },
      { name: 'Torch', quantity: 10 },
      { name: 'Rations', quantity: 10 },
      { name: 'Waterskin', quantity: 1 },
      { name: 'Rope', quantity: 1, aliases: ['Hempen Rope'] },
    ],
  },
  {
    name: "Scholar's Pack",
    slug: 'scholars-pack',
    description: 'A pack with books and writing supplies for study and travel.',
    components: [
      { name: 'Backpack', quantity: 1 },
      { name: 'Book', quantity: 1 },
      { name: 'Ink', quantity: 1 },
      { name: 'Ink Pen', quantity: 1 },
      { name: 'Parchment', quantity: 10 },
      { name: 'Sand, Little Bag', quantity: 1 },
      { name: 'Knife, Small', quantity: 1 },
    ],
  },
  {
    name: "Priest's Pack",
    slug: 'priests-pack',
    description: 'A pack with supplies suitable for a traveling priest.',
    components: [
      { name: 'Backpack', quantity: 1 },
      { name: 'Blanket', quantity: 1 },
      { name: 'Candle', quantity: 10 },
      { name: 'Tinderbox', quantity: 1 },
      { name: 'Alms Box', quantity: 1 },
      { name: 'Incense', quantity: 2 },
      { name: 'Censer', quantity: 1 },
      { name: 'Vestments', quantity: 1 },
      { name: 'Rations', quantity: 2 },
      { name: 'Waterskin', quantity: 1 },
    ],
  },
  {
    name: "Dungeoneer's Pack",
    slug: 'dungeoneers-pack',
    description: 'A pack suited for dungeon delving and underground travel.',
    components: [
      { name: 'Backpack', quantity: 1 },
      { name: 'Crowbar', quantity: 1 },
      { name: 'Hammer', quantity: 1, aliases: ['Light Hammer'] },
      { name: 'Piton', quantity: 10 },
      { name: 'Torch', quantity: 10 },
      { name: 'Tinderbox', quantity: 1 },
      { name: 'Rations', quantity: 10 },
      { name: 'Waterskin', quantity: 1 },
      { name: 'Rope', quantity: 1, aliases: ['Hempen Rope'] },
    ],
  },
  {
    name: "Burglar's Pack",
    slug: 'burglars-pack',
    description: 'A pack with burglary and infiltration supplies.',
    components: [
      { name: 'Backpack', quantity: 1 },
      { name: 'Ball Bearings', quantity: 1 },
      { name: 'String', quantity: 1 },
      { name: 'Bell', quantity: 1 },
      { name: 'Candle', quantity: 5 },
      { name: 'Crowbar', quantity: 1 },
      { name: 'Hammer', quantity: 1, aliases: ['Light Hammer'] },
      { name: 'Piton', quantity: 10 },
      { name: 'Lantern, Hooded', quantity: 1 },
      { name: 'Oil', quantity: 2 },
      { name: 'Rations', quantity: 5 },
      { name: 'Tinderbox', quantity: 1 },
      { name: 'Waterskin', quantity: 1 },
      { name: 'Rope', quantity: 1, aliases: ['Hempen Rope'] },
    ],
  },
];

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '');
}

async function ensureEquipmentKitTables(): Promise<void> {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS equipmentkits (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      createdat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updatedat TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS equipmentkititems (
      id BIGSERIAL PRIMARY KEY,
      kitid BIGINT NOT NULL REFERENCES equipmentkits(id) ON DELETE CASCADE,
      position INTEGER NOT NULL,
      componentname TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      equipmentid BIGINT NULL REFERENCES equipment(id),
      createdat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updatedat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (kitid, position)
    )
  `;
}

async function loadEquipmentCatalog(): Promise<{ id: number; name: string }[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT id, name
    FROM equipment
    ORDER BY id
  `;

  return rows.map((row) => ({
    id: toNumber(row.id),
    name: row.name,
  }));
}

function resolveComponentEquipmentId(
  catalog: { id: number; name: string }[],
  component: EquipmentKitComponentDefinition,
): number | null {
  const candidates = [component.name, ...(component.aliases ?? [])].map(
    normalizeName,
  );
  const matchedItem = catalog.find((item) =>
    candidates.includes(normalizeName(item.name)),
  );

  return matchedItem?.id ?? null;
}

async function seedDefaultEquipmentKits(): Promise<void> {
  await ensureEquipmentKitTables();

  const sql = getSql();
  const catalog = await loadEquipmentCatalog();

  for (const kit of DEFAULT_EQUIPMENT_KITS) {
    const kitRows = await sql`
      INSERT INTO equipmentkits (
        name,
        slug,
        description
      )
      VALUES (
        ${kit.name},
        ${kit.slug},
        ${kit.description}
      )
      ON CONFLICT (slug)
      DO UPDATE SET
        name = EXCLUDED.name,
        description = EXCLUDED.description,
        updatedat = NOW()
      RETURNING id
    `;

    const kitId = toNumber(kitRows[0].id);

    for (const [index, component] of kit.components.entries()) {
      const equipmentId = resolveComponentEquipmentId(catalog, component);

      await sql`
        INSERT INTO equipmentkititems (
          kitid,
          position,
          componentname,
          quantity,
          equipmentid
        )
        VALUES (
          ${kitId},
          ${index},
          ${component.name},
          ${component.quantity},
          ${equipmentId}
        )
        ON CONFLICT (kitid, position)
        DO UPDATE SET
          componentname = EXCLUDED.componentname,
          quantity = EXCLUDED.quantity,
          equipmentid = EXCLUDED.equipmentid,
          updatedat = NOW()
      `;
    }
  }
}

export async function findEquipmentKitByName(
  name: string,
): Promise<EquipmentKitDetail | null> {
  await seedDefaultEquipmentKits();

  const sql = getSql();
  const normalizedName = normalizeName(name);
  const kitRows = await sql`
    SELECT id, name, slug
    FROM equipmentkits
    ORDER BY id
  `;
  const kitRow = kitRows.find(
    (row) => normalizeName(row.name) === normalizedName,
  );

  if (!kitRow) {
    return null;
  }

  const itemRows = await sql`
    SELECT componentname, quantity, equipmentid
    FROM equipmentkititems
    WHERE kitid = ${kitRow.id}
    ORDER BY position
  `;

  return {
    id: toNumber(kitRow.id),
    name: kitRow.name,
    slug: kitRow.slug,
    items: itemRows.map((row) => ({
      componentName: row.componentname,
      quantity: toNumber(row.quantity),
      equipmentId:
        row.equipmentid === null ? null : toNumber(row.equipmentid),
    })),
  };
}
