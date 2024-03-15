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
  subshop?: number;
  subtitle: string;
  supplierPrice: number;
  supplier?: number | null;
  tva: number;
};
