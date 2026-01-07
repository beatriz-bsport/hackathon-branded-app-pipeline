import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { forceWidgetRefresh } from './actions';

const generateRefreshKey = () => {
  return Math.random().toString(36).substring(0, 10);
};

export type WidgetState = {
  refreshKey: string;
};

export const initialState: Immutable.Immutable<WidgetState> =
  Immutable<WidgetState>({
    refreshKey: generateRefreshKey(),
  });

export default handleActions<Immutable.Immutable<WidgetState>>(
  {
    [forceWidgetRefresh.toString()]: (state) =>
      state.setIn(['refreshKey'], generateRefreshKey()),
  },
  initialState,
);
