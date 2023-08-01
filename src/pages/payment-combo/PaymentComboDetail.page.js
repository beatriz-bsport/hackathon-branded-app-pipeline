// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';

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
import PaymentComboFormDrawerContainer from './PaymentComboFormDrawer.container';
import { snackbarSuccess } from '#libs/snackbar/actions';
import themeSelectors from '../../libs/theme/selectors';

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
  theme: Theme,
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

  goToInvoiceUsingPaymentComboPurchaseId = (
    buyable_item_identifier: number,
    id: number,
  ) => {
    this.props.fetchInvoiceByInvoiceItem(buyable_item_identifier, id, {
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
          fetchPaymentComboPurchaseList={(page, options) =>
            this.props.fetchPaymentComboPurchaseList(
              {
                page,
                payment_combo: this.props.id,
              },
              options,
            )
          }
          goToInvoiceUsingPaymentComboPurchaseId={
            this.goToInvoiceUsingPaymentComboPurchaseId
          }
          onPaymentPackClick={this.props.onPaymentPackClick}
          onPrivatePassClick={this.props.onPrivatePassClick}
          onShopItemClick={this.props.onShopItemClick}
          paymentCombo={this.props.paymentCombo}
          paymentComboPurchaseCount={this.props.paymentComboPurchaseCount}
          paymentComboPurchaseList={this.props.paymentComboPurchaseList}
          paymentComboPurchaseLoading={this.props.paymentComboPurchaseLoading}
          snackbarSuccess={this.props.snackbarSuccess}
        />
        <BottomActionsButton
          onDelete={() => this.props.setDeleteIsOpen(true)}
          onEdit={
            this.props.paymentCombo
              ? () => this.props.setEditIsOpen(true)
              : null
          }
        />
        <PaymentComboDeleteDialog
          onClose={() => this.props.setDeleteIsOpen(false)}
          onSubmit={this.deletePaymentCombo}
          open={this.props.deleteIsOpen}
        />
        {this.props.paymentCombo ? (
          <PaymentComboFormDrawerContainer
            handleClose={() => this.props.setEditIsOpen(false)}
            initial={this.props.paymentCombo}
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
            open={this.props.editIsOpen}
            provincialTax={this.props.theme?.provincial_tax_value}
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
      theme: themeSelectors.getTheme(state),
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
      onPrivatePassClick: (id) => push(`/private-service/pass/${id}`),
      onPaymentPackClick: (id) => push(`/payment-pack/${id}`),
      goToInvoice: (uuid) => push(`/invoice/${uuid}`),
      goToPaymentComboList: () => push('/combo/'),
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
