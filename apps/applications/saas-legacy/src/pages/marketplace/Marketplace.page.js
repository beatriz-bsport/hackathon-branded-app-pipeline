// @flow
import React, { Component } from 'react';
import URI from 'urijs';
import { compose, withProps, withHandlers, withStateHandlers } from 'recompose';
import { withRouter } from 'react-router';

import Grid from '@material-ui/core/Grid';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { MuiThemeProvider } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';

import { connect } from 'react-redux';
import { replace, push as pushRouter } from 'connected-react-router';

import { withTranslation, TFunction } from 'react-i18next';

import {
  CUSTOM_FORM_FIELD_SIGN_UP_EMAIL,
  CUSTOM_FORM_FIELD_SIGN_UP_PASSWORD,
} from '@bsport/common/lib/master-data/custom-form.js';
import chroma from 'chroma-js';
import { retrieveCompanyCssConfiguration as retrieveCompanyCssConfigurationAction } from '#src/libs/exportable-components/actions';
import { fetchCompanyTheme } from '#src/libs/theme/actions';
import themeSelectors from '#src/libs/theme/selectors';
import ApplyCustomCssStyles from '#src/libs/widget/components/ApplyCustomCssStyles.component';
import Login from '#src/components/css-only/Login/Login.component';
import MarketplaceAppBar from '#src/libs/marketplace/components/@AppBar/MarketplaceAppBar';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import CustomFormPortal from '#Fabrique/Temporary/CustomFormPortal';
import MarketplaceNavigation from '#src/libs/marketplace/components/@Navigation/MarketplaceNavigation';

import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '#src/libs/checkout/actions';

import { getCurrentBasket } from '#src/libs/checkout/selectors';
import type { Basket } from '#src/libs/checkout/types';

import { fetchSCT } from '#src/libs/category/actions';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';

import {
  getMarketplaceRoute,
  fromConfigToUrl,
  getUserSpaceUrl,
  getCheckoutUrl,
  getPassExpressCheckoutUrl,
} from '#src/libs/marketplace/routing-utils';
import { urlToMarketplace } from '#src/libs/marketplace/utils';
import { getBasketBuyableItemsCount } from '#src/libs/checkout/utils';

import { fetchProfile } from '#src/libs/consumer-space/actions';

import {
  MarketplaceSettings,
  MarketplaceTabConfig,
} from '#src/libs/marketplace/types';
import { fetchMarketplaceSettings } from '#src/libs/marketplace/actions';
import {
  fetchCompanyCustomSignUp,
  submitSignUpCustomForm,
} from '#src/libs/custom-form/actions';
import CustomFormView from '#src/libs/custom-form/components/consumer-form/CustomFormView.form';
import CustomFormViewDialogComponent from '#src/libs/custom-form/components/consumer-form/CustomFormViewDialog.component';
import { getSignUpCustomFormWithEnabledField } from '#src/libs/custom-form/selectors';
import { retrieveFranchise as retrieveFranchiseAction } from '#src/libs/franchise/actions';
import type { CustomFormFilled } from '#src/libs/custom-form/types';
import { CustomFormTitle } from '#src/libs/custom-form/components/CustomFormTitle.component';
import { getMyControlableMemberList } from '#src/libs/relationship/selectors';
import { fetchMyControlableMemberList } from '#src/libs/relationship/actions';
import { getFranchisor } from '#src/libs/franchise/selectors';
import {
  getMarketplaceSettings,
  getMarketplaceSettingsConfig,
} from '#src/libs/marketplace/selectors';
import {
  MARKETPLACE_PATH_TAB_CALENDAR,
  MARKETPLACE_PATH_TAB_PASS,
  MARKETPLACE_PATH_TAB_VOD,
  MARKETPLACE_PATH_TAB_CONTRACT,
  MARKETPLACE_PATH_TAB_WORKSHOP,
  MARKETPLACE_PATH_TAB_PRIVATE_SERVICE,
  MARKETPLACE_PATH_TAB_SHOP,
  MARKETPLACE_PATH_TAB_GIFTCARD,
} from '#src/libs/marketplace/constants';

import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import ApplyCustomTheme from '#src/libs/exportable-components/ApplyCustomTheme.component';

