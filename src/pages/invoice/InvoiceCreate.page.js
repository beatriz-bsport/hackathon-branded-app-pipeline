// @flow

import React, { Component } from 'react';

import { withStyles, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { withNamespaces } from 'react-i18next';
import { push as pushRouter } from 'react-router-redux';
import { compose } from 'recompose';

import type { TFunction } from 'react-i18next';
import { Moment } from '../../i18n';
import { formatAsDate } from '../../datetime';
import { invoice as invoiceActions } from '../../actions';

import type { Member } from '../../api/types';
import type { InvoiceDataFront } from '../../components/form/types';
import withDrawer from '../../hocs/with-drawer.hoc';

import InvoiceForm from '../../libs/invoice/InvoiceForm.component';

type Props = {
  member: Member,

  paymentPacks: Array<PaymentPack>,
  activities: Array<Activity>,
  shopItems: Array<ShopItem>,

  goToInvoiceList: () => void,
  createInvoice: () => void,
  resetCreateOrUpdateStatus: () => void,
  goToMemberPage: (id) => void,

  creatingInvoice: boolean,
  loading: boolean,
};

export class InvoiceCreatePage extends Component<Props> {
  componentDidMount() {
    this.props.resetCreateOrUpdateStatus();
  }

  createInvoice = (invoiceData: InvoiceDataFront) => {
    this.props.createInvoice({ ...invoiceData, member: this.props.member.id });
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
    if (member === null || loading) {
      return <CircularProgress />;
    }
    return (
      <InvoiceForm
        member={member}
        activities={activities}
        paymentPacks={paymentPacks}
        shopItems={shopItems}
        createOrUpdate={this.createInvoice}
        uneditablePayments={[]}
        uneditableInvoiceItems={[]}
        onCancel={goToInvoiceList}
        processing={creatingInvoice}
        goToMemberPage={() => goToMemberPage(id)}
      />
    );
  }
}

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const id = (match && match.params && +match.params.id) || null;
  return {
    id,
    loading: state.member.loading,
    member: state.member.all.find((m) => m.id === id),
    activities: state.activity.all,
    paymentPacks: (state.paymentPack.all || []).filter((pp) => !pp.disabled),
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
      dispatch(pushRouter(`/member/${id}`));
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
      `${t('payment.invoice')} - ${formatAsDate(Moment())} - ${member.name ||
        ' '}`,
  ),
)(InvoiceCreatePage);
