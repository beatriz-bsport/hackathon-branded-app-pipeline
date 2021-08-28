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
import paymentCombo from 'bsport-saas/src/libs/payment-combo/reducers';
import consumerPaymentPack from 'bsport-saas/src/libs/consumer-payment-pack/reducers';
import paymentPack from 'bsport-saas/src/libs/payment-packs/reducers';
import marketplace from 'bsport-saas/src/libs/marketplace/reducers';
import checkout from 'bsport-saas/src/libs/checkout/reducers';
import privateService from 'bsport-saas/src/libs/private-service/reducers';
import video from 'bsport-saas/src/libs/video/reducers';
import playlist from 'bsport-saas/src/libs/playlist/reducers';
import category from 'bsport-saas/src/libs/category/reducers';
import subscription from 'bsport-saas/src/libs/subscription/reducers';

import { PrivateServiceState } from 'bsport-saas/src/libs/private-service/types';
import { CoachState } from 'bsport-saas/src/libs/associated-coach/types';
import { ThemeState } from 'bsport-saas/src/libs/theme/types';
import { createBrowserHistory } from 'history';
import widget, { WidgetState } from './widget';

const reducer = (history: ReturnType<typeof createBrowserHistory>) =>
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
    marketplace,
    snackbar,
    paymentCombo,
    checkout,
    privateService,
    video,
    playlist,
    consumerPaymentPack,
    paymentPack,
    category,
    widget,
    subscription,
  });

export interface RootState {
  router: ReturnType<typeof connectRouter>;
  payment: any;
  offer: any;
  metaActivity: any;
  coach: CoachState;
  establishment: any;
  theme: ThemeState;
  shop: any;
  marketplace: any;
  auth: any;
  snackbar: any;
  paymentCombo: any;
  checkout: any;
  privateService: PrivateServiceState;
  video: any;
  playlist: any;
  consumerPaymentPack: any;
  category: any;
  paymentPack: any;
  widget: WidgetState;
}

export default (history: ReturnType<typeof createBrowserHistory>) => (
  state: any,
  action: any,
) => reducer(history)(state, action);
