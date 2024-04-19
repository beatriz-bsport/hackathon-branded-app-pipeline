import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

// INHERITED FROM BSPORT-SAAS
//  -----------------------------------------
//
import associatedCoach from 'bsport-saas/src/libs/associated-coach/reducers';
import authReducers from 'bsport-saas/src/reducers/auth';
import category from 'bsport-saas/src/libs/category/reducers';
import checkout from 'bsport-saas/src/libs/checkout/reducers';
import consumerPaymentPack from 'bsport-saas/src/libs/consumer-payment-pack/reducers';
import establishment from 'bsport-saas/src/libs/establishment/reducers';
import franchise from 'bsport-saas/src/libs/franchise/reducers';
import giftcard from 'bsport-saas/src/libs/giftcard/reducers';
import level from 'bsport-saas/src/libs/level/reducers';
import marketplace from 'bsport-saas/src/libs/marketplace/reducers';
import metaActivity from 'bsport-saas/src/libs/meta-activity/reducers';
import offer from 'bsport-saas/src/libs/offer/reducers';
import paymentCombo from 'bsport-saas/src/libs/payment-combo/reducers';
import groupOffer from 'bsport-saas/src/libs/group-offer/reducers';
import paymentPack from 'bsport-saas/src/libs/payment-packs/reducers';
import playlist from 'bsport-saas/src/libs/playlist/reducers';
import privateService from 'bsport-saas/src/libs/private-service/reducers';
import shopReducers from 'bsport-saas/src/libs/shop/reducers';
import snackbar from 'bsport-saas/src/libs/snackbar/reducers';
import subscription from 'bsport-saas/src/libs/subscription/reducers';
import tag from 'bsport-saas/src/libs/tag/reducers';
import themeReducers from 'bsport-saas/src/libs/theme/reducers';
import video from 'bsport-saas/src/libs/video/reducers';
import exportableComponent from 'bsport-saas/src/libs/exportable-components/reducers';
import consumerSpace from 'bsport-saas/src/libs/consumer-space/reducersReworked';
import spotScheduling from 'bsport-saas/src/libs/spot-scheduling/reducers';
import relationship from 'bsport-saas/src/libs/relationship/reducers';

import type { PrivateServiceState } from 'bsport-saas/src/libs/private-service/types';
import type { CoachState } from 'bsport-saas/src/libs/associated-coach/types';
import type { ThemeState } from 'bsport-saas/src/libs/theme/types';
import type { GiftcardState } from 'bsport-saas/src/libs/giftcard/types';
import type { createBrowserHistory } from 'history';
import type { TagState } from 'bsport-saas/src/libs/tag/types';
import type { LevelState } from 'bsport-saas/src/libs/level/types';
import type { ExportableComponentsState } from 'bsport-saas/src/libs/exportable-components/types';
import type { ConsumerStateReworked } from 'bsport-saas/src/libs/consumer-space/types';
import type { SpotSchedulingState } from 'bsport-saas/src/libs/spot-scheduling/types';
import type { RelationshipState } from 'bsport-saas/src/libs/relationship/types';

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
    groupOffer,
    bridge,
    tag,
    giftcard,
    franchise,
    level,
    exportableComponent,
    consumerReworked: consumerSpace,
    spotScheduling,
    relationship,
  });

export interface RootState {
  router: ReturnType<typeof connectRouter>;
  auth: any;
  bridge: BridgeState;
  category: any;
  checkout: any;
  coach: CoachState;
  consumerPaymentPack: any;
  establishment: any;
  franchise: FranchiseState;
  giftcard: GiftcardState;
  marketplace: any;
  level: LevelState;
  metaActivity: any;
  modal: ModalState;
  offer: any;
  paymentCombo: any;
  paymentPack: any;
  playlist: any;
  privateService: PrivateServiceState;
  shop: any;
  snackbar: any;
  tag: TagState;
  theme: ThemeState;
  video: any;
  exportableComponent: ExportableComponentsState;
  consumerReworked: ConsumerStateReworked;
  spotScheduling: SpotSchedulingState;
  relationship: RelationshipState;
}

export default (history: ReturnType<typeof createBrowserHistory>) => (
  state: any,
  action: any,
) => reducer(history)(state, action);
