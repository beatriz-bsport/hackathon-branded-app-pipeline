// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push } from 'connected-react-router';
import Intercom from 'react-intercom';
import { compose, withHandlers } from 'recompose';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { RoleType } from '@bsport/common/lib/master-data/user-role';
import Analytics from '../components/analytics/Analytics.component';
import RELEASE from '../release';

import { Context, PermissionContext } from '../context';

import { getAuthToken } from '../http';
import { getTheme } from '../theme';
import withSentryErrorReporting from '../hocs/error-boundary.hoc';
import ResponsiveDrawer from '../components/navigation/ResponsiveDrawer.component';
import LoadingBackoffice from '../components/navigation/LoadingBackoffice.component';
import withOpenEvent from '../hocs/tracking/open-event.hoc';

import { fetchCompanyTheme } from '../libs/theme/actions';
import { getFeatureList } from '../libs/company/actions';
import { fetchCashBook, updateCashBook } from '../libs/cashbook/actions';

// FIXME clean that
// // -------------------------
import { fetchSCT } from '../libs/category/actions';
import { fetchAllPaymentPacks } from '../libs/payment-packs/actions';
import { fetchShopItemAsManager as fetchShop } from '../libs/shop/actions/shopitem';
import { fetchPaymentRules } from '../libs/payment-rules/actions';
import { fetchOnSpotPaymentReport as fetchOnSpotPaymentReportAction } from '../libs/payment/actions';
import { fetchAssociatedCoachesList as fetchAssociatedCoaches } from '../libs/associated-coach/actions';
// -----------------------------
//
import { getPermissions } from '../libs/role/selectors';

import { getTempPasswordState } from '../libs/login/selectors';
import {
  generateTempPassword,
  fetchTempPassword,
  checkEmailValidation as checkEmailValidationAction,
} from '../libs/login/actions';
import {
  delete_ as deleteAlert,
  fetchMoreAlertingKind,
  fetchAll as fetchAllAlertings,
} from '../libs/alerting/actions';
import asyncComponent from '../AsyncComponent';
import Config from '../config';

import alertingSelectors from '../libs/alerting/selectors';
import { fetchAccessLevel } from '../actions/auth.actions';

import type { TempPasswordState } from '../libs/login/types';
import { fetchCompanyRoles } from '../libs/role/actions';

const MarketingRouter = asyncComponent(() =>
  import('./marketing/Marketing.router'),
);

const Dashboard = asyncComponent(() => import('./Dashboard.component'));

