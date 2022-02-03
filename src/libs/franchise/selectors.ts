// @flow
import { createSelector } from 'reselect';
import { RootState } from '../../reducers';
import { FranchiseState } from './types';

const getState = (state: RootState): FranchiseState => state.franchise;

// Franchise

export const getFranchiseId = (state: RootState) => {
  if (getState(state)?.franchisor?.id) {
    return getState(state)?.franchisor?.id;
  }
  return null;
};

export const getFranchisor = (state: RootState) => {
  if (getState(state)?.franchisor) {
    return getState(state)?.franchisor;
  }
  return null;
};

export const getFranchiseTheme = (state: RootState) => {
  if (getState(state)?.franchisor) {
    return {
      cover: getState(state)?.franchisor.cover,
      primaryRGB: getState(state)?.franchisor.primaryRGB,
      secondaryRGB: getState(state)?.franchisor.secondaryRGB,
    };
  }
  return null;
};

export const getFranchiseThemeLoading = (state: RootState) => {
  if (getState(state)?.franchisor) {
    return getState(state).loading.loading;
  }
  return null;
};

// Users

export const getFranchiseUserPage = (state: RootState) => {
  if (getState(state).users?.page) {
    return getState(state).users?.page;
  }
  return null;
};

export const getFranchiseUserCount = (state: RootState) => {
  if (getState(state).users?.count) {
    return getState(state).users?.count;
  }
  return null;
};

export const getFranchiseUsers = (state: RootState) => {
  if (getState(state).users?.allIds) {
    const byId = getState(state).users?.byId ?? {};
    return getState(state).users?.allIds.map((id) => byId[id]);
  }
  return [];
};

export const getFranchiseUserById = (state: RootState, userId: number) => {
  return getState(state).users?.byId?.[userId];
};

export const getFranchiseIsLoading = (state: RootState) => {
  return getState(state).loading;
};

// Companies
export const getFranchiseCompanyById = (state: RootState) => {
  if (getState(state).companies?.byId) {
    return getState(state).companies?.byId ?? null;
  }
  return null;
};

export const getFranchiseCompanies = (state: RootState) => {
  if (getState(state).companies?.allIds) {
    return getState(state).companies?.allIds.map(
      (id) => getState(state)?.companies?.byId[id],
    );
  }
  return null;
};

export const _getCompanyGroupById = (state: RootState) =>
  getState(state).companyGroup.byId;

export const _getCompanyGroupAllIds = (state: RootState) =>
  getState(state).companyGroup.allIds;

export const getCompanyGroupList = createSelector(
  [_getCompanyGroupAllIds, _getCompanyGroupById],
  (ids, data) => ids.map((id) => data[id]),
);
