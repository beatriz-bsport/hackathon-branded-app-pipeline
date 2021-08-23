// @flow
import React, { Component } from 'react';

import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';

import { withTranslation } from 'react-i18next';
import asyncComponent from './AsyncComponent';
import namespaces from './i18n/namespaces.json';
import Banner from './components/navigation/Banner.component';
import Config from './config';
import IEMessage from './components/IEMessage.component';
import { parseQueryString } from './http';
import { fetchAccessLevel } from './actions/auth.actions';
import WidgetUtils from './libs/widget/WidgetUtils';

const MarketPlaceRouter = asyncComponent(() =>
  import('./pages/marketplace/Marketplace.router'),
);
const LoginRouter = asyncComponent(() => import('./pages/login/Login.router'));
const UserspaceSwitcher = asyncComponent(() =>
  import('./pages/UserspaceSwitcher.component'),
);
const ConsumerRouter = asyncComponent(() =>
  import('./pages/consumer/Consumer.router'),
);
const CheckoutRouter = asyncComponent(() =>
  import('./pages/checkout/Checkout.router'),
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
const ConsumerUnsubscribe = asyncComponent(() =>
  import('./pages/consumer/ConsumerUnsubscriber.page'),
);
const CompanyExternalRouter = asyncComponent(() =>
  import('./pages/company-external/CompanyExternal.router'),
);

const SentryTestError = asyncComponent(() =>
  import('./pages/SentryTestError.component'),
);

const styles = () => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
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
};

export class Root extends Component<Props> {
  componentWillMount(): * {
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
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.location !== this.props.location) {
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
    const { classes, rehydrated, initializating } = this.props;

    if (!rehydrated || initializating) {
      return <LinearProgress />;
    }
    return (
      <div className={classes.root}>
        <IEMessage />

        {!WidgetUtils.isWidget() && (
          <Banner
            networkAvailable={this.props.networkAvailable}
            paymentMethodMissing
            environment={Config.REACT_APP_SENTRY_ENVIRONMENT}
          />
        )}

        <Switch>
          <Route
            path="/external/:companyId/"
            component={CompanyExternalRouter}
          />
          <Route path="/sentry" component={SentryTestError} />
          <Route path="/login" component={LoginRouter} />
          <Route
            path="/c/:companyId/unsubscribe/:unsubscribe_uuid"
            component={ConsumerUnsubscribe}
          />
          <Route
            path="/(|customer/)payment"
            component={DeprecatedCheckoutPagesRouter}
          />
          <Route path="/checkout/:companyId" component={CheckoutRouter} />
          <Route path="/customer" component={ConsumerRouter} />
          <Route path="/m/" component={MarketPlaceRouter} />

          <Route path="/check-in" component={CheckIn} />

          <Route path="/rn-webview" component={RNWebView} />
          <Route path="/c/:companyId" component={ConsumerRouter} />
          <Route path="/c/" component={ConsumerRouter} />
          <Route
            path="/widget/:companyName/:companyId"
            component={WidgetRouter}
          />
          <Route path="/" component={UserspaceSwitcher} />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rehydrated: state._persist && state._persist.rehydrated,
    initializating: state.auth.initializating,
    networkAvailable: state.network.isAvailable,
  };
}

const mapDispatchToProps = {
  fetchAccessLevel,
};

export default withRouter(
  withTranslation(namespaces)(
    withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Root)),
  ),
);
