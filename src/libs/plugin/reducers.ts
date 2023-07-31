import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import { PluginState } from './types';
import { pluginActions } from './actions';

const initialState: Immutable.Immutable<PluginState> = Immutable({
  isPluginActivated: false,
});

export default handleActions<Immutable.Immutable<PluginState>, any>(
  {
    [pluginActions.isPluginActivated.toString()]: (state, { payload }) => {
      return state.set('isPluginActivated', payload);
    },
  },
  initialState,
);
