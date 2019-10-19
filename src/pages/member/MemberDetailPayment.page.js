// @flow

import React, { Component } from 'react';

import { push } from 'connected-react-router';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { invoice as invoiceActions } from '../../actions';
import InvoiceTable from '../invoice/InvoiceTable.component';

import subscriptionApi from '../../libs/subscription/api';
import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';
import type { Subscription } from '../../libs/subscription/types';

type Props = {
  id: number,
  finalizeInvoice: (uuid: string) => void,
  goToInvoice: (uuid: string) => void,
  goToSubscription: (id: number) => void,

  t: TFunction,
  classes: Object,
};

type State = {
  subscriptions: Array<Subscription>,
  subscriptionLoading: boolean,
};

export class MemberDetailPayment extends Component<Props, State> {
  downloadInvoice = (invoice: Invoice) => {
    window.location.href = invoice.stripe_invoice_pdf;
  };

  render() {
    return (
      <div>
        <div className={this.props.classes.table}>
          <InvoiceTable
            onInvoiceClick={this.props.goToInvoice}
            finalizeInvoice={this.props.finalizeInvoice}
            downloadInvoice={this.downloadInvoice}
            queryParams={`memberId=${this.props.id}`}
            title={this.props.t('invoiceTitle')}
          />
        </div>
        <div className={this.props.classes.table}>
          <SubscriptionTable
            goToSubscription={this.props.goToSubscription}
            title={this.props.t('subscriptionTitle')}
            showOnlyCore
            fetch={(page, page_size) =>
              subscriptionApi.fetchAll(
                page,
                page_size,
                `memberId=${this.props.id}`,
              )
            }
          />
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  table: {
    marginBottom: theme.spacing.unit * 2,
  },
});

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withStyles(styles),
  withNamespaces(['member']),
  connect(
    null,
    {
      goToInvoice: (uuid) => push(`/invoice/${uuid}`),
      goToSubscription: (id: number) => push(`/subscription/${id}`),
      finalizeInvoice: invoiceActions.finalizeInvoice,
    },
  ),
)(MemberDetailPayment);
