import React, { Component } from 'react';

import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { payment as paymentActions } from '../../../actions';
import {
  ConsumerModalContainer,
  PaymentPackPayment,
} from '../../../components';

type Props = {
  loading: boolean,
  match: Object,
  paymentPack: ?Object,
  fetchPaymentPack: (Number) => void,
};

export class PaymentPackPaymentPage extends Component<Props> {
  componentDidMount() {
    const paymentPackId = parseInt(this.props.match.params.id, 10);
    this.props.fetchPaymentPack(paymentPackId);
  }

  render() {
    const { paymentPack, loading } = this.props;
    return (
      <ConsumerModalContainer>
        <PaymentPackPayment paymentPack={paymentPack} loading={loading} />
      </ConsumerModalContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    paymentPack: state.payment.wantedPaymentPack,
    loading: state.payment.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPaymentPack(id) {
      dispatch(paymentActions.fetchPaymentPack(id));
    },
  };
}

export default translate()(
  connect(mapStateToProps, mapDispatchToProps)(PaymentPackPaymentPage),
);
