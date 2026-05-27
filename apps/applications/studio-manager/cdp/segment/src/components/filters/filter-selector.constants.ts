export const FILTER_SELECTOR_CATEGORIES = {
  passes: "PASSES",
  bookings: "BOOKINGS",
  memberInformations: "MEMBER_INFORMATIONS",
  payments: "PAYMENTS",
} as const;

export type FilterSelectorCategory =
  (typeof FILTER_SELECTOR_CATEGORIES)[keyof typeof FILTER_SELECTOR_CATEGORIES];

export const FILTER_SELECTOR_CATEGORY_ORDER: FilterSelectorCategory[] = [
  FILTER_SELECTOR_CATEGORIES.memberInformations,
  FILTER_SELECTOR_CATEGORIES.passes,
  FILTER_SELECTOR_CATEGORIES.bookings,
  FILTER_SELECTOR_CATEGORIES.payments,
];
