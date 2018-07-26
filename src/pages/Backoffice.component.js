import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { TopBar, NavBar } from '../components';
import Calendar from './Calendar.component';
import Dashboard from './Dashboard.component';
import { ResponsiveDrawer } from '../components';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

import { activity as activityActions } from '../actions';
import { offer as offerActions } from '../actions';
import { member as memberActions } from '../actions';
import ActivityList from './ActivityList.component';
import MetaActivity from './MetaActivity.component';
import CoachList from './CoachList.component.js';
import Payment from './Payment.component';
import MemberList from './MemberList.component';
import Member from './Member.component';
import PaymentPackList from './PaymentPackList.component';

const styles = (theme) => ({
  content: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    flexGrow: 1,
  },
  toolbar: theme.mixins.toolbar,
  progress: {
    flexGrow: 1,
  },
});

export class Backoffice extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: true,
    };
  }

  componentDidMount() {
    this.props.fetchAllActivities();
    this.props.fetchAllOffers();
    this.props.fetchAllMembers();
  }

  toogleDrawer = () => {
    this.setState({ drawerOpen: !this.state.drawerOpen });
  };

  render() {
    const { classes } = this.props;
    const { drawerOpen } = this.state;
    const { activityLoading, offerLoading } = this.props;

    if (!this.props.authenticated) {
      return <Redirect to="/login" />;
    }
    /*
        <TopBar toogleDrawer={this.toogleDrawer} />
        {drawerOpen ? <NavBar /> : null}
        */

    /*
        {activityLoading || offerLoading ? (
          <CircularProgress className={classes.progress} size={50} />
        ) : (
        )}
    */
    return (
      <ResponsiveDrawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div>
            <Switch>
              <Route path="/calendar" component={Calendar} />
              <Route exact path="/activity" component={ActivityList} />
              <Route path="/activity/:id" component={MetaActivity} />
              <Route path="/coach" component={CoachList} />
              <Route path="/payment" component={Payment} />
              <Route path="/payment-pack" component={PaymentPackList} />
              <Route exact path="/member" component={MemberList} />
              <Route path="/member/:id" component={Member} />
              <Route exact path="/" component={ActivityList} />
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
    activityLoading: state.activity.loading,
    offerLoading: state.offer.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchAllMembers() {
      dispatch(memberActions.fetchAll());
    },
    fetchAllOffers() {
      dispatch(offerActions.fetchAllOffers());
    },
    fetchAllActivities() {
      dispatch(activityActions.fetchAllActivities());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(themedBackoffice);
