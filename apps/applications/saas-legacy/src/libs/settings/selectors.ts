import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import type { CustomShopRedirection, MobilePopup } from './types';

export const getCustomMobilePopupsLoading = (state: RootState) =>
  state.settings.customMobilePopup.loading;

export const getMobilePopupsListIds = (state: RootState) =>
  state.settings.customMobilePopup.allIds;

export const getMobilePopupsData = (state: RootState) =>
  state.settings.customMobilePopup.byId;

export const getMobilePopupsList = createSelector(
  [getMobilePopupsListIds, getMobilePopupsData],
  (
    ids: Array<string>,
    data: { [id: string]: MobilePopup },
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
