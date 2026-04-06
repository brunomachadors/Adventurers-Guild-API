'use client';

import Image from 'next/image';
import { useState } from 'react';

import { apiResources } from '@/app/data/api-resources';
import type { Attribute } from '@/app/types/attribute';
import charismaIcon from '@/public/attribute-charisma.png';
import constitutionIcon from '@/public/attribute-constitution.png';
import dexterityIcon from '@/public/attribute-dexterity.png';
import intelligenceIcon from '@/public/attribute-intelligence.png';
import strengthIcon from '@/public/attribute-strength.png';
import wisdomIcon from '@/public/attribute-wisdom.png';

type GuidesAccordionProps = {
  attributes: Attribute[];
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

export function GuidesAccordion({ attributes }: GuidesAccordionProps) {
  const [isAttributesOpen, setIsAttributesOpen] = useState(true);

  function toggleAttributes() {
    setIsAttributesOpen((currentValue) => !currentValue);
  }

  return (
    <>
      <section className="section-block">
        <div className="section-heading">
          <p className="kicker">Guide menu</p>
          <h2>Available chapters</h2>
          <p>
            These chapters mirror the real resources already exposed by the
            project, so each guide can stay aligned with the API and the
            interactive documentation.
          </p>
        </div>

        <nav className="guide-submenu" aria-label="Guide chapters">
          {guideResources.map((resource) => {
            const isAttributes = resource.slug === 'attributes';

            return (
              <button
                aria-expanded={isAttributes ? isAttributesOpen : undefined}
                className="guide-submenu__item"
                disabled={!isAttributes}
                key={resource.slug}
                onClick={isAttributes ? toggleAttributes : undefined}
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
                            href="#skills"
                            key={skill}
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
    </>
  );
}
