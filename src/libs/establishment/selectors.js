// @flow
import type { State } from '../../state/types';
import type { Establishment, EstablishmentState } from './types';

export const getState = (state: State): EstablishmentState =>
  state.establishment;

export const getAllEstablishments = (state: State): Array<Establishment> =>
  getState(state).all;

export const getEstablishment = (state: State, id: number): ?Establishment =>
  getAllEstablishments(state).find((e) => e.id === id);
