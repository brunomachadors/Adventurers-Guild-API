'use client';

import Image from 'next/image';
import { useMemo, useState, type FormEvent, type ReactNode } from 'react';

import type {
  CharacterAbilityModifiers,
  CharacterAbilityScores,
  CharacterEquipmentItem,
  CharacterResponseBody,
} from '@/app/types/character';
import type { EquipmentRange } from '@/app/types/equipment';

type CharacterPreviewResponse = CharacterResponseBody & {
  equipment?: CharacterEquipmentItem[];
};

type PreviewState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; character: CharacterPreviewResponse };

const abilityOrder: Array<keyof CharacterAbilityScores> = [
  'STR',
  'DEX',
  'CON',
  'INT',
  'WIS',
  'CHA',
];

const currencyOrder = ['cp', 'sp', 'ep', 'gp', 'pp'] as const;
const exampleCharacterId = '1771';
const weaponProficiencyOptions = [
  {
    label: 'Simple Melee Weapons',
    matches: ['Simple Weapons', 'Simple Melee Weapons'],
  },
  {
    label: 'Simple Ranged Weapons',
    matches: ['Simple Weapons', 'Simple Ranged Weapons'],
  },
  {
    label: 'Martial Melee Weapons',
    matches: ['Martial Weapons', 'Martial Melee Weapons'],
  },
  {
    label: 'Martial Ranged Weapons',
    matches: ['Martial Weapons', 'Martial Ranged Weapons'],
  },
];
const armorTrainingOptions = [
  { label: 'Light Armor', matches: ['Light Armor'] },
  { label: 'Medium Armor', matches: ['Medium Armor'] },
  { label: 'Heavy Armor', matches: ['Heavy Armor'] },
  { label: 'Shield', matches: ['Shield', 'Shields'] },
];

function formatFallback(value: unknown, fallback = 'Not returned') {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return String(value);
}

function formatSigned(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return '-';
  }

  return value >= 0 ? `+${value}` : String(value);
}

function formatWeaponRange(range: EquipmentRange | null) {
  if (!range) {
    return 'Melee';
  }

  const normalRange =
    range.normal === null ? null : `${range.normal} ${range.unit}`;
  const longRange = range.long === null ? null : `${range.long} ${range.unit}`;

  if (normalRange && longRange) {
    return `${normalRange} / ${longRange}`;
  }

  return normalRange ?? longRange ?? 'Not returned';
}

function getErrorMessage(status: number) {
  if (status === 401) {
    return 'This character could not be previewed by the public endpoint.';
  }

  if (status === 404) {
    return 'No character was found for this ID.';
  }

  return 'The character could not be loaded right now.';
}

