// @flow

import { createSelector } from 'reselect';
import memoize from 'memoize-one';
import type { State } from '../../../state/types';
import type { PrivatePass, PrivatePassWithService } from '../types';
import { _getPrivateServiceDict } from './private-service';

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

export const getPrivatePassListBase: (State) => Array<PrivatePass> = createSelector(
  [_getPrivatePassData, _getPrivatePassListIds],
  (data, ids) => ids.map((id) => data[id]),
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

// eslint-disable-next-line
export const getPrivatePassListWithPrivateService: (State) => Array<PrivatePassWithService> = createSelector(
  [_getPrivateServiceDict, getPrivatePassListBase],
  (servicesById, passesList) =>
    passesList.map((pass) => ({
      ...pass,
      private_services: pass.private_services.map((ps) => servicesById[ps]),
    })),
);

// eslint-disable-next-line
export const getPrivatePassAvailableListWithPrivateService: (State) => Array<PrivatePassWithService> = createSelector(
  getPrivatePassListWithPrivateService,
  (passList) => passList.filter((p) => p.available),
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
  createSelector(
    selector,
    (passList) => {
      if (!passList) return passList;
      if (Array.isArray(passList)) return passList.filter((p) => p.available);
      if (passList.available) return passList;
      return null;
    },
  ),
);
// eslint-disable-next-line
export const getDisabledPrivatePassAvailableListWithPrivateService: (State) => Array<PrivatePassWithService> = createSelector(
  getPrivatePassListWithPrivateService,
  (passList) => passList.filter((p) => !p.available),
);
