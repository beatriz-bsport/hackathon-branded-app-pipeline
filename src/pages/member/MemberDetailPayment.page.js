// @flow

import React, { Component } from 'react';

import { push } from 'connected-react-router';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import type { TFunction } from 'react-i18next';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import {
  finalizeInvoice,
  fetchInvoiceList,
  fetchInvoiceItemList,
  fetchPaymentList,
} from '../../libs/invoice/actions';
import InvoiceTable from '../../libs/invoice/components/InvoiceTable.component';

import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';
import type { Subscription } from '../../libs/subscription/types';

import { getSubscriptionListByMember } from '../../libs/subscription/selectors';
import {
  getInvoiceList,
  withInvoiceItem,
  withPayment,
} from '../../libs/invoice/selectors';
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
  fetchPaymentList: (params: any) => void,
  fetchInvoiceItemList: (params: any) => void,
  page: number,
};

export class MemberDetailPayment extends Component<Props> {
  downloadInvoice = (invoice: Invoice) => {
    window.location.href = invoice.stripe_invoice_pdf;
  };

  fetchSubscriptionList = (page: number, params: any = {}) => {
    this.props.fetchSubscriptionListByMember(this.props.id, {
      page,
      page_size: 10,
      ...params,
    });
  };

  fetchInvoiceDataNested = (uuid: string) => {
    this.props.fetchPaymentList({ invoice__uuid: uuid, page_size: 100 });
    this.props.fetchInvoiceItemList({ invoice__uuid: uuid, page_size: 100 });
  };

  onChangePage = (page) => {
    this.props.fetchInvoiceList({ member: this.props.id, page_size: 50, page });
  };

  componentDidMount() {
    this.onChangePage(1);
  }

  render() {
    return (
      <div>
        <div className={this.props.classes.table}>
          <InvoiceTable
            onInvoiceClick={this.props.goToInvoice}
            finalizeInvoice={this.props.finalizeInvoice}
            downloadInvoice={this.downloadInvoice}
            count={this.props.count}
            invoiceList={this.props.invoiceList}
            onInvoiceExpand={this.fetchInvoiceDataNested}
            loading={this.props.loading}
            hideMemberName
            containerComponent={Paper}
            page={this.props.page}
            onClickInvoice={this.props.goToInvoice}
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
      invoiceList: withInvoiceItem(withPayment(getInvoiceList))(state),
      count: state.invoice.list.count,
      page: state.invoice.list.page,
      loading: state.invoice.list.loading,
    }),
    {
      goToInvoice: (uuid) => push(`/invoice/${uuid}`),
      goToSubscription: (id: number) => push(`/subscription/${id}`),
      finalizeInvoice,
      fetchSubscriptionListByMember,
      fetchInvoiceList,
      fetchInvoiceItemList,
      fetchPaymentList,
    },
  ),
)(MemberDetailPayment);
