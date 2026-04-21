# Adventurers Guild API

Fantasy-themed REST API built with Next.js to support learning and practice around backend testing, API automation, contract validation, and documentation.

## Public API Version

Current public API version: `0.2.0`

Public API behavior changes are documented in [CHANGELOG.md](CHANGELOG.md).

This project uses Semantic Versioning while the API is pre-1.0:

- `MINOR` versions document meaningful API behavior changes, new endpoints, or stricter validation.
- `PATCH` versions document fixes that do not intentionally change public behavior.
- `MAJOR` is reserved for a future stable `1.0.0` API contract.

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

## Authentication

The API currently has a token issuance endpoint and a set of protected character endpoints.

Public token endpoint:

- `POST /api/auth/token`

Protected routes require:

- `Authorization: Bearer <token>`

Playwright auth tests expect these environment variables:

- `E2E_AUTH_USERNAME`
- `E2E_AUTH_PASSWORD`

In GitHub Actions, store them as repository secrets and expose them to the test workflow.

## Current API Surface

### `POST /api/auth/token`

Issues a JWT-like bearer token for an owner account.

Request body fields:

- `username`
- `password`

Returns:

- `200` with `{ "token": "<jwt>" }`
- `400` with `{ "error": "Invalid token request payload" }`
- `401` with `{ "error": "Invalid credentials" }`
- `500` with `{ "error": "Failed to issue token" }`

### `GET /api/attributes`

Returns the six core RPG attributes with:

- `id`
- `name`
- `shortname`
- `description`
- `skills`

### `GET /api/backgrounds`

Returns a lightweight backgrounds list with:

- `id`
- `name`

Returns `500` with `{ "error": "Failed to fetch backgrounds" }` if the query fails.

### `GET /api/backgrounds/{identifier}`

Returns detailed information for a single background.

Supported identifiers:

- numeric id, for example `/api/backgrounds/1`
- slug, for example `/api/backgrounds/acolyte`
- name or slug in a case-insensitive form, for example `/api/backgrounds/SOLDIER`

Response fields:

- `id`
- `name`
- `slug`
- `description`
- `abilityScores`
- `feat`
- `skillProficiencies`
- `toolProficiency`
- `equipmentOptions`

Returns:

- `404` with `{ "error": "Background not found" }` when the background does not exist
- `500` with `{ "error": "Failed to fetch background detail" }` if the query fails

### `GET /api/equipment`

Returns a lightweight equipment list with:

- `id`
- `name`
- `category`
- `type`
- `cost`
- `weight`
- `isMagical`

Returns `500` with `{ "error": "Failed to fetch equipment" }` if the query fails.

### `GET /api/equipment/{identifier}`

Returns detailed information for a single equipment item.

Supported identifiers:

- numeric id, for example `/api/equipment/1`
- slug, for example `/api/equipment/chain-mail`
- exact name in a case-insensitive form, for example `/api/equipment/shield`

Top-level response fields:

- `id`
- `name`
- `slug`
- `category`
- `type`
- `description`
- `cost`
- `weight`
- `isMagical`
- `modifiers`
- `effects`
- `details`

The `details.kind` field currently distinguishes:

- `weapon`
- `armor`
- `shield`
- `generic`

Returns:

- `404` with `{ "error": "Equipment not found" }` when the item does not exist
- `500` with `{ "error": "Failed to fetch equipment detail" }` if the query fails

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
- `skillProficiencyChoices`
- `weaponProficiencies`
- `armorTraining`
- `startingEquipmentOptions`
- `equipmentOptions`
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

Supported optional filters:

- `level`
  - accepts a non-negative integer or `cantrip`
- `school`
- `class`
- `source`
- `name`

Filter rules:

- filters are case-insensitive
- multiple filters combine with `AND`
- `level=cantrip` maps to level `0`
- `name` performs a partial match

Examples:

- `/api/spells?level=1`
- `/api/spells?level=cantrip`
- `/api/spells?school=evocation`
- `/api/spells?class=wizard`
- `/api/spells?source=players-handbook`
- `/api/spells?name=acid`

Returns `500` with `{ "error": "Failed to fetch spells" }` if the query fails.
Returns `400` with a clear validation error, such as `{ "error": "Invalid level filter" }`, when a filter value is invalid.

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

### `GET /api/species`

Returns a lightweight species list with:

- `id`
- `name`

Returns `500` with `{ "error": "Failed to fetch species" }` if the query fails.

### `GET /api/species/{identifier}`

