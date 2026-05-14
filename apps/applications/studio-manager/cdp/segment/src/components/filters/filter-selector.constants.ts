export const FILTER_SELECTOR_CATEGORIES = {
  passes: "PASSES",
  bookings: "BOOKINGS",
} as const;

export type FilterSelectorCategory =
  (typeof FILTER_SELECTOR_CATEGORIES)[keyof typeof FILTER_SELECTOR_CATEGORIES];

export const FILTER_SELECTOR_CATEGORY_ORDER: FilterSelectorCategory[] = [
  FILTER_SELECTOR_CATEGORIES.passes,
  FILTER_SELECTOR_CATEGORIES.bookings,
];
