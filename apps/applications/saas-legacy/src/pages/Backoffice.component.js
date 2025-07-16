import React, { Component } from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { CircularProgress, Typography } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import clsx from 'clsx';
import { DateTime } from 'luxon';
import Intercom from '#src/components/intercom/Intercom.component';
import {
  retrieveStripeAccountStatusAction,
  retrieveStripeCompanyAction,
  getFeatureList,
} from '#src/libs/company/actions';
import { userAcknowlegdePlatformTutorial } from '#src/libs/platform-tutorial/selectors';
import type { DeleteAlert } from '#src/libs/alerting/types';
import {
  fetchMyLastClockin as fetchMyLastClockinAction,
  clockIn as clockInAction,
  clockOut as clockOutAction,
  getStaffsAttendanceRealTime as getStaffsAttendanceRealTimeAction,
} from '#src/libs/clock-in/actions';
import {
  getMyLastClockin,
  getUsersPaginatedWithRolesWithRealTimeAttendance,
} from '#src/libs/clock-in/selectors';
import {
  fetchBatchUnreadAnswersCounts as fetchBatchUnreadAnswersCountsAction,
  fetchInboxThreadList as fetchInboxThreadListAction,
} from '#src/libs/communication-v2/actions';
import { fetchInboxThreadListWithContextParamsAndUpdateUnreadCounts } from '#src/libs/communication-v2/utils';
import { AlertKind } from '../libs/alerting/constants';
import {
  BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
  BsportRequestFromHeaderValue,
} from '../constants';
import FeatureBase from '#src/components/feature-base/FeatureBase.component';
import FeatureBaseSurvey from '#src/components/feature-base/FeatureBaseSurvey.component';
import i18n, { setLuxonLocale } from '../i18n/index';
import GenericResponsiveDialog from '../components/genericDialog/GenericResponsiveDialog';
import RELEASE from '../release';
import { retrievePlatformSubscriptionPaymentStatusAction } from '../libs/platform-billing/actions';
import { DrawerContext, PermissionContext } from '../context';

import { getAuthToken } from '../http';
import { getTheme } from '../theme';
import withSentryErrorReporting from '../hocs/error-boundary.hoc';
import BackofficeDrawer from '../components/navigation/BackofficeDrawer/BackofficeDrawer.component';
import LoadingBackoffice from '../components/navigation/LoadingBackoffice.component';

import withOpenEvent from '../hocs/tracking/open-event.hoc';

import { fetchCompanyTheme } from '../libs/theme/actions';

import { fetchCashBook, updateCashBook } from '../libs/cashbook/actions';

// FIXME clean that
// // -------------------------
import { fetchSCT } from '../libs/category/actions';
import { fetchPaymentPackList as fetchPaymentPackListAction } from '../libs/payment-packs/actions';
import { fetchShopItemAsManager as fetchShop } from '../libs/shop/actions/shopitem';
import {
  fetchAllCoachPaymentRules,
  fetchAllCoachPaymentRuleGroups,
} from '../libs/coach-payment-rules/actions';
import { fetchAllPrivateSlots } from '../libs/private-service/actions';
import { fetchOnSpotPaymentReport as fetchOnSpotPaymentReportAction } from '../libs/payment/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoaches } from '../libs/associated-coach/actions';
// -----------------------------
//
//
import { getPermissions, getObjectPermissions } from '../libs/role/selectors';
import { ObjectLevelPermissions } from '../libs/role/types';
import { parseRestrictedPath } from '../libs/role/utils';
import {
  fetchUserTutorialCompletion,
  updateUserAcknowlegdeTutorial,
  updateTutorialLessonViewedStatus,
} from '../libs/platform-tutorial/actions';
import { getTempPasswordState } from '../libs/login/selectors';
import {
  generateTempPassword,
  fetchTempPassword,
  checkEmailValidation as checkEmailValidationAction,
} from '../libs/login/actions';
import {
  fetchMoreAlertingKind,
  fetchAll as fetchAllAlertings,
  fetch as fetchAlerting,
  deleteAlert,
} from '../libs/alerting/actions';
import asyncComponent from '../AsyncComponent';
import Config from '../config';

import alertingSelectors from '../libs/alerting/selectors';
import {
  fetchAccessLevel,
  navigateBackToFranchise as navigateBackToFranchiseAction,
  stampLastPlatformSubscriptionWarningDateAction,
  stampLastPlatformSubscriptionDisputeWarningDateAction,
  stampLastStripeAccountConfigurationWarningDateAction,
} from '../actions/auth.actions';

import type { TempPasswordState } from '../libs/login/types';
import {
  fetchCompanyRoles,
  fetchCompanyUserRolesPaginated as fetchCompanyUserRolesPaginatedAction,
} from '../libs/role/actions';
import GenericDialog from '../components/genericDialog/GenericDialog';
import { fetchSignFormUpConfiguration } from '../libs/sign-up-form/actions';

import { fetchTags } from '../libs/tag/actions';

import {
  fetchCompanyCustomMemberForm,
  fetchCompanyCustomSignUp,
} from '../libs/custom-form/actions';
import { BannerProvider } from '../hocs/banner.hoc';
import withRudderStackHistoryTracker from '../components/analytics/rudderstack/with-rudderstack-history-tracking';
import { withAccessControlCheckInScanner } from '../libs/access-control/hooks/accessControlCheckingScanner.hoc';
import { getSegmentAnalyticsToWindow } from '../components/analytics/segment/utils';

