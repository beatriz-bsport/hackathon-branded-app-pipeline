// @flow
import React, { Component } from 'react';
import URI from 'urijs';
import { compose, withProps, withHandlers, withStateHandlers } from 'recompose';
import { withRouter } from 'react-router';

import Grid from '@material-ui/core/Grid';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { MuiThemeProvider } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
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
import MarketplaceAppBar from '#libs/marketplace/components/MarketplaceAppBar';
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

import {
  getMarketplaceRoute,
  fromConfigToUrl,
  getUserSpaceUrl,
  getCheckoutUrl,
} from '#libs/marketplace/routing-utils';
import { urlToMarketplace } from '#libs/marketplace/utils';
import asyncComponent from '../../AsyncComponent';

import { auth as authActions } from '../../actions';
import {
  // DEPRECATED
  // signupV2,
  navigateToRelationAccount as navigateToRelationAccountAction,
  navigateBackToMasterRelation as navigateBackToMasterRelationAction,
} from '../../actions/auth.actions';
import { fetchProfile } from '#libs/consumer-space/actions';

import MarketplaceBasketDialog from './MarketplaceBasketDialog.component';
import {
  MarketplaceSettings,
  MarketplaceTabConfig,
} from '#libs/marketplace/types';
import { fetchMarketplaceSettings } from '#libs/marketplace/actions';
import MemberShipValidationWrapper from '../consumer/MemberShipValidationWrapper.component';
import {
  fetchCompanyCustomSignUp,
  submitSignUpCustomForm,
} from '#libs/custom-form/actions';
import CustomFormView from '#libs/custom-form/components/consumer-form/CustomFormView.form';
import CustomFormViewDialogComponent from '#libs/custom-form/components/consumer-form/CustomFormViewDialog.component';
import { getSignUpCustomFormWithEnabledField } from '#libs/custom-form/selectors';
import { retrieveFranchise } from '#libs/franchise/actions';
import type { OptionCallback } from '../../state/types';
import type { CustomFormFilled } from '#libs/custom-form/types';
import type { RootState } from '../../reducers';
import { CustomFormTitle } from '#libs/custom-form/components/CustomFormTitle.component';
import { getMyControlableMemberList } from '#libs/relationship/selectors';
import { fetchMyControlableMemberList } from '#libs/relationship/actions';
import { getFranchisor } from '#libs/franchise/selectors';
import {
  MARKETPLACE_PATH_TAB_CALENDAR,
  MARKETPLACE_PATH_TAB_PASS,
  MARKETPLACE_PATH_TAB_VOD,
  MARKETPLACE_PATH_TAB_CONTRACT,
  MARKETPLACE_PATH_TAB_WORKSHOP,
  MARKETPLACE_PATH_TAB_PRIVATE_SERVICE,
  MARKETPLACE_PATH_TAB_SHOP,
  MARKETPLACE_PATH_TAB_GIFTCARD,
} from '#libs/marketplace/constants';

import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';

const MarketplacePassPage = asyncComponent(() => import('./MarketplacePass'));

const MarketplacePrivateServiceRouter = asyncComponent(() =>
  import('./PrivateService/MarketplacePrivateService.router'),
);
const MarketplaceShopPage = asyncComponent(() =>
  import('./MarketplaceShop.page'),
);
const MarketplaceCalendarPage = asyncComponent(() =>
  import('./MarketplaceCalendarCSSOnly.page'),
);
const MarketplaceWorkshopPage = asyncComponent(() =>
  import('./MarketplaceWorkshop.page'),
);
const MarketplaceContractPage = asyncComponent(() =>
  import('./MarketplaceContract'),
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
  goToCheckout: (companyId: number, isNewCheckoutFlow: boolean) => void,
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
  goToUserSpace: (companyId: number) => void,

  auth: any,

  t: TFunction,
  classes: Object,

  disconnect: () => void,
  //  DEPRECATED
  // signup: (formdata: any, callback: () => void) => void,
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

  controlableMemberList: Array<Member>,
  fetchMyControlableMemberList: () => void,

  navigateToRelationAccount: (memberId: number) => void,

  navigateBackToMasterRelation: () => void,
} & StateHandlerType;

