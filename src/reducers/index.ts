import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

// INHERITED FROM BSPORT-SAAS
//  -----------------------------------------
//
import offer from 'bsport-saas/src/libs/offer/reducers';
import establishment from 'bsport-saas/src/libs/establishment/reducers';
import metaActivity from 'bsport-saas/src/libs/meta-activity/reducers';
import associatedCoach from 'bsport-saas/src/libs/associated-coach/reducers';
import shopReducers from 'bsport-saas/src/libs/shop/reducers';
import themeReducers from 'bsport-saas/src/libs/theme/reducers';
import authReducers from 'bsport-saas/src/reducers/auth';
import snackbar from 'bsport-saas/src/libs/snackbar/reducers';
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
import tag from 'bsport-saas/src/libs/tag/reducers';
import giftcard from 'bsport-saas/src/libs/giftcard/reducers';
import franchise from 'bsport-saas/src/libs/franchise/reducers';

import { PrivateServiceState } from 'bsport-saas/src/libs/private-service/types';
import { CoachState } from 'bsport-saas/src/libs/associated-coach/types';
import { ThemeState } from 'bsport-saas/src/libs/theme/types';
import { GiftcardState } from 'bsport-saas/src/libs/giftcard/types';
import { createBrowserHistory } from 'history';
import { TagState } from 'bsport-saas/src/libs/tag/types';
//  -----------------------------------------

// FROM WIDGET ONLY
//  -----------------------------------------
import modal, { ModalState } from '../libs/modal/reducers';
import bridge, { BridgeState } from '../libs/bridge/reducers';
import { FranchiseState } from '../../../bsport-saas/src/libs/franchise/types';
//  -----------------------------------------

const reducer = (history: ReturnType<typeof createBrowserHistory>) =>
  combineReducers({
    router: connectRouter(history),
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
    subscription,
    modal,
    bridge,
    tag,
    giftcard,
    franchise,
  });

export interface RootState {
  router: ReturnType<typeof connectRouter>;
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
  modal: ModalState;
  bridge: BridgeState;
  tag: TagState;
  giftcard: GiftcardState;
  franchise: FranchiseState;
}

export default (history: ReturnType<typeof createBrowserHistory>) => (
  state: any,
  action: any,
) => reducer(history)(state, action);
