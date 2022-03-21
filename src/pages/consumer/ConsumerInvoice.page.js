// @flow
import Paper from '@material-ui/core/Paper';
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withHandlers } from 'recompose';

import { connect } from 'react-redux';

import {
  finalizeInvoice as finalizeInvoiceAction,
  fetchInvoiceList as fetchInvoiceListAction,
  fetchInvoiceItemList,
  fetchPaymentList,
} from '../../libs/invoice/actions';
import { regularizeDebt as regularizeDebtAction } from '../../libs/member/actions';
import InvoiceTable from '../../libs/invoice/components/InvoiceTable.component';
import { fetchMembership as fetchMembershipAction } from '../../libs/membership/actions';
import {
  getInvoiceList,
  withInvoiceItem,
  withPayment,
} from '../../libs/invoice/selectors';
import themeSelectors from '../../libs/theme/selectors';

import type { Membership } from '../../libs/membership/types';
import ConsumerDebtRegularizerDialog from '../../libs/consumer-space/components/ConsumerDebtRegularizerDialog.component';

import { fetchPaymentMethodList } from '../../libs/payment/actions';
import { snackbarSuccess, snackbarWarning } from '../../libs/snackbar/actions';
import { OptionCallback } from '../../state/types';
import { getMember } from '../../libs/member/selectors';
import { Member } from '../../libs/member/types';

type Props = {
  classes: Object,
  finalizeInvoice: (uuid: string) => void,
  membership: Membership,
  companyTheme: ?CompanyTheme,
  member: Member,

  count: number,
  invoiceList: Array<Invoice>,
  loading: boolean,
  fetchInvoiceList: (params: any, options: OptionCallback) => void,

  fetchPaymentMethodList: (params: any) => void,

  fetchPaymentList: (params: any) => void,
  fetchInvoiceItemList: (params: any) => void,
  nestedDataLoading: boolean,
  page: number,

  snackbarErrorMsg: () => void,
  snackbarSuccessMsg: () => void,
  payment_method_available_basket: Array<number>,
  detachPaymentMethodLoading: boolean,
  detachPaymentMethod: (pm_id: string, options?: OptionCallback) => void,
  fetchMembership: (memberId: number, options?: OptionCallback) => void,
};

export class ConsumerInvoice extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchPaymentMethodList({
      company: this.props.membership.company,
    });
    this.onChangePage(1);
  }

  fetchInvoiceDataNested = (uuid: string) => {
    this.props.fetchPaymentList({ invoice__uuid: uuid, page_size: 100 });
    this.props.fetchInvoiceItemList({ invoice__uuid: uuid, page_size: 100 });
  };

  onChangePage = (page) => {
    this.props.fetchInvoiceList({ page_size: 50, page });
  };

  render() {
    return (
      <div className={this.props.classes.table}>
        {this.props.companyTheme &&
          this.props.companyTheme.consumer_regularize_debt &&
          parseFloat(this.props.membership.credit_account_balance).toFixed(2) <
            0 && (
            <ConsumerDebtRegularizerDialog
              withButton
              member={this.props.member}
              availablePaymentMethodList={
                this.props.payment_method_available_basket
              }
              detachPaymentMethodLoading={this.props.detachPaymentMethodLoading}
              detachPaymentMethod={this.props.detachPaymentMethod}
              fetchMembership={() =>
                this.props.fetchMembership(this.props.membership.id)
              }
              snackbarErrorMsg={this.props.snackbarErrorMsg}
              snackbarSuccessMsg={this.props.snackbarSuccessMsg}
            />
          )}

        <InvoiceTable
          hideMemberName
          loading={this.props.loading}
          nestedDataLoading={this.props.nestedDataLoading}
          onInvoiceExpand={this.fetchInvoiceDataNested}
          invoiceList={this.props.invoiceList}
          containerComponent={Paper}
          onChangePage={this.onChangePage}
          count={this.props.count}
          page={this.props.page}
          finalizeInvoice={this.props.finalizeInvoice}
        />
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
  withStyles(styles),
  connect(
    (state, props) => ({
      invoiceList: withInvoiceItem(withPayment(getInvoiceList))(state),
      count: state.invoice.list.count,
      loading: state.invoice.list.loading,
      companyTheme: themeSelectors.getTheme(state),
      page: state.invoice.list.page,
      nestedDataLoading:
        state.invoice.invoiceItem.loading || state.invoice.payment.loading,
      snackbarErrorMsg: snackbarWarning,
      snackbarSuccessMsg: snackbarSuccess,
      payment_method_available_basket:
        state.theme.theme.payment_method_available_basket,
      detachPaymentMethodLoading:
        state.paymentBackend.detachPaymentMethod.loading,
      member: getMember(state, props.membership.id),
    }),
    {
      finalizeInvoice: finalizeInvoiceAction,
      regularizeDebt: regularizeDebtAction,
      fetchMembership: fetchMembershipAction,
      fetchInvoiceList: fetchInvoiceListAction,
      fetchPaymentMethodList,
      fetchInvoiceItemList,
      fetchPaymentList,
    },
  ),
  withHandlers({
    finalizeInvoice:
      ({ finalizeInvoice }) =>
      (uuid, options) =>
        finalizeInvoice(uuid, {
          onError: (err) => {
            if (options && options.onError) options.onError(err);
          },
          onSuccess: (invoice) => {
            window.open(invoice.stripe_invoice_pdf);
            if (options && options.onSuccess) options.onSuccess();
          },
        }),
    fetchInvoiceList:
      ({ fetchInvoiceList, membership }) =>
      () => {
        fetchInvoiceList({
          is_draft: false,
          member: membership.id,
        });
      },
    detachPaymentMethod: (props: Props) => (pm_id: string, options: any) => {
      const {
        detachPaymentMethodAction,
        fetchMemberPaymentMethod,
        membership,
      } = props;

      detachPaymentMethodAction(
        { member: membership.id, payment_method_id: pm_id },
        {
          onSuccess: () => {
            fetchMemberPaymentMethod({ member: membership.id });
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: options && options.onError,
        },
      );
    },
  }),
)(ConsumerInvoice);
