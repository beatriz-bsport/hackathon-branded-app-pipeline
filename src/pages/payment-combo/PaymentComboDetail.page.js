// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';

import { BUYABLE_ITEM_COMBO_ITEM } from '@bsport/common/lib/master-data/buyable-items';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import LinearProgress from '#components/navigation/BackofficeLinearProgress.component';
import BottomActionsButton from '#components/button/BottomActionsButton.component';

import {
  fetchPaymentCombo,
  fetchPaymentComboPurchaseList,
  createOrUpdatePaymentCombo,
  deletePaymentCombo,
} from '#libs/payment-combo/actions';
import { fetchByInvoiceItem as fetchInvoiceByInvoiceItemAction } from '#libs/invoice/actions';
import {
  getPaymentCombo,
  getPaymentComboPurchaseListByCombo,
} from '#libs/payment-combo/selectors';
import { getInvoice } from '#libs/invoice/selectors';
import PaymentComboDetailComponent from '#libs/payment-combo/components/PaymentComboDetail.component';
import PaymentComboDeleteDialog from '#libs/payment-combo/components/PaymentComboDeleteDialog.component';
import PaymentComboFormDialogContainer from './PaymentComboFormDialog.container';
import { snackbarSuccess } from '#libs/snackbar/actions';

import type { PaymentCombo } from '#libs/payment-combo/types';

type OptionsCallback = { onSuccess?: () => void, onError?: () => void };

type Props = {
  id: number,
  loading: boolean,
  classes: Object,
  paymentCombo: ?PaymentCombo,
  paymentComboPurchaseList: Array<PaymentComboPurchase>,
  paymentComboPurchaseCount: number,
  paymentComboPurchaseLoading: boolean,
  paymentComboPurchaseCount: number,

  onPaymentPackClick: (id: number) => void,
  onPrivatePassClick: (id: number) => void,
  onShopItemClick: (id: number) => void,

  editIsOpen: boolean,
  setEditIsOpen: (boolean) => void,
  deleteIsOpen: boolean,
  setDeleteIsOpen: (boolean) => void,

  fetchPaymentCombo: (id: number) => void,
  updatePaymentCombo: (data: any, options?: OptionsCallback) => void,
  deletePaymentCombo: (id: number, options?: OptionsCallback) => void,
  fetchPaymentComboPurchaseList: (
    params: {
      page: number,
      payment_combo: number,
    },
    options?: OptionsCallback,
  ) => void,

  goToInvoice: (uuid: string) => void,
  goToPaymentComboList: () => void,
  snackbarSuccess: (string) => void,
  fetchInvoiceByInvoiceItem: (
    buyable_item_identifier: number,
    buyable_item_id: number,
    options?: OptionCallback,
  ) => void,
  paymentComboPurchaseInvoice: Invoice,
};

