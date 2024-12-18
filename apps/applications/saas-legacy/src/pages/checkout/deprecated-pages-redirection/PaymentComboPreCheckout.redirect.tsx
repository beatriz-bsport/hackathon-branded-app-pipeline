import React from 'react';

import { replace } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import RedirectionLoading from './RedirectionLoading.component';
import { fetchPaymentCombo } from '../../../libs/payment-combo/actions';
import { OptionCallback } from '../../../state/types';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';

type Props = {
  id: number;
  replace: (path: string) => void;
  fetchPaymentCombo: (id: number, options: OptionCallback) => void;
};

export class PaymentPackPreCheckoutRedirect extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPaymentCombo(this.props.id, {
      onSuccess: (paymentCombo: any) => {
        this.props.replace(
          `/checkout/${paymentCombo.company}/pre-checkout/payment-combo/${paymentCombo.id}${window.location.search}`,
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
    fetchPaymentCombo,
  }),
)(PaymentPackPreCheckoutRedirect);
