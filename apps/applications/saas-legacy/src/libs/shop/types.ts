import {
  ErrorAndLoading,
  PaginationFilterParams,
  WithPagination,
} from '#src/libs/types';
import { PaginatedResponse } from '#src/state/types';

export type ShopSupplierFactoryOptions = {
  /** If `true` the factory will return a {@link ShopSupplierTemplate} instance */
  isFranchise?: boolean;
};

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

export type ShopAPIFilter = PaginationFilterParams & {
  marketplace_enabled?: true;
  disabled?: boolean;
  company?: number;
  as_consumer?: true;
  featured?: boolean;
};

export type ShopItemFilterParams = ShopAPIFilter & {
  base_item?: number;
  base_shop_item_template?: number;
  color?: string;
  company__in?: number[];
  id__not_in?: number[];
  is_base_item?: boolean;
  // As long as the new webshop isn't released, the backend has a protection to prevent fetching variants
  // and baseItems, this can be bypassed by setting is_standalone_item to null
  is_standalone_item?: boolean | null;
  is_variant?: boolean;
  // This parameter allows us to fetch both the standalone Items and the variant Items
  buyable_shop_item?: boolean;
  size?: string;
  id__in?: number[];
  establishment_billing_group?: number | null;
};

export type ShopItemTemplateFilterParams = ShopItemFilterParams & {
  sub_shop_template?: number;
};

export type ShopSupplier = {
  description: string;
  id: number;
  name: string;
  supplier_template: number | null;
};

/** Represents a shop supplier at the franchise context */
export type ShopSupplierTemplate = ShopSupplier & {
  franchisor: number;
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

export type Provision = {
  product_name: string;
  qty: number;
  date: string;
  id: number;
  shop_item: number;
  manual_adjustement: boolean;
  establishment_billing_group?: number | null;
};

export type ProvisionCreate = {
  shop_item: number;
  qty: number;
  establishment_billing_group?: number | null;
};

export type ProvisionBulkCreate = ProvisionCreate[];

export type SubShop = {
  id: number;
  name: string;
  company: number;
  shopItems: ShopItem[];
  sub_shop_template?: number | null;
};

export type SubshopTemplate = {
  franchisor: number;
  id: number;
  name: string;
};

export type SubshopTemplateCreate = {
  franchisor: number;
  name: string;
};

export type SubshopTemplateUpdate = {
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

export type IsShopUsedInComboAPI = {
  id: number;
  is_used_in_payment_combo: boolean;
};

/** Represents the payload to send over the API when creating new variants from a base item */
export type ShopItemVariantAttributes = {
  colors?: string[];
  sizes?: string[];
  generate_barcodes_for_variants?: boolean;
};

/**
 * Represents an array of existing variant combinations created with a related color/size combination
 * @example
 * const variantCombinationList: ShopItemVariantCombination[] = [{ id: 1, color: '', size: 'red' }]
 */
export type ShopItemVariantCombination = {
  id: number;
  color: string;
  size: string;
};

export type ShopItem = {
  all_variants_follow_base_price: boolean | null;
  available_payment_method_identifiers: number[];
  barcode: string;
  base_item: number | null;
  color: string;
  company: number;
  company_details: {
    id: number;
    name: string;
  };
  bookkeeping_account?: number;
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
  shop_item_template: number | null;
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
  variant_ids?: number[];
};

export type ShopItemBarcodeUnicity = {
  barcode_is_unique: boolean;
};

export type ShopItemTemplate = Omit<
  ShopItem,
  'supplier' | 'subshop' | 'shop_item_template'
> & {
  franchisor: number;
  sub_shop_template: number;
  supplier_template: number | null;
  synced_companies: { id: number; name: string }[];
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
    /** State for checking a barcode unicity */
    barcodeUnicity: {
      [barcode: string]: boolean;
    } & ErrorAndLoading;
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
          variants: ShopItem[];
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
      /** State for shop item instances from a shop item template */
      itemInstance: {
        byBaseItemTemplateId: {
          [key: number]: WithPagination & {
            items: ShopItem[];
          };
        };
      } & ErrorAndLoading;
      /** State for shop item variants from a shop item template */
      itemVariant: {
        create: ErrorAndLoading;
        updateVariant: ErrorAndLoading;
        delete: ErrorAndLoading;
        byBaseItemTemplateId: {
          [key: number]: WithPagination & {
            combinationList: ShopItemVariantCombination[];
            variants: ShopItemTemplate[];
          };
        };
      } & ErrorAndLoading;
      itemDetails: {
        byId: { [key: number]: ShopItemTemplate };
        updateDetails: ErrorAndLoading;
        delete: ErrorAndLoading;
      } & ErrorAndLoading;
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
