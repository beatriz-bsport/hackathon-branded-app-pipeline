// @flow

import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { push as pushRouter } from 'connected-react-router';
import { compose } from 'recompose';
import type { TFunction } from 'react-i18next';

import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import { Moment } from '../../i18n';
import { formatAsDate } from '../../datetime';
import { createOrUpdateInvoice } from '../../libs/invoice/actions';
import { fetchShopItemAsManager as fetchShopItems } from '../../libs/shop/actions/shopitem';
import { fetchAllPaymentPacks } from '../../libs/payment-packs/actions';
import { fetchMember } from '../../libs/member/actions';

import type { Member } from '../../libs/member/types';
import { getMember } from '../../libs/member/selectors';
import type { InvoiceDataFront } from '../../components/form/types';
import withTitle from '../../hocs/with-title.hoc';
import withQueryParams from '../../hocs/with-query-params.hoc';

import { getBuyableItem } from '../../libs/invoice/selectors';

import { fetchPrivatePassList } from '../../libs/private-service/actions';
import { fetchPaymentComboList } from '../../libs/payment-combo/actions';

import InvoiceForm from '../../libs/invoice/components/InvoiceForm.component';
import InvoiceDateDialog from '../../libs/invoice/dialog/InvoiceDateDialog.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

type Props = {
  member: ?Member,
  id: number,
  fetch: (id: number) => void,

  goToInvoiceList: () => void,
  createInvoice: () => void,
  goToMemberPage: (id: number) => void,
  goToSubscription: (id: number) => void,

  fetchShopItems: () => void,
  fetchAllPaymentPacks: () => void,
  fetchPrivatePassList: () => void,
  fetchPaymentComboList: () => void,

  creatingInvoice: boolean,
  loading: boolean,
  availableBuyableItems: { [buyable_item_identifier: number]: Array<any> },
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
      goToInvoiceList,
      creatingInvoice,
      loading,
      goToMemberPage,
      id,
    } = this.props;

    if (!member || loading) {
      return <LinearProgress />;
    }
    return (
      <div>
        <InvoiceForm
          member={member}
          onSubmit={this.prepareCreate}
          onCancel={goToInvoiceList}
          processing={creatingInvoice}
          availableBuyableItems={this.props.availableBuyableItems}
          goToSubscription={this.props.goToSubscription}
          goToMemberPage={() => goToMemberPage(id)}
          initialItems={this.props.initialItems}
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
    paddingBottom: theme.spacing(4),
  },
});

export default compose(
  withStyles(styles),
  withTranslation(),
  routerParamsToProps({
    id: 'id:number',
  }),
  connect(
    (state, { id }) => ({
      loading:
        state.member.loading ||
        state.paymentPack.loading ||
        state.privateService.privatePass.loading,
      member: getMember(state, id),
      availableBuyableItems: getBuyableItem(state),
    }),
    {
      fetchShopItems,
      fetchAllPaymentPacks,
      fetchPrivatePassList,
      fetchPaymentComboList,
      goToInvoiceList: () => pushRouter('/invoice'),
      createInvoice: createOrUpdateInvoice,

      goToMemberPage: (id) => pushRouter(`/member/${id}/`),
      goToSubscription: (id) => pushRouter(`/subscription/${id}/`),
      fetch: fetchMember,
    },
  ),
  withQueryParams([['withCredit', 'withPrivatePass'], 'initialItems']),
  withTitle(
    ({ t, member }: { t: TFunction, member: Member }) =>
      `${t('titles:invoice.invoiceCreate')} - ${formatAsDate(Moment())} - ${
        member ? member.name : ' '
      }`,
  ),
)(InvoiceCreatePage);