import RegularizingInvoiceInformation from '../libs/settings/components/RegularizingInvoiceInformation.component';
import StripeAccountConfiguration from '../libs/settings/components/NeedStripeAccountConfiguration.component';
import type { PlatformSubscriptionPaymentStatus } from '../libs/platform-billing/type';
import {
  BLOCK_BACKOFFICE,
  WARN,
  FAILED_PAYMENT,
  DISPUTED_PAYMENT,
} from '../libs/platform-billing/constant';
import type { StripeAccountStatus, StripeCompany } from '../libs/company/types';
import { getCurrentLanguageIsoCode } from '../utils/language';
import type { OptionCallback } from '../state/types';
import { getStripeOnboardingPending } from '../libs/company/selectors';
import { checkMemberInEstablishment as checkMemberInEstablishmentAction } from '../libs/access-control/actions';
import { getEstablishmentsSelectedInRole } from '../libs/establishment/selectors';
import {
  STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN,
  STORAGE_KEY_BSPORT_IMPERSONATED_TOKEN,
} from '../actions/constants';
import {
  getItemInStorage,
  removeItemInStorage,
  setItemInStorage,
} from '../utils/storage';
import { fetchPlatformCustomerEntity as fetchPlatformCustomerEntityAction } from '#src/libs/platform-billing/actions';

import { RegularizingVatInformationDialog } from '#src/libs/platform-billing/components/RegularizingVatInformationDialog.component';

import { retrieveCommunicationSMSProviderVerification } from '../libs/communication-v2/actions';
import { AuthState } from '#src/libs/types';
import WidgetUtils from '#src/libs/widget/WidgetUtils';

const CompanyDetailPage = asyncComponent(() =>
  import('./settings/CompanyDetailPage.page'),
);

const PlatformBillingSettingPage = asyncComponent(() =>
  import('./settings/PlatformBillingSetting.page'),
);

const MarketingRouter = asyncComponent(() =>
  import('./marketing/Marketing.router'),
);

const PerformanceTracking = asyncComponent(() =>
  import('./performance-tracking/PerformanceTracking.router'),
);

const Replacement = asyncComponent(() =>
  import('./replacement/Replacement.router'),
);

const Dashboard = asyncComponent(() => import('./Dashboard.page'));

const OfferFormPage = asyncComponent(() => import('./OfferFormPage.component'));
const Settings = asyncComponent(() => import('./settings/Settings.router'));
const OfferManagement = asyncComponent(() =>
  import('./offer-management/OfferManagement.page'),
);
const SearchResults = asyncComponent(() => import('./SearchResults.component'));
const Shop = asyncComponent(() => import('./shop/Shop.router'));
const Reporting = asyncComponent(() => import('./reporting/Reporting.router'));
const Analytics = asyncComponent(() => import('./analytics/Analytics.router'));
const SubscriptionEvents = asyncComponent(() =>
  import('./subscription-events/SubscriptionEvents.router'),
);
const TrialAnalysis = asyncComponent(() =>
  import('./trial-analysis/TrialAnalysis.router'),
);
const InsightsCompany = asyncComponent(() =>
  import('./insights-company/InsightsCompany.router'),
);
const PaymentCombo = asyncComponent(() =>
  import('./payment-combo/PaymentCombo.router'),
);

const VodRouter = asyncComponent(() => import('./video/Vod.router'));

const PlanningRouter = asyncComponent(() =>
  import('./planning/Planning.router'),
);
const Schedule = asyncComponent(() => import('./Schedule.page'));
const Establishment = asyncComponent(() =>
  import('./establishment/Establishment.router'),
);
const Coach = asyncComponent(() => import('./coach/Coach.router'));
const MetaActivity = asyncComponent(() =>
  import('./meta-activity/MetaActivity.router'),
);
const PaymentPack = asyncComponent(() =>
  import('./payment-pack/PaymentPack.router'),
);
const InstalmentPayment = asyncComponent(() =>
  import(
    './instalment-payment-configuration/InstalmentPaymentConfiguration.router'
  ),
);
const Member = asyncComponent(() => import('./member/Member.router'));
const WorkshopActivity = asyncComponent(() =>
  import('./workshop-activity/WorkshopActivity.router'),
);
const Invoice = asyncComponent(() => import('./invoice/Invoice.router'));
const Expense = asyncComponent(() => import('./expense/Expense.router'));
const Coupon = asyncComponent(() => import('./coupon/Coupon.router'));
const Order = asyncComponent(() => import('./order/Order.router'));
const PrivateService = asyncComponent(() =>
  import('./private-service/PrivateService.router'),
);
const EmailTemplate = asyncComponent(() =>
  import('./email-template/EmailTemplate.router'),
);
const SmartList = asyncComponent(() => import('./smart-list/SmartList.router'));

const Cadence = asyncComponent(() => import('./cadence/Cadence.router'));
const Subscription = asyncComponent(() =>
  import('./subscription/Subscription.router'),
);

const SpotScheduling = asyncComponent(() =>
  import('./spot-scheduling/SpotScheduling.pages'),
);

const CustomForm = asyncComponent(() =>
  import('./custom-form/CustomForm.router'),
);

const Giftcard = asyncComponent(() => import('./giftcard/Giftcard.router'));

const ClockIn = asyncComponent(() => import('./clock-in/ClockIn.router'));

