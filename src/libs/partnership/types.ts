// @flow

export type PartnershipCompany = {
  id: number;
  identifier: string;
  associated_establishment_ids: Array<number>;
  company: number;
  date_created: number;
  partnership: number;
};

export type PartnershipEstablishmentMerge = {
  id: number;
  partnership_company: number;
  reference_establishment: number;
};

export type PartnershipState = {
  byId: { [identifier: string]: PartnershipCompany };
  allIds: Array<number>;
  loading: boolean;
  error: Error | null;
  createOrUpdate: {
    loading: boolean;
    error: Error | null;
  };
  partnershipEstablishmentMerge: {
    items: Array<PartnershipEstablishmentMerge>;
    loading: boolean;
    error: Error | null;
  };
};
