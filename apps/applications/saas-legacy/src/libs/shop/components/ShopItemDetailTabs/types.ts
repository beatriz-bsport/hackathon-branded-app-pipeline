export type ShopItemVariantsTableRow = {
  id: number;
  image: string;
  colorAndSize: string;
  price: string;
  supplierPrice: string;
  sku: string;
  barcode: string;
  availableOnline: boolean;
};

export type ShopItemHistoryTableRow = {
  id: number;
  date: string;
  variant: string;
  studio: string;
  updateType: string;
  quantity: number;
  invoiceURL: string;
};
