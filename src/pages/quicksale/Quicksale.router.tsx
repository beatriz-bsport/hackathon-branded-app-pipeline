import React from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';

import { RoleType } from '@bsport/common/lib/master-data/user-role';

// @ts-expect-error
import asyncComponent from '../../AsyncComponent';
import { fetchProfile as fetchProfileAction } from '../../libs/consumer-space/actions';
import type { RootState } from '../../reducers';

const QuicksaleInterface = asyncComponent(() => import('./QuicksaleInterface'));

type Props = ConnectedProps<typeof connector>;

const Quicksale: React.FC<Props> = ({ authenticated, role, fetchProfile }) => {
  React.useEffect(() => {
    if (authenticated) fetchProfile();
  }, [authenticated, fetchProfile]);

  if (!authenticated || (role && role !== RoleType.USER_ROLE_QUICKSALE))
    return <Redirect to="/" />;

  return (
    <Switch>
      <Route
        exact
        path="/quicksale/:sectionId/"
        component={QuicksaleInterface}
      />
      <Route exact path="/quicksale/" component={QuicksaleInterface} />
    </Switch>
  );
};

const connector = connect(
  (state: RootState) => ({
    authenticated: state.auth.authenticated,
    role: state.auth.role,
  }),
  { fetchProfile: fetchProfileAction },
);

export default compose(connector, React.memo)(Quicksale);