function SheetBlock({
  children,
  className,
  eyebrow,
  title,
}: {
  children: ReactNode;
  className?: string;
  eyebrow?: string;
  title: string;
}) {
  return (
    <section
      className={`character-sheet-block${className ? ` ${className}` : ''}`}
    >
      <div className="character-sheet-block__heading">
        {eyebrow ? <p>{eyebrow}</p> : null}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function StatTile({
  className,
  label,
  value,
}: {
  className?: string;
  detail?: string;
  label: string;
  value: string | number;
}) {
  return (
    <article
      className={`character-stat-tile${className ? ` ${className}` : ''}`}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function InlineStat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string | number;
}) {
  return (
    <article className="character-inline-stat">
      <Image alt="" aria-hidden="true" height={34} src={icon} width={34} />
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function renderAbilityScores(
  scores: CharacterPreviewResponse['abilityScores'],
  modifiers: CharacterAbilityModifiers | null,
) {
  if (!scores) {
    return (
      <p className="character-preview-empty-line">
        Ability scores were not returned.
      </p>
    );
  }

  return (
    <div className="character-ability-grid">
      {abilityOrder.map((ability) => (
        <article className="character-ability-card" key={ability}>
          <span>{ability}</span>
          <strong>{scores.final[ability]}</strong>
          <p>{formatSigned(modifiers?.[ability])}</p>
        </article>
      ))}
    </div>
  );
}

function getCharacterFeatures(character: CharacterPreviewResponse) {
  const classFeatures =
    character.classDetails?.featuresByLevel
      .filter((progression) => progression.level <= character.level)
      .flatMap((progression) =>
        progression.features.map((feature) => ({
          description: feature.description,
          name: feature.name,
          source: `Level ${progression.level}`,
        })),
      ) ?? [];
  const speciesFeatures =
    character.speciesDetails?.specialTraits.map((trait) => ({
      description: trait.description,
      name: trait.name,
      source: 'Species',
    })) ?? [];
  const backgroundFeatures = [
    character.backgroundDetails?.feat
      ? {
          description: 'Feat granted by the selected background.',
          name: character.backgroundDetails.feat,
          source: 'Feat',
        }
      : null,
    character.backgroundDetails?.toolProficiency
      ? {
          description: 'Tool proficiency granted by the selected background.',
          name: character.backgroundDetails.toolProficiency,
          source: 'Tool',
        }
      : null,
    character.backgroundDetails?.abilityScores.length
      ? {
          description: character.backgroundDetails.abilityScores.join(', '),
          name: 'Ability score choices',
          source: 'Abilities',
        }
      : null,
  ].filter(
    (
      feature,
    ): feature is {
      description: string;
      name: string;
      source: string;
    } => Boolean(feature),
  );

  return [
    { name: 'Species', features: speciesFeatures },
    { name: 'Background', features: backgroundFeatures },
    { name: 'Class', features: classFeatures },
  ].filter((group) => group.features.length > 0);
}

function ProficiencyChecklist({
  activeItems,
  items,
  label,
}: {
  activeItems: string[] | null | undefined;
  items: Array<{ label: string; matches: string[] }>;
  label: string;
}) {
  const activeItemSet = new Set(activeItems ?? []);

  return (
    <section className="character-proficiency-checklist">
      <h3>{label}</h3>
      <div>
        {items.map((item) => {
          const isActive = item.matches.some((match) => activeItemSet.has(match));

          return (
            <span className="character-proficiency-check" key={item.label}>
              <span
                aria-label={
                  isActive
                    ? `${item.label} proficient`
                    : `${item.label} not proficient`
                }
                className={`character-check-table__mark${
                  isActive ? ' character-check-table__mark--checked' : ''
                }`}
                role="img"
              />
              <strong>{item.label}</strong>
            </span>
          );
        })}
      </div>
    </section>
  );
}

function getReturnedProficiencyBonus(character: CharacterPreviewResponse) {
  const returnedBonuses = [
    ...character.savingThrows.map((savingThrow) => savingThrow.proficiencyBonus),
    ...character.skills.map((skill) => skill.proficiencyBonus),
    ...character.weaponAttacks.map((attack) => attack.proficiencyBonus),
  ].filter((bonus) => bonus > 0);

  return returnedBonuses[0] ?? null;
}

function CharacterSheet({
  character,
}: {
  character: CharacterPreviewResponse;
}) {
  const equipment = character.equipment ?? [];
  const armorSources = character.armorClass.sources ?? [];
  const featureGroups = getCharacterFeatures(character);
  const proficiencyBonus = getReturnedProficiencyBonus(character);
  const spellcasting = character.spellcastingSummary;

  return (
    <article className="character-sheet">
      <header className="character-sheet__masthead character-sheet__masthead--form">
        <div className="character-sheet__masthead-copy">
          <div className="character-sheet__masthead-id">
            <p className="kicker">Character ID</p>
            <h2>#{character.id}</h2>
          </div>
          <div className="character-sheet__masthead-details">
            <dl>
              <div className="character-sheet__masthead-field character-sheet__masthead-field--name">
                <dt>Name</dt>
                <dd>{character.name}</dd>
              </div>
              <div className="character-sheet__masthead-field character-sheet__masthead-field--level">
                <dt>Level</dt>
                <dd>{character.level}</dd>
              </div>
              <div className="character-sheet__masthead-field">
                <dt>Class</dt>
                <dd>
                  {formatFallback(character.classDetails?.name, 'Unknown class')}
                </dd>
              </div>
              <div className="character-sheet__masthead-field">
                <dt>Species</dt>
                <dd>
                  {formatFallback(
                    character.speciesDetails?.name,
                    'Unknown species',
                  )}
                </dd>
              </div>
              <div className="character-sheet__masthead-field">
                <dt>Background</dt>
                <dd>
                  {formatFallback(
                    character.backgroundDetails?.name,
                    'Unknown background',
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <strong>{character.status}</strong>
      </header>

      <div className="character-sheet__stats">
        <div className="character-sheet__icon-stats">
          <StatTile
            className="character-stat-tile--armor"
            label="Armor Class"
            value={character.armorClass.total}
          />
          <StatTile
            className="character-stat-tile--heart"
            label="Hit Points"
            value={character.hitPoints ? character.hitPoints.max : '-'}
          />
          <StatTile
            className="character-stat-tile--proficiency"
            label="Proficiency Bonus"
            value={formatSigned(proficiencyBonus)}
          />
        </div>
        <div className="character-sheet__secondary-stats">
          <article className="character-death-save">
            <Image
              alt=""
              aria-hidden="true"
              height={48}
              src="/images/character/death-save-skull.png"
              width={48}
            />
            <div className="character-death-save__summary">
              <span>Death Save</span>
              <strong>10</strong>
            </div>
            <div className="character-death-save__checks">
              <span>Success</span>
              <div aria-label="Death save successes">
                <i />
                <i />
                <i />
              </div>
              <span>Failure</span>
              <div aria-label="Death save failures">
                <i />
                <i />
                <i />
              </div>
            </div>
          </article>
          <div className="character-inline-stat-list">
            <InlineStat
              icon="/images/character/initiative-lightning.png"
              label="Initiative"
              value={formatSigned(character.initiative?.total)}
            />
            <InlineStat
              icon="/images/character/movement-boots.png"
              label="Movement"
              value={
                character.movement
                  ? `${character.movement.baseSpeed} ${character.movement.unit}`
                  : '-'
              }
            />
            <InlineStat
              icon="/images/character/inventory-weight.png"
              label="Inventory Weight"
              value={`${character.inventoryWeight.total} ${character.inventoryWeight.unit}`}
            />
          </div>
        </div>
      </div>

      <div className="character-sheet__training-layout">
        <div className="character-sheet__ability-column">
          <SheetBlock
            className="character-sheet-block--flat character-sheet-block--compact-title"
            title="Core attributes"
          >
            {renderAbilityScores(
              character.abilityScores,
              character.abilityModifiers,
            )}
          </SheetBlock>

          <article className="character-passive-perception">
            <div>
              <span>Passive</span>
              <strong>Perception</strong>
            </div>
            <p>{character.passivePerception?.total ?? '-'}</p>
            <small>
              {character.passivePerception
                ? `10 + ${formatSigned(character.passivePerception.skillModifier)} skill`
                : 'Not returned'}
            </small>
          </article>
        </div>

        <div className="character-sheet__training-column">
          <SheetBlock
            className="character-sheet-block--flat character-sheet-block--compact-title"
            title="Saving throws"
          >
            {character.savingThrows.length > 0 ? (
              <div className="character-table-wrap">
                <table className="character-sheet-table character-check-table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th aria-label="Proficiency" scope="col">
                        Prof.
                      </th>
                      <th scope="col">Bonus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {character.savingThrows.map((savingThrow) => (
                      <tr key={savingThrow.ability}>
                        <td data-label="Name">
                          <span className="character-check-table__name">
                            <strong>{savingThrow.ability}</strong>
                            <small>Saving throw</small>
                          </span>
                        </td>
                        <td data-label="Prof">
                          <span className="character-check-table__proficiency">
                            <span
                              aria-label={
                                savingThrow.isProficient
                                  ? 'Proficient'
                                  : 'Not proficient'
                              }
                              className={`character-check-table__mark${
                                savingThrow.isProficient
                                  ? ' character-check-table__mark--checked'
                                  : ''
                              }`}
                              role="img"
                            />
                          </span>
                        </td>
                        <td data-label="Bonus">
                          <strong className="character-check-table__bonus">
                            {formatSigned(savingThrow.total)}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="character-preview-empty-line">
                No saving throws returned.
              </p>
            )}
          </SheetBlock>

          <SheetBlock
            className="character-sheet-block--flat character-sheet-block--compact-title"
            title="Skills"
          >
            {character.skills.length > 0 ? (
              <div className="character-table-wrap">
                <table className="character-sheet-table character-check-table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th aria-label="Proficiency" scope="col">
                        P
                      </th>
                      <th scope="col">Bonus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {character.skills.map((skill) => (
                      <tr key={skill.name}>
                        <td data-label="Name">
                          <span className="character-check-table__name">
                            <strong>{skill.name}</strong>
                            <small>{skill.ability}</small>
                          </span>
                        </td>
                        <td data-label="Prof">
                          <span className="character-check-table__proficiency">
                            <span
                              aria-label={
                                skill.isProficient
                                  ? 'Proficient'
                                  : 'Not proficient'
                              }
                              className={`character-check-table__mark${
                                skill.isProficient
                                  ? ' character-check-table__mark--checked'
                                  : ''
                              }`}
                              role="img"
                            />
                          </span>
                        </td>
                        <td data-label="Bonus">
                          <strong className="character-check-table__bonus">
                            {formatSigned(skill.total)}
                          </strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="character-preview-empty-line">
                No skills returned.
              </p>
            )}
          </SheetBlock>
        </div>

        <div className="character-sheet__features-column">
          <SheetBlock title="Traits">
            {featureGroups.length > 0 ? (
              <div className="character-feature-list">
                {featureGroups.map((group) => (
                  <section className="character-feature-group" key={group.name}>
                    <h3>{group.name}</h3>
                    {group.features.map((feature) => (
                      <article
                        className="character-feature-item"
                        key={`${group.name}-${feature.source}-${feature.name}`}
                      >
                        <strong>{feature.name}</strong>
                        <p>{feature.description}</p>
                      </article>
                    ))}
                  </section>
                ))}
              </div>
            ) : (
              <p className="character-preview-empty-line">
                No traits returned.
              </p>
            )}
          </SheetBlock>
        </div>
      </div>

      <div className="character-sheet__combat-row">
        <SheetBlock eyebrow="Training" title="Proficiencies">
          <div className="character-proficiency-grid">
            <ProficiencyChecklist
              activeItems={character.classDetails?.weaponProficiencies}
              items={weaponProficiencyOptions}
              label="Weapons"
            />
            <ProficiencyChecklist
              activeItems={character.classDetails?.armorTraining}
              items={armorTrainingOptions}
              label="Armor"
            />
          </div>
        </SheetBlock>

        <SheetBlock eyebrow="Combat" title="Attacks">
          {character.weaponAttacks.length > 0 ? (
            <div className="character-attack-list">
              {character.weaponAttacks.map((attack) => (
                <article className="character-attack-card" key={attack.equipmentId}>
                  <header>
                    <strong>{attack.name}</strong>
                    <span>{attack.attackType}</span>
                  </header>

                  <div className="character-attack-card__numbers">
                    <span>
                      <small>Attack</small>
                      <strong>{formatSigned(attack.attackBonus)}</strong>
                    </span>
                    <span>
                      <small>Damage</small>
                      <strong>
                        {attack.damage.formula} {attack.damage.damageType}
                      </strong>
                    </span>
                    <span>
                      <small>Range</small>
                      <strong>{formatWeaponRange(attack.range)}</strong>
                    </span>
                  </div>

                  <div className="character-attack-card__details">
                    <span>
                      <small>Ability</small>
                      <strong>{attack.ability}</strong>
                    </span>
                    <span>
                      <small>Prof.</small>
                      <strong>
                        {attack.isProficient
                          ? formatSigned(attack.proficiencyBonus)
                          : 'No'}
                      </strong>
                    </span>
                  </div>

                  <div className="character-attack-card__properties">
                    <small>Properties</small>
                    <div>
                      {attack.properties.length > 0 ? (
                        attack.properties.map((property) => (
                          <span key={`${attack.equipmentId}-${property}`}>
                            {property}
                          </span>
                        ))
                      ) : (
                        <span>None returned</span>
                      )}
                    </div>
                  </div>

                  <div className="character-attack-card__mastery">
                    <small>Mastery</small>
                    <strong>{attack.mastery.name}</strong>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="character-preview-empty-line">
              No weapon attacks returned.
            </p>
          )}
        </SheetBlock>
      </div>

      <div className="character-sheet__two-column">
        <SheetBlock eyebrow="Armor formula" title="Armor sources">
          {armorSources.length > 0 ? (
            <div className="character-compact-list">
              {armorSources.map((source) => (
                <div key={`${source.type}-${source.name}`}>
                  <strong>{source.name}</strong>
                  <span>{source.value}</span>
                  <small>{source.type}</small>
                </div>
              ))}
            </div>
          ) : (
            <p className="character-preview-empty-line">
              No armor sources returned.
            </p>
          )}
        </SheetBlock>

        <SheetBlock eyebrow="Coin purse" title="Currency">
          {character.currency ? (
            <div className="character-currency-row">
              {currencyOrder.map((coin) => (
                <span key={coin}>
                  <strong>{character.currency?.[coin] ?? 0}</strong>
                  {coin.toUpperCase()}
                </span>
              ))}
            </div>
          ) : (
            <p className="character-preview-empty-line">
              No currency returned.
            </p>
          )}
        </SheetBlock>
      </div>

      <SheetBlock eyebrow="Inventory" title="Equipment">
        {equipment.length > 0 ? (
          <div className="character-table-wrap">
            <table className="character-sheet-table">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Type</th>
                  <th scope="col">Qty</th>
                  <th scope="col">Equipped</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((item) => (
                  <tr key={item.id}>
                    <td data-label="Item">{item.name}</td>
                    <td data-label="Type">
                      {item.category} / {item.type}
                    </td>
                    <td data-label="Qty">{item.quantity}</td>
                    <td data-label="Equipped">
                      {formatFallback(item.isEquipped)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : character.inventoryWeight.sources.length > 0 ? (
          <>
            <p className="character-preview-empty-line">
              Equipment rows were not returned directly, so this uses the
              inventory weight sources from the character detail response.
            </p>
            <div className="character-table-wrap">
              <table className="character-sheet-table">
                <thead>
                  <tr>
                    <th scope="col">Item</th>
                    <th scope="col">Qty</th>
                    <th scope="col">Weight</th>
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {character.inventoryWeight.sources.map((item) => (
                    <tr key={item.equipmentId}>
                      <td data-label="Item">{item.name}</td>
                      <td data-label="Qty">{item.quantity}</td>
                      <td data-label="Weight">{item.weight} lb</td>
                      <td data-label="Total">{item.total} lb</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="character-preview-empty-line">
            Equipment was not returned by{' '}
            <code>GET /api/characters/{character.id}</code>.
          </p>
        )}
      </SheetBlock>

      <SheetBlock eyebrow="Magic" title="Spellcasting">
        <div className="character-spell-summary">
          <StatTile
            label="Can Cast"
            value={formatFallback(spellcasting.canCastSpells)}
            detail={spellcasting.ability ?? 'No casting ability'}
          />
          <StatTile
            label="Save DC"
            value={spellcasting.spellSaveDc ?? '-'}
            detail="Returned by API"
          />
          <StatTile
            label="Attack Bonus"
            value={formatSigned(spellcasting.spellAttackBonus)}
            detail="Returned by API"
          />
          <StatTile
            label="Selected"
            value={spellcasting.selectedSpellsCount}
            detail={`${spellcasting.selectedCantripsCount} cantrips`}
          />
        </div>

        {character.spellSlots.length > 0 ? (
          <div className="character-pill-list character-pill-list--slots">
            {character.spellSlots.map((slot) => (
              <span key={slot.level}>
                L{slot.level}: {slot.available}/{slot.max}
              </span>
            ))}
          </div>
        ) : null}

        {character.selectedSpells.length > 0 ? (
          <div className="character-spell-list">
            {character.selectedSpells.map((spell) => (
              <article key={spell.id}>
                <strong>{spell.name}</strong>
                <span>
                  {spell.levelLabel} / {spell.school}
                </span>
                <p>
                  {spell.castingTime} / {spell.range} / {spell.duration}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="character-preview-empty-line">
            No selected spells returned.
          </p>
        )}
      </SheetBlock>
    </article>
  );
}

export function CharacterPreviewClient() {
  const [characterId, setCharacterId] = useState(exampleCharacterId);
  const [recentIds, setRecentIds] = useState<string[]>([exampleCharacterId]);
  const [previewState, setPreviewState] = useState<PreviewState>({
    status: 'idle',
  });

  const normalizedCharacterId = useMemo(
    () => characterId.trim(),
    [characterId],
  );

  async function fetchCharacter(nextCharacterId = normalizedCharacterId) {
    if (!/^[1-9]\d*$/.test(nextCharacterId)) {
      setPreviewState({
        status: 'error',
        message: 'Enter a valid positive character ID.',
      });
      return;
    }

    setPreviewState({ status: 'loading' });

    try {
      const response = await fetch(`/api/characters/${nextCharacterId}`, {
        credentials: 'omit',
      });

      if (!response.ok) {
        setPreviewState({
          status: 'error',
          message: getErrorMessage(response.status),
        });
        return;
      }

      const character = (await response.json()) as CharacterPreviewResponse;
      setRecentIds((currentIds) =>
        [
          nextCharacterId,
          ...currentIds.filter((currentId) => currentId !== nextCharacterId),
        ].slice(0, 5),
      );
      setPreviewState({ status: 'success', character });
    } catch {
      setPreviewState({
        status: 'error',
        message:
          'The request failed before the character sheet could be opened.',
      });
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void fetchCharacter();
  }

  function selectRecentId(nextCharacterId: string) {
    setCharacterId(nextCharacterId);
    void fetchCharacter(nextCharacterId);
  }

  return (
    <div className="character-preview-workbench">
      <form className="character-preview-search" onSubmit={handleSubmit}>
        <label htmlFor="character-preview-id">
          <span>Character ID</span>
          <input
            autoComplete="off"
            id="character-preview-id"
            inputMode="numeric"
            list="character-preview-recent-ids"
            min="1"
            onChange={(event) => setCharacterId(event.target.value)}
            placeholder="Example: 42"
            type="number"
            value={characterId}
          />
        </label>
        <datalist id="character-preview-recent-ids">
          {recentIds.map((recentId) => (
            <option key={recentId} value={recentId} />
          ))}
        </datalist>
        <button
          className="button button--primary"
          disabled={previewState.status === 'loading'}
          type="submit"
        >
          {previewState.status === 'loading'
            ? 'Opening sheet...'
            : normalizedCharacterId === exampleCharacterId
              ? 'Open #1771 sheet'
              : 'Open sheet'}
        </button>
      </form>

      {recentIds.length > 0 ? (
        <div
          className="character-preview-recent"
          aria-label="Recent character IDs"
        >
          <span>Recent IDs</span>
          {recentIds.map((recentId) => (
            <button
              key={recentId}
              onClick={() => selectRecentId(recentId)}
              type="button"
            >
              #{recentId}
            </button>
          ))}
        </div>
      ) : null}

      {previewState.status === 'idle' ? (
        <div className="character-preview-state">
          <p className="kicker">Example character ready</p>
          <h2>Open character #1771 to preview the finished sheet.</h2>
          <p>
            The field stays editable for any other ID, but #1771 is set as the
            baseline display sample. The page reads the character detail
            endpoint and renders the data without recalculating derived values
            in the browser.
          </p>
        </div>
      ) : null}

      {previewState.status === 'loading' ? (
        <div className="character-preview-state character-preview-state--loading">
          <p className="kicker">Fetching character</p>
          <h2>Ink is drying on the sheet.</h2>
          <p>
            Loading <code>GET /api/characters/{normalizedCharacterId}</code>.
          </p>
        </div>
      ) : null}

      {previewState.status === 'error' ? (
        <div
          className="character-preview-state character-preview-state--error"
          role="alert"
        >
          <p className="kicker">Could not open sheet</p>
          <h2>{previewState.message}</h2>
          <p>Check that the ID exists, then try again.</p>
        </div>
      ) : null}

      {previewState.status === 'success' ? (
        <CharacterSheet character={previewState.character} />
      ) : null}
    </div>
  );
}
