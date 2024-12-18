export type ShopItemTemplateInventoryBulkUpdateFormRow = {
  id: number;
  color?: string;
  size?: string;
  companyName: string;
  currentStock: number;
  stockAdjustment: string;
  totalSales: number;
};

export type ShopItemTemplateInventoryBulkUpdateFormValues = {
  instances: ShopItemTemplateInventoryBulkUpdateFormRow[];
};
