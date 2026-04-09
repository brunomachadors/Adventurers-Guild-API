'use client';

import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';

import { getGuideAnchorSlug } from '@/app/components/guides/background-guide-utils';
import { spellGlossaryEntries } from '@/app/components/guides/spell-glossary';
import {
  spellDetailResponseFields,
  spellListResponseFields,
} from '@/app/components/guides/spell-response-fields';
import type { SpellDetail, SpellGuideListItem } from '@/app/types/spell';

type SpellsGuideChapterProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectLevel: (level: number) => void;
  onToggle: () => void;
  spellDetailExample: SpellDetail | null;
  spells: SpellGuideListItem[];
};

type GuideFilterSelectProps = {
  compact?: boolean;
  isActive?: boolean;
  label: string;
  onChange: (value: string) => void;
  options: string[];
  value: string;
};

function getSpellLevelAnchor(level: number) {
  return `spells-level-${getGuideAnchorSlug(getSpellLevelLabel(level))}`;
}

function getSpellLevelLabel(level: number) {
  return level === 0 ? 'Cantrips' : `Level ${level}`;
}

function formatSpellComponents(spell: SpellDetail) {
  const labels: string[] = [];

  if (spell.components.verbal) {
    labels.push('V');
  }

  if (spell.components.somatic) {
    labels.push('S');
  }

  if (spell.components.material) {
    labels.push('M');
  }

  return labels.join(', ') || 'None listed';
}

function formatSpellGuideComponents(spell: SpellGuideListItem) {
  const labels: string[] = [];

  if (spell.components.verbal) {
    labels.push('Verbal');
  }

  if (spell.components.somatic) {
    labels.push('Somatic');
  }

  if (spell.components.material) {
    labels.push('Material');
  }

  return labels.join(', ') || 'None listed';
}

function formatSpellClasses(classes: string[]) {
  return classes.length > 0 ? classes.join(', ') : 'Not listed';
}

const castingTimeFilterOptions = [
  'All',
  'Action',
  'Bonus Action',
  'Reaction',
  'Triggered',
  '1+ Minute',
  'Ritual',
];

const durationFilterOptions = [
  'All',
  'Instantaneous',
  '1+ Round',
  '1+ Minute',
  '1+ Hour',
  'Until dispelled',
  'Special',
];

function matchesCastingTimeFilter(
  castingTime: string,
  selectedFilter: string,
) {
  if (selectedFilter === 'All casting times') {
    return true;
  }

  if (selectedFilter === 'All') {
    return true;
  }

  const normalizedCastingTime = castingTime.toLowerCase();

  if (selectedFilter === 'Action') {
    return normalizedCastingTime === 'action';
  }

  if (selectedFilter === 'Bonus Action') {
    return normalizedCastingTime.includes('bonus action');
  }

  if (selectedFilter === 'Reaction') {
    return normalizedCastingTime.startsWith('reaction');
  }

  if (selectedFilter === 'Triggered') {
    return (
      normalizedCastingTime.includes('which you take') ||
      normalizedCastingTime.includes('trigger')
    );
  }

  if (selectedFilter === 'Ritual') {
    return normalizedCastingTime.includes('ritual');
  }

  if (selectedFilter === '1+ Minute') {
    return (
      !normalizedCastingTime.includes('ritual') &&
      (normalizedCastingTime.includes('minute') ||
        normalizedCastingTime.includes('hour'))
    );
  }

  return false;
}

function matchesDurationFilter(duration: string, selectedFilter: string) {
  if (selectedFilter === 'All durations') {
    return true;
  }

  if (selectedFilter === 'All') {
    return true;
  }

  const normalizedDuration = duration.toLowerCase();

  if (selectedFilter === 'Instantaneous') {
    return normalizedDuration.includes('instantaneous');
  }

  if (selectedFilter === '1+ Round') {
    return normalizedDuration.includes('round');
  }

  if (selectedFilter === '1+ Minute') {
    return normalizedDuration.includes('minute');
  }

  if (selectedFilter === '1+ Hour') {
    return normalizedDuration.includes('hour');
  }

  if (selectedFilter === 'Until dispelled') {
    return normalizedDuration.includes('until dispelled');
  }

  if (selectedFilter === 'Special') {
    return normalizedDuration.includes('special');
  }

  return false;
}

