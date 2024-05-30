export const SHOPITEM_PER_PAGE = 10;
export const SHOP_ITEM_VARIANTS_PAGE_SIZE = 15;
export const SHOP_SUPPLIER_PAGE_SIZE = 15;
export const SHOP_ITEM_TEMPLATE_PAGE_SIZE = 15;
/** Temporary param for Retail MVP */
export const FRANCHISE_SUBSHOP_TEMPLATE_PAGE_SIZE = 50;

/**
 * Mapper param given to function mapFormDataWithObject\
 * Each key present here will be in the final FormData payload.
 * @see `mapFormDataWithObject()`
 */
export const SHOPITEM_FORMDATA_KEYS_MAPPER = {
  'available_payment_method_identifiers[]':
    'available_payment_method_identifiers[]',
  barcode: 'barcode',
  stock_keeping_unit: 'stock_keeping_unit',
  cover: 'cover',
  description: 'description',
  featured: 'featured',
  is_deliverable: 'is_deliverable',
  marketplace_enabled: 'marketplace_enabled',
  name: 'name',
  price: 'price',
  sell_only_on_provision: 'sell_only_on_provision',
  subshop: 'subshop',
  subtitle: 'subtitle',
  supplier: 'supplier',
  supplier_price: 'supplier_price',
  tva: 'tva',
  variants: 'variants',
  bookkeeping_account: 'bookkeeping_account',
};

export const SHOPITEM_TEMPLATE_FORMDATA_KEYS_MAPPER = {
  ...SHOPITEM_FORMDATA_KEYS_MAPPER,
  sub_shop_template: 'sub_shop_template',
  supplier_template: 'supplier_template',
};

/**
 * The associated form to display in inventory tab from the shop item type (details page)
 * @enum `STANDALONE` A form with only one row to for stock adjustment
 * @enum `VARIANTS` A form with multiple rows for bulk stock adjustment
 */
export enum ShopItemDetailInventoryFormType {
  STANDALONE = 'standalone',
  VARIANTS = 'variants',
}

export const SHOP_TABLE_ERROR_CONTAINER_HEIGHT = 36;
export const SHOP_VARIANT_BULK_UPDATE_FORM_COVER_CHIP_MAX_WIDTH = 95;
