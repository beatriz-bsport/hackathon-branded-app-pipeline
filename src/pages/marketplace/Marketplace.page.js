// @flow
import React, { Component } from 'react';
import URI from 'urijs';
import { compose, withProps, withHandlers, withStateHandlers } from 'recompose';
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

import { withTranslation, TFunction } from 'react-i18next';

import {
  CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
} from '@bsport/common/lib/master-data/custom-form';
import chroma from 'chroma-js';
import { getTheme } from '../../theme';
import { fetchCompanyTheme } from '#libs/theme/actions';

import Login from '#libs/login/components/Login.component';
import MarketplaceAppBar from './MarketplaceAppBar.component';
import Analytics from '#components/analytics/Analytics.component';
import { parseQueryString } from '../../http';

import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '#libs/checkout/actions';

import { getCurrentBasket } from '#libs/checkout/selectors';
import type { Basket } from '#libs/checkout/types';

import { fetchSCT } from '#libs/category/actions';

import routerParamsToProps from '#hocs/router-params-to-props.hoc';

import Config from '../../config';
import {
  getMarketplaceRoute,
  fromConfigToUrl,
} from '#libs/marketplace/routing-utils';
import { getDefaultTitleForComponent } from '#libs/exportable-components/utils';
import asyncComponent from '../../AsyncComponent';

import { auth as authActions } from '../../actions';
import { signupV2 } from '../../actions/auth.actions';
import { fetchProfile } from '#libs/consumer-space/actions';

import MarketplaceBasketDialog from './MarketplaceBasketDialog.component';
import {
  MarketplaceSettings,
  MarketplaceTabConfig,
} from '#libs/marketplace/types';
import { EXPORTABLE_COMPONENT_TYPE_VOD } from '#libs/exportable-components/constants.ts';
import { fetchMarketplaceSettings } from '#libs/marketplace/actions';
import MemberShipValidationWrapper from '../consumer/MemberShipValidationWrapper.component';
import {
  fetchCompanyCustomSignUp,
  submitSignUpCustomForm,
} from '#libs/custom-form/actions';
import CustomFormView from '#libs/custom-form/components/consumer-form/CustomFormView.form';
import CustomFormViewDialogComponent from '#libs/custom-form/components/consumer-form/CustomFormViewDialog.component';
import { getSignUpCustomFormWithEnabledField } from '#libs/custom-form/selectors';
import type { OptionCallback } from '../../state/types';
import type { CustomFormFilled } from '#libs/custom-form/types';
import type { RootState } from '../../reducers';
import { CustomFormTitle } from '#libs/custom-form/components/CustomFormTitle.component';

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
const MarketplaceGiftcardPage = asyncComponent(() =>
  import('./MarketplaceGiftcard.page'),
);

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
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
  fetchProfile: () => void,
  doEmailLogin: (
    data: { email: string, password: string },
    callback: () => void,
  ) => void,
  goToTab: (
    companyName: string,
    companyId: number,
    subcomponent: string,
  ) => void,
  subcomponent: string,
  replace: (path: string) => void,
  goToUserSpace: () => void,

  auth: any,

  t: TFunction,
  classes: Object,

  disconnect: () => void,
  signup: (formdata: any, callback: () => void) => void,
  fetchCompanyTheme: () => void,
  theme: any,
  settings: MarketplaceSettings,
  settingsLoading: boolean,
  tabSelected: ?number,
  fetchMarketplaceSettings: (companyId: string) => void,
  location: any,
  fetchCompanyCustomSignUp: (params: { company?: number }) => void,
  submitSignUpCustomForm: (
    formdata: FormData,
    company: number,
    options: OptionCallback,
  ) => void,
} & StateHandlerType;

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
const TAB_GIFTCARD = 'giftcard';

export class MarketPlace extends Component<Props, State> {
  state = {
    currentBasketOpen: false,
    signupDialogOpen: false,
    loginDialogOpen: false,
  };

  fetchData = () => {
    this.props.fetchCompanyTheme(this.props.companyId);
    this.props.fetchCompanyCustomSignUp({ company: this.props.companyId });
    this.props.fetchMarketplaceSettings(this.props.companyId, {
      onSuccess: this.sanitizeURL,
    });
    this.props.fetchSCT();
    if (this.props.auth.authenticated) {
      this.props.fetchProfile();
    }
  };

  sanitizeURL = () => {
    const { settings } = this.props;

    if (
      !this.props.subcomponent &&
      settings &&
      settings.config &&
      settings.config.length
    ) {
      this.handleTabChange(null, 0);
    }

    const uri = URI(window.location.href);
    const urlSearchParams = new URLSearchParams(uri.query());
    const paramsJson = Object.fromEntries(urlSearchParams);

    if (paramsJson.tabSelected === undefined) {
      let componentType = this.props.subcomponent;

      if (componentType === 'private-service') {
        componentType = 'privateService';
      }

      if (uri.pathname().includes('vod/playlist')) {
        componentType = 'playlist';
      }

      const index = this.props.settings.config.findIndex(
        (tab) => tab.component_type === componentType,
      );

      if (index > -1) {
        paramsJson.tabSelected = index;
      }
      uri.query(paramsJson);
      const pathname = uri.pathname();
      const query = uri.query();
      const newUrl = `${pathname}?${query}`;
      this.props.replace(newUrl);
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      !Number.isNaN(this.props.companyId) &&
      (this.props.companyId !== prevProps.companyId ||
        this.props.auth.authenticated !== prevProps.auth.authenticated)
    ) {
      this.fetchData();
    }

    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.sanitizeURL();
    }

