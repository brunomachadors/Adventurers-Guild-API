# Changelog

All notable public API behavior changes are documented in this file.

This project follows Semantic Versioning while the API is pre-1.0:

- `MAJOR` is reserved for a future stable `1.0.0` API contract.
- `MINOR` versions document meaningful API behavior changes, new endpoints, or stricter validation.
- `PATCH` versions document fixes that do not intentionally change public behavior.

## [0.2.0] - 2026-04-21

### Changed

- Strengthened `abilityScores` validation across the Characters API.
- Applied the same `abilityScores` business rules to:
  - `POST /api/characters`
  - `PATCH /api/characters/{id}`
  - `PUT /api/characters/{id}/ability-scores`
- Invalid `abilityScores` payloads now return more specific `400` error messages while keeping the existing response shape:

```json
{
  "error": "..."
}
```

### Validation Rules

- `base` and `bonuses` must each contain exactly `STR`, `DEX`, `CON`, `INT`, `WIS`, and `CHA`.
- All values must be integers.
- For character levels `1` to `3`, each base score must be between `8` and `15`.
- Each bonus must be between `0` and `2`.
- Positive bonuses must target abilities allowed by the character's background.
- The current background rules allow either a `+2/+1` split across different allowed abilities or `+1/+1/+1` across all background-allowed abilities.

### Examples

Base score too high:

```json
{
  "error": "Invalid character ability scores payload: base.DEX must be between 8 and 15 for character levels 1 to 3; received 16"
}
```

Bonus outside background choices:

```json
{
  "error": "Invalid character ability scores payload: bonuses.STR is not allowed by this character's background. Allowed abilities: INT, WIS, CHA"
}
```

### Documentation

- Updated README API behavior notes for `POST`, `PATCH`, and `PUT` ability score validation.
- Updated the Characters guide Attributes card with the relevant request methods and validation examples.

### Tests

- Added regression tests for invalid base scores, invalid bonuses, background choice violations, invalid bonus distributions, incomplete payloads, and invalid `POST`/`PATCH` submissions.
- Added a flow that verifies invalid updates do not overwrite previously saved valid scores.

## [0.1.0] - Previous

### Added

- Initial documented Adventurers Guild API surface.
