'use client';

import Image from 'next/image';
import { useState, type MouseEvent } from 'react';

import { apiResources } from '@/app/data/api-resources';
import type { Attribute } from '@/app/types/attribute';
import type { ClassDetail } from '@/app/types/class';
import type { SkillDetail } from '@/app/types/skill';
import charismaIcon from '@/public/images/attributes/charisma.png';
import constitutionIcon from '@/public/images/attributes/constitution.png';
import dexterityIcon from '@/public/images/attributes/dexterity.png';
import intelligenceIcon from '@/public/images/attributes/intelligence.png';
import strengthIcon from '@/public/images/attributes/strength.png';
import wisdomIcon from '@/public/images/attributes/wisdom.png';
import acrobaticsIcon from '@/public/images/skills/acrobatics.png';
import animalHandlingIcon from '@/public/images/skills/animal-handling.png';
import arcanaIcon from '@/public/images/skills/arcana.png';
import athleticsIcon from '@/public/images/skills/athletics.png';
import deceptionIcon from '@/public/images/skills/deception.png';
import historyIcon from '@/public/images/skills/history.png';
import insightIcon from '@/public/images/skills/insight.png';
import intimidationIcon from '@/public/images/skills/intimidation.png';
import investigationIcon from '@/public/images/skills/investigation.png';
import medicineIcon from '@/public/images/skills/medicine.png';
import natureIcon from '@/public/images/skills/nature.png';
import perceptionIcon from '@/public/images/skills/perception.png';
import performanceIcon from '@/public/images/skills/performance.png';
import persuasionIcon from '@/public/images/skills/persuasion.png';
import religionIcon from '@/public/images/skills/religion.png';
import sleightOfHandIcon from '@/public/images/skills/sleight-of-hand.png';
import stealthIcon from '@/public/images/skills/stealth.png';
import survivalIcon from '@/public/images/skills/survival.png';

type GuidesAccordionProps = {
  attributes: Attribute[];
  classes: ClassDetail[];
  skills: SkillDetail[];
};

const guideResourceOrder = [
  'attributes',
  'skills',
  'classes',
  'species',
  'backgrounds',
  'equipment',
  'spells',
  'auth',
  'characters',
];

const guideResources = guideResourceOrder.flatMap((slug) => {
  const resource = apiResources.find((apiResource) => apiResource.slug === slug);

  return resource ? [resource] : [];
});

const attributeIcons = {
  STR: {
    alt: 'Strength attribute icon',
    src: strengthIcon,
  },
  DEX: {
    alt: 'Dexterity attribute icon',
    src: dexterityIcon,
  },
  CON: {
    alt: 'Constitution attribute icon',
    src: constitutionIcon,
  },
  INT: {
    alt: 'Intelligence attribute icon',
    src: intelligenceIcon,
  },
  WIS: {
    alt: 'Wisdom attribute icon',
    src: wisdomIcon,
  },
  CHA: {
    alt: 'Charisma attribute icon',
    src: charismaIcon,
  },
};

const skillIcons = {
  Athletics: {
    alt: 'Athletics skill icon',
    src: athleticsIcon,
  },
  Acrobatics: {
    alt: 'Acrobatics skill icon',
    src: acrobaticsIcon,
  },
  'Animal Handling': {
    alt: 'Animal Handling skill icon',
    src: animalHandlingIcon,
  },
  Arcana: {
    alt: 'Arcana skill icon',
    src: arcanaIcon,
  },
  Deception: {
    alt: 'Deception skill icon',
    src: deceptionIcon,
  },
  History: {
    alt: 'History skill icon',
    src: historyIcon,
  },
  Insight: {
    alt: 'Insight skill icon',
    src: insightIcon,
  },
  Intimidation: {
    alt: 'Intimidation skill icon',
    src: intimidationIcon,
  },
  Investigation: {
    alt: 'Investigation skill icon',
    src: investigationIcon,
  },
  Medicine: {
    alt: 'Medicine skill icon',
    src: medicineIcon,
  },
  Nature: {
    alt: 'Nature skill icon',
    src: natureIcon,
  },
  Perception: {
    alt: 'Perception skill icon',
    src: perceptionIcon,
  },
  Performance: {
    alt: 'Performance skill icon',
    src: performanceIcon,
  },
  Persuasion: {
    alt: 'Persuasion skill icon',
    src: persuasionIcon,
  },
  Religion: {
    alt: 'Religion skill icon',
    src: religionIcon,
  },
  'Sleight of Hand': {
    alt: 'Sleight of Hand skill icon',
    src: sleightOfHandIcon,
  },
  Stealth: {
    alt: 'Stealth skill icon',
    src: stealthIcon,
  },
  Survival: {
    alt: 'Survival skill icon',
    src: survivalIcon,
  },
};

