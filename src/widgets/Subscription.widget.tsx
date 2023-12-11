import React, { Component } from 'react';
import { Theme } from '@material-ui/core';
import themify from 'bsport-saas/src/hocs/company-themifier.hoc';
import { MarketplaceContractBase } from 'bsport-saas/src/pages/marketplace/MarketplaceContract';
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

  componentDidMount() {
    window?.addEventListener('message', this.handleAddToCartPostMessages);
  }

  componentWillUnmount() {
    window?.removeEventListener('message', this.handleAddToCartPostMessages);
  }

  handleAddToCartPostMessages = (event: MessageEvent) => {
    if (
      event?.data?.type === 'bsport:subscription:add-to-cart:contract' &&
      event?.data?.data?.contract_id
    ) {
      this.addToCart(event.data.data.contract_id);
    }
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
      />
    );
  }
}

export default SubscriptionWidget;
