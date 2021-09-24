// @flow
import { RootState } from '../../reducers';
import { FranchiseState } from './types';

const getState = (state: RootState): FranchiseState => state.franchise;

// Franchise

export const getFranchiseId = (state: RootState) => {
  if (getState(state)?.franchissor?.id) {
    return getState(state)?.franchissor?.id;
  }
  return null;
};

export const getFranchisor = (state: RootState) => {
  if (getState(state)?.franchissor) {
    return getState(state)?.franchissor;
  }
  return null;
};

export const getFranchiseTheme = (state: RootState) => {
  if (getState(state)?.franchissor) {
    return {
      cover: getState(state)?.franchissor.cover,
      primaryRGB: getState(state)?.franchissor.primaryRGB,
      secondaryRGB: getState(state)?.franchissor.secondaryRGB,
    };
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
