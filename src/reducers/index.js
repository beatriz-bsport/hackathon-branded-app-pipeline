import { combineReducers } from 'redux';

import authReducers from './auth';
import offerReducers from './offer';

export default combineReducers({
  auth: authReducers,
  offer: offerReducers,
});
