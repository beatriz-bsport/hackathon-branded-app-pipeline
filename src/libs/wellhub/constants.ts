import type { WellhubProductSelectionFormValues } from '#src/libs/wellhub/types';

export enum GymAvailabilityReasonCode {
  VALID_GYM_EXISTS = 'VALID_GYM_EXISTS',
  DISABLED_GYM_EXISTS = 'DISABLED_GYM_EXISTS',
  RECENT_INTEGRATION_REQUEST = 'RECENT_INTEGRATION_REQUEST',
  ENABLED_GYM_FROM_API = 'ENABLED_GYM_FROM_API',
  DISABLED_GYM_FROM_API = 'DISABLED_GYM_FROM_API',
  ACCESS_NOT_GRANTED = 'ACCESS_NOT_GRANTED',
}

export const GymAvailabilityReasonCodeChoices = Object.values(
  GymAvailabilityReasonCode,
);

export const WELLHUB_OFFER_DEFAULT_PAGE_SIZE = 10;

export const WELLHUB_PRODUCT_SELECTION_INITIAL_VALUES: WellhubProductSelectionFormValues =
  {
    wellhubProductId: null,
    modifyRecursively: false,
    selectedSimilarOffers: [],
  };
