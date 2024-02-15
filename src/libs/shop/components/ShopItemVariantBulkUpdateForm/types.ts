export type ShopItemVariantBulkUpdateFormRow = {
  id: number;
  cover: string;
  color: string;
  size: string;
  price: number;
  supplierPrice: number;
  stockKeepingUnit: string;
  barcode: string;
  marketplaceEnabled: boolean;
};

export type ShopItemVariantBulkUpdateFormValues = {
  variants: ShopItemVariantBulkUpdateFormRow[];
};
