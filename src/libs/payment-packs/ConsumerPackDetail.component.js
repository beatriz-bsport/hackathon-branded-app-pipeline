// @flow
import React from 'react';

import type { TFunction } from 'react-i18next';
import { withNamespaces } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import { compose } from 'recompose';
import InvoiceListItem from '../invoice/InvoiceListItem.component';
import BookingItemForManager from '../booking/components/BookingItemForManager.component';
import PaginatedListStateful from '../../components/PaginatedListStateful.component';

import type { PaymentPack } from './types';
import type { Booking } from '../booking/types';
import type { Invoice } from '../invoice/types';
import type { Member } from '../member/types';

type Props = {
  bookings: Array<Booking>,
  paymentPack: PaymentPack,
  bookingLoading: boolean,
  onBookingClick: (b: Booking) => void,
  handleRevert: (id: number) => void,
  discardBookingAttendance: (id: number) => void,
  confirmBookingAttendance: (id: number) => void,
  invoice: Invoice,
  member: Member,

  onInvoiceClick: (uuid: string) => void,
  t: TFunction,
  classes: Object,
};

export function ConsumerPaymentPackDetail(props: Props) {
  return (
    <div>
      {props.invoice ? (
        <React.Fragment>
          <Typography variant="h5" component="h2">
            {props.t('details.invoiceTitle')}
          </Typography>
          <Paper className={props.classes.paper}>
            <InvoiceListItem
              onClick={() => props.onInvoiceClick(props.invoice.uuid)}
              invoice={props.invoice}
            />
          </Paper>
        </React.Fragment>
      ) : null}
      <Typography variant="h5" component="h2">
        {props.t('details.bookingsTitle')}
      </Typography>
      <Paper className={props.classes.paper}>
        <PaginatedListStateful
          itemPerPage={5}
          loading={props.bookingLoading || !props.member}
          listProps={{ disablePadding: true }}
          items={props.bookings}
          renderItem={(b) => (
            <BookingItemForManager
              onClick={() => props.onBookingClick(b)}
              showRevertBookingButton
              button
              key={b.id}
              booking={b}
              heading="date_start"
              member={props.member}
              paymentPacks={[props.paymentPack]}
              handleRevert={() => props.handleRevert(b)}
              discardBookingAttendance={() =>
                props.discardBookingAttendance(b.id)
              }
              confirmBookingAttendance={() =>
                props.confirmBookingAttendance(b.id)
              }
            />
          )}
        />
      </Paper>
    </div>
  );
}

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
});

export default compose(
  withNamespaces(['paymentPack']),
  withStyles(styles),
)(ConsumerPaymentPackDetail);
