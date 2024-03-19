export const SHOPITEM_PER_PAGE = 10;
export const SHOP_ITEM_VARIANTS_PAGE_SIZE = 15;

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
