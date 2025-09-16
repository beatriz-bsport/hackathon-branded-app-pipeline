import appointmentPassCategories from "#src/fixtures/appointment-pass-categories-data.json";
import appointmentPasses from "#src/fixtures/appointment-pass-data.json";
import passCategories from "#src/fixtures/pass-categories-data.json";
import passes from "#src/fixtures/pass-data.json";
import shopCategories from "#src/fixtures/shop-categories-data.json";
import webshopItems from "#src/fixtures/shop-data.json";
import { ITEM_VARIANTS, type ItemVariant } from "#src/hooks/useAddItemsModal";

export type Category = {
  id: number;
  name: string;
  category_ordering?: number;
};

export const FIXTURES_ITEMS = {
  // We have partial data in fixtures JSON files => enforce typing
  [ITEM_VARIANTS.pass]: passes as Pass[],
  [ITEM_VARIANTS.appointmentPass]: appointmentPasses as AppointmentPass[],
  [ITEM_VARIANTS.webshopItem]: webshopItems as WebshopItem[],
} as const;

export const FIXTURES_CATEGORIES: Record<ItemVariant, Category[]> = {
  [ITEM_VARIANTS.pass]: passCategories,
  [ITEM_VARIANTS.appointmentPass]: appointmentPassCategories,
  [ITEM_VARIANTS.webshopItem]: shopCategories,
};

/** @todo Replace with full typing from the store packages once implemented  */

export type Pass = {
  id: number;
  name: string;
  price: {
    source: string;
    parsedValue: number;
  };
  credits: number | null;
  manager_only: boolean; // Unavailable
  is_usable_by_staff: boolean; // Invisible
  category: number | null;
  ordering_in_category: number | null;
  disabled: boolean; // Archived
};

export type AppointmentPass = {
  id: number;
  name: string;
  price: string;
  credits: number | null;
  manager_only: boolean; // Unavailable
  is_usable_by_staff: boolean; // Invisible
  category: number | null;
  ordering_in_category: number | null;
  available: boolean; // Archived
};

export type WebshopItem = {
  id: number;
  name: string;
  price: string;
  cover: string | null;
  subshop: number | null; // Category
  disabled: boolean;
  marketplace_enabled: boolean; // Unavailable
  size: string;
};

export { ITEM_VARIANTS, type ItemVariant } from "#src/hooks/useAddItemsModal";
