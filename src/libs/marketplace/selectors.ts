import { RootState } from '#src/reducers';

export const getMarketplaceSettings = (state: RootState) =>
  state.marketplace.settings;

export const getMarketplaceSettingsConfig = (state: RootState) =>
  state.marketplace.settings?.config ?? [];

export const getIsMarketplaceSettingsLoading = (state: RootState) =>
  state.marketplace.loading;
