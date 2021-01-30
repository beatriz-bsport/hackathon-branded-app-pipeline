import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

// eslint-disable-next-line
import { fetchCompanyTheme } from 'bsport-saas/src/libs/theme/actions';
import { fetchSCT } from 'bsport-saas/src/libs/category/actions';
import {
  SnackbarDataProvider,
  SnackbarPile,
} from 'bsport-saas/src/SnackbarPile.component';
import { getTheme } from 'bsport-saas/src/theme';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

import { WidgetConfig } from 'bsport-saas/src/libs/marketplace/types';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { auth as authActions } from 'bsport-saas/src/actions';

import { RootState } from './store/reducer';
import BsportLogo from './components/BsportLogo';

import asyncComponent from './AsyncComponent';
import AuthDialog from './components/AuthDialog';

const CalendarWidget = asyncComponent(() => import('./widgets/Calendar'));
const VODWidget = asyncComponent(() => import('./widgets/Vod'));
const PrivateServiceWidget = asyncComponent(
  () => import('./widgets/PrivateService')
);
const WorkshopWidget = asyncComponent(() => import('./widgets/Workshop'));
const NewsletterWidget = asyncComponent(() => import('./widgets/Newsletter'));

const Snackbar = themify(connect(...SnackbarDataProvider)(SnackbarPile));

type OwnProps = WidgetConfig & {
  store: any,
  lang?: string,
  history: any,
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;

interface State {
  showLogin: boolean;
  showSignup: boolean;
  requestVideoAccessRefreshFlag: number;
}

class BsportWidget extends Component<Props, State> {
  popupWindow?: any = null;

  state = {
    showLogin: false,
    showSignup: false,
    requestVideoAccessRefreshFlag: 0,
  };

  componentDidMount() {
    this.fetchData();

    window.addEventListener("message", (event: any) => {
      if (event.data && event.data.type === "paymentSuccess") {
        this.popupWindow && this.popupWindow.close();

        this.setState((prevState) => {
          const key = prevState.requestVideoAccessRefreshFlag + 1;
          return {
            requestVideoAccessRefreshFlag: key,
          };
        });
      }
    }, false);
  }

  fetchData() {
    this.props.fetchSCT();
    this.props.fetchCompanyTheme(this.props.companyId);
  }

  onWindowOpen = (w: Window) => {
    this.popupWindow = w;
  }

  renderWidget() {
    const { companyId, config, store, widgetType, theme } = this.props;

    switch (widgetType) {
      case 'workshop':
        return (
          <WorkshopWidget
            companyId={companyId}
            config={config.workshop}
            store={store}
            theme={theme}
            onWindowOpen={this.onWindowOpen}
          />
        );
      case 'privateService':
        return (
          <PrivateServiceWidget
            companyId={companyId}
            store={store}
            config={config.privateService}
            theme={theme}
            onWindowOpen={this.onWindowOpen}
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
            onWindowOpen={this.onWindowOpen}
            requestVideoAccessRefreshFlag={this.state.requestVideoAccessRefreshFlag}
          />
        );
      case 'newsletter':
        return <NewsletterWidget companyId={companyId} theme={theme} />;
      default:
        return (
          <CalendarWidget
            companyId={companyId}
            config={config.calendar}
            store={store}
            requestSignup={() => this.setState({ showLogin: true })}
            toogleCurrentBasketOpen={() => null}
            theme={theme}
            onWindowOpen={this.onWindowOpen}
          />
        );
    }
  }

  render() {
    const { classes } = this.props;
    if (!this.props.theme || !!this.props.themeLoading) {
      return (
        <div className={classes.container}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div className={classes.container}>
        <React.Suspense fallback={<CircularProgress />}>
          <MuiThemeProvider theme={getTheme(this.props.theme)}>
            {this.renderWidget()}
            {!!this.props.theme && <BsportLogo theme={this.props.theme} />}
            <Snackbar theme={this.props.theme} />
            {(!!this.state.showLogin || !!this.state.showSignup) && (
              <AuthDialog
                showLogin={this.state.showLogin}
                showSignup={this.state.showSignup}
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
            )}
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
    backgroundColor: 'transparent !important',
  },
});

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  theme: state.theme.theme,
  themeLoading: state.theme.loading,
  errorFields: state.auth.invalidFields,
  checkEmailExistsLoading: state.auth.emailExists.loading,
  emailExists: state.auth.emailExists.exists,
});

const mapDispatchToProps = {
  fetchSCT,
  fetchCompanyTheme,
  signup: (data: any) => authActions.signup(data),
  login: ({ email, password }: any) =>
    authActions.requestLogin(email, password),
  disconnect: authActions.disconnect,
  checkEmailExists: authActions.checkEmailExists,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(BsportWidget);
