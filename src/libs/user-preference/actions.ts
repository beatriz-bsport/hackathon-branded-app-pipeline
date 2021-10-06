import { createAction } from 'redux-actions';
import { Dispatch } from 'redux';

export const userPreferenceActions = {
  setScheduleTimerange: createAction('USER_PREFERENCE/SCHEDULE/TIMERANGE'),
};

export function setScheduleTimerange(scheduleTimerange: {
  begin: string;
  end: string;
}) {
  return async (dispatch: Dispatch) => {
    dispatch(
      userPreferenceActions.setScheduleTimerange({
        begin: scheduleTimerange.begin,
        end: scheduleTimerange.end,
      }),
    );
  };
}
