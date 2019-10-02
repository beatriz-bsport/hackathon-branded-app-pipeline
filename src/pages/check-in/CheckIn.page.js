// @flow

import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { compose, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { push } from 'react-router-redux';
import { Redirect } from 'react-router-dom';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
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
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';

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
  goToCreateMember: (companyId: number) => void,
  t: TFunction,
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
        <div className={this.props.classes.bottomButtonContainer}>
          <Fab
            onClick={() =>
              this.props.goToCreateMember(this.props.theme.company)
            }
            color="primary"
            variant="extended"
            className={this.props.classes.bottomButton}
          >
            <PersonAddIcon className={this.props.classes.leftIcon} />
            {this.props.t('addMember.button')}
          </Fab>
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
  bottomButtonContainer: {
    visibility: 'hidden',
    position: 'fixed',
    bottom: 0,
    marginBottom: theme.spacing.unit * 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
  },
  bottomButton: {
    visibility: 'visible',
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(['selfCheckIn']),
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
      goToCreateMember: (companyId) =>
        push(`/external/${companyId}/add-member/`),
    },
  ),
)(CheckInPage);
