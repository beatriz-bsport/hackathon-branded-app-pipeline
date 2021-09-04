import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import memoize from 'memoize-one';
import { RootState } from '../../reducers';
import {
  AssociatedEstablishment,
  Establishment,
  EstablishmentState,
} from './types';

export const getState = (state: RootState): EstablishmentState =>
  state.establishment;

export const getAllEstablishmentsDict = (
  state: RootState,
): { [key: string]: Establishment } => getState(state).byId;

export const getAllEstablishments = createSelector(
  getAllEstablishmentsDict,
  (dict) => Immutable<Establishment[]>(Object.values(dict)),
);

export const getAllIds = (state: RootState): Array<number> =>
  getState(state).allIds;

export const getAllAssociatedEstablishmentGroupDict = (state: RootState) =>
  getState(state).establishmentGroup.byId;
export const getAllAssociatedEstablishmentGroupIds = (state: RootState) =>
  getState(state).establishmentGroup.allIds;
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

export const getEstablishment = (state: RootState, id: number): Establishment =>
  state.establishment.byId[id];

export const getAllAssociatedEstablishment = (state: RootState) =>
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
export const getFavoriteEstablishment = (state: RootState) =>
  state.establishment.byId[state.establishment.favorite.id];

export const getEstablishmentGroupByAddress = createSelector(
  [getAvailableEstablishmentList],
  (establishmentList) =>
    establishmentList.reduce((accumulator, establishmentItem) => {
      const temp = accumulator.findIndex(
        (group) =>
          group.address.toUpperCase() ===
          establishmentItem.location.address.toUpperCase(),
      );
      if (temp === -1) {
        accumulator.push({
          address: establishmentItem.location.address,
          establishmentList: [establishmentItem],
        });
      } else {
        accumulator[temp].establishmentList.push(establishmentItem);
      }
      return accumulator;
    }, []),
);

export const getAssociatedEstablishmentGroup = createSelector(
  [
    getAllAssociatedEstablishmentGroupIds,
    getAllAssociatedEstablishmentGroupDict,
  ],
  (idsList, associatedGroupdata) =>
    idsList.map((id) => associatedGroupdata[id]),
);

export const withEstablishment = memoize(
  (selector: (state: RootState) => any) =>
    createSelector(
      [selector, getAllEstablishmentsDict],
      (group, establishmentData) => {
        if (!group) return null;
        if (!Array.isArray(group)) {
          return {
            ...group,
            establishment: group.establishment
              .map((est: number) => establishmentData[est])
              .filter((est: AssociatedEstablishment) => !!est),
          };
        }
        return group
          .filter((g) => !!g)
          .map((g) => ({
            ...g,
            establishment: g.establishment
              .map((est: number) => establishmentData[est])
              .filter((est: AssociatedEstablishment) => !!est),
          }));
      },
    ),
);
