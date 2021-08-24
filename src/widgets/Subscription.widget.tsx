import React, { Component } from 'react';
import { Theme } from '@material-ui/core';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MarketplaceContractBase } from 'bsport-saas/src/pages/marketplace/MarketplaceContract.page';
import { getEnv } from '../utils/env';

const MarketplaceContractStyled = themify(MarketplaceContractBase);

type OwnProps = {
  companyId: number,
  config: any,
  store: any,
  theme: Theme,
  onWindowOpen: (url: string) => void,
};

type Props = OwnProps;

class SubscriptionWidget extends Component<Props> {
  state = {
    selected: null,
  };

  addToCart = (contractId: number) => {
    const { PUBLIC_URL } = getEnv();
    const url = `${PUBLIC_URL}/checkout/${this.props.companyId}/subscription/${contractId}`;
    this.props.onWindowOpen(url);
  };

  render() {
    const { companyId, store, theme } = this.props;
    return (
      <MarketplaceContractStyled
        companyId={companyId}
        theme={theme}
        store={store}
        onAddToCart={this.addToCart}
        setSelected={(selected) => this.setState({ selected })}
        selected={this.state.selected}
      />
    );
  }
}

export default SubscriptionWidget;
