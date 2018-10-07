// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { ResponsiveDrawer } from '../components';

import {
  activity as activityActions,
  metaActivity as metaActivityActions,
  offer as offerActions,
  member as memberActions,
  coach as coachActions,
  establishment as establishmentActions,
  category as categoryActions,
  invoice as invoiceActions,
  paymentPack as paymentPackActions,
  stats as statsActions,
} from '../actions';

import Dashboard from './Dashboard.component';
import MetaActivityList from './MetaActivityList.component';
import MetaActivity from './MetaActivity.component';
import CoachList from './CoachList.component';
import CoachPerformance from './CoachPerformance.component';
import InvoiceList from './InvoiceList.component';
import MemberList from './MemberList.component';
import Member from './Member.component';
import PaymentPackList from './PaymentPackList.component';
import PaymentPackForm from './PaymentPackForm.component';
import Planning from './Planning.component';
import EstablishmentMap from './EstablishmentMap.component';
import CoachForm from './CoachForm.component';
import MetaActivityForm from './MetaActivityForm.component';
import MarketingDashboard from './MarketingDashboard.component';
import MarketingRule from './MarketingRule.component';
import MemberForm from './MemberForm.component';
import OfferFormPage from './OfferFormPage.component';
import EstablishmentFormPage from './EstablishmentFormPage.component';
import InvoiceFormPage from './InvoiceFormPage.component';

const styles = (theme: Object) => ({
  content: {
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3,
    },
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  progress: {
    flexGrow: 1,
  },
});

type Props = {
  classes: Object,
  authenticated: boolean,
  fetchAllActivities: () => void,
  fetchAllOffers: () => void,
  fetchAllMembers: () => void,
  fetchActivitiesMinimal: () => void,
  fetchAssociatedCoaches: () => void,
  fetchAllEstablishments: () => void,
  fetchSCT: () => void,
  fetchInvoices: () => void,
  fetchAllPaymentPacks: () => void,
  fetchDashboardStats: () => void,
};

export class Backoffice extends Component<Props> {
  componentWillMount() {
    document.title = 'Backoffice - bsport';
  }

  componentDidMount() {
    this.props.fetchAllActivities();
    this.props.fetchAllOffers();
    this.props.fetchAllMembers();
    this.props.fetchActivitiesMinimal();
    this.props.fetchAssociatedCoaches();
    this.props.fetchAllEstablishments();
    this.props.fetchSCT();
    this.props.fetchInvoices();
    this.props.fetchAllPaymentPacks();
    this.props.fetchDashboardStats();
  }

  render() {
    const { classes } = this.props;

    if (!this.props.authenticated) {
      return <Redirect to="/login" />;
    }

    return (
      <ResponsiveDrawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div>
            <Switch>
              <Route path="/calendar" component={Planning} />
              <Route exact path="/activity" component={MetaActivityList} />
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
              <Route path="/payment" component={InvoiceList} />
              <Route path="/payment-pack/add" component={PaymentPackForm} />
              <Route path="/payment-pack" component={PaymentPackList} />
              <Route exact path="/member" component={MemberList} />
              <Route exact path="/member/edit/:id" component={MemberForm} />
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
              <Route exact path="/" component={Dashboard} />
              <Route path="/invoice/add" component={InvoiceFormPage} />
            </Switch>
          </div>
        </main>
      </ResponsiveDrawer>
    );
  }
}

const themedBackoffice = withStyles(styles)(Backoffice);

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllEstablishments() {
      dispatch(establishmentActions.fetchEstablishments());
    },
    fetchAllMembers() {
      dispatch(memberActions.fetchAll());
    },
    fetchAllOffers() {
      dispatch(offerActions.fetchAllOffers());
    },
    fetchAllActivities() {
      dispatch(metaActivityActions.fetchAllActivities());
    },
    fetchActivitiesMinimal() {
      dispatch(activityActions.fetchActivities());
    },
    fetchAssociatedCoaches() {
      dispatch(coachActions.fetchAssociated());
    },
    fetchSCT() {
      dispatch(categoryActions.fetchSCT());
    },
    fetchInvoices() {
      dispatch(invoiceActions.fetchAll());
    },
    fetchAllPaymentPacks() {
      dispatch(paymentPackActions.fetchAll());
    },
    fetchDashboardStats() {
      dispatch(statsActions.fetchDashboard());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(themedBackoffice);