    if (Number.isNaN(this.props.companyId)) {
      this.props.replace('/');
    }
  }

  handleTabChange = (event: SyntheticEvent<HTMLElement>, value: number) => {
    // const { tabSelected } = this.props;

    // if (parseInt(tabSelected, 10) === parseInt(value, 10)) return;

    const tabConfig: MarketplaceTabConfig =
      this.props.settings.config[value.toString()];

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
            requestSignUp={() => this.toggleLogin(true)}
            toggleCurrentBasketOpen={this.toggleCurrentBasketOpen}
          />
        );
      case TAB_CONTRACT:
        return (
          <MarketplaceContractPage
            key={this.props.tabSelected}
            companyId={this.props.companyId}
            requestSignUp={() => this.toggleLogin(true)}
            authenticated={this.props.auth.authenticated}
            goToUserSpace={() => this.props.goToUserSpace(this.props.companyId)}
          />
        );
      case TAB_SHOP:
        return (
          <MarketplaceShopPage
            key={this.props.tabSelected}
            requestSignUp={() => this.toggleLogin(true)}
            toggleCurrentBasketOpen={this.toggleCurrentBasketOpen}
            companyId={this.props.companyId}
          />
        );
      case TAB_PRIVATE_SERVICE:
        return (
          <MarketplacePrivateServiceRouter
            key={this.props.tabSelected}
            companyId={this.props.companyId}
            authenticated={this.props.auth.authenticated}
            requestLogin={() => this.toggleLogin(true)}
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
            requestSignUp={() => this.toggleLogin(true)}
          />
        );
      case TAB_GIFTCARD:
        return (
          <MarketplaceGiftcardPage
            requestSignUp={() => this.toggleLogin(true)}
            authenticated={this.props.auth.authenticated}
            toggleCurrentBasketOpen={this.toggleCurrentBasketOpen}
            key={this.props.tabSelected}
            companyId={this.props.companyId}
          />
        );
      case TAB_CALENDAR:
      default: {
        return (
          <div className={this.props.classes.calendarContainer}>
            <MarketplaceCalendarPage
              key={this.props.tabSelected}
              companyId={this.props.companyId}
              requestSignUp={() => this.toggleLogin(true)}
              toggleCurrentBasketOpen={this.toggleCurrentBasketOpen}
              startWeekThisWeekday={false}
              authenticated={this.props.auth.authenticated}
            />
          </div>
        );
      }
    }
  };

  toggleCurrentBasketOpen = (currentBasketOpen: boolean) =>
    this.setState({ currentBasketOpen });

  signup = (formdata: any, options) => {
    if (this.props.companyId) {
      formdata.append('membership', this.props.companyId);
      this.props.signup(formdata, options);
    } else {
      this.props.signup(formdata, options);
    }
  };

  toggleSignUp = (value: boolean) => {
    if (value) {
      Analytics.signupShow();
    }
    this.setState({ signupDialogOpen: value });
  };

  toggleLogin = (value: boolean) => {
    if (value) {
      Analytics.signinShow();
    }
    this.setState({ loginDialogOpen: value });
  };

  closeSignup = () => this.setState({ signupDialogOpen: false });

  doEmailLogin = ({ email, password }: { email: string, password: string }) => {
    this.props.doEmailLogin({ email, password }, () => {
      this.props.fetchProfile({
        onSuccess: (profile) => Analytics.signinSuccess(profile),
      });
      this.props.fetchCurrentBasket(this.props.companyId);
    });
  };

  submitCustomForm = (formdata: FormData, options?: OptionCallback) => {
    this.props.submitSignUpCustomForm(formdata, this.props.companyId, {
      onSuccess: () => {
        this.doEmailLogin(this.props.loginInformations);
        if (options && options.onSuccess) options.onSuccess();
      },
      onError: () => {
        if (options && options.onError) options.onError();
      },
    });
  };

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
        <MemberShipValidationWrapper companyId={this.props.companyId}>
          <Analytics
            username={(this.props.auth && this.props.auth.username) || ''}
            theme={this.props.theme}
          />
          <div className={classes.container}>
            <MarketplaceAppBar
              logo={this.props.theme.cover}
              websiteURL={this.props.theme.websiteURL}
              auth={this.props.auth}
              goToUserSpace={() =>
                this.props.goToUserSpace(this.props.companyId)
              }
              currentBasket={this.props.currentBasket}
              openCurrentBasket={() => this.toggleCurrentBasketOpen(true)}
              requestSignUp={() => this.toggleSignUp(true)}
              requestLogin={() => this.toggleLogin(true)}
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
                    (this.props.settings.config &&
                    this.props.settings.config.tabs
                      ? []
                      : this.props.settings.config) || []
                  ).map((tab, i) => {
                    if (
                      tab.componentType === EXPORTABLE_COMPONENT_TYPE_VOD &&
                      !(
                        Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
                        this.props.theme.vod
                      )
                    ) {
                      return null;
                    }

                    let { title } = tab;
                    if (!title) {
                      title = getDefaultTitleForComponent(
                        tab.component_type,
                        t,
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
              onCancel={() => this.toggleCurrentBasketOpen(false)}
              loading={this.props.currentBasketLoading}
              onRemoveCheckoutItem={(data) =>
                this.props.removeItemFromBasket(
                  this.props.currentBasket.id,
                  data,
                )
              }
              onAddCheckoutItem={(data) =>
                this.props.addItemToBasket(this.props.currentBasket.id, data)
              }
              goToCheckout={() =>
                this.props.goToCheckout(this.props.currentBasket.company)
              }
            />
            <Dialog
              open={
                this.state.loginDialogOpen && !this.props.auth.authenticated
              }
              onClose={() => this.toggleLogin(false)}
            >
              <DialogContent>
                <div className={classes.loginDialog}>
                  <Login
                    doEmailLogin={this.doEmailLogin}
                    errorFields={this.props.errorFields}
                    error={this.props.auth.error}
                    loading={this.props.auth.loading}
                    requestSignUp={() => this.toggleSignUp(true)}
                    company
                    isPremium
                    logoHidden
                    marketplace
                  />
                </div>
              </DialogContent>
            </Dialog>
            <CustomFormViewDialogComponent
              open={
                this.state.signupDialogOpen &&
                !this.props.auth.authenticated &&
                this.props.signUpCustomForm
              }
              onClose={this.closeSignup}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                <CustomFormTitle title={t('form.signUpTitle')} company />
              </DialogTitle>
              <div className={classes.customFormContainer}>
                <CustomFormView
                  initial={this.props.signUpCustomForm}
                  onSubmit={this.submitCustomForm}
                  onSubmitDraft={(values: CustomFormFilled) =>
                    this.props.setLoginInformations(values)
                  }
                  layouts={
                    this.props.signUpCustomForm
                      ? this.props.signUpCustomForm.layout
                      : null
                  }
                  waiver={this.props.theme.waiver}
                  general_terms_and_conditions={
                    this.props.theme.general_terms_of_use
                  }
                  onCancel={() => {
                    this.setState({ signupDialogOpen: false });
                  }}
                />
              </div>
            </CustomFormViewDialogComponent>
          </div>
        </MemberShipValidationWrapper>
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
  customFormContainer: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  content: {
    overflowY: 'auto',
    position: 'relative',
    paddingBottom: theme.spacing(4),
  },
  calendarContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
    },
  },
  loginDialog: {
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(4),
    marginLeft: theme.spacing(4),
    marginBottom: theme.spacing(6),
  },
  signupTitle: {
    marginBottom: theme.spacing(5),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rectangle: {
    height: 5,
    background: `linear-gradient(90deg,${
      theme.palette.primary.main
    } 4.66%, ${chroma(theme.palette.primary.main).darken(1.5)} 88.6%)`,
    width: 146,
    marginBottom: theme.spacing(3),
  },
  iconButton: {
    marginLeft: theme.spacing(1),
    marginBottom: theme.spacing(3.5),
  },
  signup: {
    fontSize: 36,
    fontWeight: 700,
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
});

const withStateHandlersInit = {
  loginInformations: { email: '', password: '' },
};

const withStateHandlersSetter = {
  setLoginInformations: () => (customFormAnswers: CustomFormFilled) => {
    const email =
      customFormAnswers?.custom_form_field.find(
        (field: CustomFormFieldAnswer) =>
          field.signup_question_kind === CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
      )?.answer || '';

    const password =
      customFormAnswers?.custom_form_field.find(
        (field: CustomFormFieldAnswer) =>
          field.signup_question_kind === CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
      )?.answer || '';
    return { loginInformations: { email, password } };
  },
};

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
      loginProcessing: state.auth.loading,
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
      signUpCustomForm: getSignUpCustomFormWithEnabledField(state),
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
      signupAction: signupV2,
      doEmailLogin: ({ email, password }, callback) =>
        authActions.requestLogin(email, password, { onDone: callback }),
      disconnect: authActions.disconnect,
      checkEmailExists: authActions.checkEmailExists,
      push: pushRouter,
      fetchCompanyCustomSignUp,
      submitSignUpCustomForm,

      // navigation
      replace,
    },
  ),
  withHandlers({
    goToTab:
      ({ companyName, companyId, push }) =>
      (path) =>
        push(getMarketplaceRoute(companyName, companyId, path)),
  }),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
)(MarketPlace);