Returns detailed information for a single species.

Supported identifiers:

- numeric id, for example `/api/species/1`
- slug, for example `/api/species/dragonborn`
- normalized name, for example `/api/species/elf`

Response fields:

- `id`
- `name`
- `slug`
- `description`
- `creatureType`
- `size`
- `speed`
- `specialTraits`
- `subspecies`

Returns:

- `404` with `{ "error": "Species not found" }` when the species does not exist
- `500` with `{ "error": "Failed to fetch species detail" }` if the query fails

### `GET /api/characters`

Returns the authenticated owner's characters.

Requires bearer token.

List item fields:

- `id`
- `name`
- `status`
- `level`

Returns:

- `401` with `{ "error": "Unauthorized" }` when the token is missing or invalid
- `500` with `{ "error": "Failed to fetch characters" }` if the query fails

### `POST /api/characters`

Creates a character for the authenticated owner.

Requires bearer token.

Request body fields:

- `name` required
- `classId` optional
- `speciesId` optional
- `backgroundId` optional
- `level` optional, defaults to `1`
- `abilityScores` optional
- `currency` optional
- `skillProficiencies` optional

If `abilityScores` is provided, it uses the same validation rules as `PUT /api/characters/{id}/ability-scores`: complete `base` and `bonuses` blocks, integer `STR`, `DEX`, `CON`, `INT`, `WIS`, and `CHA` values, level 1 to 3 base scores between `8` and `15`, bonuses between `0` and `2`, and background-compatible bonus choices.

Response fields:

- `id`
- `name`
- `status`
- `classId`
- `speciesId`
- `backgroundId`
- `level`
- `missingFields`
- `pendingChoices`
- `abilityScores`
- `abilityModifiers`
- `armorClass`
- `weaponAttacks`
- `hitPoints`
- `savingThrows`
- `initiative`
- `passivePerception`
- `movement`
- `inventoryWeight`
- `spellcastingSummary`
- `spellSlots`
- `selectedSpells`
- `currency`
- `skillProficiencies`
- `abilityScoreRules`
- `classDetails`
- `speciesDetails`
- `backgroundDetails`

When related data exists, the API can enrich the detail response with:

- `classDetails`
- `speciesDetails`
- `backgroundDetails`

Returns:

- `201` when the character is created
- `400` with `{ "error": "Invalid character request payload" }`
- `400` with a specific ability score validation message, for example `{ "error": "Invalid character ability scores payload: base.STR must be between 8 and 15 for character levels 1 to 3; received 16" }`
- `401` with `{ "error": "Unauthorized" }`
- `500` with `{ "error": "Failed to create character" }`

### `GET /api/characters/{id}`

Returns one character detail by id.

Does not require a bearer token.

Response fields:

- `id`
- `name`
- `status`
- `classId`
- `speciesId`
- `backgroundId`
- `level`
- `missingFields`
- `pendingChoices`
- `skillProficiencies`
- `abilityScores`
- `abilityModifiers`
- `armorClass`
- `weaponAttacks`
- `hitPoints`
- `savingThrows`
- `initiative`
- `passivePerception`
- `movement`
- `inventoryWeight`
- `spellcastingSummary`
- `spellSlots`
- `selectedSpells`
- `currency`
- `skills`
- `abilityScoreRules`
- `classDetails`
- `speciesDetails`
- `backgroundDetails`

Returns:

- `404` with `{ "error": "Character not found" }`
- `500` with `{ "error": "Failed to fetch character detail" }`

`armorClass` is calculated from the character's resolved DEX modifier and currently equipped armor or shield. If no armor is equipped, the base AC is `10`; Barbarian and Monk unarmored defense can contribute a `class` source when their rules apply.

`weaponAttacks` is derived from currently equipped weapons, class weapon proficiencies, character level, and resolved ability modifiers. If no weapon is equipped, it is returned as an empty array.

`hitPoints` is derived from the character's class hit die, level, and resolved CON modifier. It is returned as `null` until class details and ability modifiers are available; when calculated, `current` starts equal to `max` and `temporary` starts at `0`.

`savingThrows` is derived from class saving throw proficiencies, character level, and resolved ability modifiers. It is returned as an empty array until class details and ability modifiers are available; when calculated, it is ordered as `STR`, `DEX`, `CON`, `INT`, `WIS`, `CHA`.

`initiative` is derived from the resolved DEX modifier plus the current static bonus (`0`). It is returned as `null` until ability modifiers are available.

