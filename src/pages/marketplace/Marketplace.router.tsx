// @flow

import React from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';

import asyncComponent from '../../AsyncComponent';
import MemberShipValidationWrapper from '../consumer/MemberShipValidationWrapper.component';
import { RootState } from '../../reducers';

const MarketplaceResolver = asyncComponent(
  () => import('./MarketplaceResolver.page'),
);
const Marketplace = asyncComponent(() => import('./Marketplace.page'));
const MarketplaceAsManager = asyncComponent(
  () => import('./MarketplaceAsManager.page'),
);

const MarketplaceCustomForm = asyncComponent(
  () => import('./MarketplaceCustomForm.page'),
);
type Props = { is_manager: boolean; is_franchisor: boolean };

export class MarketplaceRouter extends React.Component<Props> {
  render() {
    if (this.props.is_manager || this.props.is_franchisor) {
      return <MarketplaceAsManager />;
    }
    return (
      <Switch>
        <Route exact path="/m/:companyName" component={MarketplaceResolver} />
        <MemberShipValidationWrapper>
          <Switch>
            <Route
              path="/m/:companyName/:companyId/form/:customFormId"
              component={MarketplaceCustomForm}
            />
            <Route
              exact
              path="/m/:companyName/:companyId/"
              component={Marketplace}
            />

            <Route
              path="/m/:companyName/:companyId/:subcomponent/"
              component={Marketplace}
            />
          </Switch>
        </MemberShipValidationWrapper>
      </Switch>
    );
  }
}

export default connect((state: RootState) => ({
  is_manager: state.auth.is_manager,
  is_franchisor: state.auth.is_franchisor,
}))(MarketplaceRouter);
