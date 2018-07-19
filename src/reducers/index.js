import { combineReducers } from 'redux';

import authReducers from './auth';
import offerReducers from './offer';
import bookingReducers from './booking';
import activityReducers from './activity';
import statsReducers from './stats';
import coachReducers from './coach';
import memberReducer from './member';

export default combineReducers({
  auth: authReducers,
  offer: offerReducers,
  booking: bookingReducers,
  activity: activityReducers,
  stats: statsReducers,
  coach: coachReducers,
  member: memberReducer,
});
