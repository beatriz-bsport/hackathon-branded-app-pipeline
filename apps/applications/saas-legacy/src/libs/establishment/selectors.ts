import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import memoize from 'memoize-one';
import { withBookingNotification } from '#src/libs/marketing/selectors';
import { getMemberDetail } from '#src/libs/member/selectors';
import { RootState } from '../../reducers';
import { getStaffEstablishmentBillingGroup } from '../role/utils';
import type { UserRole } from '../role/types';
import {
  AssociatedEstablishment,
  Establishment,
  EstablishmentGroup,
  EstablishmentState,
} from './types';

export const getEstablishmentLoading = (state: RootState) =>
  state.establishment.loading;

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

export const getAllEstablishmentBillingGroupDict = (state: RootState) =>
  getState(state).establishmentBillingGroup.byId;

export const getAllEstablishmentBillingGroupIds = (state: RootState) =>
  getState(state).establishmentBillingGroup.allIds;

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

export const getEstablishmentWithAssociatedId = createSelector(
  [getEstablishment, getAllAssociatedEstablishment],
  (establishment, associatedEstablishments) => {
    if (!establishment) return null;
    return {
      ...establishment,
      associated_establishment_id: (
        associatedEstablishments.find(
          (ae) => ae.establishment === establishment?.id,
        ) || {}
      ).id,
    };
  },
);

export const getEstablishmentById = (state: RootState) => (id: number) =>
  state.establishment.byId[id];

export const retrieveEstablishmentGroup = (
  state: RootState,
  id: number,
  // @ts-expect-error
): EstablishmentGroup => state.establishment.establishmentGroup.byId[id];

const getEstablishmentGroupAllIds = (state: RootState) =>
  state.establishment.establishmentGroup.allIds;
const getEstablishmentGroupById = (state: RootState) =>
  state.establishment.establishmentGroup.byId;

export const getEstablishmentGroups = createSelector(
  [getEstablishmentGroupAllIds, getEstablishmentGroupById],
  (allIds, byId) => allIds.map((id) => byId[id]),
);

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

export const getAvailableEstablishmentsWithAssociatedId = createSelector(
  [getAllEstablishmentsWithAssociatedId],
  (allEstablishments) => {
    return allEstablishments.filter((e) => !e.disabled);
  },
);

export const getFreshEstablishmentIds = createSelector(
  getAllEstablishments,
  (es) => es.map((e) => e.id),
);
export const getFavoriteEstablishment = (state: RootState) =>
  state.establishment.byId[state.establishment.favorite.id];

export const getEstablishmentGroupByAddress = createSelector(
  [withBookingNotification(getAvailableEstablishmentList)],
  (establishmentList) =>
    // @ts-expect-error
    establishmentList.reduce((accumulator, establishmentItem) => {
      const temp = accumulator.findIndex(
        // @ts-expect-error
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
            ...(group.establishment
              ? {
                  establishment: group.establishment
                    .map((est: number) => establishmentData[est])
                    .filter((est: AssociatedEstablishment) => !!est),
                }
              : []),
            ...(group.establishments
              ? {
                  establishment: group.establishments
                    .map((est: number) => establishmentData[est])
                    .filter((est: AssociatedEstablishment) => !!est),
                }
              : []),
          };
        }
        return group
          .filter((g) => !!g)
          .map((g) => ({
            ...g,
            ...(g.establishment
              ? {
                  establishment: g.establishment
                    .map((est: number) => establishmentData[est])
                    .filter((est: AssociatedEstablishment) => !!est),
                }
              : []),
            ...(g.establishments
              ? {
                  establishments: g.establishments
                    .map((est: number) => establishmentData[est])
                    .filter((est: AssociatedEstablishment) => !!est),
                }
              : []),
          }));
      },
    ),
);

export const getEstablishmentBillingroups = createSelector(
  [getAllEstablishmentBillingGroupIds, getAllEstablishmentBillingGroupDict],
  (idsList, establishmentGroupData) =>
    idsList.map((id) => establishmentGroupData[id]),
);

/**
 * Selects the enabled EstablishmentBillingGroup objects from the state.
 *
 * @param {RootState} state - The global state object.
 * @returns {EstablishmentBillingGroup[]} - An array of enabled EstablishmentBillingGroup objects.
 * @see getEstablishmentBillingroups
 */
export const getEnabledEstablishmentBillingGroups = createSelector(
  [getEstablishmentBillingroups],
  (establishmentGroupData) => {
    return establishmentGroupData.filter(
      (establishmentBillingGroup) => !establishmentBillingGroup.disabled,
    );
  },
);

export const getDefaultEstablishmentBillingGroup = createSelector(
  [getAllEstablishmentBillingGroupDict, getMemberDetail],
  (establishmentBillingGroupById, memberData) => {
    if (!memberData) return null;
    const defaultEstablishmentBillingGroup =
      establishmentBillingGroupById?.[
        memberData?.default_establishment_billing_group
      ];
    if (defaultEstablishmentBillingGroup?.disabled) return null;
    return defaultEstablishmentBillingGroup;
  },
);

export const getStaffEstablishmentBillingGroupSelector = createSelector(
  [
    getEnabledEstablishmentBillingGroups,
    (state: RootState) => state.role.byId,
    (state: RootState) => state.role.users,
    (state: RootState) => state.auth,
  ],
  (enabledGroups, rolesById, users, auth) => {
    if (!auth?.role || !auth?.username) {
      return null;
    }

    let userRole: UserRole | undefined = undefined;

    if (rolesById) {
      const allRoles = Object.values(rolesById);
      userRole = allRoles.find(
        (role: UserRole) =>
          role.role === auth.role && role.email === auth.username,
      );
    }

    return getStaffEstablishmentBillingGroup(userRole, enabledGroups);
  },
);

export const getEstablishmentBulkRetrieveState = (state: RootState) =>
  getState(state).bulkRetrieve;

export const getEstablishmentsSelectedInRole = (state: RootState): number[] => {
  return state.auth.establishments_selected_in_role;
};

export const getEstablishmentsByAssociatedId = (state: RootState) => {
  return state.establishment.byAssociatedEstablishmentId;
};
