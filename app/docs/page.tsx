'use client';

import { RedocStandalone } from 'redoc';

export default function DocsPage() {
  return (
    <main style={{ padding: '24px' }}>
      <RedocStandalone
        specUrl="/openapi.yaml"
        options={{
          theme: {
            typography: {
              fontSize: '14px',
              lineHeight: '1.5em',
              fontFamily: 'Inter, Arial, sans-serif',
              headings: {
                fontFamily: 'Inter, Arial, sans-serif',
              },
            },
          },
        }}
      />
    </main>
  );
}
