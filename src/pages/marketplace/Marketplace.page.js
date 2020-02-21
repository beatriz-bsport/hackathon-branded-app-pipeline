// @flow
import React, { Component } from 'react';

import { compose, withProps } from 'recompose';
import { withRouter } from 'react-router';

import Grid from '@material-ui/core/Grid';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import AppBarMUI from '@material-ui/core/AppBar';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Tabs from '@material-ui/core/Tabs';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';
import { replace, push as pushRouter } from 'react-router-redux';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { getTheme } from '../../theme';
import { fetchCompanyTheme } from '../../libs/theme/actions';

import ConsumerLogin from '../../components/consumer/login/ConsumerLogin.component';
import AppBar from './AppBar.component';
import SignUpForm from '../../components/form/SignUpForm.component';
import GoogleTagManager from '../../components/GoogleTagManager.component';

import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '../../libs/checkout/actions';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import type { Basket } from '../../libs/checkout/types';

import { fetchSCT } from '../../actions/category.actions';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import MarketplacePassPage from './MarketplacePass.page';
import MarketplaceShopPage from './MarketplaceShop.page';
import MarketplaceCalendarPage from './MarketplaceCalendar.page';
import MarketplaceWorkshopPage from './MarketplaceWorkshop.page';
import MarketplacePrivateService from './MarketplacePrivateService.page';
import MarketplaceContractPage from './MarketplaceContract.page';
import MarketplaceBasketDialog from './MarketplaceBasketDialog.component.js';

import { fetchPaymentComboList } from '../../libs/payment-combo/actions';

import {
  consumer as consumerActions,
  auth as authActions,
} from '../../actions';

import { fetchCompanyAction } from '../../libs/marketplace/actions';

type Props = {
  companyName: string,
  companyId: number,
  company: MarketPlaceCompany,
  companyLoading: boolean,
  hideAppBar: ?boolean,
  errorFields: ?{ email: ?string, password: ?string },

  fetchCompany: (companyId: number) => void,
  fetchSCT: () => void,

  fetchPaymentComboList: (params: any) => void,

  fetchCurrentBasket: (companyId: number) => void,
  currentBasket: ?Basket,
  currentBasketLoading: boolean,
  removeItemFromBasket: (basketId: string, data: any) => void,
  addItemToBasket: (basketId: string, data: any) => void,
  goToCheckout: (companyId: number) => void,

  emailExists: boolean,
  checkEmailExistsLoading: boolean,
  checkEmailExists: (email: string) => void,
  fetchProfile: () => void,
  doEmailLogin: ({ email: string, password: string }, () => void) => void,
  goToTab: (companyName: string, companyId: number, tab: string) => void,
  tab: string,
  replace: (path: string) => void,
  goToUserSpace: () => void,

  auth: *,
  consumerProfile: *,

  t: TFunction,
  classes: Object,
  fullScreen: boolean,

  disconnect: () => void,
  signup: (data: *, callback: () => void) => void,
  fetchCompanyTheme: () => void,
  theme: any,
};

type State = {
  signupDialogOpen: boolean,
  currentBasketOpen: boolean,
  loginDialogOpen: boolean,
};

const TAB_CALENDAR = 'calendar';
const TAB_PASS = 'pass';
const TAB_CONTRACT = 'subscription';
const TAB_WORKSHOP = 'workshop';
const TAB_PRIVATE_SERVICE = 'private-service';
const TAB_SHOP = 'shop';
const DEFAULT_TAB = TAB_CALENDAR;

export class MarketPlace extends Component<Props, State> {
  state = {
    currentBasketOpen: false,
    signupDialogOpen: false,
    loginDialogOpen: false,
  };

