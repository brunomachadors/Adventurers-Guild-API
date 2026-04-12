#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_BASE_URL = 'https://adventurers-guild-api.vercel.app/api';
const DEFAULT_OUTPUT_DIR = path.join(process.cwd(), 'generated', 'postman-site');
const DEFAULT_SITE_TITLE = 'Adventurers Guild API Postman Validation Strategy';

function parseArgs(argv) {
  const args = {
    baseUrl: DEFAULT_BASE_URL,
    outputDir: DEFAULT_OUTPUT_DIR,
    siteTitle: DEFAULT_SITE_TITLE,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === '--base-url' && next) {
      args.baseUrl = next;
      index += 1;
      continue;
    }

    if (current === '--output-dir' && next) {
      args.outputDir = path.resolve(next);
      index += 1;
      continue;
    }

    if (current === '--site-title' && next) {
      args.siteTitle = next;
      index += 1;
      continue;
    }
  }

  return args;
}

function normalizeBaseUrl(baseUrl) {
  const trimmedBaseUrl = baseUrl.trim().replace(/\/+$/, '');

  if (trimmedBaseUrl.endsWith('/api')) {
    return trimmedBaseUrl.slice(0, -4);
  }

  return trimmedBaseUrl;
}

function ensureDirectory(directoryPath) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

