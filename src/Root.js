// @flow
import React, { Component } from 'react';
import { DIALOG_MODE_DEACTIVATED } from '@bsport/common/lib/master-data/widget-dialog-mode';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { compose, withProps } from 'recompose';

import { isPendingEmailConfirmation } from '#src/libs/login/selectors';
import asyncComponent from './AsyncComponent';
import Banner from './components/navigation/Banner.component';
import Config from './config';
import IEMessage from './components/IEMessage.component';
import { parseQueryString } from './http';
import { fetchAccessLevel } from './actions/auth.actions';
import WidgetUtils from './libs/widget/WidgetUtils';
import { checkBsportPluginActivated } from './libs/plugin/actions';
import withQueryParams from './hocs/with-query-params.hoc';

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
  networkAvailable: boolean,
  fetchAccessLevel: (token: string) => void,
  location: any,
  checkBsportPluginActivated: () => void,
  isPluginActivated: boolean,

  pendingEmailConfirmation: boolean,
  authenticated: boolean,
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
      WidgetUtils.setWidgetContext();
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

  componentDidMount() {
    this.props.checkBsportPluginActivated();
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
  }

  render() {
    const {
      classes,
      rehydrated,
      initializating,
      pendingEmailConfirmation,
      authenticated,
    } = this.props;

    if (!rehydrated || initializating) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.root}>
        <IEMessage />

        {!WidgetUtils.isWidget() && (
          <Banner
            paymentMethodMissing
            environment={Config.REACT_APP_SENTRY_ENVIRONMENT}
            isPluginActivated={this.props.isPluginActivated}
            networkAvailable={this.props.networkAvailable}
          />
        )}

        {!pendingEmailConfirmation || !authenticated ? (
          <Switch>
            <Route
              component={CompanyExternalRouter}
              path="/external/:companyId/"
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
    networkAvailable: state.network.isAvailable,
    isPluginActivated: state.plugin.isPluginActivated,
    pendingEmailConfirmation: isPendingEmailConfirmation(state),
    authenticated: state.auth.authenticated,
  };
}

const mapDispatchToProps = {
  fetchAccessLevel,
  checkBsportPluginActivated,
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