import { CUSTOM_FORM_CSS_VARIANT_ACTIVATED } from '#src/libs/custom-form/constants';
import type { RootState } from '../../reducers';
import type { OptionCallback } from '../../state/types';
import MemberShipValidationWrapper from '../consumer/MemberShipValidationWrapper.component';
import MarketplaceBasketDialog from './MarketplaceBasketDialog.component';
import {
  // DEPRECATED
  // signupV2,
  navigateToRelationAccount as navigateToRelationAccountAction,
  navigateBackToMasterRelation as navigateBackToMasterRelationAction,
} from '../../actions/auth.actions';
import { auth as authActions } from '../../actions';
import asyncComponent from '../../AsyncComponent';
import { parseQueryString } from '../../http';
import { getTheme } from '../../theme';

import MarketplaceBasketSummaryDialogCssOnly from '../../libs/marketplace/components/@Basket/MarketplaceBasketSummaryDialogCssOnly';
import { getItemInStorage } from '../../utils/storage';
import { STORAGE_KEY_BSPORT_RELATED_MEMBER_TOKEN } from '../../actions/constants';
import analyticsUtils from '../../components/analytics/analytics';
import { PassesPageTabNames } from '../../libs/marketplace/types';
import Config from '#src/config';

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
const Passes = asyncComponent(() => import('#src/pages/marketplace/passes'));

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter>;
type Props = {
  companyName: string,
  companyId: number,
  company: MarketPlaceCompany,
  companyThemeLoading: boolean,
  hideAppBar?: boolean,
  errorFields?: { email?: string, password?: string },
  fetchSCT: () => void,
  fetchCurrentBasket: (companyId: number) => void,
  currentBasket?: Basket,
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
  goToUserSpace: (companyId: number) => void,
  auth: any,
  t: TFunction,
  classes: Object,
  disconnect: () => void,
  fetchCompanyTheme: () => void,
  theme: any,
  settings: MarketplaceSettings,
  settingsLoading: boolean,
  tabSelected?: number,
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
    this.props.retrieveCompanyCssConfiguration(this.props.companyId);
    this.props.fetchCompanyTheme(this.props.companyId, {
      onSuccess: (companyTheme) => {
        if (companyTheme.franchisor)
          this.props.retrieveFranchise(companyTheme.franchisor);
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
        (settings?.config ?? []).filter(
          (tabConfig) => tabConfig.component_type === componentType,
        ).length > 1;

      let configIndex = (settings?.config ?? []).findIndex(
        (tab) => tab.component_type === componentType,
      );

      if (hasMultipleComponentTypeConfig) {
        configIndex = paramsJson.index;
      }

      if (componentType === 'pass' && !paramsJson.isPreview) {
        const tabConfig = settings?.config?.[configIndex];
        const newPath = fromConfigToUrl(tabConfig, {
          tabSelected: configIndex,
          tabName: PassesPageTabNames.PASSES,
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

  redirectToPassExpressCheckout = ({ passType, passId }) => {
    const canRedirect =
      this.props.companyTheme.one_click_checkout_enabled &&
      !this.props.companyTheme.requires_email_confirmation_when_signing_up;

    if (canRedirect) {
      this.props.push(
        getPassExpressCheckoutUrl(
          Number(this.props.companyId),
          Number(passId),
          passType,
        ),
      );
    } else {
      this.openLogin();
    }
  };

  renderContent = () => {
    if (!this.props.companyId) {
      return null;
    }

    switch (this.props.subcomponent) {
      case MARKETPLACE_PATH_TAB_PASS:
        return this.props.companyTheme?.revamped_passes_page_enabled ? (
          <Passes
            key={this.props.tabSelected}
            companyId={this.props.companyId}
            requestSignUp={this.openLogin}
            toggleCurrentBasketOpen={this.toggleCurrentBasketOpen}
          />
        ) : (
          <MarketplacePassPage
            key={this.props.tabSelected}
            companyId={this.props.companyId}
            redirectToPassExpressCheckout={this.redirectToPassExpressCheckout}
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

  toggleSignUp = (value: boolean) => {
    if (value) {
      analyticsUtils.onShowSignup();
    }
    this.setState({ signupDialogOpen: value });
  };

  openLogin = () => {
    analyticsUtils.onShowSignin();
    this.setState({ loginDialogOpen: true });
  };

  closeLogin = () => {
    this.setState({ loginDialogOpen: false });
  };

  closeSignup = () => this.setState({ signupDialogOpen: false });

  doEmailLogin = ({ email, password }: { email: string, password: string }) => {
    this.props.doEmailLogin({ email, password }, () => {
      this.props.fetchProfile();
      this.props.fetchCurrentBasket(this.props.companyId);
    });
  };

  submitCustomForm = (formdata: FormData, options?: OptionCallback) => {
    this.props.submitSignUpCustomForm(formdata, this.props.companyId, {
      onSuccess: () => {
        this.doEmailLogin(this.props.loginInformations);
        analyticsUtils.onSignupSuccess(this.props.loginInformations);
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

  handleSubmitDraft = (values: CustomFormFilled) =>
    this.props.setLoginInformations(values);

  handlCancelCustomForm = () => {
    this.setState({ signupDialogOpen: false });
  };

  onRequestResetPassword = (url) => {
    return this.props.push(url);
  };

  render() {
    const { companyThemeLoading, classes, t } = this.props;

    if (
      companyThemeLoading ||
      !this.props.companyTheme ||
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
      !!this.props.companyTheme.company_name &&
      this.props.companyName.toLowerCase() !==
        this.props.companyTheme.company_name.toLowerCase()
    ) {
      this.props.replace(
        `${urlToMarketplace(
          this.props.companyTheme.company_name,
          this.props.companyId,
        )}/${this.props.subcomponent || ''}`,
      );
    }

    return (
      <MarketplaceNavigation
        authStateInvalidFields={this.props.errorFields}
        authStateLoading={this.props.loginProcessing}
        authUsername={this.props.auth.username || ''}
        basketProductListCount={getBasketBuyableItemsCount(
          this.props.currentBasket?.checkout_items ?? [],
        )}
        companyTheme={this.props.companyTheme}
        customConfiguration={this.props.customConfiguration}
        franchisor={this.props.franchisor}
        handleCloseLoginDialog={this.closeLogin}
        handleCloseSignUpDialog={this.closeSignup}
        handleEmailLogin={this.doEmailLogin}
        handleSubmitCustomForm={this.submitCustomForm}
        handleSubmitDraftCustomForm={this.handleSubmitDraft}
        isAuthenticated={this.props.auth.authenticated}
        isAuthStateError={!!this.props.auth.error}
        isLoginDialogOpen={this.state.loginDialogOpen}
        isSettingsConfigLoading={false}
        isSignUpDialogOpen={this.state.signupDialogOpen}
        memberFirstName={this.props.consumerProfile?.first_name}
        memberName={this.props.userFullName ?? ''}
        memberRelationshipList={this.props.controlableMemberList}
        navigateBackToMasterRelation={this.props.navigateBackToMasterRelation}
        navigateToRelationAccount={this.props.navigateToRelationAccount}
        onRequestResetPassword={this.onRequestResetPassword}
        onToggleSignUpDialog={this.toggleSignUp}
        push={this.props.push}
        signUpCustomForm={this.props.signUpCustomForm}
        tabConfigList={this.props.marketplaceSettingsConfig}
        tabSelected={this.props.tabSelected}
      >
        {this.renderContent()}
      </MarketplaceNavigation>
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
    hideNavigation: location.search.includes('hideNavigation=true'),
    tabSelected: parseQueryString(location.search).tabSelected,
  })),
  connect(
    (state: RootState) => ({
      auth: state.auth,
      controlableMemberList: getMyControlableMemberList(state),
      userFullName: state.auth.name,
      loginProcessing: state.auth.loading,
      currentBasket: getCurrentBasket(state),
      currentBasketLoading: state.checkout.basket.current.loading,
      consumerProfile: state.consumer.profile,
      companyTheme: state.theme.theme,
      companyThemeLoading: state.theme.loading,
      settings: getMarketplaceSettings(state),
      settingsLoading: state.marketplace.loading,
      errorFields: state.auth.invalidFields,
      checkEmailExistsLoading: state.auth.emailExists.loading,
      emailExists: state.auth.emailExists.exists,
      signUpCustomForm: getSignUpCustomFormWithEnabledField(state),
      customConfiguration: state.exportableComponents.customCss,
      marketplaceSettingsConfig: getMarketplaceSettingsConfig(state),
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
      goToCheckout: (companyId) => pushRouter(getCheckoutUrl(companyId)),

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
      retrieveFranchise: retrieveFranchiseAction,
      // navigation
      replace,
      retrieveCompanyCssConfiguration: retrieveCompanyCssConfigurationAction,
    },
  ),
  connect((state: RootState) => ({
    franchisor: themeSelectors.getTheme(state)?.franchisor
      ? getFranchisor(state)
      : undefined,
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
