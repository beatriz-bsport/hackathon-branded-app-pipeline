// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import LinearProgress from '@material-ui/core/LinearProgress';

import { connect } from 'react-redux';
import { replace } from 'connected-react-router';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { getMarketplaceRoute } from '../../libs/marketplace/routing-utils';

type Props = {
  companyName: string,
  goToMarketplace: (name: string, id: number) => void,
};

export class MarketplaceResolver extends Component<Props> {
  render() {
    return <LinearProgress />;
  }
}

export default compose(
  routerParamsToProps({ companyName: 'companyName' }),
  connect(null, {
    goToMarketplace: (name, id) => replace(getMarketplaceRoute(name, id)),
  }),
)(MarketplaceResolver);
