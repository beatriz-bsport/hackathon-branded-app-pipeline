// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from 'react-redux';

import { BUYABLE_ITEM_PASS } from '@bsport/common/lib/master-data/buyable-items';
import MarketplacePassList from '../../libs/marketplace/components/MarketplacePassList.component';
import {
  getPaymentPacks,
  isMarketplaceLoading,
} from '../../libs/marketplace/selectors';
import { addItemToBasket } from '../../libs/checkout/actions';
import { getCurrentBasket } from '../../libs/checkout/selectors';
import type { Basket } from '../../libs/checkout/types';
import { fetchPaymentPacksAction } from '../../libs/marketplace/actions';

type Props = {
  companyId: number,
  loading: boolean,
  paymentPacks: Array<PaymentPack>,
  authenticated: boolean,

  requestSignUp: () => void,
  fetchPaymentPacks: (companyId: number) => void,
  pushPackCheckout: (packId: number, basketId: string) => void,
  toogleCurrentBasketOpen: (boolean) => void,
  currentBasket: Basket,
};

export class MarketPlacePassPage extends Component<Props> {
  async componentDidMount() {
    this.props.fetchPaymentPacks(this.props.companyId);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.authenticated !== this.props.authenticated) {
      this.props.fetchPaymentPacks(this.props.companyId);
    }
  }

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }
    return (
      <MarketplacePassList
        paymentPacks={this.props.paymentPacks}
        pushPackCheckout={(packId) => {
          if (!this.props.authenticated) {
            this.props.requestSignUp();
          } else {
            this.props.pushPackCheckout(packId, this.props.currentBasket.id);
            this.props.toogleCurrentBasketOpen(true);
          }
        }}
      />
    );
  }
}

export default compose(
  connect(
    (state) => ({
      paymentPacks: getPaymentPacks(state),
      currentBasket: getCurrentBasket(state),
      authenticated: state.auth.authenticated,
      loading:
        state.marketplacev2.paymentPack.loading || isMarketplaceLoading(state),
    }),
    {
      fetchPaymentPacks: fetchPaymentPacksAction,
      pushPackCheckout: (packId, basketId) =>
        addItemToBasket(basketId, {
          buyable_item_identifier: BUYABLE_ITEM_PASS,
          quantity: 1,
          buyable_item_id: packId,
          extra_data: {},
        }),
    },
  ),
)(MarketPlacePassPage);
