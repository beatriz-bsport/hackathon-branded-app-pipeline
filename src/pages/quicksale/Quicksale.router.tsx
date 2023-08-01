import React from 'react';

import { Route, Switch, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { ConnectedProps, connect } from 'react-redux';

import { RoleType } from '@bsport/common/lib/master-data/user-role';
import withThemeProvider from '#hocs/company-themifier.hoc';

// @ts-expect-error
import asyncComponent from '../../AsyncComponent';
import { fetchProfile as fetchProfileAction } from '../../libs/consumer-space/actions';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#libs/theme/actions';
import { getTheme } from '#libs/theme/selectors';
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

  if (!authenticated || (role && role !== RoleType.USER_ROLE_QUICKSALE))
    return <Redirect to="/" />;

  return (
    <Switch>
      <Route
        exact
        path="/quicksale/checkout/:basketId/"
        component={QuicksaleCheckout}
      />
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
    theme: getTheme(state),
  }),
  {
    fetchProfile: fetchProfileAction,
    fetchCompanyTheme: fetchCompanyThemeAction,
  },
);

export default compose(connector, withThemeProvider, React.memo)(Quicksale);
