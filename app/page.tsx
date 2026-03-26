import Image from 'next/image';
import Link from 'next/link';

import { apiResources, projectHighlights } from '@/app/data/api-resources';
import logoImage from '@/public/logo.png';

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
              Start with the support hub for orientation or move directly to the
              interactive docs when you want the technical spellbook.
            </p>
            <div className="hero-actions">
              <Link className="button button--primary" href="/support">
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
            implemented and where to inspect the list and detail routes for that
            resource.
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

              <div className="endpoint-stack">
                {resource.endpoints.slice(0, 3).map((endpoint) => (
                  <span className="endpoint-pill" key={endpoint}>
                    {endpoint}
                  </span>
                ))}
                {resource.endpoints.length > 3 ? (
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
