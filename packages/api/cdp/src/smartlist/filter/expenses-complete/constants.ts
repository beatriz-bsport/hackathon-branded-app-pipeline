export const EXPENSES_COMPLETE_FILTER_IDENTIFIER = "24";

/**
 * Buyable item identifiers for the purchase history (`expenses_complete`) filter.
 * Single source of truth for segment UI and API payloads.
 */
export const EXPENSES_COMPLETE_BUYABLE = {
  PAYMENT_PACK: 1,
  SHOP_ITEM: 2,
  PRIVATE_PASS: 9,
  PAYMENT_COMBO: 10,
  WORKSHOP: 50,
} as const;

export type ExpensesCompleteBuyableId =
  (typeof EXPENSES_COMPLETE_BUYABLE)[keyof typeof EXPENSES_COMPLETE_BUYABLE];

/** All selectable product types (backend "all products" semantics when payload is `[]`). */
export const ALL_EXPENSES_COMPLETE_BUYABLE_IDS: readonly ExpensesCompleteBuyableId[] =
  [
    EXPENSES_COMPLETE_BUYABLE.PAYMENT_PACK,
    EXPENSES_COMPLETE_BUYABLE.SHOP_ITEM,
    EXPENSES_COMPLETE_BUYABLE.PRIVATE_PASS,
    EXPENSES_COMPLETE_BUYABLE.PAYMENT_COMBO,
    EXPENSES_COMPLETE_BUYABLE.WORKSHOP,
  ];

/**
 * Display order for the spent-on product picker in Studio Manager.
 */
export const EXPENSES_COMPLETE_BUYABLE_DISPLAY_ORDER: readonly ExpensesCompleteBuyableId[] =
  [
    EXPENSES_COMPLETE_BUYABLE.PAYMENT_PACK,
    EXPENSES_COMPLETE_BUYABLE.PRIVATE_PASS,
    EXPENSES_COMPLETE_BUYABLE.SHOP_ITEM,
    EXPENSES_COMPLETE_BUYABLE.PAYMENT_COMBO,
    EXPENSES_COMPLETE_BUYABLE.WORKSHOP,
  ];
