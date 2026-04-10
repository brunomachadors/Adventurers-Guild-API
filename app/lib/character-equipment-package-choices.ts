import {
  addCharacterEquipment,
  getCharacterEquipment,
} from '@/app/lib/character-equipment';
import { getSql } from '@/app/lib/db';
import { findEquipmentKitByName } from './equipment-kits';
import {
  CharacterEquipmentChoiceSource,
  CharacterCurrency,
  CharacterEquipmentItem,
  CharacterEquipmentPackageChoiceAddedItem,
  CharacterEquipmentPackageChoiceAppliedOption,
  CharacterEquipmentPackageChoiceRequestBody,
  CharacterEquipmentPackageChoiceResponseBody,
  CharacterEquipmentPackageChoiceSkippedItem,
  CharacterPendingChoice,
  CharacterResponseBody,
} from '@/app/types/character';
import { parseCharacterCurrency } from './characters';

interface EquipmentCatalogMatch {
  id: number;
  name: string;
  category: string;
  type: string;
  details: unknown;
}

interface ParsedPackageItem {
  raw: string;
  quantity: number;
  name: string | null;
  skipReason: string | null;
  currency: CharacterCurrency | null;
}

interface ResolvedPackageSelection {
  appliedChoice: CharacterEquipmentPackageChoiceAppliedOption;
  addedEquipment: CharacterEquipmentPackageChoiceAddedItem[];
  addedCurrency: CharacterCurrency;
  skippedItems: CharacterEquipmentPackageChoiceSkippedItem[];
  equipment: CharacterEquipmentItem[];
  pendingChoices: CharacterPendingChoice[];
}

interface CharacterEquipmentChoiceRecord {
  source: CharacterEquipmentChoiceSource;
  optionIndex: number;
  optionLabel: string | null;
}

function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : Number(value);
}

function createEmptyCurrency(): CharacterCurrency {
  return {
    cp: 0,
    sp: 0,
    ep: 0,
    gp: 0,
    pp: 0,
  };
}

function addCurrency(
  base: CharacterCurrency,
  increment: CharacterCurrency,
): CharacterCurrency {
  return {
    cp: base.cp + increment.cp,
    sp: base.sp + increment.sp,
    ep: base.ep + increment.ep,
    gp: base.gp + increment.gp,
    pp: base.pp + increment.pp,
  };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

export function isCharacterEquipmentPackageChoiceRequestBody(
  value: unknown,
): value is CharacterEquipmentPackageChoiceRequestBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    ((!(
      'optionLabel' in value
    ) ||
      isNonEmptyString(value.optionLabel)) &&
      (!('optionIndex' in value) ||
        isNonNegativeInteger(value.optionIndex))) &&
    ('optionLabel' in value || 'optionIndex' in value)
  );
}

function parseJsonValue(value: unknown): unknown {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return value;
}

function getEquipmentKind(value: unknown): 'weapon' | 'armor' | 'shield' | 'generic' {
  const parsedValue = parseJsonValue(value);

  if (
    typeof parsedValue !== 'object' ||
    parsedValue === null ||
    Array.isArray(parsedValue)
  ) {
    return 'generic';
  }

  const kind = (parsedValue as { kind?: unknown }).kind;

  return kind === 'weapon' || kind === 'armor' || kind === 'shield'
    ? kind
    : 'generic';
}

function normalizeEquipmentName(value: string): string {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/\b([a-z]+)s\b/g, '$1')
    .replace(/[^a-z0-9]+/g, '');
}

function singularizeToken(value: string): string {
  if (value.endsWith('ies')) {
    return `${value.slice(0, -3)}y`;
  }

  if (value.endsWith('axes')) {
    return `${value.slice(0, -4)}axe`;
  }

  if (value.endsWith('es') && !value.endsWith('sses')) {
    return value.slice(0, -2);
  }

  if (value.endsWith('s') && !value.endsWith('ss')) {
    return value.slice(0, -1);
  }

  return value;
}

