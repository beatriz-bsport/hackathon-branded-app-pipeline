import { createSelector } from 'reselect';
// @ts-ignore
import { State } from '../../../state/types';

import { PrivateService } from '../types';
import { getAllCoachesDict } from '../../associated-coach/selectors';
import {
  getAllEstablishmentsWithAssociatedId,
  getAllEstablishmentsDict,
} from '../../establishment/selectors';
import { getAllPrivateSlotsDict } from './private-slot';
import { RootState } from '../../../reducers';
import { withPrivateBookingNotification } from '../../marketing/selectors';

export const _getPrivateServicesById: (
  state: RootState,
) => { [key: string]: PrivateService } = (state: RootState) =>
  state.privateService.privateService.byId;

export const _getPrivateServicesListId: (state: RootState) => Array<number> = (
  state,
) => state.privateService.privateService.allIds;

export const _getPrivateServices = createSelector(
  [_getPrivateServicesListId, _getPrivateServicesById],
  (list, data) => list.map((id) => data[id]),
);

export const _getPrivateServicesMarketplaceListId = (state: RootState) =>
  state.privateService.privateService.marketplaceIds;

export const _getPrivateServicesMarketplace: (
  state: RootState,
) => Array<PrivateService> = createSelector(
  [_getPrivateServicesMarketplaceListId, _getPrivateServicesById],
  (list, data) => list.map((id) => data[id]).filter((ps) => ps.available),
);

export const getPrivateService = (state: RootState, id: string) =>
  _getPrivateServicesById(state)[id];

export const getPrivateServices = createSelector(
  [
    _getPrivateServices,
    getAllCoachesDict,
    getAllEstablishmentsWithAssociatedId,
    getAllPrivateSlotsDict,
  ],
  (privateServices, allCoachesData, allEstablishments, allSlots) => {
    return privateServices
      .filter((ps) => !!ps)
      .map((ps) => ({
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
) => Array<any> = createSelector(getPrivateServices, (services) =>
  services
    .filter((s) => s.available)
    .map((s) => ({
      ...s,
      slots: s.slots.filter((slot) => !!slot).filter((slot) => slot.available),
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
export const getPrivateServiceById: (state: RootState, id) => PrivateService = (
  state: RootState,
  id,
) => {
  const ps = state.privateService.privateService.byId[id];
  if (!ps) return null;
  // @ts-ignore TODO TYPES
  const coachData = getAllCoachesDict(state);
  // @ts-ignore TODO TYPES
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
          // @ts-ignore TODO TYPES
          e_.associatedestablishment_set.includes(c),
        ),
      )
      .filter((e) => !!e),
  };
};

export const getPrivateServicesList: (
  state: State,
  // TODO TYPES any
) => Array<any> = createSelector(
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
            // @ts-ignore TODO TYPES
            ae.associatedestablishment_set.includes(e),
          ),
        ),
        slots: ps.slots.map((s) => allSlotsDict[s]),
      })),
);

export const getPrivateServicesForMarketplace: (
  state: State,
) => Array<any> = createSelector(
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
            // @ts-ignore TODO TYPES
            ae.associatedestablishment_set.includes(e),
          ),
        ),
        slots: ps.slots
          .map((s) => allSlotsDict[s])
          // @  ts-ignore TODO TYPES
          .filter((s) => !!s && s.available),
      })),
);

export const _getPrivateServiceDict: (
  State,
) => {
  [id: number]: PrivateService;
} = (state) => state.privateService.privateService.byId;
