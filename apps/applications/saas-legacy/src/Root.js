// @flow
import React, { Component } from 'react';
import ConsentManager from './components/consent/ConsentManager.component';
import { DIALOG_MODE_DEACTIVATED } from '@bsport/common/lib/master-data/widget-dialog-mode.js';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { compose, withProps } from 'recompose';

import { isPendingEmailConfirmation } from '#src/libs/login/selectors';
import asyncComponent from './AsyncComponent';
import Banner from './components/navigation/Banner/Banner.component';
import Config from './config';
import { parseQueryString } from './http';
import { fetchAccessLevel } from './actions/auth.actions';
import WidgetUtils from './libs/widget/WidgetUtils';
import withQueryParams from './hocs/with-query-params.hoc';
import Analytics from './components/analytics/Analytics.component';
import OnboardingPageTracker from './components/onboarding/OnboardingPageTracker.tsx';
import { removeTrackingScripts } from './components/analytics/utils.ts';
import type { NetworkState } from './libs/network/types';
import { onboardingManagerClient } from './components/onboarding/onboardingManagerClient.ts';

const MarketPlaceRouter = asyncComponent(() =>
  import('./pages/marketplace/Marketplace.router'),
);
const LoginRouter = asyncComponent(() => import('./pages/login/Login.router'));
const UserspaceSwitcher = asyncComponent(() =>
  import('./pages/UserspaceSwitcher.page'),
);
const ConsumerRouter = asyncComponent(() =>
  import('./pages/consumer/Consumer.router'),
);
const CheckoutRouter = asyncComponent(() =>
  import('./pages/checkout/Checkout.router'),
);
const BoutiqueFlowRouter = asyncComponent(() =>
  import('./pages/checkout/BoutiqueFlow.router'),
);

const DeprecatedCheckoutPagesRouter = asyncComponent(() =>
  import(
    './pages/checkout/deprecated-pages-redirection/DeprecatedPages.router'
  ),
);

const RNWebView = asyncComponent(() =>
  import('./pages/rn-webview/RNWebView.router'),
);

const WidgetRouter = asyncComponent(() =>
  import('./pages/widget/Widget.router'),
);

const CheckIn = asyncComponent(() => import('./pages/check-in/CheckIn.page'));
const ConfirmEmailRouter = asyncComponent(() =>
  import('./pages/login/ConfirmEmail.router.tsx'),
);
const ConsumerUnsubscribe = asyncComponent(() =>
  import('./pages/consumer/ConsumerUnsubscriber.page'),
);
const CompanyExternalRouter = asyncComponent(() =>
  import('./pages/company-external/CompanyExternal.router'),
);

const SentryTestError = asyncComponent(() =>
  import('./pages/SentryTestError.component'),
);
const NewWindowHandler = asyncComponent(() =>
  import('./pages/login/NewWindowHandler.page.tsx'),
);
const CoachBackoffice = asyncComponent(() =>
  import('./pages/coach-userspace/CoachBackoffice.router'),
);

const QuicksaleRouter = asyncComponent(() =>
  import('./pages/quicksale/Quicksale.router'),
);

const ReferralRegistration = asyncComponent(() =>
  import('./pages/login/ReferralRegistration.page'),
);

const PrivacyPolicy = asyncComponent(() =>
  import('./pages/privacy-policy/PrivacyPolicy.page.tsx'),
);

const styles = () => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
});

type Props = {
  classes: Object,
  rehydrated: boolean,
  initializating: boolean,
  networkState: NetworkState,
  fetchAccessLevel: (token: string) => void,
  location: any,

  pendingEmailConfirmation: boolean,
  authenticated: boolean,
  isManager: boolean,
  isFranchisor: boolean,
  isCoach: boolean,
  theme: CompanyTheme,
  id: number,
  username: string,
  company_role?: number,
  franchise_role?: number,
};

export class Root extends Component<Props> {
  UNSAFE_componentWillMount() {
    const query = parseQueryString(window.location.href);

    /**
     * injected by the widget
     */
    if (query.authToken) {
      this.props.fetchAccessLevel(query.authToken);
    }

    /**
     * injected by the widget
     */
    if (query.context && query.context === 'widget') {
      WidgetUtils.setWidgetContext(query.parentUrl);

      if (
        query.dialogMode &&
        ['string', 'number'].includes(typeof query.dialogMode)
      ) {
        /**
         * injected by the widget
         */
        WidgetUtils.setDialogMode(parseInt(query.dialogMode));
      }
      if (query.widgetType) {
        /**
         * injected by the widget
         */
        WidgetUtils.setWidgetType(query.widgetType);
      }
      if (query?.parentElementId?.replace('?', '')) {
        /**
         * injected by the widget
         */

        WidgetUtils.setParentElementId(query.parentElementId.replace('?', ''));
      }
    }
  }

  async componentDidMount() {
    const query = parseQueryString(window?.location?.href ?? '');

    if (query.consumerspacecontext) {
      WidgetUtils.setConsumerSpaceContext(query.consumerspacecontext);
    }

    if (this.props.isManager) {
      await onboardingManagerClient.loadScript();
      this.initOnboardingUser();
    }
  }

  initOnboardingUser(prevProps) {
    const { id, username, company_role, franchise_role, theme } = this.props;

    if (!id || !username) {
      return;
    }

    if (
      prevProps &&
      prevProps.id === id &&
      prevProps.username === username &&
      prevProps.company_role === company_role &&
      prevProps.franchise_role === franchise_role &&
      prevProps.theme?.company === theme?.company &&
      prevProps.theme?.franchisor === theme?.franchisor
    ) {
      return;
    }

    onboardingManagerClient.initUser({
      user_id: String(id),
      username,
      company_role,
      franchise_role,
      company_id: theme?.company,
      franchise_id: theme?.franchisor,
      environment: Config.NODE_ENV,
      app: 'saas-legacy',
    });
  }

