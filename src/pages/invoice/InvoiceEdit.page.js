// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { goBack, push as pushRouter } from 'react-router-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import paymentPackSelectors from '../../libs/payment-packs/selectors';
import type { PaymentPack } from '../../libs/payment-packs/types';
import { invoice as invoiceActions } from '../../actions';
import withDrawer from '../../hocs/with-drawer.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import memberSelectors from '../../libs/member/selectors';
import { fetchMember } from '../../libs/member/actions';

import type { Offer, Activity, Invoice } from '../../api/types';
import type { Member } from '../../libs/member/types';

import InvoiceForm from '../../libs/invoice/InvoiceForm.component';
import RevertInvoiceDialog from '../../libs/invoice/dialog/RevertInvoiceDialog.component';

type Props = {
  updatingInvoice: boolean,
  uuid: string,

  invoice: Invoice,
  member: Member,

  offers: Array<Offer>,
  activities: Array<Activity>,
  paymentPacks: Array<PaymentPack>,

  goBack: () => void,
  fetchInvoice: (uuid: string) => void,
  goToMemberPage: (id: number) => void,
  fetchMember: (id: number) => void,
  memberLoading: boolean,
  invoiceLoading: boolean,
  updatePaymentMethod: (uuid: number, payment_method: number) => void,
  updateInvoice: (invoiceData: InvoiceData) => void,
  revertInvoice: (uuid: string) => void,

  t: TFunction,
  resetCreateOrUpdateStatus: () => void,
};

type State = {
  revertDialogOpen: boolean,
};

export class InvoiceFormPage extends Component<Props, State> {
  state = {
    revertDialogOpen: false,
  };

  fetchData = () => {
    if (this.props.uuid) {
      this.props.fetchInvoice(this.props.uuid);
    }
  };

  componentDidMount() {
    this.props.resetCreateOrUpdateStatus();
    this.props.fetchInvoice(this.props.uuid);
  }

  componentDidUpdate(prevProps: Props) {
    const { props } = this;
    if (prevProps.uuid !== props.uuid && props.uuid) {
      this.props.fetchInvoice(props.uuid);
    }
    if (
      props.invoice &&
      (!prevProps.invoice || props.invoice.uuid !== prevProps.invoice.uuid)
    ) {
      this.props.fetchMember(props.invoice.member);
    }
  }

  updateInvoice = (invoiceData: InvoiceData) => {
    this.props.updateInvoice({ uuid: this.props.uuid, ...invoiceData });
  };

  render() {
    const {
      invoice,
      activities,
      offers,
      paymentPacks,
      goToMemberPage,
      updatingInvoice,
      memberLoading,
      invoiceLoading,
      member,
      t,
    } = this.props;
    if (!invoice || memberLoading || invoiceLoading || !member) {
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
          onCancel={this.props.goBack}
          goToMemberPage={
            invoice ? () => goToMemberPage(invoice.member) : null
          }
          processing={updatingInvoice}
          uneditableVoucher={invoice.voucher || 0}
          member={this.props.member}
          revertInvoice={() => this.setState({ revertDialogOpen: true })}
        />
        <RevertInvoiceDialog
          open={this.state.revertDialogOpen}
          hasSubscription={!!invoice.plannedinvoice}
          onSubmit={() => {
            this.props.revertInvoice(this.props.uuid);
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
  routerParamsToProps({ id: 'uuid' }),
  connect(
    (state) => ({
      invoiceLoading: state.invoice.loadingSpecific,
      memberLoading: state.member.loading,
      offers: state.offer.calendar,
      activities: state.activity.all,
      paymentPacks: paymentPackSelectors.getEnabled(state),
      invoice: state.invoice.invoice,
      updatingInvoice: state.invoice.createOrUpdatePending,
    }),
    {
      fetchMember,
      goBack,
      fetchInvoice: invoiceActions.fetchSpecificInvoice,
      updatePaymentMethod: invoiceActions.updatePaymentMethod,
      goToMemberPage: (id) => pushRouter(`/member/${id}/`),
      updateInvoice: invoiceActions.createOrUpdateInvoice,
      resetCreateOrUpdateStatus: invoiceActions.createOrUpdateReset,
      revertInvoice: invoiceActions.revertInvoice,
    },
  ),
  withDrawer(
    ({ t, uuid }) =>
      `${t('payment.invoice')} - ${uuid ? uuid.slice(0, 8).toUpperCase() : ''}`,
  ),
  connect((state, { invoice }) => ({
    member: memberSelectors.get(state, invoice ? invoice.member : null),
  })),
)(InvoiceFormPage);
