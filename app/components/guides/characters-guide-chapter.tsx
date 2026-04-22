'use client';

import { useState, type MouseEvent } from 'react';

type CharactersGuideChapterProps = {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
};

type CharacterTicketId =
  | 'create'
  | 'list-characters'
  | 'delete'
  | 'draft'
  | 'detail'
  | 'add-class'
  | 'add-specie'
  | 'add-background'
  | 'skills'
  | 'class-equipment-choice'
  | 'background-equipment-choice'
  | 'equipment'
  | 'currency'
  | 'spell'
  | 'attributes';

type CharacterTicket = {
  id: CharacterTicketId;
  kicker: string;
  title: string;
  detailsTitle: string;
  details: { label: string; value: string }[];
  responseHeading: string;
  responseSubheading: string;
  responseDescription: string;
  responseFields: {
    name: string;
    type: string;
    description: string;
  }[];
  responseExamples: {
    label: string;
    status: string;
    payload: unknown;
  }[];
};

const charactersIndexId = 'characters-index';
const characterFlowTicketOrder: CharacterTicketId[] = [
  'draft',
  'add-class',
  'add-specie',
  'add-background',
  'attributes',
  'skills',
  'class-equipment-choice',
  'background-equipment-choice',
  'spell',
  'detail',
];
const characterReferenceTicketOrder: CharacterTicketId[] = [
  'list-characters',
  'delete',
  'equipment',
  'currency',
];
const characterCreationSteps = [
  {
    step: '1',
    title: 'Draft',
    method: 'POST',
    endpoint: '/api/characters',
    note: 'Start the character with the name.',
  },
  {
    step: '2',
    title: 'Class',
    method: 'PATCH',
    endpoint: '/api/characters/{id}',
    note: 'Choose the class with classId.',
  },
  {
    step: '3',
    title: 'Specie',
    method: 'PATCH',
    endpoint: '/api/characters/{id}',
    note: 'Choose the species with speciesId.',
  },
  {
    step: '4',
    title: 'Background',
    method: 'PATCH',
    endpoint: '/api/characters/{id}',
    note: 'Choose the background with backgroundId.',
  },
  {
    step: '5',
    title: 'Attributes options',
    method: 'GET',
    endpoint: '/api/characters/{id}/ability-score-options',
    note: 'Read the rules before choosing the ability scores.',
  },
  {
    step: '6',
    title: 'Attributes save',
    method: 'PUT',
    endpoint: '/api/characters/{id}/ability-scores',
    note: 'Save the chosen ability scores.',
  },
  {
    step: '7',
    title: 'Skills',
    method: 'PATCH',
    endpoint: '/api/characters/{id}',
    note: 'Choose extra skill proficiencies when the class allows it.',
  },
  {
    step: '8',
    title: 'Class equipment',
    method: 'POST',
    endpoint: '/api/characters/{id}/equipment/class-choice',
    note: 'Resolve the class equipment package when classEquipmentSelection is pending.',
  },
  {
    step: '9',
    title: 'Background equipment',
    method: 'POST',
    endpoint: '/api/characters/{id}/equipment/background-choice',
    note: 'Resolve the background equipment package when backgroundEquipmentSelection is pending.',
  },
  {
    step: '10',
    title: 'Spell options',
    method: 'GET',
    endpoint: '/api/characters/{id}/spell-options',
    note: 'Only needed when spellcastingSummary.canCastSpells is true.',
  },
  {
    step: '11',
    title: 'Spell selection',
    method: 'GET',
    endpoint: '/api/characters/{id}/spell-selection',
    note: 'Read the current spell selection before saving changes.',
  },
  {
    step: '12',
    title: 'Spell save',
    method: 'PUT',
    endpoint: '/api/characters/{id}/spells',
    note: 'Save the chosen spells for the character.',
  },
  {
    step: '13',
    title: 'Review',
    method: 'GET',
    endpoint: '/api/characters/{id}',
    note: 'Read the final detail response and confirm the current state.',
  },
] as const;

