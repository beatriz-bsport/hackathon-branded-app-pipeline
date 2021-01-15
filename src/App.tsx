import React, { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import { compose } from 'recompose';

// eslint-disable-next-line
import { fetchCompanyTheme } from 'bsport-saas/src/libs/theme/actions';
import { fetchSCT } from 'bsport-saas/src/libs/category/actions';
import SnackbarPile from 'bsport-saas/src/SnackbarPile.component';
import { getTheme } from 'bsport-saas/src/theme';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';

import SignUpForm from 'bsport-saas/src/components/form/SignUpForm.component';
import ConsumerLogin from 'bsport-saas/src/components/consumer/login/ConsumerLogin.component';
import { WidgetConfig } from 'bsport-saas/src/libs/marketplace/types';
import { MaterialStyleType } from 'bsport-saas/src/utils/types';
import { auth as authActions } from 'bsport-saas/src/actions';
import { Dialog, DialogContent, DialogTitle, Grid } from '@material-ui/core';

import { WithTranslation, withTranslation } from 'react-i18next';

import { RootState } from './store/reducer';
import './App.scss';

const CalendarWidget = React.lazy(() => import('./components/Calendar'));
const VODWidget = React.lazy(() => import('./components/Vod'));
const PrivateServiceWidget = React.lazy(() => import('./components/PrivateService'));
const WorkshopWidget = React.lazy(() => import('./components/Workshop'));
const NewsletterWidget = React.lazy(() => import('./components/Newsletter'));

const Snackbar = themify(SnackbarPile);


type OwnProps = WidgetConfig & {
  store: any;
  lang?: string;
  history: any
};

type Props = OwnProps &
  ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

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
    const { t } = this.props;

    return (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex !important',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <React.Suspense fallback={<div />}>
          <MuiThemeProvider
            theme={getTheme(this.props.theme)}
          >
            {this.renderWidget()}
            {!!this.props.theme && (
              <div className={this.props.classes.poweredByContainer}>
                <div className={this.props.classes.centerRight}>
                  <a
                    className={this.props.classes.poweredBy}
                    href={`https://pro.bsport.io?utm_source=widget&utm_medium=referral&utm_content=bsport_logo&utm_campaign=${(
                      this.props.theme.company_name || ''
                    ).replace(/\//gi, '-')}`}
                  >
                    <Typography color="textSecondary" variant="caption">
                      Powered by
                    </Typography>
                    <img
                      alt="bsport"
                      className={this.props.classes.logo}
                      src="https://cdn.bsport.io/bsport_logo_txt.png"
                    />
                  </a>
                </div>
              </div>
            )}

            <Dialog
              open={this.state.showLogin && !this.props.auth.authenticated}
              onClose={() => this.setState({ showLogin: false })}
            >
              <DialogContent>
                <ConsumerLogin
                  doEmailLogin={this.props.doEmailLogin}
                  errorFields={this.props.errorFields}
                  error={this.props.auth.error}
                  loading={this.props.auth.loading}
                  requestSignUp={() => this.setState({ showSignup: true })}
                />
              </DialogContent>
            </Dialog>

            <Dialog
              open={this.state.showSignup && !this.props.auth.authenticated}
              onClose={() => this.setState({ showSignup: false })}
            >
              <Grid
                container
                direction="column"
                spacing={2}
              >
                <Grid item>
                  <DialogTitle>{t('form.signUpTitle')}</DialogTitle>
                </Grid>
                <Grid item>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  />
                </Grid>
                <Grid item>
                  <SignUpForm
                    loading={this.props.auth.loading}
                    theme={this.props.theme}
                    emailExists={this.props.emailExists}
                    checkEmailExistsLoading={this.props.checkEmailExistsLoading}
                    checkEmailExists={this.props.checkEmailExists}
                    onComplete={(data: any) => this.props.signup(data)}
                    onCancel={() => this.setState({ showSignup: false })}
                    consumerProfile={this.props.consumerProfile}
                  />
                </Grid>
              </Grid>
            </Dialog>
            <Snackbar theme={this.props.theme} store={this.props.store} />
          </MuiThemeProvider>
        </React.Suspense>

      </div>
    );
  }
}

const styles = () => ({
  poweredByContainer: {
    width: '100%',
  },
  centerRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  poweredBy: {
    display: 'flex !important',
    flexDirection: 'column !important',
    alignItems: 'flex-end !important',
    padding: 18,
    '&>*': {
      textDecoration: 'none !important', // not working ?
    },
  },
  logo: {
    maxHeight: '24px !important',
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
  signup: (data: any, callback?: () => void) => authActions.signup(data, { onDone: callback }),
  doEmailLogin: ({
                   email,
                   password,
                 }: any,
                 callback: any
  ) => authActions.requestLogin(email, password, { onDone: callback }),
  disconnect: authActions.disconnect,
  checkEmailExists: authActions.checkEmailExists,
};

export default compose(
  // @ts-ignore
  withStyles(styles),
  withTranslation(),
  connect(mapStateToProps, mapDispatchToProps)
)(BsportWidget);
