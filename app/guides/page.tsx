import { GuidesAccordion } from '@/app/components/guides-accordion';
import { getSql } from '@/app/lib/db';
import { formatSpeciesDetail } from '@/app/lib/species';
import type { Attribute } from '@/app/types/attribute';
import type { BackgroundDetail } from '@/app/types/background';
import type { ClassDetail } from '@/app/types/class';
import type { EquipmentDetail } from '@/app/types/equipment';
import type { SkillDetail } from '@/app/types/skill';
import type { SpellDetail, SpellGuideListItem } from '@/app/types/spell';
import type { SpeciesDetail } from '@/app/types/species';

export const dynamic = 'force-dynamic';

async function getAttributes(): Promise<Attribute[]> {
  const sql = getSql();
  const attributes = await sql`SELECT * FROM attributes ORDER BY id`;
  const skills = await sql`SELECT name, attribute FROM skills`;

  return attributes.map((attribute) => ({
    id: attribute.id,
    name: attribute.name,
    shortname: attribute.shortname,
    description: attribute.description,
    skills: skills
      .filter((skill) => skill.attribute === attribute.shortname)
      .map((skill) => skill.name),
  })) as Attribute[];
}

async function getSkills(): Promise<SkillDetail[]> {
  const sql = getSql();
  const skillRows = await sql`
    SELECT id, name, attribute, description, exampleofuse
    FROM skills
    ORDER BY id
  `;
  const classRows = await sql`
    SELECT skillId, className
    FROM skillClasses
  `;

  return skillRows
    .map((skill) => ({
      id: skill.id,
      name: skill.name,
      attribute: skill.attribute,
      description: skill.description,
      exampleofuse: skill.exampleofuse,
      commonclasses: classRows
        .filter((classRow) => classRow.skillid === skill.id)
        .map((classRow) => classRow.classname),
    }))
    .sort((firstSkill, secondSkill) =>
      firstSkill.name.localeCompare(secondSkill.name),
    ) as SkillDetail[];
}

function getStringProperty(
  record: Record<string, unknown>,
  propertyNames: string[],
) {
  const propertyValue = propertyNames
    .map((propertyName) => record[propertyName])
    .find((value) => typeof value === 'string');

  return typeof propertyValue === 'string' ? propertyValue : null;
}

function normalizeSubclassName(subclass: unknown) {
  if (typeof subclass === 'string') {
    return subclass;
  }

  if (!subclass || typeof subclass !== 'object') {
    return null;
  }

  return getStringProperty(subclass as Record<string, unknown>, [
    'name',
    'subclassName',
    'subclass',
    'title',
  ]);
}

async function getClasses(): Promise<ClassDetail[]> {
  const sql = getSql();
  const classes = await sql`
    SELECT
      id,
      name,
      slug,
      description,
      role,
      hitdie,
      primaryattributes,
      recommendedskills,
      savingthrows,
      spellcasting,
      subclasses,
      levelprogression
    FROM classes
    ORDER BY id
  `;

  return classes.map((classItem) => ({
    ...classItem,
    subclasses: Array.isArray(classItem.subclasses)
      ? classItem.subclasses
          .map((subclass) => normalizeSubclassName(subclass))
          .filter((subclassName): subclassName is string =>
            Boolean(subclassName),
          )
      : [],
  })) as ClassDetail[];
}

async function getSpecies(): Promise<SpeciesDetail[]> {
  const sql = getSql();
  const speciesRows = await sql`
    SELECT
      id,
      name,
      slug,
      description,
      creaturetype,
      size,
      speed,
      specialtraits,
      subspecies
    FROM species
    ORDER BY name
  `;

  return speciesRows.map((speciesItem) =>
    formatSpeciesDetail(speciesItem),
  ) as SpeciesDetail[];
}

async function getBackgrounds(): Promise<BackgroundDetail[]> {
  const sql = getSql();
  const backgroundRows = await sql`
    SELECT
      id,
      name,
      slug,
      description,
      abilityscores,
      feat,
      skillproficiencies,
      toolproficiency,
      equipmentoptions
    FROM backgrounds
    ORDER BY name
  `;

  return backgroundRows.map((background) => ({
    id: background.id,
    name: background.name,
    slug: background.slug,
    description: background.description,
    abilityScores: background.abilityscores,
    feat: background.feat,
    skillProficiencies: background.skillproficiencies,
    toolProficiency: background.toolproficiency,
    equipmentOptions: background.equipmentoptions,
  })) as BackgroundDetail[];
}

