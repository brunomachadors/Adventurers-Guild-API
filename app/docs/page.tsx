'use client';

import Link from 'next/link';

import { RedocStandalone } from 'redoc';

export default function DocsPage() {
  return (
    <main className="page-frame page-frame--docs docs-page">
      <section className="section-block section-block--narrow">
        <div className="section-heading">
          <p className="kicker">Spellbook</p>
          <h1>Consult the interactive codex behind the Adventurers Guild API.</h1>
          <p>
            ReDoc remains the technical source of truth for request and response
            details, now framed as the project spellbook inside the same fantasy
            visual language used across the rest of the portal.
          </p>
        </div>

        <div className="hero-actions">
          <Link className="button button--secondary" href="/support">
            Visit the guild hall
          </Link>
          <a className="button button--primary" href="/openapi.yaml">
            Open the raw manuscript
          </a>
        </div>
      </section>

      <section className="docs-panel swagger-container">
        <RedocStandalone
          specUrl="/openapi.yaml"
          options={{
            theme: {
              colors: {
                primary: {
                  main: '#0f766e',
                },
              },
              typography: {
                fontSize: '14px',
                lineHeight: '1.6em',
                fontFamily: 'var(--font-body), sans-serif',
                headings: {
                  fontFamily: 'var(--font-heading), sans-serif',
                },
              },
            },
          }}
        />
      </section>
    </main>
  );
}
