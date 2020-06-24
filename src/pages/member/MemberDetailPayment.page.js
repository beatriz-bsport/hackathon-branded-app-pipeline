// @flow

import React, { Component } from 'react';

import { push } from 'connected-react-router';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { invoice as invoiceActions } from '../../actions';
import InvoiceTable from '../invoice/InvoiceTable.component';

import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';
import type { Subscription } from '../../libs/subscription/types';

import { getSubscriptionListByMember } from '../../libs/subscription/selectors';
import { fetchSubscriptionListByMember } from '../../libs/subscription/actions';

type Props = {
  id: number,
  finalizeInvoice: (uuid: string) => void,
  goToInvoice: (uuid: string) => void,
  goToSubscription: (id: number) => void,
  subscriptionList: Array<Subscription>,
  subscriptionLoading: boolean,
  fetchSubscriptionListByMember: (page: number, params: any) => void,
  subscriptionCount: number,

  t: TFunction,
  classes: Object,
};

export class MemberDetailPayment extends Component<Props> {
  downloadInvoice = (invoice: Invoice) => {
    window.location.href = invoice.stripe_invoice_pdf;
  };

  fetchSubscriptionList = (page: number) => {
    this.props.fetchSubscriptionListByMember(this.props.id, {
      page,
      page_size: 10,
    });
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
            subscriptionList={this.props.subscriptionList}
            loading={this.props.subscriptionLoading}
            count={this.props.subscriptionCount}
            onPageChange={this.fetchSubscriptionList}
          />
        </div>
      </div>
    );
  }
}

const styles = (theme) => ({
  table: {
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withStyles(styles),
  withTranslation(['member']),
  connect(
    (state) => ({
      subscriptionList: getSubscriptionListByMember(state),
      subscriptionLoading: state.subscription.list.loading,
      subscriptionCount: state.subscription.byMember.count,
    }),
    {
      goToInvoice: (uuid) => push(`/invoice/${uuid}`),
      goToSubscription: (id: number) => push(`/subscription/${id}`),
      finalizeInvoice: invoiceActions.finalizeInvoice,
      fetchSubscriptionListByMember,
    },
  ),
)(MemberDetailPayment);
