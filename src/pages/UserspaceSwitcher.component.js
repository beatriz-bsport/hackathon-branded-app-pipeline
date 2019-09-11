// @flow

import React from 'react';

import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';

import { getPermissions } from '../libs/role/selectors';
import type { Permission } from '../libs/role/types';
import asyncComponent from '../AsyncComponent';

const ConsumerHome = asyncComponent(() => import('./ConsumerHome.component'));
const Backoffice = asyncComponent(() => import('./Backoffice.component'));

type Props = {
  authenticated: boolean,
  permission: Permission,
  isCoach: boolean,
  isManager: boolean,
  isConsumer: boolean,
};

export const UserspaceSwitcher = (props: Props) => {
  const { authenticated } = props;

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  if (props.permission.checkin) {
    return <Redirect to="/check-in" />;
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

export default connect((state) => ({
  authenticated: state.auth.authenticated,
  permission: getPermissions(state),
  isCoach: state.auth.is_coach,
  isConsumer: state.auth.is_consumer,
  isManager: state.auth.is_manager,
}))(withRouter(UserspaceSwitcher));
