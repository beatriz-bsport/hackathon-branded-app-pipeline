import React from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';

import { RoleType } from '@bsport/common/lib/master-data/user-role';
import withThemeProvider from '#hocs/company-themifier.hoc';

// @ts-expect-error
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#libs/theme/actions';
import { getTheme } from '#libs/theme/selectors';
import asyncComponent from '../../AsyncComponent';
import { fetchProfile as fetchProfileAction } from '../../libs/consumer-space/actions';
import type { RootState } from '../../reducers';

const QuicksaleInterface = asyncComponent(() => import('./QuicksaleInterface'));

const QuicksaleCheckout = asyncComponent(() => import('./QuicksaleCheckout'));

type Props = ConnectedProps<typeof connector>;

const Quicksale: React.FC<Props> = ({
  authenticated,
  role,
  fetchProfile,
  fetchCompanyTheme,
}) => {
  React.useEffect(() => {
    if (authenticated) {
      fetchProfile();
      fetchCompanyTheme();
    }
  }, [authenticated, fetchCompanyTheme, fetchProfile]);

  if (!authenticated || role !== RoleType.USER_ROLE_QUICKSALE)
    return <Redirect to="/" />;

  return (
    <Switch>
      <Route
        exact
        component={QuicksaleCheckout}
        path="/quicksale/checkout/:basketId/"
      />
      <Route
        exact
        component={QuicksaleInterface}
        path="/quicksale/:sectionId/"
      />
      <Route exact component={QuicksaleInterface} path="/quicksale/" />
    </Switch>
  );
};

const connector = connect(
  (state: RootState) => ({
    authenticated: state.auth.authenticated,
    role: state.auth.role,
    theme: getTheme(state),
  }),
  {
    fetchProfile: fetchProfileAction,
    fetchCompanyTheme: fetchCompanyThemeAction,
  },
);

export default compose(connector, withThemeProvider, React.memo)(Quicksale);
