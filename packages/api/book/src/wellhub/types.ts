export type WellhubProduct = {
  product_id: number;
  name: string;
  virtual: boolean;
  updated_at: string;
};

export type ProductsByWellhubGymUuid = {
  [uuid: string]: WellhubProduct[];
};

export type FetchWellhubProductsResponse = {
  products_by_wellhub_gym: ProductsByWellhubGymUuid;
};
