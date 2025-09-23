import passCategories from "#src/fixtures/pass-categories-data.json";
import passes from "#src/fixtures/pass-data.json";

import { getCategoriesById, getItemsById } from "./helpers";

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

export const useSelectPasses = () => passes;

export const useSelectPassCategories = () => passCategories;

export const useSelectPassById = () => {
  return getItemsById<Pass>("pass");
};

export const useSelectPassCategoryById = () => {
  return getCategoriesById("pass");
};
