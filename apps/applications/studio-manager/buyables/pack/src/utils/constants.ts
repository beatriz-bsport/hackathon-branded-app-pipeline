export const ITEM_VARIANTS = {
  pass: "pass",
  appointmentPass: "appointmentPass",
  webshopItem: "webshopItem",
} as const;

export type ItemVariant = keyof typeof ITEM_VARIANTS;

export type Category = {
  id: number;
  name: string;
  category_ordering?: number;
};
