import { GuidesAccordion } from '@/app/components/guides-accordion';
import { getSql } from '@/app/lib/db';
import type { Attribute } from '@/app/types/attribute';

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

export default async function GuidesPage() {
  const attributes = await getAttributes();

  return (
    <main className="page-frame">
      <GuidesAccordion attributes={attributes} />
    </main>
  );
}
