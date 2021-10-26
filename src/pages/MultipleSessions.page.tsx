import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';

import { MuiThemeProvider } from '@material-ui/core';

import { RootState } from '../reducers';
import { getTheme } from '../theme';
import {
  fetchAccessLevel as fetchAccessLevelAction,
  fetchAccessLevelWithoutConnect as fetchAccessLevelWithoutConnectAction,
} from '../actions/auth.actions';
import MultipleSessionDetails from '../components/navigation/MultipleSessions.component';

type OwnProps = {
  newToken: string;
};

type Props = OwnProps & ConnectedProps<typeof connector>;

export const MultipleSessions = (props: Props) => {
  const {
    previousConnexionRight,
    currentConnexionRight,
    storedToken,
    fetchAccessLevel,
    fetchAccessLevelWithoutConnect,
    newToken,
    previousTheme,
  } = props;

  useEffect(() => {
    newToken &&
      newToken !== 'null' &&
      fetchAccessLevelWithoutConnect(newToken, 'current');
    fetchAccessLevelWithoutConnect(storedToken, 'previous');
  }, [fetchAccessLevelWithoutConnect, newToken, storedToken]);

  const restoreSession = () => {
    if (getStatus(currentConnexionRight) === 'franchisor') {
      // Reset the franchise token as it was delete during rollback navigation
      window.localStorage.setItem('bsport:franchise:http:token', newToken);
    }
    fetchAccessLevel(storedToken);
  };
  const updateSession =
    newToken && newToken !== 'null'
      ? () => fetchAccessLevel(newToken)
      : undefined;

  return (
    <MuiThemeProvider theme={getTheme(previousTheme)}>
      <MultipleSessionDetails
        previousName={previousConnexionRight?.username}
        previousStatus={getStatus(previousConnexionRight)}
        currentName={currentConnexionRight?.username}
        currentStatus={getStatus(currentConnexionRight)}
        restoreSession={restoreSession}
        updateSession={updateSession}
      />
    </MuiThemeProvider>
  );
};

const getStatus = (user: {
  username: string;
  is_franchisor: boolean;
  is_manager: boolean;
}): 'franchisor' | 'manager' | '' => {
  if (!user) return '';

  if (user.is_franchisor) {
    return 'franchisor';
  }

  if (user.is_manager) {
    return 'manager';
  }

  return '';
};

const connector = connect(
  (state: RootState) => ({
    previousTheme: state.theme.theme,
    storedToken: state.auth.token,
    previousConnexionRight: state.auth.doubleConnexion.previous,
    currentConnexionRight: state.auth.doubleConnexion.current,
  }),
  {
    fetchAccessLevel: fetchAccessLevelAction,
    fetchAccessLevelWithoutConnect: fetchAccessLevelWithoutConnectAction,
  },
);

export default compose(connector)(MultipleSessions);
