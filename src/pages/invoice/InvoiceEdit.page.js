// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { goBack, push as pushRouter } from 'react-router-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import { getShopItemsAvailable } from '../../libs/shop/selectors';
import type { PaymentPack } from '../../libs/payment-packs/types';
import { invoice as invoiceActions } from '../../actions';
import withTitle from '../../hocs/with-title.hoc';
import { formatAsDate } from '../../datetime';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import memberSelectors from '../../libs/member/selectors';
import { fetchMember } from '../../libs/member/actions';
import { fetchShopItemAsManager as fetchShopItems } from '../../libs/shop/actions/shopitem';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import { getPermissions } from '../../libs/role/selectors';
import { getPaymentComboList } from '../../libs/payment-combo/selectors';

import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';

import type { Invoice } from '../../api/types';
import type { Member } from '../../libs/member/types';
import type { Permission } from '../../libs/role/types';
import type { PaymentCombo } from '../../libs/payment-combo/types';

import InvoiceForm from '../../libs/invoice/InvoiceForm.component';
import RevertInvoiceDialog from '../../libs/invoice/dialog/RevertInvoiceDialog.component';

type Props = {
  updatingInvoice: boolean,
  uuid: string,

  isReturningPayment: boolean,
  returnPayment: (paymentId: string, invoiceId: string) => void,

  invoice: Invoice,
  shopItems: Array<ShopItem>,
  member: Member,
  permission: Permission,

  paymentPacks: Array<PaymentPack>,
  paymentComboList: Array<PaymentCombo>,

  goBack: () => void,
  fetchInvoice: (uuid: string) => void,
  fetchShopItems: () => void,
  fetchAllPaymentPacks: () => void,
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
    this.props.fetchShopItems();
    this.props.fetchAllPaymentPacks();
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
    this.props.updateInvoice(
      { uuid: this.props.uuid, ...invoiceData },
      true,
      () => this.props.goToMemberPage(this.props.member.id),
    );
  };

  render() {
    const {
      invoice,
      paymentPacks,
      shopItems,
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
          paymentPacks={paymentPacks}
          shopItems={shopItems}
          editMode
          invoice={invoice}
          uneditableInvoiceItems={uneditableInvoiceItems || []}
          uneditablePayments={invoice.payments || []}
          updatePaymentMethod={this.props.updatePaymentMethod}
          createOrUpdate={this.updateInvoice}
          onCancel={this.props.goBack}
          isReturningPayment={this.props.isReturningPayment}
          returnPayment={(payment) =>
            this.props.returnPayment(payment, this.props.uuid)
          }
          goToMemberPage={
            invoice && this.props.permission.member.retrieve
              ? () => goToMemberPage(invoice.member)
              : null
          }
          processing={updatingInvoice}
          uneditableVoucher={invoice.voucher || 0}
          member={this.props.member}
          revertInvoice={() => this.setState({ revertDialogOpen: true })}
          paymentComboList={this.props.paymentComboList}
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
      paymentPacks: getPaymentPackEnabled(state),
      shopItems: getShopItemsAvailable(state),
      invoice: state.invoice.invoice,
      updatingInvoice: state.invoice.createOrUpdatePending,
      privatePassList: getPrivatePassAvailable(state),
      permission: getPermissions(state),
      paymentComboList: getPaymentComboList(state),
      isReturningPayment: state.invoice.returnPayment.loading,
    }),
    {
      fetchMember,
      fetchShopItems,
      fetchAllPaymentPacks,
      fetchPrivatePassList,
      goBack,
      fetchInvoice: invoiceActions.fetchSpecificInvoice,
      returnPayment: invoiceActions.returnPayment,
      updatePaymentMethod: invoiceActions.updatePaymentMethod,
      goToMemberPage: (id) => pushRouter(`/member/${id}/`),
      updateInvoice: invoiceActions.createOrUpdateInvoice,
      resetCreateOrUpdateStatus: invoiceActions.createOrUpdateReset,
      revertInvoice: invoiceActions.revertInvoice,
    },
  ),
  withTitle(
    ({ t, uuid, invoice }) =>
      `${t('titles:invoice.invoiceEdit')} - ${
        uuid ? uuid.slice(0, 8).toUpperCase() : ''
      } - ${invoice && invoice.date ? formatAsDate(invoice.date) : ''}`,
  ),
  connect((state, { invoice }) => ({
    member: memberSelectors.get(state, invoice ? invoice.member : null),
  })),
)(InvoiceFormPage);
