import React from 'react';

import { replace } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import RedirectionLoading from './RedirectionLoading.component';
import { fetchPaymentPackBulk } from '../../../libs/payment-packs/actions';
import { OptionCallback } from '../../../state/types';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

type Props = {
  id: number;
  replace: (path: string) => void;
  fetchPaymentPackBulk: (ids: number[], options: OptionCallback) => void;
};

export class PaymentPackPreCheckoutRedirect extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPaymentPackBulk([this.props.id], {
      onSuccess: (paymentPackList: any) => {
        const paymentPack = paymentPackList[0];
        this.props.replace(
          `/checkout/${paymentPack.company}/pre-checkout/payment-pack/${paymentPack.id}${window.location.search}`,
        );
      },
    });
  }

  render() {
    return <RedirectionLoading />;
  }
}

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  connect(null, {
    replace,
    fetchPaymentPackBulk,
  }),
)(PaymentPackPreCheckoutRedirect);
