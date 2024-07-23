export enum ShopListTab {
  PRODUCTS = 'products',
  SETTINGS = 'settings',
}

// For the new webshop, we want to fetch both the base Items and the standalone Items
export const FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_WEBSHOP_REWORKED = {
  disabled: false,
  // This parameter allows us to bypass the backend protection to prevent fetching variants and baseItems
  is_standalone_item: null as boolean | null,
  is_variant: false,
};

// For the old webshop, we only want to fetch the standalone Items
export const FUZZY_SEARCH_BAR_PAGE_ADDITIONAL_PARAMS_OLD_WEBSHOP = {
  disabled: false,
  is_standalone_item: true,
};
