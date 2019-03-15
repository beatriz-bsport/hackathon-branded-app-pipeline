// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push as pushRouter } from 'react-router-redux';
import { withProps, compose } from 'recompose';
import { withRouter } from 'react-router';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { invoice as invoiceActions } from '../../actions';
import withDrawer from '../../hocs/with-drawer.hoc';

import type { PaymentPack, Offer, Activity, Invoice } from '../../api/types';

import InvoiceForm from '../../libs/invoice/InvoiceForm.component';

type Props = {
  loading: boolean,
  updatingInvoice: boolean,

  invoice: Invoice,
  member: Member,

  offers: Array<Offer>,
  activities: Array<Activity>,
  paymentPacks: Array<PaymentPack>,

  goToInvoiceList: () => void,
  goToMemberPage: () => void,
  fetchInvoice: (id: number) => void,
  updatePaymentStatus: (uuid: number, status: boolean) => void,
  updateInvoice: (invoiceData: InvoiceData) => void,

  t: TFunction,
  match: Object,
  resetCreateOrUpdateStatus: () => void,
};

export class InvoiceFormPage extends Component<Props> {
  componentDidMount() {
    this.uuid = this.props.match.params.id;
    this.props.fetchInvoice(this.uuid);
    this.props.resetCreateOrUpdateStatus();
  }

  updateInvoice = (invoiceData: InvoiceData) => {
    this.props.updateInvoice({ uuid: this.uuid, ...invoiceData });
  };

  updatePaymentStatus = (paymentUuid, newStatus) => {
    this.props.updatePaymentStatus(paymentUuid, newStatus);
  };

  render() {
    const {
      invoice,
      loading,
      activities,
      offers,
      paymentPacks,
      goToInvoiceList,
      goToMemberPage,
      updatingInvoice,
      t,
    } = this.props;
    if (!invoice || loading) {
      return <LinearProgress />;
    }

    let uneditableInvoiceItems = [];
    if (invoice.voucher && invoice.voucher.price) {
      // yea ok fuck me
      uneditableInvoiceItems = [
        ...invoice.invoice_items,
        {
          id: -1,
          price: -invoice.voucher,
          invoice: invoice.uuid,
          name: t('payment.voucher'),
        },
      ];
    } else {
      uneditableInvoiceItems = [...(invoice.invoice_items || [])]; // for mutability
    }
    return (
      <InvoiceForm
        offers={offers}
        activities={activities}
        paymentPacks={paymentPacks}
        editMode
        invoice={invoice}
        uneditableInvoiceItems={uneditableInvoiceItems || []}
        uneditablePayments={invoice.payments || []}
        updatePaymentStatus={this.updatePaymentStatus}
        createOrUpdate={this.updateInvoice}
        onCancel={goToInvoiceList}
        goToMemberPage={goToMemberPage}
        processing={updatingInvoice}
        uneditableVoucher={invoice.voucher || 0}
        member={this.props.member}
      />
    );
  }
}

export default compose(
  withNamespaces(),
  withRouter,
  connect(
    (state) => ({
      loading: state.invoice.loadingSpecific,
      offers: state.offer.calendar,
      activities: state.activity.all,
      paymentPacks: (state.paymentPack.all || []).filter((pp) => !pp.disabled),
      invoice: state.invoice.invoice,
      updatingInvoice: state.invoice.createOrUpdatePending,
      members: state.member.all,
    }),
    {
      fetchInvoice: invoiceActions.fetchSpecificInvoice,
      updatePaymentStatus: invoiceActions.updatePaymentStatus,
      push: pushRouter,
      updateInvoice: invoiceActions.createOrUpdateInvoice,
      resetCreateOrUpdateStatus: invoiceActions.createOrUpdateReset,
    },
  ),
  withProps(({ invoice, members, push }) => {
    if (invoice && invoice.member) {
      return {
        goToInvoiceList: () => push('/invoice'),
        goToMemberPage: () => push(`/member/${invoice.member}`),
        member: members.find((m) => m.id === invoice.member) || null,
      };
    }
    return {
      member: null,
      goToMemberPage: null,
      goToInvoiceList: () => push('/invoice'),
    };
  }),
  withDrawer(
    ({ t, match, member }) =>
      `${t('payment.invoice')} - ${match.params.id
        .slice(0, 8)
        .toUpperCase()} - ${member ? member.name : ''}`,
  ),
)(InvoiceFormPage);
