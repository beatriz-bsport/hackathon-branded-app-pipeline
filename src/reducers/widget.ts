import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { refreshVODRequestAccessFlagAction } from '../actions/widget';

export type WidgetState = {
  requestVideoAccessRefreshFlag: number, // TODO remove this when login done for VOD
};

export const initialState: Immutable.Immutable<WidgetState> = Immutable<WidgetState>(
  {
    requestVideoAccessRefreshFlag: 0, // TODO remove this when login done for VOD
  },
);

export default handleActions<Immutable.Immutable<WidgetState>>(
  {
    /** SAAS DATA */
    [refreshVODRequestAccessFlagAction.toString()]: (state) => {
      return state.setIn(
        ['saas', 'requestVideoAccessRefreshFlag'],
        state.requestVideoAccessRefreshFlag + 1,
      );
    },
  },
  initialState,
);
