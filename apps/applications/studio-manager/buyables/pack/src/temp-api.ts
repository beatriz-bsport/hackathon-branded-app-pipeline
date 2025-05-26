/**
 * The content of this file is temporary.
 * It will be replaced by the store package, developed in other PRs.
 */

type PackItem = {
  id: number;
  name: string;
  price: string;
  quantity: number;
  tax: string;
};

export type Pack = {
  id: number;
  name: string;
  price: string;
  manager_only: boolean;
  available: boolean;
  date_created: string;
  expiration_date: string | null | undefined;
  payment_packs: Array<PackItem>;
  shop_items: Array<PackItem>;
  private_passes: Array<PackItem>;
  is_usable_by_staff: boolean;
};
