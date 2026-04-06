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

## Authentication

The API currently has a token issuance endpoint and a set of protected character endpoints.

Public token endpoint:

- `POST /api/auth/token`

Protected routes require:

- `Authorization: Bearer <token>`

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

Response fields:

- `id`
- `name`
- `status`
- `classId`
- `speciesId`
- `backgroundId`
- `level`
- `missingFields`
- `abilityScores`
- `abilityModifiers`
- `armorClass`
- `weaponAttacks`
- `hitPoints`
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
- `401` with `{ "error": "Unauthorized" }`
- `500` with `{ "error": "Failed to create character" }`

### `GET /api/characters/{id}`

Returns the authenticated owner's character detail.

Requires bearer token.

Response fields:

- `id`
- `name`
- `status`
- `classId`
- `speciesId`
- `backgroundId`
- `level`
- `missingFields`
- `skillProficiencies`
- `abilityScores`
- `abilityModifiers`
- `armorClass`
- `weaponAttacks`
- `hitPoints`
- `currency`
- `abilityScoreRules`
- `classDetails`
- `speciesDetails`
- `backgroundDetails`

Returns:

- `401` with `{ "error": "Unauthorized" }`
- `404` with `{ "error": "Character not found" }`
- `500` with `{ "error": "Failed to fetch character detail" }`

`armorClass` is calculated from the character's resolved DEX modifier and currently equipped armor or shield. If no armor is equipped, the base AC is `10`; Barbarian and Monk unarmored defense can contribute a `class` source when their rules apply.

`weaponAttacks` is derived from currently equipped weapons, class weapon proficiencies, character level, and resolved ability modifiers. If no weapon is equipped, it is returned as an empty array.

`hitPoints` is derived from the character's class hit die, level, and resolved CON modifier. It is returned as `null` until class details and ability modifiers are available; when calculated, `current` starts equal to `max` and `temporary` starts at `0`.

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

Returns:

- `200` with the updated character response
- `400` with `{ "error": "Invalid character request payload" }`
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

Returns:

- `200` with the updated ability score selection response
- `400` with `{ "error": "Invalid character ability scores payload" }`
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
