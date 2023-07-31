// @ts-nocheck
import React from 'react';
import { Route, Switch } from 'react-router';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';
import {
  BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
  BsportRequestFromHeaderValue,
} from '../../constants';
import asyncComponent from '../../AsyncComponent';
import MemberShipValidationWrapper from '../consumer/MemberShipValidationWrapper.component';
import { RootState } from '../../reducers';
import namespaces from '../../i18n/namespaces.json';

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
  componentDidMount() {
    window?.sessionStorage?.setItem(
      BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
      BsportRequestFromHeaderValue.SAAS_MARKETPLACE_ROUTER,
    );
  }

  componentWillUnmount() {
    window?.sessionStorage?.removeItem(
      BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
    );
  }

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

export default withTranslation(namespaces)(
  connect((state: RootState) => ({
    is_manager: state.auth.is_manager,
    is_franchisor: state.auth.is_franchisor,
  }))(MarketplaceRouter),
);
