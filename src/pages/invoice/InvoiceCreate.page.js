// @flow

import React, { Component } from 'react';

import { withStyles, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { push as pushRouter } from 'react-router-redux';
import { compose } from 'recompose';

import type { TFunction } from 'react-i18next';
import paymentPackSelectors from '../../libs/payment-packs/selectors';
import type { PaymentPack } from '../../libs/payment-packs/types';
import { Moment } from '../../i18n';
import { formatAsDate } from '../../datetime';
import { invoice as invoiceActions } from '../../actions';
import { fetchMember } from '../../libs/member/actions';

import type { Member } from '../../libs/member/types';
import memberSelectors from '../../libs/member/selectors';
import type { InvoiceDataFront } from '../../components/form/types';
import withDrawer from '../../hocs/with-drawer.hoc';

import InvoiceForm from '../../libs/invoice/InvoiceForm.component';
import InvoiceDateDialog from '../../libs/invoice/dialog/InvoiceDateDialog.component';

type Props = {
  member: ?Member,
  id: number,
  fetch: (id: number) => void,

  paymentPacks: Array<PaymentPack>,
  activities: Array<Activity>,
  shopItems: Array<ShopItem>,

  goToInvoiceList: () => void,
  createInvoice: () => void,
  resetCreateOrUpdateStatus: () => void,
  goToMemberPage: (id: number) => void,

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
    this.props.createInvoice({
      ...this.state.invoiceData,
      member: this.props.member.id,
      date,
    });
  };

  render() {
    const {
      member,
      activities,
      paymentPacks,
      goToInvoiceList,
      shopItems,
      creatingInvoice,
      loading,
      goToMemberPage,
      id,
    } = this.props;
    if (!member || loading) {
      return <CircularProgress />;
    }
    return (
      <div>
        <InvoiceForm
          member={member}
          activities={activities}
          paymentPacks={paymentPacks}
          shopItems={shopItems}
          createOrUpdate={this.prepareCreate}
          uneditablePayments={[]}
          uneditableInvoiceItems={[]}
          onCancel={goToInvoiceList}
          processing={creatingInvoice}
          goToMemberPage={() => goToMemberPage(id)}
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

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const id = (match && match.params && +match.params.id) || null;
  return {
    id,
    loading: state.member.loading,
    member: memberSelectors.get(state, id),
    activities: state.activity.all,
    paymentPacks: paymentPackSelectors.getEnabled(state),
    shopItems: state.shop.all,
    creatingInvoice: state.invoice.createOrUpdatePending,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    goToInvoiceList() {
      dispatch(pushRouter('/invoice'));
    },
    createInvoice(invoiceData: InvoiceData) {
      dispatch(invoiceActions.createOrUpdateInvoice(invoiceData));
    },
    resetCreateOrUpdateStatus() {
      dispatch(invoiceActions.createOrUpdateReset());
    },
    goToMemberPage(id) {
      dispatch(pushRouter(`/member/${id}/`));
    },
    fetch(id) {
      dispatch(fetchMember(id));
    },
  };
}

const styles = (theme) => ({
  title: {
    paddingBottom: theme.spacing.unit * 4,
  },
});

export default compose(
  withStyles(styles),
  withNamespaces(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withDrawer(
    ({ t, member }: { t: TFunction, member: Member }) =>
      `${t('payment.invoice')} - ${formatAsDate(Moment())} - ${
        member ? member.name : ' '
      }`,
  ),
)(InvoiceCreatePage);