function writeJson(filePath, payload) {
  fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function writeText(filePath, payload) {
  fs.writeFileSync(filePath, `${payload}\n`, 'utf8');
}

function createEnvironment(baseUrl) {
  return {
    id: 'adventurers-guild-api-local-environment',
    name: 'Adventurers Guild API - Generated Environment',
    values: [
      { key: 'baseUrl', value: baseUrl, enabled: true, type: 'default' },
      { key: 'authUsername', value: 'demo', enabled: true, type: 'default' },
      { key: 'authPassword', value: 'demo123', enabled: true, type: 'default' },
      { key: 'authToken', value: '', enabled: true, type: 'secret' },
      { key: 'characterId', value: '', enabled: true, type: 'default' },
      { key: 'equipmentId', value: '', enabled: true, type: 'default' },
      { key: 'spellId', value: '', enabled: true, type: 'default' },
      { key: 'cantripId', value: '', enabled: true, type: 'default' },
      { key: 'speciesId', value: '7', enabled: true, type: 'default' },
      { key: 'backgroundId', value: '16', enabled: true, type: 'default' },
      { key: 'classId', value: '1', enabled: true, type: 'default' },
      { key: 'characterName', value: 'Postman Validation Character', enabled: true, type: 'default' },
    ],
    _postman_variable_scope: 'environment',
    _postman_exported_at: new Date().toISOString(),
    _postman_exported_using: 'Codex Postman Site Generator',
  };
}

function jsonHeader() {
  return {
    key: 'Content-Type',
    value: 'application/json',
    type: 'text',
  };
}

function authHeader() {
  return {
    key: 'Authorization',
    value: 'Bearer {{authToken}}',
    type: 'text',
  };
}

function testScript(lines) {
  return [
    {
      listen: 'test',
      script: {
        type: 'text/javascript',
        exec: lines,
      },
    },
  ];
}

function jsonBody(payload) {
  return {
    mode: 'raw',
    raw: JSON.stringify(payload, null, 2),
    options: {
      raw: {
        language: 'json',
      },
    },
  };
}

function rawJsonBody(raw) {
  return {
    mode: 'raw',
    raw,
    options: {
      raw: {
        language: 'json',
      },
    },
  };
}

function createRequest({ name, method, pathSegments, headers = [], body, tests }) {
  return {
    name,
    request: {
      method,
      header: headers,
      body,
      url: {
        raw: `{{baseUrl}}/${pathSegments.join('/')}`,
        host: ['{{baseUrl}}'],
        path: pathSegments,
      },
      description: name,
    },
    event: testScript(tests),
  };
}

function createCollection(baseUrl) {
  return {
    info: {
      name: 'Adventurers Guild API - Validation Strategy',
      description:
        'Generated Postman collection with a complete validation journey for the Adventurers Guild API.',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    variable: [
      { key: 'baseUrl', value: baseUrl },
    ],
    item: [
      {
        name: '1. Auth',
        item: [
          createRequest({
            name: 'Issue Auth Token',
            method: 'POST',
            pathSegments: ['api', 'auth', 'token'],
            headers: [jsonHeader()],
            body: jsonBody({
              username: '{{authUsername}}',
              password: '{{authPassword}}',
            }),
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body).to.have.property('token');",
              "pm.environment.set('authToken', body.token);",
            ],
          }),
        ],
      },
      {
        name: '2. Catalog Smoke',
        item: [
          createRequest({
            name: 'List Classes',
            method: 'GET',
            pathSegments: ['api', 'classes'],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              'pm.expect(Array.isArray(body)).to.eql(true);',
              'pm.expect(body.length).to.be.greaterThan(0);',
            ],
          }),
          createRequest({
            name: 'Get Barbarian Detail',
            method: 'GET',
            pathSegments: ['api', 'classes', 'barbarian'],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body.name).to.eql('Barbarian');",
              "pm.expect(body).to.have.property('skillProficiencyChoices');",
              "pm.expect(body).to.have.property('weaponProficiencies');",
              "pm.expect(body).to.have.property('armorTraining');",
              "pm.expect(body).to.have.property('startingEquipmentOptions');",
            ],
          }),
          createRequest({
            name: 'Get Soldier Detail',
            method: 'GET',
            pathSegments: ['api', 'backgrounds', 'soldier'],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body.name).to.eql('Soldier');",
              "pm.expect(body).to.have.property('equipmentOptions');",
            ],
          }),
          createRequest({
            name: 'Get Human Detail',
            method: 'GET',
            pathSegments: ['api', 'species', 'human'],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body.name).to.eql('Human');",
              "pm.expect(body).to.have.property('speed');",
            ],
          }),
          createRequest({
            name: 'Get Longsword Detail',
            method: 'GET',
            pathSegments: ['api', 'equipment', 'longsword'],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body.name).to.eql('Longsword');",
              "pm.environment.set('equipmentId', String(body.id));",
            ],
          }),
        ],
      },
      {
        name: '3. Character Lifecycle',
        item: [
          createRequest({
            name: 'Create Draft Character',
            method: 'POST',
            pathSegments: ['api', 'characters'],
            headers: [jsonHeader(), authHeader()],
            body: jsonBody({
              name: '{{characterName}}',
            }),
            tests: [
              "pm.test('Status is 201', function () { pm.response.to.have.status(201); });",
              'const body = pm.response.json();',
              "pm.expect(body).to.have.property('id');",
              "pm.environment.set('characterId', String(body.id));",
              "pm.expect(body.status).to.eql('draft');",
            ],
          }),
          createRequest({
            name: 'Get Draft Character',
            method: 'GET',
            pathSegments: ['api', 'characters', '{{characterId}}'],
            headers: [authHeader()],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body.id).to.eql(Number(pm.environment.get('characterId')));",
              "pm.expect(body.classId).to.eql(null);",
            ],
          }),
          createRequest({
            name: 'Add Class Species Background',
            method: 'PATCH',
            pathSegments: ['api', 'characters', '{{characterId}}'],
            headers: [jsonHeader(), authHeader()],
            body: rawJsonBody(`{
  "classId": {{classId}},
  "speciesId": {{speciesId}},
  "backgroundId": {{backgroundId}},
  "level": 1
}`),
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body.classId).to.eql(Number(pm.environment.get('classId')));",
              "pm.expect(body.speciesId).to.eql(Number(pm.environment.get('speciesId')));",
              "pm.expect(body.backgroundId).to.eql(Number(pm.environment.get('backgroundId')));",
              'pm.expect(Array.isArray(body.pendingChoices)).to.eql(true);',
            ],
          }),
          createRequest({
            name: 'Get Character After Base Choices',
            method: 'GET',
            pathSegments: ['api', 'characters', '{{characterId}}'],
            headers: [authHeader()],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body.classDetails).to.not.eql(null);",
              "pm.expect(body.speciesDetails).to.not.eql(null);",
              "pm.expect(body.backgroundDetails).to.not.eql(null);",
              'pm.expect(Array.isArray(body.pendingChoices)).to.eql(true);',
            ],
          }),
        ],
      },
      {
        name: '4. Character Scores And Skills',
        item: [
          createRequest({
            name: 'Get Ability Score Options',
            method: 'GET',
            pathSegments: ['api', 'characters', '{{characterId}}', 'ability-score-options'],
            headers: [authHeader()],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body).to.have.property('selectionRules');",
              "pm.expect(body).to.have.property('availableChoices');",
            ],
          }),
          createRequest({
            name: 'Set Ability Scores',
            method: 'PUT',
            pathSegments: ['api', 'characters', '{{characterId}}', 'ability-scores'],
            headers: [jsonHeader(), authHeader()],
            body: jsonBody({
              abilityScores: {
                base: {
                  STR: 15,
                  DEX: 13,
                  CON: 14,
                  INT: 8,
                  WIS: 12,
                  CHA: 10,
                },
                bonuses: {
                  STR: 2,
                  DEX: 0,
                  CON: 1,
                  INT: 0,
                  WIS: 0,
                  CHA: 0,
                },
              },
            }),
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body.selectedAbilityScores).to.have.property('final');",
              "pm.expect(body.selectedAbilityScores.final.STR).to.eql(17);",
            ],
          }),
          createRequest({
            name: 'Add Skill Proficiencies',
            method: 'PATCH',
            pathSegments: ['api', 'characters', '{{characterId}}'],
            headers: [jsonHeader(), authHeader()],
            body: jsonBody({
              skillProficiencies: ['Athletics', 'Intimidation', 'Perception', 'Survival'],
            }),
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              'pm.expect(body.skillProficiencies).to.include.members([\'Athletics\', \'Perception\']);',
            ],
          }),
          createRequest({
            name: 'Get Derived Skills',
            method: 'GET',
            pathSegments: ['api', 'characters', '{{characterId}}', 'skills'],
            headers: [authHeader()],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              'pm.expect(Array.isArray(body)).to.eql(true);',
              'pm.expect(body.length).to.be.greaterThan(0);',
            ],
          }),
        ],
      },
      {
        name: '5. Character Equipment',
        item: [
          createRequest({
            name: 'Choose Class Equipment Package',
            method: 'POST',
            pathSegments: ['api', 'characters', '{{characterId}}', 'equipment', 'class-choice'],
            headers: [jsonHeader(), authHeader()],
            body: jsonBody({
              optionLabel: 'A',
            }),
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body).to.have.property('addedEquipment');",
              "pm.expect(body).to.have.property('pendingChoices');",
            ],
          }),
          createRequest({
            name: 'Choose Background Equipment Package',
            method: 'POST',
            pathSegments: ['api', 'characters', '{{characterId}}', 'equipment', 'background-choice'],
            headers: [jsonHeader(), authHeader()],
            body: jsonBody({
              optionIndex: 0,
            }),
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body.pendingChoices).to.eql([]);",
              "pm.expect(body).to.have.property('addedCurrency');",
            ],
          }),
          createRequest({
            name: 'Add Longsword Equipment',
            method: 'POST',
            pathSegments: ['api', 'characters', '{{characterId}}', 'equipment'],
            headers: [jsonHeader(), authHeader()],
            body: rawJsonBody(`{
  "equipmentId": {{equipmentId}},
  "quantity": 1,
  "isEquipped": true
}`),
            tests: [
              "pm.test('Status is 201', function () { pm.response.to.have.status(201); });",
              'const body = pm.response.json();',
              'pm.expect(Array.isArray(body.equipment)).to.eql(true);',
            ],
          }),
          createRequest({
            name: 'Get Character Equipment',
            method: 'GET',
            pathSegments: ['api', 'characters', '{{characterId}}', 'equipment'],
            headers: [authHeader()],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              'pm.expect(Array.isArray(body.equipment)).to.eql(true);',
              'pm.expect(body).to.have.property("characterId");',
            ],
          }),
        ],
      },
      {
        name: '6. Character Spellcasting',
        item: [
          createRequest({
            name: 'Get Spell Options',
            method: 'GET',
            pathSegments: ['api', 'characters', '{{characterId}}', 'spell-options'],
            headers: [authHeader()],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body).to.have.property('characterId');",
              "pm.expect(body).to.have.property('classId');",
              "pm.expect(body).to.have.property('className');",
              "if (body.selectionRules) {",
              "  pm.expect(body.selectionRules).to.have.property('canSelectSpells');",
              "}",
              "if (body.selectionRules && body.selectionRules.canSelectSpells) {",
              "  pm.expect(body).to.have.property('availableSpells');",
              "  pm.expect(Array.isArray(body.availableSpells)).to.eql(true);",
              "} else {",
              "  pm.expect(body.availableSpells === undefined || Array.isArray(body.availableSpells)).to.eql(true);",
              "}",
            ],
          }),
          createRequest({
            name: 'Get Spell Selection',
            method: 'GET',
            pathSegments: ['api', 'characters', '{{characterId}}', 'spell-selection'],
            headers: [authHeader()],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body).to.have.property('characterId');",
              "pm.expect(body.selectedSpells === undefined || Array.isArray(body.selectedSpells)).to.eql(true);",
              "if (body.selectionRules) {",
              "  pm.expect(body.selectionRules).to.have.property('canSelectSpells');",
              "}",
              "if (body.selectedSpells !== undefined) {",
              "  pm.expect(Array.isArray(body.selectedSpells)).to.eql(true);",
              "}",
            ],
          }),
        ],
      },
      {
        name: '7. Character Final Detail',
        item: [
          createRequest({
            name: 'Get Full Character Detail',
            method: 'GET',
            pathSegments: ['api', 'characters', '{{characterId}}'],
            headers: [authHeader()],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body).to.have.property('abilityScores');",
              "pm.expect(body).to.have.property('abilityModifiers');",
              "pm.expect(body).to.have.property('savingThrows');",
              "pm.expect(body).to.have.property('armorClass');",
              "pm.expect(body).to.have.property('hitPoints');",
              "pm.expect(body).to.have.property('initiative');",
              "pm.expect(body).to.have.property('passivePerception');",
              "pm.expect(body).to.have.property('movement');",
              "pm.expect(body).to.have.property('inventoryWeight');",
              "pm.expect(body).to.have.property('weaponAttacks');",
              "pm.expect(body).to.have.property('spellcastingSummary');",
              "pm.expect(body).to.have.property('pendingChoices');",
            ],
          }),
          createRequest({
            name: 'Delete Character',
            method: 'DELETE',
            pathSegments: ['api', 'characters', '{{characterId}}'],
            headers: [authHeader()],
            tests: [
              "pm.test('Status is 200', function () { pm.response.to.have.status(200); });",
              'const body = pm.response.json();',
              "pm.expect(body.message).to.eql('Character deleted successfully');",
            ],
          }),
        ],
      },
    ],
  };
}

