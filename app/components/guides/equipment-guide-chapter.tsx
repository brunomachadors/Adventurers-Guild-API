'use client';

import {
  type EquipmentArmorDetails,
  type EquipmentDetail,
  type EquipmentShieldDetails,
  type EquipmentWeaponDetails,
} from '@/app/types/equipment';
import { getGuideAnchorSlug } from '@/app/components/guides/background-guide-utils';
import {
  equipmentDetailResponseFields,
  equipmentListResponseFields,
} from '@/app/components/guides/equipment-response-fields';
import {
  adventuringGearGlossaryDescriptions,
  adventuringGearTypeDescriptions,
} from '@/app/components/guides/adventuring-gear-glossary';
import { armorGlossaryDescriptions } from '@/app/components/guides/armor-glossary';
import {
  weaponMasteryDescriptions,
  weaponPropertyDescriptions,
} from '@/app/components/guides/weapon-glossary';

type EquipmentGuideChapterProps = {
  equipment: EquipmentDetail[];
  isOpen: boolean;
  selectedCategory: string;
  onToggle: () => void;
  onClose: () => void;
  onSelectCategory: (categoryName: string) => void;
};

const equipmentCategoryIndexId = 'equipment-category-index';
const equipmentCategoryOrder = ['Weapon', 'Armor', 'Adventuring Gear'];

function getEquipmentCategoryAnchor(categoryName: string) {
  return `equipment-category-${getGuideAnchorSlug(categoryName)}`;
}

function getEquipmentCategoryLabel(categoryName: string) {
  switch (categoryName) {
    case 'Weapon':
      return 'Weapons';
    case 'Armor':
      return 'Armor';
    default:
      return categoryName;
  }
}

function isWeaponEquipment(
  equipmentItem: EquipmentDetail,
): equipmentItem is EquipmentDetail & { details: EquipmentWeaponDetails } {
  return equipmentItem.details.kind === 'weapon';
}

function isArmorEquipment(
  equipmentItem: EquipmentDetail,
): equipmentItem is EquipmentDetail & { details: EquipmentArmorDetails } {
  return equipmentItem.details.kind === 'armor';
}

function isShieldEquipment(
  equipmentItem: EquipmentDetail,
): equipmentItem is EquipmentDetail & { details: EquipmentShieldDetails } {
  return equipmentItem.details.kind === 'shield' || equipmentItem.category === 'Shield';
}

function getWeaponTableGroups(categoryEquipment: EquipmentDetail[]) {
  const weaponEquipment = categoryEquipment.filter(isWeaponEquipment);

  return [
    {
      key: 'simple-melee',
      title: 'Simple Weapons',
      subtitle: 'Simple Melee Weapons',
      items: weaponEquipment.filter(
        (item) =>
          item.details.weaponCategory === 'Simple' &&
          item.details.attackType === 'Melee',
      ),
    },
    {
      key: 'simple-ranged',
      title: 'Simple Weapons',
      subtitle: 'Simple Ranged Weapons',
      items: weaponEquipment.filter(
        (item) =>
          item.details.weaponCategory === 'Simple' &&
          item.details.attackType === 'Ranged',
      ),
    },
    {
      key: 'martial-melee',
      title: 'Martial Weapons',
      subtitle: 'Martial Melee Weapons',
      items: weaponEquipment.filter(
        (item) =>
          item.details.weaponCategory === 'Martial' &&
          item.details.attackType === 'Melee',
      ),
    },
    {
      key: 'martial-ranged',
      title: 'Martial Weapons',
      subtitle: 'Martial Ranged Weapons',
      items: weaponEquipment.filter(
        (item) =>
          item.details.weaponCategory === 'Martial' &&
          item.details.attackType === 'Ranged',
      ),
    },
  ].filter((group) => group.items.length > 0);
}

