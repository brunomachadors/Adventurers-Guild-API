export interface SpeciesListItem {
  id: number;
  name: string;
}

export interface SpeciesTrait {
  name: string;
  description: string;
}

export interface SpeciesDetail {
  id: number;
  name: string;
  slug: string;
  description: string;
  creatureType: string;
  size: string;
  speed: number;
  specialTraits: SpeciesTrait[];
}
