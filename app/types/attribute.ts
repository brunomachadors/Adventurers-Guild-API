export interface Attribute {
  id: number;
  name: string;
  shortName: 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
  description: string;
}