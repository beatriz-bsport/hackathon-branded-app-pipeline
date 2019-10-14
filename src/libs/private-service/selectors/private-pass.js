// @flow

import { createSelector } from 'reselect';
import type { State } from '../../../state/types';
import type { PrivatePass, PrivatePassWithService } from '../types';
import { _getPrivateServiceDict } from './private-service';

const _getPrivatePassListBase: (State) => Array<PrivatePass> = (state) =>
  state.privateService.privatePass.allIds.map(
    (id) => state.privateService.privatePass.byId[id],
  );

export const getPrivatePassAvailable = createSelector(
  _getPrivatePassListBase,
  (pp) => pp.filter((p) => p.available),
);

// eslint-disable-next-line
export const getPrivatePassListWithPrivateService: (State) => Array<PrivatePassWithService> = createSelector(
  [_getPrivateServiceDict, _getPrivatePassListBase],
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
