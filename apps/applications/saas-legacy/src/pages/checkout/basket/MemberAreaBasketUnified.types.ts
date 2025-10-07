import type { TFunction } from 'i18next';
import { CouponErrorCodes } from '#src/libs/coupon/constants';
import type { Basket, BasketAddress } from '#src/libs/checkout/types';
import type { Coupon } from '#src/libs/coupon/types';
import type { InstalmentPayment } from '#src/libs/instalment-payment-configuration/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { Offer } from '#src/libs/offer/types';
import type {
  Establishment,
  EstablishmentBillingGroup,
} from '#src/libs/establishment/types';
import type {
  APIPollOptionCallback,
  OptionCallback,
  OptionCallBackWithKeyedCallbacks,
} from '#src/state/types';
import type { CompanyTheme } from '#src/libs/theme/types';

export type MemberAreaBasketUnifiedPageProps = {
  // Core data
  basket: Basket | null;
  basketOffers: Array<Offer<number, Establishment, MetaActivity>>;
  auth: any;
  theme: CompanyTheme | null;
  classes: Object;

  // Company and theme
  companyId: number;
  companyThemeLoading: boolean;
  fetchCompanyTheme: (companyId: number) => void;
  retrieveCompanyCssConfiguration: (companyid: number) => void;

  // Loading and processing
  loading: boolean;
  processing: boolean;
  paymentProcessing: boolean;
  setPaymentProcessing: (process: boolean) => void;
  basketItemRemovalStatusLoading: boolean;
  detachPaymentMethodLoading: boolean;

  // Basket actions
  addItemToBasket: (
    basketId: string,
    data: any,
    options?: OptionCallback,
  ) => void;
  removeItemFromBasket: (basketId: string, data: any) => void;
  patchCurrentBasket: (
    basketAddress: BasketAddress,
    options: OptionCallback,
  ) => void;
  refreshBasket: () => void;
  checkItemsBasket: (basketId: string) => boolean;
  fetchInstalmentPaymentByBasket: (basketId: string) => void;
  assignInstalmentPayment: (
    basket: string,
    instalment_payment_id: number,
    options: OptionCallback<Basket>,
  ) => void;

  // Coupon and payment
  attachCoupon: (
    basketId: string,
    code: string,
    options?: OptionCallBackWithKeyedCallbacks<Coupon, CouponErrorCodes>,
    hideSnackBar?: boolean,
  ) => void;
  fetchPaymentMethod: (params: any) => void;
  detachPaymentMethod: (pm_id: string) => void;
  useInternalAccount: (amount: number) => void;
  onRemoveInternalAccountPrepaidLine: () => void;

  // Billing group
  updateMemberBillingGroup: (establishmentBillingGroupId: number) => void;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  defaultEstablishmentBillingGroup: EstablishmentBillingGroup;
  fetchAllEstablishmentBillingGroup: () => void;

  // Misc fetches
  fetchShopItemFeatured: (companyId: number) => void;
  fetchProfile: () => void;
  fetchMember: (id: number) => void;
  fetchMembership: (id: number) => void;

  // Monitoring
  monitorExpiredItemRemoval: (
    companyId: number,
    checkoutItemId: string,
    pollOptionCallback?: APIPollOptionCallback,
  ) => void;

  // Navigation
  goBack: () => void;
  goToMarketplace: () => void;
  goToCalendar: () => void;
  goToMyProfile: () => void;

  // Query params
  queryParams: any;
  setQueryParams: (arg0: string, arg1: string) => void;

  // Snackbar
  snackbarError: (arg0: string) => void;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;

  // Payment pack/combo
  creditAccountBalance: number | null;
  paymentPackOrComboCanNotBookAllOffers: boolean;
  setPaymentPackOrComboCanNotBookAllOffers: (value: boolean) => void;
  instalmentPaymentConfigurationList: Array<InstalmentPayment>;

  // i18n
  t: TFunction;

  // Success callback
  onSuccess: () => void;
  fetchOfferBulk: Function;
  fetchMetaActivityBulk: Function;
  fetchEstablishmentBulk: Function;
  fetchCurrentBasket: Function;
};