function getArmorTableGroups(equipment: EquipmentDetail[]) {
  const armorEquipment = equipment.filter(isArmorEquipment);
  const shieldEquipment = equipment.filter(isShieldEquipment);

  return [
    {
      key: 'light-armor',
      title: 'Light Armor',
      donDoff:
        armorEquipment.find((item) => item.details.armorType === 'Light')?.details
          .donTime ?? null,
      items: armorEquipment.filter((item) => item.details.armorType === 'Light'),
    },
    {
      key: 'medium-armor',
      title: 'Medium Armor',
      donDoff:
        armorEquipment.find((item) => item.details.armorType === 'Medium')?.details
          .donTime ?? null,
      items: armorEquipment.filter((item) => item.details.armorType === 'Medium'),
    },
    {
      key: 'heavy-armor',
      title: 'Heavy Armor',
      donDoff:
        armorEquipment.find((item) => item.details.armorType === 'Heavy')?.details
          .donTime ?? null,
      items: armorEquipment.filter((item) => item.details.armorType === 'Heavy'),
    },
    {
      key: 'shields',
      title: 'Shields',
      donDoff: shieldEquipment[0]?.details.donTime ?? null,
      items: shieldEquipment,
    },
  ].filter((group) => group.items.length > 0);
}

function getAdventuringGearTableGroups(categoryEquipment: EquipmentDetail[]) {
  return Array.from(
    categoryEquipment.reduce<Map<string, EquipmentDetail[]>>((groups, item) => {
      const groupItems = groups.get(item.type) ?? [];
      groupItems.push(item);
      groups.set(item.type, groupItems);
      return groups;
    }, new Map()),
  )
    .sort(([firstType], [secondType]) => firstType.localeCompare(secondType))
    .map(([type, items]) => ({
      key: getGuideAnchorSlug(type),
      title: type,
      items,
    }));
}

function formatWeaponDamage(details: EquipmentWeaponDetails) {
  return `${details.damage.formula} ${details.damage.damageType}`;
}

function formatWeaponProperty(
  property: EquipmentWeaponDetails['properties'][number],
) {
  const notes: string[] = [];

  if (property.range) {
    notes.push(`Range ${property.range.normal}/${property.range.long}`);
  }

  if (property.damage) {
    notes.push(property.damage.formula);
  }

  if (property.note) {
    notes.push(property.note);
  }

  if (property.ammunitionType) {
    notes.push(property.ammunitionType);
  }

  return notes.length > 0
    ? `${property.name} (${notes.join(', ')})`
    : property.name;
}

function formatWeaponProperties(details: EquipmentWeaponDetails) {
  return details.properties.length > 0
    ? details.properties.map((property) => formatWeaponProperty(property)).join(', ')
    : '—';
}

function formatWeight(weight: number | null) {
  if (weight === null) {
    return 'Not listed';
  }

  return `${Number(weight).toString()} lb.`;
}

function formatArmorClass(
  equipmentItem:
    | (EquipmentDetail & { details: EquipmentArmorDetails })
    | (EquipmentDetail & { details: EquipmentShieldDetails }),
) {
  if (equipmentItem.details.kind === 'shield') {
    return `+${equipmentItem.details.armorClassBonus} AC`;
  }

  const dexModifier = equipmentItem.details.armorClass.dexModifier;

  if (!dexModifier.applies) {
    return `${equipmentItem.details.armorClass.base}`;
  }

  if (dexModifier.max === null) {
    return `${equipmentItem.details.armorClass.base} + Dex modifier`;
  }

  return `${equipmentItem.details.armorClass.base} + Dex modifier (max ${dexModifier.max})`;
}

function formatStrengthRequirement(
  equipmentItem: EquipmentDetail & { details: EquipmentArmorDetails },
) {
  return equipmentItem.details.strengthRequirement === null
    ? '-'
    : `${equipmentItem.details.strengthRequirement}`;
}

function formatDonDoffLabel(value: string | null) {
  if (!value) {
    return null;
  }

  return `${value} to Don or Doff`;
}

function getWeaponPropertyGlossary(
  weaponGroups: ReturnType<typeof getWeaponTableGroups>,
) {
  return Array.from(
    new Set(
      weaponGroups.flatMap((group) =>
        group.items.flatMap((item) =>
          item.details.properties.map((property) => property.name),
        ),
      ),
    ),
  )
    .sort((firstProperty, secondProperty) =>
      firstProperty.localeCompare(secondProperty),
    )
    .map((propertyName) => ({
      name: propertyName,
      description:
        weaponPropertyDescriptions[propertyName] ??
        'This property adds a specific handling or combat rule to the weapon.',
    }));
}

