// @flow
import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { MuiThemeProvider } from '@material-ui/core';

import asyncComponent from '../../AsyncComponent';
import { getAuthToken } from '../../http';

import { getFranchiseTheme } from '../../theme';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '../../libs/theme/actions';
import { fetchFranchise as fetchFranchiseAction } from '../../libs/franchise/actions';
import {
  generateTempPassword as generateTempPasswordAction,
  fetchTempPassword as fetchTempPasswordAction,
} from '../../libs/login/actions';
import { getTempPasswordState } from '../../libs/login/selectors';
import {
  getFranchiseId,
  getFranchiseTheme as selectorGetFranchiseTheme,
} from '../../libs/franchise/selectors';
import { RootState } from '../../reducers';

import FranchiseDrawer from '../../components/navigation/FranchiseDrawer.component';

const FranchiseMembers = asyncComponent(
  () => import('./FranchiseMembers.page'),
);
const Franchise = asyncComponent(() => import('./Franchise.page'));

type OwnProps = {
  disconnect: () => void;
  pushRouter: (path: string) => void;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

const FranchiseRouter = (props: Props) => {
  const {
    isAuthenticated,
    isFranchisor,
    franchiseId,
    theme,
    generateTempPassword,
    fetchTempPassword,
    tempPasswordState,
    disconnect,
    fetchFranchise,
    pushRouter,
  } = props;

  useEffect(() => {
    fetchFranchise();
  }, [fetchFranchise]);

  if (!isAuthenticated || !isFranchisor) {
    return <Redirect to="/login" />;
  }

  const token = getAuthToken();
  if (!getAuthToken() || token === 'null') {
    return <Redirect to="/login/signout" />;
  }

  if (!franchiseId) return <div>Spinner todo</div>;

  return (
    <MuiThemeProvider theme={getFranchiseTheme(theme)}>
      <FranchiseDrawer
        theme={theme}
        // alertings={alertings}
        // nbAlerting={nbAlerting}
        // deleteAlert={deleteAlert}
        tempPasswordState={tempPasswordState}
        generateTempPassword={generateTempPassword}
        fetchTempPassword={fetchTempPassword}
        disconnect={disconnect}
        push={pushRouter}
      >
        <Switch>
          <Route path="/f/franchises" component={Franchise} />
          <Route exact path="/f/members" component={FranchiseMembers} />
          <Redirect to="/f/members" />
        </Switch>
      </FranchiseDrawer>
    </MuiThemeProvider>
  );
};

const connector = connect(
  (state: RootState) => ({
    // alertings: alertingSelectors.getByKind(state),
    // nbAlerting: alertingSelectors.countAlerting(state),
    franchiseId: getFranchiseId(state),
    isAuthenticated: state.auth.authenticated,
    isFranchisor: state.auth.is_franchisor,
    username: state.auth.username,
    theme: selectorGetFranchiseTheme(state),
    tempPasswordState: getTempPasswordState(state),
  }),
  {
    fetchFranchise: fetchFranchiseAction,
    fetchCompanyTheme: fetchCompanyThemeAction,
    generateTempPassword: generateTempPasswordAction,
    fetchTempPassword: fetchTempPasswordAction,
    pushRouter: push,
    signout: () => push(`/login/signout`),
    // fetchAllAlertings,
    // fetchMoreAlertingKind,
    // deleteAlert,
  },
);

export default compose(
  // withOpenEvent('backoffice'),
  connector,
  withHandlers({
    disconnect: ({ signout, theme }) => () => {
      signout(theme.company);
    },
  }),
)(FranchiseRouter);
