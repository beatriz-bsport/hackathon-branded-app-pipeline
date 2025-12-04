import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import type { SettingsState, CustomAppNavigationTabsNames } from './types';
import {
  fetchCustomShopRedirectionsActions,
  createCustomShopRedirectionActions,
  editCustomShopRedirectionActions,
  deleteCustomShopRedirectionActions,
  fetchMobilePopupsActions,
  createCustomMobilePopupActions,
  editCustomMobilePopupActions,
  deleteCustomMobilePopupActions,
  fetchCustomNavigationTabsNamesActions,
} from './actions';

const initialState: Immutable.Immutable<SettingsState> =
  Immutable<SettingsState>({
    customShopRedirection: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
    customMobilePopup: {
      byId: {},
      allIds: [],
      loading: false,
      error: null,
    },
    customAppNavigation: {
      tabNames: {
        bookings: null,
        schedule: null,
        activities: null,
        studio: null,
        profile: null,
      },
      loading: false,
      error: null,
    },
  });

export default handleActions<Immutable.Immutable<SettingsState>>(
  {
    [fetchCustomShopRedirectionsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customShopRedirection', 'loading'], payload),
    [fetchCustomShopRedirectionsActions.error.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customShopRedirection', 'error'], payload),
    [fetchCustomShopRedirectionsActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) =>
      state
        .setIn(
          ['customShopRedirection', 'allIds'],
          // @ts-expect-error
          payload.map((p) => p.id),
        )
        .merge(
          {
            customShopRedirection: {
              // @ts-expect-error
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        ),
    [createCustomShopRedirectionActions.isLoading.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customShopRedirection', 'loading'], payload),
    [createCustomShopRedirectionActions.error.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customShopRedirection', 'error'], payload),
    [createCustomShopRedirectionActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) =>
      state
        .setIn(
          ['customShopRedirection', 'allIds'],
          [...state.customShopRedirection.allIds, payload.id],
        )
        .merge(
          {
            customShopRedirection: {
              byId: {
                [payload.id]: {
                  ...payload,
                },
              },
            },
          },
          { deep: true },
        ),
    [editCustomShopRedirectionActions.isLoading.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customShopRedirection', 'loading'], payload),
    [editCustomShopRedirectionActions.error.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customShopRedirection', 'error'], payload),
    [deleteCustomShopRedirectionActions.isLoading.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customShopRedirection', 'loading'], payload),

    [deleteCustomShopRedirectionActions.error.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customShopRedirection', 'error'], payload),
    [deleteCustomShopRedirectionActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) =>
      state.setIn(
        ['customShopRedirection', 'allIds'],
        [...state.customShopRedirection.allIds.filter((p) => p !== payload)],
      ),
    [fetchMobilePopupsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customMobilePopup', 'loading'], payload),
    [fetchMobilePopupsActions.error.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customMobilePopup', 'error'], payload),
    [fetchMobilePopupsActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) =>
      state
        .setIn(
          ['customMobilePopup', 'allIds'],
          // @ts-expect-error
          payload.map((p) => p.custom_popup_id),
        )
        .merge(
          {
            customMobilePopup: {
              // @ts-expect-error
              byId: payload.reduce((acc, ps) => {
                acc[ps.custom_popup_id] = {
                  ...ps,
                  id: ps.custom_popup_id,
                };
                return acc;
              }, {}),
            },
          },
          { deep: true },
        ),
    [createCustomMobilePopupActions.isLoading.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customMobilePopup', 'loading'], payload),
    [createCustomMobilePopupActions.error.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customMobilePopup', 'error'], payload),
    [createCustomMobilePopupActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) =>
      state
        .setIn(
          ['customMobilePopup', 'allIds'],
          [...state.customMobilePopup.allIds, payload.id],
        )
        .merge(
          {
            customMobilePopup: {
              byId: {
                [payload.id]: {
                  ...payload,
                },
              },
            },
          },
          { deep: true },
        ),
    [editCustomMobilePopupActions.isLoading.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customMobilePopup', 'loading'], payload),
    [editCustomMobilePopupActions.error.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customMobilePopup', 'error'], payload),
    [deleteCustomMobilePopupActions.isLoading.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customMobilePopup', 'loading'], payload),
    [deleteCustomMobilePopupActions.error.toString()]: (
      state,
      { payload }: { payload: any },
    ) => state.setIn(['customMobilePopup', 'error'], payload),
    [deleteCustomMobilePopupActions.success.toString()]: (
      state,
      { payload }: { payload: any },
    ) =>
      state.setIn(
        ['customMobilePopup', 'allIds'],
        [...state.customMobilePopup.allIds.filter((p) => p !== payload)],
      ),
    [fetchCustomNavigationTabsNamesActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => state.setIn(['customAppNavigation', 'loading'], payload),
    [fetchCustomNavigationTabsNamesActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => state.setIn(['customAppNavigation', 'error'], payload),
    [fetchCustomNavigationTabsNamesActions.success.toString()]: (
      state,
      { payload }: { payload: CustomAppNavigationTabsNames },
    ) => state.setIn(['customAppNavigation', 'tabNames'], payload),
  },
  initialState,
);
