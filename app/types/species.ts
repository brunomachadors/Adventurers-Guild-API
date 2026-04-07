export interface SpeciesListItem {
  id: number;
  name: string;
}

export interface SpeciesTrait {
  name: string;
  description: string;
}

export interface SpeciesSubspecies {
  name: string;
  slug: string;
  description: string;
  specialTraits: SpeciesTrait[];
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
  subspecies: SpeciesSubspecies[];
}
