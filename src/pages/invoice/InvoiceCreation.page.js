// @flow

import React, { Component } from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { push as pushRouter } from 'connected-react-router';
import { compose, withHandlers } from 'recompose';
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

import { fetchPrivatePassList } from '../../libs/private-service/actions.ts';
import { fetchPaymentComboList } from '../../libs/payment-combo/actions';

import InvoiceFormV2 from '../../libs/invoice/components/InvoiceFormV2.component';
import InvoiceDateDialog from '../../libs/invoice/dialog/InvoiceDateDialog.component';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

type Props = {
  member: ?Member,
  memberId: number,
  fetchMember: (id: number) => void,

  goToInvoiceList: () => void,
  createInvoice: () => void,
  goToMemberPage: (id: number) => void,
  goToSubscription: (id: number) => void,

  fetchShopItems: () => void,
  fetchAllPaymentPacks: () => void,
  fetchPrivatePassList: () => void,
  fetchPaymentComboList: () => void,

  initialItems: { withPrivatePass: ?string, withCredit: ?string },

  loading: boolean,
  availableBuyableItems: { [buyable_item_identifier: number]: Array<any> },
};

type State = {
  dateDialogOpen: boolean,
  invoiceData: ?InvoiceDataFront,
};

export class InvoiceCreation extends Component<Props, State> {
  state = {
    dateDialogOpen: false,
    invoiceData: null,
  };

  componentDidMount() {
    this.props.fetchMember(this.props.memberId);
    this.props.fetchShopItems();
    this.props.fetchAllPaymentPacks();
    this.props.fetchPrivatePassList();
    this.props.fetchPaymentComboList();
  }

  prepareCreate = (invoiceData: InvoiceDataFront) => {
    this.setState({
      dateDialogOpen: true,
      invoiceData,
    });
  };

  createInvoiceAtDate = (date: string, options: OptionCallback) => {
    this.props.createInvoice(
      {
        ...this.state.invoiceData,
        member: this.props.memberId,
        date,
        is_v2: true,
      },
      {
        onSuccess: () => {
          if (options && options.onSuccess) {
            options.onSuccess();
          }
          this.setState({ dateDialogOpen: false, invoiceData: null });
        },
        onError: () => {
          this.setState({ invoiceData: null, dateDialogOpen: false });
          if (options && options.onError) {
            options.onError();
          }
        },
      },
    );
  };

  render() {
    const {
      member,
      goToInvoiceList,
      loading,
      goToMemberPage,
      memberId,
    } = this.props;

    if (!member || loading) {
      return <LinearProgress />;
    }
    return (
      <div>
        <InvoiceFormV2
          member={member}
          onSubmit={this.prepareCreate}
          onCancel={goToInvoiceList}
          availableBuyableItems={this.props.availableBuyableItems}
          goToSubscription={this.props.goToSubscription}
          goToMemberPage={() => goToMemberPage(memberId)}
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
    memberId: 'memberId:number',
  }),
  connect(
    (state, { memberId }) => ({
      loading: state.member.loading,
      member: getMember(state, memberId),
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
      fetchMember,
      goToInvoice: (uuid) => pushRouter(`/invoice/${uuid}/`),
    },
  ),
  withHandlers({
    createInvoice: ({ createInvoice, goToInvoice }) => (
      invoiceData,
      options,
    ) => {
      createInvoice(invoiceData, {
        onSuccess: (invoice) => {
          if (options && options.onSuccess) {
            options.onSuccess(invoice);
          }
          // TODO goto payment page
          goToInvoice(invoice.uuid);
        },
        onError: options && options.onError,
      });
    },
  }),
  withQueryParams([['withCredit', 'withPrivatePass'], 'initialItems']),
  withTitle(
    ({ t, member }: { t: TFunction, member: Member }) =>
      `${t('titles:invoice.invoiceCreate')} - ${formatAsDate(Moment())} - ${
        member ? member.name : ' '
      }`,
  ),
)(InvoiceCreation);
