import Image from 'next/image';

import { apiResources } from '@/app/data/api-resources';
import { getSql } from '@/app/lib/db';
import type { Attribute } from '@/app/types/attribute';
import charismaIcon from '@/public/attribute-charisma.png';
import constitutionIcon from '@/public/attribute-constitution.png';
import dexterityIcon from '@/public/attribute-dexterity.png';
import intelligenceIcon from '@/public/attribute-intelligence.png';
import strengthIcon from '@/public/attribute-strength.png';
import wisdomIcon from '@/public/attribute-wisdom.png';

export const dynamic = 'force-dynamic';

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

async function getAttributes(): Promise<Attribute[]> {
  const sql = getSql();
  const attributes = await sql`SELECT * FROM attributes ORDER BY id`;
  const skills = await sql`SELECT name, attribute FROM skills`;

  return attributes.map((attribute) => ({
    id: attribute.id,
    name: attribute.name,
    shortname: attribute.shortname,
    description: attribute.description,
    skills: skills
      .filter((skill) => skill.attribute === attribute.shortname)
      .map((skill) => skill.name),
  })) as Attribute[];
}

export default async function GuidesPage() {
  const attributes = await getAttributes();

  return (
    <main className="page-frame">
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
          {guideResources.map((resource) => (
            <button
              className="guide-submenu__item"
              key={resource.slug}
              type="button"
            >
              <span>{resource.name}</span>
            </button>
          ))}
        </nav>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="kicker">First chapter</p>
          <h2>Attributes</h2>
          <p>
            Attributes are the six core ability scores used to describe
            the natural strengths of a character in the Adventurers Guild API.
            The descriptions below come from the same source used by
            <code>GET /api/attributes</code>.
          </p>
        </div>

        <div className="attribute-guide-grid">
          {attributes.map((attribute) => (
            <article className="attribute-guide-card" key={attribute.shortname}>
              <div className="attribute-guide-card__header">
                <span>{attribute.shortname}</span>
                <h3>{attribute.name}</h3>
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
                      <a className="attribute-skill-chip" href="#skills" key={skill}>
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
      </section>
    </main>
  );
}
