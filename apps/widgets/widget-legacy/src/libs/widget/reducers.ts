import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { forceWidgetRefresh } from './actions';

export type WidgetState = {
  refreshKey: number;
};

export const initialState: Immutable.Immutable<WidgetState> =
  Immutable<WidgetState>({
    refreshKey: 0,
  });

export default handleActions<Immutable.Immutable<WidgetState>>(
  {
    [forceWidgetRefresh.toString()]: (state) =>
      state.setIn(['refreshKey'], state.refreshKey + 1),
  },
  initialState,
);