  // Function to send a scroll-up post message to the parent widget
  sendScrollUpPostMessageToWidget = () => {
    // Check if the current environment is within a widget and the widget is in deactivated dialog mode
    if (
      WidgetUtils.isWidget() &&
      WidgetUtils.getDialogMode() === DIALOG_MODE_DEACTIVATED
    ) {
      // Create a message object to be sent via postMessage
      const message = {
        type: 'bsport-widget-scrollup',
        data: {
          parentElementId: WidgetUtils.getParentElementId(),
        },
      };
      // Send the message to the parent window using postMessage
      window?.parent?.postMessage(message, '*');
    }
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.location !== this.props.location) {
      // Call the function to send a scroll-up post message to the widget
      this.sendScrollUpPostMessageToWidget();
      if (this.props.location && this.props.location.pathname) {
        if (this.props.location.pathname.includes('/spot-scheduling')) {
          document.body.style.overflowX = 'hidden';
          document.body.style.overflowY = 'hidden';
        } else {
          document.body.style.overflowX = 'visible';
          document.body.style.overflowY = 'visible';
        }
      }
    }

    if (this.props.isManager) {
      this.initOnboardingUser(prevProps);
    }
  }

  render() {
    const {
      classes,
      rehydrated,
      initializating,
      pendingEmailConfirmation,
      authenticated,
      isManager,
      isFranchisor,
      isCoach,
      theme,
      networkState,
      id,
      username,
      company_role,
      franchise_role,
    } = this.props;

    const isUsingMarketplace = !isManager && !isFranchisor && !isCoach;

    if (!isUsingMarketplace) {
      removeTrackingScripts();
    }

    if (!rehydrated || initializating) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.root}>
        <OnboardingPageTracker />
        {!WidgetUtils.isWidget() && (
          <Banner
            paymentMethodMissing
            environment={Config.REACT_APP_SENTRY_ENVIRONMENT}
            networkState={networkState}
          />
        )}
        {theme && isUsingMarketplace && <Analytics theme={theme} />}
        <ConsentManager
          apiKey={Config.REACT_APP_DIDOMI_API_KEY}
          domain={window.location.hostname}
          noticeId={Config.REACT_APP_DIDOMI_NOTICE_ID}
        />
        {!pendingEmailConfirmation || !authenticated ? (
          <Switch>
            <Route
              component={CompanyExternalRouter}
              path="/external/:companyId/"
            />
            <Route
              component={PrivacyPolicy}
              path="/privacy-policy/:customAppConfigurationId"
            />
            <Route component={SentryTestError} path="/sentry" />
            <Route component={LoginRouter} path="/login" />
            <Route
              component={ConsumerUnsubscribe}
              path="/c/:companyId/unsubscribe/:unsubscribe_uuid"
            />
            <Route
              component={DeprecatedCheckoutPagesRouter}
              path="/(|customer/)payment"
            />
            <Route component={CheckoutRouter} path="/checkout/:companyId" />
            <Route component={ConsumerRouter} path="/customer" />
            <Route component={MarketPlaceRouter} path="/m/" />

            <Route component={CheckIn} path="/check-in" />
            <Route component={RNWebView} path="/rn-webview" />
            <Route component={ConsumerRouter} path="/c/:companyId" />
            <Route component={CoachBackoffice} path="/co/:companyId" />
            <Route component={ConsumerRouter} path="/c/" />
            <Route component={NewWindowHandler} path="/new-window" />
            {/* @debt(5, 3, 3): This router is duplicated to avoid triggering side effects when no path matches */}
            <Route
              component={BoutiqueFlowRouter}
              path="/one-click-booking/:companyId/:offerId"
            />
            <Route
              component={BoutiqueFlowRouter}
              path="/pass-express-checkout/:companyId/:passId/:passType"
            />
            <Route
              component={BoutiqueFlowRouter}
              path="/booker-module-s/:companyId/:offerId"
            />
            <Route
              component={BoutiqueFlowRouter}
              path="/checkout-s/:companyId"
            />
            <Route
              component={BoutiqueFlowRouter}
              path="/contract-s/:companyId/:contractId"
            />
            <Route
              component={WidgetRouter}
              path="/widget/:companyName/:companyId"
            />
            <Route component={QuicksaleRouter} path="/quicksale/" />
            <Route
              component={ReferralRegistration}
              path="/referral/:referralUuid"
            />
            <Route component={UserspaceSwitcher} path="/" />
          </Switch>
        ) : (
          <Switch>
            <Route
              component={ConfirmEmailRouter}
              path="/login/email_confirmation/"
            />
            <Redirect to="/login/email_confirmation/" />
          </Switch>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rehydrated: state._persist && state._persist.rehydrated,
    initializating: state.auth.initializating,
    networkState: state.network.networkState,
    pendingEmailConfirmation: isPendingEmailConfirmation(state),
    authenticated: state.auth.authenticated,
    isManager: state.auth.is_manager,
    isFranchisor: state.auth.is_franchisor,
    isCoach: state.auth.is_coach,
    theme: state.theme.theme,
    id: state.auth.id,
    username: state.auth.username,
    company_role: state.auth.role,
    franchise_role: state.auth.franchise_role,
  };
}

const mapDispatchToProps = {
  fetchAccessLevel,
};

export default compose(
  withRouter,
  withQueryParams([['membership'], 'queryParams']),
  withProps(({ queryParams }) => ({
    companyId: parseInt(queryParams?.membership),
  })),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(Root);
