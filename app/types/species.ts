import { SkillName } from './skill';

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

export interface SpeciesSkillProficiencyChoices {
  choose: number;
  options: SkillName[];
}

export interface SpeciesChoiceOption {
  name: string;
  slug: string;
  description: string;
  benefit?: string;
  benefits?: string[];
  rulesText?: string;
}

export interface SpeciesChoice {
  key: string;
  label: string;
  description: string;
  choose: 1;
  options: SpeciesChoiceOption[];
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
  grantedSkillProficiencies: SkillName[];
  speciesSkillProficiencyChoices: SpeciesSkillProficiencyChoices | null;
  grantedToolProficiencies: string[];
  grantedLanguageProficiencies: string[];
  speciesChoices: SpeciesChoice[];
}
