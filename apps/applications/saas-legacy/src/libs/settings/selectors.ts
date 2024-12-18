import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import type { CustomMobilePopup, CustomShopRedirection } from './types';

export const getCustomMobilePopupsLoading = (state: RootState) =>
  state.settings.customMobilePopup.loading;

export const getCustomMobilePopupsListIds = (state: RootState) =>
  state.settings.customMobilePopup.allIds;

export const getCustomMobilePopupsData = (state: RootState) =>
  state.settings.customMobilePopup.byId;

export const getCustomMobilePopupsList = createSelector(
  [getCustomMobilePopupsListIds, getCustomMobilePopupsData],
  (
    ids: Array<string>,
    data: { [id: string]: CustomMobilePopup },
    // adding typing because reselect does not infer type
    // properly with heterogeneous first args
  ) => ids.map((id) => data[id]),
);

export const getCustomShopRedirectionsLoading = (state: RootState) =>
  state.settings.customShopRedirection.loading;

export const getCustomMobileRedirectionsListIds = (state: RootState) =>
  state.settings.customShopRedirection.allIds;

export const getCustomMobileRedirectionsData = (state: RootState) =>
  state.settings.customShopRedirection.byId;

export const getCustomMobileRedirectionsList = createSelector(
  [getCustomMobileRedirectionsListIds, getCustomMobileRedirectionsData],
  (
    ids: Array<string>,
    data: { [id: string]: CustomShopRedirection },
    // adding typing because reselect does not infer type
    // properly with heterogeneous first args
  ) => ids.map((id) => data[id]),
);

export const getCustomAppNavigationLoading = (state: RootState) =>
  state.settings.customAppNavigation.loading;

export const getCustomAppNavigationTabsNames = (state: RootState) =>
  state.settings.customAppNavigation.tabNames;
