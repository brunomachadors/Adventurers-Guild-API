# Adventurers Guild API

Fantasy-themed REST API built with Next.js to support learning and practice around backend testing, API automation, contract validation, and documentation.

## Purpose

This project is designed to provide a stable API surface that can be used to practice:

- API testing fundamentals
- Response and schema validation
- Contract-first documentation
- Error handling validation
- Automated API checks with tools like Postman, Newman, Playwright, and TypeScript

## Base URLs

- Production: [https://adventurers-guild-api.vercel.app](https://adventurers-guild-api.vercel.app)
- Local: `http://localhost:3000`

## Interactive Documentation

- ReDoc: [https://adventurers-guild-api.vercel.app/docs](https://adventurers-guild-api.vercel.app/docs)
- OpenAPI file: [https://adventurers-guild-api.vercel.app/openapi.yaml](https://adventurers-guild-api.vercel.app/openapi.yaml)

## Current API Surface

### `GET /api/attributes`

Returns the six core RPG attributes with:

- `id`
- `name`
- `shortname`
- `description`
- `skills`

### `GET /api/skills`

Returns a lightweight skills list with:

- `id`
- `name`

### `GET /api/skills/{identifier}`

Returns detailed information for a single skill.

Supported identifiers:

- numeric id, for example `/api/skills/1`
- slug, for example `/api/skills/animal-handling`
- normalized skill name, for example `/api/skills/stealth`

Response fields:

- `id`
- `name`
- `attribute`
- `description`
- `exampleofuse`
- `commonclasses`

Returns `404` with `{ "error": "Skill not found" }` when the skill does not exist.

### `GET /api/classes`

Returns a lightweight classes list with:

- `id`
- `name`

Returns `500` with `{ "error": "Failed to fetch classes" }` if the query fails.

### `GET /api/classes/{identifier}`

Returns detailed information for a single class.

Supported identifiers:

- numeric id, for example `/api/classes/12`
- slug, for example `/api/classes/wizard`
- normalized class name, for example `/api/classes/fighter`

Response fields:

- `id`
- `name`
- `slug`
- `description`
- `role`
- `hitdie`
- `primaryattributes`
- `recommendedskills`
- `savingthrows`
- `spellcasting`
- `subclasses`
- `levelprogression`

Returns:

- `404` with `{ "error": "Class not found" }` when the class does not exist
- `500` with `{ "error": "Failed to fetch class detail" }` if the query fails

### `GET /api/spells`

Returns a lightweight spells list with:

- `id`
- `name`
- `level`
- `levelLabel`

Returns `500` with `{ "error": "Failed to fetch spells" }` if the query fails.

### `GET /api/spells/{identifier}`

Returns detailed information for a single spell.

Supported identifiers:

- numeric id, for example `/api/spells/18`
- slug, for example `/api/spells/acid-splash`
- normalized name, for example `/api/spells/alarm`

Response fields:

- `id`
- `name`
- `slug`
- `source`
- `school`
- `level`
- `levelLabel`
- `castingTime`
- `range`
- `components`
- `duration`
- `description`
- `classes`
- `scaling`

Returns:

- `404` with `{ "error": "Spell not found" }` when the spell does not exist
- `500` with `{ "error": "Failed to fetch spell detail" }` if the query fails

## Example Responses

Attribute list item:

```json
{
  "id": 1,
  "name": "Strength",
  "shortname": "STR",
  "description": "Measures physical power, carrying capacity, and effectiveness in brute-force actions such as lifting, pushing, and melee attacks.",
  "skills": ["Athletics"]
}
```

Class detail:

```json
{
  "id": 12,
  "name": "Wizard",
  "slug": "wizard",
  "description": "A learned arcane scholar who studies the inner workings of magic to prepare spells, master rituals, and wield unmatched magical versatility.",
  "role": "caster",
  "hitdie": 6,
  "primaryattributes": ["INT"],
  "recommendedskills": [
    "Arcana",
    "Investigation",
    "History",
    "Nature",
    "Religion"
  ],
  "savingthrows": ["INT", "WIS"],
  "spellcasting": {
    "ability": "INT",
    "usesSpellbook": true,
    "canCastRituals": true
  },
  "subclasses": ["Evoker"]
}
```

Spell detail:

```json
{
  "id": 18,
  "name": "Alarm",
  "slug": "alarm",
  "source": "Player's Handbook",
  "school": "Abjuration",
  "level": 1,
  "levelLabel": "Level 1",
  "castingTime": "1 minute or Ritual",
  "range": "30 feet",
  "components": {
    "verbal": true,
    "somatic": true,
    "material": true,
    "materialDescription": "a bell and silver wire"
  },
  "duration": "8 hours",
  "description": "You set an alarm against intrusion.",
  "classes": ["Ranger", "Wizard"],
  "scaling": null
}
```

## Local Development

Clone the repository:

```bash
git clone https://github.com/your-repo/adventurers-guild-api.git
cd adventurers-guild-api
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Useful local URLs:

- API base: `http://localhost:3000/api`
- Docs: `http://localhost:3000/docs`
- OpenAPI file: `http://localhost:3000/openapi.yaml`

## Project Structure

```text
adventurers-guild-api
├── app
│   ├── api
│   │   ├── attributes
│   │   ├── classes
│   │   ├── skills
│   │   └── spells
│   ├── docs
│   ├── lib
│   └── types
├── public
│   └── openapi.yaml
├── tests
│   └── data
└── README.md
```

## Notes For Documentation Work

This repository treats documentation as part of the public API contract. The documentation should always reflect:

- the current route handlers
- the current shared types in `app/types`
- the real error messages returned by the API
- the response shapes asserted in `tests/data`

## Technologies

- Next.js
- TypeScript
- Neon serverless Postgres
- OpenAPI 3.0
- ReDoc
- Playwright

## License

This project is available for educational use and experimentation.