const characterTickets: CharacterTicket[] = [
  {
    id: 'create',
    kicker: 'Overview',
    title: 'Create',
    detailsTitle: 'Wizard guidance',
    details: [
      {
        label: 'Recommended order',
        value:
          'Name, Class, Species, Background, Attributes, Skills, Equipment, Spells, Review.',
      },
      {
        label: 'Use missingFields',
        value:
          'Guide the user through required structure first: classId, speciesId and backgroundId.',
      },
      {
        label: 'Use pendingChoices',
        value:
          'After the base draft is filled, use pendingChoices to continue equipment selection.',
      },
      {
        label: 'Use spellcastingSummary',
        value:
          'Only show the spell step when spellcastingSummary.canCastSpells is true.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Guidance signals',
    responseDescription:
      'Create a Character should behave like a guided flow. After each request, read the updated character detail and decide the next step from missingFields, pendingChoices and spellcastingSummary.',
    responseFields: [
      {
        name: 'missingFields',
        type: 'string[]',
        description:
          'Structural fields still required to move the draft toward a complete character.',
      },
      {
        name: 'pendingChoices',
        type: 'string[]',
        description:
          'Open equipment decisions that still need user input after the base character is defined.',
      },
      {
        name: 'spellcastingSummary.canCastSpells',
        type: 'boolean',
        description:
          'Controls whether the flow needs a spell selection step.',
      },
      {
        name: 'status',
        type: 'draft | complete',
        description:
          'Status becomes complete when missingFields is empty, even if the flow still has pending choices to resolve.',
      },
    ],
    responseExamples: [
      {
        label: 'Recommended wizard flow',
        status: 'Create a Character',
        payload: [
          '1. Create a draft with the character name.',
          '2. Choose a class.',
          '3. Choose a species.',
          '4. Choose a background.',
          '5. Read ability-score-options and submit ability-scores.',
          '6. Choose extra skill proficiencies when needed.',
          '7. Resolve class and background equipment choices.',
          '8. If the class can cast spells, choose spells.',
          '9. Review the final detail response.',
        ],
      },
      {
        label: 'Guided detail response',
        status: 'GET /api/characters/{id}',
        payload: {
          id: 101,
          name: 'Merien',
          status: 'complete',
          missingFields: [],
          pendingChoices: [
            'classEquipmentSelection',
            'backgroundEquipmentSelection',
          ],
          spellcastingSummary: {
            canCastSpells: true,
            ability: 'INT',
            abilityModifier: 3,
            spellSaveDc: 13,
            spellAttackBonus: 5,
            selectedSpellsCount: 0,
            selectedCantripsCount: 0,
          },
        },
      },
    ],
  },
  {
    id: 'list-characters',
    kicker: 'Reference',
    title: 'List Characters',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Valid token',
        value: 'Required to access the Characters API.',
      },
      {
        label: 'Request type',
        value: 'GET',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'GET /api/characters returns a compact list for the authenticated user. If the user has no characters yet, the API returns an empty array.',
    responseFields: [
      {
        name: 'id',
        type: 'number',
        description: 'Unique numeric identifier for the character.',
      },
      {
        name: 'name',
        type: 'string',
        description: 'Character name returned in the authenticated owner list.',
      },
      {
        name: 'status',
        type: 'draft | complete',
        description: 'Current setup state of the character.',
      },
      {
        name: 'level',
        type: 'number',
        description: 'Current character level.',
      },
    ],
    responseExamples: [
      {
        label: 'Empty list',
        status: '200 OK',
        payload: [],
      },
      {
        label: 'Populated list',
        status: '200 OK',
        payload: [
          {
            id: 101,
            name: 'Merien',
            status: 'draft',
            level: 1,
          },
          {
            id: 102,
            name: 'Arin',
            status: 'complete',
            level: 3,
          },
        ],
      },
    ],
  },
  {
    id: 'delete',
    kicker: 'Reference',
    title: 'Delete',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Valid token',
        value: 'Required to remove a specific character.',
      },
      {
        label: 'Request type',
        value: 'DELETE',
      },
      {
        label: 'Path parameter',
        value: 'Pass the character id in the route.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'DELETE /api/characters/{id} removes one specific character owned by the authenticated user.',
    responseFields: [
      {
        name: 'message',
        type: 'string',
        description: 'Short confirmation message returned by the API.',
      },
    ],
    responseExamples: [
      {
        label: 'Request path',
        status: 'DELETE /api/characters/{id}',
        payload: {
          id: 101,
        },
      },
      {
        label: 'Delete response',
        status: '200 OK',
        payload: {
          message: 'Character deleted successfully',
        },
      },
    ],
  },
  {
    id: 'draft',
    kicker: 'Step 1',
    title: 'Draft',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Valid token',
        value: 'Required to create a draft character.',
      },
      {
        label: 'Request type',
        value: 'POST',
      },
      {
        label: 'Minimum body',
        value: 'A draft can start with only the character name.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'POST /api/characters can create a draft character with only the minimum required information. The API then returns the new character with draft status and missing fields that can be completed later.',
    responseFields: [
      {
        name: 'name',
        type: 'string',
        description: 'Required character name used to create the first draft.',
      },
      {
        name: 'status',
        type: 'draft',
        description: 'New incomplete characters begin as draft while key setup choices are still missing.',
      },
      {
        name: 'missingFields',
        type: 'string[]',
        description: 'Shows which important setup fields still need to be completed.',
      },
      {
        name: 'level',
        type: 'number',
        description: 'Defaults to level 1 when not provided.',
      },
    ],
    responseExamples: [
      {
        label: 'Request body',
        status: 'POST /api/characters',
        payload: {
          name: 'Merien',
        },
      },
      {
        label: 'Draft response',
        status: '201 Created',
        payload: {
          id: 101,
          name: 'Merien',
          status: 'draft',
          classId: null,
          speciesId: null,
          backgroundId: null,
          level: 1,
          missingFields: ['classId', 'speciesId', 'backgroundId'],
          abilityScores: null,
          abilityModifiers: null,
        },
      },
    ],
  },
  {
    id: 'detail',
    kicker: 'Step 13',
    title: 'Review',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Public access',
        value: 'No bearer token is required to review a specific character.',
      },
      {
        label: 'Request type',
        value: 'GET',
      },
      {
        label: 'Path parameter',
        value: 'Pass the character id in the route.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'GET /api/characters/{id} is the final review step. It returns the full detail of one specific character by id without requiring a bearer token, and helps the frontend confirm the current creation state.',
    responseFields: [
      {
        name: 'id',
        type: 'number',
        description: 'Unique numeric identifier for the character.',
      },
      {
        name: 'name',
        type: 'string',
        description: 'Character name.',
      },
      {
        name: 'status',
        type: 'draft | complete',
        description: 'Current setup state of the selected character.',
      },
      {
        name: 'level',
        type: 'number',
        description: 'Current character level.',
      },
      {
        name: 'missingFields',
        type: 'string[]',
        description: 'Shows which important setup fields are still missing.',
      },
    ],
    responseExamples: [
      {
        label: 'Request path',
        status: 'GET /api/characters/{id}',
        payload: {
          id: 101,
        },
      },
      {
        label: 'Character review',
        status: '200 OK',
        payload: {
          id: 101,
          name: 'Merien',
          status: 'complete',
          classId: 12,
          speciesId: 3,
          backgroundId: 13,
          level: 1,
          missingFields: [],
          pendingChoices: [],
          abilityScores: {
            final: {
              STR: 8,
              DEX: 14,
              CON: 13,
              INT: 17,
              WIS: 13,
              CHA: 10,
            },
          },
          spellcastingSummary: {
            canCastSpells: true,
            selectedSpellsCount: 3,
            selectedCantripsCount: 2,
          },
        },
      },
    ],
  },
  {
    id: 'add-class',
    kicker: 'Step 2',
    title: 'Class',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Valid token',
        value: 'Required to update the character.',
      },
      {
        label: 'Request type',
        value: 'PATCH',
      },
      {
        label: 'Class ids',
        value: 'Class ids are listed in the Classes API.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'PATCH /api/characters/{id} can be used to assign a class to an existing character. To choose the correct classId, first read the Classes API list.',
    responseFields: [
      {
        name: 'classId',
        type: 'number',
        description: 'Id of the class you want to assign to the character.',
      },
      {
        name: 'classDetails',
        type: 'object | null',
        description: 'Nested class information returned after the class is assigned.',
      },
      {
        name: 'hitPoints',
        type: 'object | null',
        description: 'Can become available once the character has enough information for derived stats.',
      },
      {
        name: 'status',
        type: 'draft | complete',
        description:
          'The character can still remain draft if other important fields are missing.',
      },
    ],
    responseExamples: [
      {
        label: 'Request body',
        status: 'PATCH /api/characters/{id}',
        payload: {
          classId: 12,
        },
      },
      {
        label: 'Updated character',
        status: '200 OK',
        payload: {
          id: 101,
          name: 'Merien',
          status: 'draft',
          classId: 12,
          speciesId: null,
          backgroundId: null,
          level: 1,
          missingFields: ['speciesId', 'backgroundId'],
          classDetails: {
            id: 12,
            name: 'Wizard',
            slug: 'wizard',
          },
          hitPoints: null,
        },
      },
    ],
  },
  {
    id: 'add-specie',
    kicker: 'Step 3',
    title: 'Specie',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Valid token',
        value: 'Required to update the character.',
      },
      {
        label: 'Request type',
        value: 'PATCH',
      },
      {
        label: 'Specie ids',
        value: 'Specie ids are listed in the Species API.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'PATCH /api/characters/{id} can be used to assign a specie to an existing character. To choose the correct speciesId, first read the Species API list.',
    responseFields: [
      {
        name: 'speciesId',
        type: 'number',
        description: 'Id of the specie you want to assign to the character.',
      },
      {
        name: 'speciesDetails',
        type: 'object | null',
        description: 'Nested specie information returned after the specie is assigned.',
      },
      {
        name: 'movement',
        type: 'object | null',
        description: 'Can become available when the selected specie provides speed information.',
      },
      {
        name: 'status',
        type: 'draft | complete',
        description:
          'The character can still remain draft if other important fields are missing.',
      },
    ],
    responseExamples: [
      {
        label: 'Request body',
        status: 'PATCH /api/characters/{id}',
        payload: {
          speciesId: 3,
        },
      },
      {
        label: 'Updated character',
        status: '200 OK',
        payload: {
          id: 101,
          name: 'Merien',
          status: 'draft',
          classId: 12,
          speciesId: 3,
          backgroundId: null,
          level: 1,
          missingFields: ['backgroundId'],
          speciesDetails: {
            id: 3,
            name: 'Elf',
            slug: 'elf',
          },
          movement: {
            baseSpeed: 30,
            unit: 'ft',
            sources: [
              {
                type: 'species',
                name: 'Elf',
                value: 30,
              },
            ],
          },
        },
      },
    ],
  },
  {
    id: 'add-background',
    kicker: 'Step 4',
    title: 'Background',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Valid token',
        value: 'Required to update the character.',
      },
      {
        label: 'Request type',
        value: 'PATCH',
      },
      {
        label: 'Background ids',
        value: 'Background ids are listed in the Backgrounds API.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'PATCH /api/characters/{id} can be used to assign a background to an existing character. To choose the correct backgroundId, first read the Backgrounds API list.',
    responseFields: [
      {
        name: 'backgroundId',
        type: 'number',
        description: 'Id of the background you want to assign to the character.',
      },
      {
        name: 'backgroundDetails',
        type: 'object | null',
        description: 'Nested background information returned after the background is assigned.',
      },
      {
        name: 'abilityScoreRules',
        type: 'object | null',
        description: 'Can become available when the selected background defines ability score choices.',
      },
      {
        name: 'status',
        type: 'draft | complete',
        description:
          'Once backgroundId is filled, status can already become complete even if equipment choices are still pending.',
      },
    ],
    responseExamples: [
      {
        label: 'Request body',
        status: 'PATCH /api/characters/{id}',
        payload: {
          backgroundId: 13,
        },
      },
      {
        label: 'Updated character',
        status: '200 OK',
        payload: {
          id: 101,
          name: 'Merien',
          status: 'complete',
          classId: 12,
          speciesId: 3,
          backgroundId: 13,
          level: 1,
          missingFields: [],
          pendingChoices: [
            'classEquipmentSelection',
            'backgroundEquipmentSelection',
          ],
          backgroundDetails: {
            id: 13,
            name: 'Sage',
            slug: 'sage',
          },
          abilityScoreRules: {
            source: 'background',
            allowedChoices: ['CON', 'INT', 'WIS'],
            bonusRules: {
              mode: 'standard_background',
            },
          },
        },
      },
    ],
  },
  {
    id: 'skills',
    kicker: 'Step 7',
    title: 'Skills',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Valid token',
        value: 'Required to update the character.',
      },
      {
        label: 'Request type',
        value: 'PATCH',
      },
      {
        label: 'How to guide',
        value:
          'Use classDetails.skillProficiencyChoices and backgroundDetails.skillProficiencies to explain which skills are fixed and which still need a choice.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'Skill selection is part of the main character update route. The frontend can use class details and background details to explain how many skills the user must choose and which proficiencies are already granted.',
    responseFields: [
      {
        name: 'skillProficiencies',
        type: 'string[]',
        description:
          'Final list of proficient skills currently assigned to the character.',
      },
      {
        name: 'classDetails.skillProficiencyChoices',
        type: 'object',
        description:
          'Explains how many class skill choices are available and which options can be selected.',
      },
      {
        name: 'backgroundDetails.skillProficiencies',
        type: 'string[]',
        description:
          'Background skills that are already granted before class choices are added.',
      },
      {
        name: 'skills',
        type: 'object[]',
        description:
          'Derived skill modifiers returned in the enriched character detail.',
      },
    ],
    responseExamples: [
      {
        label: 'Request body',
        status: 'PATCH /api/characters/{id}',
        payload: {
          skillProficiencies: ['Arcana', 'Investigation'],
        },
      },
      {
        label: 'Updated character',
        status: '200 OK',
        payload: {
          skillProficiencies: [
            'Arcana',
            'History',
            'Insight',
            'Investigation',
          ],
          classDetails: {
            skillProficiencyChoices: {
              count: 2,
              options: [
                'Arcana',
                'History',
                'Insight',
                'Investigation',
                'Medicine',
                'Religion',
              ],
            },
          },
          backgroundDetails: {
            skillProficiencies: ['History', 'Insight'],
          },
        },
      },
    ],
  },
  {
    id: 'class-equipment-choice',
    kicker: 'Step 8',
    title: 'Class equipment',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Valid token',
        value: 'Required to resolve class equipment choices.',
      },
      {
        label: 'Request type',
        value: 'POST',
      },
      {
        label: 'When to show',
        value:
          'Show this step when pendingChoices includes classEquipmentSelection.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'Use POST /api/characters/{id}/equipment/class-choice to resolve the starting equipment package granted by the selected class.',
    responseFields: [
      {
        name: 'appliedChoice',
        type: 'object',
        description:
          'The package option chosen for the class equipment step.',
      },
      {
        name: 'characterId',
        type: 'number',
        description: 'Identifier of the character being updated.',
      },
      {
        name: 'addedEquipment',
        type: 'object[]',
        description: 'Equipment items added to the character from the selected package.',
      },
      {
        name: 'pendingChoices',
        type: 'string[]',
        description:
          'Updated list of remaining pending choices after the class package is resolved.',
      },
    ],
    responseExamples: [
      {
        label: 'Request body',
        status: 'POST /api/characters/{id}/equipment/class-choice',
        payload: {
          optionIndex: 0,
        },
      },
      {
        label: 'Updated pending choices',
        status: '200 OK',
        payload: {
          characterId: 101,
          appliedChoice: {
            source: 'class',
            label: 'Quarterstaff',
            optionIndex: 0,
          },
          addedEquipment: [
            {
              id: 42,
              name: 'Quarterstaff',
              quantity: 1,
              isEquipped: true,
            },
          ],
          skippedItems: [],
          pendingChoices: ['backgroundEquipmentSelection'],
          equipment: [
            {
              id: 42,
              name: 'Quarterstaff',
              category: 'Weapon',
              type: 'Simple Melee Weapon',
              quantity: 1,
              isEquipped: true,
            },
          ],
        },
      },
    ],
  },
  {
    id: 'background-equipment-choice',
    kicker: 'Step 9',
    title: 'Background equipment',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Valid token',
        value: 'Required to resolve background equipment choices.',
      },
      {
        label: 'Request type',
        value: 'POST',
      },
      {
        label: 'When to show',
        value:
          'Show this step when pendingChoices includes backgroundEquipmentSelection.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'Use POST /api/characters/{id}/equipment/background-choice to resolve the starting equipment package granted by the selected background.',
    responseFields: [
      {
        name: 'appliedChoice',
        type: 'object',
        description:
          'The package option chosen for the background equipment step.',
      },
      {
        name: 'characterId',
        type: 'number',
        description: 'Identifier of the character being updated.',
      },
      {
        name: 'addedEquipment',
        type: 'object[]',
        description: 'Equipment items added to the character from the selected package.',
      },
      {
        name: 'pendingChoices',
        type: 'string[]',
        description:
          'Updated list of remaining pending choices after the background package is resolved.',
      },
    ],
    responseExamples: [
      {
        label: 'Request body',
        status: 'POST /api/characters/{id}/equipment/background-choice',
        payload: {
          optionIndex: 0,
        },
      },
      {
        label: 'Updated pending choices',
        status: '200 OK',
        payload: {
          characterId: 101,
          appliedChoice: {
            source: 'background',
            label: 'Book, bottle of ink, ink pen, 10 sheets of parchment, little bag of sand, and small knife',
            optionIndex: 0,
          },
          addedEquipment: [
            {
              id: 201,
              name: 'Book',
              quantity: 1,
              isEquipped: false,
            },
          ],
          skippedItems: [],
          pendingChoices: [],
          equipment: [
            {
              id: 42,
              name: 'Quarterstaff',
              category: 'Weapon',
              type: 'Simple Melee Weapon',
              quantity: 1,
              isEquipped: true,
            },
            {
              id: 201,
              name: 'Book',
              category: 'Adventuring Gear',
              type: 'Generic',
              quantity: 1,
              isEquipped: false,
            },
          ],
        },
      },
    ],
  },
  {
    id: 'equipment',
    kicker: 'Reference',
    title: 'Equipment',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Valid token',
        value: 'Required to access and update character equipment.',
      },
      {
        label: 'Request types',
        value: 'GET and POST',
      },
      {
        label: 'How to guide',
        value:
          'Use pendingChoices to know when classEquipmentSelection or backgroundEquipmentSelection still need user input.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'Equipment flow starts when the character still has pending equipment choices. First read the current equipment list, then add the selected items with POST /api/characters/{id}/equipment.',
    responseFields: [
      {
        name: 'pendingChoices',
        type: 'string[]',
        description:
          'Shows whether class or background equipment still needs to be selected.',
      },
      {
        name: 'characterId',
        type: 'number',
        description: 'Identifier of the character whose equipment is being managed.',
      },
      {
        name: 'equipment',
        type: 'object[]',
        description: 'Current equipment list already attached to the character.',
      },
      {
        name: 'equipmentId',
        type: 'number',
        description: 'Id of the equipment item that will be added to the character.',
      },
    ],
    responseExamples: [
      {
        label: 'Current equipment',
        status: 'GET /api/characters/{id}/equipment',
        payload: {
          characterId: 101,
          equipment: [],
        },
      },
      {
        label: 'Request body',
        status: 'POST /api/characters/{id}/equipment',
        payload: {
          equipmentId: 42,
          quantity: 1,
          isEquipped: true,
        },
      },
      {
        label: 'Updated equipment',
        status: '200 OK',
        payload: {
          characterId: 101,
          equipment: [
            {
              id: 42,
              name: 'Quarterstaff',
              category: 'Weapon',
              type: 'Simple Melee Weapon',
              quantity: 1,
              isEquipped: true,
            },
          ],
        },
      },
    ],
  },
  {
    id: 'currency',
    kicker: 'Reference',
    title: 'Currency',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Valid token',
        value: 'Required to update the character.',
      },
      {
        label: 'Request type',
        value: 'PATCH',
      },
      {
        label: 'Currency fields',
        value: 'Use cp, sp, ep, gp and pp inside the currency object.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'PATCH /api/characters/{id} can be used to define or update the character currency values.',
    responseFields: [
      {
        name: 'currency',
        type: 'object',
        description: 'Currency block stored in the character response.',
      },
      {
        name: 'cp',
        type: 'number',
        description: 'Copper pieces.',
      },
      {
        name: 'gp',
        type: 'number',
        description: 'Gold pieces.',
      },
      {
        name: 'pp',
        type: 'number',
        description: 'Platinum pieces.',
      },
    ],
    responseExamples: [
      {
        label: 'Request body',
        status: 'PATCH /api/characters/{id}',
        payload: {
          currency: {
            cp: 0,
            sp: 12,
            ep: 0,
            gp: 8,
            pp: 0,
          },
        },
      },
      {
        label: 'Updated character',
        status: '200 OK',
        payload: {
          id: 101,
          name: 'Merien',
          status: 'complete',
          level: 1,
          currency: {
            cp: 0,
            sp: 12,
            ep: 0,
            gp: 8,
            pp: 0,
          },
        },
      },
    ],
  },
  {
    id: 'spell',
    kicker: 'Steps 10 to 12',
    title: 'Spell',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Valid token',
        value: 'Required to access character spell data.',
      },
      {
        label: 'Request types',
        value: 'GET and PUT',
      },
      {
        label: 'Related routes',
        value: 'Use spell-options, spell-selection and spells for the full spell flow.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'Spell flow is split into multiple routes. First read the available spell choices with GET /api/characters/{id}/spell-options, then read the current selection with GET /api/characters/{id}/spell-selection, and finally update the selection with PUT /api/characters/{id}/spells.',
    responseFields: [
      {
        name: 'spellOptions',
        type: 'object[]',
        description: 'Available spells the character can choose from.',
      },
      {
        name: 'spellSelection',
        type: 'object',
        description: 'Current selected spells for the character.',
      },
      {
        name: 'selectedSpells',
        type: 'object[]',
        description: 'Enriched spell entries returned after selection is updated.',
      },
      {
        name: 'spellSlots',
        type: 'object[]',
        description: 'Spell slot summary returned for supported spellcasters.',
      },
    ],
    responseExamples: [
      {
        label: 'Spell options',
        status: 'GET /api/characters/{id}/spell-options',
        payload: {
          cantrips: [
            { id: 1, name: 'Acid Splash' },
            { id: 2, name: 'Fire Bolt' },
          ],
          leveledSpells: [
            { id: 10, name: 'Magic Missile', level: 1 },
            { id: 11, name: 'Shield', level: 1 },
          ],
        },
      },
      {
        label: 'Spell selection',
        status: 'GET /api/characters/{id}/spell-selection',
        payload: {
          selectedCantrips: [1],
          selectedSpells: [10],
        },
      },
      {
        label: 'Updated spell selection',
        status: 'PUT /api/characters/{id}/spells',
        payload: {
          selectedSpells: [
            {
              id: 1,
              name: 'Acid Splash',
              level: 0,
            },
            {
              id: 10,
              name: 'Magic Missile',
              level: 1,
            },
          ],
          spellSlots: [
            {
              level: 1,
              max: 2,
              used: 0,
              available: 2,
            },
          ],
        },
      },
    ],
  },
  {
    id: 'attributes',
    kicker: 'Steps 5 and 6',
    title: 'Attributes',
    detailsTitle: 'Requiriments',
    details: [
      {
        label: 'Valid token',
        value: 'Required to access character attribute data.',
      },
      {
        label: 'Request types',
        value: 'GET, PUT, and PATCH',
      },
      {
        label: 'Path parameter',
        value: 'Use the character id as {id} in both attribute routes.',
      },
      {
        label: 'Related routes',
        value: 'Use ability-score-options and ability-scores for the full attribute flow.',
      },
      {
        label: 'Base score range',
        value: 'For levels 1 to 3, each base ability score must be between 8 and 15.',
      },
      {
        label: 'Bonus rule',
        value: 'Bonuses apply +1 to each background-allowed ability.',
      },
    ],
    responseHeading: 'Expected return',
    responseSubheading: 'Response contract',
    responseDescription:
      'Attribute flow is split into helper routes. First read the available ability score rules with GET /api/characters/{id}/ability-score-options, then update the chosen values with PUT /api/characters/{id}/ability-scores. POST /api/characters and PATCH /api/characters/{id} apply the same validation whenever abilityScores is provided.',
    responseFields: [
      {
        name: 'allowedChoices',
        type: 'string[]',
        description: 'Ability score choices allowed by the current character setup.',
      },
      {
        name: 'bonusRules',
        type: 'object | null',
        description: 'Rules that describe how bonus points can be assigned.',
      },
      {
        name: 'abilityScores',
        type: 'object | null',
        description: 'Resolved ability score block returned after the update. The request must include complete base and bonuses blocks for STR, DEX, CON, INT, WIS, and CHA.',
      },
      {
        name: 'abilityModifiers',
        type: 'object | null',
        description: 'Derived modifiers calculated from the final ability scores.',
      },
      {
        name: 'error',
        type: 'string',
        description: 'Validation failures include the invalid field and received value when possible.',
      },
    ],
    responseExamples: [
      {
        label: 'Ability score options',
        status: 'GET /api/characters/{id}/ability-score-options',
        payload: {
          source: 'background',
          allowedChoices: ['CON', 'INT', 'WIS'],
          bonusRules: {
            mode: 'standard_background',
          },
        },
      },
      {
        label: 'Request body',
        status: 'PUT /api/characters/{id}/ability-scores',
        payload: {
          base: {
            STR: 8,
            DEX: 14,
            CON: 13,
            INT: 15,
            WIS: 12,
            CHA: 10,
          },
          bonuses: {
            STR: 0,
            DEX: 0,
            CON: 1,
            INT: 1,
            WIS: 1,
            CHA: 0,
          },
        },
      },
      {
        label: 'Updated attributes',
        status: '200 OK',
        payload: {
          abilityScores: {
            base: {
              STR: 8,
              DEX: 14,
              CON: 13,
              INT: 15,
              WIS: 12,
              CHA: 10,
            },
            bonuses: {
              STR: 0,
              DEX: 0,
              CON: 1,
              INT: 1,
              WIS: 1,
              CHA: 0,
            },
            final: {
              STR: 8,
              DEX: 14,
              CON: 14,
              INT: 16,
              WIS: 13,
              CHA: 10,
            },
          },
          abilityModifiers: {
            STR: -1,
            DEX: 2,
            CON: 2,
            INT: 3,
            WIS: 1,
            CHA: 0,
          },
        },
      },
      {
        label: 'Invalid base score',
        status: '400 Bad Request',
        payload: {
          error:
            'Invalid character ability scores payload: base.DEX must be between 8 and 15 for character levels 1 to 3; received 16',
        },
      },
    ],
  },
];

function getCharactersTicketAnchor(ticketId: CharacterTicketId) {
  return `characters-${ticketId}`;
}

function getRequestMethodBadgeClass(value: string) {
  if (value === 'GET') {
    return 'guide-method-badge guide-method-badge--get';
  }

  if (value === 'POST') {
    return 'guide-method-badge guide-method-badge--post';
  }

  if (value === 'PUT') {
    return 'guide-method-badge guide-method-badge--put';
  }

  if (value === 'PATCH') {
    return 'guide-method-badge guide-method-badge--patch';
  }

  if (value === 'DELETE') {
    return 'guide-method-badge guide-method-badge--delete';
  }

  if (value === 'HEAD') {
    return 'guide-method-badge guide-method-badge--head';
  }

  if (value === 'OPTIONS') {
    return 'guide-method-badge guide-method-badge--options';
  }

  return undefined;
}

function renderDetailValue(value: string) {
  const methodParts = value
    .split(/\s*(?:,|and)\s*/g)
    .map((part) => part.trim())
    .filter(Boolean);

  const everyPartIsMethod =
    methodParts.length > 0 &&
    methodParts.every((part) => Boolean(getRequestMethodBadgeClass(part)));

  if (everyPartIsMethod) {
    return (
      <span className="guide-method-badge-row">
        {methodParts.map((part) => (
          <code className={getRequestMethodBadgeClass(part)} key={part}>
            {part}
          </code>
        ))}
      </span>
    );
  }

  const methodBadgeClass = getRequestMethodBadgeClass(value);

  if (methodBadgeClass) {
    return <code className={methodBadgeClass}>{value}</code>;
  }

  return value;
}

function renderMethodBadges(value: string, keyPrefix: string) {
  return (
    <span className="guide-method-badge-row">
      {value.split(/\s*(?:,|and)\s*/g).map((part) => {
        const trimmedPart = part.trim();

        return (
          <code
            className={getRequestMethodBadgeClass(trimmedPart) ?? ''}
            key={`${keyPrefix}-${trimmedPart}`}
          >
            {trimmedPart}
          </code>
        );
      })}
    </span>
  );
}

function renderEndpointPath(value: string) {
  const parts = value.split(/(\{[^}]+\})/g).filter(Boolean);

  return (
    <code className="characters-flow-table__path">
      {parts.map((part, index) =>
        /^\{[^}]+\}$/.test(part) ? (
          <strong className="characters-flow-table__path-param" key={`${part}-${index}`}>
            {part}
          </strong>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </code>
  );
}

export function CharactersGuideChapter({
  isOpen,
  onClose,
  onToggle,
}: CharactersGuideChapterProps) {
  const [selectedTicketId, setSelectedTicketId] =
    useState<CharacterTicketId>('draft');

  const flowTickets = characterFlowTicketOrder
    .map((ticketId) => characterTickets.find((ticket) => ticket.id === ticketId))
    .filter((ticket): ticket is CharacterTicket => Boolean(ticket));
  const referenceTickets = characterReferenceTicketOrder
    .map((ticketId) => characterTickets.find((ticket) => ticket.id === ticketId))
    .filter((ticket): ticket is CharacterTicket => Boolean(ticket));

  const selectedTicket =
    characterTickets.find((ticket) => ticket.id === selectedTicketId) ??
    characterTickets[0];

  function handleSelectTicket(
    event: MouseEvent<HTMLAnchorElement>,
    ticketId: CharacterTicketId,
  ) {
    event.preventDefault();
    setSelectedTicketId(ticketId);
    window.history.replaceState(null, '', `#${getCharactersTicketAnchor(ticketId)}`);
  }

  return (
    <section
      aria-labelledby="characters-heading"
      className="section-block guide-accordion"
      id="characters"
    >
      <h2 className="guide-accordion__heading" id="characters-heading">
        <button
          aria-controls="characters-panel"
          aria-expanded={isOpen}
          className="guide-accordion__toggle"
          onClick={onToggle}
          type="button"
        >
          <span>
            <span className="kicker">Ninth chapter</span>
            <span className="guide-accordion__title">Characters</span>
            <strong aria-hidden="true">{isOpen ? 'Close' : 'Open'}</strong>
          </span>
        </button>
      </h2>

      <div
        aria-hidden={!isOpen}
        className={`guide-accordion__content${
          isOpen ? ' guide-accordion__content--open' : ''
        }`}
        id="characters-panel"
        inert={!isOpen}
        role="region"
      >
        <div className="guide-accordion__scroll">
          <p className="guide-accordion__description">
            The Characters API is a more complex workflow. A character can be
            enriched through multiple calls until it reaches its final state.
            Creating a character is a longer process that can be done all at
            once in a single <code>POST</code> request or gradually by choosing
            character details step by step.
          </p>

          <section className="guide-expected-return">
            <div className="section-heading">
              <h3>Create flow</h3>
              <h4>Recommended order</h4>
              <p>
                This table shows the happy path before the chapter details
                below. It helps the user understand which request usually comes
                next during character creation.
              </p>
            </div>

            <div className="guide-glossary__table-wrap">
              <table className="guide-glossary__table characters-flow-table">
                <thead>
                  <tr>
                    <th scope="col">Step</th>
                    <th scope="col">Action</th>
                    <th scope="col">What happens</th>
                    <th scope="col">Request type</th>
                    <th scope="col">Path</th>
                  </tr>
                </thead>
                <tbody>
                  {characterCreationSteps.map((item) => (
                    <tr key={item.step}>
                      <td>{item.step}</td>
                      <td>{item.title}</td>
                      <td>{item.note}</td>
                      <td>{renderMethodBadges(item.method, item.step)}</td>
                      <td>{renderEndpointPath(item.endpoint)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <nav
            aria-label="Characters index"
            className="guide-card-index guide-card-index--inside-panel"
            id={charactersIndexId}
          >
            <p>Character flow</p>
            <div>
              {flowTickets.map((ticket) => (
                <a
                  aria-current={ticket.id === selectedTicketId ? 'true' : undefined}
                  href={`#${getCharactersTicketAnchor(ticket.id)}`}
                  key={ticket.id}
                  onClick={(event) => handleSelectTicket(event, ticket.id)}
                >
                  {ticket.id === 'list-characters' ? 'List' : ticket.title}
                </a>
              ))}
            </div>
            <p>Extra reference</p>
            <div>
              {referenceTickets.map((ticket) => (
                <a
                  aria-current={ticket.id === selectedTicketId ? 'true' : undefined}
                  href={`#${getCharactersTicketAnchor(ticket.id)}`}
                  key={ticket.id}
                  onClick={(event) => handleSelectTicket(event, ticket.id)}
                >
                  {ticket.id === 'list-characters' ? 'List' : ticket.title}
                </a>
              ))}
            </div>
          </nav>

          <div className="species-guide-grid">
            <article
              className="species-guide-card"
              id={getCharactersTicketAnchor(selectedTicket.id)}
            >
              <div className="species-guide-card__overview species-guide-card__overview--text-only">
                <div className="species-guide-card__header">
                  <p className="kicker">{selectedTicket.kicker}</p>
                  <h3>{selectedTicket.title}</h3>
                </div>
              </div>

              <div className="background-guide-card__details">
                <p>{selectedTicket.detailsTitle}</p>
                <ul>
                  {selectedTicket.details.map((detail) => (
                    <li key={detail.label}>
                      <strong>{detail.label}</strong>
                      <span>{renderDetailValue(detail.value)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>

          <section className="guide-expected-return">
            <div className="section-heading">
              <h3>{selectedTicket.responseHeading}</h3>
              <h4>{selectedTicket.responseSubheading}</h4>
              <p>{selectedTicket.responseDescription}</p>
            </div>

            <div className="response-variant">
              <div className="response-variant__heading">
                <span>Contract fields</span>
                <code>{selectedTicket.id === 'draft' ? 'POST /api/characters' : '200 OK'}</code>
              </div>
              <div className="response-field-list response-field-list--compact">
                {selectedTicket.responseFields.map((field) => (
                  <article className="response-field-card" key={field.name}>
                    <span>{field.name}</span>
                    <p>{field.description}</p>
                    <strong>{field.type}</strong>
                  </article>
                ))}
              </div>
            </div>

            {selectedTicket.responseExamples.map((example) => (
              <div className="response-variant" key={example.label}>
                <div className="response-variant__heading">
                  <span>Example response</span>
                  <code>{example.label}</code>
                </div>
                <div className="response-example">
                  <div className="response-example__header">
                    <span>Example JSON</span>
                    <code>{example.status}</code>
                  </div>
                  <pre>
                    <code>{JSON.stringify(example.payload, null, 2)}</code>
                  </pre>
                </div>
              </div>
            ))}
          </section>

          <button className="guide-accordion__close" onClick={onClose} type="button">
            Close Characters chapter
          </button>
        </div>
      </div>
    </section>
  );
}
