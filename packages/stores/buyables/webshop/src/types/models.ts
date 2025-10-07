/**
 * Model: ShopItem
 * Serializer: ShopItemSerializer
 */
export type WebshopItem = {
  id: number;
  price: string;
  supplier_price: string;
  lowest_variant_price: string | null;
  all_variants_follow_base_price: boolean | null;
  name: string;
  subtitle: string;
  description: string;
  tva: string;
  cover: string | null;
  company: number;
  company_details: CompanyDetails;
  featured: boolean;
  subshop: number;
  marketplace_enabled: boolean;
  sell_only_on_provision: boolean;
  is_deliverable: boolean;
  barcode: string;
  disabled: boolean;
  available_payment_method_identifiers: number[];
  tags_on_purchase: number[];
  color: string;
  size: string;
  stock_keeping_unit: string;
  /** Defined for a variant. Represents the id of the source/base item from which the variant is defined */
  base_item: number | null;
  /** Whether this item is not related to any variant. Is false when it is a variant or a base for variants */
  is_standalone_item: boolean;
  supplier: number | null;
  /** Id of the Webshop Item defined at the franchise level that serves as template for company level webshop items */
  shop_item_template: number | null;
  total_sales: number;
  current_stock: number;
  number_of_variants: number;
  bookkeeping_account: number | null;
  /** Variants derived from this Webshop Item */
  variant_ids: number[];
};

interface CompanyDetails {
  id: number;
  name: string;
  is_multi_location_webshop_enabled: boolean;
}

/**
 * Model: SubShop
 * Serializer: SubShopSerializer
 */
export type WebshopCategory = {
  id: number;
  name: string;
  company: number;
  shopitems: number[];
  sub_shop_template: number | null;
};
