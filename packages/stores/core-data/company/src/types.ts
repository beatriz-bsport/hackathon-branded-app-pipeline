/**
 * Serialized from company/views.py/get_feature_set
 */
export type UpsellSumup = {
  readable_identifier: string;
  upsell_identifier: number;
  is_free_trial: boolean;
  trial_remaining_days: number | null;
};

/**
 * CompanySerializer
 */
export type Company = {
  company_group: number | null;
  cover: string;
  email: string;
  hidden_from_marketplace: boolean;
  id: number;
  name: string;
  primaryRGB: [number, number, number];
  secondaryRGB: [number, number, number];
  timezone_name: string;
  websiteURL: string;
};
