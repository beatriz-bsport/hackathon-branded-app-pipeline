export type WellhubProduct = {
  product_id: number;
  name: string;
  virtual: boolean;
  updated_at: string;
};

export type ProductsByPartnershipAccountResponse = {
  products_by_partnership_account: Record<string, WellhubProduct[]>;
};

export type OfferMissingWellhubProduct = {
  id: number;
  name: string;
  date_start: string;
  duration_minute: number;
  timezone_name: string;
  is_broadcast: boolean;
  etablissement: {
    id: number;
    title: string;
  };
  coach: {
    id: number;
    name: string;
    photo?: string | null;
  } | null;
};

export type PaginatedWellhubOffersResponse = {
  results: OfferMissingWellhubProduct[];
  total_count: number;
  total_pages: number;
  current_page: number;
};

export type UpdateWellhubProductIdPayload = {
  wellhub_product_id: number;
  custom_selection_ids: number[];
};