`passivePerception` is derived from the calculated Perception skill total. Its current formula is `10 + skillModifier + bonus`, with `bonus` currently `0`. It is returned as `null` until ability modifiers are available.

`movement` is derived from `speciesDetails.speed` and currently uses `ft` as the unit. It is returned as `null` until species details with a numeric speed are available.

`inventoryWeight` is derived from character equipment rows with a non-null equipment weight. Each source uses `equipment.weight * quantity`; when the character has no weighted equipment, it returns `{ "total": 0, "unit": "lb", "sources": [] }`.

`pendingChoices` lists unresolved package-selection steps that still need to be completed through the dedicated equipment choice endpoints. It is currently used for `classEquipmentSelection` and `backgroundEquipmentSelection`.

`spellcastingSummary` is derived from the character class spellcasting metadata, character level, resolved spellcasting ability modifier, and selected spells. For non-casters, `canCastSpells` is `false`, spellcasting ability values are `null`, and selected spell counts are `0`.

`spellSlots` is derived from class spellcasting progression and character level. It is returned as an empty array for non-casters or classes without supported slot progression; `used` currently starts at `0`, and `available` is `max - used`.

`selectedSpells` contains enriched spell details for the character's selected spells, ordered by spell level and spell id. It is returned as an empty array when no spells are selected.

### `PATCH /api/characters/{id}`

Updates the authenticated owner's character.

Requires bearer token.

Accepted fields:

- `name`
- `classId`
- `speciesId`
- `backgroundId`
- `level`
- `abilityScores`
- `currency`
- `skillProficiencies`

If `abilityScores` is provided, it uses the same validation rules as `PUT /api/characters/{id}/ability-scores`. Sending `abilityScores: null` clears the saved scores.

Returns:

- `200` with the updated character response
- `400` with `{ "error": "Invalid character request payload" }`
- `400` with a specific ability score validation message, for example `{ "error": "Invalid character ability scores payload: bonuses.STR is not allowed by this character's background. Allowed abilities: INT, WIS, CHA" }`
- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `500` with `{ "error": "Failed to update character" }`

### `DELETE /api/characters/{id}`

Deletes the authenticated owner's character.

Requires bearer token.

Returns:

- `200` with `{ "message": "Character deleted successfully" }`
- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `500` with `{ "error": "Failed to delete character" }`

### `GET /api/characters/{id}/skills`

Returns the calculated skill list for the character.

Requires bearer token.

Each item includes:

- `name`
- `ability`
- `isProficient`
- `abilityModifier`
- `proficiencyBonus`
- `total`

This is a derived view, not a raw persisted payload. The values are derived from the character's current `skillProficiencies`, level, and resolved ability scores. When the character has no saved ability scores yet, ability-based values are currently calculated as `0`.

Returns:

- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `500` with `{ "error": "Failed to fetch character skills" }`

### `GET /api/characters/{id}/equipment`

Returns the character's current equipment list.

Requires bearer token.

Response fields:

- `characterId`
- `equipment`

Each equipment item includes:

- `id`
- `name`
- `category`
- `type`
- `quantity`
- `isEquipped`

If the character has no equipment, `equipment` is returned as an empty array.

Returns:

- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `500` with `{ "error": "Failed to fetch character equipment" }`

### `POST /api/characters/{id}/equipment`

Adds equipment to the character and returns the updated character equipment list.

Requires bearer token.

Request body fields:

- `equipmentId` required
- `quantity` optional, defaults to `1`
- `isEquipped` optional, defaults to `false`

If the same equipment already exists for the character, the API increments the existing quantity and updates `isEquipped` with the latest submitted value.

Returns:

- `201` with the updated character equipment response
- `400` with `{ "error": "Invalid character equipment request payload" }`
- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `404` with `{ "error": "Equipment not found" }`
- `500` with `{ "error": "Failed to add character equipment" }`

### `POST /api/characters/{id}/equipment/class-choice`

Resolves a pending class equipment package and returns the updated equipment state.

Requires bearer token.

Request body fields:

- `optionLabel` optional and preferred when the class package exposes labels like `A`
- `optionIndex` optional fallback when the client prefers positional selection

At least one of those fields must be present. When both are sent, `optionLabel` is used.

Response fields:

- `characterId`
- `appliedChoice`
- `addedEquipment`
- `addedCurrency`
- `skippedItems`
- `pendingChoices`
- `equipment`

Currency found in the selected package is added to `character.currency`. Unsupported variable items are skipped instead of failing the whole request.

Returns:

