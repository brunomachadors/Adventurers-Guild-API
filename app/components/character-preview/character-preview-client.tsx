'use client';

import Image from 'next/image';
import { useMemo, useState, type FormEvent, type ReactNode } from 'react';

import type {
  CharacterAbilityModifiers,
  CharacterAbilityScores,
  CharacterEquipmentItem,
  CharacterResponseBody,
  CharacterWeaponAttack,
  CharacterWeaponAttackMode,
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
const exampleCharacterId = '1871';
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

function formatSheetFieldValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '\u00a0';
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

function formatWeaponAttackRange(
  attackType: string,
  range: EquipmentRange | null,
) {
  const formattedRange = formatWeaponRange(range);

  if (attackType.toLowerCase() === 'melee' && range) {
    return `Melee / ${formattedRange}`;
  }

  return formattedRange;
}

function formatWeaponAttackTypeLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function formatWeaponAttackModeLabel(mode: CharacterWeaponAttackMode) {
  const modeLabel =
    mode.mode === 'thrown'
      ? 'Thrown'
      : mode.mode === 'versatile'
        ? 'Versatile'
        : formatWeaponAttackTypeLabel(mode.attackType);
  const attackTypeLabel = formatWeaponAttackTypeLabel(mode.attackType);

  if (modeLabel.toLowerCase() === attackTypeLabel.toLowerCase()) {
    return modeLabel;
  }

  return `${modeLabel} / ${attackTypeLabel}`;
}

function getRenderedWeaponAttackModes(
  attack: CharacterWeaponAttack,
): CharacterWeaponAttackMode[] {
  if (attack.attackModes.length > 0) {
    return attack.attackModes;
  }

  return [
    {
      mode: attack.attackType,
      attackType: attack.attackType,
      ability: attack.ability,
      isProficient: attack.isProficient,
      abilityModifier: attack.abilityModifier,
      proficiencyBonus: attack.proficiencyBonus,
      attackBonus: attack.attackBonus,
      damage: attack.damage,
      range: attack.range,
    },
  ];
}

const weaponPropertyDescriptions: Record<string, string> = {
  ammunition:
    'You can make a ranged attack only if you have ammunition to fire.',
  finesse: 'Choose Strength or Dexterity for the attack and damage rolls.',
  heavy: 'Small creatures have disadvantage on attack rolls with this weapon.',
  light: 'Ideal for two-weapon fighting with another Light weapon.',
  loading: 'You can fire only one piece of ammunition from it when you attack.',
  range: 'This weapon can attack targets at a distance.',
  ranged: 'This weapon can attack targets at a distance.',
  reach: 'This weapon adds 5 feet to your reach when you attack.',
  special: 'This weapon has special rules described by its equipment entry.',
  thrown: 'You can throw this weapon to make a ranged attack.',
  'two-handed': 'This weapon requires two hands when you attack with it.',
  versatile:
    'This weapon can be used with one or two hands for different damage.',
};

const weaponMasteryDescriptions: Record<string, string> = {
  cleave:
    'After you hit a creature, you can make another attack against a second creature within 5 feet of it.',
  graze:
    'If your attack roll misses, you still deal damage equal to the ability modifier used for the attack.',
  nick: 'You can make the extra attack of the Light property as part of the Attack action.',
  push: 'If you hit, you can push the target up to 10 feet straight away from yourself.',
  sap: 'If you hit, the target has disadvantage on its next attack roll before your next turn.',
  slow: 'If you hit, you can reduce the target speed by 10 feet until your next turn.',
  topple:
    'If you hit, you can force the target to make a Constitution save or fall prone.',
  vex: 'If you hit, you have advantage on your next attack roll against the target before your next turn.',
};

function getWeaponPropertySlug(property: string) {
  const propertySlug = property
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const normalizedProperty = property.toLowerCase();
  const knownPropertySlugs = [
    'ammunition',
    'finesse',
    'heavy',
    'light',
    'loading',
    'range',
    'ranged',
    'reach',
    'thrown',
    'two-handed',
    'versatile',
    'special',
  ];
  const matchedPropertySlug = knownPropertySlugs.find(
    (knownSlug) =>
      normalizedProperty.includes(knownSlug.replace('-', ' ')) ||
      propertySlug.includes(knownSlug),
  );

  return matchedPropertySlug ?? propertySlug;
}

function getWeaponPropertyClassName(property: string) {
  const propertySlug = getWeaponPropertySlug(property);

  return `character-weapon-property character-weapon-property--${propertySlug}`;
}

function getWeaponMasterySlug(mastery: string) {
  return mastery
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function getWeaponMasteryClassName(mastery: string) {
  const masterySlug = getWeaponMasterySlug(mastery);

  return `character-weapon-mastery character-weapon-mastery--${masterySlug}`;
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
          const isActive = item.matches.some((match) =>
            activeItemSet.has(match),
          );

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
    ...character.savingThrows.map(
      (savingThrow) => savingThrow.proficiencyBonus,
    ),
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
  const [expandedProperties, setExpandedProperties] = useState<Set<string>>(
    () => new Set(),
  );
  const equipment = character.equipment ?? [];
  const featureGroups = getCharacterFeatures(character);
  const proficiencyBonus = getReturnedProficiencyBonus(character);
  const spellcasting = character.spellcastingSummary;
  const renderedWeaponAttacks = character.weaponAttacks.map((attack) => ({
    attack,
    attackModes: getRenderedWeaponAttackModes(attack),
  }));

  function toggleExpandedProperty(propertyKey: string) {
    setExpandedProperties((currentProperties) => {
      const nextProperties = new Set(currentProperties);

      if (nextProperties.has(propertyKey)) {
        nextProperties.delete(propertyKey);
      } else {
        nextProperties.add(propertyKey);
      }

      return nextProperties;
    });
  }

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
              <div className="character-sheet__masthead-field character-sheet__masthead-field--line">
                <dt>Class</dt>
                <dd>{formatSheetFieldValue(character.classDetails?.name)}</dd>
              </div>
              <div className="character-sheet__masthead-field character-sheet__masthead-field--line">
                <dt>Species</dt>
                <dd>{formatSheetFieldValue(character.speciesDetails?.name)}</dd>
              </div>
              <div className="character-sheet__masthead-field character-sheet__masthead-field--line">
                <dt>Background</dt>
                <dd>
                  {formatSheetFieldValue(character.backgroundDetails?.name)}
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
            className="character-sheet-block--flat character-sheet-block--compact-title character-sheet-block--training-table"
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
            className="character-sheet-block--flat character-sheet-block--compact-title character-sheet-block--training-table"
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
          <SheetBlock className="character-sheet-block--traits" title="Traits">
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
        <SheetBlock
          className="character-sheet-block--inked"
          eyebrow="Training"
          title="Proficiencies"
        >
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

        <SheetBlock
          className="character-sheet-block--inked"
          eyebrow="Combat"
          title="Attacks"
        >
          {renderedWeaponAttacks.length > 0 ? (
            <div className="character-attack-list">
              {renderedWeaponAttacks.map(({ attack, attackModes }) => {
                const masterySlug = attack.mastery.slug;
                const masteryDescription =
                  weaponMasteryDescriptions[masterySlug];
                const masteryKey = `${attack.equipmentId}-mastery-${masterySlug}`;
                const isMasteryExpanded = expandedProperties.has(masteryKey);

                return (
                  <article
                    className="character-attack-card"
                    key={attack.equipmentId}
                  >
                    <header>
                      <strong>{attack.name}</strong>
                    </header>

                    <table className="character-attack-mode-table">
                      <thead>
                        <tr>
                          <th scope="col">Attack</th>
                          <th scope="col">Damage</th>
                          <th scope="col">Range</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attackModes.map((attackMode) => (
                          <tr key={`${attack.equipmentId}-${attackMode.mode}`}>
                            <td data-label="Attack">
                              <span>
                                {formatWeaponAttackModeLabel(attackMode)}
                              </span>
                              <strong>
                                {formatSigned(attackMode.attackBonus)}
                              </strong>
                            </td>
                            <td data-label="Damage">
                              <strong>{attackMode.damage.formula}</strong>
                              <span>{attackMode.damage.damageType}</span>
                            </td>
                            <td data-label="Range">
                              <strong>
                                {formatWeaponAttackRange(
                                  attackMode.attackType,
                                  attackMode.range,
                                )}
                              </strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="character-attack-card__traits">
                      <div className="character-attack-card__properties">
                        <small>Properties</small>
                        <div>
                          {attack.properties.length > 0 ? (
                            attack.properties.map((property) => {
                              const propertySlug =
                                getWeaponPropertySlug(property);
                              const propertyDescription =
                                weaponPropertyDescriptions[propertySlug];
                              const propertyKey = `${attack.equipmentId}-${property}`;
                              const isExpanded =
                                expandedProperties.has(propertyKey);

                              if (propertyDescription) {
                                return (
                                  <button
                                    aria-expanded={isExpanded}
                                    className={`${getWeaponPropertyClassName(
                                      property,
                                    )} character-weapon-property--expandable`}
                                    key={propertyKey}
                                    onClick={() =>
                                      toggleExpandedProperty(propertyKey)
                                    }
                                    type="button"
                                  >
                                    <span>{property}</span>
                                    {isExpanded ? (
                                      <small>{propertyDescription}</small>
                                    ) : null}
                                  </button>
                                );
                              }

                              return (
                                <span
                                  className={getWeaponPropertyClassName(
                                    property,
                                  )}
                                  key={propertyKey}
                                >
                                  {property}
                                </span>
                              );
                            })
                          ) : (
                            <span className="character-weapon-property">
                              None returned
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="character-attack-card__mastery">
                        <small>Mastery</small>
                        <div>
                          <button
                            aria-expanded={isMasteryExpanded}
                            className={`${getWeaponMasteryClassName(
                              masterySlug,
                            )} character-weapon-mastery--expandable`}
                            onClick={() => toggleExpandedProperty(masteryKey)}
                            type="button"
                          >
                            <span>{attack.mastery.name}</span>
                            {isMasteryExpanded && masteryDescription ? (
                              <small>{masteryDescription}</small>
                            ) : null}
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="character-preview-empty-line">
              No weapon attacks returned.
            </p>
          )}
        </SheetBlock>
      </div>

      <div className="character-sheet__ledger-row">
        <SheetBlock
          className="character-sheet-block--inked character-sheet-block--currency"
          eyebrow="Coin purse"
          title="Currency"
        >
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

        <SheetBlock
          className="character-sheet-block--inked character-sheet-block--sheet-table character-sheet-block--equipment-compact"
          eyebrow="Inventory"
          title="Equipment"
        >
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
      </div>

      <SheetBlock
        className="character-sheet-block--inked character-sheet-block--spellcasting"
        eyebrow="Magic"
        title="Spellcasting"
      >
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
              ? `Open #${exampleCharacterId} sheet`
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
          <h2>
            Open character #{exampleCharacterId} to preview the finished sheet.
          </h2>
          <p>
            The field stays editable for any other ID, but #{exampleCharacterId}{' '}
            is set as the baseline display sample. The page reads the character
            detail endpoint and renders the data without recalculating derived
            values in the browser.
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
