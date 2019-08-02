// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import InvoiceItemSelector from './InvoiceItemSelector.component';
import type { Offer, PaymentPack } from '../../../api/types';
import paymentPackSelectors from '../../payment-packs/selectors';

type Props = {
  t: (x: string) => string,
  classes: Object,
  paymentPacks: Array<PaymentPack>,
  offers: Array<Offer>,
};

export class InvoiceItemSelectorContained extends Component<Props> {
  render() {
    return (
      <InvoiceItemSelector
        paymentPacks={this.props.paymentPacks}
        events={this.props.offers}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    offers: state.offer.calendar,
    paymentPacks: paymentPackSelectors.getEnabled(state),
  };
}
export default connect(mapStateToProps)(InvoiceItemSelectorContained);
