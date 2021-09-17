// @flow
import { RootState } from '../../reducers';
import { Franchise, FranchiseState } from './types';

const getState = (state: RootState): FranchiseState => state.franchise;

// Franchise

export const getFranchiseId = (state: RootState): number | null => {
  if (getState(state)?.franchissor?.id) {
    return getState(state)?.franchissor?.id;
  }
  return null;
};

export const getFranchisor = (state: RootState): Franchise | null => {
  if (getState(state)?.franchissor) {
    return getState(state)?.franchissor;
  }
  return null;
};
