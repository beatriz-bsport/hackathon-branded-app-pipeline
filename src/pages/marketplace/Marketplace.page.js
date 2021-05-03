// @flow
import React, { Component } from 'react';

import { compose, withProps, withHandlers } from 'recompose';
import { withRouter } from 'react-router';

import Grid from '@material-ui/core/Grid';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { MuiThemeProvider } from '@material-ui/core/styles';
import AppBarMUI from '@material-ui/core/AppBar';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';
import { replace, push as pushRouter } from 'connected-react-router';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { getTheme } from '../../theme';
import { fetchCompanyTheme } from '../../libs/theme/actions';

import ConsumerLogin from '../../components/consumer/login/ConsumerLogin.component';
import MarketplaceAppBar from './MarketplaceAppBar.component';
import SignUpForm from '../../components/form/SignUpForm.component';
import Analytics from '../../components/analytics/Analytics.component';
import { parseQueryString } from '../../http';

import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '../../libs/checkout/actions';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import type { Basket } from '../../libs/checkout/types';

import { fetchSCT } from '../../libs/category/actions';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import Config from '../../config';
import { getMarketplaceRoute, fromConfigToUrl } from './routing-utils';
import asyncComponent from '../../AsyncComponent';

import { auth as authActions } from '../../actions';

import { fetchProfile } from '../../libs/consumer-space/actions';

import MarketplaceBasketDialog from './MarketplaceBasketDialog.component';
import {
  MarketplaceComponentsEnum,
  MarketplaceSettings,
  MarketplaceTabConfig,
} from '../../libs/marketplace/types';
import { fetchMarketplaceSettings } from '../../libs/marketplace/actions';

const MarketplacePassPage = asyncComponent(() =>
  import('./MarketplacePass.page'),
);

const MarketplacePrivateServiceRouter = asyncComponent(() =>
  import('./PrivateService/MarketplacePrivateService.router'),
);
const MarketplaceShopPage = asyncComponent(() =>
  import('./MarketplaceShop.page'),
);
const MarketplaceCalendarPage = asyncComponent(() =>
  import('./MarketplaceCalendar.page'),
);
const MarketplaceWorkshopPage = asyncComponent(() =>
  import('./MarketplaceWorkshop.page'),
);
const MarketplaceContractPage = asyncComponent(() =>
  import('./MarketplaceContract.page'),
);
const MarketplaceVodRouter = asyncComponent(() =>
  import('./MarketplaceVod.router'),
);

type Props = {
  companyName: string,
  companyId: number,
  company: MarketPlaceCompany,
  companyThemeLoading: boolean,
  hideAppBar: ?boolean,
  errorFields: ?{ email: ?string, password: ?string },

  fetchSCT: () => void,

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
  goToTab: (
    companyName: string,
    companyId: number,
    subcomponent: string,
  ) => void,
  subcomponent: string,
  replace: (path: string) => void,
  goToUserSpace: () => void,

  auth: *,
  consumerProfile: *,

  t: TFunction,
  classes: Object,

  disconnect: () => void,
  signup: (data: *, callback: () => void) => void,
  fetchCompanyTheme: () => void,
  theme: any,
  settings: MarketplaceSettings,
  settingsLoading: boolean,
  tabSelected: ?number,
  fetchMarketplaceSettings: (companyId: string) => void,
};

type State = {
  signupDialogOpen: boolean,
  currentBasketOpen: boolean,
  loginDialogOpen: boolean,
};

const TAB_CALENDAR = 'calendar';
const TAB_PASS = 'pass';
const TAB_VOD = 'vod';
const TAB_CONTRACT = 'subscription';
const TAB_WORKSHOP = 'workshop';
const TAB_PRIVATE_SERVICE = 'private-service';
const TAB_SHOP = 'shop';

export class MarketPlace extends Component<Props, State> {
  state = {
    currentBasketOpen: false,
    signupDialogOpen: false,
    loginDialogOpen: false,
  };

  fetchData = () => {
    this.props.fetchCompanyTheme(this.props.companyId);
    this.props.fetchMarketplaceSettings(this.props.companyId);
    this.props.fetchSCT();
    if (this.props.auth.authenticated) {
      this.props.fetchCurrentBasket(this.props.companyId);
      this.props.fetchProfile();
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      /* eslint-disable-next-line */
      !isNaN(this.props.companyId) &&
      (this.props.companyId !== prevProps.companyId ||
        this.props.auth.authenticated !== prevProps.auth.authenticated)
    ) {
      this.fetchData();
    }
    /* eslint-disable-next-line */
    if (isNaN(this.props.companyId)) {
      this.props.replace('/');
    }
  }

