'use client';

type AuthGuideChapterProps = {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
};

const authIndexId = 'auth-index';

const authRequestFields = [
  {
    name: 'username',
    type: 'string',
    description: 'Owner username used to identify which account is asking for a token.',
  },
  {
    name: 'password',
    type: 'string',
    description: 'Plain-text password checked against the stored owner credentials.',
  },
];

const authResponseFields = [
  {
    name: 'token',
    type: 'string',
    description: 'JWT-like bearer token sent in the Authorization header of protected requests.',
  },
  {
    name: 'error',
    type: 'string',
    description: 'Returned by invalid payload, invalid credentials, or unexpected server failures.',
  },
];

const authTokenRequestExample = {
  username: '<your-username>',
  password: '<your-password>',
};

const authTokenResponseExample = {
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwib3duZXJJZCI6MSwidXNlcm5hbWUiOiJkZW1vIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.signature',
};

const authAuthorizedRequestExample = {
  method: 'GET',
  path: '/api/characters',
  headers: {
    Authorization: 'Bearer <token>',
  },
};

export function AuthGuideChapter({
  isOpen,
  onClose,
  onToggle,
}: AuthGuideChapterProps) {
  return (
    <section
      aria-labelledby="auth-heading"
      className="section-block guide-accordion"
      id="auth"
    >
      <h2 className="guide-accordion__heading" id="auth-heading">
        <button
          aria-controls="auth-panel"
          aria-expanded={isOpen}
          className="guide-accordion__toggle"
          onClick={onToggle}
          type="button"
        >
          <span>
            <span className="kicker">Eighth chapter</span>
            <span className="guide-accordion__title">Auth</span>
            <strong aria-hidden="true">{isOpen ? 'Close' : 'Open'}</strong>
          </span>
        </button>
      </h2>

      <div
        aria-hidden={!isOpen}
        className={`guide-accordion__content${
          isOpen ? ' guide-accordion__content--open' : ''
        }`}
        id="auth-panel"
        inert={!isOpen}
        role="region"
      >
        <div className="guide-accordion__scroll">
          <p className="guide-accordion__description">
            Auth is the gateway chapter for protected character routes. Before
            a player can list, create, or update their characters, they first
            exchange owner credentials for a bearer token.
          </p>

          <nav
            aria-label="Auth index"
            className="guide-card-index guide-card-index--inside-panel"
            id={authIndexId}
          >
            <p>Chapter index</p>
            <div>
              <a href="#auth-step-token">Issue a token</a>
              <a href="#auth-step-header">Send the bearer header</a>
              <a href="#auth-step-flow">Continue into protected routes</a>
            </div>
          </nav>

          <div className="species-guide-grid">
            <article className="species-guide-card" id="auth-step-token">
              <div className="species-guide-card__overview species-guide-card__overview--text-only">
                <div className="species-guide-card__header">
                  <p className="kicker">Step 1</p>
                  <h3>Issue a token</h3>
                  <p>
                    Start with <code>POST /api/auth/token</code>. The request
                    body is small on purpose: a username and password are enough
                    to prove identity and receive the token used in the next
                    calls.
                  </p>
                </div>
              </div>

              <div className="background-guide-card__details">
                <p>What to remember</p>
                <ul>
                  <li>
                    <strong>Single entrypoint</strong>
                    <span>
                      Auth currently begins with one endpoint, making the flow
                      easy to learn before moving into the larger Characters
                      surface.
                    </span>
                  </li>
                  <li>
                    <strong>JSON body</strong>
                    <span>
                      Send credentials in <code>application/json</code>, not as
                      query params.
                    </span>
                  </li>
                  <li>
                    <strong>Immediate handoff</strong>
                    <span>
                      A successful response gives you the token that unlocks the
                      protected owner workflows.
                    </span>
                  </li>
                  <li>
                    <strong>Use your own account</strong>
                    <span>
                      The guide shows placeholders only. Students should use the
                      credentials issued for their own account.
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            <article className="species-guide-card" id="auth-step-header">
              <div className="species-guide-card__overview species-guide-card__overview--text-only">
                <div className="species-guide-card__header">
                  <p className="kicker">Step 2</p>
                  <h3>Send the bearer header</h3>
                  <p>
                    Once the token is issued, include it in the{' '}
                    <code>Authorization</code> header with the{' '}
                    <code>Bearer</code> scheme. That header is what protected
                    routes inspect before returning player-owned data.
                  </p>
                </div>
              </div>

              <div className="background-guide-card__details">
                <p>Header pattern</p>
                <ul>
                  <li>
                    <strong>Exact format</strong>
                    <span>
                      Use <code>Authorization: Bearer &lt;token&gt;</code>.
                    </span>
                  </li>
                  <li>
                    <strong>Protected today</strong>
                    <span>
                      The current protected flow centers on the Characters API
                      and its nested equipment, skills, ability score, and spell
                      routes.
                    </span>
                  </li>
                  <li>
                    <strong>Missing or invalid token</strong>
                    <span>
                      Protected routes answer with <code>401 Unauthorized</code>{' '}
                      when the token is absent, malformed, or invalid.
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            <article className="species-guide-card" id="auth-step-flow">
              <div className="species-guide-card__overview species-guide-card__overview--text-only">
                <div className="species-guide-card__header">
                  <p className="kicker">Step 3</p>
                  <h3>Continue into protected routes</h3>
                  <p>
                    The educational mental model is simple: credentials in,
                    token out, bearer header on every protected request. For
                    the full route catalog and schemas, keep <a href="/docs">/docs</a>{' '}
                    as the technical reference.
                  </p>
                </div>
              </div>

              <div className="background-guide-card__details">
                <p>Where Auth leads next</p>
                <ul>
                  <li>
                    <strong>List characters</strong>
                    <span>
                      <code>GET /api/characters</code> returns only the
                      authenticated owner&apos;s characters.
                    </span>
                  </li>
                  <li>
                    <strong>Create and update</strong>
                    <span>
                      The same bearer token is reused for character creation,
                      patches, deletions, and nested character actions.
                    </span>
                  </li>
                  <li>
                    <strong>Guides vs docs</strong>
                    <span>
                      Learn the flow here in <code>/guides</code>, then inspect
                      complete schemas and status codes in <code>/docs</code>.
                    </span>
                  </li>
                </ul>
              </div>
            </article>
          </div>

          <aside className="guide-how-to-use">
            <h3>How to use</h3>
            <p>
              Use <code>POST /api/auth/token</code> as the first call in any
              owner session. A successful response returns the bearer token; all
              protected character requests should then repeat that token in the
              <code>Authorization</code> header.
            </p>
            <div className="endpoint-stack">
              <span className="endpoint-pill">POST /api/auth/token</span>
              <span className="endpoint-pill endpoint-pill--muted">
                Authorization: Bearer &lt;token&gt;
              </span>
              <a className="endpoint-pill endpoint-pill--muted" href="/docs">
                Open technical reference in /docs
              </a>
            </div>
          </aside>

          <section className="guide-expected-return">
            <div className="section-heading">
              <h3>Expected return</h3>
              <h4>Request and response shapes</h4>
              <p>
                Auth is intentionally small: one request body, one success
                field, and a short set of error outcomes that are easy to
                reason about.
              </p>
            </div>

            <div className="response-variant">
              <div className="response-variant__heading">
                <span>Token request body</span>
                <code>POST /api/auth/token</code>
              </div>
              <div className="response-field-list response-field-list--compact">
                {authRequestFields.map((field) => (
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
                  <code>Request body</code>
                </div>
                <pre>
                  <code>{JSON.stringify(authTokenRequestExample, null, 2)}</code>
                </pre>
              </div>
            </div>

            <div className="response-variant">
              <div className="response-variant__heading">
                <span>Token response and common errors</span>
                <code>200 / 400 / 401 / 500</code>
              </div>
              <div className="response-field-list response-field-list--compact">
                {authResponseFields.map((field) => (
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
                  <code>{JSON.stringify(authTokenResponseExample, null, 2)}</code>
                </pre>
              </div>
            </div>

            <div className="response-variant">
              <div className="response-variant__heading">
                <span>Authorized follow-up request</span>
                <code>GET /api/characters</code>
              </div>
              <div className="response-example">
                <div className="response-example__header">
                  <span>Example JSON</span>
                  <code>Request configuration</code>
                </div>
                <pre>
                  <code>
                    {JSON.stringify(authAuthorizedRequestExample, null, 2)}
                  </code>
                </pre>
              </div>
            </div>
          </section>

          <button className="guide-accordion__close" onClick={onClose} type="button">
            Close Auth chapter
          </button>
        </div>
      </div>
    </section>
  );
}
