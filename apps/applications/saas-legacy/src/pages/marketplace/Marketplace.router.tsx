import React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedProps, connect } from 'react-redux';

import { WithTranslation, withTranslation } from 'react-i18next';
import {
  BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
  BsportRequestFromHeaderValue,
} from '../../constants';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent';
import { RootState } from '../../reducers';
import namespaces from '../../i18n/namespaces.json';
import { removeItemInStorage, setItemInStorage } from '#src/utils/storage';
import { requestOptInTrackingB2C as requestOptInTrackingB2CAction } from '#src/components/analytics/actions';

const MarketplaceResolver = asyncComponent(
  // @ts-expect-error
  () => import('./MarketplaceResolver.page'),
);

// @ts-expect-error
const Marketplace = asyncComponent(() => import('./Marketplace.page'));

const MarketplaceAsManager = asyncComponent(
  // @ts-expect-error
  () => import('./MarketplaceAsManager.page'),
);

const MarketplaceCustomForm = asyncComponent(
  () => import('./MarketplaceCustomForm.page'),
);
type Props = ConnectedProps<typeof connector> & WithTranslation;

export class MarketplaceRouter extends React.Component<Props> {
  componentDidMount() {
    setItemInStorage(
      'session',
      BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION,
      BsportRequestFromHeaderValue.SAAS_MARKETPLACE_ROUTER,
    );

    // Opt in B2C tracking and opt out B2B tracking
    this.props.requestOptInTrackingB2C();
  }

  componentWillUnmount() {
    removeItemInStorage('session', BSPORT_REQUEST_FROM_HEADER_STORAGE_LOCATION);
  }

  render() {
    if (this.props.is_manager || this.props.is_franchisor) {
      return <MarketplaceAsManager />;
    }
    return (
      <Switch>
        <Route exact component={MarketplaceResolver} path="/m/:companyName" />
        <Switch>
          <Route
            component={MarketplaceCustomForm}
            path="/m/:companyName/:companyId/form/:customFormId"
          />
          <Route
            exact
            component={Marketplace}
            path="/m/:companyName/:companyId/"
          />
          <Route
            component={Marketplace}
            path="/m/:companyName/:companyId/:subcomponent/"
          />
        </Switch>
      </Switch>
    );
  }
}

const connector = connect(
  (state: RootState) => ({
    is_manager: state.auth.is_manager,
    is_franchisor: state.auth.is_franchisor,
  }),
  {
    requestOptInTrackingB2C: requestOptInTrackingB2CAction,
  },
);

export default withTranslation(namespaces)(connector(MarketplaceRouter));