const CompanyOnboarding = asyncComponent(() =>
  import('./settings/CompanyOnboardingSetting.page'),
);

const Tutorial = asyncComponent(() => import('./tutorial/Tutorial.router'));
const FeatureBaseRouter = asyncComponent(() =>
  import('./feature-base/FeatureBase.router'),
);
const Inbox = asyncComponent(() => import('./inbox/Inbox.router'));

const AccessMonitoring = asyncComponent(() =>
  import('./access-monitoring/AccessMonitoring.router'),
);

type Props = {
  isStripeOnboardingPending: boolean,
  nbAlerting: number,
  countAlertingCommunication: number,
  nbTutorialAlerting: number,
  userAcknowlegdePlatformTutorial: boolean,
  permissions: RolePermission,
  platformSubscriptionPaymentStatus: PlatformSubscriptionPaymentStatus,
  fetchAccessLevel: (token: string) => void,
  disconnect: () => void,
  deleteAlert: DeleteAlert,
  loadingImpersonation: boolean,
  classes: Object,
  username: string,
  fetchMoreAlertingKind: (number) => void,
  fetchCompanyTheme: () => void,
  getFeatureList: () => void,
  fetchCashBook: () => void,
  fetchAllAlertings: () => void,
  fetchAlerting: (alertKind: number, pageSize: number) => void,
  theme: any,
  themeLoading: boolean,
  featureListLoading: boolean,

  browserLocation: Location,
  fetchSignFormUpConfiguration: () => void,

  tempPasswordState: TempPasswordState,
  fetchTempPassword: () => void,
  generateTempPassword: () => void,

  openCalendar: () => void,
  openCreateMember: () => void,

  fetchSCT: (params: any) => void,
  fetchPaymentPackList: (params: any) => void,
  fetchShop: () => void,
  fetchAllCoachPaymentRules: () => void,
  fetchAssociatedCoaches: () => void,
  fetchAllCoachPaymentRuleGroups: () => void,
  fetchAllPrivateSlots: () => void,
  fetchPlatformCustomerEntity: () => void,
  platformCustomerEntity: PlatformCustomerEntity,
  pushRouter: (string) => void,

  fetchTags: () => void,

  checkEmailValidation: () => void,
  checkingEmailValidation: boolean,
  name?: string,
  cashBook: dict,
  updateCashBook: () => void,
  fetchOnSpotPaymentReport: () => void,
  onSpotPaymentReportId: number,
  roleId: number,
  storedToken: string,
  fetchCompanyRoles: () => void,
  rolesLoading: boolean,
  fetchSignFormUpConfiguration: () => void,

  navigateBackToFranchise: () => void,
  t: TFunction,
  fetchCompanyCustomMemberForm: (prams: { company: number }) => void,
  fetchCompanyCustomSignUp: (prams: { company: number }) => void,
  featureList: Array<{
    upsell_identifier: number,
    readable_identifier: string,
  }>,
  objectLevelPermissions: ObjectLevelPermissions,

  lastClockin: LastClockIn,
  usersPaginatedWithRoles: {
    loading: boolean,
    count: number,
    results: UserCurrentAttendance[],
  },
  getStaffsAttendanceRealTime: (params: {
    page: number,
    page_size: number,
  }) => Promise<void>,
  clockIn: (
    params: { userId?: number },
    options?: OptionCallback,
  ) => Promise<void>,
  fetchCompanyUserRolesPaginated: (
    params: {
      page: number,
      page_size: number,
    },
    options?: OptionPaginatedCallback<Role>,
  ) => Promise<void>,
  clockOut: (
    params: {
      clockInId: number,
    },
    options?: OptionCallback<void>,
  ) => Promise<void>,
  fetchMyLastClockin: ({}) => void,
  retrieveStripeCompany: () => void,
  stripeCompany: StripeCompany,
  lastPlatformSubscriptionWarningDate: string,
  lastPlatformSubscriptionDisputeWarningDate: string,
  stampLastPlatformSubscriptionWarningDate: () => void,
  stampLastPlatformSubscriptionDisputeWarningDate: (
    options?: OptionCallback,
  ) => void,
  retrievePlatformSubscriptionPaymentStatus: () => void,
  stampLastStripeAccountConfigurationWarningDate: () => void,
  retrieveStripeAccountStatus: () => void,
  stripeAccountStatus: StripeAccountStatus,
  lastStripeConfigurationWarningDate: string,
  fetchUserTutorialCompletion: () => void,
  updateUserAcknowlegdeTutorial: () => void,
  updateTutorialLessonViewedStatus: (
    params?: TutorialLessonUserStatusQueryParams,
    options?: OptionCallback<TutorialCompletion>,
  ) => void,
  fetchInboxThreadList: (
    params: InboxThreadListParams,
    isThreadListReinitialized?: boolean,
    options?: OptionCallback<CommunicationThread[]>,
  ) => void,
  fetchBatchUnreadAnswersCounts: (
    params: { thread_ids: number[] },
    options?: OptionCallback,
  ) => void,
  userAuthState: AuthState,
  retrieveCommunicationSMSProviderVerification: () => void,
};

const DELAY_BETWEEN_ALERTS = 10 * 60000;

