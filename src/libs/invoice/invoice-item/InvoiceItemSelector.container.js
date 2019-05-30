// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';

import InvoiceItemSelector from './InvoiceItemSelector.component';
import type { Offer, Activity, PaymentPack } from '../../../api/types';
import paymentPackSelectors from '../../payment-packs/selectors';

type Props = {
  t: (x: string) => string,
  classes: Object,
  activities: Array<Activity>,
  paymentPacks: Array<PaymentPack>,
  offers: Array<Offer>,
};

export class InvoiceItemSelectorContained extends Component<Props> {
  render() {
    return (
      <InvoiceItemSelector
        activities={this.props.activities}
        paymentPacks={this.props.paymentPacks}
        events={this.props.offers}
        {...this.props}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    activities: state.activity.all,
    offers: state.offer.calendar,
    paymentPacks: paymentPackSelectors.getEnabled(state),
  };
}
export default connect(mapStateToProps)(InvoiceItemSelectorContained);