async function getEquipment(): Promise<EquipmentDetail[]> {
  const sql = getSql();
  const equipmentRows = await sql`
    SELECT
      id,
      name,
      slug,
      category,
      type,
      description,
      cost,
      weight,
      ismagical,
      modifiers,
      effects,
      details
    FROM equipment
    ORDER BY name
  `;

  return equipmentRows.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    category: item.category,
    type: item.type,
    description: item.description,
    cost: item.cost,
    weight: item.weight,
    isMagical: Boolean(item.ismagical),
    modifiers: Array.isArray(item.modifiers) ? item.modifiers : [],
    effects: Array.isArray(item.effects) ? item.effects : [],
    details:
      item.details && typeof item.details === 'object'
        ? item.details
        : { kind: 'generic' },
  })) as EquipmentDetail[];
}

async function getSpells(): Promise<SpellGuideListItem[]> {
  const sql = getSql();
  const spellRows = await sql`
    SELECT
      id,
      name,
      level,
      levellabel,
      school,
      castingtime,
      range,
      verbal,
      somatic,
      material,
      duration,
      description
    FROM spells
    ORDER BY level, name
  `;
  const classRows = await sql`
    SELECT spellclasses.spellid, classes.name AS classname
    FROM spellclasses
    INNER JOIN classes ON classes.id = spellclasses.classid
    ORDER BY classes.name
  `;

  return spellRows.map((spell) => ({
    id: spell.id,
    name: spell.name,
    level: Number(spell.level),
    levelLabel: spell.levellabel,
    school: spell.school,
    castingTime: spell.castingtime,
    range: spell.range,
    duration: spell.duration,
    description: spell.description,
    componentsSummary: [
      spell.verbal ? 'V' : null,
      spell.somatic ? 'S' : null,
      spell.material ? 'M' : null,
    ]
      .filter(Boolean)
      .join(', '),
    components: {
      verbal: Boolean(spell.verbal),
      somatic: Boolean(spell.somatic),
      material: Boolean(spell.material),
    },
    classes: classRows
      .filter((classRow) => classRow.spellid === spell.id)
      .map((classRow) => classRow.classname),
  })) as SpellGuideListItem[];
}

async function getSpellDetailExample(): Promise<SpellDetail | null> {
  const sql = getSql();
  const spellRows = await sql`
    SELECT
      id,
      name,
      slug,
      source,
      school,
      level,
      levellabel,
      castingtime,
      range,
      verbal,
      somatic,
      material,
      materialdescription,
      duration,
      description
    FROM spells
    ORDER BY level, name
    LIMIT 1
  `;

  const spell = spellRows[0];

  if (!spell) {
    return null;
  }

  const classRows = await sql`
    SELECT classes.name
    FROM spellclasses
    INNER JOIN classes ON classes.id = spellclasses.classid
    WHERE spellclasses.spellid = ${spell.id}
    ORDER BY classes.id
  `;

  const scalingRows = await sql`
    SELECT characterlevel AS level, description
    FROM spellscaling
    WHERE spellid = ${spell.id}
    ORDER BY characterlevel
  `;

  return {
    id: spell.id,
    name: spell.name,
    slug: spell.slug,
    source: spell.source,
    school: spell.school,
    level: Number(spell.level),
    levelLabel: spell.levellabel,
    castingTime: spell.castingtime,
    range: spell.range,
    components: {
      verbal: Boolean(spell.verbal),
      somatic: Boolean(spell.somatic),
      material: Boolean(spell.material),
      materialDescription: spell.materialdescription,
    },
    duration: spell.duration,
    description: spell.description,
    classes: classRows.map((row) => row.name),
    scaling:
      scalingRows.length > 0
        ? {
            entries: scalingRows.map((row) => ({
              level: Number(row.level),
              description: row.description,
            })),
          }
        : null,
  } as SpellDetail;
}

export default async function GuidesPage() {
  const [
    attributes,
    skills,
    classes,
    species,
    backgrounds,
    equipment,
    spells,
    spellDetailExample,
  ] = await Promise.all([
      getAttributes(),
      getSkills(),
      getClasses(),
      getSpecies(),
      getBackgrounds(),
      getEquipment(),
      getSpells(),
      getSpellDetailExample(),
    ]);

  return (
    <main className="page-frame">
      <GuidesAccordion
        attributes={attributes}
        backgrounds={backgrounds}
        classes={classes}
        equipment={equipment}
        skills={skills}
        spellDetailExample={spellDetailExample}
        spells={spells}
        species={species}
      />
    </main>
  );
}
