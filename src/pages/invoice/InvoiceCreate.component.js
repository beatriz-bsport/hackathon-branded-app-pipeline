// @flow

import React, { Component } from 'react';

import { withStyles, Typography, CircularProgress } from '@material-ui/core';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { push as pushRouter } from 'react-router-redux';

import type { TFunction } from 'react-i18next';
import InvoiceForm from '../../components/form/InvoiceForm.component';
import { Moment } from '../../i18n';
import { formatAsDate } from '../../datetime';
import { invoice as invoiceActions } from '../../actions';

import type { Member } from '../../api/types';
import type { InvoiceDataFront } from '../../components/form/types';
import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  member: Member,
  paymentPacks: Array<PaymentPack>,
  activities: Array<Activity>,
  shopItems: Array<ShopItem>,
  goToInvoiceList: () => void,
  createInvoice: () => void,
  creatingInvoice: boolean,
  t: TFunction,
  classes: Object,
  resetCreateOrUpdateStatus: () => void,
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
      t,
      classes,
      goToInvoiceList,
      shopItems,
      creatingInvoice,
    } = this.props;
    if (member === null) {
      return <CircularProgress />;
    }
    return (
      <div>
        <Typography variant="h4" className={classes.title}>
          {`${t('payment.invoice')} - ${formatAsDate(Moment())} - ${
            member.name
          }`}
        </Typography>
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
        />
      </div>
    );
  }
}

function mapStateToProps(state, nextProps) {
  const { match } = nextProps;
  const id = (match && match.params && +match.params.id) || null;
  return {
    member: id !== null ? state.member.all.find((m) => m.id === id) : null,
    activities: state.activity.all,
    paymentPacks: state.paymentPack.all,
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
  };
}

const styles = (theme) => ({
  title: {
    paddingBottom: theme.spacing.unit * 4,
  },
});

export default withStyles(styles)(
  translate()(
    connect(
      mapStateToProps,
      mapDispatchToProps,
    )(withDrawer('invoiceCreatePage')(InvoiceCreatePage)),
  ),
);
