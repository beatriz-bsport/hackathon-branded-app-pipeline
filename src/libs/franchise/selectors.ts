// @flow
import { RootState } from '../../reducers';
import {
  FranchiseCompany,
  FranchiseState,
  FranchiseTheme,
  FranchiseUser,
} from './types';

const getState = (state: RootState): FranchiseState => state.franchise;

// Franchise

export const getFranchiseId = (state: RootState): number | null => {
  if (getState(state).id) {
    return getState(state).id;
  }
  return null;
};

export const getFranchiseName = (state: RootState): string | null => {
  if (getState(state).name) {
    return getState(state).name;
  }
  return null;
};

export const getFranchiseTheme = (state: RootState): FranchiseTheme => {
  if (getState(state)?.theme) {
    return getState(state)?.theme;
  }
  return null;
};
