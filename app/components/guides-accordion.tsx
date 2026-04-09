'use client';

import Image from 'next/image';
import { useState, type MouseEvent } from 'react';

import { AuthGuideChapter } from '@/app/components/guides/auth-guide-chapter';
import { BackgroundsGuideChapter } from '@/app/components/guides/backgrounds-guide-chapter';
import { EquipmentGuideChapter } from '@/app/components/guides/equipment-guide-chapter';
import { SpellsGuideChapter } from '@/app/components/guides/spells-guide-chapter';
import {
  getAttributeAnchor,
  getBackgroundAnchor,
  getClassAnchor,
  getGuideAnchorSlug,
  getSkillAnchor,
  getSpeciesAnchor,
} from '@/app/components/guides/background-guide-utils';
import { apiResources } from '@/app/data/api-resources';
import type { Attribute } from '@/app/types/attribute';
import type { BackgroundDetail } from '@/app/types/background';
import type { ClassDetail } from '@/app/types/class';
import type { EquipmentDetail } from '@/app/types/equipment';
import type { SkillDetail } from '@/app/types/skill';
import type { SpellDetail, SpellGuideListItem } from '@/app/types/spell';
import type { SpeciesDetail } from '@/app/types/species';
import charismaIcon from '@/public/images/attributes/charisma.png';
import constitutionIcon from '@/public/images/attributes/constitution.png';
import dexterityIcon from '@/public/images/attributes/dexterity.png';
import intelligenceIcon from '@/public/images/attributes/intelligence.png';
import strengthIcon from '@/public/images/attributes/strength.png';
import wisdomIcon from '@/public/images/attributes/wisdom.png';
import acrobaticsIcon from '@/public/images/skills/acrobatics.png';
import animalHandlingIcon from '@/public/images/skills/animal-handling.png';
import arcanaIcon from '@/public/images/skills/arcana.png';
import athleticsIcon from '@/public/images/skills/athletics.png';
import deceptionIcon from '@/public/images/skills/deception.png';
import historyIcon from '@/public/images/skills/history.png';
import insightIcon from '@/public/images/skills/insight.png';
import intimidationIcon from '@/public/images/skills/intimidation.png';
import investigationIcon from '@/public/images/skills/investigation.png';
import medicineIcon from '@/public/images/skills/medicine.png';
import natureIcon from '@/public/images/skills/nature.png';
import perceptionIcon from '@/public/images/skills/perception.png';
import performanceIcon from '@/public/images/skills/performance.png';
import persuasionIcon from '@/public/images/skills/persuasion.png';
import religionIcon from '@/public/images/skills/religion.png';
import sleightOfHandIcon from '@/public/images/skills/sleight-of-hand.png';
import stealthIcon from '@/public/images/skills/stealth.png';
import survivalIcon from '@/public/images/skills/survival.png';

type GuidesAccordionProps = {
  attributes: Attribute[];
  backgrounds: BackgroundDetail[];
  classes: ClassDetail[];
  equipment: EquipmentDetail[];
  skills: SkillDetail[];
  spellDetailExample: SpellDetail | null;
  spells: SpellGuideListItem[];
  species: SpeciesDetail[];
};

const guideResourceOrder = [
  'attributes',
  'skills',
  'classes',
  'species',
  'backgrounds',
  'equipment',
  'spells',
  'auth',
  'characters',
];

const guideResources = guideResourceOrder.flatMap((slug) => {
  const resource = apiResources.find((apiResource) => apiResource.slug === slug);

  return resource ? [resource] : [];
});

const attributeIcons = {
  STR: {
    alt: 'Strength attribute icon',
    src: strengthIcon,
  },
  DEX: {
    alt: 'Dexterity attribute icon',
    src: dexterityIcon,
  },
  CON: {
    alt: 'Constitution attribute icon',
    src: constitutionIcon,
  },
  INT: {
    alt: 'Intelligence attribute icon',
    src: intelligenceIcon,
  },
  WIS: {
    alt: 'Wisdom attribute icon',
    src: wisdomIcon,
  },
  CHA: {
    alt: 'Charisma attribute icon',
    src: charismaIcon,
  },
};

const skillIcons = {
  Athletics: {
    alt: 'Athletics skill icon',
    src: athleticsIcon,
  },
  Acrobatics: {
    alt: 'Acrobatics skill icon',
    src: acrobaticsIcon,
  },
  'Animal Handling': {
    alt: 'Animal Handling skill icon',
    src: animalHandlingIcon,
  },
  Arcana: {
    alt: 'Arcana skill icon',
    src: arcanaIcon,
  },
  Deception: {
    alt: 'Deception skill icon',
    src: deceptionIcon,
  },
  History: {
    alt: 'History skill icon',
    src: historyIcon,
  },
  Insight: {
    alt: 'Insight skill icon',
    src: insightIcon,
  },
  Intimidation: {
    alt: 'Intimidation skill icon',
    src: intimidationIcon,
  },
  Investigation: {
    alt: 'Investigation skill icon',
    src: investigationIcon,
  },
  Medicine: {
    alt: 'Medicine skill icon',
    src: medicineIcon,
  },
  Nature: {
    alt: 'Nature skill icon',
    src: natureIcon,
  },
  Perception: {
    alt: 'Perception skill icon',
    src: perceptionIcon,
  },
  Performance: {
    alt: 'Performance skill icon',
    src: performanceIcon,
  },
  Persuasion: {
    alt: 'Persuasion skill icon',
    src: persuasionIcon,
  },
  Religion: {
    alt: 'Religion skill icon',
    src: religionIcon,
  },
  'Sleight of Hand': {
    alt: 'Sleight of Hand skill icon',
    src: sleightOfHandIcon,
  },
  Stealth: {
    alt: 'Stealth skill icon',
    src: stealthIcon,
  },
  Survival: {
    alt: 'Survival skill icon',
    src: survivalIcon,
  },
};

