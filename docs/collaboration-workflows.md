# Collaboration Workflows

This project uses a workflow-based chat organization to keep discussions focused and avoid mixing unrelated context in the same thread.

## Recommended Durable Threads

### 1. API Tests

Use this thread for Playwright suites, test clients, assertions, expected data, coverage strategy, tags, and regressions.

Use this thread when:

- adding or adjusting test scenarios
- refactoring `tests/features`, `tests/helpers`, or `tests/clients`
- validating schema coverage and response expectations
- investigating failures found during automated test execution

Do not use this thread for:

- product decisions about endpoint behavior
- database insert planning unless the task exists only to support a test

### 2. API Evolution

Use this thread for endpoint design and implementation inside `app/api`, including payload shape, status codes, error handling, and route behavior.

Use this thread when:

- creating a new endpoint
- changing response payloads
- defining route behavior for list and detail endpoints
- standardizing API conventions across resources

Do not use this thread for:

- bulk data population
- detailed test strategy work

### 3. Database and Inserts

Use this thread for SQL queries, database access, seed data, table consistency, and data preparation needed by the API.

Use this thread when:

- writing inserts for classes, skills, attributes, or related tables
- adjusting relationships between resources
- improving data loading through `app/lib/db.ts`
- preparing the database to support new API behavior

Do not use this thread for:

- documentation-only updates
- frontend or Swagger presentation concerns

### 4. Contract and Documentation

Use this thread for `public/openapi.yaml`, `/docs`, examples, schemas, and alignment between implementation and public contract.

Use this thread when:

- updating OpenAPI schemas
- correcting examples in the docs
- documenting new endpoints
- checking whether docs still match the actual response format

Do not use this thread for:

- internal refactors with no contract impact
- seed data work

### 5. Types and Domain Models

Use this thread for `app/types` and for decisions about shared resource shapes across API, tests, and database mapping.

Use this thread when:

- creating or refining resource interfaces
- renaming fields for consistency
- aligning response shapes with TypeScript contracts
- discussing domain vocabulary used across the project

Do not use this thread for:

- test runner configuration
- isolated SQL insert tasks

### 6. Technical Maintenance

Use this thread for setup, scripts, linting, build issues, dependency updates, folder organization, and local environment maintenance.

Use this thread when:

- updating `package.json` scripts or dependencies
- improving project structure
- fixing lint or build problems
- adjusting developer setup and tooling

Do not use this thread for:

- feature work on API behavior
- business data updates

## Routing Rules

Every new task should start in the thread that owns the main workflow, not in a resource-specific thread such as `classes`, `skills`, or `attributes`.

When a task touches multiple areas, assign ownership based on the starting point:

- if the change starts from external API behavior, use `API Evolution`
- if the change starts from data massaging, inserts, or schema support, use `Database and Inserts`
- if the change starts from a failing test or missing coverage, use `API Tests`

Treat `classes`, `skills`, and `attributes` as subtopics inside the workflow thread instead of creating permanent resource-only threads.

## Example Mapping

- Add an attribute detail endpoint -> `API Evolution`
- Seed classes and subclasses -> `Database and Inserts`
- Cover `404` and `500` scenarios -> `API Tests`
- Update Swagger examples and schemas -> `Contract and Documentation`
- Rename `exampleofuse` to a clearer field name -> `Types and Domain Models`
- Adjust scripts, runner config, or dependencies -> `Technical Maintenance`

## Default Assumptions

- The repository is still small to medium sized.
- The current pain is context mixing, not lack of specialization by resource.
- Six durable threads are enough for the current stage of the project.
- Temporary threads should be opened only for large focused initiatives and closed after the work is complete.
