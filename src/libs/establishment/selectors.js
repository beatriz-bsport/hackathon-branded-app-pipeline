// @flow

import { createSelector } from 'reselect';

import Immutable from 'seamless-immutable';
import type { State } from '../../state/types';
import type { Establishment, EstablishmentState } from './types';

export const getState = (state: State): EstablishmentState =>
  state.establishment;

export const getAllEstablishmentsDict = (state: State): Array<Establishment> =>
  getState(state).byId;

export const getAllEstablishments = createSelector(
  getAllEstablishmentsDict,
  (dict) => Immutable(Object.values(dict)),
);

export const getAllIds = (state: state): Array => getState(state).allIds;

export const getAllPageEstablishments = createSelector(
  [getAllIds, getAllEstablishmentsDict],
  (Ids, establishments) => Ids.map((id) => establishments[id]),
);

export const getEstablishment = (state: State, id: number): Establishment =>
  state.establishment.byId[id];
