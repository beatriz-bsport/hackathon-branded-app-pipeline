// @flow

import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { compose, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { push } from 'react-router-redux';
import { Redirect } from 'react-router-dom';

import { getPermissions } from '../../libs/role/selectors';
import type { Permission } from '../../libs/role/types';

import type { Theme } from '../../libs/theme/types';
import themeSelectors from '../../libs/theme/selectors';
import { getTheme as getMUITheme } from '../../theme';

import api from '../../api';
import { errorLogin } from '../../actions/auth.actions';

import { fetchSCT } from '../../actions/category.actions';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { fetchAll as fetchAllPaymentPacks } from '../../actions/paymentPack.actions';

import CheckInAppBar from '../../libs/check-in/components/CheckInAppBar.component';
import CheckInSignout from '../../libs/check-in/components/CheckInSignout.component';
import CheckInRouter from './CheckIn.router';

type Props = {
  fetchEstablishments: () => void,
  fetchSCT: () => void,
  fetchAllPaymentPacks: () => void,

  authError: ?boolean,
  errorLogin: () => void,
  permission: Permission,
  setSignoutOpen: (boolean) => void,
  signoutOpen: boolean,

  theme: Theme,
  fetchCompanyTheme: () => void,
  classes: Object,
  push: (path: string) => void,
};

type State = {
  loading: boolean,
  refreshInterval: ?Interval,
};

export class CheckInPage extends React.Component<Props, State> {
  state = { loading: true, refreshInterval: null };

  componentWillMount() {
    this.props.fetchCompanyTheme();
    this.refreshData();
    this.setState({ loading: false });
  }

  refreshData = () => {
    this.props.fetchEstablishments();
    this.props.fetchSCT();
    this.props.fetchAllPaymentPacks();
  };

  componentDidMount() {
    this.setState({
      refreshInterval: setInterval(this.refreshData, 5 * 60 * 1000),
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.refreshInterval);
  }

  signout = (username, password: string) => {
    api.auth
      .login(username, password)
      .then(() => this.props.push('/login/signout'))
      .catch(this.props.errorLogin);
  };

  render() {
    if (!this.props.permission.checkin) {
      return <Redirect to="/" />;
    }
    if (this.state.loading) {
      return <CircularProgress />;
    }
    return (
      <MuiThemeProvider theme={getMUITheme(this.props.theme)}>
        <CheckInAppBar
          theme={this.props.theme}
          onSignout={() => this.props.setSignoutOpen(true)}
        />
        <CheckInSignout
          open={this.props.signoutOpen}
          onSubmit={this.signout}
          authError={this.props.authError}
          onClose={() => this.props.setSignoutOpen(false)}
        />
        <div className={this.props.classes.content}>
          <CheckInRouter />
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = (theme) => ({
  content: {
    marginTop: theme.spacing.unit * 8,
    width: '100%',
  },
});

export default compose(
  withStyles(styles),
  withState('signoutOpen', 'setSignoutOpen', false),
  connect(
    (state) => ({
      theme: themeSelectors.getTheme(state),
      username: state.auth.username,
      authError: state.auth.error,
      permission: getPermissions(state),
    }),
    {
      fetchSCT,
      fetchCompanyTheme,
      fetchEstablishments,
      fetchAllPaymentPacks,
      errorLogin,
      push,
    },
  ),
)(CheckInPage);
