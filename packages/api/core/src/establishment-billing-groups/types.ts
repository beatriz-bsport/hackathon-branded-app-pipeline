export type EstablishmentBillingGroup = {
  id: number;
  name: string;
  company_id: number;
  address: string;
  disabled: boolean;
  establishments?: number[];
};

export type FetchEstablishmentBillingGroupsParams = {
  page?: number;
  page_size?: number;
  company: number;
  disabled?: boolean;
};
