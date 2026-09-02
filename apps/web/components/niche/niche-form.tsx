"use client";

import type { NicheMapperInput } from "@viral-copilot/agent-contracts";

/**
 * Niche brief form data matching the NicheMapperInput interface.
 */
export type NicheFormData = NicheMapperInput & {
  subNiche: string;
  personas: string;
  pains: string;
  desiredOutcomes: string;
  offers: string;
  competitors: string;
  brandTone: string;
  complianceNotes: string;
};

export const EMPTY_NICHE_FORM: NicheFormData = {
  marketName: "",
  subNiche: "",
  country: "FR",
  language: "fr",
  personas: "",
  pains: "",
  desiredOutcomes: "",
  offers: "",
  competitors: "",
  brandTone: "",
  complianceNotes: "",
};

/**
 * Map of common countries and languages.
 */
export const COUNTRY_OPTIONS = [
  { value: "FR", label: "France" },
  { value: "US", label: "États-Unis" },
  { value: "GB", label: "Royaume-Uni" },
  { value: "DE", label: "Allemagne" },
  { value: "ES", label: "Espagne" },
  { value: "IT", label: "Italie" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australie" },
  { value: "BR", label: "Brésil" },
  { value: "JP", label: "Japon" },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: "fr", label: "Français" },
  { value: "en", label: "Anglais" },
  { value: "de", label: "Allemand" },
  { value: "es", label: "Espagnol" },
  { value: "it", label: "Italien" },
  { value: "pt", label: "Portugais" },
  { value: "ja", label: "Japonais" },
] as const;