function createReadme(siteTitle, baseUrl) {
  return `# ${siteTitle}

This bundle was generated to help validate the Adventurers Guild API in Postman using the final deployed URL.

## Included files

- \`adventurers-guild.postman_collection.json\`
- \`adventurers-guild.postman_environment.json\`
- \`index.html\`

## Recommended execution strategy

1. Import the collection and environment into Postman.
2. Update \`baseUrl\` in the environment if you generated this with a placeholder.
3. Fill \`authUsername\` and \`authPassword\`.
4. Run the collection in order:
   - Auth
   - Catalog Smoke
   - Character Lifecycle
   - Character Scores And Skills
   - Character Equipment
   - Character Spellcasting
   - Character Final Detail

## Base URL

\`${baseUrl}\`

## CI / Newman example

\`\`\`bash
newman run adventurers-guild.postman_collection.json \\
  -e adventurers-guild.postman_environment.json \\
  --reporters cli,htmlextra
\`\`\`

## Evidence checklist

- Token issued successfully
- Catalog endpoints responding with stable payloads
- Character lifecycle works end-to-end
- Equipment selection updates pending choices and currency
- Derived stats appear in final detail
- Cleanup via DELETE succeeds
`;
}

function createHtmlSite(siteTitle, baseUrl) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${siteTitle}</title>
    <style>
      :root {
        --bg: #f5efe5;
        --panel: #fffaf2;
        --ink: #1d1a16;
        --muted: #6d655b;
        --accent: #8b3a1f;
        --accent-soft: #e7c7b6;
        --line: #d9c8b6;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, #fff8ef 0%, transparent 40%),
          linear-gradient(180deg, #efe3d4 0%, var(--bg) 100%);
      }
      .wrap {
        max-width: 1100px;
        margin: 0 auto;
        padding: 48px 24px 80px;
      }
      .hero, .panel {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: 20px;
        box-shadow: 0 14px 40px rgba(59, 38, 23, 0.08);
      }
      .hero {
        padding: 32px;
        margin-bottom: 24px;
      }
      .eyebrow {
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: var(--accent);
        font-size: 12px;
        margin-bottom: 12px;
      }
      h1, h2, h3 { margin: 0 0 12px; line-height: 1.1; }
      h1 { font-size: clamp(2.2rem, 5vw, 4rem); }
      h2 { font-size: 1.6rem; }
      p, li { font-size: 1rem; line-height: 1.65; color: var(--ink); }
      .muted { color: var(--muted); }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 20px;
      }
      .panel { padding: 24px; }
      code, pre {
        font-family: "SFMono-Regular", Consolas, monospace;
        background: #2a211a;
        color: #fff4e7;
        border-radius: 12px;
      }
      code {
        padding: 0.2em 0.5em;
      }
      pre {
        padding: 16px;
        overflow: auto;
      }
      ol, ul { padding-left: 20px; }
      .stack > * + * { margin-top: 18px; }
      .pill {
        display: inline-block;
        padding: 8px 12px;
        border-radius: 999px;
        background: var(--accent-soft);
        color: var(--accent);
        font-weight: 700;
        margin: 6px 8px 0 0;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <section class="hero stack">
        <div class="eyebrow">Generated Validation Site</div>
        <h1>${siteTitle}</h1>
        <p class="muted">
          A complete Postman-oriented validation strategy for the Adventurers Guild API using the final deployed URL.
        </p>
        <p><strong>Base URL:</strong> <code>${baseUrl}</code></p>
        <div>
          <span class="pill">Auth</span>
          <span class="pill">Catalog</span>
          <span class="pill">Characters</span>
          <span class="pill">Equipment</span>
          <span class="pill">Derived Stats</span>
          <span class="pill">Cleanup</span>
        </div>
      </section>

      <section class="grid">
        <article class="panel stack">
          <h2>Execution Order</h2>
          <ol>
            <li>Issue auth token.</li>
            <li>Smoke-test catalog endpoints.</li>
            <li>Create a draft character.</li>
            <li>Apply class, species, and background.</li>
            <li>Resolve ability scores, skills, and equipment choices.</li>
            <li>Check final derived stats in detail.</li>
            <li>Delete the character for cleanup.</li>
          </ol>
        </article>

        <article class="panel stack">
          <h2>Environment Variables</h2>
          <ul>
            <li><code>baseUrl</code></li>
            <li><code>authUsername</code></li>
            <li><code>authPassword</code></li>
            <li><code>authToken</code></li>
            <li><code>characterId</code></li>
            <li><code>equipmentId</code></li>
          </ul>
        </article>

        <article class="panel stack">
          <h2>Critical Assertions</h2>
          <ul>
            <li>JWT token is issued and reused.</li>
            <li>Class, species, and background enrichment is present.</li>
            <li>Pending equipment choices clear correctly.</li>
            <li>Currency from kit choices is accumulated.</li>
            <li>Armor class, hit points, initiative, saves, and movement are resolved.</li>
            <li>Cleanup removes test data at the end.</li>
          </ul>
        </article>
      </section>

      <section class="panel stack" style="margin-top: 24px;">
        <h2>Recommended Newman Run</h2>
        <pre>newman run adventurers-guild.postman_collection.json \\
  -e adventurers-guild.postman_environment.json \\
  --reporters cli,htmlextra</pre>
      </section>
    </div>
  </body>
</html>`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const normalizedBaseUrl = normalizeBaseUrl(args.baseUrl);

  ensureDirectory(args.outputDir);

  const collection = createCollection(normalizedBaseUrl);
  const environment = createEnvironment(normalizedBaseUrl);
  const html = createHtmlSite(args.siteTitle, normalizedBaseUrl);
  const readme = createReadme(args.siteTitle, normalizedBaseUrl);

  writeJson(
    path.join(args.outputDir, 'adventurers-guild.postman_collection.json'),
    collection,
  );
  writeJson(
    path.join(args.outputDir, 'adventurers-guild.postman_environment.json'),
    environment,
  );
  writeText(path.join(args.outputDir, 'index.html'), html);
  writeText(path.join(args.outputDir, 'README.md'), readme);

  console.log(`Generated Postman validation bundle in: ${args.outputDir}`);
  console.log(
    `Use --base-url to target your final deployment. Current baseUrl: ${normalizedBaseUrl}`,
  );
}

main();
