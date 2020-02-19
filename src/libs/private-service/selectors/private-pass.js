// @flow

import { createSelector } from 'reselect';
import type { State } from '../../../state/types';
import type { PrivatePass, PrivatePassWithService } from '../types';
import { _getPrivateServiceDict } from './private-service';

const _getPrivatePassData = (state) => state.privateService.privatePass.byId;
const _getPrivatePassAsConsumerIds = (state) =>
  state.privateService.privatePass.asConsumer.allIds;

const _getPrivatePassListIds = (state) =>
  state.privateService.privatePass.allIds;

export const getPrivatePassListBase: (State) => Array<PrivatePass> = createSelector(
  [_getPrivatePassData, _getPrivatePassListIds],
  (data, ids) => ids.map((id) => data[id]),
);

export const getPrivatePassAvailable = createSelector(
  getPrivatePassListBase,
  (pp) => pp.filter((p) => p.available),
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
