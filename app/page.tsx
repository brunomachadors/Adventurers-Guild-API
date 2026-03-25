import Image from 'next/image';
import Link from 'next/link';

import { apiResources, projectHighlights } from '@/app/data/api-resources';

export default function HomePage() {
  return (
    <main className="page-frame">
      <section className="hero-panel">
        <div className="hero-panel__content">
          <p className="kicker">Guild charter</p>
          <h1>A campaign codex for exploring the Adventurers Guild API.</h1>
          <p className="hero-copy">
            The interface now leans into a tabletop fantasy mood, turning the
            API entrypoint into something closer to a parchment guide for
            adventurers, maintainers, and curious visitors.
          </p>

          <div className="hero-actions">
            <Link className="button button--primary" href="/support">
              Enter the guild hall
            </Link>
            <Link className="button button--secondary" href="/docs">
              Read the codex
            </Link>
          </div>

          <div className="hero-banner">
            <Image
              alt="Adventurers Guild fantasy banner"
              className="hero-banner__image"
              height={420}
              priority
              src="/logo.png"
              width={960}
            />
            <div className="hero-banner__overlay">
              <p className="mini-label">Featured banner</p>
              <p>
                The guild mark now anchors the landing experience and strengthens
                the campaign identity of the portal.
              </p>
            </div>
          </div>
        </div>

        <aside className="hero-panel__aside hero-panel__aside--sheet">
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
        </aside>
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
                <span className="endpoint-pill">GET {resource.listPath}</span>
                {resource.detailPath !== resource.listPath ? (
                  <span className="endpoint-pill endpoint-pill--muted">
                    GET {resource.detailPath}
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
