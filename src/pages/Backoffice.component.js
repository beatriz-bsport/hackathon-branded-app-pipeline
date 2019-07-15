// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Intercom from 'react-intercom';

import ResponsiveDrawer from '../components/navigation/ResponsiveDrawer.component';

import { refresh as refreshActions } from '../actions';
import { delete_ as deleteAlert } from '../libs/alerting/actions';
import asyncComponent from '../AsyncComponent';

import { MarketingDashboard, MarketingRule } from './marketing';

import alertingSelectors from '../libs/alerting/selectors';

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

const PlanningRouter = asyncComponent(() =>
  import('./planning/Planning.router'),
);
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
const Order = asyncComponent(() => import('./order/Order.router'));
const Subscription = asyncComponent(() =>
  import('./subscription/Subscription.router'),
);

type Props = {
  refresh: () => void,
  alertings: Array<Alerting>,
  nbAlerting: number,
  isRefreshing: boolean,
  deleteAlert: (id: number) => void,
  classes: Object,
  authenticated: boolean,
  username: string,
  refreshIfNeeded: () => void,
};

export class Backoffice extends Component<Props> {
  componentWillMount() {
    document.title = 'Backoffice - bsport';
  }

  componentDidMount() {
    this.props.refreshIfNeeded();
  }

  render() {
    const { classes } = this.props;

    if (!this.props.authenticated) {
      return <Redirect to="/login" />;
    }
    const intercom_user = {
      email: this.props.username,
    };
    return (
      <ResponsiveDrawer
        onRefresh={this.props.refresh}
        isRefreshing={this.props.isRefreshing}
        alertings={this.props.alertings}
        nbAlerting={this.props.nbAlerting}
        deleteAlert={this.props.deleteAlert}
      >
        <Intercom appID="q6foivp2" {...intercom_user} />

        <main className={classes.content}>
          <Switch>
            <Route path="/shop" component={Shop} />
            <Route path="/offer/:id" component={OfferManagement} />
            <Route exact path="/calendar" component={PlanningRouter} />
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
            <Route path="/marketing" component={MarketingDashboard} />
            <Route path="/reporting/" component={Reporting} />
            <Route path="/order" component={Order} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/search/results" component={SearchResults} />
            <Route path="/settings/" component={Settings} />
            <Route path="/" component={PlanningRouter} />
          </Switch>
        </main>
      </ResponsiveDrawer>
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
    alertings: alertingSelectors.get(state),
    nbAlerting: alertingSelectors.countAlerting(state),
    authenticated: state.auth.authenticated,
    username: state.auth.username,
    isRefreshing: state.refresh.isRefreshing,
  }),
  {
    deleteAlert,
    refreshIfNeeded: refreshActions.refreshIfNeeded,
    refresh: refreshActions.forceRefresh,
  },
)(themedBackoffice);