function tokenizeEquipmentName(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/['’]/g, '')
    .split(/[^a-z0-9]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map(singularizeToken);
}

function hasEquivalentEquipmentTokens(
  left: string,
  right: string,
): boolean {
  const leftTokens = tokenizeEquipmentName(left);
  const rightTokens = tokenizeEquipmentName(right);

  if (leftTokens.length === 0 || rightTokens.length === 0) {
    return false;
  }

  if (
    leftTokens.length === rightTokens.length &&
    leftTokens.every((token, index) => token === rightTokens[index])
  ) {
    return true;
  }

  return leftTokens.every((token) => rightTokens.includes(token));
}

function singularizeName(value: string): string | null {
  const trimmedValue = value.trim();
  const lowerValue = trimmedValue.toLowerCase();

  if (lowerValue.endsWith('axes')) {
    return `${trimmedValue.slice(0, -4)}axe`;
  }

  if (lowerValue.endsWith('ches')) {
    return trimmedValue.slice(0, -2);
  }

  if (lowerValue.endsWith('ies')) {
    return `${trimmedValue.slice(0, -3)}y`;
  }

  if (
    lowerValue.endsWith('es') &&
    !lowerValue.endsWith('sses') &&
    !lowerValue.endsWith('shoes')
  ) {
    return trimmedValue.slice(0, -2);
  }

  if (lowerValue.endsWith('s') && !lowerValue.endsWith('ss')) {
    return trimmedValue.slice(0, -1);
  }

  return null;
}

function buildEquipmentNameCandidates(value: string): string[] {
  const trimmedValue = value.trim();
  const withoutParentheses = trimmedValue
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const withoutLeadingArticle = withoutParentheses.replace(/^(a|an|the)\s+/i, '');
  const candidates = [
    trimmedValue,
    withoutParentheses,
    withoutLeadingArticle,
  ].filter((candidate, index, list) => candidate.length > 0 && list.indexOf(candidate) === index);

  for (const candidate of [...candidates]) {
    const singularCandidate = singularizeName(candidate);

    if (singularCandidate && !candidates.includes(singularCandidate)) {
      candidates.push(singularCandidate);
    }
  }

  return candidates;
}

function parsePackageItem(rawItem: string): ParsedPackageItem {
  const trimmedItem = rawItem.trim();

  if (!trimmedItem) {
    return {
      raw: rawItem,
      quantity: 0,
      name: null,
      skipReason: 'Item entry is empty',
      currency: null,
    };
  }

  const currencyMatch = trimmedItem.match(/^(\d+)\s*(cp|sp|ep|gp|pp)$/i);

  if (currencyMatch) {
    const amount = Number(currencyMatch[1]);
    const denomination = currencyMatch[2].toLowerCase() as keyof CharacterCurrency;

    return {
      raw: rawItem,
      quantity: 0,
      name: trimmedItem,
      skipReason: null,
      currency: {
        ...createEmptyCurrency(),
        [denomination]: amount,
      },
    };
  }

  if (/^one kind of /i.test(trimmedItem)) {
    return {
      raw: rawItem,
      quantity: 0,
      name: trimmedItem,
      skipReason: 'Variable equipment choices are not handled by this endpoint',
      currency: null,
    };
  }

  if (/same as above/i.test(trimmedItem)) {
    return {
      raw: rawItem,
      quantity: 0,
      name: trimmedItem,
      skipReason: 'Depends on a previous choice that is not handled by this endpoint',
      currency: null,
    };
  }

  const quantityMatch = trimmedItem.match(/^(\d+)\s+(.+)$/);
  const quantity = quantityMatch ? Number(quantityMatch[1]) : 1;
  const name = (quantityMatch ? quantityMatch[2] : trimmedItem)
    .replace(/\.$/, '')
    .trim();

  return {
    raw: rawItem,
    quantity,
    name,
    skipReason: null,
    currency: null,
  };
}

function parseBackgroundEquipmentOption(option: string): string[] {
  return option
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

async function ensureCharacterEquipmentChoiceTable(): Promise<void> {
  const sql = getSql();

  await sql`
    CREATE TABLE IF NOT EXISTS characterequipmentchoices (
      characterid BIGINT NOT NULL,
      source TEXT NOT NULL,
      optionindex INTEGER NOT NULL,
      optionlabel TEXT NULL,
      createdat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updatedat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (characterid, source)
    )
  `;
}

function isMissingTableError(error: unknown): boolean {
  return (
    error instanceof Error &&
    /characterequipmentchoices|does not exist|relation/i.test(error.message)
  );
}

export async function getCharacterEquipmentChoiceRecords(
  characterId: number,
): Promise<CharacterEquipmentChoiceRecord[]> {
  const sql = getSql();

  try {
    const rows = await sql`
      SELECT characterid, source, optionindex, optionlabel
      FROM characterequipmentchoices
      WHERE characterid = ${characterId}
    `;

    return rows
      .filter(
        (row) => row.source === 'class' || row.source === 'background',
      )
      .map((row) => ({
        source: row.source as CharacterEquipmentChoiceSource,
        optionIndex: toNumber(row.optionindex),
        optionLabel: row.optionlabel ?? null,
      }));
  } catch (error) {
    if (isMissingTableError(error)) {
      return [];
    }

    throw error;
  }
}

export async function markCharacterEquipmentChoiceResolved(
  characterId: number,
  source: CharacterEquipmentChoiceSource,
  optionIndex: number,
  optionLabel: string | null,
): Promise<void> {
  await ensureCharacterEquipmentChoiceTable();

  const sql = getSql();

  await sql`
    INSERT INTO characterequipmentchoices (
      characterid,
      source,
      optionindex,
      optionlabel
    )
    VALUES (
      ${characterId},
      ${source},
      ${optionIndex},
      ${optionLabel}
    )
    ON CONFLICT (characterid, source)
    DO UPDATE SET
      optionindex = EXCLUDED.optionindex,
      optionlabel = EXCLUDED.optionlabel,
      updatedat = NOW()
  `;
}

export async function clearCharacterEquipmentChoiceRecords(
  characterId: number,
): Promise<void> {
  const sql = getSql();

  try {
    await sql`
      DELETE FROM characterequipmentchoices
      WHERE characterid = ${characterId}
    `;
  } catch (error) {
    if (!isMissingTableError(error)) {
      throw error;
    }
  }
}

async function findEquipmentByCandidateName(
  candidateName: string,
): Promise<EquipmentCatalogMatch | null> {
  const sql = getSql();
  const normalizedCandidate = normalizeEquipmentName(candidateName);
  const rows = await sql`
    SELECT id, name, category, type, details
    FROM equipment
    ORDER BY id
  `;

  const matchedRow =
    rows.find((row) => normalizeEquipmentName(row.name) === normalizedCandidate) ??
    rows.find((row) => hasEquivalentEquipmentTokens(candidateName, row.name));

  if (!matchedRow) {
    return null;
  }

  const item = matchedRow;

  return {
    id: toNumber(item.id),
    name: item.name,
    category: item.category,
    type: item.type,
    details: item.details,
  };
}

async function resolveEquipmentCatalogMatch(
  itemName: string,
): Promise<EquipmentCatalogMatch | null> {
  for (const candidateName of buildEquipmentNameCandidates(itemName)) {
    const match = await findEquipmentByCandidateName(candidateName);

    if (match) {
      return match;
    }
  }

  return null;
}

async function applyParsedPackageItems(
  characterId: number,
  parsedItems: ParsedPackageItem[],
): Promise<{
  addedEquipment: CharacterEquipmentPackageChoiceAddedItem[];
  addedCurrency: CharacterCurrency;
  skippedItems: CharacterEquipmentPackageChoiceSkippedItem[];
}> {
  const addedEquipment: CharacterEquipmentPackageChoiceAddedItem[] = [];
  let addedCurrency = createEmptyCurrency();
  const skippedItems: CharacterEquipmentPackageChoiceSkippedItem[] = [];
  let hasEquippedArmor = false;
  let hasEquippedShield = false;
  let hasEquippedWeapon = false;

  for (const parsedItem of parsedItems) {
    if (parsedItem.currency) {
      addedCurrency = addCurrency(addedCurrency, parsedItem.currency);
      continue;
    }

    if (parsedItem.skipReason || !parsedItem.name || parsedItem.quantity <= 0) {
      skippedItems.push({
        name: parsedItem.name ?? parsedItem.raw,
        reason: parsedItem.skipReason ?? 'Item could not be processed',
      });
      continue;
    }

    const match = await resolveEquipmentCatalogMatch(parsedItem.name);

    if (match) {
      const equipmentKind = getEquipmentKind(match.details);
      const isEquipped =
        (equipmentKind === 'armor' && !hasEquippedArmor) ||
        (equipmentKind === 'shield' && !hasEquippedShield) ||
        (equipmentKind === 'weapon' && !hasEquippedWeapon);

      if (equipmentKind === 'armor' && isEquipped) {
        hasEquippedArmor = true;
      }

      if (equipmentKind === 'shield' && isEquipped) {
        hasEquippedShield = true;
      }

      if (equipmentKind === 'weapon' && isEquipped) {
        hasEquippedWeapon = true;
      }

      await addCharacterEquipment(
        characterId,
        match.id,
        parsedItem.quantity,
        isEquipped,
      );

      addedEquipment.push({
        id: match.id,
        name: match.name,
        quantity: parsedItem.quantity,
        isEquipped,
      });
      continue;
    }

    const kit = await findEquipmentKitByName(parsedItem.name);

    if (!kit) {
      skippedItems.push({
        name: parsedItem.name,
        reason: 'Equipment item could not be mapped to the catalog',
      });
      continue;
    }

    for (const kitItem of kit.items) {
      if (kitItem.equipmentId === null) {
        skippedItems.push({
          name: `${kit.name}: ${kitItem.componentName}`,
          reason: 'Kit component could not be mapped to the catalog',
        });
        continue;
      }

      const kitItemMatchRows = await getSql()`
        SELECT id, name, category, type, details
        FROM equipment
        WHERE id = ${kitItem.equipmentId}
        LIMIT 1
      `;
      const kitItemMatch = kitItemMatchRows[0];

      if (!kitItemMatch) {
        skippedItems.push({
          name: `${kit.name}: ${kitItem.componentName}`,
          reason: 'Kit component could not be loaded from the catalog',
        });
        continue;
      }

      await addCharacterEquipment(
        characterId,
        toNumber(kitItemMatch.id),
        kitItem.quantity * parsedItem.quantity,
        false,
      );

      addedEquipment.push({
        id: toNumber(kitItemMatch.id),
        name: kitItemMatch.name,
        quantity: kitItem.quantity * parsedItem.quantity,
        isEquipped: false,
      });
    }
  }

  return {
    addedEquipment,
    addedCurrency,
    skippedItems,
  };
}

async function addCurrencyToCharacter(
  characterId: number,
  currencyToAdd: CharacterCurrency,
): Promise<void> {
  const sql = getSql();
  const characterRows = await sql`
    SELECT currency
    FROM characters
    WHERE id = ${characterId}
    LIMIT 1
  `;

  if (!characterRows || characterRows.length === 0) {
    throw new Error('Character not found');
  }

  const currentCurrency =
    parseCharacterCurrency(characterRows[0].currency) ?? createEmptyCurrency();
  const nextCurrency = addCurrency(currentCurrency, currencyToAdd);

  await sql`
    UPDATE characters
    SET
      currency = ${JSON.stringify(nextCurrency)}::jsonb,
      updatedat = NOW()
    WHERE id = ${characterId}
  `;
}

function getRemainingPendingChoices(
  currentCharacter: CharacterResponseBody,
  source: CharacterEquipmentChoiceSource,
): CharacterPendingChoice[] {
  return currentCharacter.pendingChoices.filter((pendingChoice) =>
    source === 'class'
      ? pendingChoice !== 'classEquipmentSelection'
      : pendingChoice !== 'backgroundEquipmentSelection',
  );
}

export async function resolveCharacterEquipmentPackageChoice(params: {
  ownerId: number;
  characterId: number;
  source: CharacterEquipmentChoiceSource;
  body: CharacterEquipmentPackageChoiceRequestBody;
  character: CharacterResponseBody;
}): Promise<ResolvedPackageSelection> {
  const { ownerId, characterId, source, body, character } = params;

  const pendingChoice: CharacterPendingChoice =
    source === 'class'
      ? 'classEquipmentSelection'
      : 'backgroundEquipmentSelection';

  if (!character.pendingChoices.includes(pendingChoice)) {
    throw new Error(
      source === 'class'
        ? 'No class equipment selection pending'
        : 'No background equipment selection pending',
    );
  }

  const optionEntries =
    source === 'class'
      ? (character.classDetails?.startingEquipmentOptions ?? []).map(
          (option, optionIndex) => ({
            optionIndex,
            label: option.label ?? null,
            items: option.items,
          }),
        )
      : (character.backgroundDetails?.equipmentOptions ?? []).map(
          (option, optionIndex) => ({
            optionIndex,
            label: null,
            items: parseBackgroundEquipmentOption(option),
          }),
        );

  const selectedOption =
    body.optionLabel !== undefined
      ? optionEntries.find(
          (option) =>
            option.label !== null &&
            option.label.trim().toLowerCase() ===
              body.optionLabel!.trim().toLowerCase(),
        ) ?? null
      : body.optionIndex !== undefined
        ? optionEntries[body.optionIndex] ?? null
        : null;

  if (!selectedOption) {
    throw new Error('Selected package option not found');
  }

  const parsedItems = selectedOption.items.map(parsePackageItem);
  const { addedEquipment, addedCurrency, skippedItems } = await applyParsedPackageItems(
    characterId,
    parsedItems,
  );

  if (
    addedCurrency.cp > 0 ||
    addedCurrency.sp > 0 ||
    addedCurrency.ep > 0 ||
    addedCurrency.gp > 0 ||
    addedCurrency.pp > 0
  ) {
    await addCurrencyToCharacter(characterId, addedCurrency);
  }

  await markCharacterEquipmentChoiceResolved(
    characterId,
    source,
    selectedOption.optionIndex,
    selectedOption.label,
  );

  const updatedEquipment = await getCharacterEquipment(ownerId, characterId);

  if (!updatedEquipment) {
    throw new Error('Character not found');
  }

  return {
    appliedChoice: {
      source,
      label: selectedOption.label,
      optionIndex: selectedOption.optionIndex,
    },
    addedEquipment,
    addedCurrency,
    skippedItems,
    equipment: updatedEquipment.equipment,
    pendingChoices: getRemainingPendingChoices(character, source),
  };
}

export function buildCharacterEquipmentPackageChoiceResponse(params: {
  characterId: number;
  selection: ResolvedPackageSelection;
  pendingChoices: CharacterPendingChoice[];
}): CharacterEquipmentPackageChoiceResponseBody {
  const { characterId, selection, pendingChoices } = params;

  return {
    characterId,
    appliedChoice: selection.appliedChoice,
    addedEquipment: selection.addedEquipment,
    addedCurrency: selection.addedCurrency,
    skippedItems: selection.skippedItems,
    pendingChoices,
    equipment: selection.equipment,
  };
}
