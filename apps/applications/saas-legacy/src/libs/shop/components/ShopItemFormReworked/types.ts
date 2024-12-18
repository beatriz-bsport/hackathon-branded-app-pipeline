import type { SelectOption } from '#src/libs/types';

export enum ShopItemFormStep {
  PRODUCT = 'product',
  VARIANT = 'variant',
}

export type ShopItemVariantOption = { label: string; value: string };

export enum GenerateBarcodesForVariantsEnum {
  INHERIT_FROM_BASE_ITEM = 'inherit_from_base_item',
  GENERATE_NEW_BARCODES = 'generate_new_barcodes',
}

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
  tagsOnPurchase: number[];
  generateBarcodesForVariants: `${GenerateBarcodesForVariantsEnum}`;
  /**
   * In franchisor context, this field is used to spread the shop item template
   * In BO context this field is always an empty array an unused in the final payload
   * @see https://bsporttest.atlassian.net/browse/BS-3909
   */
  franchiseCompanyList: SelectOption<number>[];
};
