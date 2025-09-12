import appointmentPassCategories from "#src/fixtures/appointment-pass-categories-data.json";
import passCategories from "#src/fixtures/pass-categories-data.json";
import shopCategories from "#src/fixtures/shop-categories-data.json";
import { ITEM_VARIANTS, type ItemVariant } from "#src/hooks/useAddItemsModal";

export type Category = {
  id: number;
  name: string;
  category_ordering?: number;
};

export const FIXTURES_CATEGORIES: Record<ItemVariant, Category[]> = {
  [ITEM_VARIANTS.pass]: passCategories,
  [ITEM_VARIANTS.appointmentPass]: appointmentPassCategories,
  [ITEM_VARIANTS.webshopItem]: shopCategories,
};
