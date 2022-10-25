// @flow

import React, { Component } from 'react';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push } from 'connected-react-router';
import Intercom from 'react-intercom';
import { compose, withHandlers } from 'recompose';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { CircularProgress, Typography } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import clx from 'classnames';
import moment from 'moment-timezone';
import i18n from '../i18n/index';
import {
  retrieveStripeAccountStatusAction,
  retrieveStripeCompanyAction,
  getFeatureList,
} from '#libs/company/actions';
import GenericResponsiveDialog from '../components/genericDialog/GenericResponsiveDialog';
import Analytics from '../components/analytics/Analytics.component';
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
import { fetchPaymentRules } from '../libs/payment-rules/actions';
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
import {
  getPermissions,
  getAllRoles,
  getUsersPaginatedWithRole,
} from '../libs/role/selectors';
import { parseRestrictedPath } from '../libs/role/utils';
import { userAcknowlegdePlatformTutorial } from '#libs/platform-tutorial/selectors';
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
import { getSegmentAnalyticsToWindow } from '../components/analytics/segment/utils';

import {
  getLastClockin as getLastClockinAction,
  clockIn as clockInAction,
  clockOut as clockOutAction,
  getStaffsAttendanceRealTime as getStaffsAttendanceRealTimeAction,
} from '#libs/clock-in/actions';
import {
  getLastClockin,
  withRealTimeAttendance,
} from '#libs/clock-in/selectors';
import RegularizingInvoiceInformation from '../libs/settings/components/RegularizingInvoiceInformation.component';
import StripeAccountConfiguration from '../libs/settings/components/NeedStripeAccountConfiguration.component';
import type { PlatformSubscriptionPaymentStatus } from '../libs/platform-billing/type';
import { BLOCK_BACKOFFICE, WARN } from '../libs/platform-billing/constant';
import type { StripeAccountStatus, StripeCompany } from '../libs/company/types';
import { getCurrentLanguageIsoCode } from '../utils/language';
import { DeleteAlert } from '#libs/alerting/types';
import type { OptionCallback } from '../state/types';

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

const Dashboard = asyncComponent(() => import('./Dashboard.page'));

const OfferFormPage = asyncComponent(() => import('./OfferFormPage.component'));
const Settings = asyncComponent(() => import('./settings/Settings.router'));
const OfferManagement = asyncComponent(() =>
  import('./offer-management/OfferManagement.page'),
);
const SearchResults = asyncComponent(() => import('./SearchResults.component'));
const Shop = asyncComponent(() => import('./shop/Shop.router'));
const Reporting = asyncComponent(() => import('./reporting/Reporting.router'));
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

type Props = {
  alertings: Array<Alerting>,
  nbAlerting: number,
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

  location: Location,
  fetchSignFormUpConfiguration: () => void,

  tempPasswordState: TempPasswordState,
  fetchTempPassword: () => void,
  generateTempPassword: () => void,

  openCalendar: () => void,
  openCreateMember: () => void,

  fetchSCT: (params: any) => void,
  fetchPaymentPackList: (params: any) => void,
  fetchShop: () => void,
  fetchPaymentRules: () => void,
  fetchAllCoachPaymentRules: () => void,
  fetchAssociatedCoaches: () => void,
  fetchAllCoachPaymentRuleGroups: () => void,
  fetchAllPrivateSlots: () => void,
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
  isPluginActivated: boolean,
  fetchCompanyCustomMemberForm: (prams: { company: number }) => void,
  fetchCompanyCustomSignUp: (prams: { company: number }) => void,
  featureList: Array<{
    upsell_identifier: number,
    readable_identifier: string,
  }>,

  lastClockin: LastClockIn,
  roles: Role[],
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
  getLastClockin: ({}) => Promise<void>,
  retrieveStripeCompany: () => void,
  stripeCompany: StripeCompany,
  lastPlatformSubscriptionWarningDate: string,
  stampLastPlatformSubscriptionWarningDate: () => void,
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
};

