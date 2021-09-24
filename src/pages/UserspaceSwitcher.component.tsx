import React, { useEffect, useState } from 'react';
import { compose } from 'recompose';

import { connect, ConnectedProps } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

import asyncComponent from '../AsyncComponent';
import { getAuthToken } from '../http';
import { RootState } from '../reducers';
import MultipleSessions from './MultipleSessions.page';

import { disconnect as disconnectAction } from '../actions/auth.actions';

const ConsumerHome = asyncComponent(() => import('./consumer/Consumer.router'));
const Backoffice = asyncComponent(() => import('./Backoffice.component'));
const FranchiseHome = asyncComponent(
  () => import('./franchise/Franchise.router'),
);

type Props = ConnectedProps<typeof connector>;

export const UserspaceSwitcher = (props: Props) => {
  const {
    authenticated,
    isCoach,
    isManager,
    isConsumer,
    isFranchisor,
    storedToken,
    disconnect,
  } = props;

  const [tokenChangedInOtherTab, setTokenChangedInOtherTab] = useState(false);
  const [authToken, setAuthToken] = useState(getAuthToken());

  useEffect(() => {
    const updateToken = () => {
      setTokenChangedInOtherTab(storedToken !== getAuthToken());
      setAuthToken(getAuthToken());
      if (getAuthToken() === 'null') {
        disconnect();
      }
    };

    // Do notes that storage event are only dispatch when other tab write on
    // the localstorage. Modify the localstorage on this tab will not trigger
    // the event for this application
    window.addEventListener('storage', updateToken);

    return () => {
      window.removeEventListener('storage', updateToken);
    };
  }, [storedToken, disconnect]);

  useEffect(() => {
    if (storedToken === authToken || authToken === 'null') {
      setTokenChangedInOtherTab(false);
    }
  }, [setTokenChangedInOtherTab, authToken, storedToken]);

  if (tokenChangedInOtherTab) {
    return <MultipleSessions newToken={authToken} />;
  }

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

const connector = connect(
  (state: RootState) => ({
    authenticated: state.auth.authenticated,
    isCoach: state.auth.is_coach,
    isConsumer: state.auth.is_consumer,
    isManager: state.auth.is_manager,
    isFranchisor: state.auth.is_franchisor,
    storedToken: state.auth.token,
  }),
  {
    disconnect: disconnectAction,
  },
);

export default compose(connector)(UserspaceSwitcher);
