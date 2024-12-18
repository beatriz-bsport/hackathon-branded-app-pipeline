import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { senderLocalIdActions } from './actions';

import type { BroadcastChannelState } from './types';

export const initialState: Immutable.Immutable<BroadcastChannelState> =
  Immutable<BroadcastChannelState>({
    senderLocalId: null,
  });

export default handleActions<Immutable.Immutable<BroadcastChannelState>, any>(
  {
    [senderLocalIdActions.init.toString()]: (state, { payload }) =>
      state.set('senderLocalId', payload),
  },
  initialState,
);
