import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

export type WidgetState = {};

export const initialState: Immutable.Immutable<WidgetState> = Immutable<WidgetState>(
  {},
);

export default handleActions<Immutable.Immutable<WidgetState>>(
  {
    /** SAAS DATA */
  },
  initialState,
);
