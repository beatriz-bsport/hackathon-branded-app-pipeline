import React from 'react';
import { DateTime, Settings } from 'luxon';
import { useTranslation } from 'react-i18next';
import { makeStyles, Theme } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InvoiceListItem from '#src/libs/invoice/InvoiceListItem.component';
// @ts-expect-error
import BookingItemForManagerV2 from '#src/libs/booking/components/BookingItemForManagerV2.component';
// @ts-expect-error
import PaginatedListBase from '#src/components/PaginatedListBase.component';
import ExtensionListItem from '#src/components/ExtensionListItem';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import { getCurrencyDisplay } from '#src/libs/theme/selectors';

import type { PaymentPack } from '#src/libs/payment-packs/types';
import type { Booking } from '#src/libs/booking/types';
import type { Invoice } from '#src/libs/invoice/types';
import type { Member } from '#src/libs/member/types';

import { CONSUMER_PAYMENT_PACK_EXTENSION_PAGE_SIZE } from '#src/libs/consumer-payment-pack/constants';
import type {
  ConsumerPaymentPack,
  ConsumerPaymentPackExtension,
  ConsumerPaymentPackPenalty,
  ConsumerPaymentPackCreditRefund,
} from '../types';
// @ts-expect-error
import ConsumerPaymentPackCreditRefundListItem from './ConsumerPaymentPackCreditRefundListItem.component';
import { InvoiceStatusEnum } from '#src/libs/invoice/types';

const PENALTY_KIND_BLOCK_CPP = 0;
const PENALTY_KIND_NEGATIVE_ACCOUNT = 1;

type Props = {
  bookings: Array<Booking>;
  paymentPack: PaymentPack;
  bookingLoading: boolean;
  onBookingClick: (b: Booking) => void;
  handleRevert: (booking: Booking) => void;
  discardBookingAttendance: (id: number) => void;
  confirmBookingAttendance: (id: number) => void;
  invoice: Invoice;
  member: Member;
  extensions: Array<ConsumerPaymentPackExtension>;
  extensionsPage: number;
  extensionsCount: number;
  onCreateExtension?: () => void;
  deleteExtension: (id: number) => void;
  extensionsLoading: boolean;
  passExtenxionDeleteLoading: boolean;
  currentBookingPage: number;
  bookingCount: number;
  onBookingRequested: (page: number, page_size: number) => void;
  consumerPack?: ConsumerPaymentPack<PaymentPack>;
  penalties: {
    items: Array<ConsumerPaymentPackPenalty>;
    count: number;
    page: number;
    loading: boolean;
  };
  penaltyPageSize: number;
  onPageRequested: (page: number, paseSize: number) => void;
  onInvoiceClick: (uuid: string) => void;
  consumerPaymentPackCreditRefundList: Array<ConsumerPaymentPackCreditRefund>;
  requestRefund: (
    cpp: ConsumerPaymentPack<PaymentPack>,
    showCredit: boolean,
  ) => void;
  timezone?: string;
  onClickNoShowChip: () => void;
  isRollCallMandatory: boolean;
  onClickWarningIcon: () => void;
  getBookingOffer: (offerId: number) => void;
  onExtensionPageRequested: (page: number) => void;
};

