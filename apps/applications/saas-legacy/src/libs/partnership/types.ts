import type { Establishment } from '#src/libs/establishment/types';
import type { WellhubProduct } from '#src/libs/wellhub/types';
import React from 'react';

export enum PartnershipIdentifier {
  WELLHUB = 'wellhub',
  MYCLUBS = 'myclubs',
}

export type PartnershipDisplayConfig = {
  partnershipIdentifier: PartnershipIdentifier;
  icon: React.ReactNode;
  helperTextKey?: string;
  showCopyIdToClipboard?: boolean;
};

export type PartnershipAccount = {
  id: string;
  external_id: string;
  external_name?: string;
  establishments: Establishment[];
  active: boolean;
  activated_at: string | null; // used in combination with "active" for deactivated status: active=false and activated_at!=null means the Account was deactivated
};

export type PartnershipAccountFilters = {
  partnership?: number; // The partnership ID
};

export type PartnershipAccountPayload = {
  establishment_group: number[];
  partnership: number; // The partnership ID
  external_id?: string;
};

export type ValidateExternalIdParams = {
  external_id: string;
  partnership: number;
};

export type ValidateExternalIdResponse = {
  is_valid: boolean;
  error?: string;
  error_code?: string;
};

type ActivePartnershipAccountByOfferParams = {
  offer: number;
  establishment?: never;
  date_start?: never;
};

type ActivePartnershipAccountByDateParams = {
  establishment: number;
  date_start: string; // ISO date string
  offer?: never;
};

export type ActivePartnershipAccountForOfferParams =
  | ActivePartnershipAccountByOfferParams
  | ActivePartnershipAccountByDateParams;

export type ActivePartnershipAccount = Omit<
  PartnershipAccount,
  'external_id' | 'external_name'
> & {
  partnership: number;
  partnership_identifier: string;
};

export type ProductsByPartnershipAccountResponse = {
  products_by_partnership_account: {
    [partnershipAccountExternalId: string]: WellhubProduct[];
  };
};
