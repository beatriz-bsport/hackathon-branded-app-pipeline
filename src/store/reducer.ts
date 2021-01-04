import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import offer from 'bsport-saas/src/libs/offer/reducers';
import establishment from 'bsport-saas/src/libs/establishment/reducers';
import metaActivity from 'bsport-saas/src/libs/meta-activity/reducers';
import associatedCoach from 'bsport-saas/src/libs/associated-coach/reducers';
import shopReducers from 'bsport-saas/src/libs/shop/reducers';
import themeReducers from 'bsport-saas/src/libs/theme/reducers';
import authReducers from 'bsport-saas/src/reducers/auth';
import paymentReducers from 'bsport-saas/src/reducers/payment';
import snackbar from 'bsport-saas/src/reducers/snackbar.reducers';

import { CoachState } from 'bsport-saas/src/libs/associated-coach/types';
import { ThemeState } from 'bsport-saas/src/libs/theme/types';
import { createBrowserHistory } from 'history';

const rootReducer = (history: ReturnType<typeof createBrowserHistory>) =>
  combineReducers({
    router: connectRouter(history),
    payment: paymentReducers,
    offer,
    metaActivity,
    coach: associatedCoach,
    establishment,
    shop: shopReducers,
    theme: themeReducers,
    auth: authReducers,
    snackbar,
  });

export interface RootState {
    router: ReturnType<typeof connectRouter>;
    payment: any;
    offer: any;
    metaActivity: any;
    coach: CoachState
    establishment: any;
    theme: ThemeState;
    shop: any;
    auth: any,
    snackbar: any
}

export default (history: ReturnType<typeof createBrowserHistory>) => (state: any, action: any) =>
  rootReducer(history)(state, action);
