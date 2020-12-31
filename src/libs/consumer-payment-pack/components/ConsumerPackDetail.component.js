// @flow
import React from 'react';
import moment from 'moment-timezone';
import type { TFunction } from 'react-i18next';
import { withTranslation } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExposureNeg1Icon from '@material-ui/icons/ExposureNeg1';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';

import { compose } from 'recompose';
import InvoiceListItem from '../../invoice/InvoiceListItem.component';
import BookingItemForManagerV2 from '../../booking/components/BookingItemForManagerV2.component';
import PaginatedListBase from '../../../components/PaginatedListBase.component';
import ConsumerPaymentPackExtensionListItem from './ConsumerPaymentPackExtensionListItem.component';
import ConsumerPaymentPackCreditRefundListItem from './ConsumerPaymentPackCreditRefundListItem.component';

import type {
  ConsumerPaymentPackExtension,
  ConsumerPaymentPackPenalty,
} from '../types';
import type { PaymentPack } from '../../payment-packs/types';
import type { Booking } from '../../booking/types';
import type { Invoice } from '../../invoice/types';
import type { Member } from '../../member/types';
import { formatAsDatetime } from '../../../utils/datetime';

const PENALTY_KIND_BLOCK_CPP = 0;
const PENALTY_KIND_NEGATIVE_ACCOUNT = 1;

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
  classes: Object,
  consumerPack: ?ConsumerPaymentPack,
  penalties: {
    items: Array<ConsumerPaymentPackPenalty>,
    count: number,
    page: number,
    loading: boolean,
  },
  penaltyPageSize: number,
  onPageRequested: (page: number, paseSize: number) => void,

  onInvoiceClick: (uuid: string) => void,
  t: TFunction,
  classes: Object,

  consumerPaymentPackCreditRefundList: Array<ConsumerPaymentPackCreditRefund>,
  requestRefund: (ConsumerPaymentPack, showCredit: boolean) => void,

  timezone: ?string,
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
          {props.consumerPaymentPackCreditRefundList &&
            props.consumerPaymentPackCreditRefundList.length > 0 && (
              <div>
                <Typography variant="h5" component="h2">
                  {props.t('details.refundTitle')}
                </Typography>
                <Paper className={props.classes.paper}>
                  {props.consumerPaymentPackCreditRefundList.map((cr) => (
                    <ConsumerPaymentPackCreditRefundListItem
                      creditRefund={cr}
                      key={cr.id}
                      divider
                      dense
                      onClick={() => props.onInvoiceClick(cr.invoice)}
                    />
                  ))}
                </Paper>
              </div>
            )}
          <div className={props.classes.rightButton}>
            <Button
              variant="contained"
              color="primary"
              disabled={
                props.consumerPack.disabled ||
                (!props.consumerPack.payment_pack.unlimited &&
                  !props.consumerPack.available_credits)
              }
              onClick={() => props.requestRefund(props.consumerPack, false)}
            >
              {props.t('consumerPaymentPack.details.actions.applyVoucher')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={
                props.consumerPack.disabled ||
                (!props.consumerPack.payment_pack.unlimited &&
                  !props.consumerPack.available_credits)
              }
              onClick={() => props.requestRefund(props.consumerPack, true)}
            >
              {props.t('consumerPaymentPack.details.actions.refund')}
            </Button>
          </div>
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
      {props.penalties.items && props.penalties.items.length > 0 && (
        <>
          <Typography variant="h5">
            {props.t('details.penaltyTitle')}
          </Typography>
          <Paper className={props.classes.paper}>
            <PaginatedListBase
              itemPerPage={props.penaltyPageSize}
              loading={props.penalties.loading}
              listProps={{ disablePadding: true }}
              items={props.penalties.items}
              nbItems={props.penalties.count}
              page={props.penalties.page}
              onPageRequested={props.onPageRequested}
              renderItem={(penalty) => (
                <ListItem dense divider key={penalty.id}>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        {moment(penalty.date_created).format('L - LT')}
                      </Typography>
                    }
                    secondary={
                      <>
                        {penalty.penalty_kind === PENALTY_KIND_BLOCK_CPP &&
                          props.t('details.penaltyBlock', {
                            nb_days: penalty.days_blocked,
                          })}
                        {penalty.penalty_kind ===
                          PENALTY_KIND_NEGATIVE_ACCOUNT &&
                          props.t('details.penaltyAccount', {
                            account_value: penalty.account_value,
                          })}
                      </>
                    }
                  />
                </ListItem>
              )}
            />
          </Paper>
        </>
      )}
      {!!props.consumerPack.track_modified_credit &&
      props.consumerPack.track_modified_credit.length ? (
        <div>
          <Typography variant="h5" component="h2">
            {props.t('details.trackModifiedCreditTitle')}
          </Typography>
          <Paper className={props.classes.paper}>
            {props.consumerPack.track_modified_credit.map((modifiedCredit) => (
              <ListItem dense divider>
                <ListItemIcon>
                  {modifiedCredit[1] > 0 ? (
                    <ExposurePlus1Icon />
                  ) : (
                    <ExposureNeg1Icon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={`${formatAsDatetime(
                    modifiedCredit[0] * 1000,
                    props.timezone,
                  )}`}
                />
              </ListItem>
            ))}
          </Paper>
        </div>
      ) : null}
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
      !!props.consumerPack &&
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
  rightButton: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
    '&>*': {
      marginLeft: theme.spacing(1),
    },
  },
});

export default compose(
  withTranslation(['paymentPack']),
  withStyles(styles),
)(ConsumerPaymentPackDetail);
