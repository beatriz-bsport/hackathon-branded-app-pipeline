export type Company = {
  id: number;
  name: string;
  email: string;
  websiteURL: string;
  cover: string;
};

export type CompanyWithTheme = Company & {
  primaryRGB: [number, number, number];
  secondaryRGB: [number, number, number];
};

export type CompanySetup = {
  id: number;
  name: string;
  email: string;
  representative_first_name: string;
  representative_last_name: string;
  payout_schedule: string;
  address: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
  currency: string;
  business_name: string;
  business_tax_id: string;
  owner_address: string;
  owner_city: string;
  owner_postal_code: string;
  owner_state: string;
  owner_country: string;
  iban: string;
  bank_account_holder: string;
  external_account_last4: string;
  bank_account_entity_type: string;
};

type UpsellSumup = { upsell_identifier: number; readable_identifier: number };

export type CompanyState = {
  byId: {
    [id: number]: Company;
  };
  feature: {
    data: {
      upsell: UpsellSumup[];
    };
    loading: boolean;
    error: Error | null;
  };
  search: {
    loading: boolean;
    error: Error | null;
    allIds: Array<number>;
  };
  setup: CompanySetup | null;
};
