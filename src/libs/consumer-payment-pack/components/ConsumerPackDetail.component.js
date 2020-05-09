// @flow
import React from 'react';

import type { TFunction } from 'react-i18next';
import { withNamespaces } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';

import { compose } from 'recompose';
import InvoiceListItem from '../../invoice/InvoiceListItem.component';
import BookingItemForManagerV2 from '../../booking/components/BookingItemForManagerV2.component';
import PaginatedListBase from '../../../components/PaginatedListBase.component';
import ConsumerPaymentPackExtensionListItem from './ConsumerPaymentPackExtensionListItem.component';

import type { ConsumerPaymentPackExtension } from '../types';
import type { PaymentPack } from '../../payment-packs/types';
import type { Booking } from '../../booking/types';
import type { Invoice } from '../../invoice/types';
import type { Member } from '../../member/types';

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

  extensions: Array<ConsumerPaymentPackExtension>,
  onCreateExtension: ({ note: string, nbDays: number }) => void,
  deleteExtension: (id: number) => void,
  extensionsLoading: boolean,

  currentBookingPage: number,
  bookingCount: number,
  bookings: Array<Booking>,
  onBookingRequested: (page: number, page_size: number) => void,

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
        <PaginatedListBase
          itemPerPage={5}
          loading={props.bookingLoading || !props.member}
          listProps={{ disablePadding: true }}
          items={props.bookings}
          page={props.currentBookingPage}
          nbItems={props.bookingCount}
          onPageRequested={props.onBookingRequested}
          renderItem={(b) => (
            <BookingItemForManagerV2
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
      {props.extensionsLoading ? <LinearProgress /> : null}
      {props.extensions &&
      props.extensions.length &&
      !props.extensionsLoading ? (
        <React.Fragment>
          <Typography variant="h5" component="h2">
            {props.t('details.extensionsTitle')}
          </Typography>
          <Paper className={props.classes.paper}>
            <List disablePadding>
              {props.extensions.map((ex) => (
                <ConsumerPaymentPackExtensionListItem
                  key={ex.id}
                  extension={ex}
                  divider
                  onDelete={
                    props.consumerPack &&
                    !props.consumerPack.dst_consumer_payment_pack
                      ? () => props.deleteExtension(ex.id)
                      : null
                  }
                />
              ))}
            </List>
          </Paper>
        </React.Fragment>
      ) : null}
      {props.onCreateExtension &&
      props.consumerPack &&
      !props.consumerPack.dst_consumer_payment_pack ? (
        <div className={props.classes.addButtonContainer}>
          <Button
            variant="outlined"
            color="primary"
            onClick={props.onCreateExtension}
          >
            {props.t('consumerPaymentPack.addExtension')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  addButtonContainer: {
    width: '100%',
    paddingTop: theme.spacing(2),
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default compose(
  withNamespaces(['paymentPack']),
  withStyles(styles),
)(ConsumerPaymentPackDetail);
