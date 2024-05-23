export enum ShopItemFormStep {
  PRODUCT = 'product',
  VARIANT = 'variant',
}

export type ShopItemVariantOption = { label: string; value: string };

export type ShopItemFormValues = {
  availablePaymentMethodIdentifiers: number[];
  barcode: string;
  colors?: ShopItemVariantOption[];
  cover: File | null | string;
  description: string;
  featured: boolean;
  isDeliverable: boolean;
  marketplaceEnabled: boolean;
  name: string;
  price: number;
  sellOnlyOnProvision: boolean;
  sizes?: ShopItemVariantOption[];
  stockKeepingUnit: string;
  /** In franchisor context, this field equals sub_shop_template */
  subshop?: number;
  subtitle: string;
  supplierPrice: number;
  /** In franchisor context, this field equals supplier_template */
  supplier?: number | null;
  tva: number;
  bookkeepingAccount?: number;
};
