// @flow

import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import Immutable from 'seamless-immutable';
import type { State } from '../../../state/types';
import type {
  PrivatePass,
  PrivatePassWithService,
  ServiceCompatibilityPass,
} from '../types';
import { _getPrivateServiceDict } from './private-service';
import { getAllPrivateSlotsDict } from './private-slot';
import { RootState } from '../../../reducers';

export type PrivatePassSelector = (
  state: RootState,
) => Immutable.Immutable<Array<PrivatePass> | PrivatePass>;

const _getPrivatePassData = (state) => state.privateService.privatePass.byId;
const _getPrivatePassAsConsumerIds = (state) =>
  state.privateService.privatePass.asConsumer.allIds;

const _getPrivatePassListIds = (state) =>
  state.privateService.privatePass.allIds;

export const getPrivatePassById = (
  state: State,
): Array<PrivatePassWithService> => state.privateService.privatePass.byId;

export const getPrivatePass = (
  state: State,
  id: number,
): PrivatePassWithService => getPrivatePassById(state)[id];

export const getPrivatePassListBase: (State) => Array<PrivatePass> =
  createSelector([_getPrivatePassData, _getPrivatePassListIds], (data, ids) =>
    ids.map((id) => data[id]),
  );

export const getPrivatePassAvailable = createSelector(
  getPrivatePassListBase,
  (pp) => {
    return pp.filter((p) => p.available);
  },
);

export const getPrivatePassAsConsumer = createSelector(
  [_getPrivatePassData, _getPrivatePassAsConsumerIds],
  (data, ids) => ids.map((id) => data[id]).filter((p) => p.available),
);

export const getPrivatePassListWithPrivateService: (State) => Array<PrivatePassWithService> =
  createSelector(
    [_getPrivateServiceDict, getPrivatePassListBase],
    (servicesById, passesList) =>
      passesList.map((pass) => ({
        ...pass,
        private_services: pass.private_services.map((ps) => servicesById[ps]),
      })),
  );

export const getPrivatePassAvailableListWithPrivateService: (State) => Array<PrivatePassWithService> =
  createSelector(getPrivatePassListWithPrivateService, (passList) =>
    passList.filter((p) => p.available),
  );

export const getPrivatePassManagerOnlyList: (State) => Array<PrivatePassWithService> =
  createSelector(getPrivatePassListBase, (passList) =>
    passList.filter((p) => p.available && p.manager_only),
  );

export const getPrivatePassListCompatibleWithVideo: (State) => Array<PrivatePassWithService> =
  createSelector(getPrivatePassListBase, (passList) =>
    passList.filter((p) => p.full_vod_access),
  );

export const getPrivatePassCustomerEnabled: (State) => Array<PrivatePassWithService> =
  createSelector(getPrivatePassListBase, (passList) =>
    passList.filter((p) => p.available && !p.manager_only),
  );

export const getAvailablePrivatePasses: (State) => Array<PrivatePassWithService> =
  createSelector(getPrivatePassListBase, (passList) =>
    passList.filter((p) => p.available),
  );

export const getUnavailablePrivatePasses: (State) => Array<PrivatePassWithService> =
  createSelector(getPrivatePassListBase, (passList) =>
    passList.filter((p) => !p.available),
  );

export const withServices = memoize((selector) =>
  createSelector(
    [selector, _getPrivateServiceDict],
    (passesList, servicesById) => {
      if (!passesList) {
        return passesList;
      }
      if (Array.isArray(passesList)) {
        return passesList.map((pass) => ({
          ...pass,
          private_services: pass.private_services.map((ps) => servicesById[ps]),
        }));
      }
      if (passesList) {
        return {
          ...passesList,
          private_services: passesList.private_services.map(
            (ps) => servicesById[ps],
          ),
        };
      }
      return passesList;
    },
  ),
);

export const withAvailable = memoize((selector) =>
  createSelector(selector, (passList) => {
    if (!passList) return passList;
    if (Array.isArray(passList)) return passList.filter((p) => p.available);
    if (passList.available) return passList;
    return null;
  }),
);

export const getDisabledPrivatePassAvailableListWithPrivateService: (State) => Array<PrivatePassWithService> =
  createSelector(getPrivatePassListWithPrivateService, (passList) =>
    passList.filter((p) => !p.available),
  );

const _getServiceCompatibiltyPassDict = (state: State) =>
  state.privateService.compatibleServicePass.byId;

const _getServiceCompatibiltyPassIds = (state: State) =>
  state.privateService.compatibleServicePass.allIds;

export const getServiceCompatibilityPassList: (State) => Array<ServiceCompatibilityPass> =
  createSelector(
    [_getServiceCompatibiltyPassDict, _getServiceCompatibiltyPassIds],
    (data, ids) => ids.map((id) => data[id]),
  );

export const getCompatibleServicePassLoading = (state: State) =>
  state.privateService.compatibleServicePass.loading;

export const getCompatibilityPassWithService: (State) => Array<PrivatePassWithService> =
  createSelector(
    [
      _getPrivateServiceDict,
      getAllPrivateSlotsDict,
      getServiceCompatibilityPassList,
    ],
    (servicesById, slotData, compatibilityList) => {
      if (!compatibilityList) return compatibilityList;
      if (Array.isArray(compatibilityList)) {
        return compatibilityList.map((c) => ({
          ...c,
          private_service: {
            ...servicesById[c.private_service],
            slots: servicesById[c.private_service]
              ? servicesById[c.private_service].slots.map((s) => slotData[s])
              : [],
          },
          included_slots:
            servicesById[c.private_service] && c.excluded_slot_ids
              ? servicesById[c.private_service].slots
                  .filter((s) => !c.excluded_slot_ids.includes(s))
                  .map((s) => slotData[s])
              : null,
        }));
      }
      if (compatibilityList) {
        return {
          ...compatibilityList,
          private_service: {
            ...servicesById[compatibilityList.private_service],
            slots: servicesById[compatibilityList.private_service]
              ? servicesById[compatibilityList.private_service].slots.map(
                  (s) => slotData[s],
                )
              : [],
          },
          included_slots:
            servicesById[compatibilityList.private_service] &&
            compatibilityList.excluded_slot_ids
              ? servicesById[compatibilityList.private_service].slots
                  .filter(
                    (s) => !compatibilityList.excluded_slot_ids.includes(s),
                  )
                  .map((s) => slotData[s])
              : null,
        };
      }
      return [];
    },
  );
