// @flow

import { createSelector } from 'reselect';
import type { State } from '../../state/types';

const _getMembershipData = (state: State) => state.membership.byId;
const _getConsumerMembershipIds = (state: State) =>
  state.membership.asConsumer.allIds;

export const getMembership = (state: State, id: number) => {
  return _getMembershipData(state)[id];
};

export const getActiveMembership = (state: State) =>
  _getMembershipData(state)[state.membership.activeMembership];

export const getConsumerMembershipList = createSelector(
  [_getMembershipData, _getConsumerMembershipIds],
  (data, ids) => ids.map((id) => data[id]),
);
