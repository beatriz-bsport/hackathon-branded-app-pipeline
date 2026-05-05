import type { RootState } from '#src/reducers';

export const getOffersMissingWellhubProductLoading = (state: RootState) =>
  state.wellhub.offersMissingProduct.loading;

export const getOffersMissingWellhubProductPaginatedData = (state: RootState) =>
  state.wellhub.offersMissingProduct.data;
