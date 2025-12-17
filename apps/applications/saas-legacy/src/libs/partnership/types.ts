import type { Establishment } from '#src/libs/establishment/types';
import React from 'react';

export enum PartnershipIdentifier {
  WELLHUB = 'wellhub',
  MYCLUBS = 'myclubs',
}

export type PartnershipDisplayConfig = {
  partnershipIdentifier: PartnershipIdentifier;
  icon: React.ReactNode;
  helperTextKey: string;
};

export type PartnershipVenue = {
  id: string;
  external_id: string;
  external_name?: string;
  establishments: Establishment[];
  // legacyObject is used to store the original object from which this PartnershipVenue was mapped
  // TODO: remove this property once wellhub is merged into the new partnership framework
  legacyObject?: unknown;
};
