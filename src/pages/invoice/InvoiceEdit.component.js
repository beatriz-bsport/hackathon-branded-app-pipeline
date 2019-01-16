// @flow

import React, { Component } from 'react';

import { withStyles, Typography, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push as pushRouter } from 'react-router-redux';

import InvoiceForm from '../../components/form/InvoiceForm.component';
import { invoice as invoiceActions } from '../../actions';

type Props = {
  loading: boolean,
  updatingInvoice: boolean,
  offers: Array<Offer>,
  paymentPacks: Array<PaymentPack>,
  activities: Array<Activity>,
  fetchInvoice: (id: number) => void,
  updatePaymentStatus: (uuid: number, status: boolean) => void,
  updateInvoice: (invoiceData: InvoiceData) => void,
  goToInvoiceList: () => void,
  invoice: Invoice,
  t: TFunction,
  classes: Object,
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
      classes,
      updatingInvoice,
      t,
    } = this.props;
    if (!invoice || loading) {
      return <CircularProgress />;
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
      uneditableInvoiceItems = [...invoice.invoice_items]; // for mutability
    }
    return (
      <div>
        <Typography variant="h4" className={classes.title}>
          {`${t('payment.invoice')} - ${invoice.uuid
            .slice(0, 8)
            .toUpperCase()}`}
        </Typography>
        <InvoiceForm
          offers={offers}
          activities={activities}
          paymentPacks={paymentPacks}
          editMode
          uneditableInvoiceItems={uneditableInvoiceItems}
          uneditablePayments={invoice.payments}
          updatePaymentStatus={this.updatePaymentStatus}
          createOrUpdate={this.updateInvoice}
          onCancel={goToInvoiceList}
          processing={updatingInvoice}
          uneditableVoucher={invoice.voucher || 0}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    loading: state.invoice.loadingSpecific,
    offers: state.offer.calendar,
    activities: state.activity.all,
    paymentPacks: state.paymentPack.all,
    invoice: state.invoice.invoice,
    updatingInvoice: state.invoice.createOrUpdatePending,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchInvoice(uuid) {
      dispatch(invoiceActions.fetchSpecificInvoice(uuid));
    },
    updatePaymentStatus(uuid, newStatus) {
      dispatch(invoiceActions.updatePaymentStatus(uuid, newStatus));
    },
    goToInvoiceList() {
      dispatch(pushRouter('/invoice'));
    },
    updateInvoice(invoiceData: InvoiceData) {
      dispatch(invoiceActions.createOrUpdateInvoice(invoiceData));
    },
    resetCreateOrUpdateStatus() {
      dispatch(invoiceActions.createOrUpdateReset());
    },
  };
}

const styles = (theme) => ({
  title: {
    paddingBottom: theme.spacing.unit * 4,
  },
});

export default withStyles(styles)(
  translate()(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(InvoiceFormPage),
  ),
);