const OfferFormPage = asyncComponent(() => import('./OfferFormPage.component'));
const Settings = asyncComponent(() => import('./settings/Settings.router'));
const OfferManagement = asyncComponent(() =>
  import('./offer-management/OfferManagement.page'),
);
const SearchResults = asyncComponent(() => import('./SearchResults.component'));
const Shop = asyncComponent(() => import('./shop/Shop.router'));
const Reporting = asyncComponent(() =>
  import('./reporting/Reporting.component'),
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
const Member = asyncComponent(() => import('./member/Member.router'));
const WorkshopActivity = asyncComponent(() =>
  import('./workshop-activity/WorkshopActivity.router'),
);
const Invoice = asyncComponent(() => import('./invoice/Invoice.router'));
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

type Props = {
  alertings: Array<Alerting>,
  nbAlerting: number,
  permission: Permission,

  fetchAccessLevel: (token: string) => void,
  disconnect: () => void,
  deleteAlert: (id: number) => void,
  classes: Object,
  username: string,
  fetchMoreAlertingKind: (number) => void,
  fetchCompanyTheme: () => void,
  getFeatureList: () => void,
  fetchCashBook: () => void,
  fetchAllAlertings: () => void,
  theme: any,
  themeLoading: boolean,
  featureListLoading: boolean,

  location: Location,

  tempPasswordState: TempPasswordState,
  fetchTempPassword: () => void,
  generateTempPassword: () => void,

  openCalendar: () => void,
  openCreateMember: () => void,

  fetchSCT: (params: any) => void,
  fetchAllPaymentPacks: () => void,
  fetchShop: () => void,
  fetchPaymentRules: () => void,
  fetchAssociatedCoaches: () => void,
  pushRouter: (string) => void,

  checkEmailValidation: () => void,
  checkingEmailValidation: boolean,
  name?: string,
  cashBook: dict,
  updateCashBook: () => void,
  fetchOnSpotPaymentReport: () => void,
  onSpotPaymentReportId: number,
  roleId: number,
  fetchCompanyRoles: () => void,
  rolesLoading: boolean,
};

const BackofficeRoute = withSentryErrorReporting((props) => {
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
      <Route path="/subscription" component={Subscription} />
      <Route path="/member" component={Member} />
      <Route path="/activity" component={MetaActivity} />
      <Route path="/workshop-activity" component={WorkshopActivity} />
      <Route path="/establishment" component={Establishment} />
      <Route path="/smart-list" component={SmartList} />
      <Route path="/marketing" component={MarketingRouter} />
      <Route path="/email-template" component={EmailTemplate} />
      <Route path="/reporting/" component={Reporting} />
      <Route path="/combo/" component={PaymentCombo} />
      <Route path="/private-service" component={PrivateService} />
      <Route path="/order" component={Order} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/search/results" component={SearchResults} />
      <Route path="/settings/:tab/" component={Settings} />
      <Route path="/coupon" component={Coupon} />
      <Route path="/empty" component={() => <div />} />
      {(Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
        props.vodEnabled) && <Route path="/vod" component={VodRouter} />}
      <Route path="/" component={PlanningRouter} />
    </Switch>
  );
});

export class Backoffice extends Component<Props, State> {
  refreshInterval: ?Interval;

  state = {
    displayLeftMenu: true,
  };

  componentWillMount() {
    document.title = 'Backoffice - bsport';
    this.refreshInterval = setInterval(this.props.fetchAllAlertings, 120000);
    this.props.fetchAccessLevel(getAuthToken());
  }

  componentDidMount() {
    this.props.fetchCompanyTheme();
    this.props.fetchCompanyRoles();
    this.props.getFeatureList();
    this.setState({ authToken: getAuthToken() });
    this.props.checkEmailValidation();
    this.props.fetchAllAlertings();
    this.props.fetchSCT({ as_company: true });
    this.props.fetchAllPaymentPacks();
    this.props.fetchShop();
    this.props.fetchPaymentRules();
    this.props.fetchAssociatedCoaches();
  }

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

