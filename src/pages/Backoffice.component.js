// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import { ResponsiveDrawer } from '../components';

import { refresh as refreshActions } from '../actions';

import Dashboard from './Dashboard.component';

import OfferFormPage from './OfferFormPage.component';
import Settings from './settings/Settings.component';

import {
  MetaActivityForm,
  MetaActivityEditForm,
  MetaActivityList,
  MetaActivity,
} from './meta-activity';
import { MarketingDashboard, MarketingRule } from './marketing';
import { InvoiceList, InvoiceCreate, InvoiceEdit } from './invoice';
import { PaymentPackList, PaymentPackForm } from './payment-pack';
import { CoachList, CoachPerformance, CoachForm } from './coach';
import { Member, MemberList, MemberForm } from './member';
import { EstablishmentMap, EstablishmentFormPage } from './establishment';
import OfferManagement from './offer-management/OfferManagement.component';
import SearchResults from './SearchResults.component';
import ShopManager from './shop/ShopManager.component';
import Reporting from './reporting/Reporting.component';
import PlanningRouter from './planning/Planning.router';

type Props = {
  refresh: () => void,
  isRefreshing: boolean,
  classes: Object,
  authenticated: boolean,
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
    return (
      <ResponsiveDrawer
        onRefresh={this.props.refresh}
        isRefreshing={this.props.isRefreshing}
      >
        <main className={classes.content}>
          <div>
            <Switch>
              <Route path="/shop" component={ShopManager} />
              <Route path="/offer/:id" component={OfferManagement} />
              <Route exact path="/calendar" component={PlanningRouter} />
              <Route exact path="/activity" component={MetaActivityList} />
              <Route
                exact
                path="/activity/:id/edit"
                component={MetaActivityEditForm}
              />
              <Route path="/activity/:id" component={MetaActivity} />
              <Route exact path="/add-offers/:id" component={OfferFormPage} />
              <Route
                exact
                path="/coach/:associatedCoachId/performance"
                component={CoachPerformance}
              />
              <Route
                exact
                path="/meta-activity/add"
                component={MetaActivityForm}
              />
              <Route exact path="/coach/add" component={CoachForm} />
              <Route exact path="/coach/edit/:id" component={CoachForm} />
              <Route path="/coach" component={CoachList} />
              <Route path="/invoice/:id" component={InvoiceEdit} />
              <Route path="/invoice" component={InvoiceList} />
              <Route path="/payment-pack/add" component={PaymentPackForm} />
              <Route
                path="/payment-pack/:id/edit"
                component={PaymentPackForm}
              />
              <Route path="/payment-pack" component={PaymentPackList} />
              <Route exact path="/member" component={MemberList} />
              <Route exact path="/member/edit/:id" component={MemberForm} />
              <Route
                exact
                path="/member/add-invoice/:id"
                component={InvoiceCreate}
              />
              <Route path="/member/add" component={MemberForm} />
              <Route path="/member/:id" component={Member} />
              <Route exact path="/map" component={EstablishmentMap} />
              <Route
                exact
                path="/establishments/add"
                component={EstablishmentFormPage}
              />
              <Route
                exact
                path="/establishments/edit/:id"
                component={EstablishmentFormPage}
              />
              <Route path="/marketing/rule/:id" component={MarketingRule} />
              <Route path="/marketing" component={MarketingDashboard} />
              <Route path="/reporting/" component={Reporting} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/search/results" component={SearchResults} />
              <Route path="/settings/" component={Settings} />
              <Route path="/" component={PlanningRouter} />
            </Switch>
          </div>
        </main>
      </ResponsiveDrawer>
    );
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    isRefreshing: state.refresh.isRefreshing,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    refreshIfNeeded() {
      dispatch(refreshActions.refreshIfNeeded());
    },
    refresh() {
      dispatch(refreshActions.forceRefresh());
    },
  };
}

const styles = (theme: Object) => ({
  content: {
    backgroundColor: theme.palette.background.default,
    // paddingTop: theme.spacing.unit * 3,
    // [theme.breakpoints.up('sm')]: {
    //  paddingLeft: theme.spacing.unit * 3,
    //  paddingRight: theme.spacing.unit * 3,
    // },
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  progress: {
    flexGrow: 1,
  },
});

const themedBackoffice = withStyles(styles)(Backoffice);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(themedBackoffice);
