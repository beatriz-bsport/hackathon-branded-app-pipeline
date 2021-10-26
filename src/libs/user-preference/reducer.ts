import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import { userPreferenceActions } from './actions';
import { UserPreference } from './types';

const initialState: Immutable.Immutable<UserPreference> = Immutable({
  scheduleTimerange: {
    begin: '06:00:00',
    end: '23:00:00',
  },
});

export default handleActions<Immutable.Immutable<UserPreference>, any>(
  {
    [userPreferenceActions.setScheduleTimerange.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(['scheduleTimerange', 'begin'], payload.begin)
        .setIn(['scheduleTimerange', 'end'], payload.end);
    },
  },
  initialState,
);
