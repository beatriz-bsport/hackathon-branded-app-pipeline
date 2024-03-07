import { ErrorAndLoading, WithPagination } from '#libs/types';

export type Provision = {
  product_name: string;
  qty: number;
  date: string;
  id: number;
  shop_item: number;
  manual_adjustement: boolean;
};

export type SubShop = {
  id: number;
  name: string;
  company: number;
  shopItems: ShopItem[];
};

export type SubShopAPI = {
  id: number;
  name: string;
  company: number;
  shopitems: Array<number>;
};

export type AxiosSubShopAPI = { data: SubShopAPI };

export type IsShopUsedInComboAPI = {
  id: number;
  is_used_in_payment_combo: boolean;
};

export type ShopItem = {
  available_payment_method_identifiers: number[];
  barcode: string;
  color: string;
  company: number;
  cover: string | null;
  current_stock?: number;
  description: string;
  disabled: boolean;
  featured: boolean;
  id: number;
  is_deliverable: boolean;
  is_standalone_item: boolean;
  lowest_variant_price: number | null;
  marketplace_enabled: boolean;
  name: string;
  price: string;
  sell_only_on_provision: boolean;
  size: string;
  stock_keeping_unit: string;
  subshop: number;
  subtitle: string;
  supplier_price: string;
  supplier: number | null;
  tags_on_purchase: number[];
  total_sales?: number;
  tva: string;
  unlimited_provisions?: boolean;
};

/** Represents a variant related to a base shop item */
export type ShopItemVariant = ShopItem & {
  base_item: number;
};

export type ShopItemVariantFilterParams = {
  base_item_id: number;
  page_size: number;
  page: number;
};

export type ShopItemCreate = {
  'available_payment_method_identifiers[]': string;
  barcode: string;
  cover?: File;
  description?: string;
  featured: boolean;
  is_deliverable: boolean;
  marketplace_enabled: boolean;
  name: string;
  price: number;
  sell_only_on_provision: boolean;
  stock_keeping_unit?: string;
  subshop?: number;
  subtitle?: string;
  supplier?: number;
  supplier_price?: string;
  tva: string;
};

export type ShopItemEdit = Partial<ShopItemCreate>;

export type ShopSupplier = {
  company: number;
  created_at: string;
  description: string;
  disabled_at: string;
  disabled: boolean;
  id: number;
  name: string;
  updated_at: string;
};

export type ShopState = {
  subShops: Array<SubShopAPI>;
  shopItem: {
    byId: { [key: number]: ShopItem };
    asManager: {
      loading: boolean;
      error?: Error;
      allIds: Array<number>;
    };
    featured: {
      loading: boolean;
      error?: Error;
      allIds: Array<number>;
    };
    asConsumer: {
      loading: boolean;
      error?: Error;
      allIds: Array<number>;
    };
    bulk: {
      allIds: Array<number>;
      loading: boolean;
      error?: Error;
    };
    combo: {
      archivationWarning: { [id: number]: { used_in_combo: boolean } };
      loading: boolean;
      error: Error | null;
    };
  };
  provision: {
    items: Array<Provision>;
    loading: boolean;
    count: number;
    page: number;
  };
} & ErrorAndLoading;

export type ShopStateReworked = {
  shopItemReworked: {
    duplicate: ErrorAndLoading;
    /** State for shop item details - only base/standalone items here */
    itemDetails: {
      byId: {
        [key: number]: {
          item: ShopItem;
          isUsedInCombo: boolean;
        };
      };
      updateDetails: ErrorAndLoading;
      delete: ErrorAndLoading;
    } & ErrorAndLoading;
    /** State for shop item suppliers */
    suppliers: {
      byId: {
        [key: number]: ShopSupplier;
      };
    } & ErrorAndLoading;
    /** State for variants created from a base `ShopItem` */
    itemVariant: {
      create: ErrorAndLoading;
      updateVariant: ErrorAndLoading;
      delete: ErrorAndLoading;
      byBaseItemId: {
        [key: number]: WithPagination & { variants: ShopItemVariant[] };
      };
      allIds: number[];
    } & ErrorAndLoading;
    /** State for base items that can have variants */
    itemBase: {
      create: ErrorAndLoading;
      byId: { [key: number]: ShopItem };
      allIds: number[];
    } & ErrorAndLoading;
    /** State for items that have no variants */
    itemStandalone: {
      byId: { [key: number]: ShopItem };
      allIds: number[];
    } & ErrorAndLoading;
    /** State for subshops */
    subshop: {
      byId: { [key: number]: SubShop };
      allIds: number[];
      create: ErrorAndLoading;
      updateSubshop: ErrorAndLoading;
      delete: ErrorAndLoading;
    } & ErrorAndLoading;
  };
};

export type ShopAPIFilter = {
  marketplace_enabled?: true;
  disabled?: false;
  company?: number;
  as_consumer?: true;
  featured?: boolean;
  page?: number;
  page_size?: number;
};

export type ProvisionCreate = Omit<Provision, 'id'>;

export type ProvisionBulkCreate = { shop_item: number; qty: number }[];

export type ShopItemFactoryOptions = {
  isStandaloneItem?: boolean;
  isUnlimitedProvisions?: boolean;
  isMarketplaceEnabled?: boolean;
  isDeliverable?: boolean;
  isDisabled?: boolean;
};

export type ShopItemListFilterParams = ShopAPIFilter & {
  exclude_variants?: boolean;
  exclude_standalone_items?: boolean;
  exclude_base_items?: boolean;
};

/** Represents all attributes you can create variants from */
export type ShopItemVariantAttributes = {
  colors?: string[];
  sizes?: string[];
};
