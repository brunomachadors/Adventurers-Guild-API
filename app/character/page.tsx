import type { Metadata } from 'next';

import { CharacterPreviewClient } from '@/app/components/character-preview/character-preview-client';

export const metadata: Metadata = {
  title: 'Character Preview',
  description:
    'Preview a complete Adventurers Guild character sheet from the character detail API response.',
  alternates: {
    canonical: '/character',
  },
};

export default function CharacterPreviewPage() {
  return (
    <main className="page-frame character-preview-page">
      <section className="section-block character-preview-shell">
        <div className="section-heading character-preview-heading">
          <p className="kicker">Character Preview</p>
          <h1>Ready character sheet</h1>
          <p>
            Fetch a character by ID and read the final sheet exactly as the API
            returns it, including class, species, background, ability scores,
            equipment, spells, and derived stats.
          </p>
        </div>

        <CharacterPreviewClient />
      </section>
    </main>
  );
}
