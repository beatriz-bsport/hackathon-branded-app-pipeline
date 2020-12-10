// @flow

import { createSelector } from 'reselect';
import type { State } from '../../../state/types';

import type { PrivateService, PrivateServiceWithRelatedFields } from '../types';
import { getAllCoachesDict } from '../../associated-coach/selectors';
import {
  getAllEstablishmentsWithAssociatedId,
  getAllEstablishmentsDict,
} from '../../establishment/selectors';
import { getAllPrivateSlotsDict } from './private-slot';
import { withPrivateBookingNotification } from '../../marketing/selectors';

export const _getPrivateServicesById: (State) => {
  [id: number]: PrivateService,
} = (state) => state.privateService.privateService.byId;

export const _getPrivateServicesListId: (State) => Array<number> = (state) =>
  state.privateService.privateService.allIds;

export const _getPrivateServices: (
  state: State,
) => Array<PrivateService> = createSelector(
  [_getPrivateServicesListId, _getPrivateServicesById],
  (list, data) => list.map((id) => data[id]),
);

export const _getPrivateServicesMarketplaceListId: (State) => Array<number> = (
  state,
) => state.privateService.privateService.marketplaceIds;

export const _getPrivateServicesMarketplace: (
  state: State,
) => Array<PrivateService> = createSelector(
  [_getPrivateServicesMarketplaceListId, _getPrivateServicesById],
  (list, data) => list.map((id) => data[id]).filter((ps) => ps.available),
);

export const getPrivateService = (state: State, id: number) =>
  _getPrivateServicesById(state)[id];

export const getPrivateServices: (
  state: State,
) => Array<PrivateServiceWithRelatedFields> = createSelector(
  [
    _getPrivateServices,
    getAllCoachesDict,
    getAllEstablishmentsWithAssociatedId,
    getAllPrivateSlotsDict,
  ],
  (privateServices, allCoachesData, allEstablishments, allSlots) => {
    return privateServices.map((ps) => ({
      ...ps,
      coaches: ps.coaches.map((associated_coach) =>
        Object.values(allCoachesData).find(
          (c) => c.associated_coach_id === associated_coach,
        ),
      ),
      establishments: ps.establishments.map((e) =>
        allEstablishments.find((ae) =>
          ae.associatedestablishment_set.includes(e),
        ),
      ),
      slots: ps.slots.map((s) => allSlots[s]),
    }));
  },
);

const _getServiceGroupIdList = (state) =>
  state.privateService.serviceGroup.allIds;
const _getServiceGroupData = (state) => state.privateService.serviceGroup.byId;

export const getPrivateServiceGroupList = createSelector(
  [_getServiceGroupData, _getServiceGroupIdList],
  (data, ids) => ids.map((id) => data[id]),
);

export const getAvailablePrivateServices: (
  state: State,
) => Array<PrivateServiceWithRelatedFields> = createSelector(
  getPrivateServices,
  (services) =>
    services
      .filter((s) => s.available)
      .map((s) => ({
        ...s,
        slots: s.slots
          .filter((slot) => !!slot)
          .filter((slot) => slot.available),
      })),
);

export const getAvailablePrivateServicesWithoutGroup = createSelector(
  getAvailablePrivateServices,
  (services) => services.filter((s) => !s.private_service_group),
);

export const getPrivateServiceListByGroup = createSelector(
  [
    getPrivateServiceGroupList,
    withPrivateBookingNotification(getAvailablePrivateServices),
  ],
  (groupList, services) => {
    return groupList.map((g) => ({
      ...g,
      private_services: services.filter((s) =>
        g.private_services.includes(s.id),
      ),
    }));
  },
);
export const getPrivateServiceById = (state, id) => {
  const ps = state.privateService.privateService.byId[id];
  if (!ps) return null;
  const coachData = getAllCoachesDict(state);
  const establishmentData = getAllEstablishmentsDict(state);
  const slotData = getAllPrivateSlotsDict(state);
  return {
    ...ps,
    coaches: ps.coaches
      .map((c) =>
        Object.values(coachData).find((c_) => c_.associated_coach_id === c),
      )
      .filter((c) => !!c),
    slots: ps.slots.map((s) => slotData[s]).filter((s) => !!s),
    establishments: ps.establishments
      .map((c) =>
        Object.values(establishmentData).find((e_) =>
          e_.associatedestablishment_set.includes(c),
        ),
      )
      .filter((e) => !!e),
  };
};

export const getPrivateServicesList: (
  state: State,
) => Array<PrivateServiceWithRelatedFields> = createSelector(
  [
    _getPrivateServices,
    getAllCoachesDict,
    getAllEstablishmentsDict,
    getAllPrivateSlotsDict,
  ],
  (privateServices, allCoaches, allEstablishments, allSlotsDict) =>
    privateServices
      .filter((ps) => ps.available)
      .map((ps) => ({
        ...ps,
        coaches: ps.coaches.map((associated_coach) =>
          Object.values(allCoaches).find((c) =>
            c.associatedcoach_set.includes(associated_coach),
          ),
        ),
        establishments: ps.establishments.map((e) =>
          Object.values(allEstablishments).find((ae) =>
            ae.associatedestablishment_set.includes(e),
          ),
        ),
        slots: ps.slots.map((s) => allSlotsDict[s]),
      })),
);

export const getPrivateServicesForMarketplace: (
  state: State,
) => Array<PrivateServiceWithRelatedFields> = createSelector(
  [
    _getPrivateServicesMarketplace,
    getAllCoachesDict,
    getAllEstablishmentsDict,
    getAllPrivateSlotsDict,
  ],
  (privateServices, allCoaches, allEstablishments, allSlotsDict) =>
    privateServices
      .filter((ps) => ps.available)
      .map((ps) => ({
        ...ps,
        coaches: ps.coaches.map((associated_coach) =>
          Object.values(allCoaches).find((c) =>
            c.associatedcoach_set.includes(associated_coach),
          ),
        ),
        establishments: ps.establishments.map((e) =>
          Object.values(allEstablishments).find((ae) =>
            ae.associatedestablishment_set.includes(e),
          ),
        ),
        slots: ps.slots
          .map((s) => allSlotsDict[s])
          .filter((s) => !!s && s.available),
      })),
);

export const _getPrivateServiceDict: (State) => {
  [id: number]: PrivateService,
} = (state) => state.privateService.privateService.byId;
