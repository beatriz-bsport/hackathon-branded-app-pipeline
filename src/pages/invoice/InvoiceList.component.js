// @flow

import React, { Component } from 'react';
import {
  TableRow,
  TableCell,
  Typography,
  Grid,
  CircularProgress,
} from '@material-ui/core';

import { push as routerPush } from 'react-router-redux';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import DoneIcon from '@material-ui/icons/Done';

import { PAYMENT_PACK } from 'bsport-commons/lib/master-data/payment-methods';

import { formatAsDatetime } from '../../datetime';
import { FeatureTable } from '../../components';
import { invoice as invoiceActions } from '../../actions';

import type { Member, Invoice } from '../../api/types';
import withDrawer from '../../hocs/with-drawer.hoc';

type Props = {
  t: (x: string) => string,
  invoices: Array<Object>, // it is an immutable on which we call .asMutable() but whatever
  loading: boolean,
  members: Array<Member>,
  pushToInvoiceDetail: (uuid: string) => void,
};

type State = {
  selectedInvoiceUuid: ?string,
};

function renderStatus(invoice: Invoice) {
  // prettier-ignore
  const payed = (
    -(
      invoice.price_due
      - invoice.price_payed
      - invoice.voucher
      ) >= 0
  );
  if (payed) {
    return <DoneIcon color="primary" />;
  }
  return (
    <Typography color="error">
      - {invoice.price_due - invoice.price_payed - invoice.voucher} €
    </Typography>
  );
}

export class InvoiceList extends Component<Props, State> {
  getColumnData = () => {
    const { t } = this.props;
    return [
      {
        id: 'iuud',
        label: 'ID',
      },
      {
        id: 'name',
        label: t('payment.consumer'),
      },
      {
        id: 'date',
        label: t('payment.paymentDate'),
      },
      {
        id: 'price_payed',
        label: t('payment.amount'),
      },
      {
        id: 'status',
        label: t('payment.fullyPaid'),
      },
    ];
  };

  handleInvoiceClick = (event, selectedInvoiceUuid) => {
    this.props.pushToInvoiceDetail(selectedInvoiceUuid);
  };
  /*
    if (selectedInvoiceUuid == this.state.selectedInvoiceUuid) {
      this.setState({ selectedInvoiceUuid: null });
    } else {
      this.props.fetchSpecificInvoice(selectedInvoiceUuid);
      this.setState({ selectedInvoiceUuid });
    }
  };

     * TODO : use mui-virtualized-table ?
  renderInvoiceDetails = () => {
    const { specificInvoiceLoading, specificInvoice, classes } = this.props;
    if (specificInvoiceLoading || specificInvoice === null) {
      return <CircularProgress />;
    }
    return (
      <Table>
        <Grid container direction="row" className={classes.invoiceDetails}>
          <Grid item xs={12} md={6}>
            <PaymentList
              paymentItems={specificInvoice.payments.map((p) => ({
                paymentInfoExtra: p.payment_note,
                status: p.payment_received,
                id: p.uuid,
                paymentMethod: p.payment_method,
                price: p.price,
              }))}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InvoiceItemList
              paymentPackInvoiceItems={[]}
              offerInvoiceItems={[]}
              voucherInvoiceItems={[]}
            />
          </Grid>
        </Grid>
      </Table>
    );
  };
  */

  renderRow = (inv: Invoice) => (
    <TableRow
      key={inv.uuid}
      hover
      onClick={(event) => this.handleInvoiceClick(event, inv.uuid)}
    >
      <TableCell component="th" scope="row">
        {inv.uuid.slice(0, 8).toUpperCase()}
      </TableCell>
      <TableCell>
        {(this.props.members.find((m) => m.id === inv.member) || {}).name}
      </TableCell>
      <TableCell>{formatAsDatetime(inv.date)}</TableCell>
      <TableCell>{inv.price_due} €</TableCell>
      <TableCell>{renderStatus(inv)}</TableCell>
    </TableRow>
  );

  render() {
    const { invoices, loading } = this.props;
    if (loading) {
      return <CircularProgress />;
    }
    const mutableInvoices = invoices.asMutable
      ? invoices.asMutable()
      : invoices;
    const moneyInvoices = mutableInvoices.filter(
      (inv) => inv.payment_method !== PAYMENT_PACK,
    );
    return (
      <Grid container spacing={32} alignItems="flex-end">
        <Grid item xs={12}>
          <FeatureTable
            data={moneyInvoices}
            renderRow={this.renderRow}
            columnData={this.getColumnData()}
            loading={loading}
            orderBy="date"
            order="desc"
          />
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    members: state.member.all,
    invoices: state.invoice.all,
    loading: state.invoice.loading || state.member.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSpecificInvoice(uuid) {
      dispatch(invoiceActions.fetchSpecificInvoice(uuid));
    },
    pushToInvoiceDetail(uuid) {
      dispatch(routerPush(`/invoice/${uuid}`));
    },
  };
}

export default translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(withDrawer('invoiceList')(InvoiceList)),
);