const BackofficeRoute = withSentryErrorReporting((props) => {
  if (props.blockBackofficeToPayPlatformBilling) {
    return (
      <Switch>
        <Route
          component={PlatformBillingSettingPage}
          path="/settings/platform-billing"
        />

        <Redirect to="/settings/platform-billing" />
      </Switch>
    );
  }
  if (props.blockBackofficeToConfigureStripe) {
    return (
      <Switch>
        <Route
          component={CompanyOnboarding}
          path="/settings/company_onboarding"
        />
        <Route component={CompanyDetailPage} path="/settings/company" />

        <Redirect to="/settings/company" />
      </Switch>
    );
  }
  return (
    <Switch>
      <Route
        component={Shop}
        path={props.theme.display_new_webshop ? '/shop/:tab' : '/shop'}
      />
      {props.theme.display_new_webshop && (
        <Redirect from="/shop" to="/shop/products" />
      )}
      <Route component={OfferManagement} path="/offer/:id" />
      <Route exact component={PlanningRouter} path="/calendar" />
      <Route component={Schedule} path="/schedule" />
      <Route exact component={OfferFormPage} path="/add-offers/:id" />
      <Route component={Coach} path="/coach" />
      <Route component={PaymentPack} path="/payment-pack" />
      <Route component={Invoice} path="/invoice" />
      <Route component={Expense} path="/expense" />
      <Route component={Subscription} path="/subscription" />
      <Route component={Tutorial} path="/tutorial" />
      {Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' && (
        <Route component={FeatureBaseRouter} path="/feature-base" />
      )}
      <Route component={Member} path="/member" />
      <Route component={MetaActivity} path="/activity" />
      <Route component={WorkshopActivity} path="/workshop-activity" />
      <Route component={Establishment} path="/establishment" />
      <Route component={SmartList} path="/smart-list" />
      <Route component={Cadence} path="/audience" />
      <Route component={CustomForm} path="/custom-form" />
      <Route component={PerformanceTracking} path="/performance-tracking" />
      <Route component={Replacement} path="/replacement/:tab" />
      <Route component={InstalmentPayment} path="/instalment-payment" />
      <Route component={MarketingRouter} path="/marketing" />
      <Route component={EmailTemplate} path="/email-template" />
      <Route component={Giftcard} path="/giftcard" />
      <Route component={Reporting} path="/reporting/" />
      <Route component={Analytics} path="/analytics/" />
      <Route component={SubscriptionEvents} path="/subscription-events/" />
      <Route component={TrialAnalysis} path="/trial-analysis/" />
      <Route component={InsightsCompany} path="/insights-company/" />
      <Route component={PaymentCombo} path="/combo/" />
      <Route component={PrivateService} path="/private-service" />
      <Route component={Order} path="/order" />
      <Route exact component={Dashboard} path="/dashboard" />
      <Route exact component={SearchResults} path="/search/results" />
      <Route component={Settings} path="/settings/:tab/" />
      <Route component={Coupon} path="/coupon" />
      <Route component={ClockIn} path="/clock-in/:tab?" />
      <Route component={SpotScheduling} path="/spot-scheduling/:id" />
      <Route component={() => <div />} path="/empty" />
      <Route component={Inbox} path="/inbox" />
      <Route component={AccessMonitoring} path="/access-monitoring/:tab" />
      {(Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
        props.vodEnabled) && <Route component={VodRouter} path="/vod" />}
      <Route component={PlanningRouter} path="/" />
    </Switch>
  );
});

const ALERTING_REFRESH_INTERVAL = 120000;

export class Backoffice extends Component<Props, State> {
  refreshInterval: ?Interval;

  state = {
    displayLeftMenu: true,
    need_regularizing_failed_invoice_modal: false,
    need_regularizing_disputed_invoice_modal: false,
    need_regularizing_vat_information_modal: false,
  };

  countAlerting: number = 0;