  render() {
    const { classes } = this.props;

    // dirty handling of double login
    const token = getAuthToken();
    if (
      !token ||
      token === 'null' ||
      (token !== this.state.authToken && !!this.state.authToken)
    ) {
      return (
        <Redirect
          to={`${'/double-login?membership='}${this.props.theme.company}`}
        />
      );
    }

    if (
      ((this.props.themeLoading || this.props.featureListLoading) &&
        !this.props.location.pathname.includes('settings')) ||
      this.props.checkingEmailValidation ||
      this.props.rolesLoading ||
      !this.props.permission
    ) {
      return <LoadingBackoffice />;
    }

    if (
      this.props.permission &&
      this.props.permission.restrictedPaths &&
      this.props.permission.restrictedPaths.length
    ) {
      let navigationIsAuthorized = false;
      this.props.permission.restrictedPaths.forEach((p) => {
        navigationIsAuthorized =
          navigationIsAuthorized || window.location.pathname.includes(p);
      });
      if (!navigationIsAuthorized) {
        return <Redirect to={this.props.permission.restrictedPaths[0]} />;
      }
    }

    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <PermissionContext.Provider value={this.props.permission}>
          <Context.Provider
            value={{
              ...this.state,
              hideLeftMenuAction: this.hideLeftMenuAction.bind(this),
              showLeftMenuAction: this.showLeftMenuAction.bind(this),
            }}
          >
            <ResponsiveDrawer
              logo={this.props.theme ? this.props.theme.cover : null}
              fetchCashBook={this.props.fetchCashBook}
              onSpotPaymentReportId={this.props.onSpotPaymentReportId}
              theme={this.props.theme}
              onSubmit={(data) => this.props.updateCashBook(data)}
              alertings={this.props.alertings}
              nbAlerting={this.props.nbAlerting}
              deleteAlert={this.props.deleteAlert}
              disconnect={this.props.disconnect}
              displayLeftMenu={this.state.displayLeftMenu}
              fetchMoreAlertingKind={this.props.fetchMoreAlertingKind}
              showSearch={this.props.permission.member.search}
              showActions={this.props.permission.appbarActions}
              tempPasswordState={this.props.tempPasswordState}
              generateTempPassword={this.props.generateTempPassword}
              fetchTempPassword={this.props.fetchTempPassword}
              openCreateMember={this.props.openCreateMember}
              openCalendar={this.props.openCalendar}
              push={this.props.pushRouter}
              fetchOnSpotPaymentReport={this.props.fetchOnSpotPaymentReport}
              permissions={this.props.permission}
              showCashBook={[
                RoleType.USER_ROLE_NO_RESTRICTION,
                RoleType.USER_ROLE_ADMIN,
              ].includes(this.props.roleId)}
            >
              {Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' ||
              Config.REACT_APP_SENTRY_ENVIRONMENT === 'dev' ||
              Config.REACT_APP_SENTRY_ENVIRONMENT === 'staging' ? (
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
                  role={this.props.permission.name}
                  action_color={this.props.theme.primary_color}
                />
              ) : null}
              <Analytics username={this.props.username} isInternal />
              <main className={classes.content}>
                <BackofficeRoute
                  vodEnabled={this.props.theme ? this.props.theme.vod : null}
                />
              </main>
            </ResponsiveDrawer>
          </Context.Provider>
        </PermissionContext.Provider>
      </MuiThemeProvider>
    );
  }
}

const styles = (theme: Object) => ({
  content: {
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  progress: {
    flexGrow: 1,
  },
});

const themedBackoffice = withStyles(styles)(Backoffice);

export default compose(
  withOpenEvent('backoffice'),
  connect(
    (state) => ({
      alertings: alertingSelectors.getByKind(state),
      nbAlerting: alertingSelectors.countAlerting(state),
      username: state.auth.username,
      name: state.auth.name,
      roleId: state.auth.role,
      theme: state.theme.theme,
      themeLoading: state.theme.loading,
      featureListLoading: state.company.feature.loading,
      checkingEmailValidation: state.login.emailValidation.loading,
      permission: getPermissions(state),
      onSpotPaymentReportId: state.paymentBackend.onSpotPaymentReport.id,

      is_consumer: state.auth.is_consumer && !state.auth.is_manager,

      tempPasswordState: getTempPasswordState(state),
      roleById: state.role.role.byId,
      rolesLoading: state.role.role.loading,
    }),
    {
      fetchCompanyTheme,
      fetchCompanyRoles,
      getFeatureList,
      fetchAccessLevel,
      checkEmailValidation: checkEmailValidationAction,
      fetchOnSpotPaymentReport: fetchOnSpotPaymentReportAction,
      signout: (companyId) =>
        push(`/login/signout${companyId ? `?membership=${companyId}` : ''}`),

      fetchAllAlertings,
      fetchMoreAlertingKind,
      deleteAlert,

      fetchSCT,
      fetchAllPaymentPacks,
      fetchShop,
      fetchPaymentRules,
      fetchAssociatedCoaches,

      generateTempPassword,
      fetchTempPassword,

      openCalendar: () => push('/calendar'),
      openCreateMember: () => push('/member/add'),
      pushRouter: push,

      fetchCashBook,
      updateCashBook,
    },
  ),
  withHandlers({
    disconnect: ({ signout, theme }) => () => {
      signout(theme.company);
    },
    checkEmailValidation: ({
      checkEmailValidation,
      pushRouter,
      username,
    }) => () => {
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
)(themedBackoffice);
