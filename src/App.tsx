import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

// eslint-disable-next-line
import { fetchCompanyTheme } from 'bsport-saas/src/libs/theme/actions';
import { fetchSCT } from 'bsport-saas/src/libs/category/actions';
import SnackbarPile from 'bsport-saas/src/SnackbarPile.component';
import { getTheme } from 'bsport-saas/src/theme';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';

import { WidgetConfig } from 'bsport-saas/src/libs/marketplace/types';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { auth as authActions } from 'bsport-saas/src/actions';

import { RootState } from './store/reducer';
import AuthDialog from './components/AuthDialog';
import BsportLogo from './components/BsportLogo';
import './App.scss';

const CalendarWidget = React.lazy(() => import('./widgets/Calendar'));
const VODWidget = React.lazy(() => import('./widgets/Vod'));
const PrivateServiceWidget = React.lazy(() => import('./widgets/PrivateService'));
const WorkshopWidget = React.lazy(() => import('./widgets/Workshop'));
const NewsletterWidget = React.lazy(() => import('./widgets/Newsletter'));

const Snackbar = themify(SnackbarPile);


type OwnProps = WidgetConfig & {
  store: any;
  lang?: string;
  history: any
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>

interface State {
  showLogin: boolean;
  showSignup: boolean;
}

class BsportWidget extends Component<Props, State> {
  state = {
    showLogin: false,
    showSignup: false,
  };

  componentWillMount() {
    if (this.props.lang && this.props.lang !== 'fr-FR') {
      import('bsport-saas/src/i18n')
        .then((i18n) => {
          i18n.default.changeLanguage(this.props.lang);
        })
        .catch(console.error);
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.props.fetchSCT();
    this.props.fetchCompanyTheme(this.props.companyId);
  }

  renderWidget() {
    const {
      companyId,
      config,
      store,
      widgetType,
      theme,
    } = this.props;

    switch (widgetType) {
      case 'workshop':
        return (
          <WorkshopWidget
            companyId={companyId}
            store={store}
            config={config.workshop}
            theme={theme}
          />
        );
      case 'privateService':
        return (
          <PrivateServiceWidget
            companyId={companyId}
            store={store}
            config={config.privateService}
            theme={theme}
          />
        );
      case 'vod':
      case 'playlist':
        return (
          <VODWidget
            companyId={companyId}
            config={config[widgetType]}
            onRequestLogin={() => this.setState({ showLogin: true })}
            store={store}
            theme={theme}
          />
        );
      case 'newsletter':
        return (
          <NewsletterWidget
            companyId={companyId}
            theme={theme}
          />
        );
      default:
        return (
          <CalendarWidget
            companyId={companyId}
            config={config.calendar}
            store={store}
            requestSignup={() => this.setState({ showLogin: true })}
            toogleCurrentBasketOpen={() => null}
            theme={theme}
          />
        );
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <React.Suspense fallback={<div />}>
          <MuiThemeProvider
            theme={getTheme(this.props.theme)}
          >
            {this.renderWidget()}

            {!!this.props.theme && (
              <BsportLogo theme={this.props.theme} />
            )}

            <Snackbar
              theme={this.props.theme}
              store={this.props.store}
            />

            <AuthDialog
              showLogin={this.state.showLogin}
              showSignup={this.state.showSignup}
              authenticated={this.props.auth.authenticated}
              loading={this.props.auth.loading}
              error={this.props.auth.error}
              errorFields={this.props.errorFields}
              emailExists={this.props.emailExists}
              checkEmailExists={this.props.checkEmailExists}
              checkEmailExistsLoading={this.props.checkEmailExistsLoading}
              theme={this.props.theme}
              onLogin={this.props.login}
              onSignup={this.props.signup}
              onLoginClose={() => this.setState({ showLogin: false })}
              onSignupClose={() => this.setState({ showSignup: false })}
              onSignupShow={() => this.setState({ showSignup: true })}
            />

          </MuiThemeProvider>
        </React.Suspense>
      </div>
    );
  }
}

const styles = () => ({
  container: {
    height: '100%',
    width: '100%',
    display: 'flex !important',
    flexDirection: 'column',
    alignItems: 'center',
  },
});


const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  theme: state.theme.theme,
  errorFields: state.auth.invalidFields,
  checkEmailExistsLoading: state.auth.emailExists.loading,
  emailExists: state.auth.emailExists.exists,
});

const mapDispatchToProps = {
  fetchSCT,
  fetchCompanyTheme,
  signup: (data: any) => authActions.signup(data),
  login: ({ email, password }: any) => authActions.requestLogin(email, password),
  disconnect: authActions.disconnect,
  checkEmailExists: authActions.checkEmailExists,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(BsportWidget);
