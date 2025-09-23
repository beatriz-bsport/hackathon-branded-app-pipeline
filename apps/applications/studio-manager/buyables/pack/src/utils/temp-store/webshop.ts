import webshopCategories from "#src/fixtures/shop-categories-data.json";
import webshopItems from "#src/fixtures/shop-data.json";

import { getCategoriesById, getItemsById } from "./helpers";

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

export const useSelectWebshopItems = () => webshopItems;

export const useSelectWebshopCategories = () => webshopCategories;

export const useSelectWebshopItemById = () => {
  return getItemsById<WebshopItem>("webshopItem");
};

export const useSelectWebshopCategoryById = () => {
  return getCategoriesById("webshopItem");
};
