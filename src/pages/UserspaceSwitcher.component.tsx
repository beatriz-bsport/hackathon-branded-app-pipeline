import React from 'react';

import { connect } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import asyncComponent from '../AsyncComponent';
import { RootState } from '../reducers';

const ConsumerHome = asyncComponent(() => import('./consumer/Consumer.router'));
const Backoffice = asyncComponent(() => import('./Backoffice.component'));
const FranchiseHome = asyncComponent(
  () => import('./franchise/Franchise.router'),
);

type Props = ReturnType<typeof mapStateToProps>;

export const UserspaceSwitcher = (props: Props) => {
  const { authenticated, isCoach, isManager, isConsumer, isFranchisor } = props;

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  if (isFranchisor) {
    return <Route path="/" component={FranchiseHome} />;
  }

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
  isFranchisor: state.auth.is_franchisor,
});

export default connect(mapStateToProps)(UserspaceSwitcher);
