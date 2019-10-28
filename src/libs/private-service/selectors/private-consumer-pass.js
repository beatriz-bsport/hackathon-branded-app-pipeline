// @flow

import { createSelector } from 'reselect';
import type { State } from '../../../state/types';
import type { PrivateConsumerPass } from '../types';

const _getPrivateConsumerPassIdList: (State) => Array<number> = (state) =>
  state.privateService.privateConsumerPass.allIds;

export const getPrivateConsumerPassDict: (State) => {
  [id: number]: PrivateConsumerPass,
} = (state) => state.privateService.privateConsumerPass.byId;

export const getPrivateConsumerPassList: (State) => Array<PrivateConsumerPass> = createSelector(
  [_getPrivateConsumerPassIdList, getPrivateConsumerPassDict],
  (ids, data) => ids.map((id) => data[id]),
);

// eslint-disable-next-line
export const getPrivateConsumerPassListWithCredit: (State) => Array<PrivateConsumerPass> = createSelector(
  [getPrivateConsumerPassList],
  (privateConsumerPassList) =>
    privateConsumerPassList.filter(
      (pcp) => pcp.used_credits < pcp.private_pass.credits,
    ),
);