- `200` with the package resolution response
- `400` with `{ "error": "Invalid character equipment choice payload" }`
- `400` with `{ "error": "No class equipment selection pending" }`
- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `404` with `{ "error": "Selected package option not found" }`
- `500` with `{ "error": "Failed to resolve class equipment choice" }`

Example response:

```json
{
  "characterId": 101,
  "appliedChoice": {
    "source": "class",
    "label": "A",
    "optionIndex": 0
  },
  "addedEquipment": [
    { "id": 42, "name": "Greataxe", "quantity": 1, "isEquipped": true },
    { "id": 43, "name": "Handaxe", "quantity": 4, "isEquipped": false }
  ],
  "addedCurrency": {
    "cp": 0,
    "sp": 0,
    "ep": 0,
    "gp": 15,
    "pp": 0
  },
  "skippedItems": [],
  "pendingChoices": ["backgroundEquipmentSelection"],
  "equipment": [
    {
      "id": 42,
      "name": "Greataxe",
      "category": "Weapon",
      "type": "Weapon",
      "quantity": 1,
      "isEquipped": true
    },
    {
      "id": 43,
      "name": "Handaxe",
      "category": "Weapon",
      "type": "Weapon",
      "quantity": 4,
      "isEquipped": false
    }
  ]
}
```

### `POST /api/characters/{id}/equipment/background-choice`

Resolves a pending background equipment package and returns the updated equipment state.

Requires bearer token.

Request body fields:

- `optionLabel` optional
- `optionIndex` optional and usually the simplest choice for background packages

At least one of those fields must be present. When both are sent, `optionLabel` is used.

Response fields:

- `characterId`
- `appliedChoice`
- `addedEquipment`
- `addedCurrency`
- `skippedItems`
- `pendingChoices`
- `equipment`

Currency found in the selected package is added to `character.currency` and returned in `addedCurrency`.

Returns:

- `200` with the package resolution response
- `400` with `{ "error": "Invalid character equipment choice payload" }`
- `400` with `{ "error": "No background equipment selection pending" }`
- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `404` with `{ "error": "Selected package option not found" }`
- `500` with `{ "error": "Failed to resolve background equipment choice" }`

Example response:

```json
{
  "characterId": 101,
  "appliedChoice": {
    "source": "background",
    "label": null,
    "optionIndex": 0
  },
  "addedEquipment": [
    { "id": 12, "name": "Spear", "quantity": 1, "isEquipped": true },
    { "id": 42, "name": "Shortbow", "quantity": 1, "isEquipped": false },
    { "id": 44, "name": "Arrows", "quantity": 20, "isEquipped": false },
    { "id": 45, "name": "Quiver", "quantity": 1, "isEquipped": false }
  ],
  "addedCurrency": {
    "cp": 0,
    "sp": 0,
    "ep": 0,
    "gp": 14,
    "pp": 0
  },
  "skippedItems": [
    {
      "name": "Gaming Set (same as above)",
      "reason": "Depends on a previous choice that is not handled by this endpoint"
    }
  ],
  "pendingChoices": [],
  "equipment": [
    {
      "id": 12,
      "name": "Spear",
      "category": "Weapon",
      "type": "Weapon",
      "quantity": 1,
      "isEquipped": true
    },
    {
      "id": 42,
      "name": "Shortbow",
      "category": "Weapon",
      "type": "Weapon",
      "quantity": 1,
      "isEquipped": false
    },
    {
      "id": 44,
      "name": "Arrows",
      "category": "Ammunition",
      "type": "Gear",
      "quantity": 20,
      "isEquipped": false
    },
    {
      "id": 45,
      "name": "Quiver",
      "category": "Container",
      "type": "Gear",
      "quantity": 1,
      "isEquipped": false
    }
  ]
}
```

### `PATCH /api/characters/{id}/equipment/{equipmentId}`

Updates an equipment item already attached to the character and returns the updated character equipment list.

Requires bearer token.

Accepted fields:

- `quantity`
- `isEquipped`

At least one accepted field must be present. `quantity` must be a positive integer.

Returns:

- `200` with the updated character equipment response
- `400` with `{ "error": "Invalid character equipment request payload" }`
- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `404` with `{ "error": "Character equipment not found" }`
- `500` with `{ "error": "Failed to update character equipment" }`

### `DELETE /api/characters/{id}/equipment/{equipmentId}`

Removes an equipment item from the character and returns the updated character equipment list.

Requires bearer token.

Returns:

