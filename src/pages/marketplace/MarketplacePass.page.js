// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import MarketplacePassList from '../../libs/marketplace/components/MarketplacePassList.component';
import {
  getPaymentPacks,
  isMarketplaceLoading,
} from '../../libs/marketplace/selectors';
import { fetchPaymentPacksAction } from '../../libs/marketplace/actions';

type Props = {
  companyId: number,
  loading: boolean,
  paymentPacks: Array<PaymentPack>,
  fetchPaymentPacks: (companyId: number) => void,
  pushPackCheckout: (packId: number, companyId: number) => void,
};

export class MarketPlacePassPage extends Component<Props> {
  async componentDidMount() {
    this.props.fetchPaymentPacks(this.props.companyId);
  }

  render() {
    if (this.props.loading) {
      return <LinearProgress />;
    }
    return (
      <MarketplacePassList
        paymentPacks={this.props.paymentPacks}
        pushPackCheckout={(packId) =>
          this.props.pushPackCheckout(packId, this.props.companyId)
        }
      />
    );
  }
}

export default compose(
  connect(
    (state) => ({
      paymentPacks: getPaymentPacks(state),
      loading:
        state.marketplacev2.paymentPack.loading || isMarketplaceLoading(state),
    }),
    {
      fetchPaymentPacks: fetchPaymentPacksAction,
      pushPackCheckout: (packId, companyId) =>
        push(`/customer/payment/pass/${packId}?membership=${companyId}`),
    },
  ),
)(MarketPlacePassPage);
