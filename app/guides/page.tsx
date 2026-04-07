import { GuidesAccordion } from '@/app/components/guides-accordion';
import { getSql } from '@/app/lib/db';
import type { Attribute } from '@/app/types/attribute';
import type { ClassDetail } from '@/app/types/class';
import type { SkillDetail } from '@/app/types/skill';

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

  return classes as ClassDetail[];
}

export default async function GuidesPage() {
  const [attributes, skills, classes] = await Promise.all([
    getAttributes(),
    getSkills(),
    getClasses(),
  ]);

  return (
    <main className="page-frame">
      <GuidesAccordion
        attributes={attributes}
        classes={classes}
        skills={skills}
      />
    </main>
  );
}
