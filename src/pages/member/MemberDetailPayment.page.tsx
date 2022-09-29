import React, { Component } from 'react';
import { Theme } from '@material-ui/core';
import { push } from 'connected-react-router';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation, TFunction } from 'react-i18next';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import {
  finalizeInvoice,
  fetchInvoiceList,
  fetchInvoiceItemList,
  fetchPaymentList,
} from '../../libs/invoice/actions';
import InvoiceTable from '../../libs/invoice/components/InvoiceTable.component';

import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';
import type {
  Subscription,
  SubscriptionQueryParams,
} from '../../libs/subscription/types';

import { getSubscriptionListByMember } from '../../libs/subscription/selectors';
import {
  getInvoiceList,
  withInvoiceItem,
  withPayment,
} from '../../libs/invoice/selectors';
import { fetchSubscriptionListByMember } from '../../libs/subscription/actions';
import { Invoice } from '#libs/invoice/types';
import { OptionCallback } from '../../state/types';
import { MaterialStyleType } from '../../utils/types';
import { RootState } from '../../reducers';

type OwnProps = {
  id: number;
  finalizeInvoice: (uuid: string) => void;
  goToInvoice: (uuid: string) => void;
  goToSubscription: (id: number) => void;
  subscriptionList: Array<Subscription>;
  subscriptionLoading: boolean;
  fetchSubscriptionListByMember: (page: number, params: any) => void;
  subscriptionCount: number;

  t: TFunction;
  classes: Object;

  count: number;
  invoiceList: Array<Invoice>;
  loading: boolean;
  fetchInvoiceList: (params: any, options?: OptionCallback) => void;
  fetchPaymentList: (params: any) => void;
  fetchInvoiceItemList: (params: any) => void;
  page: number;
};

type Props = OwnProps & MaterialStyleType<ReturnType<typeof styles>>;

export class MemberDetailPayment extends Component<Props> {
  fetchSubscriptionList = (params: SubscriptionQueryParams = {}) => {
    this.props.fetchSubscriptionListByMember(this.props.id, {
      page: 1,
      page_size: 10,
      ...params,
    });
  };

  fetchInvoiceDataNested = (uuid: string) => {
    this.props.fetchPaymentList({ invoice__uuid: uuid, page_size: 100 });
    this.props.fetchInvoiceItemList({ invoice__uuid: uuid, page_size: 100 });
  };

  onChangePage = (page: number) => {
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
            finalizeInvoice={this.props.finalizeInvoice}
            count={this.props.count}
            invoiceList={this.props.invoiceList}
            onInvoiceExpand={this.fetchInvoiceDataNested}
            loading={this.props.loading}
            showType
            hideMemberName
            containerComponent={Paper}
            page={this.props.page}
            onClickInvoice={this.props.goToInvoice}
            onChangePage={this.onChangePage}
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

const styles = (theme: Theme) => ({
  table: {
    marginBottom: theme.spacing(2),
  },
});

export default compose(
  routerParamsToProps({ id: 'id:number' }),
  withStyles(styles),
  withTranslation(['member']),
  connect(
    (state: RootState) => ({
      subscriptionList: getSubscriptionListByMember(state),
      subscriptionLoading: state.subscription.list.loading,
      subscriptionCount: state.subscription.byMember.count,
      invoiceList: withInvoiceItem(withPayment(getInvoiceList))(state),
      count: state.invoice.list.count,
      page: state.invoice.list.page,
      loading: state.invoice.list.loading,
    }),
    {
      goToInvoice: (uuid: string) => push(`/invoice/${uuid}`),
      goToSubscription: (id: number) => push(`/subscription/${id}`),
      finalizeInvoice,
      fetchSubscriptionListByMember,
      fetchInvoiceList,
      fetchInvoiceItemList,
      fetchPaymentList,
    },
  ),
)(MemberDetailPayment);
