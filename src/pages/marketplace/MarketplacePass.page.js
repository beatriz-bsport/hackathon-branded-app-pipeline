// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';

import LinearProgress from '@material-ui/core/LinearProgress';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import MarketplacePassList from '../../libs/marketplace/MarketplacePassList.component';

import { marketplace as marketplaceActions } from '../../actions';

type Props = {
  companyId: number,
  paymentPacksLoading: boolean,
  paymentPacks: Array<PaymentPack>,
  fetchPaymentPacks: (companyId: number) => void,
  pushPackCheckout: (packId: number, companyId: number) => void,
};

export class MarketPlacePassPage extends Component<Props> {
  async componentDidMount() {
    this.props.fetchPaymentPacks(this.props.companyId);
  }

  render() {
    if (this.props.paymentPacksLoading) {
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
function mapStateToProps(state) {
  return {
    paymentPacks: state.marketplace.paymentPacks,
    paymentPacksLoading: state.marketplace.paymentPacksLoading,
  };
}

export default compose(
  connect(
    mapStateToProps,
    {
      fetchCompany: marketplaceActions.fetchCompany,
      fetchPaymentPacks: marketplaceActions.fetchPaymentPacks,
      pushPackCheckout: (packId, companyId) =>
        push(`/customer/payment/pass/${packId}?membership=${companyId}`),
    },
  ),
)(MarketPlacePassPage);