const BackofficeRoute = withSentryErrorReporting((props) => {
  if (props.blockBackofficeToPayPlatformBilling) {
    return (
      <Switch>
        <Route
          path="/settings/platform-billing"
          component={PlatformBillingSettingPage}
        />

        <Redirect to="/settings/platform-billing" />
      </Switch>
    );
  }
  if (props.blockBackofficeToConfigureStripe) {
    return (
      <Switch>
        <Route
          path="/settings/company_onboarding"
          component={CompanyOnboarding}
        />
        <Route path="/settings/company" component={CompanyDetailPage} />

        <Redirect to="/settings/company" />
      </Switch>
    );
  }
  return (
    <Switch>
      <Route path="/shop" component={Shop} />
      <Route path="/offer/:id" component={OfferManagement} />
      <Route exact path="/calendar" component={PlanningRouter} />
      <Route path="/schedule" component={Schedule} />
      <Route exact path="/add-offers/:id" component={OfferFormPage} />
      <Route path="/coach" component={Coach} />
      <Route path="/payment-pack" component={PaymentPack} />
      <Route path="/invoice" component={Invoice} />
      <Route path="/expense" component={Expense} />
      <Route path="/subscription" component={Subscription} />
      <Route path="/tutorial" component={Tutorial} />
      <Route path="/member" component={Member} />
      <Route path="/activity" component={MetaActivity} />
      <Route path="/workshop-activity" component={WorkshopActivity} />
      <Route path="/establishment" component={Establishment} />
      <Route path="/smart-list" component={SmartList} />
      <Route path="/custom-form" component={CustomForm} />
      <Route path="/performance-tracking" component={PerformanceTracking} />
      <Route path="/instalment-payment" component={InstalmentPayment} />
      <Route path="/marketing" component={MarketingRouter} />
      <Route path="/email-template" component={EmailTemplate} />
      <Route path="/giftcard" component={Giftcard} />
      <Route path="/reporting/" component={Reporting} />
      <Route path="/combo/" component={PaymentCombo} />
      <Route path="/private-service" component={PrivateService} />
      <Route path="/order" component={Order} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/search/results" component={SearchResults} />
      <Route path="/settings/:tab/" component={Settings} />
      <Route path="/coupon" component={Coupon} />
      <Route path="/clock-in/:tab?" component={ClockIn} />
      <Route path="/spot-scheduling/:id" component={SpotScheduling} />
      <Route path="/empty" component={() => <div />} />
      {(Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
        props.vodEnabled) && <Route path="/vod" component={VodRouter} />}
      <Route path="/" component={PlanningRouter} />
    </Switch>
  );
});

const ALERTING_REFRESH_INTERVAL = 120000;

export class Backoffice extends Component<Props, State> {
  refreshInterval: ?Interval;

  state = {
    displayLeftMenu: true,
    need_regularizing_invoice_modal: false,
  };

  countAlerting: number = 0;

  componentWillMount() {
    document.title = 'Backoffice - bsport';
    this.refreshInterval = setInterval(() => {
      if (ALERTING_REFRESH_INTERVAL * this.countAlerting > 60 * 1000 * 60 * 2)
        // 2h
        return;
      this.props.fetchAllAlertings();
    }, ALERTING_REFRESH_INTERVAL);
    this.props.fetchAccessLevel(getAuthToken());
  }

