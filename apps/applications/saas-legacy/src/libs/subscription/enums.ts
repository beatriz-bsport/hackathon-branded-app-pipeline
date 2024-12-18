import type { ContractTemplatePaginatedQueryParams } from './types';
export enum ContractAvailability {
  FOR_EVERYONE = '0',
  FOR_STAFF_ONLY = '1',
  FOR_MEMBER_ONLY = '2',
  UNAVAILABLE = '3',
}

export enum PassType {
  PASSES = '0',
  APPOINTMENT_PASSES = '1',
}

export enum ContractTemplateFilterOpenMenu {
  NONE = '0',
  PRODUCT_TYPE = '1',
  ASSOCIATED_PASSES = '2',
  CONTRACT_AVAIALABILITY = '3',
  COMPANIES = '4',
}
export enum SubscriptionInvoicingType {
  SAME_DAY_AS_SUBSCRIPTION = 'same_day_as_subscription',
  FIXED_DAY = 'fixed_day',
}

export const PassTypeMapper: {
  [key in PassType]: boolean;
} = {
  [PassType.PASSES]: false,
  [PassType.APPOINTMENT_PASSES]: true,
};

export const ContractAvailabilityMapper: {
  [key in ContractAvailability]: ContractTemplatePaginatedQueryParams;
} = {
  [ContractAvailability.FOR_EVERYONE]: {
    manager_only: false,
    is_usable_by_staff: true,
  },
  [ContractAvailability.FOR_STAFF_ONLY]: {
    manager_only: true,
    is_usable_by_staff: true,
  },
  [ContractAvailability.FOR_MEMBER_ONLY]: {
    manager_only: false,
    is_usable_by_staff: false,
  },
  [ContractAvailability.UNAVAILABLE]: {
    manager_only: true,
    is_usable_by_staff: false,
  },
};
