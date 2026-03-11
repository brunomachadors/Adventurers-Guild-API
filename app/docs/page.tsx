'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function DocsPage() {
  return (
    <div className="swagger-container">
      <SwaggerUI url="/openapi.yaml" />
    </div>
  );
}
