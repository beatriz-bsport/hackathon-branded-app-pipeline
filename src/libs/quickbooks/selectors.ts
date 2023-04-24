// @ts-nocheck
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import { RootState } from '../../reducers';

export const getQuickbooksApp = (state: RootState) => state.quickbooks.detail;

export const getTaxAgencies = (state: RootState) =>
  state.quickbooks.taxAgencies.byId;

export const getTaxAgenciesList = createSelector(
  [getTaxAgencies],
  (taxAgenciesData) =>
    Immutable(
      Object.keys(taxAgenciesData).map((_id: string) => taxAgenciesData[_id]),
    ),
);

export const getTaxCodes = (state: RootState) => state.quickbooks.taxCodes.byId;

export const getTaxCodesList = createSelector([getTaxCodes], (tagCodesData) =>
  Immutable(Object.keys(tagCodesData).map((_id: string) => tagCodesData[_id])),
);