  UNSAFE_componentWillMount() {
    document.title = 'Backoffice - bsport';
    this.refreshInterval = setInterval(() => {
      if (ALERTING_REFRESH_INTERVAL * this.countAlerting > 60 * 1000 * 60 * 2)
        // 2h
        return;
      this.props.fetchAllAlertings();
    }, ALERTING_REFRESH_INTERVAL);
    this.props.fetchAccessLevel(getAuthToken());
    setItemInStorage(
      'local',
      BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
      BsportRequestFromHeaderValue.SAAS_BACKOFFICE,
    );
    getSegmentAnalyticsToWindow();
    this.props.fetchCompanyTheme();
    this.props.fetchCompanyRoles();
    this.props.getFeatureList();
    this.props.checkEmailValidation();
    this.props.fetchAllAlertings();
    this.props.fetchSCT({ as_company: true });
    this.props.fetchPaymentPackList({ disabled: false, page_size: 70000 });
    this.props.fetchShop();
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAllCoachPaymentRuleGroups();
    this.props.fetchMyLastClockin({});
    this.props.fetchAllPrivateSlots();
    this.props.fetchSignFormUpConfiguration();
    this.props.fetchTags();
    this.props.fetchUserTutorialCompletion();

    this.props.retrieveCommunicationSMSProviderVerification();
    if (
      this.props.fetchInboxThreadList &&
      this.props.fetchBatchUnreadAnswersCounts
    ) {
      fetchInboxThreadListWithContextParamsAndUpdateUnreadCounts(
        'member',
        null,
        this.props.fetchInboxThreadList,
        this.props.fetchBatchUnreadAnswersCounts,
      );
    }

    if (this.props.theme && this.props.theme.company) {
      this.props.fetchCompanyCustomSignUp({
        company: this.props.theme.company,
      });
      this.props.fetchCompanyCustomMemberForm(this.props.theme.company);
    }
    this.props.retrieveStripeCompany();
    this.props.retrievePlatformSubscriptionPaymentStatus({
      onSuccess: () => {
        this.props.retrieveStripeAccountStatus();
      },
    });
    this.props.fetchPlatformCustomerEntity({
      onSuccess: () => {
        this.checkVatInformation();
      },
    });
    const { language } = i18n;
    setLuxonLocale(language);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.stripeAccountStatus !== this.props.stripeAccountStatus &&
      this.props.stripeAccountStatus
    ) {
      this.checkPlatformSubscriptionPaymentStatusAndStripeConfiguration();
    }
  }

  openFailedPaymentWarningDialog = () => {
    this.setState(
      {
        need_regularizing_failed_invoice_modal: true,
      },
      () => {
        this.props.stampLastPlatformSubscriptionWarningDate();
        this.checkPaymentDisputed();
      },
    );
  };

  openDisputedPaymentWarningDialog = () => {
    this.setState(
      {
        need_regularizing_disputed_invoice_modal: true,
      },
      () => {
        this.props.stampLastPlatformSubscriptionDisputeWarningDate();
        this.checkStripeAccountConfiguration();
      },
    );
  };

  checkContextToOpenDisputedPaymentWarningDialog = () => {
    if (this.state.need_regularizing_failed_invoice_modal) {
      setTimeout(this.openDisputedPaymentWarningDialog, DELAY_BETWEEN_ALERTS);
    } else {
      this.openDisputedPaymentWarningDialog();
    }
  };

  checkPaymentFailed = () => {
    if (
      (!this.props.lastPlatformSubscriptionWarningDate ||
        !DateTime.fromISO(
          this.props.lastPlatformSubscriptionWarningDate,
        ).hasSame(DateTime.now(), 'day')) &&
      !!this.props.platformSubscriptionPaymentStatus.failed?.length &&
      this.props.stripeAccountStatus?.action !== BLOCK_BACKOFFICE
    ) {
      this.openFailedPaymentWarningDialog();
    } else {
      this.checkPaymentDisputed();
    }
  };

  checkPaymentDisputed = () => {
    if (
      (!this.props.lastPlatformSubscriptionDisputeWarningDate ||
        !DateTime.fromISO(
          this.props.lastPlatformSubscriptionDisputeWarningDate,
        ).hasSame(DateTime.now(), 'day')) &&
      !!this.props.platformSubscriptionPaymentStatus.disputed?.length &&
      this.props.stripeAccountStatus?.action !== BLOCK_BACKOFFICE
    ) {
      this.checkContextToOpenDisputedPaymentWarningDialog();
    } else {
      this.checkStripeAccountConfiguration();
    }
  };

  checkPlatformSubscriptionPaymentStatusAndStripeConfiguration = () => {
    switch (this.props.platformSubscriptionPaymentStatus?.action) {
      case BLOCK_BACKOFFICE:
        this.setState({
          need_regularizing_failed_invoice_modal:
            this.props.platformSubscriptionPaymentStatus?.blocking ===
            FAILED_PAYMENT,
          need_regularizing_disputed_invoice_modal:
            this.props.platformSubscriptionPaymentStatus?.blocking ===
            DISPUTED_PAYMENT,
        });
        return;

      case WARN:
        this.checkPaymentFailed();
        return;

      default:
        this.checkStripeAccountConfiguration();
    }
  };

  checkVatInformation = () => {
    if (
      this.props.platformCustomerEntity.is_vat_id_collection_required &&
      this.props.platformCustomerEntity.is_valid_vat_id_missing
    ) {
      this.setState({ need_regularizing_vat_information_modal: true });
    }
  };

  checkStripeAccountConfiguration = () => {
    switch (this.props.stripeAccountStatus?.action) {
      case BLOCK_BACKOFFICE:
        this.setState({ need_configuring_stripe_account_dialog: true });
        return;

      case WARN:
        if (
          !this.props.lastStripeConfigurationWarningDate ||
          !DateTime.fromISO(
            this.props.lastStripeConfigurationWarningDate,
          ).hasSame(DateTime.now(), 'day')
        ) {
          this.openStripeConfigurationModal();
        }
        break;

      default:
        break;
    }
  };

  openStripeConfigurationModal = () => {
    if (
      this.state.need_regularizing_failed_invoice_modal ||
      this.state.need_regularizing_disputed_invoice_modal
    ) {
      setTimeout(() => {
        this.setState(
          { need_configuring_stripe_account_dialog: true },
          this.props.stampLastStripeAccountConfigurationWarningDate,
        );
      }, DELAY_BETWEEN_ALERTS);
    } else {
      this.setState(
        { need_configuring_stripe_account_dialog: true },
        this.props.stampLastStripeAccountConfigurationWarningDate,
      );
    }
  };

  redirect = (path: string) => () => {
    this.props.pushRouter(path);
  };

  componentWillUnmount() {
    removeItemInStorage('local', BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION);
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  hideLeftMenuAction() {
    this.setState({ displayLeftMenu: false });
  }

  showLeftMenuAction() {
    this.setState({ displayLeftMenu: true });
  }

  redirectToPlatformBilling = () => {
    this.props.pushRouter('/settings/platform-billing');
    this.setState({
      need_regularizing_failed_invoice_modal: false,
      need_regularizing_disputed_invoice_modal: false,
    });
  };

  redirectToCompanySettings = () => {
    this.props.pushRouter('/settings/company');
    this.setState({
      need_configuring_stripe_account_dialog: false,
      need_regularizing_vat_information_modal: false,
    });
  };

  deleteAlert = (alert_kind: number, id: number) =>
    this.props.deleteAlert(alert_kind, id, {
      onSuccess: () => this.props.fetchAlerting(alert_kind, 1),
    });

  closePaymentWarningDialog = (
    paymentStatusContext: typeof DISPUTED_PAYMENT | typeof FAILED_PAYMENT,
  ) => {
    return this.props.platformSubscriptionPaymentStatus?.action === WARN
      ? () => {
          if (paymentStatusContext === DISPUTED_PAYMENT) {
            this.setState({
              need_regularizing_disputed_invoice_modal: false,
            });
          } else {
            this.setState({
              need_regularizing_failed_invoice_modal: false,
            });
          }
        }
      : undefined;
  };

  render() {
    const { classes } = this.props;
    if (this.props.loadingImpersonation) {
      return (
        <div className={classes.fullPage}>
          <div className={classes.loading}>
            <CircularProgress />
            <div className={classes.loadingTitle}>
              <Typography variant="h4">
                {this.props.t('backofficeMenu.redirecting')}
              </Typography>
            </div>
          </div>
        </div>
      );
    }

    if (
      ((this.props.themeLoading || this.props.featureListLoading) &&
        !this.props.browserLocation.pathname.includes('settings')) ||
      this.props.checkingEmailValidation ||
      this.props.rolesLoading ||
      !this.props.permissions
    ) {
      return <LoadingBackoffice />;
    }

    if (
      this.props.permissions &&
      this.props.permissions.restrictedPaths &&
      this.props.permissions.restrictedPaths.length
    ) {
      let navigationIsAuthorized = false;
      this.props.permissions.restrictedPaths.forEach((p) => {
        const cleanedPath = parseRestrictedPath(p);
        navigationIsAuthorized =
          navigationIsAuthorized ||
          window.location.pathname.includes(cleanedPath);
      });
      if (!navigationIsAuthorized) {
        return (
          <Redirect
            to={parseRestrictedPath(this.props.permissions.restrictedPaths[0])}
          />
        );
      }
    }
    const { language } = i18n;
    const isoLanguage = getCurrentLanguageIsoCode(language);

    const isInboxPath = this.props.browserLocation.pathname.includes('/inbox/');

    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <PermissionContext.Provider value={this.props.permissions}>
          <DrawerContext.Provider
            value={{
              ...this.state,
              hideLeftMenuAction: this.hideLeftMenuAction.bind(this),
              showLeftMenuAction: this.showLeftMenuAction.bind(this),
            }}
          >
            <BannerProvider>
              <BackofficeDrawer
                autoFocusMemberSearchBar={
                  !this.props.browserLocation.pathname.includes(
                    'access-monitoring',
                  )
                }
                clockIn={this.props.clockIn}
                clockOut={this.props.clockOut}
                companyId={this.props.theme.company}
                companyName={this.props.theme.company_name}
                countAlertingCommunication={
                  this.props.countAlertingCommunication
                }
                deleteAlert={this.deleteAlert}
                disconnect={this.props.disconnect}
                displayLeftMenu={this.state.displayLeftMenu}
                email={this.props.username}
                featureList={this.props.featureList}
                fetchCashBook={this.props.fetchCashBook}
                fetchCompanyUserRolesPaginated={
                  this.props.fetchCompanyUserRolesPaginated
                }
                fetchMoreAlertingKind={this.props.fetchMoreAlertingKind}
                fetchMyLastClockin={this.props.fetchMyLastClockin}
                fetchOnSpotPaymentReport={this.props.fetchOnSpotPaymentReport}
                fetchTempPassword={this.props.fetchTempPassword}
                generateTempPassword={this.props.generateTempPassword}
                getStaffsAttendanceRealTime={
                  this.props.getStaffsAttendanceRealTime
                }
                isFranchisorNavigation={
                  !!getItemInStorage(
                    'session',
                    STORAGE_KEY_BSPORT_IMPERSONATED_ORIGIN_TOKEN,
                  )
                }
                lastClockIn={this.props.lastClockin}
                logo={this.props.theme ? this.props.theme.cover : null}
                name={this.props.name}
                navigateBackToFranchisor={this.props.navigateBackToFranchise}
                nbAlerting={this.props.nbAlerting}
                nbTutorialAlerting={this.props.nbTutorialAlerting}
                objectLevelPermissions={this.props.objectLevelPermissions}
                onSpotPaymentReportId={this.props.onSpotPaymentReportId}
                onSubmit={this.props.updateCashBook}
                openCalendar={this.props.openCalendar}
                openCreateMember={this.props.openCreateMember}
                paymentMethodMissing={
                  this.props.stripeCompany &&
                  !this.props.stripeCompany
                    ?.has_no_need_for_payment_method_configuration &&
                  this.props.theme.payment_method_missing
                }
                permissions={this.props.permissions}
                push={this.props.pushRouter}
                revampedBackofficeEnabled={
                  !!this.props.userAuthState?.has_enabled_revamped_backoffice
                }
                stripeOnboardingPending={this.props.isStripeOnboardingPending}
                tempPasswordState={this.props.tempPasswordState}
                theme={this.props.theme}
                updateUserAcknowlegdeTutorial={
                  this.props.updateUserAcknowlegdeTutorial
                }
                userAcknowlegdePlatformTutorial={
                  this.props.userAcknowlegdePlatformTutorial
                }
                usersPaginatedWithRoles={this.props.usersPaginatedWithRoles}
              >
                {!isInboxPath && (
                  <Intercom
                    company={
                      this.props.theme && this.props.theme.company_name
                        ? {
                            name: this.props.theme.company_name,
                            id: this.props.theme.company,
                          }
                        : {}
                    }
                    email={this.props.username}
                    environment={Config.REACT_APP_SENTRY_ENVIRONMENT || 'dev'}
                    theme={this.props.theme}
                    {...(this.props.name ? { name: this.props.name } : {})}
                    action_color={this.props.theme.primary_color}
                    language_override={isoLanguage}
                    release={RELEASE}
                    role={this.props.permissions.name}
                    user_id={this.props.username}
                  />
                )}

                <main
                  className={clsx({
                    [classes.content]: true,
                    [classes.fullContent]:
                      this.props.browserLocation.pathname.includes(
                        '/spot-scheduling',
                      ) ||
                      this.props.browserLocation.pathname.includes(
                        '/audience/',
                      ) ||
                      this.props.browserLocation.pathname.includes('/inbox/') ||
                      this.props.browserLocation.pathname.includes(
                        '/analytics/',
                      ) ||
                      this.props.browserLocation.pathname.includes(
                        '/subscription-events/',
                      ) ||
                      this.props.browserLocation.pathname.includes(
                        '/trial-analysis/',
                      ) ||
                      this.props.browserLocation.pathname.includes(
                        '/insights-company/',
                      ),
                  })}
                >
                  <BackofficeRoute
                    blockBackofficeToConfigureStripe={
                      this.props.stripeAccountStatus?.action ===
                      BLOCK_BACKOFFICE
                    }
                    blockBackofficeToPayPlatformBilling={
                      this.props.platformSubscriptionPaymentStatus?.action ===
                      BLOCK_BACKOFFICE
                    }
                    theme={this.props.theme}
                    vodEnabled={this.props.theme?.vod ?? null}
                  />
                </main>
              </BackofficeDrawer>
            </BannerProvider>
            <GenericDialog />
          </DrawerContext.Provider>
        </PermissionContext.Provider>
        {this.props.platformSubscriptionPaymentStatus && (
          <div>
            <GenericResponsiveDialog
              open={!!this.state.need_regularizing_failed_invoice_modal}
            >
              <RegularizingInvoiceInformation
                cancel={this.closePaymentWarningDialog(FAILED_PAYMENT)}
                contactSupport={this.redirectToPlatformBilling}
                goNext={this.redirectToPlatformBilling}
                paymentStatusContext={FAILED_PAYMENT}
              />
            </GenericResponsiveDialog>
            <GenericResponsiveDialog
              open={!!this.state.need_regularizing_disputed_invoice_modal}
            >
              <RegularizingInvoiceInformation
                cancel={this.closePaymentWarningDialog(DISPUTED_PAYMENT)}
                contactSupport={this.redirectToPlatformBilling}
                goNext={this.redirectToPlatformBilling}
                paymentStatusContext={DISPUTED_PAYMENT}
              />
            </GenericResponsiveDialog>
          </div>
        )}
        <GenericResponsiveDialog
          open={this.state.need_regularizing_vat_information_modal}
        >
          <RegularizingVatInformationDialog
            cancel={() => {
              this.setState({
                need_regularizing_vat_information_modal: false,
              });
            }}
            goNext={this.redirectToCompanySettings}
          />
        </GenericResponsiveDialog>
        {this.props.stripeAccountStatus && (
          <GenericResponsiveDialog
            open={!!this.state.need_configuring_stripe_account_dialog}
          >
            <StripeAccountConfiguration
              cancel={
                this.props.stripeAccountStatus.action === WARN
                  ? () => {
                      this.setState({
                        need_configuring_stripe_account_dialog: false,
                      });
                    }
                  : undefined
              }
              contactSupport={this.redirectToCompanySettings}
              dateAccountIsBlocked={
                this.props.stripeAccountStatus.action === BLOCK_BACKOFFICE
                  ? undefined
                  : this.props.stripeAccountStatus?.date_account_blocked
              }
              goNext={this.redirectToCompanySettings}
            />
          </GenericResponsiveDialog>
        )}
        {Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' &&
          !WidgetUtils.isWidget() && <FeatureBaseSurvey />}
      </MuiThemeProvider>
    );
  }
}

