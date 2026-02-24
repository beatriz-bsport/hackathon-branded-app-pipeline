export type EstablishmentBillingGroup = {
  id: number;
  name: string;
  company_id: number;
  address: string;
  disabled: boolean;
  establishments?: number[];
};

export type FetchEstablishmentBillingGroupsParams = {
  company: number;
  disabled?: boolean;
};