const classImages: Record<string, { alt: string; src: string }> = {
  Barbarian: {
    alt: 'Barbarian warrior standing in a mountainous fantasy landscape',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775558574/adventurers/classes/Guerreiro_ba%CC%81rbaro_em_paisagem_montanhosa_n1t1mm.png',
  },
  Bard: {
    alt: 'Charming bard performing inside a fantasy tavern',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775560844/adventurers/classes/Bardo_encantador_na_taverna_bn7ua5.png',
  },
  Cleric: {
    alt: 'Cleric praying inside an ancient cathedral',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775561564/adventurers/classes/Cle%CC%81rigo_em_orac%CC%A7a%CC%83o_na_catedral_antiga_yp2wxg.png',
  },
  Druid: {
    alt: 'Half-elf druid standing inside a lush fantasy forest',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775561881/adventurers/classes/Druida_meio-elfo_na_floresta_exuberante_rejo6r.png',
  },
  Fighter: {
    alt: 'Dwarf fighter standing on a fantasy battlefield',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775563032/adventurers/classes/Guerreiro_ana%CC%83o_em_campo_de_batalha_xohlz0.png',
  },
  Monk: {
    alt: 'Monk meditating inside a mountainous temple',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775562372/adventurers/classes/Monge_meditando_no_templo_montanhoso_k73tsn.png',
  },
  Paladin: {
    alt: 'Paladin standing at the entrance of a cathedral',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775562621/adventurers/classes/Paladino_na_entrada_da_catedral_mum3dd.png',
  },
  Ranger: {
    alt: 'Elven ranger archer standing in the shadows of a forest',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775562799/adventurers/classes/Elfa_arqueira_nas_sombras_da_floresta_ka8zqd.png',
  },
  Rogue: {
    alt: 'Halfling rogue counting coins inside a tavern',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775562930/adventurers/classes/Ladra%CC%83o_halfling_na_taverna_contar_moedas_eqaiyz.png',
  },
  Sorcerer: {
    alt: 'Draconic sorcerer casting magic in battle',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775563147/adventurers/classes/Feiticeiro_draco%CC%82nico_em_ac%CC%A7a%CC%83o_ma%CC%81gica_bw775k.png',
  },
  Warlock: {
    alt: 'Tiefling warlock wearing gold and green fantasy attire',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775563473/adventurers/classes/Mulher_tiefling_em_traje_dourado_e_verde_slvzxe.png',
  },
  Wizard: {
    alt: 'Wizard losing control of a spell inside a magical library',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775564051/adventurers/classes/Feitic%CC%A7o_descontrolado_na_biblioteca_ma%CC%81gica_uty1py.png',
  },
};

const attributeResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the attribute.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Full attribute name, such as Strength or Dexterity.',
  },
  {
    name: 'shortname',
    type: 'string',
    description: 'Short attribute code used across character data.',
  },
  {
    name: 'description',
    type: 'string',
    description: 'API description explaining what the attribute represents.',
  },
  {
    name: 'skills',
    type: 'string[]',
    description: 'Skill names currently associated with this attribute.',
  },
];

const skillListResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the skill.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Skill name returned in the compact skill list.',
  },
];

const skillDetailResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the skill.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Skill name used as the readable identifier.',
  },
  {
    name: 'attribute',
    type: 'string',
    description: 'Short name of the related attribute, such as STR or DEX.',
  },
  {
    name: 'description',
    type: 'string',
    description: 'API description explaining what the skill represents.',
  },
  {
    name: 'exampleofuse',
    type: 'string',
    description: 'Short gameplay example for when this skill is used.',
  },
  {
    name: 'commonclasses',
    type: 'string[]',
    description: 'Class names commonly associated with this skill.',
  },
];

function getSkillAnchor(skillName: string) {
  return `skill-${skillName
    .toLowerCase()
    .replaceAll('&', 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')}`;
}

function getAttributeAnchor(attributeShortname: string) {
  return `attribute-${attributeShortname.toLowerCase()}`;
}

export function GuidesAccordion({
  attributes,
  classes,
  skills,
}: GuidesAccordionProps) {
  const [isAttributesOpen, setIsAttributesOpen] = useState(true);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isClassesOpen, setIsClassesOpen] = useState(false);
  const skillDetailExample =
    skills.find((skill) => skill.name === 'Athletics') ?? skills[0];

  function toggleAttributes() {
    setIsAttributesOpen((currentValue) => !currentValue);
  }

  function toggleSkills() {
    setIsSkillsOpen((currentValue) => !currentValue);
  }

  function toggleClasses() {
    setIsClassesOpen((currentValue) => !currentValue);
  }

  function openSkillCard(
    event: MouseEvent<HTMLAnchorElement>,
    skillName: string,
  ) {
    const skillAnchor = getSkillAnchor(skillName);

    event.preventDefault();
    setIsSkillsOpen(true);

    window.requestAnimationFrame(() => {
      document.getElementById(skillAnchor)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      window.history.replaceState(null, '', `#${skillAnchor}`);
    });
  }

  function openAttributeCard(
    event: MouseEvent<HTMLAnchorElement>,
    attributeShortname: string,
  ) {
    const attributeAnchor = getAttributeAnchor(attributeShortname);

    event.preventDefault();
    setIsAttributesOpen(true);

    window.requestAnimationFrame(() => {
      document.getElementById(attributeAnchor)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      window.history.replaceState(null, '', `#${attributeAnchor}`);
    });
  }

  return (
    <>
      <section className="section-block guide-grimoire-cover">
        <div className="section-heading">
          <h1>Guild grimoire</h1>
          <p className="kicker">Choose a chapter from the codex</p>
          <p>
            Open a chapter to study the lore behind each API resource. The
            first pages are already inked, while the sealed chapters will be
            expanded as the project grows.
          </p>
        </div>

        <nav className="guide-submenu" aria-label="Guide chapters">
          {guideResources.map((resource) => {
            const isAttributes = resource.slug === 'attributes';
            const isSkills = resource.slug === 'skills';
            const isClasses = resource.slug === 'classes';
            const isEnabled = isAttributes || isSkills || isClasses;
            const isOpen =
              (isAttributes && isAttributesOpen) ||
              (isSkills && isSkillsOpen) ||
              (isClasses && isClassesOpen);

            return (
              <button
                aria-expanded={isEnabled ? isOpen : undefined}
                className="guide-submenu__item"
                disabled={!isEnabled}
                key={resource.slug}
                onClick={
                  isAttributes
                    ? toggleAttributes
                    : isSkills
                      ? toggleSkills
                      : isClasses
                        ? toggleClasses
                        : undefined
                }
                type="button"
              >
                <span>{resource.name}</span>
              </button>
            );
          })}
        </nav>
      </section>

      <section className="section-block guide-accordion" id="attributes">
        <button
          aria-expanded={isAttributesOpen}
          className="guide-accordion__toggle"
          onClick={toggleAttributes}
          type="button"
        >
          <span>
            <p className="kicker">First chapter</p>
            <h2>Attributes</h2>
            <strong aria-hidden="true">
              {isAttributesOpen ? 'Close' : 'Open'}
            </strong>
          </span>
        </button>

        <div
          className={`guide-accordion__content${
            isAttributesOpen ? ' guide-accordion__content--open' : ''
          }`}
        >
          <div className="guide-accordion__scroll">
            <p className="guide-accordion__description">
              Attributes are the six core ability scores used to describe the
              natural strengths of a character in the Adventurers Guild API.
            </p>

            <div className="attribute-guide-grid">
              {attributes.map((attribute) => (
                <article
                  className="attribute-guide-card"
                  id={getAttributeAnchor(attribute.shortname)}
                  key={attribute.shortname}
                >
                  <div className="attribute-guide-card__header">
                    <h3>{attribute.name}</h3>
                    <span>{attribute.shortname}</span>
                  </div>
                  {attributeIcons[attribute.shortname] ? (
                    <div className="attribute-guide-card__icon-frame">
                      <Image
                        alt={attributeIcons[attribute.shortname].alt}
                        className="attribute-guide-card__icon"
                        height={512}
                        src={attributeIcons[attribute.shortname].src}
                        width={512}
                      />
                    </div>
                  ) : null}
                  <p>{attribute.description}</p>
                  <div className="attribute-guide-card__skills">
                    <p>Related skills</p>
                    <div className="attribute-skill-list">
                      {attribute.skills.length > 0 ? (
                        attribute.skills.map((skill) => (
                          <a
                            className="attribute-skill-chip"
                            href={`#${getSkillAnchor(skill)}`}
                            key={skill}
                            onClick={(event) => openSkillCard(event, skill)}
                          >
                            {skill}
                          </a>
                        ))
                      ) : (
                        <span className="attribute-skill-chip attribute-skill-chip--empty">
                          None in the current API catalog
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="guide-how-to-use">
              <h3>How to use</h3>
              <p>
                Call <code>GET /api/attributes</code> when you need the six base
                ability scores, their short names, descriptions, and related
                skills. This is a good starting point before reading character
                details, because many derived values connect back to these
                attributes.
              </p>
              <div className="endpoint-stack">
                <a
                  className="endpoint-pill"
                  href="https://adventurers-guild-api.vercel.app/api/attributes"
                  rel="noreferrer"
                  target="_blank"
                >
                  GET /api/attributes
                </a>
              </div>
            </aside>

            <section className="guide-expected-return">
              <div className="section-heading">
                <h3>Expected return</h3>
                <h4>Response shape</h4>
                <p>
                  The endpoint returns a list of attributes. Each item follows
                  the same shape, making it easy to read the field meaning
                  before using the JSON response in the rest of the project.
                </p>
              </div>

              <div className="response-field-list">
                {attributeResponseFields.map((field) => (
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
                  <code>{JSON.stringify(attributes, null, 2)}</code>
                </pre>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="section-block guide-accordion" id="skills">
        <button
          aria-expanded={isSkillsOpen}
          className="guide-accordion__toggle"
          onClick={toggleSkills}
          type="button"
        >
          <span>
            <p className="kicker">Second chapter</p>
            <h2>Skills</h2>
            <strong aria-hidden="true">{isSkillsOpen ? 'Close' : 'Open'}</strong>
          </span>
        </button>

        <div
          className={`guide-accordion__content${
            isSkillsOpen ? ' guide-accordion__content--open' : ''
          }`}
        >
          <div className="guide-accordion__scroll">
            <p className="guide-accordion__description">
              Skills represent practical ways a character applies an attribute.
              Each skill has a related attribute, a description, an example of
              use, and common classes that often benefit from it.
            </p>

            <div className="skill-guide-grid">
              {skills.map((skill) => {
                const skillAnchor = getSkillAnchor(skill.name);

                return (
                  <article
                    className="skill-guide-card"
                    id={skillAnchor}
                    key={skill.id}
                  >
                    <div className="skill-guide-card__header">
                      <h3>{skill.name}</h3>
                    </div>
                    {skillIcons[skill.name] ? (
                      <div className="skill-guide-card__icon-frame">
                        <Image
                          alt={skillIcons[skill.name].alt}
                          className="skill-guide-card__icon"
                          height={512}
                          src={skillIcons[skill.name].src}
                          width={512}
                        />
                      </div>
                    ) : null}
                    <p>{skill.description}</p>
                    <div className="skill-guide-card__example">
                      <p>Example of use</p>
                      <span>{skill.exampleofuse}</span>
                    </div>
                    <div className="skill-guide-card__attribute">
                      <p>Related attribute</p>
                      <a
                        href={`#${getAttributeAnchor(skill.attribute)}`}
                        onClick={(event) =>
                          openAttributeCard(event, skill.attribute)
                        }
                      >
                        {skill.attribute}
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="guide-how-to-use">
              <h3>How to use</h3>
              <p>
                Call <code>GET /api/skills</code> when you need the compact
                skill list. Use <code>GET /api/skills/{'{identifier}'}</code>{' '}
                when you need the related attribute, description, example of
                use, and common classes for a specific skill.
              </p>
              <div className="endpoint-stack">
                <a
                  className="endpoint-pill"
                  href="https://adventurers-guild-api.vercel.app/api/skills"
                  rel="noreferrer"
                  target="_blank"
                >
                  GET /api/skills
                </a>
              </div>
            </aside>

            <section className="guide-expected-return">
              <div className="section-heading">
                <h3>Expected return</h3>
                <h4>Response shape</h4>
                <p>
                  The list endpoint returns a compact array of skills. Each item
                  includes only the identifier and the skill name, while the
                  detail endpoint exposes the richer educational fields.
                </p>
              </div>

              <div className="response-variant">
                <div className="response-variant__heading">
                  <h4>List response</h4>
                  <code>GET /api/skills</code>
                </div>

                <div className="response-field-list response-field-list--compact">
                  {skillListResponseFields.map((field) => (
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
                    <code>{JSON.stringify(
                        skills.map((skill) => ({
                          id: skill.id,
                          name: skill.name,
                        })),
                        null,
                        2,
                      )}</code>
                  </pre>
                </div>
              </div>

              {skillDetailExample ? (
                <div className="response-variant">
                  <div className="response-variant__heading">
                    <h4>Detail response</h4>
                    <code>GET /api/skills/{'{identifier}'}</code>
                  </div>

                  <div className="response-field-list">
                    {skillDetailResponseFields.map((field) => (
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
                      <code>{JSON.stringify(
                          {
                            id: skillDetailExample.id,
                            name: skillDetailExample.name,
                            attribute: skillDetailExample.attribute,
                            description: skillDetailExample.description,
                            exampleofuse: skillDetailExample.exampleofuse,
                            commonclasses: skillDetailExample.commonclasses,
                          },
                          null,
                          2,
                        )}</code>
                    </pre>
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </section>

      <section className="section-block guide-accordion" id="classes">
        <button
          aria-expanded={isClassesOpen}
          className="guide-accordion__toggle"
          onClick={toggleClasses}
          type="button"
        >
          <span>
            <p className="kicker">Third chapter</p>
            <h2>Classes</h2>
            <strong aria-hidden="true">
              {isClassesOpen ? 'Close' : 'Open'}
            </strong>
          </span>
        </button>

        <div
          className={`guide-accordion__content${
            isClassesOpen ? ' guide-accordion__content--open' : ''
          }`}
        >
          <div className="guide-accordion__scroll">
            <p className="guide-accordion__description">
              Classes describe a character&apos;s adventuring path: their role,
              hit die, core attributes, saving throw proficiencies, recommended
              skills, and spellcasting support.
            </p>

            <div className="class-guide-grid">
              {classes.map((classItem) => {
                const classImage = classImages[classItem.name];
                const hitDie = Number(classItem.hitdie);

                return (
                  <article className="class-guide-card" key={classItem.id}>
                    {classImage ? (
                      <div className="class-guide-card__media">
                        <Image
                          alt={classImage.alt}
                          fill
                          sizes="(max-width: 900px) 100vw, 50vw"
                          src={classImage.src}
                        />
                      </div>
                    ) : null}

                    <div className="class-guide-card__content">
                      <p className="kicker">{classItem.role}</p>
                      <h3>{classItem.name}</h3>
                      <p>{classItem.description}</p>

                      <div className="class-guide-card__meta">
                        <div className="class-guide-card__stat-block class-guide-card__hit-die">
                          <p>Hit Die</p>
                          <span
                            className={`class-guide-card__die class-guide-card__die--d${hitDie}`}
                            data-hit-die={hitDie}
                          >
                            D{hitDie}
                          </span>
                        </div>

                        <div className="class-guide-card__stat-block class-guide-card__primary">
                          <p>Primary Attribute</p>
                          <div>
                            {classItem.primaryattributes.map(
                              (primaryAttribute) => (
                                <a
                                  href={`#${getAttributeAnchor(primaryAttribute)}`}
                                  key={primaryAttribute}
                                  onClick={(event) =>
                                    openAttributeCard(event, primaryAttribute)
                                  }
                                >
                                  {primaryAttribute}
                                </a>
                              ),
                            )}
                          </div>
                        </div>

                        <div className="class-guide-card__stat-block class-guide-card__saving-throws">
                          <p>Saving Throws</p>
                          <div>
                            {classItem.savingthrows.map((savingThrow) => (
                              <a
                                href={`#${getAttributeAnchor(savingThrow)}`}
                                key={savingThrow}
                                onClick={(event) =>
                                  openAttributeCard(event, savingThrow)
                                }
                              >
                                {savingThrow}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="class-guide-card__details">
                        <div className="class-guide-card__detail-block">
                          <p>Recommended skills</p>
                          {classItem.recommendedskills.length > 0 ? (
                            <div className="attribute-skill-list">
                              {classItem.recommendedskills.map((skill) => (
                                <a
                                  className="attribute-skill-chip"
                                  href={`#${getSkillAnchor(skill)}`}
                                  key={skill}
                                  onClick={(event) =>
                                    openSkillCard(event, skill)
                                  }
                                >
                                  {skill}
                                </a>
                              ))}
                            </div>
                          ) : (
                            <span>No recommended skills listed.</span>
                          )}
                        </div>

                        <div className="class-guide-card__detail-block">
                          <p>Subclasses</p>
                          <span>
                            {classItem.subclasses.length > 0
                              ? classItem.subclasses.join(', ')
                              : 'No subclasses listed yet.'}
                          </span>
                        </div>

                        <div className="class-guide-card__detail-block">
                          <p>Spellcasting</p>
                          <span>
                            {classItem.spellcasting
                              ? `Uses ${classItem.spellcasting.ability}`
                              : 'No spellcasting progression.'}
                          </span>
                        </div>

                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="guide-how-to-use">
              <h3>How to use</h3>
              <p>
                Call <code>GET /api/classes</code> for the compact list, then
                use <code>GET /api/classes/{'{identifier}'}</code> when you need
                class details such as hit die, recommended skills, saving
                throws, subclasses, and spellcasting metadata.
              </p>
              <div className="endpoint-stack">
                <a
                  className="endpoint-pill"
                  href="https://adventurers-guild-api.vercel.app/api/classes"
                  rel="noreferrer"
                  target="_blank"
                >
                  GET /api/classes
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
