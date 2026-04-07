import Image from 'next/image';
import Link from 'next/link';

import { apiResources, projectHighlights } from '@/app/data/api-resources';
import logoImage from '@/public/images/brand/logo.png';

export default function HomePage() {
  return (
    <main className="page-frame">
      <section className="hero-panel">
        <div className="hero-banner hero-banner--feature">
          <Image
            alt="Adventurers Guild fantasy banner"
            className="hero-banner__image"
            height={540}
            priority
            src={logoImage}
            width={1280}
          />
          <div className="hero-banner__overlay hero-banner__overlay--feature">
            <div className="hero-actions">
              <Link className="button button--primary" href="/guides">
                Read guides
              </Link>
              <Link className="button button--primary" href="/support">
                Enter the guild hall
              </Link>
              <Link className="button button--secondary" href="/docs">
                Read the codex
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-panel__grid">
          <article className="hero-panel__aside hero-panel__aside--sheet">
            <p className="mini-label">Party notes</p>
            <div className="sheet-emblem" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <ul className="feature-list">
              {projectHighlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>

          <article className="hero-panel__aside hero-panel__aside--sheet">
            <p className="mini-label">Next route</p>
            <h2>Choose your entrypoint into the realm</h2>
            <p className="hero-copy">
              Use the support hub for orientation, keep the Guides area ready
              for the next learning layer, or move directly to the interactive
              docs when you want the technical spellbook.
            </p>
            <div className="hero-actions">
              <Link className="button button--primary" href="/guides">
                Open guides
              </Link>
              <Link className="button button--secondary" href="/support">
                Open support
              </Link>
              <Link className="button button--secondary" href="/docs">
                Open docs
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="kicker">Available quests</p>
          <h2>Resources currently open in the realm</h2>
          <p>
            Each card reads like a compact ledger entry, showing what is already
            implemented across the growing reference catalogs and authenticated
            character workflows, plus where to inspect the related routes.
          </p>
        </div>

        <div className="resource-grid">
          {apiResources.map((resource) => (
            <article className="resource-card" key={resource.slug}>
              <div className="resource-card__header">
                <h3>{resource.name}</h3>
                <span className="resource-badge">{resource.slug}</span>
              </div>

              <p>{resource.summary}</p>
              <p className="resource-description">{resource.description}</p>
              <p className="resource-fields">
                Key fields:{' '}
                {(resource.previewFields ?? resource.listFields.slice(0, 5)).join(
                  ', ',
                )}
                {resource.previewFields
                  ? ''
                  : resource.listFields.length > 5
                    ? ', ...'
                    : ''}
              </p>

              <div className="endpoint-stack">
                {(resource.previewEndpoints ?? resource.endpoints.slice(0, 3)).map(
                  (endpoint) => (
                  <span className="endpoint-pill" key={endpoint}>
                    {endpoint}
                  </span>
                  ),
                )}
                {resource.previewEndpoints ? (
                  <span className="endpoint-pill endpoint-pill--muted">
                    +{resource.endpoints.length - resource.previewEndpoints.length}{' '}
                    more endpoints
                  </span>
                ) : resource.endpoints.length > 3 ? (
                  <span className="endpoint-pill endpoint-pill--muted">
                    +{resource.endpoints.length - 3} more endpoints
                  </span>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