  componentDidMount() {
    getSegmentAnalyticsToWindow();
    this.props.fetchCompanyTheme();
    this.props.fetchCompanyRoles();
    this.props.getFeatureList();
    this.props.checkEmailValidation();
    this.props.fetchAllAlertings();
    this.props.fetchSCT({ as_company: true });
    this.props.fetchPaymentPackList({ disabled: false, page_size: 70000 });
    this.props.fetchShop();
    this.props.fetchPaymentRules();
    this.props.fetchAllCoachPaymentRules();
    this.props.fetchAllCoachPaymentRuleGroups();
    // this.props.fetchAssociatedCoaches();
    this.props.getLastClockin({});
    this.props.fetchAllPrivateSlots();
    this.props.fetchSignFormUpConfiguration();
    this.props.fetchTags();
    this.props.fetchUserTutorialCompletion();
    if (this.props.theme && this.props.theme.company) {
      this.props.fetchCompanyCustomSignUp({
        company: this.props.theme.company,
      });
      this.props.fetchCompanyCustomMemberForm({
        company: this.props.theme.company,
      });
    }
    this.props.retrieveStripeCompany();
    this.props.retrievePlatformSubscriptionPaymentStatus({
      onSuccess: () => {
        this.props.retrieveStripeAccountStatus();
      },
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (
      prevProps.stripeAccountStatus !== this.props.stripeAccountStatus &&
      this.props.stripeAccountStatus
    ) {
      this.checkPlatformSubscriptionPaymentStatusAndStripeConfiguration();
    }
  }

  checkPlatformSubscriptionPaymentStatusAndStripeConfiguration = () => {
    switch (this.props.platformSubscriptionPaymentStatus?.action) {
      case BLOCK_BACKOFFICE:
        this.setState({ need_regularizing_invoice_modal: true });
        return;

      case WARN:
        if (
          (!this.props.lastPlatformSubscriptionWarningDate ||
            !moment(this.props.lastPlatformSubscriptionWarningDate).isSame(
              moment(),
              'day',
            )) &&
          this.props.stripeAccountStatus?.action !== BLOCK_BACKOFFICE
        ) {
          this.setState(
            {
              need_regularizing_invoice_modal: true,
            },
            () => {
              this.props.stampLastPlatformSubscriptionWarningDate();
              this.checkStripeAccountConfiguration();
            },
          );
          return;
        }
        this.checkStripeAccountConfiguration();
        return;

      default:
        this.checkStripeAccountConfiguration();
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
          !moment(this.props.lastStripeConfigurationWarningDate).isSame(
            moment(),
            'day',
          )
        ) {
          this.openStripeConfigurationModal();
        }
        break;

      default:
        break;
    }
  };

  openStripeConfigurationModal = () => {
    if (this.state.need_regularizing_invoice_modal) {
      setTimeout(() => {
        this.setState(
          { need_configuring_stripe_account_dialog: true },
          this.props.stampLastStripeAccountConfigurationWarningDate,
        );
      }, 10 * 60000);
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
    this.setState({ need_regularizing_invoice_modal: false });
  };

  redirectToCompanySettings = () => {
    this.props.pushRouter('/settings/company');
    this.setState({ need_configuring_stripe_account_dialog: false });
  };

  deleteAlert = (alert_kind: number, id: number) =>
    this.props.deleteAlert(alert_kind, id, {
      onSuccess: () => this.props.fetchAlerting(alert_kind, 1),
    });

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
        !this.props.location.pathname.includes('settings')) ||
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
                logo={this.props.theme ? this.props.theme.cover : null}
                fetchCashBook={this.props.fetchCashBook}
                onSpotPaymentReportId={this.props.onSpotPaymentReportId}
                theme={this.props.theme}
                onSubmit={this.props.updateCashBook}
                alertings={this.props.alertings}
                nbAlerting={this.props.nbAlerting}
                nbTutorialAlerting={this.props.nbTutorialAlerting}
                userAcknowlegdePlatformTutorial={
                  this.props.userAcknowlegdePlatformTutorial
                }
                updateUserAcknowlegdeTutorial={
                  this.props.updateUserAcknowlegdeTutorial
                }
                deleteAlert={this.deleteAlert}
                disconnect={this.props.disconnect}
                displayLeftMenu={this.state.displayLeftMenu}
                fetchMoreAlertingKind={this.props.fetchMoreAlertingKind}
                tempPasswordState={this.props.tempPasswordState}
                generateTempPassword={this.props.generateTempPassword}
                paymentMethodMissing={
                  this.props.stripeCompany &&
                  !this.props.stripeCompany
                    ?.has_no_need_for_payment_method_configuration &&
                  this.props.theme.payment_method_missing
                }
                stripeOnboardingPending={
                  this.props.stripeCompany &&
                  !this.props.stripeCompany
                    ?.has_no_need_for_stripe_configuration &&
                  !!this.props.alertings
                    .filter((ag) => (ag.results || []).length)
                    .find((ag) => ag.alert_kind === '5')
                    ?.results?.filter((a) =>
                      ['verification', 'creation'].includes(a?.data?.type),
                    )?.length
                }
                fetchTempPassword={this.props.fetchTempPassword}
                openCreateMember={this.props.openCreateMember}
                openCalendar={this.props.openCalendar}
                push={this.props.pushRouter}
                fetchOnSpotPaymentReport={this.props.fetchOnSpotPaymentReport}
                permissions={this.props.permissions}
                isFranchisorNavigation={
                  !!window.localStorage.getItem('bsport:franchise:http:token')
                }
                navigateBackToFranchisor={this.props.navigateBackToFranchise}
                companyName={this.props.theme.company_name}
                name={this.props.name}
                email={this.props.username}
                companyId={this.props.theme.company}
                featureList={this.props.featureList}
                lastClockIn={this.props.lastClockin}
                clockIn={this.props.clockIn}
                roles={this.props.roles}
                usersPaginatedWithRoles={this.props.usersPaginatedWithRoles}
                getStaffsAttendanceRealTime={
                  this.props.getStaffsAttendanceRealTime
                }
                fetchCompanyUserRolesPaginated={
                  this.props.fetchCompanyUserRolesPaginated
                }
                clockOut={this.props.clockOut}
                getLastClockin={this.props.getLastClockin}
              >
                {(Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' ||
                  Config.REACT_APP_SENTRY_ENVIRONMENT === 'staging') &&
                  !this.props.isPluginActivated &&
                  !this.props.theme.hide_intercom && (
                    <Intercom
                      appID="q6foivp2"
                      email={this.props.username}
                      company={
                        this.props.theme && this.props.theme.company_name
                          ? {
                              name: this.props.theme.company_name,
                              id: this.props.theme.company,
                            }
                          : {}
                      }
                      {...(this.props.name ? { name: this.props.name } : {})}
                      user_id={this.props.username}
                      environment={Config.REACT_APP_SENTRY_ENVIRONMENT || 'dev'}
                      release={RELEASE}
                      role={this.props.permissions.name}
                      action_color={this.props.theme.primary_color}
                      custom_launcher_selector="#intercomIcon"
                      language_override={isoLanguage}
                    />
                  )}

                <Analytics username={this.props.username} isInternal />
                <main
                  className={clx({
                    [classes.content]: true,
                    [classes.fullContent]:
                      this.props.location.pathname.includes('/spot-scheduling'),
                  })}
                >
                  <BackofficeRoute
                    vodEnabled={this.props.theme?.vod ?? null}
                    blockBackofficeToPayPlatformBilling={
                      this.props.platformSubscriptionPaymentStatus?.action ===
                      BLOCK_BACKOFFICE
                    }
                    blockBackofficeToConfigureStripe={
                      this.props.stripeAccountStatus?.action ===
                      BLOCK_BACKOFFICE
                    }
                  />
                </main>
              </BackofficeDrawer>
            </BannerProvider>
            <GenericDialog />
          </DrawerContext.Provider>
        </PermissionContext.Provider>
        {this.props.platformSubscriptionPaymentStatus && (
          <GenericResponsiveDialog
            open={this.state.need_regularizing_invoice_modal}
          >
            <RegularizingInvoiceInformation
              goNext={this.redirectToPlatformBilling}
              contactSupport={this.redirectToPlatformBilling}
              cancel={
                this.props.platformSubscriptionPaymentStatus?.action === WARN
                  ? () => {
                      this.setState({ need_regularizing_invoice_modal: false });
                    }
                  : undefined
              }
            />
          </GenericResponsiveDialog>
        )}
        {this.props.stripeAccountStatus && (
          <GenericResponsiveDialog
            open={this.state.need_configuring_stripe_account_dialog}
          >
            <StripeAccountConfiguration
              contactSupport={this.redirectToCompanySettings}
              dateAccountIsBlocked={
                this.props.stripeAccountStatus.action === BLOCK_BACKOFFICE
                  ? undefined
                  : this.props.stripeAccountStatus?.date_account_blocked
              }
              goNext={this.redirectToCompanySettings}
              cancel={
                this.props.stripeAccountStatus.action === WARN
                  ? () => {
                      this.setState({
                        need_configuring_stripe_account_dialog: false,
                      });
                    }
                  : undefined
              }
            />
          </GenericResponsiveDialog>
        )}
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
      alertings: alertingSelectors.getByKind(state),
      nbAlerting: alertingSelectors.countAlerting(state),
      nbTutorialAlerting: alertingSelectors.countTutorialAlerting(state),
      userAcknowlegdePlatformTutorial: userAcknowlegdePlatformTutorial(state),
      username: state.auth.username,
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

      tempPasswordState: getTempPasswordState(state),
      roleById: state.role.role.byId,
      rolesLoading: state.role.role.loading,

      roles: getAllRoles(state),
      usersPaginatedWithRoles: withRealTimeAttendance(
        getUsersPaginatedWithRole,
      )(state),
      lastClockin: getLastClockin(state),
      lastPlatformSubscriptionWarningDate:
        state.auth.lastPlatformSubscriptionWarningDate,
      lastStripeConfigurationWarningDate:
        state.auth.lastStripeConfigurationWarningDate,
      isPluginActivated: state.plugin.isPluginActivated,

      stripeCompany: state.company.stripeCompany.data,
      platformSubscriptionPaymentStatus:
        state.platformBilling.subscriptionPaymentStatus.data,
      stripeAccountStatus: state.company.stripeAccountStatus.data,
    }),
    {
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
      fetchPaymentRules,
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
      getLastClockin: getLastClockinAction,
      clockOut: clockOutAction,
      clockIn: clockInAction,

      stampLastPlatformSubscriptionWarningDate:
        stampLastPlatformSubscriptionWarningDateAction,
      stampLastStripeAccountConfigurationWarningDate:
        stampLastStripeAccountConfigurationWarningDateAction,
      fetchUserTutorialCompletion,
      updateUserAcknowlegdeTutorial,
      updateTutorialLessonViewedStatus,
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
              pushRouter(
                `/login/company_onboarding/email_validation/${encodeURIComponent(
                  username,
                )}`,
              );
            }
          },
        });
      },
  }),
  withRudderStackHistoryTracker,
)(themedBackoffice);
