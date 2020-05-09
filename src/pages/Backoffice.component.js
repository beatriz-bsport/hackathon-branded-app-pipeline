// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { push } from 'react-router-redux';
import Intercom from 'react-intercom';

import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { Context } from '../context';

import { getAuthToken } from '../http';
import { getTheme } from '../theme';
import withSentryErrorReporting from '../hocs/error-boundary.hoc';
import ResponsiveDrawer from '../components/navigation/ResponsiveDrawer.component';
import LoadingBackoffice from '../components/navigation/LoadingBackoffice.component';

import { refresh as refreshActions } from '../actions';
import { fetchCompanyTheme } from '../libs/theme/actions';
import { getPermissions } from '../libs/role/selectors';
import { getTempPasswordState } from '../libs/login/selectors';
import { generateTempPassword, fetchTempPassword } from '../libs/login/actions';
import {
  delete_ as deleteAlert,
  fetchMoreAlertingKind,
  fetchAll as fetchAllAlertings,
} from '../libs/alerting/actions';
import asyncComponent from '../AsyncComponent';
import Config from '../config';

import { MarketingDashboard, MarketingRule } from './marketing';
import alertingSelectors from '../libs/alerting/selectors';
import { fetchAccessLevel } from '../actions/auth.actions';

import type { TempPasswordState } from '../libs/login/types';

const Dashboard = asyncComponent(() => import('./Dashboard.component'));

const OfferFormPage = asyncComponent(() => import('./OfferFormPage.component'));
const Settings = asyncComponent(() => import('./settings/Settings.component'));
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
  refresh: () => void,
  alertings: Array<Alerting>,
  nbAlerting: number,
  isRefreshing: boolean,
  authenticated: boolean,
  permission: Permission,

  fetchAccessLevel: (token: string, username: string) => void,
  disconnect: () => void,
  deleteAlert: (id: number) => void,
  classes: Object,
  username: string,
  refreshIfNeeded: () => void,
  fetchMoreAlertingKind: (number) => void,
  fetchCompanyTheme: () => void,
  fetchAllAlertings: () => void,
  theme: any,

  tempPasswordState: TempPasswordState,
  fetchTempPassword: () => void,
  generateTempPassword: () => void,

  openCalendar: () => void,
  openCreateMember: () => void,
};

const BackofficeRoute = withSentryErrorReporting(() => (
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
    <Route path="/marketing/rule/:id" component={MarketingRule} />
    <Route path="/smart-list" component={SmartList} />
    <Route path="/marketing" component={MarketingDashboard} />
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
    <Route path="/" component={PlanningRouter} />
  </Switch>
));

export class Backoffice extends Component<Props, State> {
  refreshInterval: ?Interval;

  state = {
    displayLeftMenu: true,
  };

  componentWillMount() {
    document.title = 'Backoffice - bsport';
    this.refreshInterval = setInterval(this.props.fetchAllAlertings, 120000);
    this.props.fetchAccessLevel(getAuthToken(), this.props.username);
  }

  componentDidMount() {
    this.props.refreshIfNeeded();
    this.props.fetchCompanyTheme();
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

    if (!this.props.authenticated) {
      return <Redirect to="/login" />;
    }
    const token = getAuthToken();
    if (!getAuthToken() || token === 'null') {
      return <Redirect to="/login/signout" />;
    }
    const intercom_user = {
      email: this.props.username,
    };

    if (this.props.isRefreshing) {
      return <LoadingBackoffice />;
    }
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <Context.Provider
          value={{
            ...this.state,
            hideLeftMenuAction: this.hideLeftMenuAction.bind(this),
            showLeftMenuAction: this.showLeftMenuAction.bind(this),
          }}
        >
          <ResponsiveDrawer
            onRefresh={this.props.refresh}
            isRefreshing={this.props.isRefreshing}
            logo={this.props.theme ? this.props.theme.cover : null}
            alertings={this.props.alertings}
            nbAlerting={this.props.nbAlerting}
            deleteAlert={this.props.deleteAlert}
            hidden={!this.props.permission.navigation}
            disconnect={this.props.disconnect}
            displayLeftMenu={this.state.displayLeftMenu}
            fetchMoreAlertingKind={this.props.fetchMoreAlertingKind}
            showSearch={this.props.permission.member.search}
            tempPasswordState={this.props.tempPasswordState}
            generateTempPassword={this.props.generateTempPassword}
            fetchTempPassword={this.props.fetchTempPassword}
            openCreateMember={this.props.openCreateMember}
            openCalendar={this.props.openCalendar}
          >
            {Config.REACT_APP_SENTRY_ENVIRONMENT === 'production' ||
            Config.REACT_APP_SENTRY_ENVIRONMENT === 'staging' ? (
              <Intercom
                appID="q6foivp2"
                {...intercom_user}
                action_color={this.props.theme.primary_color}
              />
            ) : null}

            <main className={classes.content}>
              <BackofficeRoute />
            </main>
          </ResponsiveDrawer>
        </Context.Provider>
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

export default connect(
  (state) => ({
    alertings: alertingSelectors.getByKind(state),
    nbAlerting: alertingSelectors.countAlerting(state),
    authenticated: state.auth.authenticated,
    username: state.auth.username,
    isRefreshing: state.refresh.isRefreshing,
    theme: state.theme.theme,
    permission: getPermissions(state),

    is_consumer: state.auth.is_consumer && !state.auth.is_manager,

    tempPasswordState: getTempPasswordState(state),
  }),
  {
    fetchCompanyTheme,
    fetchAccessLevel,
    disconnect: () => push('/login/signout'),
    refreshIfNeeded: refreshActions.refreshIfNeeded,
    refresh: refreshActions.forceRefresh,

    fetchAllAlertings,
    fetchMoreAlertingKind,
    deleteAlert,

    generateTempPassword,
    fetchTempPassword,

    openCalendar: () => push('/calendar'),
    openCreateMember: () => push('/member/add'),
  },
)(themedBackoffice);
