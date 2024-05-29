import {
  ErrorAndLoading,
  PaginationFilterParams,
  WithPagination,
} from '#libs/types';
import { PaginatedResponse } from '#state/types';
import { ShopItemDetailTab } from './components/ShopItemDetail/constants';

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

export type SubshopTemplate = {
  franchisor: number;
  id: number;
  name: string;
};

export type SubshopTemplateCreate = {
  company_ids: number[];
  franchisor: number;
  name: string;
};

export type SubshopTemplateUpdate = {
  company_ids: number[];
  franchisor?: number;
  id: number;
  name?: string;
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
  all_variants_follow_base_price: boolean | null;
  barcode: string;
  color: string;
  company: number;
  company_details: {
    id: number;
    name: string;
  };
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
  number_of_variants: number;
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
  bookkeeping_account?: number;
};

export type ShopItemTemplate = ShopItem & {
  franchisor: number;
  sub_shop_template: number;
  supplier_template: number | null;
};

export type ShopItemTemplateFilterParams = PaginationFilterParams & {
  sub_shop_template: number;
};

/** Represents a variant related to a base shop item */
export type ShopItemVariant = ShopItem & {
  base_item: number;
};

export type ShopItemVariantFilterParams = PaginationFilterParams & {
  base_item_id: number;
  color?: string;
  size?: string;
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
  description: string;
  id: number;
  name: string;
};

export type ShopSupplierTemplate = ShopSupplier & {
  franchisor: number;
};

export type ShopSupplierFactoryOptions = {
  /** If `true` the factory will return a {@link ShopSupplierTemplate} instance */
  isFranchise?: boolean;
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
        [key: number]: ShopItem;
      };
      updateDetails: ErrorAndLoading;
      delete: ErrorAndLoading;
    } & ErrorAndLoading;
    /** State for shop suppliers */
    suppliers: {
      byId: {
        [key: number]: ShopSupplier;
      };
      allIds: number[];
      create: ErrorAndLoading;
      updateSupplier: ErrorAndLoading;
      delete: ErrorAndLoading;
    } & WithPagination &
      ErrorAndLoading;
    /** State for variants created from a base `ShopItem` */
    itemVariant: {
      create: ErrorAndLoading;
      updateVariant: ErrorAndLoading;
      delete: ErrorAndLoading;
      byBaseItemId: {
        [key: number]: WithPagination & {
          combinationList: ShopItemVariantCombination[];
          variants: ShopItemVariant[];
        };
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
    /** State for combo warnings per shop item ID  */
    usedInCombo: {
      byId: { [key: number]: boolean };
    } & ErrorAndLoading;
  };
  /* Franchisor shop state */
  shopTemplates: {
    subshopTemplate: {
      byId: {
        [key: number]: SubshopTemplate;
      };
      allIds: number[];
      create: ErrorAndLoading;
      updateSubshopTemplate: ErrorAndLoading;
      delete: ErrorAndLoading;
    } & WithPagination &
      ErrorAndLoading;
    shopItemTemplate: {
      bySubshopTemplateId: {
        [key: number]: ErrorAndLoading & PaginatedResponse<ShopItemTemplate>;
      };
      create: ErrorAndLoading;
      updateShopItemTemplate: ErrorAndLoading;
      delete: ErrorAndLoading;
    };
    supplierTemplate: {
      byId: {
        [key: number]: ShopSupplierTemplate;
      };
      allIds: number[];
      create: ErrorAndLoading;
      updateSupplierTemplate: ErrorAndLoading;
      delete: ErrorAndLoading;
    } & WithPagination &
      ErrorAndLoading;
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

export type ProvisionCreate = { shop_item: number; qty: number };

export type ProvisionBulkCreate = ProvisionCreate[];

export type ShopItemFactoryOptions = {
  isStandaloneItem?: boolean;
  isUnlimitedProvisions?: boolean;
  isMarketplaceEnabled?: boolean;
  isDeliverable?: boolean;
  isDisabled?: boolean;
  allVariantsFollowBasePrice?: boolean;
  /** If `true` the factory will return a {@link ShopItemTemplate} instance */
  isFranchise?: boolean;
};

export type SubshopFactoryOptions = {
  /** If `true` the factory will return a {@link SubshopTemplate} instance */
  isFranchise?: boolean;
};

export type ShopItemListFilterParams = ShopAPIFilter & {
  is_variant?: boolean;
  is_base_item?: boolean;
  is_standalone_item?: boolean;
};

/** Represents all attributes you can create variants from */
export type ShopItemVariantAttributes = {
  colors?: string[];
  sizes?: string[];
};

/** Represents the payload sent when creating a supplier */
export type ShopSupplierCreate = {
  name: string;
  description?: string;
};

/** Represents the payload sent when creating a supplier template */
export type ShopSupplierTemplateCreate = ShopSupplierCreate & {
  franchisor: number;
};

/** Represents the payload sent when updating a supplier */
export type ShopSupplierUpdate = {
  id: number;
  name: string;
  description?: string;
};

/** An available/selectable tab from the table in shop item details */
export type TabListOption = {
  label: string;
  value: ShopItemDetailTab;
};

/** Represents an existing variant created with associated color/size combination */
export type ShopItemVariantCombination = {
  id: number;
  color: string;
  size: string;
};
