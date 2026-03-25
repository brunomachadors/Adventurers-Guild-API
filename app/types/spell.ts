export interface SpellListItem {
  id: number;
  name: string;
  level: number;
  levelLabel: string;
}

export interface SpellComponents {
  verbal: boolean;
  somatic: boolean;
  material: boolean;
  materialDescription: string | null;
}

export interface SpellScalingEntry {
  level: number;
  description: string;
}

export interface SpellScaling {
  entries: SpellScalingEntry[];
}

export interface SpellDetail {
  id: number;
  name: string;
  slug: string;
  source: string;
  school: string;
  level: number;
  levelLabel: string;
  castingTime: string;
  range: string;
  components: SpellComponents;
  duration: string;
  description: string;
  classes: string[];
  scaling: SpellScaling | null;
}
