// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { push } from 'connected-react-router';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import BottomActionsButton from '../../components/button/BottomActionsButton.component';

import {
  fetchPaymentCombo,
  fetchPaymentComboPurchaseList,
  createOrUpdatePaymentCombo,
  deletePaymentCombo,
} from '../../libs/payment-combo/actions';
import {
  getPaymentCombo,
  getPaymentComboPurchaseListByCombo,
} from '../../libs/payment-combo/selectors';
import PaymentComboDetailComponent from '../../libs/payment-combo/components/PaymentComboDetail.component';
import PaymentComboDeleteDialog from '../../libs/payment-combo/components/PaymentComboDeleteDialog.component';
import PaymentComboFormDialogContainer from './PaymentComboFormDialog.container';
import { snackbarSuccess } from '../../actions/snackbar.actions';

import type { PaymentCombo } from '../../libs/payment-combo/types';

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
          goToInvoice={this.props.goToInvoice}
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
  withNamespaces(['paymentCombo']),
  withStyles(styles),
  routerParamsToProps({ id: 'id:number' }),
  connect(
    (state, { id }) => ({
      paymentCombo: getPaymentCombo(state, id),
      paymentComboPurchaseList: getPaymentComboPurchaseListByCombo(state, id),
      paymentComboPurchaseCount: state.paymentCombo.purchase.count,
      paymentComboPurchaseLoading: state.paymentCombo.purchase.loading,
      loading: state.paymentCombo.loading,
    }),
    {
      fetchPaymentCombo,
      fetchPaymentComboPurchaseList,
      deletePaymentCombo,
      snackbarSuccess,
      updatePaymentCombo: createOrUpdatePaymentCombo,
      onShopItemClick: (id) => push(`/shop/${id}`),
      onPrivatePassClick: () => push('/private-service/pass'),
      onPaymentPackClick: (id) => push(`/payment-pack/${id}`),
      goToInvoice: (uuid) => push(`/invoice/${uuid}`),
      goToPaymentComboList: () => push('/payment-combo/'),
    },
  ),
  withState('editIsOpen', 'setEditIsOpen', false),
  withState('deleteIsOpen', 'setDeleteIsOpen', false),
)(PaymentComboDetail);
