export type ShopItemInventoryBulkUpdateFormRow = {
  id: number;
  color?: string;
  size?: string;
  companyName?: string;
  currentStock: number;
  stockAdjustment: string;
  totalSales: number;
};

export type ShopItemInventoryBulkUpdateFormValues = {
  variants: ShopItemInventoryBulkUpdateFormRow[];
};