  handleTabChange = (event: SyntheticEvent<HTMLElement>, value: number) => {
    const { tabSelected } = this.props;

    if (parseInt(tabSelected, 10) === parseInt(value, 10)) return;

    const tabConfig: MarketplaceTabConfig = this.props.settings.config[
      value.toString()
    ];

    const newPath = fromConfigToUrl(tabConfig, { tabSelected: value });
    this.props.goToTab(newPath);
  };

  renderContent = () => {
    if (!this.props.companyId) {
      return null;
    }

    switch (this.props.subcomponent) {
      case TAB_PASS:
        return (
          <MarketplacePassPage
            key={this.props.tabSelected}
            companyId={this.props.companyId}
            requestSignUp={() => this.toogleLogin(true)}
            toogleCurrentBasketOpen={this.toogleCurrentBasketOpen}
          />
        );
      case TAB_CONTRACT:
        return (
          <MarketplaceContractPage
            key={this.props.tabSelected}
            companyId={this.props.companyId}
            requestSignUp={() => this.toogleLogin(true)}
            authenticated={this.props.auth.authenticated}
            goToUserSpace={() => this.props.goToUserSpace(this.props.companyId)}
          />
        );
      case TAB_SHOP:
        return (
          <MarketplaceShopPage
            key={this.props.tabSelected}
            requestSignUp={() => this.toogleLogin(true)}
            toogleCurrentBasketOpen={this.toogleCurrentBasketOpen}
            companyId={this.props.companyId}
          />
        );
      case TAB_PRIVATE_SERVICE:
        return (
          <MarketplacePrivateServiceRouter
            key={this.props.tabSelected}
            companyId={this.props.companyId}
            authenticated={this.props.auth.authenticated}
            requestLogin={() => this.toogleLogin(true)}
          />
        );
      case TAB_WORKSHOP:
        return (
          <MarketplaceWorkshopPage
            key={this.props.tabSelected}
            companyId={this.props.companyId}
          />
        );
      case TAB_VOD:
        return (
          <MarketplaceVodRouter
            key={this.props.tabSelected}
            requestSignUp={() => this.toogleLogin(true)}
          />
        );
      case TAB_CALENDAR:
      default: {
        return (
          <div className={this.props.classes.calendarContainer}>
            <MarketplaceCalendarPage
              key={this.props.tabSelected}
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
    const data_ = { ...data, membership: this.props.companyId };
    this.props.signup(data_, callback);
  };

  toogleSignUp = (value: boolean) => {
    if (value) {
      Analytics.signupShow();
    }
    this.setState({ signupDialogOpen: value });
  };

  toogleLogin = (value: boolean) => {
    if (value) {
      Analytics.signinShow();
    }
    this.setState({ loginDialogOpen: value });
  };

  closeSignup = () => this.setState({ signupDialogOpen: false });

  doEmailLogin = ({ email, password }) => {
    this.props.doEmailLogin({ email, password }, () => {
      this.props.fetchProfile({
        onSuccess: (profile) => Analytics.signinSuccess(profile),
      });
      this.props.fetchCurrentBasket(this.props.companyId);
    });
  };

  getDefaultTitleForComponent(componentType: MarketplaceComponentsEnum) {
    const { t } = this.props;

    const obj = {
      [MarketplaceComponentsEnum.calendar]: t('marketplace.calendar'),
      [MarketplaceComponentsEnum.workshop]: t('marketplace.workshop'),
      [MarketplaceComponentsEnum.privateService]: t(
        'marketplace.private_service',
      ),
      [MarketplaceComponentsEnum.pass]: t('marketplace.pass'),
      [MarketplaceComponentsEnum.vod]: t('marketplace.vod'),
      [MarketplaceComponentsEnum.subscription]: t(
        'marketplace.contract.tabName',
      ),
      [MarketplaceComponentsEnum.shop]: t('marketplace.shop.tabName'),
      [MarketplaceComponentsEnum.playlist]: t('marketplace.playlist'),
    };

    return obj[componentType];
  }

  render() {
    const { companyThemeLoading, classes, t } = this.props;

    if (
      companyThemeLoading ||
      !this.props.theme ||
      this.props.settingsLoading ||
      !(this.props.settings && this.props.settings.config)
    ) {
      return (
        <Grid container item alignItems="center" justify="center">
          <CircularProgress />
        </Grid>
      );
    }

    if (
      !!this.props.theme.company_name &&
      decodeURI(this.props.companyName.toLowerCase().replace(/ /g, '-')) !==
        this.props.theme.company_name.toLowerCase().replace(/ /g, '-')
    ) {
      this.props.replace(
        `/m/${this.props.theme.company_name.toLowerCase().replace(/ /g, '-')}/${
          this.props.companyId
        }/${this.props.subcomponent || ''}`,
      );
    }
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <Analytics
          username={(this.props.auth && this.props.auth.username) || ''}
          theme={this.props.theme}
        />
        <div className={classes.container}>
          <MarketplaceAppBar
            logo={this.props.theme.cover}
            websiteURL={this.props.theme.websiteURL}
            auth={this.props.auth}
            goToUserSpace={() => this.props.goToUserSpace(this.props.companyId)}
            currentBasket={this.props.currentBasket}
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
                onChange={this.handleTabChange}
                textColor="primary"
                indicatorColor="primary"
                variant="scrollable"
                value={parseInt(this.props.tabSelected, 10)}
              >
                {(
                  (this.props.settings.config && this.props.settings.config.tabs
                    ? []
                    : this.props.settings.config) || []
                ).map((tab, i) => {
                  if (
                    tab.componentType === MarketplaceComponentsEnum.vod &&
                    !(
                      Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
                      this.props.theme.vod
                    )
                  ) {
                    return null;
                  }

                  let { title } = tab;
                  if (!title) {
                    title = this.getDefaultTitleForComponent(
                      tab.component_type,
                    );
                  }

                  return <Tab value={i} label={title} />;
                })}
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
            <DialogTitle>{t('form.signUpTitle')}</DialogTitle>
            <div className={classes.signupContainer}>
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
                        Analytics.signupSuccess(profile);
                      },
                    });
                    this.props.fetchCurrentBasket(this.props.companyId);
                  })
                }
                onCancel={() => this.setState({ signupDialogOpen: false })}
                consumerProfile={this.props.consumerProfile}
              />
            </div>
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
    padding: theme.spacing(2),
    paddingTop: 0,
    maxWidth: 400,
  },
  content: {
    overflowY: 'auto',
    position: 'relative',
    paddingBottom: theme.spacing(4),
  },
  title: {
    marginBottom: theme.spacing(6),
  },
  calendarContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
    },
  },
});

