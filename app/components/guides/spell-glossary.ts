export const spellGlossaryEntries = [
  {
    term: 'Spell level',
    meaning:
      'The power band of the spell. Level 0 spells are cantrips, while Levels 1 through 9 represent increasingly stronger spell slots and effects.',
  },
  {
    term: 'School',
    meaning:
      'The magical discipline the spell belongs to, such as Evocation, Illusion, or Necromancy. Schools help organize spells by their role and flavor.',
  },
  {
    term: 'Casting time',
    meaning:
      'How long it takes to cast the spell. Common values include Action, Bonus Action, Reaction, and longer ritual or minute-based timings.',
  },
  {
    term: 'Range',
    meaning:
      'How far the spell can reach, or whether it targets yourself, a touched creature, or a point at a distance.',
  },
  {
    term: 'Components',
    meaning:
      'The verbal, somatic, and material requirements needed to cast the spell. These are often abbreviated as V, S, and M in rules text.',
  },
  {
    term: 'Concentration',
    meaning:
      'A concentration spell stays active only while the caster maintains focus. Taking damage or casting another concentration spell can end it early.',
  },
  {
    term: 'Duration',
    meaning:
      'How long the spell remains active after being cast, from instantaneous effects to rounds, minutes, hours, or longer ongoing magic.',
  },
  {
    term: 'Classes',
    meaning:
      'The classes that normally have access to the spell in the Adventurers Guild API spell list.',
  },
] as const;
