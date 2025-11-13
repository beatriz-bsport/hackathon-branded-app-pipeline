// @flow

import React from 'react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fab from '@material-ui/core/Fab';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { compose, withState } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import { push } from 'connected-react-router';
import { Redirect } from 'react-router-dom';

import { withTranslation, TFunction } from 'react-i18next';
import { getPermissions } from '../../libs/role/selectors';
import type { RolePermission } from '../../libs/role/types';

import type { Theme } from '../../libs/theme/types';
import themeSelectors from '../../libs/theme/selectors';
import { getTheme as getMUITheme } from '../../theme';

import { errorLogin } from '../../actions/auth.actions';
import { login as loginAPI } from '../../libs/login/api';

import { fetchSCT } from '../../libs/category/actions';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import { fetchEstablishments } from '../../libs/establishment/actions';
import { fetchPaymentPackList as fetchPaymentPackListAction } from '../../libs/payment-packs/actions';
import { getAllEstablishments } from '../../libs/establishment/selectors';
import namespaces from '../../i18n/namespaces.json';

import CheckInAppBar from '../../libs/check-in/components/CheckInAppBar.component';
import CheckInSignout from '../../libs/check-in/components/CheckInSignout.component';
import CheckInRouter from './CheckIn.router';
import { fetchCompanyRoles } from '../../libs/role/actions';
import withRudderStackHistoryTracker from '../../components/analytics/rudderstack/with-rudderstack-history-tracking';
import { analyticsClientB2B } from '../../components/analytics/mixpanel';
import { trackTabletCheckInSignUpStartedEvent } from '../../events/booking/trackers';

type Props = {
  fetchEstablishments: () => void,
  fetchSCT: () => void,
  fetchPaymentPackList: (params: any) => void,

  authError?: boolean,
  errorLogin: () => void,
  permission: RolePermission,
  setSignoutOpen: (boolean) => void,
  signoutOpen: boolean,

  theme: Theme,
  fetchCompanyTheme: () => void,
  classes: Object,
  push: (path: string) => void,
  goToCreateMember: (companyId: number) => void,
  fetchCompanyRoles: () => void,
  rolesLoading: boolean,
  t: TFunction,
};

type State = {
  loading: boolean,
  refreshInterval?: Interval,
};

export class CheckInPage extends React.Component<Props, State> {
  state = { loading: true, refreshInterval: null };

  UNSAFE_componentWillMount() {
    this.props.fetchCompanyTheme();
    this.props.fetchCompanyRoles();
    this.refreshData();
    this.setState({ loading: false });
  }

  refreshData = () => {
    this.props.fetchEstablishments();
    this.props.fetchSCT();
    this.props.fetchPaymentPackList();
  };

  componentDidMount() {
    this.setState({
      refreshInterval: setInterval(this.refreshData, 5 * 60 * 1000),
    });

    analyticsClientB2B.addSuperProperties({
      company: this.props.theme?.company,
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.refreshInterval);

    analyticsClientB2B.removeSuperProperties(['company']);
  }

  signout = (username, password: string) => {
    loginAPI(username, password)
      .then(() => this.props.push('/login/signout'))
      .catch(this.props.errorLogin);
  };

  handleCreateMemberClick = () => {
    analyticsClientB2B.track(trackTabletCheckInSignUpStartedEvent({}));
    this.props.goToCreateMember(this.props.theme.company);
  };

  render() {
    if (this.state.loading || this.props.rolesLoading) {
      return <CircularProgress />;
    }

    if (!this.props.permission?.checkin) {
      return <Redirect to="/" />;
    }

    return (
      <MuiThemeProvider theme={getMUITheme(this.props.theme)}>
        <CheckInAppBar
          onSignout={() => this.props.setSignoutOpen(true)}
          theme={this.props.theme}
        />
        <CheckInSignout
          authError={this.props.authError}
          onClose={() => this.props.setSignoutOpen(false)}
          onSubmit={this.signout}
          open={this.props.signoutOpen}
        />
        <div className={this.props.classes.content}>
          <CheckInRouter />
        </div>
        <div className={this.props.classes.bottomButtonContainer}>
          <Fab
            className={this.props.classes.bottomButton}
            color="primary"
            onClick={this.handleCreateMemberClick}
            variant="extended"
          >
            <PersonAddIcon className={this.props.classes.leftIcon} />
            {this.props.t('selfCheckIn:addMember.button')}
          </Fab>
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = (theme) => ({
  content: {
    marginTop: theme.spacing(8),
    width: '100%',
  },
  bottomButtonContainer: {
    visibility: 'hidden',
    position: 'fixed',
    bottom: 0,
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
  },
  bottomButton: {
    visibility: 'visible',
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(namespaces),
  withState('signoutOpen', 'setSignoutOpen', false),
  connect(
    (state) => ({
      theme: themeSelectors.getTheme(state),
      username: state.auth.username,
      authError: state.auth.error,
      permission: getPermissions(state),
      establishments: getAllEstablishments(state),
      rolesLoading: state.role.role.loading,
    }),
    {
      fetchSCT,
      fetchCompanyTheme,
      fetchEstablishments,
      fetchPaymentPackList: () =>
        fetchPaymentPackListAction({ disabled: false, page_size: 70000 }),
      errorLogin,
      push,
      fetchCompanyRoles,
      goToCreateMember: (companyId) =>
        push(`/external/${companyId}/add-member/?context=tablet_checkin`),
    },
  ),
  withRudderStackHistoryTracker,
)(CheckInPage);