const classImages: Record<string, { alt: string; src: string }> = {
  Barbarian: {
    alt: 'Barbarian warrior standing in a mountainous fantasy landscape',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775558574/adventurers/classes/Guerreiro_ba%CC%81rbaro_em_paisagem_montanhosa_n1t1mm.png',
  },
  Bard: {
    alt: 'Charming bard performing inside a fantasy tavern',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775560844/adventurers/classes/Bardo_encantador_na_taverna_bn7ua5.png',
  },
  Cleric: {
    alt: 'Cleric praying inside an ancient cathedral',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775561564/adventurers/classes/Cle%CC%81rigo_em_orac%CC%A7a%CC%83o_na_catedral_antiga_yp2wxg.png',
  },
  Druid: {
    alt: 'Half-elf druid standing inside a lush fantasy forest',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775561881/adventurers/classes/Druida_meio-elfo_na_floresta_exuberante_rejo6r.png',
  },
  Fighter: {
    alt: 'Dwarf fighter standing on a fantasy battlefield',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775563032/adventurers/classes/Guerreiro_ana%CC%83o_em_campo_de_batalha_xohlz0.png',
  },
  Monk: {
    alt: 'Monk meditating inside a mountainous temple',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775562372/adventurers/classes/Monge_meditando_no_templo_montanhoso_k73tsn.png',
  },
  Paladin: {
    alt: 'Paladin standing at the entrance of a cathedral',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775562621/adventurers/classes/Paladino_na_entrada_da_catedral_mum3dd.png',
  },
  Ranger: {
    alt: 'Elven ranger archer standing in the shadows of a forest',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775562799/adventurers/classes/Elfa_arqueira_nas_sombras_da_floresta_ka8zqd.png',
  },
  Rogue: {
    alt: 'Halfling rogue counting coins inside a tavern',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775562930/adventurers/classes/Ladra%CC%83o_halfling_na_taverna_contar_moedas_eqaiyz.png',
  },
  Sorcerer: {
    alt: 'Draconic sorcerer casting magic in battle',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775563147/adventurers/classes/Feiticeiro_draco%CC%82nico_em_ac%CC%A7a%CC%83o_ma%CC%81gica_bw775k.png',
  },
  Warlock: {
    alt: 'Tiefling warlock wearing gold and green fantasy attire',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775563473/adventurers/classes/Mulher_tiefling_em_traje_dourado_e_verde_slvzxe.png',
  },
  Wizard: {
    alt: 'Wizard losing control of a spell inside a magical library',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775564051/adventurers/classes/Feitic%CC%A7o_descontrolado_na_biblioteca_ma%CC%81gica_uty1py.png',
  },
};

const speciesImages: Record<string, { alt: string; src: string }> = {
  Aasimar: {
    alt: 'Aasimar holding a radiant golden sword',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775593718/adventurers/Species/Aasimar_com_espada_dourada_radiante_lve7mo.png',
  },
  Dragonborn: {
    alt: 'Red dragonborn warrior wearing medieval armor',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775591368/adventurers/Species/Guerreiro_draga%CC%83o_vermelho_em_armadura_medieval_i8yflu.png',
  },
  Dwarf: {
    alt: 'Dwarf blacksmith working in the heat of a forge',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775591972/adventurers/Species/Ferreiro_ana%CC%83o_no_calor_da_forja_hcixg4.png',
  },
  Elf: {
    alt: 'Elf adventurer in a fantasy portrait',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775594799/adventurers/Species/ChatGPT_Image_7_de_abr._de_2026_21_46_15_zxqshu.png',
  },
  Gnome: {
    alt: 'Gnome inventor working inside a magical atelier',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775595055/adventurers/Species/Ognomo_inventor_em_seu_atelie%CC%82_ma%CC%81gico_xbsus8.png',
  },
  Goliath: {
    alt: 'Goliath warrior standing in icy mountains',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775595501/adventurers/Species/Guerreiro_Goliath_nas_montanhas_geladas_vzdjty.png',
  },
  Halfling: {
    alt: 'Halfling druid in harmony with nature',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775595739/adventurers/Species/Druid_em_harmonia_com_a_natureza_yjj5yh.png',
  },
  Human: {
    alt: 'Human rogue exploring forest ruins',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775595632/adventurers/Species/Rogue_nas_rui%CC%81nas_da_floresta_bcaa8h.png',
  },
  Orc: {
    alt: 'Half-orc adventurer standing in a forest',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775594915/adventurers/Species/Aventureiro_meio-orc_na_floresta_hczvj5.png',
  },
  Tiefling: {
    alt: 'Tiefling adventurer standing in a medieval alley',
    src: 'https://res.cloudinary.com/dtglidvcw/image/upload/v1775594752/adventurers/Species/Aventureiro_tiefling_na_viela_medieval_o4rf6j.png',
  },
};

const attributeResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the attribute.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Full attribute name, such as Strength or Dexterity.',
  },
  {
    name: 'shortname',
    type: 'string',
    description: 'Short attribute code used across character data.',
  },
  {
    name: 'description',
    type: 'string',
    description: 'API description explaining what the attribute represents.',
  },
  {
    name: 'skills',
    type: 'string[]',
    description: 'Skill names currently associated with this attribute.',
  },
];

const skillListResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the skill.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Skill name returned in the compact skill list.',
  },
];

const skillDetailResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the skill.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Skill name used as the readable identifier.',
  },
  {
    name: 'attribute',
    type: 'string',
    description: 'Short name of the related attribute, such as STR or DEX.',
  },
  {
    name: 'description',
    type: 'string',
    description: 'API description explaining what the skill represents.',
  },
  {
    name: 'exampleofuse',
    type: 'string',
    description: 'Short gameplay example for when this skill is used.',
  },
  {
    name: 'commonclasses',
    type: 'string[]',
    description: 'Class names commonly associated with this skill.',
  },
];

const speciesListResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the species.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Species name returned in the compact species list.',
  },
];

const speciesDetailResponseFields = [
  {
    name: 'id',
    type: 'number',
    description: 'Unique numeric identifier for the species.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Readable species name, such as Elf or Dragonborn.',
  },
  {
    name: 'slug',
    type: 'string',
    description: 'URL-friendly identifier accepted by the detail endpoint.',
  },
  {
    name: 'description',
    type: 'string',
    description: 'Short lore and gameplay description for the species.',
  },
  {
    name: 'creatureType',
    type: 'string',
    description: 'Creature classification returned by the API.',
  },
  {
    name: 'size',
    type: 'string',
    description: 'Default physical size category for the species.',
  },
  {
    name: 'speed',
    type: 'number',
    description: 'Base movement speed in feet.',
  },
  {
    name: 'specialTraits',
    type: 'SpeciesTrait[]',
    description: 'Traits granted by the base species.',
  },
  {
    name: 'subspecies',
    type: 'SpeciesSubspecies[]',
    description: 'Optional lineage variants and their own traits.',
  },
];

