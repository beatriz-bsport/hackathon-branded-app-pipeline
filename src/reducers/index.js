import { combineReducers } from 'redux';

import authReducers from './auth';
import offerReducers from './offer';
import bookingReducers from './booking';
import activityReducers from './activity';
import metaActivityReducers from './meta-activity';
import statsReducers from './stats';
import coachReducers from './coach';
import memberReducer from './member';
import paymentPackReducers from './paymentPack';
import establishmentReducers from './establishment';

export default combineReducers({
  auth: authReducers,
  establishment: establishmentReducers,
  offer: offerReducers,
  booking: bookingReducers,
  activity: activityReducers,
  metaActivity: metaActivityReducers,
  stats: statsReducers,
  coach: coachReducers,
  member: memberReducer,
  paymentPack: paymentPackReducers,
});
