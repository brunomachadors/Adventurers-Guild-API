'use client';

import Image from 'next/image';
import { type MouseEvent } from 'react';

import { backgroundImages } from '@/app/components/guides/background-images';
import { backgroundDetailResponseFields, backgroundListResponseFields } from '@/app/components/guides/background-response-fields';
import {
  findAttributeByReference,
  getAttributeAnchor,
  getBackgroundAnchor,
  getSkillAnchor,
  splitEquipmentOptionItems,
} from '@/app/components/guides/background-guide-utils';
import type { Attribute } from '@/app/types/attribute';
import type { BackgroundDetail } from '@/app/types/background';

type BackgroundsGuideChapterProps = {
  attributes: Attribute[];
  backgrounds: BackgroundDetail[];
  isOpen: boolean;
  selectedBackgroundIndex: number;
  onToggle: () => void;
  onClose: () => void;
  onSelectBackground: (backgroundIndex: number, shouldScroll?: boolean) => void;
  onOpenChapterIndex: (indexId: string) => void;
  onOpenAttribute: (attributeShortname: string) => void;
  onOpenSkill: (skillName: string) => void;
};

const backgroundsIndexId = 'backgrounds-index';

export function BackgroundsGuideChapter({
  attributes,
  backgrounds,
  isOpen,
  selectedBackgroundIndex,
  onToggle,
  onClose,
  onSelectBackground,
  onOpenChapterIndex,
  onOpenAttribute,
  onOpenSkill,
}: BackgroundsGuideChapterProps) {
  const backgroundDetailExample = backgrounds[0];

  function handleOpenBackground(
    event: MouseEvent<HTMLAnchorElement>,
    backgroundIndex: number,
  ) {
    event.preventDefault();
    onSelectBackground(backgroundIndex, false);
  }

  function handleOpenChapterIndex(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    onOpenChapterIndex(backgroundsIndexId);
  }

  function handleOpenAttribute(
    event: MouseEvent<HTMLAnchorElement>,
    attributeShortname: string,
  ) {
    event.preventDefault();
    onOpenAttribute(attributeShortname);
  }

  function handleOpenSkill(event: MouseEvent<HTMLAnchorElement>, skillName: string) {
    event.preventDefault();
    onOpenSkill(skillName);
  }

  return (
    <section
      aria-labelledby="backgrounds-heading"
      className="section-block guide-accordion"
      id="backgrounds"
    >
      <h2 className="guide-accordion__heading" id="backgrounds-heading">
        <button
          aria-controls="backgrounds-panel"
          aria-expanded={isOpen}
          className="guide-accordion__toggle"
          onClick={onToggle}
          type="button"
        >
          <span>
            <span className="kicker">Fifth chapter</span>
            <span className="guide-accordion__title">Backgrounds</span>
            <strong aria-hidden="true">{isOpen ? 'Close' : 'Open'}</strong>
          </span>
        </button>
      </h2>

      <div
        aria-hidden={!isOpen}
        className={`guide-accordion__content${
          isOpen ? ' guide-accordion__content--open' : ''
        }`}
        id="backgrounds-panel"
        inert={!isOpen}
        role="region"
      >
        <div className="guide-accordion__scroll">
          <p className="guide-accordion__description">
            Backgrounds frame where an adventurer comes from before their first
            quest, combining identity, proficiencies, and starting gear.
          </p>

          <nav
            aria-label="Backgrounds index"
            className="guide-card-index"
            id={backgroundsIndexId}
          >
            <p>Chapter index</p>
            <div>
              {backgrounds.map((background, backgroundIndex) => (
                <a
                  aria-current={
                    backgroundIndex === selectedBackgroundIndex ? 'true' : undefined
                  }
                  href={`#${getBackgroundAnchor(background.name)}`}
                  key={background.id}
                  onClick={(event) => handleOpenBackground(event, backgroundIndex)}
                >
                  {background.name}
                </a>
              ))}
            </div>
          </nav>

          <div className="species-guide-grid">
            {backgrounds.map((background, backgroundIndex) => {
              if (backgroundIndex !== selectedBackgroundIndex) {
                return null;
              }

              const backgroundImage = backgroundImages[background.name];
              const previousBackground = backgrounds[backgroundIndex - 1];
              const nextBackground = backgrounds[backgroundIndex + 1];

              return (
                <article
                  className="species-guide-card"
                  id={getBackgroundAnchor(background.name)}
                  key={background.id}
                >
                  <div
                    className={`species-guide-card__overview${
                      backgroundImage ? '' : ' species-guide-card__overview--text-only'
                    }`}
                  >
                    {backgroundImage ? (
                      <div className="species-guide-card__media">
                        <Image
                          alt={backgroundImage.alt}
                          fill
                          sizes="(max-width: 980px) 100vw, 40vw"
                          src={backgroundImage.src}
                        />
                      </div>
                    ) : null}
                    <div className="species-guide-card__header">
                      <p className="kicker">Origin and identity</p>
                      <h3>{background.name}</h3>
                      <p>{background.description}</p>
                    </div>
                  </div>

                  <div className="background-guide-card__details">
                    <p>What this background grants</p>
                    <ul>
                      <li>
                        <strong>Tool proficiency</strong>
                        <span>{background.toolProficiency ?? 'None'}</span>
                      </li>
                      <li>
                        <strong>Feat</strong>
                        <span>{background.feat}</span>
                      </li>
                      <li>
                        <strong>Ability scores</strong>
                        <div className="attribute-skill-list">
                          {background.abilityScores.length > 0 ? (
                            background.abilityScores.map((abilityScore) => {
                              const attribute = findAttributeByReference(
                                attributes,
                                abilityScore,
                              );

                              return attribute ? (
                                <a
                                  className="attribute-skill-chip"
                                  href={`#${getAttributeAnchor(attribute.shortname)}`}
                                  key={abilityScore}
                                  onClick={(event) =>
                                    handleOpenAttribute(event, attribute.shortname)
                                  }
                                >
                                  {attribute.name}
                                </a>
                              ) : (
                                <span
                                  className="attribute-skill-chip attribute-skill-chip--empty"
                                  key={abilityScore}
                                >
                                  {abilityScore}
                                </span>
                              );
                            })
                          ) : (
                            <span className="attribute-skill-chip attribute-skill-chip--empty">
                              No ability score options listed.
                            </span>
                          )}
                        </div>
                      </li>
                      <li>
                        <strong>Skill proficiencies</strong>
                        <div className="attribute-skill-list">
                          {background.skillProficiencies.length > 0 ? (
                            background.skillProficiencies.map((skill) => (
                              <a
                                className="attribute-skill-chip"
                                href={`#${getSkillAnchor(skill)}`}
                                key={skill}
                                onClick={(event) => handleOpenSkill(event, skill)}
                              >
                                {skill}
                              </a>
                            ))
                          ) : (
                            <span className="attribute-skill-chip attribute-skill-chip--empty">
                              No skill proficiencies listed.
                            </span>
                          )}
                        </div>
                      </li>
                      <li>
                        <strong>Equipment options</strong>
                        {background.equipmentOptions.length > 0 ? (
                          <div className="background-guide-card__option-grid">
                            {background.equipmentOptions.map((equipmentOption, optionIndex) => (
                              <div
                                className="background-guide-card__option-card"
                                key={`${background.id}-option-${optionIndex}`}
                              >
                                <p>{`Option ${optionIndex + 1}`}</p>
                                <ul>
                                  {splitEquipmentOptionItems(equipmentOption).map((item) => (
                                    <li
                                      key={`${background.id}-option-${optionIndex}-${item}`}
                                    >
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span>No equipment options listed.</span>
                        )}
                      </li>
                    </ul>
                  </div>

                  <nav
                    aria-label={`${background.name} navigation`}
                    className="guide-card-navigation"
                  >
                    {previousBackground ? (
                      <button
                        aria-label={`Previous background: ${previousBackground.name}`}
                        className="guide-card-navigation__link"
                        onClick={() => onSelectBackground(backgroundIndex - 1)}
                        type="button"
                      >
                        ←
                      </button>
                    ) : (
                      <span className="guide-card-navigation__placeholder" />
                    )}

                    <a
                      className="guide-card-back-link"
                      href={`#${backgroundsIndexId}`}
                      onClick={handleOpenChapterIndex}
                    >
                      Index
                    </a>

                    {nextBackground ? (
                      <button
                        aria-label={`Next background: ${nextBackground.name}`}
                        className="guide-card-navigation__link"
                        onClick={() => onSelectBackground(backgroundIndex + 1)}
                        type="button"
                      >
                        →
                      </button>
                    ) : (
                      <span className="guide-card-navigation__placeholder" />
                    )}
                  </nav>
                </article>
              );
            })}
          </div>

          <aside className="guide-how-to-use">
            <h3>How to use</h3>
            <p>
              Call <code>GET /api/backgrounds</code> to build a chapter index or
              picker. Use <code>GET /api/backgrounds/{'{identifier}'}</code> when
              you need the full background description, feat, proficiency
              package, and equipment options for a specific choice.
            </p>
            <div className="endpoint-stack">
              <a
                className="endpoint-pill"
                href="https://adventurers-guild-api.vercel.app/api/backgrounds"
                rel="noreferrer"
                target="_blank"
              >
                GET /api/backgrounds
              </a>
              <a
                className="endpoint-pill"
                href="https://adventurers-guild-api.vercel.app/api/backgrounds/acolyte"
                rel="noreferrer"
                target="_blank"
              >
                GET /api/backgrounds/{'{identifier}'}
              </a>
            </div>
          </aside>

          <section className="guide-expected-return">
            <div className="section-heading">
              <h3>Expected return</h3>
              <h4>Response shapes</h4>
              <p>
                The list endpoint stays compact, while the detail endpoint adds
                the gameplay fields needed to understand a background.
              </p>
            </div>

            <div className="response-variant">
              <div className="response-variant__heading">
                <span>List response</span>
                <code>GET /api/backgrounds</code>
              </div>
              <div className="response-field-list response-field-list--compact">
                {backgroundListResponseFields.map((field) => (
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
                      backgrounds.map((background) => ({
                        id: background.id,
                        name: background.name,
                      })),
                      null,
                      2,
                    )}
                  </code>
                </pre>
              </div>
            </div>

            {backgroundDetailExample ? (
              <div className="response-variant">
                <div className="response-variant__heading">
                  <span>Detail response: {backgroundDetailExample.name}</span>
                  <code>GET /api/backgrounds/{backgroundDetailExample.slug}</code>
                </div>
                <div className="response-field-list">
                  {backgroundDetailResponseFields.map((field) => (
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
                    <code>{JSON.stringify(backgroundDetailExample, null, 2)}</code>
                  </pre>
                </div>
              </div>
            ) : null}
          </section>

          <button className="guide-accordion__close" onClick={onClose} type="button">
            Close Backgrounds chapter
          </button>
        </div>
      </div>
    </section>
  );
}
