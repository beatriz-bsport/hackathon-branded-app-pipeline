// @flow

import { createSelector } from 'reselect';
import type { State } from '../../../state/types';

import type { PrivateService, PrivateServiceWithRelatedFields } from '../types';
import {
  getAllCoaches,
  getAllCoachesDict,
} from '../../associated-coach/selectors';
import {
  getAllEstablishmentsWithAssociatedId,
  getAllEstablishmentsDict,
} from '../../establishment/selectors';
import { getAllPrivateSlotsDict } from './private-slot';

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

export const getPrivateService = (state: State, id: number) =>
  _getPrivateServicesById(state)[id];

export const getPrivateServices: (
  state: State,
) => Array<PrivateServiceWithRelatedFields> = createSelector(
  [
    _getPrivateServices,
    getAllCoaches,
    getAllEstablishmentsWithAssociatedId,
    getAllPrivateSlotsDict,
  ],
  (privateServices, allCoaches, allEstablishments, allSlots) =>
    privateServices.map((ps) => ({
      ...ps,
      coaches: ps.coaches.map((associated_coach) =>
        allCoaches.find((c) => c.associated_coach_id === associated_coach),
      ),
      establishments: ps.establishments.map((e) =>
        allEstablishments.find((ae) => ae.associated_establishment_id === e),
      ),
      slots: ps.slots.map((s) => allSlots[s]),
    })),
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

export const getPrivateServicesForMarketplace: (
  state: State,
) => Array<PrivateServiceWithRelatedFields> = createSelector(
  [
    _getPrivateServices,
    getAllCoachesDict,
    getAllEstablishmentsDict,
    getAllPrivateSlotsDict,
  ],
  (privateServices, allCoaches, allEstablishments, allSlotsDict) =>
    privateServices.map((ps) => ({
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

export const _getPrivateServiceDict: (State) => {
  [id: number]: PrivateService,
} = (state) => state.privateService.privateService.byId;
