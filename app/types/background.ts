export interface BackgroundListItem {
  id: number;
  name: string;
}

export interface BackgroundDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  abilityScores: string[];
  feat: string;
  skillProficiencies: string[];
  toolProficiency: string | null;
  equipmentOptions: string[];
}