const styles = (theme: Object) => ({
  content: {
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  fullContent: {
    display: 'flex',
    flex: 1,
    width: '100%',
    height: '100%',
  },
  toolbar: theme.mixins.toolbar,
  progress: {
    flexGrow: 1,
  },
  fullPage: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loadingTitle: {
    marginTop: theme.spacing(4),
  },
});

const themedBackoffice = withStyles(styles)(Backoffice);

export default compose(
  withOpenEvent('backoffice'),
  withTranslation('navigation'),
  connect(
    (state) => ({
      isStripeOnboardingPending: getStripeOnboardingPending(state),
      nbAlerting: alertingSelectors.countAlerting(state),
      countAlertingCommunication: alertingSelectors.countAlertingForKind(
        state,
        AlertKind.UNREAD_COMMUNICATION,
      ),
      nbTutorialAlerting: alertingSelectors.countTutorialAlerting(state),
      userAcknowlegdePlatformTutorial: userAcknowlegdePlatformTutorial(state),
      username: state.auth.username,
      userAuthState: state.auth,
      name: state.auth.name,
      roleId: state.auth.role,
      loadingImpersonation: state.auth.loadingImpersonation,
      theme: state.theme.theme,
      themeLoading: state.theme.loading,
      featureListLoading: state.company.feature.loading,
      checkingEmailValidation: state.login.emailValidation.loading,
      permissions: getPermissions(state),
      onSpotPaymentReportId: state.paymentBackend.onSpotPaymentReport.id,
      is_consumer: state.auth.is_consumer && !state.auth.is_manager,
      featureList: state.company.feature.data.upsell,
      objectLevelPermissions: getObjectPermissions(state),

      tempPasswordState: getTempPasswordState(state),
      roleById: state.role.role.byId,
      rolesLoading: state.role.role.loading,

      usersPaginatedWithRoles:
        getUsersPaginatedWithRolesWithRealTimeAttendance(state),
      lastClockin: getMyLastClockin(state),
      lastPlatformSubscriptionWarningDate:
        state.auth.lastPlatformSubscriptionWarningDate,
      lastPlatformSubscriptionDisputeWarningDate:
        state.auth.lastPlatformSubscriptionDisputeWarningDate,
      lastStripeConfigurationWarningDate:
        state.auth.lastStripeConfigurationWarningDate,

      stripeCompany: state.company.stripeCompany.data,
      platformSubscriptionPaymentStatus:
        state.platformBilling.subscriptionPaymentStatus.data,
      platformCustomerEntity:
        state.platformBilling.platformCustomerEntity?.data,
      platformCustomerEntityLoading:
        state.platformBilling.platformCustomerEntity?.loading,
      stripeAccountStatus: state.company.stripeAccountStatus.data,
      establishmentsSelectedInRole: getEstablishmentsSelectedInRole(state),
    }),
    {
      fetchBatchUnreadAnswersCounts: fetchBatchUnreadAnswersCountsAction,
      fetchInboxThreadList: fetchInboxThreadListAction,
      retrievePlatformSubscriptionPaymentStatus:
        retrievePlatformSubscriptionPaymentStatusAction,
      retrieveStripeAccountStatus: retrieveStripeAccountStatusAction,
      fetchCompanyTheme,
      fetchTags,
      fetchCompanyRoles,
      getFeatureList,
      fetchAccessLevel,
      checkEmailValidation: checkEmailValidationAction,
      fetchOnSpotPaymentReport: fetchOnSpotPaymentReportAction,
      signout: (companyId) =>
        push(`/login/signout${companyId ? `?membership=${companyId}` : ''}`),

      fetchAllAlertings,
      fetchAlerting,
      deleteAlert,
      fetchMoreAlertingKind,

      fetchSCT,
      fetchPaymentPackList: fetchPaymentPackListAction,
      fetchShop,
      fetchAllCoachPaymentRules,
      fetchAllCoachPaymentRuleGroups,
      fetchAssociatedCoaches,
      fetchAllPrivateSlots,

      generateTempPassword,
      fetchTempPassword,

      openCalendar: () => push('/calendar'),
      openCreateMember: () => push('/member/add'),
      pushRouter: push,

      fetchCashBook,
      updateCashBook,
      fetchSignFormUpConfiguration,

      navigateBackToFranchise: navigateBackToFranchiseAction,
      fetchCompanyCustomMemberForm,
      fetchCompanyCustomSignUp,
      retrieveStripeCompany: retrieveStripeCompanyAction,

      getStaffsAttendanceRealTime: getStaffsAttendanceRealTimeAction,
      fetchCompanyUserRolesPaginated: fetchCompanyUserRolesPaginatedAction,
      fetchMyLastClockin: fetchMyLastClockinAction,
      clockOut: clockOutAction,
      clockIn: clockInAction,

      stampLastPlatformSubscriptionWarningDate:
        stampLastPlatformSubscriptionWarningDateAction,
      stampLastPlatformSubscriptionDisputeWarningDate:
        stampLastPlatformSubscriptionDisputeWarningDateAction,
      stampLastStripeAccountConfigurationWarningDate:
        stampLastStripeAccountConfigurationWarningDateAction,
      fetchUserTutorialCompletion,
      updateUserAcknowlegdeTutorial,
      updateTutorialLessonViewedStatus,
      checkMemberInEstablishment: checkMemberInEstablishmentAction,

      fetchPlatformCustomerEntity: fetchPlatformCustomerEntityAction,
      getStripeOnboardingPending,
      retrieveCommunicationSMSProviderVerification,
    },
  ),
  withHandlers({
    disconnect:
      ({ signout, theme }) =>
      () => {
        signout(theme.company);
      },
    checkEmailValidation:
      ({ checkEmailValidation, pushRouter, username }) =>
      () => {
        checkEmailValidation(null, {
          onError: (err) => {
            if (
              err &&
              err.response &&
              err.response.data &&
              !err.response.data.validated
            ) {
              pushRouter('/login/company_onboarding/confirmation');
            }
          },
        });
      },
  }),
  withRudderStackHistoryTracker,
  withAccessControlCheckInScanner,
)(themedBackoffice);