- `200` with the updated character equipment response
- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `404` with `{ "error": "Character equipment not found" }`
- `500` with `{ "error": "Failed to remove character equipment" }`

### `GET /api/characters/{id}/ability-score-options`

Returns the current ability score selection state for the character.

Requires bearer token.

Response fields:

- `characterId`
- `backgroundId`
- `backgroundName`
- `selectionRules`
- `selectedAbilityScores`
- `availableChoices`

Returns:

- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `500` with `{ "error": "Failed to fetch character ability score options" }`

### `PUT /api/characters/{id}/ability-scores`

Persists the selected ability scores for the character.

Requires bearer token.

Request body fields:

- `abilityScores.base`
- `abilityScores.bonuses`

Validation rules:

- `base` and `bonuses` must each contain exactly `STR`, `DEX`, `CON`, `INT`, `WIS`, and `CHA`.
- All values must be integers.
- For character levels `1` to `3`, each base score must be between `8` and `15`.
- Each bonus must be between `0` and `2`.
- Positive bonuses must target abilities allowed by the character's background.
- The current background rule requires a `+2/+1` split across different allowed abilities.

Returns:

- `200` with the updated ability score selection response
- `400` with a specific validation message, for example `{ "error": "Invalid character ability scores payload: base.DEX must be between 8 and 15 for character levels 1 to 3; received 16" }`
- `400` with `{ "error": "Ability score selection is not available for this character" }`
- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `500` with `{ "error": "Failed to update character ability scores" }`

### `GET /api/characters/{id}/spell-options`

Returns the spell list available for the character's class.

Requires bearer token.

Response fields:

- `characterId`
- `classId`
- `className`
- `spells`

If the character has no spellcasting class, `spells` is returned as an empty array.

Returns:

- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `500` with `{ "error": "Failed to fetch character spell options" }`

### `GET /api/characters/{id}/spell-selection`

Returns the current spell selection state for the character.

Requires bearer token.

Response fields:

- `characterId`
- `classId`
- `className`
- `level`
- `selectionRules`
- `selectedSpells`
- `availableSpells`

Returns:

- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `500` with `{ "error": "Failed to fetch character spell selection" }`

### `PUT /api/characters/{id}/spells`

Replaces the character's selected spells.

Requires bearer token.

Request body fields:

- `spellIds`

Returns:

- `200` with the updated spell selection response
- `400` for invalid payloads or invalid spell selections
- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `500` with `{ "error": "Failed to update character spells" }`

## Example Responses

