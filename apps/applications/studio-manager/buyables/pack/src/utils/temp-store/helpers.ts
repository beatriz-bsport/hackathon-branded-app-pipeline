import appointmentPassCategories from "#src/fixtures/appointment-pass-categories-data.json";
import appointmentPasses from "#src/fixtures/appointment-pass-data.json";
import passCategories from "#src/fixtures/pass-categories-data.json";
import passes from "#src/fixtures/pass-data.json";
import webshopCategories from "#src/fixtures/shop-categories-data.json";
import webshopItems from "#src/fixtures/shop-data.json";
import {
  type Category,
  ITEM_VARIANTS,
  type ItemVariant,
} from "#src/utils/constants";

const FIXTURES_ITEMS = {
  [ITEM_VARIANTS.pass]: passes,
  [ITEM_VARIANTS.appointmentPass]: appointmentPasses,
  [ITEM_VARIANTS.webshopItem]: webshopItems,
} as const;

const FIXTURES_CATEGORIES: Record<ItemVariant, Category[]> = {
  [ITEM_VARIANTS.pass]: passCategories,
  [ITEM_VARIANTS.appointmentPass]: appointmentPassCategories,
  [ITEM_VARIANTS.webshopItem]: webshopCategories,
};

export function getItemsById<T>(variant: ItemVariant) {
  const categories = FIXTURES_ITEMS[variant];
  const categoriesBydId = new Map<number, T>();
  for (const category of categories) {
    categoriesBydId.set(category.id, category as T);
  }
  return categoriesBydId;
}

export function getCategoriesById(variant: ItemVariant) {
  const categories = FIXTURES_CATEGORIES[variant];
  const categoriesBydId = new Map<number, Category>();
  for (const category of categories) {
    categoriesBydId.set(category.id, category);
  }
  return categoriesBydId;
}
