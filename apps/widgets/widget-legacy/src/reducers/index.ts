import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

// INHERITED FROM BSPORT-SAAS
//  -----------------------------------------
//
import associatedCoach from '@bsport/saas-legacy/src/libs/associated-coach/reducers';
import authReducers from '@bsport/saas-legacy/src/reducers/auth';
import category from '@bsport/saas-legacy/src/libs/category/reducers';
import checkout from '@bsport/saas-legacy/src/libs/checkout/reducers';
import consumerPaymentPack from '@bsport/saas-legacy/src/libs/consumer-payment-pack/reducers';
import establishment from '@bsport/saas-legacy/src/libs/establishment/reducers';
import franchise from '@bsport/saas-legacy/src/libs/franchise/reducers';
import giftcard from '@bsport/saas-legacy/src/libs/giftcard/reducers';
import level from '@bsport/saas-legacy/src/libs/level/reducers';
import marketplace from '@bsport/saas-legacy/src/libs/marketplace/reducers';
import metaActivity from '@bsport/saas-legacy/src/libs/meta-activity/reducers';
import offer from '@bsport/saas-legacy/src/libs/offer/reducers';
import paymentCombo from '@bsport/saas-legacy/src/libs/payment-combo/reducers';
import groupOffer from '@bsport/saas-legacy/src/libs/group-offer/reducers';
import paymentPack from '@bsport/saas-legacy/src/libs/payment-packs/reducers';
import playlist from '@bsport/saas-legacy/src/libs/playlist/reducers';
import privateService from '@bsport/saas-legacy/src/libs/private-service/reducers';
import shopReducers from '@bsport/saas-legacy/src/libs/shop/reducers';
import snackbar from '@bsport/saas-legacy/src/libs/snackbar/reducers';
import subscription from '@bsport/saas-legacy/src/libs/subscription/reducers';
import tag from '@bsport/saas-legacy/src/libs/tag/reducers';
import themeReducers from '@bsport/saas-legacy/src/libs/theme/reducers';
import video from '@bsport/saas-legacy/src/libs/video/reducers';
import exportableComponent from '@bsport/saas-legacy/src/libs/exportable-components/reducers';
import consumerSpace from '@bsport/saas-legacy/src/libs/consumer-space/reducersReworked';
import spotScheduling from '@bsport/saas-legacy/src/libs/spot-scheduling/reducers';
import relationship from '@bsport/saas-legacy/src/libs/relationship/reducers';
import waitingList from '@bsport/saas-legacy/src/libs/waiting-list/reducers';
import invoice from '@bsport/saas-legacy/src/libs/invoice/reducers';
import paymentBackend from '@bsport/saas-legacy/src/libs/payment/reducers';
import member from '@bsport/saas-legacy/src/libs/member/reducers';
import customForm from '@bsport/saas-legacy/src/libs/custom-form/reducers';
import paymentModule from '@bsport/saas-legacy/src/libs/payment/payment-module-revamped/reducers';
import role from '@bsport/saas-legacy/src/libs/role/reducers';

import type { PrivateServiceState } from '@bsport/saas-legacy/src/libs/private-service/types';
import type { CoachState } from '@bsport/saas-legacy/src/libs/associated-coach/types';
import type { ThemeState } from '@bsport/saas-legacy/src/libs/theme/types';
import type { GiftcardState } from '@bsport/saas-legacy/src/libs/giftcard/types';
import type { createBrowserHistory } from 'history';
import type { TagState } from '@bsport/saas-legacy/src/libs/tag/types';
import type { LevelState } from '@bsport/saas-legacy/src/libs/level/types';
import type { ExportableComponentsState } from '@bsport/saas-legacy/src/libs/exportable-components/types';
import type { ConsumerStateReworked } from '@bsport/saas-legacy/src/libs/consumer-space/types';
import type { SpotSchedulingState } from '@bsport/saas-legacy/src/libs/spot-scheduling/types';
import type { RelationshipState } from '@bsport/saas-legacy/src/libs/relationship/types';
import type { WaitingListState } from '@bsport/saas-legacy/src/libs/waiting-list/types';
import type { InvoiceState } from '@bsport/saas-legacy/src/libs/invoice/types';
import type { FranchiseState } from '../../../@bsport/saas-legacy/src/libs/franchise/types';
import type { PaymentBackendState } from '../../../@bsport/saas-legacy/src/libs/payment/types';
import type { MemberState } from '@bsport/saas-legacy/src/libs/member/types';
import type { CustomFormState } from '@bsport/saas-legacy/src/libs/custom-form/types';
import type { PaymentModuleState } from '@bsport/saas-legacy/src/libs/payment/payment-module-revamped/types';
import type { RoleState } from '@bsport/saas-legacy/src/libs/role/types';
//  -----------------------------------------

// FROM WIDGET ONLY
//  -----------------------------------------
import modal, { ModalState } from '../libs/modal/reducers';
import bridge, { BridgeState } from '../libs/bridge/reducers';

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
    waitingList,
    invoice,
    paymentBackend,
    member,
    customForm,
    paymentModule,
    role,
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
  waitingList: WaitingListState;
  paymentBackend: PaymentBackendState;
  invoice: InvoiceState;
  member: MemberState;
  customForm: CustomFormState;
  paymentModule: PaymentModuleState;
  role: RoleState;
}

export default (history: ReturnType<typeof createBrowserHistory>) =>
  (state: any, action: any) =>
    reducer(history)(state, action);
