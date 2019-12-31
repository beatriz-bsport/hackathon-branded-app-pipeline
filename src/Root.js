// @flow
import React, { Component } from 'react';

import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';

import asyncComponent from './AsyncComponent';
import Banner from './components/navigation/Banner.component';
import Config from './config';

const MarketPlace = asyncComponent(() =>
  import('./pages/marketplace/Marketplace.router'),
);
const LoginRouter = asyncComponent(() =>
  import('./pages/login/LoginRouter.component'),
);
const UserspaceSwitcher = asyncComponent(() =>
  import('./pages/UserspaceSwitcher.component'),
);
const ConsumerHome = asyncComponent(() =>
  import('./pages/ConsumerHome.component'),
);
const CheckoutRouter = asyncComponent(() =>
  import('./pages/checkout/Checkout.router'),
);
const PaymentRouter = asyncComponent(() => import('./pages/Payment.router'));

const RNWebView = asyncComponent(() =>
  import('./pages/rn-webview/RNWebView.router'),
);

const CheckIn = asyncComponent(() => import('./pages/check-in/CheckIn.page'));
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
};

export class Root extends Component<Props> {
  render() {
    const { classes, rehydrated, initializating } = this.props;

    if (!rehydrated || initializating) {
      return <LinearProgress />;
    }

    return (
      <div className={classes.root}>
        <Banner
          networkAvailable={this.props.networkAvailable}
          environment={Config.REACT_APP_SENTRY_ENVIRONMENT}
        />
        <Switch>
          <Route
            path="/external/:companyId/"
            component={CompanyExternalRouter}
          />
          <Route path="/sentry" component={SentryTestError} />
          <Route path="/login" component={LoginRouter} />
          <Route path="/(|customer/)payment" component={PaymentRouter} />
          <Route path="/customer" component={ConsumerHome} />
          <Route path="/m/" component={MarketPlace} />
          <Route path="/checkout" component={CheckoutRouter} />
          <Route path="/check-in" component={CheckIn} />
          <Route path="/rn-webview" component={RNWebView} />
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
export default withRouter(withStyles(styles)(connect(mapStateToProps)(Root)));
