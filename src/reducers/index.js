import { combineReducers } from 'redux';

import authReducers from './auth';
import offerReducers from './offer';
import bookingReducers from './booking';
import activityReducers from './activity';
import statsReducers from './stats';
import coachReducers from './coach';

export default combineReducers({
  auth: authReducers,
  offer: offerReducers,
  booking: bookingReducers,
  activity: activityReducers,
  stats: statsReducers,
  coach: coachReducers,
});
