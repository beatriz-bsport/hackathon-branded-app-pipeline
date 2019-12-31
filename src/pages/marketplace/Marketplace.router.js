// @flow

import React from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';

import asyncComponent from '../../AsyncComponent';

const MarketplaceResolver = asyncComponent(() =>
  import('./MarketplaceResolver.page'),
);
const Marketplace = asyncComponent(() => import('./Marketplace.page'));
const MarketplaceAsManager = asyncComponent(() =>
  import('./MarketplaceAsManager.page'),
);

type Props = { is_manager: boolean };

export class MarketplaceRouter extends React.Component<Props> {
  render() {
    if (this.props.is_manager) {
      return <MarketplaceAsManager />;
    }
    return (
      <Switch>
        <Route exact path="/m/:companyName" component={MarketplaceResolver} />
        <Route
          exact
          path="/m/:companyName/:companyId/"
          component={Marketplace}
        />
        <Route
          exact
          path="/m/:companyName/:companyId/:tab/"
          component={Marketplace}
        />
      </Switch>
    );
  }
}

export default connect((state) => ({
  is_manager: state.auth.is_manager,
}))(MarketplaceRouter);
