// @flow
import React, { Component } from 'react';

import { withNamespaces } from 'react-i18next';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { goBack } from 'react-router-redux';
import { payment as paymentActions } from '../../actions';
import { ConsumerModalContainer } from '../../components';
import parse from '../../query-string';
import type { PaymentPack } from '../../api/types';

import PaymentPackPaymentForm from './payment-pack/PaymentPackForm.component';

type Props = {
  loading: boolean,
  hasBoughtSomething: boolean,
  match: Object,
  location: Object,
  paymentPack: ?PaymentPack,
  fetchPaymentPack: (number) => void,
  fetchOffer: (number) => void,
  goBack: () => void,
  offer: ?Offer,
};

export class PaymentPackPaymentPage extends Component<Props> {
  componentDidMount() {
    const paymentPackId = parseInt(this.props.match.params.id, 10);
    const { nextOffer } = parse(this.props.location.search);
    this.nextOffer = nextOffer ? parseInt(nextOffer, 10) : null;
    this.props.fetchPaymentPack(paymentPackId);
    if (nextOffer) {
      this.props.fetchOffer(nextOffer);
    }
  }

  render() {
    const { paymentPack, loading } = this.props;
    if (!paymentPack) {
      return <CircularProgress />;
    }

    return (
      <ConsumerModalContainer>
        <PaymentPackPaymentForm
          paymentPack={paymentPack}
          loading={loading}
          offerToBuy={this.nextOffer ? this.props.offer : null}
          hasBoughtSomething={this.props.hasBoughtSomething}
          goBack={this.props.goBack}
        />
      </ConsumerModalContainer>
    );
  }
}

function mapStateToProps(state) {
  const hasBoughtSomething =
    state.payment.wantedPaymentPack &&
    !state.consumer.loading &&
    !!state.consumer &&
    !!state.consumer.profile
      ? !!(state.consumer.profile.memberships || []).filter(
          (m) =>
            m.company_id === state.payment.wantedPaymentPack.company_id &&
            m.has_bought_something === true,
        ).length
      : false;
  return {
    hasBoughtSomething,
    paymentPack: state.payment.wantedPaymentPack,
    loading: state.payment.loading,
    offer: state.payment.wantedOffer,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchPaymentPack(id) {
      dispatch(paymentActions.fetchPaymentPack(id));
    },
    fetchOffer(id) {
      dispatch(paymentActions.fetchOffer(id));
    },
    goBack() {
      dispatch(goBack());
    },
  };
}

export default withNamespaces()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(PaymentPackPaymentPage),
);