export default compose(
  withStyles(styles),
  withTranslation(),
  withMobileDialog(),
  withRouter,
  routerParamsToProps({
    companyId: 'companyId:number',
    companyName: 'companyName',
    subcomponent: 'subcomponent',
  }),
  withProps(({ location }) => ({
    hideAppBar: location.search.includes('hideAppBar=true'),
    tabSelected: parseQueryString(location.search).tabSelected,
  })),
  connect(
    (state: RootState) => ({
      auth: state.auth,
      currentBasket: getCurrentBasket(state),
      currentBasketLoading: state.checkout.basket.current.loading,
      consumerProfile: state.consumer.profile,
      theme: state.theme.theme,
      companyThemeLoading: state.theme.loading,
      settings: state.marketplace.settings,
      settingsLoading: state.marketplace.loading,
      errorFields: state.auth.invalidFields,
      checkEmailExistsLoading: state.auth.emailExists.loading,
      emailExists: state.auth.emailExists.exists,
    }),
    {
      // General information
      fetchSCT,
      fetchCompanyTheme,
      fetchMarketplaceSettings,

      // For shop pages
      fetchCurrentBasket,
      addItemToBasket,
      removeItemFromBasket,

      // for signup/signin/profile
      fetchProfile,
      goToUserSpace: (id) => pushRouter(`/c/${id}/`),
      goToCheckout: (companyId) => pushRouter(`/checkout/${companyId}/`),
      signup: (data: *, callback: () => void) =>
        authActions.signup(data, { onDone: callback }),
      doEmailLogin: ({ email, password }, callback) =>
        authActions.requestLogin(email, password, { onDone: callback }),
      disconnect: authActions.disconnect,
      checkEmailExists: authActions.checkEmailExists,
      push: pushRouter,

      // navigation
      replace,
    },
  ),
  withHandlers({
    goToTab: ({ companyName, companyId, push }) => (path) =>
      push(getMarketplaceRoute(companyName, companyId, path)),
  }),
)(MarketPlace);