export const ConsumerPaymentPackDetail: React.FC<Props> = (props) => {
  const { t } = useTranslation('paymentPack');
  const classes = useStyles();

  const isPartialRefundButtonDisabled =
    // if pass is already disabled
    props.consumerPack.disabled ||
    // if pass has no credits
    (!props.consumerPack.payment_pack.unlimited &&
      !props.consumerPack.available_credits) ||
    // if original invoice is already refunded (the normal way)
    [InvoiceStatusEnum.REFUNDED, InvoiceStatusEnum.VOIDED].includes(
      props.invoice?.status,
    ) ||
    // if there is already a partial refund on the consumer pack
    (props.consumerPaymentPackCreditRefundList &&
      props.consumerPaymentPackCreditRefundList.length > 0);

  return (
    <div>
      <ObjectLevelPermissionProvider
        requiredPermission={[
          'billing.allowed_actions.readInvoices',
          'billing.allowed_actions.partialRefundAsCredit',
        ]}
      >
        {([
          hasReadInvoicePermission,
          hasRefundAsCreditPermission,
        ]: boolean[]) => (
          <>
            {hasReadInvoicePermission && props.invoice && (
              <React.Fragment>
                <Typography component="h2" variant="h5">
                  {t('details.invoiceTitle')}
                </Typography>
                <Paper className={classes.paper}>
                  <InvoiceListItem
                    invoice={props.invoice}
                    onClick={() => props.onInvoiceClick(props.invoice.uuid)}
                  />
                </Paper>
                {props.consumerPaymentPackCreditRefundList &&
                  props.consumerPaymentPackCreditRefundList.length > 0 && (
                    <div>
                      <Typography component="h2" variant="h5">
                        {t('details.refundTitle')}
                      </Typography>
                      <Paper className={classes.paper}>
                        {props.consumerPaymentPackCreditRefundList.map((cr) => (
                          <ConsumerPaymentPackCreditRefundListItem
                            key={cr.id}
                            dense
                            divider
                            creditRefund={cr}
                            onClick={() => props.onInvoiceClick(cr.invoice)}
                          />
                        ))}
                      </Paper>
                    </div>
                  )}
                {!props.consumerPack.linked_private_consumer_pass && (
                  <div className={classes.rightButton}>
                    {hasRefundAsCreditPermission && (
                      <Button
                        color="primary"
                        disabled={isPartialRefundButtonDisabled}
                        onClick={() =>
                          props.requestRefund(props.consumerPack, true)
                        }
                        variant="contained"
                      >
                        {t('consumerPaymentPack.details.actions.refund')}
                      </Button>
                    )}
                  </div>
                )}
              </React.Fragment>
            )}
          </>
        )}
      </ObjectLevelPermissionProvider>
      <Typography component="h2" variant="h5">
        {t('details.bookingsTitle')}
      </Typography>
      <Paper className={classes.paper}>
        <PaginatedListBase
          itemPerPage={5}
          items={props.bookings}
          listProps={{ disablePadding: true }}
          loading={props.bookingLoading || !props.member}
          nbItems={props.bookingCount}
          onPageRequested={props.onBookingRequested}
          page={props.currentBookingPage}
          renderItem={(b: Booking) => (
            <BookingItemForManagerV2
              key={b.id}
              button
              displayNoShowChip
              showRevertBookingButton
              booking={b}
              confirmBookingAttendance={() =>
                props.confirmBookingAttendance(b.id)
              }
              dateRollCallLastModified={b.date_roll_call_last_modified}
              discardBookingAttendance={() =>
                props.discardBookingAttendance(b.id)
              }
              getBookingOffer={props.getBookingOffer}
              handleRevert={() => props.handleRevert(b)}
              heading="date_start"
              isRollCallMandatory={props.isRollCallMandatory}
              member={props.member}
              noShowChipMessage={t('booking:noShowChip.message')}
              onClick={() => props.onBookingClick(b)}
              onClickNoShowChip={props.onClickNoShowChip}
              onClickWarningIcon={props.onClickWarningIcon}
              paymentPacks={[props.paymentPack]}
            />
          )}
        />
      </Paper>
      {props.penalties.items && props.penalties.items.length > 0 && (
        <>
          <Typography variant="h5">{t('details.penaltyTitle')}</Typography>
          <Paper className={classes.paper}>
            <PaginatedListBase
              itemPerPage={props.penaltyPageSize}
              items={props.penalties.items}
              listProps={{ disablePadding: true }}
              loading={props.penalties.loading}
              nbItems={props.penalties.count}
              onPageRequested={props.onPageRequested}
              page={props.penalties.page}
              renderItem={(penalty: ConsumerPaymentPackPenalty) => (
                <ListItem key={penalty.id} dense divider>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        {DateTime.fromISO(penalty.date_created).toFormat('f')}
                      </Typography>
                    }
                    secondary={
                      <>
                        {penalty.penalty_kind === PENALTY_KIND_BLOCK_CPP &&
                          t('details.penaltyBlock', {
                            nb_days: penalty.days_blocked,
                          })}
                        {penalty.penalty_kind ===
                          PENALTY_KIND_NEGATIVE_ACCOUNT &&
                          t('details.penaltyAccount', {
                            account_value: penalty.account_value,
                            currencyDisplay: getCurrencyDisplay(),
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
          <Typography component="h2" variant="h5">
            {t('details.trackModifiedCreditTitle')}
          </Typography>
          <Paper className={classes.paper}>
            {props.consumerPack.track_modified_credit.map((modifiedCredit) => (
              <ListItem dense divider>
                <ListItemIcon>
                  {modifiedCredit[1] > 0
                    ? `+\u00A0${modifiedCredit[1]}`
                    : modifiedCredit[1]}
                </ListItemIcon>
                <ListItemText
                  primary={`${DateTime.fromSeconds(modifiedCredit[0])
                    .setZone(props.timezone || Settings.defaultZone)
                    .toFormat('D - t')}`}
                />
              </ListItem>
            ))}
          </Paper>
        </div>
      ) : null}
      {props.extensionsLoading ? <LinearProgress /> : null}
      {!!props.extensions && props.extensionsCount > 0 ? (
        <React.Fragment>
          <Typography component="h2" variant="h5">
            {t('details.extensionsTitle')}
          </Typography>
          <Paper className={classes.paper}>
            {props.passExtenxionDeleteLoading && <LinearProgress />}
            <PaginatedListBase
              itemPerPage={CONSUMER_PAYMENT_PACK_EXTENSION_PAGE_SIZE}
              items={props.extensions}
              listProps={{ disablePadding: 'true' }}
              loading={props.extensionsLoading}
              nbItems={props.extensionsCount}
              onPageRequested={props.onExtensionPageRequested}
              page={props.extensionsPage}
              renderItem={(
                extension: ConsumerPaymentPackExtension,
                index: number,
              ) => (
                <ExtensionListItem
                  key={extension.id}
                  extension={extension}
                  onDelete={
                    props.consumerPack &&
                    !props.consumerPack?.dst_consumer_payment_pack
                      ? () => props.deleteExtension(extension.id)
                      : null
                  }
                  showBottomDivider={index !== props.extensions.length - 1}
                />
              )}
            />
          </Paper>
        </React.Fragment>
      ) : null}
      {props.onCreateExtension &&
        !props.consumerPack?.dst_consumer_payment_pack &&
        !!props.consumerPack && (
          <div className={classes.addButtonContainer}>
            <Button
              color="primary"
              onClick={props.onCreateExtension}
              variant="outlined"
            >
              {t('consumerPaymentPack.addExtension')}
            </Button>
          </div>
        )}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
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
}));

export default React.memo(ConsumerPaymentPackDetail);
