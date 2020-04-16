// @flow

import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { push as pushRouter } from 'react-router-redux';
import { compose } from 'recompose';

import type { TFunction } from 'react-i18next';
import { getShopItemsAvailable } from '../../libs/shop/selectors';
import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import type { PaymentPack } from '../../libs/payment-packs/types';
import { Moment } from '../../i18n';
import { formatAsDate } from '../../datetime';
import { invoice as invoiceActions } from '../../actions';
import { fetchShopItemAsManager as fetchShopItems } from '../../libs/shop/actions/shopitem';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import { fetchMember } from '../../libs/member/actions';

import type { Member } from '../../libs/member/types';
import memberSelectors from '../../libs/member/selectors';
import type { InvoiceDataFront } from '../../components/form/types';
import withTitle from '../../hocs/with-title.hoc';

import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { getPrivatePassAvailable } from '../../libs/private-service/selectors/private-pass';

import { fetchPaymentComboList } from '../../libs/payment-combo/actions';
import { getPaymentComboList } from '../../libs/payment-combo/selectors';

import InvoiceForm from '../../libs/invoice/InvoiceForm.component';
import InvoiceDateDialog from '../../libs/invoice/dialog/InvoiceDateDialog.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import type { PrivatePass } from '../../libs/private-service/types';
import type { PaymentCombo } from '../../libs/payment-combo/types';

type Props = {
  member: ?Member,
  id: number,
  fetch: (id: number) => void,

  paymentPacks: Array<PaymentPack>,
  shopItems: Array<ShopItem>,
  privatePassList: Array<PrivatePass>,
  paymentComboList: Array<PaymentCombo>,

  goToInvoiceList: () => void,
  createInvoice: () => void,
  resetCreateOrUpdateStatus: () => void,
  goToMemberPage: (id: number) => void,

  fetchShopItems: () => void,
  fetchAllPaymentPacks: () => void,
  fetchPrivatePassList: () => void,
  fetchPaymentComboList: () => void,

  creatingInvoice: boolean,
  loading: boolean,
};

type State = {
  dateDialogOpen: boolean,
  invoiceData: ?InvoiceDataFront,
};

export class InvoiceCreatePage extends Component<Props, State> {
  state = {
    dateDialogOpen: false,
    invoiceData: null,
  };

  componentDidMount() {
    this.props.resetCreateOrUpdateStatus();
    this.props.fetch(this.props.id);
    this.props.fetchShopItems();
    this.props.fetchAllPaymentPacks();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.id !== prevProps.id && this.props.id) {
      this.props.fetch(this.props.id);
    }
  }

  prepareCreate = (invoiceData: InvoiceDataFront) => {
    this.setState({
      dateDialogOpen: true,
      invoiceData,
    });
  };

  createInvoiceAtDate = (date: string) => {
    this.setState({ dateDialogOpen: false });
    this.props.createInvoice(
      {
        ...this.state.invoiceData,
        member: this.props.member.id,
        date,
      },
      true,
      () => this.props.goToMemberPage(this.props.member.id),
    );
    this.setState({ invoiceData: null });
  };

  render() {
    const {
      member,
      paymentPacks,
      goToInvoiceList,
      shopItems,
      creatingInvoice,
      loading,
      goToMemberPage,
      id,
    } = this.props;
    const urlParams = new URLSearchParams(window.location.search.substring(1));

    if (!member || loading) {
      return <CircularProgress />;
    }
    return (
      <div>
        <InvoiceForm
          member={member}
          paymentPacks={paymentPacks}
          privatePassList={this.props.privatePassList}
          shopItems={shopItems}
          paymentComboList={this.props.paymentComboList}
          createOrUpdate={this.prepareCreate}
          uneditablePayments={[]}
          uneditableInvoiceItems={[]}
          onCancel={goToInvoiceList}
          processing={creatingInvoice}
          goToMemberPage={() => goToMemberPage(id)}
          editMode={urlParams.get('withCredit') !== null ? 1 : 0}
          withPrivatePass={parseInt(urlParams.get('withPrivatePass'), 10)}
          withCredit={
            urlParams.get('withCredit') !== null
              ? Number(urlParams.get('withCredit'))
              : 0
          }
        />
        <InvoiceDateDialog
          open={this.state.dateDialogOpen}
          onClose={() =>
            this.setState({ dateDialogOpen: false, invoiceData: null })
          }
          onSubmit={this.createInvoiceAtDate}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  title: {
    paddingBottom: theme.spacing.unit * 4,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  routerParamsToProps({
    id: 'id:number',
  }),
  connect(
    (state, { id }) => ({
      loading:
        state.member.loading ||
        state.paymentPack.loading ||
        state.privateService.privatePass.loading,
      member: memberSelectors.get(state, id),
      paymentPacks: getPaymentPackEnabled(state),
      privatePassList: getPrivatePassAvailable(state),
      creatingInvoice: state.invoice.createOrUpdatePending,
      shopItems: getShopItemsAvailable(state),
      paymentComboList: getPaymentComboList(state),
    }),
    {
      fetchShopItems,
      fetchAllPaymentPacks,
      fetchPrivatePassList,
      fetchPaymentComboList,
      goToInvoiceList: () => pushRouter('/invoice'),
      createInvoice: invoiceActions.createOrUpdateInvoice,
      resetCreateOrUpdateStatus: invoiceActions.createOrUpdateReset,
      goToMemberPage: (id) => pushRouter(`/member/${id}/`),
      fetch: fetchMember,
    },
  ),
  withTitle(
    ({ t, member }: { t: TFunction, member: Member }) =>
      `${t('titles:invoice.invoiceCreate')} - ${formatAsDate(Moment())} - ${
        member ? member.name : ' '
      }`,
  ),
)(InvoiceCreatePage);
