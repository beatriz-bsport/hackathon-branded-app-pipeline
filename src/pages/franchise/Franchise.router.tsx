// @flow
import React, { useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { compose, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import { push } from 'connected-react-router';
import { CircularProgress, MuiThemeProvider } from '@material-ui/core';

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
import { getFranchiseId, getFranchisor } from '../../libs/franchise/selectors';
import { RootState } from '../../reducers';

import FranchiseDrawer from '../../components/navigation/FranchiseDrawer.component';

const FranchiseMemberDetails = asyncComponent(
  () => import('./FranchiseMemberDetails.page'),
);
const FranchiseMemberList = asyncComponent(
  () => import('./FranchiseMemberList.page'),
);

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
    franchisor,
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

  if (!franchiseId) return <CircularProgress />;

  return (
    <MuiThemeProvider
      theme={getFranchiseTheme({
        cover: franchisor.cover,
        primaryRGB: franchisor.primaryRGB,
        secondaryRGB: franchisor.secondaryRGB,
      })}
    >
      <FranchiseDrawer
        tempPasswordState={tempPasswordState}
        generateTempPassword={generateTempPassword}
        fetchTempPassword={fetchTempPassword}
        disconnect={disconnect}
        push={pushRouter}
      >
        <Switch>
          <Route exact path="/f/members" component={FranchiseMemberList} />
          <Route
            path="/f/members/:userId/member"
            component={FranchiseMemberDetails}
          />
          <Redirect to="/f/members" />
        </Switch>
      </FranchiseDrawer>
    </MuiThemeProvider>
  );
};

const connector = connect(
  (state: RootState) => ({
    franchiseId: getFranchiseId(state),
    isAuthenticated: state.auth.authenticated,
    isFranchisor: state.auth.is_franchisor,
    username: state.auth.username,
    franchisor: getFranchisor(state),
    tempPasswordState: getTempPasswordState(state),
  }),
  {
    fetchFranchise: fetchFranchiseAction,
    fetchCompanyTheme: fetchCompanyThemeAction,
    generateTempPassword: generateTempPasswordAction,
    fetchTempPassword: fetchTempPasswordAction,
    pushRouter: push,
    signout: () => push(`/login/signout`),
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
