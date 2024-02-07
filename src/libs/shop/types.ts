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
  shopItems: Array<ShopItem>;
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
  subshop?: number;
  subtitle?: string;
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

export type ShopItemFactoryOptions = {
  isStandaloneItem?: boolean;
  isUnlimitedProvisions?: boolean;
  isMarketplaceEnabled?: boolean;
  isDeliverable?: boolean;
  isDisabled?: boolean;
};
