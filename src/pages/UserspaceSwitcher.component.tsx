import React from 'react';

import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';

import asyncComponent from '../AsyncComponent';
import { RootState } from '../reducers';

const ConsumerHome = asyncComponent(() => import('./consumer/Consumer.router'));
const Backoffice = asyncComponent(() => import('./Backoffice.component'));

type Props = ReturnType<typeof mapStateToProps>;

export const UserspaceSwitcher = (props: Props) => {
  const { authenticated } = props;

  if (!authenticated) {
    return <Redirect to="/login" />;
  }
  const { isCoach, isManager, isConsumer } = props;

  if (isCoach || isManager) {
    return <Route path="/" component={Backoffice} />;
  }
  if (isConsumer) {
    return <Route path="/" component={ConsumerHome} />;
  }

  return <Redirect to="/login" />;
};

const mapStateToProps = (state: RootState) => ({
  authenticated: state.auth.authenticated,
  isCoach: state.auth.is_coach,
  isConsumer: state.auth.is_consumer,
  isManager: state.auth.is_manager,
});

export default connect(mapStateToProps)(withRouter(UserspaceSwitcher));