Token response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwib3duZXJJZCI6MSwidXNlcm5hbWUiOiJkZW1vIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDM2MDB9.signature"
}
```

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

Character detail:

```json
{
  "id": 101,
  "name": "Merien",
  "status": "complete",
  "classId": 12,
  "speciesId": 3,
  "backgroundId": 13,
  "level": 1,
  "missingFields": [],
  "pendingChoices": [],
  "skillProficiencies": ["Arcana", "History"],
  "abilityScores": {
    "base": {
      "STR": 8,
      "DEX": 14,
      "CON": 13,
      "INT": 15,
      "WIS": 12,
      "CHA": 10
    },
    "bonuses": {
      "STR": 0,
      "DEX": 0,
      "CON": 0,
      "INT": 2,
      "WIS": 1,
      "CHA": 0
    },
    "final": {
      "STR": 8,
      "DEX": 14,
      "CON": 13,
      "INT": 17,
      "WIS": 13,
      "CHA": 10
    }
  },
  "abilityModifiers": {
    "STR": -1,
    "DEX": 2,
    "CON": 1,
    "INT": 3,
    "WIS": 1,
    "CHA": 0
  },
  "armorClass": {
    "total": 12,
    "base": 10,
    "dexModifierApplied": 2,
    "classBonus": 0,
    "shieldBonus": 0,
    "sources": [
      {
        "name": "Base AC",
        "type": "base",
        "value": 10
      }
    ]
  },
  "weaponAttacks": [
    {
      "equipmentId": 42,
      "name": "Shortbow",
      "attackType": "ranged",
      "ability": "DEX",
      "isProficient": true,
      "abilityModifier": 2,
      "proficiencyBonus": 2,
      "attackBonus": 4,
      "damage": {
        "formula": "1d6 + 2",
        "base": "1d6",
        "modifier": 2,
        "damageType": "Piercing"
      },
      "properties": ["Ammunition", "Two-Handed"],
      "range": {
        "normal": 80,
        "long": 320,
        "unit": "ft"
      }
    }
  ],
  "hitPoints": {
    "max": 7,
    "current": 7,
    "temporary": 0,
    "hitDie": 6,
    "conModifier": 1,
    "calculation": "6 + 1"
  },
  "savingThrows": [
    {
      "ability": "STR",
      "isProficient": false,
      "abilityModifier": -1,
      "proficiencyBonus": 0,
      "bonus": 0,
      "total": -1,
      "sources": [{ "type": "abilityModifier", "value": -1 }]
    },
    {
      "ability": "DEX",
      "isProficient": false,
      "abilityModifier": 2,
      "proficiencyBonus": 0,
      "bonus": 0,
      "total": 2,
      "sources": [{ "type": "abilityModifier", "value": 2 }]
    },
    {
      "ability": "CON",
      "isProficient": false,
      "abilityModifier": 1,
      "proficiencyBonus": 0,
      "bonus": 0,
      "total": 1,
      "sources": [{ "type": "abilityModifier", "value": 1 }]
    },
    {
      "ability": "INT",
      "isProficient": true,
      "abilityModifier": 3,
      "proficiencyBonus": 2,
      "bonus": 0,
      "total": 5,
      "sources": [
        { "type": "abilityModifier", "value": 3 },
        { "type": "classProficiency", "value": 2 }
      ]
    },
    {
      "ability": "WIS",
      "isProficient": true,
      "abilityModifier": 1,
      "proficiencyBonus": 2,
      "bonus": 0,
      "total": 3,
      "sources": [
        { "type": "abilityModifier", "value": 1 },
        { "type": "classProficiency", "value": 2 }
      ]
    },
    {
      "ability": "CHA",
      "isProficient": false,
      "abilityModifier": 0,
      "proficiencyBonus": 0,
      "bonus": 0,
      "total": 0,
      "sources": [{ "type": "abilityModifier", "value": 0 }]
    }
  ],
  "initiative": {
    "ability": "DEX",
    "abilityModifier": 2,
    "bonus": 0,
    "total": 2,
    "sources": [{ "type": "abilityModifier", "ability": "DEX", "value": 2 }]
  },
  "passivePerception": {
    "skill": "Perception",
    "ability": "WIS",
    "base": 10,
    "skillModifier": 1,
    "bonus": 0,
    "total": 11,
    "sources": [
      { "type": "base", "value": 10 },
      { "type": "skillModifier", "value": 1 }
    ]
  },
  "movement": {
    "baseSpeed": 30,
    "unit": "ft",
    "sources": [{ "type": "species", "name": "Human", "value": 30 }]
  },
  "inventoryWeight": {
    "total": 2,
    "unit": "lb",
    "sources": [
      {
        "equipmentId": 42,
        "name": "Shortbow",
        "quantity": 1,
        "weight": 2,
        "total": 2
      }
    ]
  },
  "spellcastingSummary": {
    "canCastSpells": true,
    "ability": "INT",
    "abilityModifier": 3,
    "spellSaveDc": 13,
    "spellAttackBonus": 5,
    "selectedSpellsCount": 0,
    "selectedCantripsCount": 1
  },
  "spellSlots": [
    {
      "level": 1,
      "max": 2,
      "used": 0,
      "available": 2
    }
  ],
  "selectedSpells": [
    {
      "id": 1,
      "name": "Acid Splash",
      "slug": "acid-splash",
      "level": 0,
      "levelLabel": "Cantrip",
      "school": "Evocation",
      "castingTime": "Action",
      "range": "60 feet",
      "components": ["V", "S"],
      "duration": "Instantaneous",
      "selectionType": "cantrip"
    }
  ],
  "currency": {
    "cp": 0,
    "sp": 0,
    "ep": 0,
    "gp": 8,
    "pp": 0
  },
  "abilityScoreRules": {
    "source": "background",
    "allowedChoices": ["CON", "INT", "WIS"],
    "bonusRules": {
      "mode": "standard_background",
      "options": [
        {
          "type": "plus2_plus1",
          "choices": [
            { "bonus": 2, "count": 1 },
            { "bonus": 1, "count": 1, "mustBeDifferentFromBonus": 2 }
          ]
        },
        {
          "type": "plus1_each_suggested",
          "basedOn": "abilityscores"
        }
      ]
    }
  },
  "classDetails": {
    "id": 12,
    "name": "Wizard",
    "slug": "wizard",
    "description": "A learned arcane scholar who studies the inner workings of magic to prepare spells, master rituals, and wield unmatched magical versatility.",
    "role": "caster",
    "hitDie": 6,
    "primaryAttributes": ["INT"],
    "recommendedSkills": [
      "Arcana",
      "Investigation",
      "History",
      "Nature",
      "Religion"
    ],
    "savingThrows": ["INT", "WIS"],
    "spellcasting": {
      "ability": "INT",
      "usesSpellbook": true,
      "canCastRituals": true,
      "selection": {
        "mode": "spellbook_plus_prepared",
        "selectionType": "prepared",
        "changesWhen": "long_rest",
        "cantrips": { "1": 3 },
        "preparedSpells": { "1": 4 },
        "spellbookSpells": { "1": 6 },
        "spellsAddedPerLevel": 2
      }
    },
    "skillProficiencyChoices": {
      "choose": 2,
      "options": [
        "Arcana",
        "History",
        "Insight",
        "Investigation",
        "Medicine",
        "Religion"
      ]
    },
    "weaponProficiencies": ["Simple Weapons"],
    "armorTraining": [],
    "startingEquipmentOptions": [
      {
        "label": "A",
        "items": ["Quarterstaff", "Scholar's Pack", "Spellbook", "5 GP"]
      },
      {
        "label": "B",
        "items": ["Dagger", "Scholar's Pack", "Spellbook", "5 GP"]
      }
    ],
    "equipmentOptions": [
      "Quarterstaff, Scholar's Pack, Spellbook, and 5 GP",
      "Dagger, Scholar's Pack, Spellbook, and 5 GP"
    ],
    "subclasses": ["Evoker"],
    "featuresByLevel": []
  },
  "speciesDetails": {
    "id": 3,
    "name": "Elf",
    "slug": "elf",
    "description": "Elves are a magical people of otherworldly grace.",
    "creatureType": "Humanoid",
    "size": "Medium",
    "speed": 30,
    "specialTraits": [
      {
        "name": "Darkvision",
        "description": "You have Darkvision with a range of 60 feet."
      }
    ]
  },
  "backgroundDetails": {
    "id": 13,
    "name": "Sage",
    "slug": "sage",
    "description": "You spent your formative years traveling between manors and monasteries, performing various odd jobs and services in exchange for access to their libraries.",
    "abilityScores": ["CON", "INT", "WIS"],
    "feat": "Magic Initiate (Wizard)",
    "skillProficiencies": ["Arcana", "History"],
    "toolProficiency": "Calligrapher's Supplies",
    "equipmentOptions": [
      "Quarterstaff, Calligrapher's Supplies, Book (history), Parchment (8 sheets), Robe, 8 GP",
      "50 GP"
    ]
  }
}
```

Character skills:

```json
[
  {
    "name": "Arcana",
    "ability": "INT",
    "isProficient": true,
    "abilityModifier": 3,
    "proficiencyBonus": 2,
    "total": 5
  },
  {
    "name": "Stealth",
    "ability": "DEX",
    "isProficient": false,
    "abilityModifier": 2,
    "proficiencyBonus": 0,
    "total": 2
  }
]
```

Character equipment:

```json
{
  "characterId": 101,
  "equipment": [
    {
      "id": 42,
      "name": "Longsword",
      "category": "Weapon",
      "type": "Weapon",
      "quantity": 3,
      "isEquipped": false
    }
  ]
}
```

Character ability score options:

```json
{
  "characterId": 101,
  "backgroundId": 13,
  "backgroundName": "Sage",
  "selectionRules": {
    "source": "background",
    "allowedChoices": ["CON", "INT", "WIS"],
    "bonusRules": {
      "mode": "standard_background",
      "options": [
        {
          "type": "plus2_plus1",
          "choices": [
            { "bonus": 2, "count": 1 },
            { "bonus": 1, "count": 1, "mustBeDifferentFromBonus": 2 }
          ]
        },
        {
          "type": "plus1_each_suggested",
          "basedOn": "abilityscores"
        }
      ]
    }
  },
  "selectedAbilityScores": {
    "base": {
      "STR": 8,
      "DEX": 14,
      "CON": 13,
      "INT": 15,
      "WIS": 12,
      "CHA": 10
    },
    "bonuses": {
      "STR": 0,
      "DEX": 0,
      "CON": 0,
      "INT": 2,
      "WIS": 1,
      "CHA": 0
    },
    "final": {
      "STR": 8,
      "DEX": 14,
      "CON": 13,
      "INT": 17,
      "WIS": 13,
      "CHA": 10
    }
  },
  "availableChoices": ["CON", "INT", "WIS"]
}
```

Character spell selection:

```json
{
  "characterId": 101,
  "classId": 12,
  "className": "Wizard",
  "level": 1,
  "selectionRules": {
    "canSelectSpells": true,
    "selectionType": "prepared",
    "maxCantrips": 3,
    "maxSpells": 0
  },
  "selectedSpells": [],
  "availableSpells": [
    {
      "id": 1,
      "name": "Acid Splash",
      "level": 0,
      "levelLabel": "Cantrip"
    }
  ]
}
```

Background detail:

```json
{
  "id": 1,
  "name": "Acolyte",
  "slug": "acolyte",
  "description": "You devoted yourself to service in a temple, either nestled in a town or secluded in a sacred grove.",
  "abilityScores": ["INT", "WIS", "CHA"],
  "feat": "Magic Initiate (Cleric)",
  "skillProficiencies": ["Insight", "Religion"],
  "toolProficiency": "Calligrapher's Supplies",
  "equipmentOptions": [
    "Calligrapher's Supplies, Book (prayers), Holy Symbol, Parchment (10 sheets), Robe, 8 GP",
    "50 GP"
  ]
}
```

Equipment detail:

```json
{
  "id": 1,
  "name": "Club",
  "slug": "club",
  "category": "Weapon",
  "type": "Weapon",
  "description": "A simple melee weapon.",
  "cost": "1 sp",
  "weight": 2,
  "isMagical": false,
  "modifiers": [],
  "effects": [],
  "details": {
    "kind": "weapon",
    "weaponCategory": "Simple",
    "attackType": "Melee",
    "damage": {
      "formula": "1d4",
      "dice": [{ "count": 1, "value": 4 }],
      "bonus": 0,
      "damageType": "Bludgeoning"
    },
    "versatileDamage": null,
    "properties": [
      {
        "name": "Light",
        "slug": "light"
      }
    ],
    "mastery": {
      "name": "Slow",
      "slug": "slow"
    },
    "range": null,
    "proficiencyType": "Simple Weapons",
    "ammunitionType": null
  }
}
```

Class detail:

```json
{
  "id": 1,
  "name": "Barbarian",
  "slug": "barbarian",
  "description": "A fierce warrior who relies on raw strength and primal fury to overcome enemies.",
  "role": "melee",
  "hitdie": 12,
  "primaryattributes": ["STR"],
  "recommendedskills": [
    "Athletics",
    "Survival",
    "Intimidation"
  ],
  "savingthrows": ["STR", "CON"],
  "spellcasting": null,
  "skillProficiencyChoices": {
    "choose": 2,
    "options": [
      "Animal Handling",
      "Athletics",
      "Intimidation",
      "Nature",
      "Perception",
      "Survival"
    ]
  },
  "weaponProficiencies": ["Simple Weapons", "Martial Weapons"],
  "armorTraining": ["Light Armor", "Medium Armor", "Shield"],
  "startingEquipmentOptions": [
    {
      "label": "A",
      "items": ["Greataxe", "4 Handaxes", "Explorer's Pack", "15 GP"]
    },
    {
      "label": "B",
      "items": ["75 GP"]
    }
  ],
  "equipmentOptions": [
    "Greataxe, 4 Handaxes, Explorer's Pack, and 15 GP",
    "75 GP"
  ],
  "subclasses": ["Berserker", "Wild Heart", "World Tree", "Zealot"],
  "levelprogression": []
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

Species detail:

```json
{
  "id": 1,
  "name": "Dragonborn",
  "slug": "dragonborn",
  "description": "Dragonborn look like wingless, bipedal dragons.",
  "creatureType": "Humanoid",
  "size": "Medium",
  "speed": 30,
  "specialTraits": [
    {
      "name": "Draconic Ancestry",
      "description": "You have a dragon ancestor, which grants you a Breath Weapon and damage resistance tied to that ancestry."
    }
  ],
  "subspecies": [
    {
      "name": "Black Dragon Ancestry",
      "slug": "black-dragon-ancestry",
      "description": "A dragonborn ancestry tied to black dragons and acid damage.",
      "specialTraits": [
        {
          "name": "Damage Type",
          "description": "Your Draconic Ancestry damage type is Acid."
        }
      ]
    }
  ]
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
│   │   ├── auth
│   │   ├── backgrounds
│   │   ├── characters
│   │   ├── classes
│   │   ├── skills
│   │   ├── species
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