function requiresConcentration(duration: string) {
  return duration.toLowerCase().includes('concentration');
}

function GuideFilterSelect({
  compact = false,
  isActive = false,
  label,
  onChange,
  options,
  value,
}: GuideFilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterId = useId();
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, []);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(true);
      return;
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  }

  return (
    <div className="guide-filter-select" ref={rootRef}>
      <span id={`${filterId}-label`} className={compact ? 'sr-only' : undefined}>
        {label}
      </span>
      <button
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${filterId}-label ${filterId}-button`}
        className={`guide-filter-select__trigger${
          isActive ? ' guide-filter-select__trigger--active' : ''
        }${compact ? ' guide-filter-select__trigger--compact' : ' guide-filter-select__trigger--subtle'}`}
        id={`${filterId}-button`}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        onKeyDown={handleKeyDown}
        type="button"
      >
        <span
          className={
            isActive && !compact ? 'guide-filter-select__value--circled' : undefined
          }
        >
          {value}
        </span>
        <strong aria-hidden="true">▾</strong>
      </button>

      {isOpen ? (
        <div className="guide-filter-select__menu" role="presentation">
          <ul
            aria-labelledby={`${filterId}-label`}
            className="guide-filter-select__list"
            role="listbox"
          >
            {options.map((option) => {
              const isSelected = option === value;

              return (
                <li key={option} role="presentation">
                  <button
                    aria-selected={isSelected}
                    className={`guide-filter-select__option${
                      isSelected ? ' guide-filter-select__option--active' : ''
                    }`}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    role="option"
                    type="button"
                  >
                    {option}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function SpellsGuideChapter({
  isOpen,
  onClose,
  onSelectLevel,
  onToggle,
  spellDetailExample,
  spells,
}: SpellsGuideChapterProps) {
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState('All');
  const [selectedCastingTimeFilter, setSelectedCastingTimeFilter] =
    useState('All');
  const [selectedDurationFilter, setSelectedDurationFilter] = useState('All');
  const [requiresConcentrationOnly, setRequiresConcentrationOnly] =
    useState(false);
  const [selectedSpellLevel, setSelectedSpellLevel] = useState(0);
  const [expandedSpellId, setExpandedSpellId] = useState<number | null>(null);
  const [selectedComponentsFilter, setSelectedComponentsFilter] = useState<
    string[]
  >([]);

  const classOptions = useMemo(
    () =>
      ['All', ...new Set(spells.flatMap((spell) => spell.classes))].sort(
        (firstClass, secondClass) => firstClass.localeCompare(secondClass),
      ),
    [spells],
  );

  const schoolOptions = useMemo(
    () =>
      [
        'All',
        ...new Set(spells.map((spell) => spell.school)),
      ].sort((firstSchool, secondSchool) =>
        firstSchool.localeCompare(secondSchool),
      ),
    [spells],
  );

  const componentOptions = ['Verbal', 'Somatic', 'Material'];

  const filteredSpells = useMemo(
    () =>
      spells.filter((spell) => {
        const matchesClass =
          selectedClassFilter === 'All' ||
          spell.classes.includes(selectedClassFilter);
        const matchesSchool =
          selectedSchoolFilter === 'All' ||
          spell.school === selectedSchoolFilter;
        const matchesCastingTime =
          matchesCastingTimeFilter(
            spell.castingTime,
            selectedCastingTimeFilter,
          );
        const matchesDuration = matchesDurationFilter(
          spell.duration,
          selectedDurationFilter,
        );
        const matchesConcentration =
          !requiresConcentrationOnly || requiresConcentration(spell.duration);
        const matchesComponents =
          selectedComponentsFilter.length === 0 ||
          selectedComponentsFilter.every((component) => {
            if (component === 'Verbal') {
              return spell.components.verbal;
            }

            if (component === 'Somatic') {
              return spell.components.somatic;
            }

            if (component === 'Material') {
              return spell.components.material;
            }

            return true;
          });

        return (
          matchesClass &&
          matchesSchool &&
          matchesCastingTime &&
          matchesDuration &&
          matchesConcentration &&
          matchesComponents
        );
      }),
    [
      selectedCastingTimeFilter,
      selectedClassFilter,
      selectedComponentsFilter,
      selectedDurationFilter,
      requiresConcentrationOnly,
      selectedSchoolFilter,
      spells,
    ],
  );

  const spellLevels = Array.from(new Set(spells.map((spell) => spell.level))).sort(
    (firstLevel, secondLevel) => firstLevel - secondLevel,
  );
  const activeLevel = spellLevels.includes(selectedSpellLevel)
    ? selectedSpellLevel
    : spellLevels[0] ?? 0;
  const levelSpells = filteredSpells.filter((spell) => spell.level === activeLevel);
  const hasActiveFilters =
    selectedClassFilter !== 'All' ||
    selectedSchoolFilter !== 'All' ||
    selectedCastingTimeFilter !== 'All' ||
    selectedDurationFilter !== 'All' ||
    requiresConcentrationOnly ||
    selectedComponentsFilter.length > 0;
  const visibleExpandedSpellId = levelSpells.some(
    (spell) => spell.id === expandedSpellId,
  )
    ? expandedSpellId
    : null;

  return (
    <section
      aria-labelledby="spells-heading"
      className="section-block guide-accordion"
      id="spells"
    >
      <h2 className="guide-accordion__heading" id="spells-heading">
        <button
          aria-controls="spells-panel"
          aria-expanded={isOpen}
          className="guide-accordion__toggle"
          onClick={onToggle}
          type="button"
        >
          <span>
            <span className="kicker">Seventh chapter</span>
            <span className="guide-accordion__title">Spells</span>
            <strong aria-hidden="true">{isOpen ? 'Close' : 'Open'}</strong>
          </span>
        </button>
      </h2>

      <div
        aria-hidden={!isOpen}
        className={`guide-accordion__content${
          isOpen ? ' guide-accordion__content--open' : ''
        }`}
        id="spells-panel"
        inert={!isOpen}
        role="region"
      >
        <div className="guide-accordion__scroll">
          <p className="guide-accordion__description">
            Spells are grouped by level so you can compare cantrips and leveled
            magic more easily before drilling into a specific spell detail
            response.
          </p>

          <section
            aria-label="Spell filters"
            className="guide-filter-panel"
            id="spells-filters"
          >
            <div className="guide-filter-panel__header">
              <p className="guide-filter-panel__eyebrow">Spellbook tools</p>
              <h3>Filter the spellbook</h3>
            </div>

            <nav
              aria-label="Spells level index"
              className="guide-card-index guide-card-index--inside-panel spells-level-nav"
              id="spells-level-index"
            >
              <p>Spell level</p>
              <div>
                {spellLevels.length > 0 ? (
                  spellLevels.map((level) => (
                    <a
                      aria-current={level === activeLevel ? 'true' : undefined}
                      href={`#${getSpellLevelAnchor(level)}`}
                      key={level}
                      onClick={(event) => {
                        event.preventDefault();
                        setSelectedSpellLevel(level);
                        onSelectLevel(level);
                      }}
                    >
                      {getSpellLevelLabel(level)}
                    </a>
                  ))
                ) : (
                  <span className="attribute-skill-chip attribute-skill-chip--empty">
                    No spell levels match these filters
                  </span>
                )}
              </div>
            </nav>

            <div className="guide-filter-panel__controls guide-filter-panel__controls--quad">
              <GuideFilterSelect
                isActive={selectedClassFilter !== 'All'}
                label="Class"
                onChange={setSelectedClassFilter}
                options={classOptions}
                value={selectedClassFilter}
              />

              <GuideFilterSelect
                isActive={selectedSchoolFilter !== 'All'}
                label="School"
                onChange={setSelectedSchoolFilter}
                options={schoolOptions}
                value={selectedSchoolFilter}
              />
              <GuideFilterSelect
                isActive={selectedCastingTimeFilter !== 'All'}
                label="Casting Time"
                onChange={setSelectedCastingTimeFilter}
                options={castingTimeFilterOptions}
                value={selectedCastingTimeFilter}
              />

              <GuideFilterSelect
                isActive={selectedDurationFilter !== 'All'}
                label="Duration"
                onChange={setSelectedDurationFilter}
                options={durationFilterOptions}
                value={selectedDurationFilter}
              />
            </div>

            <div className="guide-filter-panel__split-row">
              <div className="guide-filter-panel__field guide-filter-panel__field--split">
                <span>Components</span>
                <div className="guide-filter-panel__chips">
                  {componentOptions.map((component) => {
                    const isSelected =
                      selectedComponentsFilter.includes(component);

                    return (
                      <label
                        className="guide-filter-panel__checkbox-row guide-filter-panel__checkbox-row--chip"
                        key={component}
                      >
                        <input
                          checked={isSelected}
                          onChange={() =>
                            setSelectedComponentsFilter((currentValue) =>
                              currentValue.includes(component)
                                ? currentValue.filter((item) => item !== component)
                                : [...currentValue, component],
                            )
                          }
                          type="checkbox"
                        />
                        <span
                          aria-hidden="true"
                          className="guide-filter-panel__checkbox-mark"
                        />
                        <span>{component}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="guide-filter-panel__field guide-filter-panel__field--split">
                <span>Concentration</span>
                <label className="guide-filter-panel__checkbox-row">
                  <input
                    checked={requiresConcentrationOnly}
                    onChange={(event) =>
                      setRequiresConcentrationOnly(event.target.checked)
                    }
                    type="checkbox"
                  />
                  <span
                    aria-hidden="true"
                    className="guide-filter-panel__checkbox-mark"
                  />
                  <span>Required</span>
                </label>
              </div>
            </div>

            <div className="guide-filter-panel__footer">
              <p className="guide-filter-panel__summary">
                <strong>{levelSpells.length}</strong> of{' '}
                <strong>{filteredSpells.length}</strong> spells shown for the
                current filters
              </p>

              <button
                className="guide-filter-panel__reset"
                disabled={!hasActiveFilters}
                onClick={() => {
                  setSelectedClassFilter('All');
                  setSelectedSchoolFilter('All');
                  setSelectedCastingTimeFilter('All');
                  setSelectedDurationFilter('All');
                  setRequiresConcentrationOnly(false);
                  setSelectedComponentsFilter([]);
                }}
                type="button"
              >
                Reset filters
              </button>
            </div>
          </section>

          <div className="equipment-weapon-groups">
            <section className="species-subspecies spells-guide-table">
              <div className="species-subspecies__heading">
                <p id={getSpellLevelAnchor(activeLevel)}>
                  {spellLevels.length > 0
                    ? getSpellLevelLabel(activeLevel)
                    : 'No matching spells'}
                </p>
                <span>
                  {spellLevels.length > 0
                    ? 'Table view for spells currently listed under this spell level after the active filters are applied.'
                    : 'No spells were found for the current filter combination.'}
                </span>
              </div>

              <div className="species-subspecies__table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Level</th>
                      <th>School</th>
                      <th>Classes</th>
                      <th>Casting Time</th>
                      <th>Range</th>
                      <th>Components</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelSpells.length > 0 ? (
                      levelSpells.map((spell) => {
                        const isExpanded = visibleExpandedSpellId === spell.id;

                        return (
                          <Fragment key={spell.id}>
                            <tr
                              aria-controls={`spell-appendix-${spell.id}`}
                              aria-expanded={isExpanded}
                              className={
                                isExpanded
                                  ? 'spells-guide-table__row spells-guide-table__row--expanded spells-guide-table__row--clickable'
                                  : 'spells-guide-table__row spells-guide-table__row--clickable'
                              }
                              onClick={() =>
                                setExpandedSpellId((currentValue) =>
                                  currentValue === spell.id ? null : spell.id,
                                )
                              }
                              onKeyDown={(event) => {
                                if (
                                  event.key === 'Enter' ||
                                  event.key === ' '
                                ) {
                                  event.preventDefault();
                                  setExpandedSpellId((currentValue) =>
                                    currentValue === spell.id ? null : spell.id,
                                  );
                                }
                              }}
                              role="button"
                              tabIndex={0}
                            >
                              <td data-label="Name">
                                <span
                                  className={`spells-guide-table__name-button${
                                    isExpanded
                                      ? ' spells-guide-table__name-button--active'
                                      : ''
                                  }`}
                                >
                                  <span>{spell.name}</span>
                                </span>
                              </td>
                              <td data-label="Level">{spell.levelLabel}</td>
                              <td data-label="School">{spell.school}</td>
                              <td data-label="Classes">
                                {formatSpellClasses(spell.classes)}
                              </td>
                              <td data-label="Casting Time">{spell.castingTime}</td>
                              <td data-label="Range">{spell.range}</td>
                              <td data-label="Components">
                                {formatSpellGuideComponents(spell)}
                              </td>
                              <td data-label="Duration">{spell.duration}</td>
                            </tr>

                            {isExpanded ? (
                              <tr className="spells-guide-table__appendix-row">
                                <td
                                  className="spells-guide-table__appendix"
                                  colSpan={8}
                                  id={`spell-appendix-${spell.id}`}
                                >
                                  <div className="spells-guide-table__appendix-inner">
                                    <p>Description</p>
                                    <span>{spell.description}</span>
                                  </div>
                                </td>
                              </tr>
                            ) : null}
                          </Fragment>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8}>No spells match the current filters.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section className="background-guide-card__details guide-glossary">
            <p className="guide-glossary__eyebrow">Spell glossary</p>
            <h3>Reading the spellbook</h3>
            <span className="guide-glossary__description">
              Spells mix filtering language and rules language. This glossary keeps
              the core terms close to the table so readers can understand what each
              column and filter is describing.
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
                  {spellGlossaryEntries.map((entry) => (
                    <tr key={entry.term}>
                      <td>{entry.term}</td>
                      <td>
                        <div className="guide-glossary__meaning">
                          <p>{entry.meaning}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <aside className="guide-how-to-use">
            <h3>How to use</h3>
            <p>
              Call <code>GET /api/spells</code> when you need a compact spell
              index for selectors, filters, or grouped browsing by level. Use{' '}
              <code>GET /api/spells/{'{identifier}'}</code> when you need the
              full spell text, casting metadata, allowed classes, and scaling
              entries.
            </p>
            <div className="endpoint-stack">
              <a
                className="endpoint-pill"
                href="https://adventurers-guild-api.vercel.app/api/spells"
                rel="noreferrer"
                target="_blank"
              >
                GET /api/spells
              </a>
              <a
                className="endpoint-pill"
                href="https://adventurers-guild-api.vercel.app/api/spells/fire-bolt"
                rel="noreferrer"
                target="_blank"
              >
                GET /api/spells/{'{identifier}'}
              </a>
            </div>
          </aside>

          <section className="guide-expected-return">
            <div className="section-heading">
              <h3>Expected return</h3>
              <h4>Response shapes</h4>
              <p>
                The list response stays lightweight for catalog views, while the
                detail response adds richer spellcasting context used by sheets,
                character builders, and rules exploration.
              </p>
            </div>

            <div className="response-variant">
              <div className="response-variant__heading">
                <span>List response</span>
                <code>GET /api/spells</code>
              </div>
              <div className="response-field-list">
                {spellListResponseFields.map((field) => (
                  <article className="response-field-card" key={field.name}>
                    <span>{field.name}</span>
                    <p>{field.description}</p>
                    <strong>{field.type}</strong>
                  </article>
                ))}
              </div>

              {levelSpells[0] ? (
                <div className="response-example">
                  <div className="response-example__header">
                    <span>Example JSON</span>
                    <code>200 OK</code>
                  </div>
                  <pre>
                    <code>{JSON.stringify(levelSpells[0], null, 2)}</code>
                  </pre>
                </div>
              ) : null}
            </div>

            <div className="response-variant">
              <div className="response-variant__heading">
                <span>
                  Detail response
                  {spellDetailExample ? `: ${spellDetailExample.name}` : ''}
                </span>
                <code>
                  GET /api/spells/
                  {spellDetailExample ? spellDetailExample.slug : '{identifier}'}
                </code>
              </div>
              <div className="response-field-list">
                {spellDetailResponseFields.map((field) => (
                  <article className="response-field-card" key={field.name}>
                    <span>{field.name}</span>
                    <p>{field.description}</p>
                    <strong>{field.type}</strong>
                  </article>
                ))}
              </div>

              {spellDetailExample ? (
                <div className="response-example">
                  <div className="response-example__header">
                    <span>Example JSON</span>
                    <code>200 OK</code>
                  </div>
                  <pre>
                    <code>
                      {JSON.stringify(
                        {
                          ...spellDetailExample,
                          components: {
                            ...spellDetailExample.components,
                            summary: formatSpellComponents(spellDetailExample),
                          },
                        },
                        null,
                        2,
                      )}
                    </code>
                  </pre>
                </div>
              ) : null}
            </div>
          </section>

          <button
            className="guide-accordion__close"
            onClick={onClose}
            type="button"
          >
            Close Spells chapter
          </button>
        </div>
      </div>
    </section>
  );
}
