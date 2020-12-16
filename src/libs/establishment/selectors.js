// @flow

import { createSelector } from 'reselect';

import Immutable from 'seamless-immutable';
import type { State } from '../../state/types.ts';
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

export const getAvailableEstablishmentList = createSelector(
  [getAllIds, getAllEstablishmentsDict],
  (Ids, establishments) =>
    Ids.map((id) => establishments[id]).filter((e) => !e.disabled),
  );

export const getDisabledEstablishmentList = createSelector(
  [getAllIds, getAllEstablishmentsDict],
  (Ids, establishments) =>
    Ids.map((id) => establishments[id]).filter((e) => e.disabled),
);

export const getEstablishment = (state: State, id: number): Establishment =>
  state.establishment.byId[id];

export const getAllAssociatedEstablishment = (state: State) =>
  state.establishment.associatedEstablishment.items;

export const getAllEstablishmentsWithAssociatedId = createSelector(
  [getAllEstablishments, getAllAssociatedEstablishment],
  (establishments, associated_establishments) =>
    establishments.map((e) => ({
      ...e,
      associated_establishment_id: (
        associated_establishments.find((ae) => ae.establishment === e.id) || {}
      ).id,
    })),
);

export const getFreshEstablishmentIds = createSelector(
  getAllEstablishments,
  (es) => es.map((e) => e.id),
);
export const getFavoriteEstablishment = (state) =>
  state.establishment.byId[state.establishment.favorite.id];
