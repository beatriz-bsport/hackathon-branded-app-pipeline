// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withState, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { push } from 'connected-react-router';

import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import BottomActionsButton from '#src/components/button/BottomActionsButton.component';

import {
  fetchPaymentCombo,
  fetchPaymentComboPurchaseList,
  createOrUpdatePaymentCombo,
  deletePaymentCombo,
} from '#src/libs/payment-combo/actions';
import { fetchByInvoiceItem as fetchInvoiceByInvoiceItemAction } from '#src/libs/invoice/actions';
import {
  getPaymentCombo,
  getPaymentComboPurchaseListByCombo,
} from '#src/libs/payment-combo/selectors';
import { getInvoice } from '#src/libs/invoice/selectors';
import PaymentComboDetailComponent from '#src/libs/payment-combo/components/PaymentComboDetail.component';
import PaymentComboDeleteDialog from '#src/libs/payment-combo/components/PaymentComboDeleteDialog.component';
import { snackbarSuccess } from '#src/libs/snackbar/actions';
import { fetchTags } from '#src/libs/tag/actions';
import { getAllTagsWithTagGroup } from '#src/libs/tag/selectors';

import type { PaymentCombo } from '#src/libs/payment-combo/types';
import themeSelectors from '../../libs/theme/selectors';
import PaymentComboFormDrawerContainer from './PaymentComboFormDrawer.container';

import type { BookkeepingAccount } from '../../libs/payment/types';
import { fetchBookkeepingAccountList as fetchBookkeepingAccountListAction } from '../../libs/payment/actions';
import {
  getBookkeepingAccountList,
  getBookkeepingAccountById,
} from '../../libs/payment/selectors';
import { IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED } from '../../libs/payment/constants';

type OptionsCallback = { onSuccess?: () => void, onError?: () => void };

type Props = {
  id: number,
  loading: boolean,
  classes: Object,
  paymentCombo?: PaymentCombo,
  paymentComboPurchaseList: Array<PaymentComboPurchase>,
  paymentComboPurchaseCount: number,
  paymentComboPurchaseLoading: boolean,
  paymentComboPurchaseCount: number,
  allTagsWithTagGroup: Array<Tag<TagGroup>>,

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
  fetchTags: () => void,

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
  bookkeepingAccounts: BookkeepingAccount[],
  bookkeepingAccountById: Record<number, BookkeepingAccount>,
  fetchAvailableBookkeepingAccounts: () => void,
};

export class PaymentComboDetail extends React.Component<Props> {
  componentDidMount() {
    this.fetchData();
    if (IS_BOOKKEEPING_ACOUNT_FEATURE_ENABLED) {
      this.props.fetchAvailableBookkeepingAccounts();
    }
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
    this.props.fetchTags();
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
            bookkeepingAccountById={this.props.bookkeepingAccountById}
            bookkeepingAccounts={this.props.bookkeepingAccounts}
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
            tagList={this.props.allTagsWithTagGroup}
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
      allTagsWithTagGroup: getAllTagsWithTagGroup(state),
      bookkeepingAccounts: getBookkeepingAccountList(state),
      bookkeepingAccountById: getBookkeepingAccountById(state),
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

      fetchTags,
      fetchBookkeepingAccountList: fetchBookkeepingAccountListAction,
    },
  ),
  withHandlers({
    fetchAvailableBookkeepingAccounts:
      ({ fetchBookkeepingAccountList }) =>
      () =>
        fetchBookkeepingAccountList({
          is_active: true,
        }),
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