function getWeaponMasteryGlossary(
  weaponGroups: ReturnType<typeof getWeaponTableGroups>,
) {
  return Array.from(
    new Set(
      weaponGroups.flatMap((group) =>
        group.items.map((item) => item.details.mastery.name),
      ),
    ),
  )
    .sort((firstMastery, secondMastery) =>
      firstMastery.localeCompare(secondMastery),
    )
    .map((masteryName) => ({
      name: masteryName,
      description:
        weaponMasteryDescriptions[masteryName] ??
        'This mastery grants a distinct combat rider that shapes how the weapon performs in battle.',
    }));
}

function getArmorGlossary() {
  return [
    'Armor Class (AC)',
    'Dex modifier',
    'Dex modifier (max 2)',
    'Strength requirement',
    'Stealth disadvantage',
    'Don or Doff',
    'Shield bonus',
  ].map((term) => ({
    name: term,
    description: armorGlossaryDescriptions[term],
  }));
}

function getAdventuringGearTypeDescription(type: string) {
  return (
    adventuringGearTypeDescriptions[type] ??
    `Items grouped under ${type.toLowerCase()} so similar utility gear is easier to compare.`
  );
}

function getAdventuringGearGlossary() {
  return [
    'Utility item',
    'Tool or kit',
    'Pack',
    'Focus or symbol',
    'Ammunition',
    'Consumable',
  ].map((term) => ({
    name: term,
    description: adventuringGearGlossaryDescriptions[term],
  }));
}

