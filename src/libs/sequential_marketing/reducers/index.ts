import { combineReducers } from 'redux';
import Immutable from 'seamless-immutable';
import type { SequentialMarketingState } from '#libs/sequential_marketing/types';

import handleCadenceActions from './cadence';
import handleCadenceStepActions from './step';
import handleMarketingActions from './marketing_action';

export type ImmutableSequentialMarketingState =
  Immutable.Immutable<SequentialMarketingState>;

export default combineReducers({
  cadence: handleCadenceActions,
  step: handleCadenceStepActions,
  marketingActions: handleMarketingActions,
});
