// @flow

import React, { Component } from 'react';

import { push } from 'connected-react-router';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { finalizeInvoice, fetchInvoiceList } from '../../libs/invoice/actions';
import InvoiceTable from '../invoice/InvoiceTable.component';

import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';
import type { Subscription } from '../../libs/subscription/types';

import { getSubscriptionListByMember } from '../../libs/subscription/selectors';
import { getInvoiceList } from '../../libs/invoice/selectors';
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

  count: number,
  invoiceList: Array<Invoice>,
  loading: boolean,
  fetchInvoiceList: (params: any, options: OptionCallback) => void,
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
            title={this.props.t('invoiceTitle')}
            count={this.props.count}
            invoices={this.props.invoiceList}
            loading={this.props.loading}
            fetchInvoiceList={(params, options) =>
              this.props.fetchInvoiceList(
                { ...(params || {}), member: this.props.id },
                options,
              )
            }
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
      invoiceList: getInvoiceList(state),
      count: state.invoice.list.count,
      loading: state.invoice.list.loading,
    }),
    {
      goToInvoice: (uuid) => push(`/invoice/${uuid}`),
      goToSubscription: (id: number) => push(`/subscription/${id}`),
      finalizeInvoice,
      fetchSubscriptionListByMember,
      fetchInvoiceList,
    },
  ),
)(MemberDetailPayment);
