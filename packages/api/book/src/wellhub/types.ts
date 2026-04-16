export type WellhubProduct = {
  product_id: number;
  name: string;
  virtual: boolean;
  updated_at: string;
};

export type ProductsByPartnershipAccountResponse = {
  products_by_partnership_account: Record<string, WellhubProduct[]>;
};
