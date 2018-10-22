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

import Planning from './Planning.component';
import OfferFormPage from './OfferFormPage.component';

import {
  MetaActivityForm,
  MetaActivityList,
  MetaActivity,
} from './meta-activity';
import { MarketingDashboard, MarketingRule } from './marketing';
import { InvoiceList, InvoiceFormPage } from './invoice';
import { PaymentPackList, PaymentPackForm } from './payment-pack';
import { CoachList, CoachPerformance, CoachForm } from './coach';
import { Member, MemberList, MemberForm } from './member';
import { EstablishmentMap, EstablishmentFormPage } from './establishment';

const styles = (theme: Object) => ({
  toolbar: theme.mixins.toolbar,
  progress: {
    flexGrow: 1,
  },
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
    this.props.fetchSCT();
    this.props.fetchInvoices();
    this.props.fetchAllOffers();
    this.props.fetchAllMembers();
    this.props.fetchAllActivities();
    this.props.fetchDashboardStats();
    this.props.fetchAllPaymentPacks();
    this.props.fetchActivitiesMinimal();
    this.props.fetchAssociatedCoaches();
    this.props.fetchAllEstablishments();
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(themedBackoffice);