  fetchData = () => {
    this.props.fetchCompanyTheme(this.props.companyId);
    this.props.fetchSCT();
    this.props.fetchCompany(this.props.companyId);
    if (this.props.auth.authenticated) {
      this.props.fetchCurrentBasket(this.props.companyId);
      this.props.fetchProfile();
    }
    this.props.fetchPaymentComboList({
      company: this.props.companyId,
      manager_only: false,
    });
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.companyId !== prevProps.companyId) {
      this.fetchData();
    }
  }

  handleTabChange = (event: SyntheticEvent<HTMLElement>, value: string) => {
    this.props.goToTab(this.props.company.name, this.props.company.id, value);
  };

  renderContent = () => {
    if (!this.props.companyId) {
      return null;
    }
    switch (this.props.tab || DEFAULT_TAB) {
      case TAB_PASS:
        return (
          <MarketplacePassPage
            companyId={this.props.companyId}
            requestSignUp={() => this.toogleLogin(true)}
            toogleCurrentBasketOpen={this.toogleCurrentBasketOpen}
          />
        );
      case TAB_CONTRACT:
        return (
          <MarketplaceContractPage
            companyId={this.props.companyId}
            requestSignUp={() => this.toogleLogin(true)}
            authenticated={this.props.auth.authenticated}
            goToUserSpace={() =>
              this.props.goToUserSpace(this.props.company.id)
            }
          />
        );
      case TAB_SHOP:
        return (
          <MarketplaceShopPage
            requestSignUp={() => this.toogleLogin(true)}
            toogleCurrentBasketOpen={this.toogleCurrentBasketOpen}
            companyId={this.props.companyId}
          />
        );
      case TAB_PRIVATE_SERVICE:
        return (
          <MarketplacePrivateService
            companyId={this.props.companyId}
            authenticated={this.props.auth.authenticated}
            requestLogin={() => this.toogleLogin(true)}
          />
        );
      case TAB_WORKSHOP:
        return <MarketplaceWorkshopPage companyId={this.props.companyId} />;
      case TAB_CALENDAR:
      default: {
        return (
          <div className={this.props.classes.calendarContainer}>
            <MarketplaceCalendarPage
              companyId={this.props.companyId}
              requestSignUp={() => this.toogleLogin(true)}
              toogleCurrentBasketOpen={this.toogleCurrentBasketOpen}
              startWeekThisWeekday={false}
              authenticated={this.props.auth.authenticated}
            />
          </div>
        );
      }
    }
  };

  toogleCurrentBasketOpen = (currentBasketOpen: boolean) =>
    this.setState({ currentBasketOpen });

  signup = (data: *, callback: () => void) => {
    const data_ = { ...data, membership: this.props.company.id };
    this.props.signup(data_, callback);
  };

  toogleSignUp = (value: boolean) => {
    if (value) {
      (window.dataLayer || []).push({
        event: 'bsport:signup:show',
      });
    }
    this.setState({ signupDialogOpen: value });
  };

  toogleLogin = (value: boolean) => {
    if (value) {
      (window.dataLayer || []).push({
        event: 'bsport:signin:show',
      });
    }
    this.setState({ loginDialogOpen: value });
  };

  closeSignup = () => this.setState({ signupDialogOpen: false });

  doEmailLogin = ({ email, password }) => {
    this.props.doEmailLogin({ email, password }, () => {
      this.props.fetchProfile({
        onSuccess: (profile) => {
          try {
            (window.dataLayer || []).push({
              event: 'bsport:signin:success',
              data: {
                email: profile.email,
              },
            });
          } catch (err) {
            console.error(err);
          }
        },
      });
      this.props.fetchCurrentBasket(this.props.companyId);
    });
  };

  render() {
    const { companyLoading, classes, t, company } = this.props;
    if (companyLoading || !company) {
      return (
        <Grid container item alignItems="center" justify="center">
          <LinearProgress />
        </Grid>
      );
    }

    if (decodeURI(this.props.companyName) !== this.props.company.name) {
      this.props.replace(
        `/m/${this.props.company.name}/${this.props.companyId}/${this.props
          .tab || ''}`,
      );
    }
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <GoogleTagManager theme={this.props.theme} />
        <div className={classes.container}>
          <AppBar
            logo={this.props.theme.cover}
            websiteURL={this.props.theme.websiteURL}
            auth={this.props.auth}
            goToUserSpace={() =>
              this.props.goToUserSpace(this.props.company.id)
            }
            currentBasket={this.props.currentBasket}
            company={this.props.company}
            openCurrentBasket={() => this.toogleCurrentBasketOpen(true)}
            requestSignUp={() => this.toogleSignUp(true)}
            requestLogin={() => this.toogleLogin(true)}
            disconnect={() => {
              this.props.disconnect();
            }}
          />
          {!this.props.hideAppBar ? (
            <AppBarMUI position="relative" color="default">
              <Tabs
                value={this.props.tab || DEFAULT_TAB}
                onChange={this.handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                variant="scrollable"
              >
                <Tab value={TAB_CALENDAR} label={t('marketplace.calendar')} />
                <Tab value={TAB_WORKSHOP} label={t('marketplace.workshop')} />
                <Tab
                  value={TAB_PRIVATE_SERVICE}
                  label={t('marketplace.private_service')}
                />
                <Tab value={TAB_PASS} label={t('marketplace.pass')} />
                <Tab
                  value={TAB_CONTRACT}
                  label={t('marketplace.contract.tabName')}
                />
                <Tab value={TAB_SHOP} label={t('marketplace.shop.tabName')} />
              </Tabs>
            </AppBarMUI>
          ) : null}
          <div className={classes.content}>{this.renderContent()}</div>
          <MarketplaceBasketDialog
            open={!!this.state.currentBasketOpen}
            basket={this.props.currentBasket}
            onCancel={() => this.toogleCurrentBasketOpen(false)}
            loading={this.props.currentBasketLoading}
            onRemoveCheckoutItem={(data) =>
              this.props.removeItemFromBasket(this.props.currentBasket.id, data)
            }
            onAddCheckoutItem={(data) =>
              this.props.addItemToBasket(this.props.currentBasket.id, data)
            }
            goToCheckout={() =>
              this.props.goToCheckout(this.props.currentBasket.company)
            }
          />
          <Dialog
            open={this.state.loginDialogOpen && !this.props.auth.authenticated}
            onClose={() => this.toogleLogin(false)}
          >
            <DialogContent>
              <ConsumerLogin
                doEmailLogin={this.doEmailLogin}
                errorFields={this.props.errorFields}
                error={this.props.auth.error}
                loading={this.props.auth.loading}
                requestSignUp={() => this.toogleSignUp(true)}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={this.state.signupDialogOpen && !this.props.auth.authenticated}
            onClose={this.closeSignup}
          >
            <Grid
              container
              direction="column"
              spacing={16}
              className={classes.signupContainer}
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
                  onComplete={(data: *) =>
                    this.signup(data, () => {
                      this.props.fetchProfile({
                        onSuccess: (profile) => {
                          try {
                            (window.dataLayer || []).push({
                              event: 'bsport:signup:success',
                              data: {
                                email: profile.email,
                              },
                            });
                          } catch (err) {
                            console.error(err);
                          }
                        },
                      });
                      this.props.fetchCurrentBasket(this.props.companyId);
                    })
                  }
                  onCancel={() => this.setState({ signupDialogOpen: false })}
                  consumerProfile={this.props.consumerProfile}
                />
              </Grid>
            </Grid>
          </Dialog>
          <Dialog
            open={this.state.loginDialogOpen && !this.props.auth.authenticated}
            onClose={() => this.toogleLogin(false)}
          >
            <DialogContent>
              <ConsumerLogin
                doEmailLogin={this.doEmailLogin}
                errorFields={this.props.errorFields}
                error={this.props.auth.error}
                loading={this.props.auth.loading}
                requestSignUp={() => this.toogleSignUp(true)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = (theme) => ({
  container: {
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    width: '100%',
  },
  signupContainer: {
    padding: theme.spacing.unit * 2,
    paddingTop: 0,
  },
  content: {
    overflowY: 'auto',
    position: 'relative',
    paddingBottom: theme.spacing.unit * 4,
  },
  title: {
    marginBottom: theme.spacing.unit * 6,
  },
  calendarContainer: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 4,
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing.unit * 4,
      marginRight: theme.spacing.unit * 4,
    },
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  withMobileDialog(),
  withRouter,
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName',
    tab: 'tab',
  }),
  withProps(({ location }) => ({
    hideAppBar: location.search.includes('hideAppBar=true'),
  })),
  connect(
    (state) => ({
      auth: state.auth,
      company: state.marketplacev2.company.data,
      companyLoading: state.marketplacev2.company.loading,
      currentBasket: getCurrentBasket(state),
      currentBasketLoading: state.checkout.basket.current.loading,
      consumerProfile: state.consumer.profile,
      theme: state.theme.theme,

      errorFields: state.auth.invalidFields,
      checkEmailExistsLoading: state.auth.emailExists.loading,
      emailExists: state.auth.emailExists.exists,
    }),
    {
      // General information
      fetchSCT,
      fetchCompanyTheme,
      fetchCompany: fetchCompanyAction,

      // For shop pages
      fetchCurrentBasket,
      addItemToBasket,
      removeItemFromBasket,

      fetchPaymentComboList,

      // for signup/signin/profile
      fetchProfile: consumerActions.fetchProfile,
      goToUserSpace: (id) => pushRouter(`/c/${id}/`),
      goToCheckout: (companyId) => pushRouter(`/checkout/${companyId}/`),
      signup: (data: *, callback: () => void) =>
        authActions.signup(data, { onDone: callback }),
      doEmailLogin: ({ email, password }, callback) =>
        authActions.requestLogin(email, password, { onDone: callback }),
      disconnect: authActions.disconnect,
      checkEmailExists: authActions.checkEmailExists,

      // navigation
      replace,
      goToTab: (companyName: string, companyId: number, tab: string) =>
        pushRouter(`/m/${companyName}/${companyId}/${tab}/`),
    },
  ),
)(MarketPlace);