function splitDescriptionSentences(description: string) {
  return description
    .split(/(?<=\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function GuidesAccordion({
  attributes,
  backgrounds,
  classes,
  equipment,
  skills,
  spellDetailExample,
  spells,
  species,
}: GuidesAccordionProps) {
  const [isAttributesOpen, setIsAttributesOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const [isClassesOpen, setIsClassesOpen] = useState(false);
  const [isSpeciesOpen, setIsSpeciesOpen] = useState(false);
  const [isBackgroundsOpen, setIsBackgroundsOpen] = useState(false);
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [isSpellsOpen, setIsSpellsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedAttributeIndex, setSelectedAttributeIndex] = useState(0);
  const [selectedSkillIndex, setSelectedSkillIndex] = useState(0);
  const [selectedClassIndex, setSelectedClassIndex] = useState(0);
  const [selectedSpeciesIndex, setSelectedSpeciesIndex] = useState(0);
  const [selectedBackgroundIndex, setSelectedBackgroundIndex] = useState(0);
  const [selectedEquipmentCategory, setSelectedEquipmentCategory] =
    useState('Weapon');
  const skillDetailExample =
    skills.find((skill) => skill.name === 'Athletics') ?? skills[0];
  const speciesDetailExample =
    species.find((speciesItem) => speciesItem.name === 'Elf') ?? species[0];

  function toggleAttributes() {
    setIsAttributesOpen((currentValue) => !currentValue);
  }

  function toggleSkills() {
    setIsSkillsOpen((currentValue) => !currentValue);
  }

  function toggleClasses() {
    setIsClassesOpen((currentValue) => !currentValue);
  }

  function toggleSpecies() {
    setIsSpeciesOpen((currentValue) => !currentValue);
  }

  function toggleBackgrounds() {
    setIsBackgroundsOpen((currentValue) => !currentValue);
  }

  function toggleEquipment() {
    setIsEquipmentOpen((currentValue) => !currentValue);
  }

  function toggleSpells() {
    setIsSpellsOpen((currentValue) => !currentValue);
  }

  function toggleAuth() {
    setIsAuthOpen((currentValue) => !currentValue);
  }

  function openSkillCard(
    event: MouseEvent<HTMLAnchorElement>,
    skillName: string,
  ) {
    event.preventDefault();
    openSkillByName(skillName);
  }

  function updateGuideCardHash(anchor: string) {
    window.history.replaceState(null, '', `#${anchor}`);
  }

  function scrollToGuideCard(anchor: string) {
    window.requestAnimationFrame(() => {
      document.getElementById(anchor)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      updateGuideCardHash(anchor);
    });
  }

  function scrollToAttributeCard(attributeShortname: string) {
    updateGuideCardHash(getAttributeAnchor(attributeShortname));
  }

  function selectAttributeByIndex(attributeIndex: number, shouldScroll = true) {
    const nextAttribute = attributes[attributeIndex];

    if (!nextAttribute) {
      return;
    }

    setSelectedAttributeIndex(attributeIndex);

    if (shouldScroll) {
      scrollToAttributeCard(nextAttribute.shortname);
    } else {
      updateGuideCardHash(getAttributeAnchor(nextAttribute.shortname));
    }
  }

  function openAttributeGuideCard(
    event: MouseEvent<HTMLAnchorElement>,
    attributeIndex: number,
  ) {
    event.preventDefault();
    selectAttributeByIndex(attributeIndex, false);
  }

  function openAttributeCard(
    event: MouseEvent<HTMLAnchorElement>,
    attributeShortname: string,
  ) {
    event.preventDefault();
    openAttributeByShortname(attributeShortname);
  }

  function openAttributeByShortname(attributeShortname: string) {
    const attributeIndex = attributes.findIndex(
      (attribute) => attribute.shortname === attributeShortname,
    );
    const nextAttribute = attributes[attributeIndex];

    if (!nextAttribute) {
      return;
    }

    setIsAttributesOpen(true);
    setSelectedAttributeIndex(attributeIndex);
    scrollToGuideCard(getAttributeAnchor(nextAttribute.shortname));
  }

  function openSkillByName(skillName: string) {
    const skillIndex = skills.findIndex((skill) => skill.name === skillName);
    const nextSkill = skills[skillIndex];

    if (!nextSkill) {
      return;
    }

    setIsSkillsOpen(true);
    setSelectedSkillIndex(skillIndex);
    scrollToGuideCard(getSkillAnchor(nextSkill.name));
  }

  function openChapterIndex(
    event: MouseEvent<HTMLAnchorElement>,
    indexId: string,
  ) {
    event.preventDefault();
    scrollToChapterIndex(indexId);
  }

  function scrollToChapterIndex(indexId: string) {
    window.requestAnimationFrame(() => {
      document.getElementById(indexId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      updateGuideCardHash(indexId);
    });
  }

  function scrollToGuideSection(sectionId: string) {
    window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      updateGuideCardHash(sectionId);
    });
  }

  function scrollToClassCard(className: string) {
    window.requestAnimationFrame(() => {
      const classAnchor = getClassAnchor(className);

      document.getElementById(classAnchor)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      updateGuideCardHash(classAnchor);
    });
  }

  function scrollToSkillCard(skillName: string) {
    updateGuideCardHash(getSkillAnchor(skillName));
  }

  function scrollToSpeciesCard(speciesName: string) {
    window.requestAnimationFrame(() => {
      const speciesAnchor = getSpeciesAnchor(speciesName);

      document.getElementById(speciesAnchor)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      updateGuideCardHash(speciesAnchor);
    });
  }

  function scrollToBackgroundCard(backgroundName: string) {
    window.requestAnimationFrame(() => {
      const backgroundAnchor = getBackgroundAnchor(backgroundName);

      document.getElementById(backgroundAnchor)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      updateGuideCardHash(backgroundAnchor);
    });
  }

  function selectClassByIndex(classIndex: number, shouldScroll = true) {
    const nextClass = classes[classIndex];

    if (!nextClass) {
      return;
    }

    setSelectedClassIndex(classIndex);

    if (shouldScroll) {
      scrollToClassCard(nextClass.name);
    } else {
      updateGuideCardHash(getClassAnchor(nextClass.name));
    }
  }

  function openClassCard(
    event: MouseEvent<HTMLAnchorElement>,
    classIndex: number,
  ) {
    event.preventDefault();
    selectClassByIndex(classIndex, false);
  }

  function selectSkillByIndex(skillIndex: number, shouldScroll = true) {
    const nextSkill = skills[skillIndex];

    if (!nextSkill) {
      return;
    }

    setSelectedSkillIndex(skillIndex);

    if (shouldScroll) {
      scrollToSkillCard(nextSkill.name);
    } else {
      updateGuideCardHash(getSkillAnchor(nextSkill.name));
    }
  }

  function openSkillGuideCard(
    event: MouseEvent<HTMLAnchorElement>,
    skillIndex: number,
  ) {
    event.preventDefault();
    selectSkillByIndex(skillIndex, false);
  }

  function selectSpeciesByIndex(speciesIndex: number, shouldScroll = true) {
    const nextSpecies = species[speciesIndex];

    if (!nextSpecies) {
      return;
    }

    setSelectedSpeciesIndex(speciesIndex);

    if (shouldScroll) {
      scrollToSpeciesCard(nextSpecies.name);
    } else {
      updateGuideCardHash(getSpeciesAnchor(nextSpecies.name));
    }
  }

  function openSpeciesCard(
    event: MouseEvent<HTMLAnchorElement>,
    speciesIndex: number,
  ) {
    event.preventDefault();
    selectSpeciesByIndex(speciesIndex, false);
  }

  function selectBackgroundByIndex(
    backgroundIndex: number,
    shouldScroll = true,
  ) {
    const nextBackground = backgrounds[backgroundIndex];

    if (!nextBackground) {
      return;
    }

    setSelectedBackgroundIndex(backgroundIndex);

    if (shouldScroll) {
      scrollToBackgroundCard(nextBackground.name);
    } else {
      updateGuideCardHash(getBackgroundAnchor(nextBackground.name));
    }
  }

  function selectEquipmentCategory(categoryName: string) {
    setSelectedEquipmentCategory(categoryName);
    updateGuideCardHash(
      `equipment-category-${categoryName
        .toLowerCase()
        .replaceAll('&', 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')}`,
    );
  }

  function selectSpellLevel(level: number) {
    updateGuideCardHash(
      `spells-level-${getGuideAnchorSlug(level === 0 ? 'Cantrips' : `Level ${level}`)}`,
    );
  }

  function openAttributesChapter() {
    setIsAttributesOpen(true);
    scrollToChapterIndex('attributes-index');
  }

  function openSkillsChapter() {
    setIsSkillsOpen(true);
    scrollToChapterIndex('skills-index');
  }

  function openClassesChapter() {
    setIsClassesOpen(true);
    scrollToChapterIndex('classes-index');
  }

  function openSpeciesChapter() {
    setIsSpeciesOpen(true);
    scrollToChapterIndex('species-index');
  }

  function openBackgroundsChapter() {
    setIsBackgroundsOpen(true);
    scrollToChapterIndex('backgrounds-index');
  }

  function openEquipmentChapter() {
    setIsEquipmentOpen(true);
    scrollToChapterIndex('equipment-category-index');
  }

  function openSpellsChapter() {
    setIsSpellsOpen(true);
    scrollToChapterIndex('spells-level-index');
  }

  function openAuthChapter() {
    setIsAuthOpen(true);
    scrollToChapterIndex('auth-index');
  }

  function closeAttributesChapter() {
    setIsAttributesOpen(false);
    scrollToGuideSection('attributes');
  }

  function closeSkillsChapter() {
    setIsSkillsOpen(false);
    scrollToGuideSection('skills');
  }

  function closeClassesChapter() {
    setIsClassesOpen(false);
    scrollToGuideSection('classes');
  }

  function closeSpeciesChapter() {
    setIsSpeciesOpen(false);
    scrollToGuideSection('species');
  }

  function closeBackgroundsChapter() {
    setIsBackgroundsOpen(false);
    scrollToGuideSection('backgrounds');
  }

  function closeEquipmentChapter() {
    setIsEquipmentOpen(false);
    scrollToGuideSection('equipment');
  }

  function closeSpellsChapter() {
    setIsSpellsOpen(false);
    scrollToGuideSection('spells');
  }

  function closeAuthChapter() {
    setIsAuthOpen(false);
    scrollToGuideSection('auth');
  }

  return (
    <>
      <section className="section-block guide-grimoire-cover">
        <div className="section-heading">
          <h1>Guild grimoire</h1>
          <p className="kicker">Choose a chapter from the codex</p>
          <p>
            Open a chapter to study the lore behind each API resource. The
            first pages are already inked, while the sealed chapters will be
            expanded as the project grows.
          </p>
        </div>

        <nav className="guide-submenu" aria-label="Guide chapters">
          {guideResources.map((resource) => {
            const isAttributes = resource.slug === 'attributes';
            const isSkills = resource.slug === 'skills';
            const isClasses = resource.slug === 'classes';
            const isSpecies = resource.slug === 'species';
            const isBackgrounds = resource.slug === 'backgrounds';
            const isEquipment = resource.slug === 'equipment';
            const isSpells = resource.slug === 'spells';
            const isAuth = resource.slug === 'auth';
            const isEnabled =
              isAttributes ||
              isSkills ||
              isClasses ||
              isSpecies ||
              isBackgrounds ||
              isEquipment ||
              isSpells ||
              isAuth;
            const isOpen =
              (isAttributes && isAttributesOpen) ||
              (isSkills && isSkillsOpen) ||
              (isClasses && isClassesOpen) ||
              (isSpecies && isSpeciesOpen) ||
              (isBackgrounds && isBackgroundsOpen) ||
              (isEquipment && isEquipmentOpen) ||
              (isSpells && isSpellsOpen) ||
              (isAuth && isAuthOpen);

            return (
              <button
                aria-expanded={isEnabled ? isOpen : undefined}
                className="guide-submenu__item"
                disabled={!isEnabled}
                key={resource.slug}
                onClick={
                  isAttributes
                    ? openAttributesChapter
                    : isSkills
                      ? openSkillsChapter
                      : isClasses
                        ? openClassesChapter
                        : isSpecies
                          ? openSpeciesChapter
                          : isBackgrounds
                            ? openBackgroundsChapter
                          : isEquipment
                            ? openEquipmentChapter
                          : isSpells
                            ? openSpellsChapter
                          : isAuth
                            ? openAuthChapter
                          : undefined
                }
                type="button"
              >
                <span>{resource.name}</span>
              </button>
            );
          })}
        </nav>
      </section>

      <section
        aria-labelledby="attributes-heading"
        className="section-block guide-accordion"
        id="attributes"
      >
        <h2 className="guide-accordion__heading" id="attributes-heading">
          <button
            aria-controls="attributes-panel"
            aria-expanded={isAttributesOpen}
            className="guide-accordion__toggle"
            onClick={toggleAttributes}
            type="button"
          >
            <span>
              <span className="kicker">First chapter</span>
              <span className="guide-accordion__title">Attributes</span>
              <strong aria-hidden="true">
                {isAttributesOpen ? 'Close' : 'Open'}
              </strong>
            </span>
          </button>
        </h2>

        <div
          aria-hidden={!isAttributesOpen}
          className={`guide-accordion__content${
            isAttributesOpen ? ' guide-accordion__content--open' : ''
          }`}
          id="attributes-panel"
          inert={!isAttributesOpen}
          role="region"
        >
          <div className="guide-accordion__scroll">
            <p className="guide-accordion__description">
              Attributes are the six core ability scores used to describe the
              natural strengths of a character in the Adventurers Guild API.
            </p>

            <nav
              className="guide-card-index"
              id="attributes-index"
              aria-label="Attributes index"
            >
              <p>Chapter index</p>
              <div>
                {attributes.map((attribute, attributeIndex) => (
                  <a
                    aria-current={
                      attributeIndex === selectedAttributeIndex
                        ? 'true'
                        : undefined
                    }
                    href={`#${getAttributeAnchor(attribute.shortname)}`}
                    key={attribute.shortname}
                    onClick={(event) =>
                      openAttributeGuideCard(event, attributeIndex)
                    }
                  >
                    {attribute.name}
                  </a>
                ))}
              </div>
            </nav>

            <div className="attribute-guide-grid">
              {attributes.map((attribute, attributeIndex) => {
                if (attributeIndex !== selectedAttributeIndex) {
                  return null;
                }

                const previousAttribute = attributes[attributeIndex - 1];
                const nextAttribute = attributes[attributeIndex + 1];

                return (
                  <article
                    className="attribute-guide-card"
                    id={getAttributeAnchor(attribute.shortname)}
                    key={attribute.shortname}
                  >
                    <div className="attribute-guide-card__header">
                      <h3>{attribute.name}</h3>
                      <span>{attribute.shortname}</span>
                    </div>
                    {attributeIcons[attribute.shortname] ? (
                      <div className="attribute-guide-card__icon-frame">
                        <Image
                          alt={attributeIcons[attribute.shortname].alt}
                          className="attribute-guide-card__icon"
                          height={512}
                          src={attributeIcons[attribute.shortname].src}
                          width={512}
                        />
                      </div>
                    ) : null}
                    <p>{attribute.description}</p>
                    <div className="attribute-guide-card__skills">
                      <p>Related skills</p>
                      <div className="attribute-skill-list">
                        {attribute.skills.length > 0 ? (
                          attribute.skills.map((skill) => (
                            <a
                              className="attribute-skill-chip"
                              href={`#${getSkillAnchor(skill)}`}
                              key={skill}
                              onClick={(event) => openSkillCard(event, skill)}
                            >
                              {skill}
                            </a>
                          ))
                        ) : (
                          <span className="attribute-skill-chip attribute-skill-chip--empty">
                            None in the current API catalog
                          </span>
                        )}
                      </div>
                    </div>

                    <nav
                      aria-label={`${attribute.name} navigation`}
                      className="guide-card-navigation"
                    >
                      {previousAttribute ? (
                        <button
                          aria-label={`Previous attribute: ${previousAttribute.name}`}
                          className="guide-card-navigation__link"
                          onClick={() =>
                            selectAttributeByIndex(attributeIndex - 1)
                          }
                          type="button"
                        >
                          ←
                        </button>
                      ) : (
                        <span className="guide-card-navigation__placeholder" />
                      )}

                      <a
                        className="guide-card-back-link"
                        href="#attributes-index"
                        onClick={(event) =>
                          openChapterIndex(event, 'attributes-index')
                        }
                      >
                        Index
                      </a>

                      {nextAttribute ? (
                        <button
                          aria-label={`Next attribute: ${nextAttribute.name}`}
                          className="guide-card-navigation__link"
                          onClick={() =>
                            selectAttributeByIndex(attributeIndex + 1)
                          }
                          type="button"
                        >
                          →
                        </button>
                      ) : (
                        <span className="guide-card-navigation__placeholder" />
                      )}
                    </nav>
                  </article>
                );
              })}
            </div>

            <aside className="guide-how-to-use">
              <h3>How to use</h3>
              <p>
                Call <code>GET /api/attributes</code> when you need the six base
                ability scores, their short names, descriptions, and related
                skills. This is a good starting point before reading character
                details, because many derived values connect back to these
                attributes.
              </p>
              <div className="endpoint-stack">
                <a
                  className="endpoint-pill"
                  href="https://adventurers-guild-api.vercel.app/api/attributes"
                  rel="noreferrer"
                  target="_blank"
                >
                  GET /api/attributes
                </a>
              </div>
            </aside>

            <section className="guide-expected-return">
              <div className="section-heading">
                <h3>Expected return</h3>
                <h4>Response shape</h4>
                <p>
                  The endpoint returns a list of attributes. Each item follows
                  the same shape, making it easy to read the field meaning
                  before using the JSON response in the rest of the project.
                </p>
              </div>

              <div className="response-field-list">
                {attributeResponseFields.map((field) => (
                  <article className="response-field-card" key={field.name}>
                    <span>{field.name}</span>
                    <p>{field.description}</p>
                    <strong>{field.type}</strong>
                  </article>
                ))}
              </div>

              <div className="response-example">
                <div className="response-example__header">
                  <span>Example JSON</span>
                  <code>200 OK</code>
                </div>
                <pre>
                  <code>{JSON.stringify(attributes, null, 2)}</code>
                </pre>
              </div>
            </section>

            <button
              className="guide-accordion__close"
              onClick={closeAttributesChapter}
              type="button"
            >
              Close Attributes chapter
            </button>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="skills-heading"
        className="section-block guide-accordion"
        id="skills"
      >
        <h2 className="guide-accordion__heading" id="skills-heading">
          <button
            aria-controls="skills-panel"
            aria-expanded={isSkillsOpen}
            className="guide-accordion__toggle"
            onClick={toggleSkills}
            type="button"
          >
            <span>
              <span className="kicker">Second chapter</span>
              <span className="guide-accordion__title">Skills</span>
              <strong aria-hidden="true">
                {isSkillsOpen ? 'Close' : 'Open'}
              </strong>
            </span>
          </button>
        </h2>

        <div
          aria-hidden={!isSkillsOpen}
          className={`guide-accordion__content${
            isSkillsOpen ? ' guide-accordion__content--open' : ''
          }`}
          id="skills-panel"
          inert={!isSkillsOpen}
          role="region"
        >
          <div className="guide-accordion__scroll">
            <p className="guide-accordion__description">
              Skills represent practical ways a character applies an attribute.
              Each skill has a related attribute, a description, an example of
              use, and common classes that often benefit from it.
            </p>

            <nav
              className="guide-card-index"
              id="skills-index"
              aria-label="Skills index"
            >
              <p>Chapter index</p>
              <div>
                {skills.map((skill, skillIndex) => (
                  <a
                    aria-current={
                      skillIndex === selectedSkillIndex ? 'true' : undefined
                    }
                    href={`#${getSkillAnchor(skill.name)}`}
                    key={skill.id}
                    onClick={(event) => openSkillGuideCard(event, skillIndex)}
                  >
                    {skill.name}
                  </a>
                ))}
              </div>
            </nav>

            <div className="skill-guide-grid">
              {skills.map((skill, skillIndex) => {
                if (skillIndex !== selectedSkillIndex) {
                  return null;
                }

                const skillAnchor = getSkillAnchor(skill.name);
                const previousSkill = skills[skillIndex - 1];
                const nextSkill = skills[skillIndex + 1];

                return (
                  <article
                    className="skill-guide-card"
                    id={skillAnchor}
                    key={skill.id}
                  >
                    <div className="skill-guide-card__header">
                      <h3>{skill.name}</h3>
                    </div>
                    {skillIcons[skill.name] ? (
                      <div className="skill-guide-card__icon-frame">
                        <Image
                          alt={skillIcons[skill.name].alt}
                          className="skill-guide-card__icon"
                          height={512}
                          src={skillIcons[skill.name].src}
                          width={512}
                        />
                      </div>
                    ) : null}
                    <p>{skill.description}</p>
                    <div className="skill-guide-card__example">
                      <p>Example of use</p>
                      <span>{skill.exampleofuse}</span>
                    </div>
                    <div className="skill-guide-card__attribute">
                      <p>Related attribute</p>
                      <a
                        href={`#${getAttributeAnchor(skill.attribute)}`}
                        onClick={(event) =>
                          openAttributeCard(event, skill.attribute)
                        }
                      >
                        {skill.attribute}
                      </a>
                    </div>

                    <nav
                      aria-label={`${skill.name} navigation`}
                      className="guide-card-navigation"
                    >
                      {previousSkill ? (
                        <button
                          aria-label={`Previous skill: ${previousSkill.name}`}
                          className="guide-card-navigation__link"
                          onClick={() => selectSkillByIndex(skillIndex - 1)}
                          type="button"
                        >
                          ←
                        </button>
                      ) : (
                        <span className="guide-card-navigation__placeholder" />
                      )}

                      <a
                        className="guide-card-back-link"
                        href="#skills-index"
                        onClick={(event) =>
                          openChapterIndex(event, 'skills-index')
                        }
                      >
                        Index
                      </a>

                      {nextSkill ? (
                        <button
                          aria-label={`Next skill: ${nextSkill.name}`}
                          className="guide-card-navigation__link"
                          onClick={() => selectSkillByIndex(skillIndex + 1)}
                          type="button"
                        >
                          →
                        </button>
                      ) : (
                        <span className="guide-card-navigation__placeholder" />
                      )}
                    </nav>
                  </article>
                );
              })}
            </div>

            <aside className="guide-how-to-use">
              <h3>How to use</h3>
              <p>
                Call <code>GET /api/skills</code> when you need the compact
                skill list. Use <code>GET /api/skills/{'{identifier}'}</code>{' '}
                when you need the related attribute, description, example of
                use, and common classes for a specific skill.
              </p>
              <div className="endpoint-stack">
                <a
                  className="endpoint-pill"
                  href="https://adventurers-guild-api.vercel.app/api/skills"
                  rel="noreferrer"
                  target="_blank"
                >
                  GET /api/skills
                </a>
              </div>
            </aside>

            <section className="guide-expected-return">
              <div className="section-heading">
                <h3>Expected return</h3>
                <h4>Response shape</h4>
                <p>
                  The list endpoint returns a compact array of skills. Each item
                  includes only the identifier and the skill name, while the
                  detail endpoint exposes the richer educational fields.
                </p>
              </div>

              <div className="response-variant">
                <div className="response-variant__heading">
                  <h4>List response</h4>
                  <code>GET /api/skills</code>
                </div>

                <div className="response-field-list response-field-list--compact">
                  {skillListResponseFields.map((field) => (
                    <article className="response-field-card" key={field.name}>
                      <span>{field.name}</span>
                      <p>{field.description}</p>
                      <strong>{field.type}</strong>
                    </article>
                  ))}
                </div>

                <div className="response-example">
                  <div className="response-example__header">
                    <span>Example JSON</span>
                    <code>200 OK</code>
                  </div>
                  <pre>
                    <code>{JSON.stringify(
                        skills.map((skill) => ({
                          id: skill.id,
                          name: skill.name,
                        })),
                        null,
                        2,
                      )}</code>
                  </pre>
                </div>
              </div>

              {skillDetailExample ? (
                <div className="response-variant">
                  <div className="response-variant__heading">
                    <h4>Detail response</h4>
                    <code>GET /api/skills/{'{identifier}'}</code>
                  </div>

                  <div className="response-field-list">
                    {skillDetailResponseFields.map((field) => (
                      <article className="response-field-card" key={field.name}>
                        <span>{field.name}</span>
                        <p>{field.description}</p>
                        <strong>{field.type}</strong>
                      </article>
                    ))}
                  </div>

                  <div className="response-example">
                    <div className="response-example__header">
                      <span>Example JSON</span>
                      <code>200 OK</code>
                    </div>
                    <pre>
                      <code>{JSON.stringify(
                          {
                            id: skillDetailExample.id,
                            name: skillDetailExample.name,
                            attribute: skillDetailExample.attribute,
                            description: skillDetailExample.description,
                            exampleofuse: skillDetailExample.exampleofuse,
                            commonclasses: skillDetailExample.commonclasses,
                          },
                          null,
                          2,
                        )}</code>
                    </pre>
                  </div>
                </div>
              ) : null}
            </section>

            <button
              className="guide-accordion__close"
              onClick={closeSkillsChapter}
              type="button"
            >
              Close Skills chapter
            </button>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="classes-heading"
        className="section-block guide-accordion"
        id="classes"
      >
        <h2 className="guide-accordion__heading" id="classes-heading">
          <button
            aria-controls="classes-panel"
            aria-expanded={isClassesOpen}
            className="guide-accordion__toggle"
            onClick={toggleClasses}
            type="button"
          >
            <span>
              <span className="kicker">Third chapter</span>
              <span className="guide-accordion__title">Classes</span>
              <strong aria-hidden="true">
                {isClassesOpen ? 'Close' : 'Open'}
              </strong>
            </span>
          </button>
        </h2>

        <div
          aria-hidden={!isClassesOpen}
          className={`guide-accordion__content${
            isClassesOpen ? ' guide-accordion__content--open' : ''
          }`}
          id="classes-panel"
          inert={!isClassesOpen}
          role="region"
        >
          <div className="guide-accordion__scroll">
            <p className="guide-accordion__description">
              Classes describe a character&apos;s adventuring path: their role,
              hit die, core attributes, saving throw proficiencies, recommended
              skills, and spellcasting support.
            </p>

            <nav
              className="guide-card-index"
              id="classes-index"
              aria-label="Classes index"
            >
              <p>Chapter index</p>
              <div>
                {classes.map((classItem, classIndex) => (
                  <a
                    aria-current={
                      classIndex === selectedClassIndex ? 'true' : undefined
                    }
                    href={`#${getClassAnchor(classItem.name)}`}
                    key={classItem.id}
                    onClick={(event) => openClassCard(event, classIndex)}
                  >
                    {classItem.name}
                  </a>
                ))}
              </div>
            </nav>

            <div className="class-guide-grid">
              {classes.map((classItem, classIndex) => {
                if (classIndex !== selectedClassIndex) {
                  return null;
                }

                const classImage = classImages[classItem.name];
                const hitDie = Number(classItem.hitdie);
                const previousClass = classes[classIndex - 1];
                const nextClass = classes[classIndex + 1];

                return (
                  <article
                    className="class-guide-card"
                    id={getClassAnchor(classItem.name)}
                    key={classItem.id}
                  >
                    <div className="class-guide-card__header">
                      <p className="kicker">{classItem.role}</p>
                      <h3>{classItem.name}</h3>
                      <p>{classItem.description}</p>
                    </div>

                    <div className="class-guide-card__overview">
                      {classImage ? (
                        <div className="class-guide-card__media">
                          <Image
                            alt={classImage.alt}
                            fill
                            sizes="(max-width: 900px) 100vw, 50vw"
                            src={classImage.src}
                          />
                        </div>
                      ) : null}

                      <div className="class-guide-card__content">
                        <div className="class-guide-card__meta">
                          <div className="class-guide-card__stat-block class-guide-card__hit-die">
                            <p>Hit Die</p>
                            <span
                              className={`class-guide-card__die class-guide-card__die--d${hitDie}`}
                              data-hit-die={hitDie}
                            >
                              D{hitDie}
                            </span>
                          </div>

                          <div className="class-guide-card__stat-block class-guide-card__primary">
                            <p>Primary Attribute</p>
                            <div>
                              {classItem.primaryattributes.map(
                                (primaryAttribute) => (
                                  <a
                                    href={`#${getAttributeAnchor(primaryAttribute)}`}
                                    key={primaryAttribute}
                                    onClick={(event) =>
                                      openAttributeCard(event, primaryAttribute)
                                    }
                                  >
                                    {primaryAttribute}
                                  </a>
                                ),
                              )}
                            </div>
                          </div>

                          <div className="class-guide-card__stat-block class-guide-card__saving-throws">
                            <p>Saving Throws</p>
                            <div>
                              {classItem.savingthrows.map((savingThrow) => (
                                <a
                                  href={`#${getAttributeAnchor(savingThrow)}`}
                                  key={savingThrow}
                                  onClick={(event) =>
                                    openAttributeCard(event, savingThrow)
                                  }
                                >
                                  {savingThrow}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="class-guide-card__details">
                          <div className="class-guide-card__detail-block">
                            <p>Recommended skills</p>
                            {classItem.recommendedskills.length > 0 ? (
                              <div className="attribute-skill-list">
                                {classItem.recommendedskills.map((skill) => (
                                  <a
                                    className="attribute-skill-chip"
                                    href={`#${getSkillAnchor(skill)}`}
                                    key={skill}
                                    onClick={(event) =>
                                      openSkillCard(event, skill)
                                    }
                                  >
                                    {skill}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <span>No recommended skills listed.</span>
                            )}
                          </div>

                          <div className="class-guide-card__detail-block">
                            <p>Subclasses</p>
                            <span>
                              {classItem.subclasses.length > 0
                                ? classItem.subclasses.join(', ')
                                : 'No subclasses listed yet.'}
                            </span>
                          </div>

                          {classItem.spellcasting ? (
                            <div className="class-guide-card__detail-block">
                              <p>Spellcasting</p>
                              <span>
                                Uses {classItem.spellcasting.ability}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {classItem.levelprogression.length > 0 ? (
                      <div className="class-progression">
                        <div className="class-progression__heading">
                          <p>Class progression</p>
                          <span>
                            Features returned by the class detail endpoint.
                          </span>
                        </div>

                        <div className="class-progression__table-wrap">
                          <table>
                            <thead>
                              <tr>
                                <th>Level</th>
                                <th>Feature</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {classItem.levelprogression.flatMap((levelItem) =>
                                levelItem.features.map((feature) => (
                                  <tr
                                    key={`${classItem.id}-${levelItem.level}-${feature.name}`}
                                  >
                                    <td data-label="Level">{levelItem.level}</td>
                                    <td data-label="Feature">{feature.name}</td>
                                    <td data-label="Description">
                                      <div className="class-progression__description">
                                        {splitDescriptionSentences(
                                          feature.description,
                                        ).map((sentence) => (
                                          <p key={sentence}>{sentence}</p>
                                        ))}
                                      </div>
                                    </td>
                                  </tr>
                                )),
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}

                    <nav
                      aria-label={`${classItem.name} navigation`}
                      className="guide-card-navigation"
                    >
                      {previousClass ? (
                        <button
                          aria-label={`Previous class: ${previousClass.name}`}
                          className="guide-card-navigation__link"
                          onClick={() => selectClassByIndex(classIndex - 1)}
                          type="button"
                        >
                          ←
                        </button>
                      ) : (
                        <span className="guide-card-navigation__placeholder" />
                      )}

                      <a
                        className="guide-card-back-link"
                        href="#classes-index"
                        onClick={(event) =>
                          openChapterIndex(event, 'classes-index')
                        }
                      >
                        Index
                      </a>

                      {nextClass ? (
                        <button
                          aria-label={`Next class: ${nextClass.name}`}
                          className="guide-card-navigation__link"
                          onClick={() => selectClassByIndex(classIndex + 1)}
                          type="button"
                        >
                          →
                        </button>
                      ) : (
                        <span className="guide-card-navigation__placeholder" />
                      )}
                    </nav>
                  </article>
                );
              })}
            </div>

            <aside className="guide-how-to-use">
              <h3>How to use</h3>
              <p>
                Call <code>GET /api/classes</code> for the compact list, then
                use <code>GET /api/classes/{'{identifier}'}</code> when you need
                class details such as hit die, recommended skills, saving
                throws, subclasses, and spellcasting metadata.
              </p>
              <div className="endpoint-stack">
                <a
                  className="endpoint-pill"
                  href="https://adventurers-guild-api.vercel.app/api/classes"
                  rel="noreferrer"
                  target="_blank"
                >
                  GET /api/classes
                </a>
              </div>
            </aside>

            <button
              className="guide-accordion__close"
              onClick={closeClassesChapter}
              type="button"
            >
              Close Classes chapter
            </button>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="species-heading"
        className="section-block guide-accordion"
        id="species"
      >
        <h2 className="guide-accordion__heading" id="species-heading">
          <button
            aria-controls="species-panel"
            aria-expanded={isSpeciesOpen}
            className="guide-accordion__toggle"
            onClick={toggleSpecies}
            type="button"
          >
            <span>
              <span className="kicker">Fourth chapter</span>
              <span className="guide-accordion__title">Species</span>
              <strong aria-hidden="true">
                {isSpeciesOpen ? 'Close' : 'Open'}
              </strong>
            </span>
          </button>
        </h2>

        <div
          aria-hidden={!isSpeciesOpen}
          className={`guide-accordion__content${
            isSpeciesOpen ? ' guide-accordion__content--open' : ''
          }`}
          id="species-panel"
          inert={!isSpeciesOpen}
          role="region"
        >
          <div className="guide-accordion__scroll">
            <p className="guide-accordion__description">
              Species describe a character&apos;s ancestry and physical profile
              in the Adventurers Guild API. This chapter will grow into a guide
              for creature type, size, speed, and special traits returned by the
              species endpoints.
            </p>

            <nav
              className="guide-card-index"
              id="species-index"
              aria-label="Species index"
            >
              <p>Chapter index</p>
              <div>
                {species.map((speciesItem, speciesIndex) => (
                  <a
                    aria-current={
                      speciesIndex === selectedSpeciesIndex
                        ? 'true'
                        : undefined
                    }
                    href={`#${getSpeciesAnchor(speciesItem.name)}`}
                    key={speciesItem.id}
                    onClick={(event) => openSpeciesCard(event, speciesIndex)}
                  >
                    {speciesItem.name}
                  </a>
                ))}
              </div>
            </nav>

            <div className="species-guide-grid">
              {species.map((speciesItem, speciesIndex) => {
                if (speciesIndex !== selectedSpeciesIndex) {
                  return null;
                }

                const speciesImage = speciesImages[speciesItem.name];
                const previousSpecies = species[speciesIndex - 1];
                const nextSpecies = species[speciesIndex + 1];

                return (
                  <article
                    className="species-guide-card"
                    id={getSpeciesAnchor(speciesItem.name)}
                    key={speciesItem.id}
                  >
                    <div
                      className={`species-guide-card__overview${
                        speciesImage
                          ? ''
                          : ' species-guide-card__overview--text-only'
                      }`}
                    >
                      {speciesImage ? (
                        <div className="species-guide-card__media">
                          <Image
                            alt={speciesImage.alt}
                            fill
                            sizes="(max-width: 900px) 100vw, 45vw"
                            src={speciesImage.src}
                          />
                        </div>
                      ) : null}

                      <div className="species-guide-card__header">
                        <p className="kicker">{speciesItem.creatureType}</p>
                        <h3>{speciesItem.name}</h3>
                        <p>{speciesItem.description}</p>
                        <div className="species-guide-card__summary">
                          <div>
                            <p>Size</p>
                            <span>{speciesItem.size}</span>
                          </div>
                          <div>
                            <p>Speed</p>
                            <span>{speciesItem.speed} ft.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="species-guide-card__traits">
                      <p>Special traits</p>
                      {speciesItem.specialTraits.length > 0 ? (
                        <ul>
                          {speciesItem.specialTraits.map((trait) => (
                            <li key={trait.name}>
                              <strong>{trait.name}</strong>
                              <span>{trait.description}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span>No special traits listed yet.</span>
                      )}
                    </div>

                    {speciesItem.subspecies.length > 0 ? (
                      <div className="species-subspecies">
                        <div className="species-subspecies__heading">
                          <p>Subspecies</p>
                          <span>
                            Variants returned by the species detail endpoint.
                          </span>
                        </div>

                        <div className="species-subspecies__table-wrap">
                          <table>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Special traits</th>
                              </tr>
                            </thead>
                            <tbody>
                              {speciesItem.subspecies.map((subspecies) => (
                                <tr key={subspecies.slug}>
                                  <td data-label="Name">{subspecies.name}</td>
                                  <td data-label="Description">
                                    {subspecies.description}
                                  </td>
                                  <td data-label="Special traits">
                                    {subspecies.specialTraits.length > 0 ? (
                                      <div className="species-subspecies__trait-list">
                                        {subspecies.specialTraits.map(
                                          (trait) => (
                                            <div key={trait.name}>
                                              <strong>{trait.name}</strong>
                                              <span>{trait.description}</span>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    ) : (
                                      'No special traits listed.'
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : null}

                    <nav
                      aria-label={`${speciesItem.name} navigation`}
                      className="guide-card-navigation"
                    >
                      {previousSpecies ? (
                        <button
                          aria-label={`Previous species: ${previousSpecies.name}`}
                          className="guide-card-navigation__link"
                          onClick={() =>
                            selectSpeciesByIndex(speciesIndex - 1)
                          }
                          type="button"
                        >
                          ←
                        </button>
                      ) : (
                        <span className="guide-card-navigation__placeholder" />
                      )}

                      <a
                        className="guide-card-back-link"
                        href="#species-index"
                        onClick={(event) =>
                          openChapterIndex(event, 'species-index')
                        }
                      >
                        Index
                      </a>

                      {nextSpecies ? (
                        <button
                          aria-label={`Next species: ${nextSpecies.name}`}
                          className="guide-card-navigation__link"
                          onClick={() =>
                            selectSpeciesByIndex(speciesIndex + 1)
                          }
                          type="button"
                        >
                          →
                        </button>
                      ) : (
                        <span className="guide-card-navigation__placeholder" />
                      )}
                    </nav>
                  </article>
                );
              })}
            </div>

            <aside className="guide-how-to-use">
              <h3>How to use</h3>
              <p>
                Call <code>GET /api/species</code> for the compact species
                list, then use{' '}
                <code>GET /api/species/{'{identifier}'}</code> to read a
                species&apos; creature type, size, movement speed, and special
                traits.
              </p>
              <div className="endpoint-stack">
                <a
                  className="endpoint-pill"
                  href="https://adventurers-guild-api.vercel.app/api/species"
                  rel="noreferrer"
                  target="_blank"
                >
                  GET /api/species
                </a>
              </div>
            </aside>

            <section className="guide-expected-return">
              <div className="section-heading">
                <h3>Expected return</h3>
                <h4>Response shape</h4>
                <p>
                  The list endpoint returns a compact species index with only
                  identifiers and names. Use the detail endpoint when you need
                  creature type, size, speed, traits, and subspecies.
                </p>
              </div>

              <div className="response-variant">
                <div className="response-variant__heading">
                  <h4>List response</h4>
                  <code>GET /api/species</code>
                </div>

                <div className="response-field-list response-field-list--compact">
                  {speciesListResponseFields.map((field) => (
                    <article className="response-field-card" key={field.name}>
                      <span>{field.name}</span>
                      <p>{field.description}</p>
                      <strong>{field.type}</strong>
                    </article>
                  ))}
                </div>

                <div className="response-example">
                  <div className="response-example__header">
                    <span>Example JSON</span>
                    <code>200 OK</code>
                  </div>
                  <pre>
                    <code>{JSON.stringify(
                        species.map((speciesItem) => ({
                          id: speciesItem.id,
                          name: speciesItem.name,
                        })),
                        null,
                        2,
                      )}</code>
                  </pre>
                </div>
              </div>

              {speciesDetailExample ? (
                <div className="response-variant">
                  <div className="response-variant__heading">
                    <h4>Detail response: {speciesDetailExample.name}</h4>
                    <code>GET /api/species/{speciesDetailExample.slug}</code>
                  </div>

                  <div className="response-field-list">
                    {speciesDetailResponseFields.map((field) => (
                      <article className="response-field-card" key={field.name}>
                        <span>{field.name}</span>
                        <p>{field.description}</p>
                        <strong>{field.type}</strong>
                      </article>
                    ))}
                  </div>

                  <div className="response-example">
                    <div className="response-example__header">
                      <span>Example JSON</span>
                      <code>200 OK</code>
                    </div>
                    <pre>
                      <code>{JSON.stringify(
                          {
                            id: speciesDetailExample.id,
                            name: speciesDetailExample.name,
                            slug: speciesDetailExample.slug,
                            description: speciesDetailExample.description,
                            creatureType: speciesDetailExample.creatureType,
                            size: speciesDetailExample.size,
                            speed: speciesDetailExample.speed,
                            specialTraits: speciesDetailExample.specialTraits,
                            subspecies: speciesDetailExample.subspecies,
                          },
                          null,
                          2,
                        )}</code>
                    </pre>
                  </div>
                </div>
              ) : null}
            </section>

            <button
              className="guide-accordion__close"
              onClick={closeSpeciesChapter}
              type="button"
            >
              Close Species chapter
            </button>
          </div>
        </div>
      </section>

      <BackgroundsGuideChapter
        attributes={attributes}
        backgrounds={backgrounds}
        isOpen={isBackgroundsOpen}
        onClose={closeBackgroundsChapter}
        onOpenAttribute={openAttributeByShortname}
        onOpenChapterIndex={scrollToChapterIndex}
        onOpenSkill={openSkillByName}
        onSelectBackground={selectBackgroundByIndex}
        onToggle={toggleBackgrounds}
        selectedBackgroundIndex={selectedBackgroundIndex}
      />

      <EquipmentGuideChapter
        equipment={equipment}
        isOpen={isEquipmentOpen}
        onClose={closeEquipmentChapter}
        onSelectCategory={selectEquipmentCategory}
        onToggle={toggleEquipment}
        selectedCategory={selectedEquipmentCategory}
      />

      <SpellsGuideChapter
        isOpen={isSpellsOpen}
        onClose={closeSpellsChapter}
        onSelectLevel={selectSpellLevel}
        onToggle={toggleSpells}
        spellDetailExample={spellDetailExample}
        spells={spells}
      />

      <AuthGuideChapter
        isOpen={isAuthOpen}
        onClose={closeAuthChapter}
        onToggle={toggleAuth}
      />
    </>
  );
}
