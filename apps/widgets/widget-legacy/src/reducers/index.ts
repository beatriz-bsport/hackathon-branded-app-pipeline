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
import consumer from '@bsport/saas-legacy/src/libs/consumer-space/reducers';
import consumerReworked from '@bsport/saas-legacy/src/libs/consumer-space/reducersReworked';
import customForm from '@bsport/saas-legacy/src/libs/custom-form/reducers';
import establishment from '@bsport/saas-legacy/src/libs/establishment/reducers';
import exportableComponent from '@bsport/saas-legacy/src/libs/exportable-components/reducers';
import franchise from '@bsport/saas-legacy/src/libs/franchise/reducers';
import giftcard from '@bsport/saas-legacy/src/libs/giftcard/reducers';
import groupOffer from '@bsport/saas-legacy/src/libs/group-offer/reducers';
import invoice from '@bsport/saas-legacy/src/libs/invoice/reducers';
import level from '@bsport/saas-legacy/src/libs/level/reducers';
import marketplace from '@bsport/saas-legacy/src/libs/marketplace/reducers';
import member from '@bsport/saas-legacy/src/libs/member/reducers';
import membership from '@bsport/saas-legacy/src/libs/membership/reducers';
import metaActivity from '@bsport/saas-legacy/src/libs/meta-activity/reducers';
import offer from '@bsport/saas-legacy/src/libs/offer/reducers';
import paymentBackend from '@bsport/saas-legacy/src/libs/payment/reducers';
import paymentCombo from '@bsport/saas-legacy/src/libs/payment-combo/reducers';
import paymentModule from '@bsport/saas-legacy/src/libs/payment/payment-module-revamped/reducers';
import paymentPack from '@bsport/saas-legacy/src/libs/payment-packs/reducers';
import playlist from '@bsport/saas-legacy/src/libs/playlist/reducers';
import privateService from '@bsport/saas-legacy/src/libs/private-service/reducers';
import referral from '@bsport/saas-legacy/src/libs/referral/reducers';
import relationship from '@bsport/saas-legacy/src/libs/relationship/reducers';
import role from '@bsport/saas-legacy/src/libs/role/reducers';
import shopReducers from '@bsport/saas-legacy/src/libs/shop/reducers';
import snackbar from '@bsport/saas-legacy/src/libs/snackbar/reducers';
import spotScheduling from '@bsport/saas-legacy/src/libs/spot-scheduling/reducers';
import subscription from '@bsport/saas-legacy/src/libs/subscription/reducers';
import tag from '@bsport/saas-legacy/src/libs/tag/reducers';
import themeReducers from '@bsport/saas-legacy/src/libs/theme/reducers';
import video from '@bsport/saas-legacy/src/libs/video/reducers';
import waitingList from '@bsport/saas-legacy/src/libs/waiting-list/reducers';

import type { CoachState } from '@bsport/saas-legacy/src/libs/associated-coach/types';
import type {
  ConsumerState,
  ConsumerStateReworked,
} from '@bsport/saas-legacy/src/libs/consumer-space/types';
import type { CheckoutState } from '@bsport/saas-legacy/src/libs/checkout/types';
import type { CustomFormState } from '@bsport/saas-legacy/src/libs/custom-form/types';
import type { ExportableComponentsState } from '@bsport/saas-legacy/src/libs/exportable-components/types';
import type { FranchiseState } from '@bsport/saas-legacy/src/libs/franchise/types';
import type { GiftcardState } from '@bsport/saas-legacy/src/libs/giftcard/types';
import type { GroupOfferState } from '@bsport/saas-legacy/src/libs/group-offer/types';
import type { InvoiceState } from '@bsport/saas-legacy/src/libs/invoice/types';
import type { LevelState } from '@bsport/saas-legacy/src/libs/level/types';
import type { MemberState } from '@bsport/saas-legacy/src/libs/member/types';
import type { MembershipState } from '@bsport/saas-legacy/src/libs/membership/types';
import type { PaymentBackendState } from '@bsport/saas-legacy/src/libs/payment/types';
import type { PaymentModuleState } from '@bsport/saas-legacy/src/libs/payment/payment-module-revamped/types';
import type { PrivateServiceState } from '@bsport/saas-legacy/src/libs/private-service/types';
import type { ReferralState } from '@bsport/saas-legacy/src/libs/referral/types';
import type { RelationshipState } from '@bsport/saas-legacy/src/libs/relationship/types';
import type { RoleState } from '@bsport/saas-legacy/src/libs/role/types';
import type { SpotSchedulingState } from '@bsport/saas-legacy/src/libs/spot-scheduling/types';
import type { SubscriptionState } from '@bsport/saas-legacy/src/libs/subscription/types';
import type { TagState } from '@bsport/saas-legacy/src/libs/tag/types';
import type { ThemeState } from '@bsport/saas-legacy/src/libs/theme/types';
import type { WaitingListState } from '@bsport/saas-legacy/src/libs/waiting-list/types';
import type { createBrowserHistory } from 'history';

//  -----------------------------------------

// FROM WIDGET ONLY
//  -----------------------------------------
import modal, { ModalState } from '../libs/modal/reducers';
import widget, { WidgetState } from '../libs/widget/reducers';

//  -----------------------------------------

const reducer = (history: ReturnType<typeof createBrowserHistory>) =>
  combineReducers({
    router: connectRouter(history),
    auth: authReducers,
    category,
    checkout,
    coach: associatedCoach,
    consumerPaymentPack,
    consumer,
    consumerReworked,
    customForm,
    establishment,
    exportableComponent,
    franchise,
    giftcard,
    groupOffer,
    invoice,
    level,
    marketplace,
    member,
    membership,
    metaActivity,
    modal,
    offer,
    paymentBackend,
    paymentCombo,
    paymentModule,
    paymentPack,
    playlist,
    privateService,
    referral,
    relationship,
    role,
    shop: shopReducers,
    snackbar,
    spotScheduling,
    subscription,
    tag,
    theme: themeReducers,
    video,
    waitingList,
    widget,
  });

export interface RootState {
  router: ReturnType<typeof connectRouter>;
  auth: any;
  category: any;
  checkout: CheckoutState;
  coach: CoachState;
  consumerPaymentPack: any;
  consumer: ConsumerState;
  consumerReworked: ConsumerStateReworked;
  customForm: CustomFormState;
  establishment: any;
  exportableComponent: ExportableComponentsState;
  franchise: FranchiseState;
  giftcard: GiftcardState;
  groupOffer: GroupOfferState;
  invoice: InvoiceState;
  level: LevelState;
  marketplace: any;
  member: MemberState;
  membership: MembershipState;
  metaActivity: any;
  modal: ModalState;
  offer: any;
  paymentBackend: PaymentBackendState;
  paymentCombo: any;
  paymentModule: PaymentModuleState;
  paymentPack: any;
  playlist: any;
  privateService: PrivateServiceState;
  referral: ReferralState;
  relationship: RelationshipState;
  role: RoleState;
  shop: any;
  snackbar: any;
  spotScheduling: SpotSchedulingState;
  subscription: SubscriptionState;
  tag: TagState;
  theme: ThemeState;
  video: any;
  waitingList: WaitingListState;
  widget: WidgetState;
}

export default (history: ReturnType<typeof createBrowserHistory>) =>
  (state: any, action: any) =>
    reducer(history)(state, action);