export function EquipmentGuideChapter({
  equipment,
  isOpen,
  selectedCategory,
  onToggle,
  onClose,
  onSelectCategory,
}: EquipmentGuideChapterProps) {
  const equipmentCategories = equipmentCategoryOrder.filter((category) =>
    equipment.some((equipmentItem) => equipmentItem.category === category),
  );
  const activeCategory = equipmentCategories.includes(selectedCategory)
    ? selectedCategory
    : equipmentCategories[0];
  const categoryEquipment = equipment.filter(
    (equipmentItem) => equipmentItem.category === activeCategory,
  );
  const equipmentDetailExample = categoryEquipment[0] ?? equipment[0];
  const weaponTableGroups =
    activeCategory === 'Weapon' ? getWeaponTableGroups(categoryEquipment) : [];
  const armorTableGroups =
    activeCategory === 'Armor' ? getArmorTableGroups(equipment) : [];
  const adventuringGearTableGroups =
    activeCategory === 'Adventuring Gear'
      ? getAdventuringGearTableGroups(categoryEquipment)
      : [];
  const weaponPropertyGlossary = getWeaponPropertyGlossary(weaponTableGroups);
  const weaponMasteryGlossary = getWeaponMasteryGlossary(weaponTableGroups);
  const armorGlossary = getArmorGlossary();
  const adventuringGearGlossary = getAdventuringGearGlossary();

  return (
    <section
      aria-labelledby="equipment-heading"
      className="section-block guide-accordion"
      id="equipment"
    >
      <h2 className="guide-accordion__heading" id="equipment-heading">
        <button
          aria-controls="equipment-panel"
          aria-expanded={isOpen}
          className="guide-accordion__toggle"
          onClick={onToggle}
          type="button"
        >
          <span>
            <span className="kicker">Sixth chapter</span>
            <span className="guide-accordion__title">Equipment</span>
            <strong aria-hidden="true">{isOpen ? 'Close' : 'Open'}</strong>
          </span>
        </button>
      </h2>

      <div
        aria-hidden={!isOpen}
        className={`guide-accordion__content${
          isOpen ? ' guide-accordion__content--open' : ''
        }`}
        id="equipment-panel"
        inert={!isOpen}
        role="region"
      >
        <div className="guide-accordion__scroll">
          <p className="guide-accordion__description">
            Equipment covers weapons, armor, and adventure gear. This chapter is
            organized by category so you can learn what each group represents and
            scan the catalog in table form.
          </p>

          <nav
            aria-label="Equipment category index"
            className="guide-card-index"
            id={equipmentCategoryIndexId}
          >
            <p>Chapter index</p>
            <div>
              {equipmentCategories.map((categoryName) => (
                <a
                  aria-current={categoryName === activeCategory ? 'true' : undefined}
                  href={`#${getEquipmentCategoryAnchor(categoryName)}`}
                  key={categoryName}
                  onClick={(event) => {
                    event.preventDefault();
                    onSelectCategory(categoryName);
                  }}
                >
                  {getEquipmentCategoryLabel(categoryName)}
                </a>
              ))}
            </div>
          </nav>

          {activeCategory === 'Weapon' ? (
            <div className="equipment-weapon-groups">
              <section className="guide-expected-return">
                <div className="section-heading">
                  <h3>Weapons</h3>
                  <p>
                    Weapons are combat tools used to make melee or ranged attacks.
                    The catalog is split into multiple weapon types so it is
                    easier to compare simpler options against more specialized
                    martial choices.
                  </p>
                  <p>
                    After the four tables below, we also explain the main weapon
                    properties and mastery concepts shown in the API.
                  </p>
                </div>
              </section>
              {weaponTableGroups.map((group, groupIndex) => (
                <section className="species-subspecies" key={group.key}>
                  <div className="species-subspecies__heading">
                    <p
                      id={
                        groupIndex === 0
                          ? getEquipmentCategoryAnchor(activeCategory)
                          : undefined
                      }
                    >
                      {group.subtitle}
                    </p>
                    <span>
                      {groupIndex === 0
                        ? `Table view for ${group.subtitle.toLowerCase()}.`
                        : `Table view for ${group.subtitle.toLowerCase()}.`}
                    </span>
                  </div>

                  <div className="species-subspecies__table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Damage</th>
                          <th>Properties</th>
                          <th>Mastery</th>
                          <th>Weight</th>
                          <th>Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((equipmentItem) => (
                          <tr key={equipmentItem.id}>
                            <td data-label="Name">{equipmentItem.name}</td>
                            <td data-label="Damage">
                              {formatWeaponDamage(equipmentItem.details)}
                            </td>
                            <td data-label="Properties">
                              {formatWeaponProperties(equipmentItem.details)}
                            </td>
                            <td data-label="Mastery">
                              {equipmentItem.details.mastery.name}
                            </td>
                            <td data-label="Weight">
                              {formatWeight(equipmentItem.weight)}
                            </td>
                            <td data-label="Cost">{equipmentItem.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          ) : null}

          {activeCategory === 'Weapon' ? (
            <>
              <section className="guide-expected-return">
                <div className="section-heading">
                  <h3>Properties and Mastery</h3>
                  <p>
                    Weapon properties describe how a weapon behaves in play, such
                    as whether it can be thrown, used with Dexterity, or wielded
                    in two hands.
                  </p>
                  <p>
                    Weapon mastery is a separate combat concept. It represents
                    the tactical rider tied to a weapon, such as pushing,
                    toppling, or slowing a target after a successful hit.
                  </p>
                </div>
              </section>

              {weaponPropertyGlossary.length > 0 ? (
                <section className="background-guide-card__details guide-glossary">
                  <p className="guide-glossary__eyebrow">Weapon glossary</p>
                  <h3>Weapon Properties</h3>
                  <span className="guide-glossary__description">
                    Properties describe how a weapon is handled in play. They
                    explain extra rules like throwing distance, finesse use, or
                    two-handed requirements.
                  </span>
                  <div className="guide-glossary__table-wrap">
                    <table className="guide-glossary__table">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Meaning</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weaponPropertyGlossary.map((property) => (
                          <tr key={property.name}>
                            <td data-label="Property">{property.name}</td>
                            <td data-label="Meaning">
                              <div className="guide-glossary__meaning">
                                <p>{property.description}</p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}

              {weaponMasteryGlossary.length > 0 ? (
                <section className="background-guide-card__details guide-glossary">
                  <p className="guide-glossary__eyebrow">Weapon glossary</p>
                  <h3>Weapon Mastery</h3>
                  <span className="guide-glossary__description">
                    Mastery is the tactical effect tied to a weapon. It adds an
                    extra combat payoff after a successful hit, such as slowing,
                    toppling, pushing, or pressuring the target.
                  </span>
                  <div className="guide-glossary__table-wrap">
                    <table className="guide-glossary__table">
                      <thead>
                        <tr>
                          <th>Mastery</th>
                          <th>Meaning</th>
                        </tr>
                      </thead>
                      <tbody>
                        {weaponMasteryGlossary.map((mastery) => (
                          <tr key={mastery.name}>
                            <td data-label="Mastery">{mastery.name}</td>
                            <td data-label="Meaning">
                              <div className="guide-glossary__meaning">
                                <p>{mastery.description}</p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}
            </>
          ) : null}

          {activeCategory === 'Armor' ? (
            <div className="equipment-weapon-groups">
              <section className="guide-expected-return">
                <div className="section-heading">
                  <h3>Armor</h3>
                  <p>
                    Armor is defensive equipment that helps protect a character
                    in combat. The catalog is split into light, medium, heavy,
                    and shield tables so it is easier to compare protection,
                    weight, stealth impact, and strength requirements.
                  </p>
                  <p>
                    The tables below focus on the practical fields players usually
                    compare first when choosing defensive gear.
                  </p>
                </div>
              </section>
              {armorTableGroups.map((group, groupIndex) => (
                <section className="species-subspecies" key={group.key}>
                  <div className="species-subspecies__heading">
                    <p
                      id={
                        groupIndex === 0
                          ? getEquipmentCategoryAnchor(activeCategory)
                          : undefined
                      }
                    >
                      {formatDonDoffLabel(group.donDoff)
                        ? `${group.title} (${formatDonDoffLabel(group.donDoff)})`
                        : group.title}
                    </p>
                    <span>
                      {group.title === 'Shields'
                        ? 'Shields are grouped here with armor because they belong to the same defensive equipment family in player-facing navigation.'
                        : `${group.title} table within the armor section.`}
                    </span>
                  </div>

                  <div className="species-subspecies__table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Armor Class</th>
                          <th>Strength</th>
                          <th>Stealth</th>
                          <th>Weight</th>
                          <th>Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((equipmentItem) => (
                          <tr key={equipmentItem.id}>
                            <td data-label="Name">{equipmentItem.name}</td>
                            <td data-label="Armor Class">
                              {formatArmorClass(equipmentItem)}
                            </td>
                            <td data-label="Strength">
                              {isArmorEquipment(equipmentItem)
                                ? formatStrengthRequirement(equipmentItem)
                                : '-'}
                            </td>
                            <td data-label="Stealth">
                              {isArmorEquipment(equipmentItem)
                                ? equipmentItem.details.stealthDisadvantage
                                  ? 'Disadvantage'
                                  : '-'
                                : '-'}
                            </td>
                            <td data-label="Weight">
                              {formatWeight(equipmentItem.weight)}
                            </td>
                            <td data-label="Cost">{equipmentItem.cost}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}

              {armorGlossary.length > 0 ? (
                <section className="background-guide-card__details guide-glossary">
                  <p className="guide-glossary__eyebrow">Armor glossary</p>
                  <h3>Armor Terms</h3>
                  <span className="guide-glossary__description">
                    These terms explain the main defensive concepts shown in the
                    armor tables, so it is easier to compare protection, mobility,
                    and equipment handling.
                  </span>
                  <div className="guide-glossary__table-wrap">
                    <table className="guide-glossary__table">
                      <thead>
                        <tr>
                          <th>Term</th>
                          <th>Meaning</th>
                        </tr>
                      </thead>
                      <tbody>
                        {armorGlossary.map((term) => (
                          <tr key={term.name}>
                            <td data-label="Term">{term.name}</td>
                            <td data-label="Meaning">
                              <div className="guide-glossary__meaning">
                                <p>{term.description}</p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}
            </div>
          ) : null}

          {activeCategory === 'Adventuring Gear' ? (
            <div className="equipment-weapon-groups">
              <section className="guide-expected-return">
                <div className="section-heading">
                  <h3>Adventuring Gear</h3>
                  <p>
                    Adventuring gear covers the practical items that support life
                    on the road: packs, tools, ammunition, magical foci, and
                    other utility equipment used outside the core weapon and armor
                    categories.
                  </p>
                  <p>
                    The tables below group similar gear together by type so it is
                    easier to compare purpose, description, cost, and carry
                    weight at a glance.
                  </p>
                </div>
              </section>

              {adventuringGearTableGroups.map((group, groupIndex) => (
                <section className="species-subspecies" key={group.key}>
                  <div className="species-subspecies__heading">
                    <p
                      id={
                        groupIndex === 0
                          ? getEquipmentCategoryAnchor(activeCategory)
                          : undefined
                      }
                    >
                      {group.title}
                    </p>
                    <span>{getAdventuringGearTypeDescription(group.title)}</span>
                  </div>

                  <div className="species-subspecies__table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Cost</th>
                          <th>Weight</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((equipmentItem) => (
                          <tr key={equipmentItem.id}>
                            <td data-label="Name">{equipmentItem.name}</td>
                            <td data-label="Description">
                              {equipmentItem.description}
                            </td>
                            <td data-label="Cost">{equipmentItem.cost}</td>
                            <td data-label="Weight">
                              {formatWeight(equipmentItem.weight)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}

              {adventuringGearGlossary.length > 0 ? (
                <section className="background-guide-card__details guide-glossary">
                  <p className="guide-glossary__eyebrow">Adventuring gear glossary</p>
                  <h3>Common Gear Concepts</h3>
                  <span className="guide-glossary__description">
                    These terms make the non-combat side of the equipment catalog
                    easier to read, especially when comparing bundles, tools, and
                    support items.
                  </span>
                  <div className="guide-glossary__table-wrap">
                    <table className="guide-glossary__table">
                      <thead>
                        <tr>
                          <th>Term</th>
                          <th>Meaning</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adventuringGearGlossary.map((term) => (
                          <tr key={term.name}>
                            <td data-label="Term">{term.name}</td>
                            <td data-label="Meaning">
                              <div className="guide-glossary__meaning">
                                <p>{term.description}</p>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ) : null}
            </div>
          ) : null}

          <aside className="guide-how-to-use">
            <h3>How to use</h3>
            <p>
              Call <code>GET /api/equipment</code> when you need a compact catalog
              for browsing, filtering, or selection UIs. Use{' '}
              <code>GET /api/equipment/{'{identifier}'}</code> when you need the
              full description, typed details, modifiers, and effects for a
              specific item.
            </p>
            <div className="endpoint-stack">
              <a
                className="endpoint-pill"
                href="https://adventurers-guild-api.vercel.app/api/equipment"
                rel="noreferrer"
                target="_blank"
              >
                GET /api/equipment
              </a>
              <a
                className="endpoint-pill"
                href="https://adventurers-guild-api.vercel.app/api/equipment/longsword"
                rel="noreferrer"
                target="_blank"
              >
                GET /api/equipment/{'{identifier}'}
              </a>
            </div>
          </aside>

          <section className="guide-expected-return">
            <div className="section-heading">
              <h3>Expected return</h3>
              <h4>Response shapes</h4>
              <p>
                The list response stays lightweight, while the detail response
                exposes the richer item payload used by character and combat
                flows.
              </p>
            </div>

            <div className="response-variant">
              <div className="response-variant__heading">
                <span>List response</span>
                <code>GET /api/equipment</code>
              </div>
              <div className="response-field-list">
                {equipmentListResponseFields.map((field) => (
                  <article className="response-field-card" key={field.name}>
                    <span>{field.name}</span>
                    <p>{field.description}</p>
                    <strong>{field.type}</strong>
                  </article>
                ))}
              </div>
              <div className="response-example">
                <div className="response-example__header">
                  <span>Example JSON</span>
                  <code>200 OK</code>
                </div>
                <pre>
                  <code>
                    {JSON.stringify(
                      equipment.map((equipmentItem) => ({
                        id: equipmentItem.id,
                        name: equipmentItem.name,
                        category: equipmentItem.category,
                        type: equipmentItem.type,
                        cost: equipmentItem.cost,
                        weight: equipmentItem.weight,
                        isMagical: equipmentItem.isMagical,
                      })),
                      null,
                      2,
                    )}
                  </code>
                </pre>
              </div>
            </div>

            {equipmentDetailExample ? (
              <div className="response-variant">
                <div className="response-variant__heading">
                  <span>Detail response: {equipmentDetailExample.name}</span>
                  <code>GET /api/equipment/{equipmentDetailExample.slug}</code>
                </div>
                <div className="response-field-list">
                  {equipmentDetailResponseFields.map((field) => (
                    <article className="response-field-card" key={field.name}>
                      <span>{field.name}</span>
                      <p>{field.description}</p>
                      <strong>{field.type}</strong>
                    </article>
                  ))}
                </div>
                <div className="response-example">
                  <div className="response-example__header">
                    <span>Example JSON</span>
                    <code>200 OK</code>
                  </div>
                  <pre>
                    <code>{JSON.stringify(equipmentDetailExample, null, 2)}</code>
                  </pre>
                </div>
              </div>
            ) : null}
          </section>

          <button className="guide-accordion__close" onClick={onClose} type="button">
            Close Equipment chapter
          </button>
        </div>
      </div>
    </section>
  );
}
