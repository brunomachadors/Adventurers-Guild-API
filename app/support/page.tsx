import Link from 'next/link';

import { apiResources } from '@/app/data/api-resources';

export default function SupportPage() {
  return (
    <main className="page-frame">
      <section className="section-block section-block--narrow">
        <div className="section-heading">
          <p className="kicker">Guild hall</p>
          <h1>Project lore, wayfinding, and direct access to the API realm.</h1>
          <p>
            This page acts as the central hall for visitors: a place to
            understand the project, identify the routes that already exist, and
            move toward the interactive documentation when deeper detail is
            needed.
          </p>
        </div>

        <div className="support-grid">
          <article className="info-card">
            <p className="mini-label">What this project is</p>
            <h2>A fantasy API built like a shared campaign setting</h2>
            <p>
              Adventurers Guild API is a fantasy-themed REST API built to
              support backend practice, documentation, automation, and contract
              validation while also offering a more atmospheric and welcoming
              frontend for new visitors, with growing coverage for reference
              catalogs like equipment and richer character management flows.
            </p>
          </article>

          <article className="info-card">
            <p className="mini-label">Where to go next</p>
            <h2>Choose your next stop on the map</h2>
            <p>
              Use the overview page for the campaign summary, this support page
              for orientation, and <code>/docs</code> when you want the full
              technical spellbook.
            </p>
            <div className="hero-actions">
              <Link className="button button--primary" href="/docs">
                Open the spellbook
              </Link>
              <Link className="button button--secondary" href="/">
                Return to the map
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="kicker">Guild registry</p>
          <h2>Resources currently available</h2>
          <p>
            These entries mirror the real API surface already exposed by the
            application, helping visitors understand what can be queried before
            moving into the full documentation.
          </p>
        </div>

        <div className="support-list">
          {apiResources.map((resource) => (
            <article className="support-list__item" key={resource.slug}>
              <div>
                <h3>{resource.name}</h3>
                <p>{resource.description}</p>
                <p className="resource-fields">
                  Key fields: {resource.listFields.join(', ')}
                </p>
              </div>

              <div className="support-list__meta">
                {resource.endpoints.map((endpoint) => (
                  <span
                    className={`endpoint-pill${
                      endpoint.startsWith('GET ')
                        ? ' endpoint-pill--muted'
                        : ''
                    }`}
                    key={endpoint}
                  >
                    {endpoint}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
