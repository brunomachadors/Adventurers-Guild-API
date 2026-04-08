import Image from 'next/image';
import Link from 'next/link';

import { apiResources } from '@/app/data/api-resources';
import logoImage from '@/public/images/brand/logo.png';

export default function HomePage() {
  return (
    <main className="page-frame">
      <section className="hero-panel">
        <div className="section-heading overview-heading">
          <p className="kicker">Campaign overview</p>
          <h1>Adventurers Guild API overview</h1>
          <p>
            Choose the learning path that fits your party before opening the
            wider API realm.
          </p>
        </div>

        <div className="hero-banner hero-banner--feature">
          <Image
            alt="Adventurers Guild API campaign banner"
            className="hero-banner__image"
            height={540}
            priority
            src={logoImage}
            width={1280}
          />
        </div>

        <section
          aria-labelledby="overview-guides-title"
          className="overview-path overview-path--guides"
        >
          <div>
            <p className="mini-label">For young adventurers</p>
            <h2 id="overview-guides-title">
              Start with the illustrated guides
            </h2>
            <p className="hero-copy">
              Everything is drawn, organized, and explained for young
              adventurers who want to understand the Adventurers Guild API
              before reading the raw contract. Begin with readable chapters for
              Attributes, Skills, Classes, and Species.
            </p>
          </div>
          <Link className="button button--primary" href="/guides">
            Start with guides
          </Link>
        </section>

        <section
          aria-labelledby="overview-docs-title"
          className="overview-path overview-path--docs"
        >
          <div>
            <p className="mini-label">For experienced adventurers</p>
            <h2 id="overview-docs-title">
              Consult the pure API documentation
            </h2>
            <p>
              If you already know the realm and need exact request shapes,
              response schemas, endpoints, and contract details, open the
              technical codex and read the OpenAPI reference directly.
            </p>
          </div>
          <Link className="button button--secondary" href="/docs">
            Open API docs
          </Link>
        </section>
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
