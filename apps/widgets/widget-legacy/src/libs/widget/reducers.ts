import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { invalidateWidgetData } from './actions';

export type WidgetState = {
  dataVersion: number;
};

export const initialState: Immutable.Immutable<WidgetState> =
  Immutable<WidgetState>({
    dataVersion: 0,
  });

export default handleActions<Immutable.Immutable<WidgetState>>(
  {
    [invalidateWidgetData.toString()]: (state) =>
      state.setIn(['dataVersion'], state.dataVersion + 1),
  },
  initialState,
);
