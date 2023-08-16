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
  shopitems: Array<ShopItem>;
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
  id: number;
  name: string;
  subtitle: string;
  description: string;
  tva: number;
  price: number;
  cover: string;
  company: number;
  unlimited_provisions: boolean;
  subshop: number;
  marketplace_enabled: boolean;
  is_deliverable: boolean;
  available_payment_method_identifiers: number[];
  current_stock?: number;
  disabled: boolean;
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

export type ShopItemCreate = Omit<ShopItem, 'id'>;

export type ProvisionCreate = Omit<Provision, 'id'>;

export type ShopItemFactoryOptions = {
  isUnlimitedProvisions?: boolean;
  isMarketplaceEnabled?: boolean;
  isDeliverable?: boolean;
  isDisabled?: boolean;
};
