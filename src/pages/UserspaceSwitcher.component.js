// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Redirect, Route, withRouter } from 'react-router-dom';

import ConsumerHome from './ConsumerHome.component';
import Backoffice from './Backoffice.component';

type Props = {
  authenticated: boolean,
  userspace: {
    isCoach: boolean,
    isManager: boolean,
    isConsumer: boolean,
  },
};

export class UserspaceSwitcher extends Component<Props> {
  render() {
    const { userspace, authenticated } = this.props;

    if (!authenticated) {
      console.log(authenticated);
      return <Redirect to="/login" />;
    }

    const { isCoach, isManager, isConsumer } = userspace;

    if (isCoach || isManager) {
      return <Route path="/" component={Backoffice} />;
    }
    if (isConsumer) {
      return <Route path="/" component={ConsumerHome} />;
    }

    return <Redirect to="/login" />;
  }
}

function mapStateToProps(state) {
  return {
    authenticated: state.auth.authenticated,
    userspace: {
      isCoach: state.auth.is_coach,
      isConsumer: state.auth.is_consumer,
      isManager: state.auth.is_manager,
    },
  };
}

export default connect(mapStateToProps)(withRouter(UserspaceSwitcher));