type State = {
  signupDialogOpen: boolean,
  currentBasketOpen: boolean,
  loginDialogOpen: boolean,
};

export class MarketPlace extends Component<Props, State> {
  state = {
    currentBasketOpen: false,
    signupDialogOpen: false,
    loginDialogOpen: false,
  };

  fetchData = () => {
    this.props.fetchCompanyTheme(this.props.companyId, {
      onSuccess: (theme) => {
        if (theme.franchisor) this.props.retrieveFranchise(theme.franchisor);
      },
    });
    this.props.fetchCompanyCustomSignUp({ company: this.props.companyId });
    this.props.fetchMarketplaceSettings(this.props.companyId, {
      onSuccess: this.sanitizeURL,
    });
    this.props.fetchMyControlableMemberList(this.props.companyId);
    this.props.fetchSCT();
    if (this.props.auth.authenticated) {
      this.props.fetchProfile();
    }
  };

  sanitizeURL = () => {
    const { settings } = this.props;

    if (!this.props.subcomponent && settings?.config?.length) {
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

      const hasMultipleComponentTypeConfig =
        (settings?.config || []).filter(
          (tabConfig) => tabConfig.component_type === componentType,
        ).length > 1;

      let configIndex = (settings?.config || []).findIndex(
        (tab) => tab.component_type === componentType,
      );

      if (hasMultipleComponentTypeConfig) {
        configIndex = paramsJson.index;
      }

      if (componentType === 'pass' && !paramsJson.isPreview) {
        const tabConfig = settings?.config?.[configIndex];
        const newPath = fromConfigToUrl(tabConfig, {
          tabSelected: configIndex,
        });
        return this.props.replace(newPath);
      }
      if (configIndex > -1) {
        paramsJson.tabSelected = configIndex;
      }
      uri.query(paramsJson);
      const pathname = uri.pathname();
      const query = uri.query();
      const newUrl = `${pathname}?${query}`;
      this.props.replace(newUrl);
    }
    return null;
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
      case MARKETPLACE_PATH_TAB_PASS:
        return (
          <MarketplacePassPage
            key={this.props.tabSelected}
            companyId={this.props.companyId}
            requestSignUp={this.openLogin}
            toggleCurrentBasketOpen={this.toggleCurrentBasketOpen}
          />
        );
      case MARKETPLACE_PATH_TAB_CONTRACT:
        return (
          <MarketplaceContractPage
            key={this.props.tabSelected}
            authenticated={this.props.auth.authenticated}
            companyId={this.props.companyId}
            goToUserSpace={() => this.props.goToUserSpace(this.props.companyId)}
            requestSignUp={this.openLogin}
          />
        );
      case MARKETPLACE_PATH_TAB_SHOP:
        return (
          <MarketplaceShopPage
            key={this.props.tabSelected}
            companyId={this.props.companyId}
            requestSignUp={this.openLogin}
            toggleCurrentBasketOpen={this.toggleCurrentBasketOpen}
          />
        );
      case MARKETPLACE_PATH_TAB_PRIVATE_SERVICE:
        return (
          <MarketplacePrivateServiceRouter
            key={this.props.tabSelected}
            authenticated={this.props.auth.authenticated}
            companyId={this.props.companyId}
            requestLogin={this.openLogin}
          />
        );
      case MARKETPLACE_PATH_TAB_WORKSHOP:
        return (
          <MarketplaceWorkshopPage
            key={this.props.tabSelected}
            companyId={this.props.companyId}
          />
        );
      case MARKETPLACE_PATH_TAB_VOD:
        return (
          <MarketplaceVodRouter
            key={this.props.tabSelected}
            requestSignUp={this.openLogin}
          />
        );
      case MARKETPLACE_PATH_TAB_GIFTCARD:
        return (
          <MarketplaceGiftcardPage
            key={this.props.tabSelected}
            authenticated={this.props.auth.authenticated}
            companyId={this.props.companyId}
            requestSignUp={this.openLogin}
            toggleCurrentBasketOpen={this.toggleCurrentBasketOpen}
          />
        );
      case MARKETPLACE_PATH_TAB_CALENDAR:
        return (
          <div className={this.props.classes.calendarContainer}>
            <MarketplaceCalendarPage
              key={this.props.tabSelected}
              authenticated={this.props.auth.authenticated}
              companyId={this.props.companyId}
              requestSignUp={this.openLogin}
              startWeekThisWeekday={false}
              toggleCurrentBasketOpen={this.toggleCurrentBasketOpen}
            />
          </div>
        );

      default: {
        return (
          <div className={this.props.classes.calendarContainer}>
            <MarketplaceCalendarPage
              key={this.props.tabSelected}
              authenticated={this.props.auth.authenticated}
              companyId={this.props.companyId}
              requestSignUp={this.openLogin}
              startWeekThisWeekday={false}
              toggleCurrentBasketOpen={this.toggleCurrentBasketOpen}
            />
          </div>
        );
      }
    }
  };

  toggleCurrentBasketOpen = (currentBasketOpen: boolean) =>
    this.setState({ currentBasketOpen });

  // DEPRECATED
  // signup = (formdata: any, options) => {
  //   if (this.props.companyId) {
  //     formdata.append('membership', this.props.companyId);
  //     this.props.signup(formdata, options);
  //   } else {
  //     this.props.signup(formdata, options);
  //   }
  // };

  toggleSignUp = (value: boolean) => {
    if (value) {
      Analytics.signupShow();
    }
    this.setState({ signupDialogOpen: value });
  };

  openLogin = () => {
    Analytics.signinShow();
    this.setState({ loginDialogOpen: true });
  };

  closeLogin = () => {
    this.setState({ loginDialogOpen: false });
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
        Analytics.signupSuccess(this.props.loginInformations);
        if (options && options.onSuccess) options.onSuccess();
      },
      onError: () => {
        if (options && options.onError) options.onError();
      },
    });
  };

  onCompanySelected = (company) => {
    this.props.push(getMarketplaceRoute(company.name, company.id));
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
      this.props.companyName.toLowerCase() !==
        this.props.theme.company_name.toLowerCase()
    ) {
      this.props.replace(
        `${urlToMarketplace(
          this.props.theme.company_name,
          this.props.companyId,
        )}/${this.props.subcomponent || ''}`,
      );
    }

    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <MemberShipValidationWrapper companyId={this.props.companyId}>
          <Analytics
            theme={this.props.theme}
            username={(this.props.auth && this.props.auth.username) || ''}
          />
          <div className={classes.container}>
            <MarketplaceAppBar
              withNavigation
              auth={this.props.auth}
              controlableMemberList={this.props.controlableMemberList}
              currentBasket={this.props.currentBasket}
              disconnect={() => {
                this.props.disconnect();
              }}
              franchisor={this.props.franchisor}
              goToUserSpace={() =>
                this.props.goToUserSpace(this.props.companyId)
              }
              handleTabChange={this.handleTabChange}
              hideAppBar={this.props.hideAppBar}
              isRelationNavigation={
                !!window.localStorage.getItem(
                  'bsport:relatedMemberMaster:http:token',
                )
              }
              logo={this.props.theme.cover}
              navigateBackToMasterRelation={
                this.props.navigateBackToMasterRelation
              }
              navigateToRelationAccount={this.props.navigateToRelationAccount}
              onCompanySelected={this.onCompanySelected}
              openCurrentBasket={() => this.toggleCurrentBasketOpen(true)}
              photo={this.props.consumerProfile?.photo}
              requestLogin={this.openLogin}
              requestSignUp={() => this.toggleSignUp(true)}
              settings={this.props.settings}
              tabSelected={this.props.tabSelected}
              theme={this.props.theme}
              websiteURL={this.props.theme.websiteURL}
            />
            <div className={classes.content}>{this.renderContent()}</div>
            <MarketplaceBasketDialog
              basket={this.props.currentBasket}
              goToCheckout={() =>
                this.props.goToCheckout(
                  this.props.currentBasket.company,
                  this.props.theme?.display_new_checkout_flow,
                )
              }
              isExcludingTax={this.props.theme.is_tax_excluded_in_marketplace}
              loading={this.props.currentBasketLoading}
              onAddCheckoutItem={(data, options?) =>
                this.props.addItemToBasket(
                  this.props.currentBasket.id,
                  data,
                  options,
                )
              }
              onCancel={() => this.toggleCurrentBasketOpen(false)}
              onRemoveCheckoutItem={(data) =>
                this.props.removeItemFromBasket(
                  this.props.currentBasket.id,
                  data,
                )
              }
              open={!!this.state.currentBasketOpen}
            />
            <Dialog
              onClose={this.closeLogin}
              open={
                this.state.loginDialogOpen && !this.props.auth.authenticated
              }
            >
              <div className="bs-setup-variable" id="bs-setup-derived-variable">
                <DialogContent>
                  <div className={classes.loginDialog}>
                    <Login
                      company
                      isPremium
                      logoHidden
                      marketplace
                      doEmailLogin={this.doEmailLogin}
                      error={this.props.auth.error}
                      errorFields={this.props.errorFields}
                      franchisor={this.props.franchisor}
                      loading={this.props.auth.loading}
                      requestSignUp={() => this.toggleSignUp(true)}
                      theme={this.props.theme}
                    />
                  </div>
                </DialogContent>
              </div>
            </Dialog>
            <CustomFormViewDialogComponent
              fullWidth
              maxWidth="md"
              onClose={this.closeSignup}
              open={
                this.state.signupDialogOpen &&
                !this.props.auth.authenticated &&
                this.props.signUpCustomForm
              }
            >
              <DialogTitle>
                <CustomFormTitle isCompany title={t('form.signUpTitle')} />
              </DialogTitle>
              <div className={classes.customFormContainer}>
                <CustomFormView
                  general_terms_and_conditions={
                    this.props.theme.general_terms_of_use
                  }
                  initial={this.props.signUpCustomForm}
                  layouts={
                    this.props.signUpCustomForm
                      ? this.props.signUpCustomForm.layout
                      : null
                  }
                  onCancel={() => {
                    this.setState({ signupDialogOpen: false });
                  }}
                  onSubmit={this.submitCustomForm}
                  onSubmitDraft={(values: CustomFormFilled) =>
                    this.props.setLoginInformations(values)
                  }
                  waiver={this.props.theme.waiver}
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
  marketplaceCssHoc(),
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
      controlableMemberList: getMyControlableMemberList(state),

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
      goToUserSpace: (companyId) => pushRouter(getUserSpaceUrl(companyId)),
      goToCheckout: (companyId, isNewCheckoutFlow) =>
        pushRouter(getCheckoutUrl(companyId, isNewCheckoutFlow)),

      // DEPRECATED
      // signupAction: signupV2,

      doEmailLogin: ({ email, password }, callback) =>
        authActions.requestLogin(email, password, { onDone: callback }),
      disconnect: authActions.disconnect,
      checkEmailExists: authActions.checkEmailExists,
      push: pushRouter,
      fetchCompanyCustomSignUp,
      submitSignUpCustomForm,

      navigateToRelationAccount: navigateToRelationAccountAction,
      navigateBackToMasterRelation: navigateBackToMasterRelationAction,
      fetchMyControlableMemberList,
      retrieveFranchise,
      // navigation
      replace,
    },
  ),
  connect((state: RootState, { theme }) => ({
    franchisor: theme?.franchisor ? getFranchisor(state) : undefined,
  })),
  withHandlers({
    navigateBackToMasterRelation:
      ({ companyId, navigateBackToMasterRelation, companyName }) =>
      () => {
        navigateBackToMasterRelation({
          company: companyId,
          companyName,
        });
      },
    navigateToRelationAccount:
      ({ companyId, navigateToRelationAccount, companyName }) =>
      (relatedMemberId) => {
        navigateToRelationAccount({
          relatedMemberId,
          company: companyId,
          companyName,
        });
      },
    goToTab:
      ({ companyName, companyId, push }) =>
      (path) =>
        push(getMarketplaceRoute(companyName, companyId, path)),
  }),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
)(MarketPlace);
