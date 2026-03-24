import type { Establishment } from '#src/libs/establishment/types';
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
  // Active is mandatory for actual PartnershipAccount objects, but optional here to ease the Wellhub migration to the new framework
  active?: boolean;
  activated_at?: Date; // used in combination with "active" for deactivated status: active=false and activated_at!=null means the Account was deactivated
  // legacyObject is used to store the original object from which this PartnershipAccount was mapped
  // TODO: remove this property once wellhub is merged into the new partnership framework
  legacyObject?: unknown;
};

export type PartnershipAccountFilters = {
  partnership?: number; // The partnership ID
};

export type PartnershipAccountPayload = {
  establishment_group: number[];
  partnership: number; // The partnership ID
};

export type ActivePartnershipAccountForOfferParams = {
  // offer and (establishment, date_start) are mutually exclusive, but at least one of them must be provided.
  establishment?: number; // The establishment ID
  date_start?: string; // ISO date string
  offer?: number; // The offer ID
};

export type ActivePartnershipAccount = Omit<
  PartnershipAccount,
  'legacyObject' | 'external_id' | 'external_name'
> & {
  partnership: number;
  partnership_identifier: string;
};
