// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { push as pushRouter } from 'react-router-redux';
import { withProps, compose, withPropsOnChange } from 'recompose';
import { withRouter } from 'react-router';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import paymentPackSelectors from '../../libs/payment-packs/selectors';
import type { PaymentPack } from '../../libs/payment-packs/types';
import { invoice as invoiceActions } from '../../actions';
import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import type { Offer, Activity, Invoice } from '../../api/types';

import InvoiceForm from '../../libs/invoice/InvoiceForm.component';
import RevertInvoiceDialog from '../../libs/invoice/dialog/RevertInvoiceDialog.component';

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
  updatePaymentMethod: (uuid: number, payment_method: number) => void,
  updateInvoice: (invoiceData: InvoiceData) => void,
  revertInvoice: (uuid: string) => void,

  t: TFunction,
  match: Object,
  resetCreateOrUpdateStatus: () => void,
};

type State = {
  revertDialogOpen: boolean,
};

export class InvoiceFormPage extends Component<Props, State> {
  state = {
    revertDialogOpen: false,
  };

  componentDidMount() {
    this.uuid = this.props.match.params.id;
    this.props.resetCreateOrUpdateStatus();
  }

  updateInvoice = (invoiceData: InvoiceData) => {
    this.props.updateInvoice({ uuid: this.uuid, ...invoiceData });
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
      <div>
        <InvoiceForm
          offers={offers}
          activities={activities}
          paymentPacks={paymentPacks}
          editMode
          invoice={invoice}
          uneditableInvoiceItems={uneditableInvoiceItems || []}
          uneditablePayments={invoice.payments || []}
          updatePaymentMethod={this.props.updatePaymentMethod}
          createOrUpdate={this.updateInvoice}
          onCancel={goToInvoiceList}
          goToMemberPage={goToMemberPage}
          processing={updatingInvoice}
          uneditableVoucher={invoice.voucher || 0}
          member={this.props.member}
          revertInvoice={() => this.setState({ revertDialogOpen: true })}
        />
        <RevertInvoiceDialog
          open={this.state.revertDialogOpen}
          hasSubscription={!!invoice.plannedinvoice}
          onSubmit={() => {
            this.props.revertInvoice(this.uuid);
            this.setState({ revertDialogOpen: false });
          }}
          onClose={() => this.setState({ revertDialogOpen: false })}
        />
      </div>
    );
  }
}

export default compose(
  withNamespaces(),
  withRouter,
  routerParamsToProps({ id: 'id' }),
  connect(
    (state) => ({
      loading: state.invoice.loadingSpecific || state.member.loading,
      offers: state.offer.calendar,
      activities: state.activity.all,
      paymentPacks: paymentPackSelectors.getEnabled(state),
      invoice: state.invoice.invoice,
      updatingInvoice: state.invoice.createOrUpdatePending,
      members: state.member.all,
    }),
    {
      fetchInvoice: invoiceActions.fetchSpecificInvoice,
      updatePaymentMethod: invoiceActions.updatePaymentMethod,
      push: pushRouter,
      updateInvoice: invoiceActions.createOrUpdateInvoice,
      resetCreateOrUpdateStatus: invoiceActions.createOrUpdateReset,
      revertInvoice: invoiceActions.revertInvoice,
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
  withPropsOnChange(
    ({ id }, { id: newUuid }) => id !== newUuid,
    ({ id, fetchInvoice }) => {
      if (id) {
        fetchInvoice(id);
      }
    },
  ),
  withDrawer(
    ({ t, match }) =>
      `${t('payment.invoice')} - ${match.params.id.slice(0, 8).toUpperCase()}`,
  ),
)(InvoiceFormPage);
