// @flow
import React from 'react';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

import parse from '../../query-string';

type Props = {
  authenticated: boolean,
  location: Object,
  requestedMembership: ?string,
  activeMembership: ?number,
};

export const ConsumerSpacePreSelector = (props: Props) => {
  if (!props.authenticated) {
    // bnot authenticated; please login !
    return <Redirect to={`/login/customer${props.location.search}`} />;
  }
  if (props.requestedMembership) {
    // we are going to link retrieve and redirect to the requested membership (company)
    return (
      <Redirect to={`/c/membership-validator/${props.requestedMembership}/`} />
    );
  }
  if (props.activeMembership) {
    return (
      <Redirect to={`/c/membership-validator/${props.activeMembership}/`} />
    );
  }

  // the customer request a lambda consumer space, we r gonna
  // look what we can propose him based on last connection and current memberships
  return <Redirect to="/c/membership-selector/" />;
};

export default compose(
  withRouter,
  withProps(({ location }) => ({
    requestedMembership: parse(location.search).membership,
  })),
  connect((state) => ({
    authenticated: state.auth.authenticated,
    activeMembership: state.membership.activeMembership,
  })),
)(ConsumerSpacePreSelector);