export class PaymentComboDetail extends React.Component<Props> {
  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.id !== this.props.id && this.props.id) {
      this.fetchData();
    }
  }

  fetchData = () => {
    this.props.fetchPaymentCombo(this.props.id);
    this.props.fetchPaymentComboPurchaseList({
      page: 1,
      payment_combo: this.props.id,
    });
  };

  deletePaymentCombo = () => {
    this.props.deletePaymentCombo(this.props.id, {
      onSuccess: () => {
        this.props.setDeleteIsOpen(false);
        this.props.goToPaymentComboList();
      },
    });
  };

  goToInvoiceUsingPaymentComboPurchaseId = (id: number) => {
    this.props.fetchInvoiceByInvoiceItem(BUYABLE_ITEM_COMBO_ITEM, id, {
      onSuccess: () =>
        this.props.goToInvoice(this.props.paymentComboPurchaseInvoice.uuid),
    });
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        {this.props.loading || !this.props.paymentCombo ? (
          <LinearProgress />
        ) : null}
        <PaymentComboDetailComponent
          paymentCombo={this.props.paymentCombo}
          paymentComboPurchaseList={this.props.paymentComboPurchaseList}
          paymentComboPurchaseCount={this.props.paymentComboPurchaseCount}
          paymentComboPurchaseLoading={this.props.paymentComboPurchaseLoading}
          onPaymentPackClick={this.props.onPaymentPackClick}
          onPrivatePassClick={this.props.onPrivatePassClick}
          onShopItemClick={this.props.onShopItemClick}
          goToInvoiceUsingPaymentComboPurchaseId={
            this.goToInvoiceUsingPaymentComboPurchaseId
          }
          snackbarSuccess={this.props.snackbarSuccess}
          fetchPaymentComboPurchaseList={(page, options) =>
            this.props.fetchPaymentComboPurchaseList(
              {
                page,
                payment_combo: this.props.id,
              },
              options,
            )
          }
        />
        <BottomActionsButton
          onEdit={
            this.props.paymentCombo
              ? () => this.props.setEditIsOpen(true)
              : null
          }
          onDelete={() => this.props.setDeleteIsOpen(true)}
        />
        <PaymentComboDeleteDialog
          open={this.props.deleteIsOpen}
          onSubmit={this.deletePaymentCombo}
          onClose={() => this.props.setDeleteIsOpen(false)}
        />
        {this.props.paymentCombo ? (
          <PaymentComboFormDialogContainer
            initial={this.props.paymentCombo}
            open={this.props.editIsOpen}
            handleClose={() => this.props.setEditIsOpen(false)}
            onSubmit={(values, options) =>
              this.props.updatePaymentCombo(values, {
                onSuccess: (...args) => {
                  if (options && options.onSuccess) options.onSuccess(...args);
                  this.props.setEditIsOpen(false);
                },
                onError: (...args) => {
                  if (options && options.onError) options.onError(...args);
                },
              })
            }
          />
        ) : null}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    paddingBottom: theme.spacing(12),
  },
});

export default compose(
  withTranslation(['paymentCombo']),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  withState('relatedInvoice', 'setRelatedInvoice', null),
  withState('editIsOpen', 'setEditIsOpen', false),
  withState('deleteIsOpen', 'setDeleteIsOpen', false),
  connect(
    (state, { id, relatedInvoice }) => ({
      paymentCombo: getPaymentCombo(state, id),
      paymentComboPurchaseList: getPaymentComboPurchaseListByCombo(state, id),
      paymentComboPurchaseCount: state.paymentCombo.purchase.count,
      paymentComboPurchaseLoading: state.paymentCombo.purchase.loading,
      loading: state.paymentCombo.loading,
      paymentComboPurchaseInvoice: getInvoice(state, relatedInvoice),
    }),
    {
      fetchPaymentCombo,
      fetchPaymentComboPurchaseList,
      deletePaymentCombo,
      snackbarSuccess,
      fetchInvoiceByInvoiceItem: fetchInvoiceByInvoiceItemAction,
      updatePaymentCombo: createOrUpdatePaymentCombo,
      onShopItemClick: (id) => push(`/shop/${id}`),
      onPrivatePassClick: () => push('/private-service/pass'),
      onPaymentPackClick: (id) => push(`/payment-pack/${id}`),
      goToInvoice: (uuid) => push(`/invoice/${uuid}`),
      goToPaymentComboList: () => push('/payment-combo/'),
    },
  ),
  withHandlers({
    fetchInvoiceByInvoiceItem:
      ({ fetchInvoiceByInvoiceItem, setRelatedInvoice }) =>
      (buyableId, objectId, options) => {
        fetchInvoiceByInvoiceItem(buyableId, objectId, {
          onSuccess: (inv) => {
            setRelatedInvoice(inv.uuid);
            if (options && options.onSuccess) {
              options.onSuccess(inv);
            }
          },
          onError: (err) => {
            if (options && options.onError) {
              options.onError(err);
            }
          },
        });
      },
  }),
)(PaymentComboDetail);
