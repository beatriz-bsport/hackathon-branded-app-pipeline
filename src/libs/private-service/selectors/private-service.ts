import { createSelector } from 'reselect';
import memoize from 'memoize-one';

import { State } from '../../../state/types';

import { PrivateService, PrivateSlot } from '../types';
import { getAllCoachesDict } from '../../associated-coach/selectors';
import {
  getAllEstablishmentsWithAssociatedId,
  getAllEstablishmentsDict,
} from '../../establishment/selectors';
import { getAllPrivateSlotsDict } from './private-slot';
import { RootState } from '../../../reducers';
import { withPrivateBookingNotification } from '../../marketing/selectors';
import { Coach } from '../../associated-coach/types';
import { Establishment } from '../../establishment/types';

export const _getPrivateServicesById: (state: RootState) => {
  [key: string]: PrivateService;
} = (state: RootState) => state.privateService.privateService.byId;

export const _getPrivateServicesListId: (state: RootState) => Array<number> = (
  state,
) => state.privateService.privateService.allIds;

export const _getPrivateServices = createSelector(
  [_getPrivateServicesListId, _getPrivateServicesById],
  (list, data) => list.map((id) => data[id]),
);

export const _getAvailablePrivateServices: (
  state: RootState,
) => Array<PrivateService> = createSelector(
  [_getPrivateServicesListId, _getPrivateServicesById],
  (list, data) => list.map((id) => data[id]).filter((ps) => !!ps.available),
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

const _getServiceGroupIdList = (state: RootState) =>
  state.privateService.serviceGroup.allIds;
const _getServiceGroupData = (state: RootState) =>
  state.privateService.serviceGroup.byId;

export const getPrivateServiceGroupList = createSelector(
  [_getServiceGroupData, _getServiceGroupIdList],
  (data, ids) => ids.map((id) => data[id]),
);

export const getAvailablePrivateServices: (state: RootState) => Array<any> =
  createSelector(getPrivateServices, (services) =>
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
      // @ts-expect-error
      private_services: services.filter((s) =>
        g.private_services.includes(s.id),
      ),
    }));
  },
);
export const getPrivateServiceById: (
  state: RootState,
  id: string | number,
) => PrivateService<Coach, Establishment, PrivateSlot> = (
  state: RootState,
  id,
) => {
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

export const withAssociatedCoach = memoize(
  (selector: (State: RootState, id: string) => any) =>
    createSelector(
      [selector, getAllCoachesDict],
      (privateServices, coachData) => {
        if (!privateServices) return privateServices;
        if (Array.isArray(privateServices)) {
          return privateServices.map((ps) => ({
            ...ps,
            coaches: ps.coaches
              // @ts-expect-error
              .map((c) =>
                Object.values(coachData).find(
                  (c_) => c_.associated_coach_id === c,
                ),
              )
              // @ts-expect-error
              .filter((c) => !!c),
          }));
        }
        return {
          ...privateServices,
          coaches: privateServices.coaches
            // @ts-expect-error
            .map((c) =>
              Object.values(coachData).find(
                (c_) => c_.associated_coach_id === c,
              ),
            )
            // @ts-expect-error
            .filter((c) => !!c),
        };
      },
    ),
);

export const withAssociatedEstablishment = memoize(
  (selector: (state: RootState, id: string) => any) =>
    createSelector(
      [selector, getAllEstablishmentsDict],
      (privateServices, establishmentData) => {
        if (!privateServices) return privateServices;
        if (Array.isArray(privateServices)) {
          return privateServices.map((ps: PrivateService) => ({
            ...ps,
            establishments: ps.establishments
              .map((establishment) =>
                Object.values(establishmentData).find((est) =>
                  est.associatedestablishment_set?.includes(establishment),
                ),
              )
              .filter((establishment) => !!establishment),
          }));
        }
        return {
          ...privateServices,
          establishments: privateServices.establishments
            .map((establishment: number) =>
              Object.values(establishmentData).find((est) =>
                est.associatedestablishment_set?.includes(establishment),
              ),
            )
            .filter((establishment: number) => !!establishment),
        };
      },
    ),
);

export const withPrivateSlots = memoize((selector: (State: RootState) => any) =>
  createSelector(
    [selector, getAllPrivateSlotsDict],
    (privateServices, slotsData) => {
      if (!privateServices) return privateServices;
      if (Array.isArray(privateServices)) {
        return privateServices.map((ps) => ({
          ...ps,
          // @ts-expect-error
          slots: ps.slots.map((s) => slotsData[s]).filter((s) => !!s),
        }));
      }
      return {
        ...privateServices,
        slots: privateServices.slots
          // @ts-expect-error
          .map((s) => slotsData[s])
          // @ts-expect-error
          .filter((s) => !!s),
      };
    },
  ),
);

export const withAvailablePrivateSlots = memoize(
  (selector: (State: RootState, id: string) => any) =>
    createSelector(
      [selector, getAllPrivateSlotsDict],
      (privateServices, slotsData) => {
        if (!privateServices) return privateServices;
        if (Array.isArray(privateServices)) {
          return privateServices.map((ps) => ({
            ...ps,
            slots: ps.slots
              // @ts-expect-error
              .map((s) => slotsData[s])
              // @ts-expect-error
              .filter((s) => !!s && s.available),
          }));
        }
        return {
          ...privateServices,
          slots: privateServices.slots
            // @ts-expect-error
            .map((s) => slotsData[s])
            // @ts-expect-error
            .filter((s) => !!s && s.available),
        };
      },
    ),
);

// @ts-expect-error
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
            ae.associatedestablishment_set.includes(e),
          ),
        ),
        slots: ps.slots.map((s) => allSlotsDict[s]),
      })),
);

// @ts-expect-error
export const getPrivateServicesForMarketplace: (state: State) => Array<any> =
  createSelector(
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

// @ts-expect-error
export const _getPrivateServiceDict: (State) => {
  [id: number]: PrivateService;
} = (state) => state.privateService.privateService.byId;

export const getPrivateServiceTagEligibleById = (state: RootState) => {
  return state.privateService.privateServiceTagEligibility.byId;
};

export const getPrivateServiceTagEligible = (state: RootState, id: string) => {
  return state.privateService.privateServiceTagEligibility.byId[id];
};

export const getPrivateServiceTagEligibleLoading = (state: RootState) => {
  return state.privateService.privateServiceTagEligibility.loading;
};

export const getPrivateServiceWithDetails = createSelector(
  [
    getPrivateService,
    getAllEstablishmentsDict,
    getAllPrivateSlotsDict,
    getAllCoachesDict,
  ],
  (privateService, establishmentsById, privateSlotsById, coachesById) => {
    if (!privateService) return null;
    return {
      ...privateService,
      coaches: privateService.coaches
        ?.map((associatedCoachId) =>
          Object.values(coachesById)?.find(
            (coach) => coach.associated_coach_id === associatedCoachId,
          ),
        )
        .filter(Boolean),
      establishments: privateService.establishments
        ?.map((associatedEstablishmentId) =>
          Object.values(establishmentsById)?.find(
            (establishment) =>
              establishment.associatedestablishment_set[0] ===
              associatedEstablishmentId,
          ),
        )
        .filter(Boolean),
      slots: privateService.slots
        ?.map((slotId) => privateSlotsById?.[slotId])
        .filter(Boolean),
    };
  },
);
