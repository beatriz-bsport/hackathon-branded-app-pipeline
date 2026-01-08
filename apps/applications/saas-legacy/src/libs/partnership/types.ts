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

export type PartnershipVenue = {
  id: string;
  external_id: string;
  external_name?: string;
  establishments: Establishment[];
  // Active is mandatory for actual PartnershipVenue objects, but optional here to ease the Wellhub migration to the new framework
  active?: boolean;
  activated_at?: Date; // used in combination with "active" for deactivated status: active=false and activated_at!=null means the venue was deactivated
  // legacyObject is used to store the original object from which this PartnershipVenue was mapped
  // TODO: remove this property once wellhub is merged into the new partnership framework
  legacyObject?: unknown;
};

export type PartnershipVenueFilters = {
  partnership?: number; // The partnership ID
};

export type PartnershipVenuePayload = {
  establishment_group: number[];
  partnership: number; // The partnership ID
};
