import type { ErrorAndLoading } from '#src/libs/types';
import type { ReworkedPaginationResponse } from '#src/state/types';
import { OfferSaas } from '../offer/types';

export type WellhubState = {
  offersMissingProduct: ErrorAndLoading & {
    data: ReworkedPaginationResponse<OfferSaas>;
  };
};

export type WellhubProductId = number;

export type WellhubProduct = {
  product_id: WellhubProductId;
  name: string;
  virtual: boolean;
  updated_at: string;
};

export type WellhubProductOption = {
  label: string;
  value: WellhubProductId;
};

export type WellhubProductSelectionFormValues = {
  modifyRecursively: boolean;
  selectedSimilarOffers: number[];
  wellhubProductId: WellhubProductId | null;
};
