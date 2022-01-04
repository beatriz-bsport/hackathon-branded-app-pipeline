// @flow
import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import moment from 'moment-timezone';
import { compose, withStateHandlers } from 'recompose';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import MomentUtils from '@date-io/moment';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import InlineDateTimePicker from 'material-ui-pickers/DateTimePicker/DateTimePickerInline';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Button from '@material-ui/core/Button';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import Divider from '@material-ui/core/Divider';
import MemberMinimalListItem from '../../../member/components/MemberMinimalListItem.component';
import type { PrivateBookingWithRelatedFields } from '../../types';
import RedButton from '../../../../components/button/RedButton.component';
import RedChip from '../../../../components/chip/RedChip.component';
import CoachListItem from '../../../associated-coach/components/CoachListItem.component';
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';
import type { Invoice } from '#libs/invoice/types';
import type { PaymentMethod } from '#libs/payment/types';
import InvoiceTable from '#libs/invoice/components/InvoiceTable.component';
import PaymentDialog from '#libs/payment/components/PaymentDialog.component';

type Props = {
  private_booking: PrivateBookingWithRelatedFields,
  goToMember: ?(id: number) => void,
  onDelete: () => void,
  onRestore: () => void,
  isUpdateTimeFormOpen: boolean,
  loading: boolean,
  setUpdatedTime: (any) => void,
  closeUpdateTimeForm: () => void,
  updatedTime: ?string,
  goToCoachCalendar: (coachId: number) => void,
  updateTime: (string, OptionCallback) => void,
  setUpdateTimeForm: () => void,
  setIsUpdateCoachFormOpen: (boolean) => void,
  showVaccinationStatus: boolean,
  fetchInvoiceListUnpaid: (memberId: number) => void,
  unpaidInvoiceList: Array<Invoice>,
  companyId: number,
  snackbarSuccess: (msg: string) => void,
  fetchMemberPaymentMethod: (memberId: number) => void,
  fetchMember: (memberId: number) => void,
  availablePaymentMethodList: Array<PaymentMethod>,
  invoiceToBill: Invoice,
  setInvoiceToBill: (invoice: ?Invoice) => void,
  clientSecretLoading: boolean,
  clientSecret: ?string,
  paymentGroupId: ?number,
  paymentGroupPriceCts: ?number,
  requestClientSecret: (paymengEngine) => void,
  createMemberProgram: (data: any, options?: any) => void,
  programList: Array<PerformanceTrackingProgram>,
  updateMemberMetricValue: (data: any, options: OptionCallback) => void,
};

export const PrivateBookingCard = (props: Props) => {
  const { private_booking, loading } = props;
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();

  React.useEffect(() => {
    if (private_booking.member && private_booking.member.id) {
      props.fetchInvoiceListUnpaid(private_booking.member.id);
      props.fetchMemberPaymentMethod(private_booking.member.id);
      props.fetchMember(private_booking.member.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [private_booking?.member?.id]);
  if (
    loading ||
    !private_booking.private_slot ||
    !private_booking.private_service ||
    !private_booking.member
  ) {
    return (
      <div className={classes.container}>
        <CircularProgress />
      </div>
    );
  }
  if (props.isUpdateTimeFormOpen) {
    return (
      <div className={classes.container}>
        <DialogTitle>{t('privateBooking.updateTime.title')}</DialogTitle>
        <DialogContent>
          <MuiPickersUtilsProvider
            utils={MomentUtils}
            moment={moment}
            locale={moment.locale()}
          >
            <InlineDateTimePicker
              keyboard
              ampm={false}
              value={props.updatedTime || props.private_booking.date_start}
              onChange={props.setUpdatedTime}
              onError={console.error}
              format="YYYY/MM/DD HH:mm"
            />
          </MuiPickersUtilsProvider>
          <Typography
            className={classes.updatedTimeExplain}
            color="textSecondary"
          >
            {t('privateBooking.updateTime.explainEmail')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeUpdateTimeForm}>
            {t('privateBooking.updateTime.cancel')}
          </Button>
          <Button
            color="primary"
            onClick={() =>
              props.updateTime(props.updatedTime, {
                onSuccess: () => props.closeUpdateTimeForm(),
              })
            }
          >
            {t('privateBooking.updateTime.submit')}
          </Button>
        </DialogActions>
      </div>
    );
  }
  return (
    <>
      <div className={classes.container}>
        <div className={classes.header}>
          {props.private_booking.booking_status_code !==
          BOOKING_STATUS_OK.id ? (
            <div className={classes.firstRow}>
              <Typography variant="h6" color="error">
                {private_booking.date_canceled
                  ? t('privateBooking.isCancelledDate', {
                      date: moment(private_booking.date_canceled).format('L'),
                      time: moment(private_booking.date_canceled).format('LT'),
                    })
                  : t('privateBooking.isCancelled')}
              </Typography>
              <div className={classes.chipContainer}>
                {props.private_booking.was_refunded ? (
                  <Chip
                    size="small"
                    color="primary"
                    label={
                      <Typography variant="body2" color="white">
                        {`${t('privateBooking.isRefunded')}`}
                      </Typography>
                    }
                  />
                ) : (
                  <RedChip
                    size="small"
                    color="primary"
                    label={
                      <Typography variant="body2" color="white">
                        {`${t('privateBooking.notRefunded')}`}
                      </Typography>
                    }
                  />
                )}
              </div>
            </div>
          ) : null}
          <Typography variant="h5">
            {private_booking.private_slot.name +
              (private_booking.first_in_company ? ' ★' : '')}
          </Typography>
        </div>
        {!!private_booking.address && (
          <ListItem dense>
            <ListItemIcon>
              <LocationOnIcon />
            </ListItemIcon>
            <ListItemText primary={private_booking.address} />
          </ListItem>
        )}
        <ListItem dense>
          <ListItemIcon>
            <AccessTimeIcon />
          </ListItemIcon>
          <ListItemText
            primary={`${moment(private_booking.date_start).format(
              'HH:mm',
            )} - ${moment(private_booking.date_end).format('HH:mm')}`}
          />
          <ListItemSecondaryAction>
            <IconButton onClick={props.setUpdateTimeForm}>
              <EditIcon color="primary" />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
        <MemberMinimalListItem
          updateMemberMetricValue={props.updateMemberMetricValue}
          createMemberProgram={props.createMemberProgram}
          programList={props.programList}
          member={private_booking.member}
          onClick={() => props.goToMember(private_booking.member.id)}
          showVaccinationStatus={props.showVaccinationStatus}
          showMemberProgram
        />
        {private_booking.coach ? (
          <CoachListItem
            onCoachSelected={() =>
              props.goToCoachCalendar(private_booking.coach.id)
            }
            noEdit
            coach={private_booking.coach}
            onEditCoach={() => props.setIsUpdateCoachFormOpen(true)}
          />
        ) : null}
        {private_booking.establishment ? (
          <EstablishmentListItem
            establishment={private_booking.establishment}
          />
        ) : null}
        {props.unpaidInvoiceList && props.unpaidInvoiceList.length ? (
          <>
            <Typography className={classes.bookingsHeader} variant="h6">
              {t('translation:offer.unpaidInvoices')}
            </Typography>
            <div className={classes.invoiceTable}>
              <Divider />
              <InvoiceTable
                hideMemberName
                compactMode
                showOpenInvoiceNested
                hidePagination
                onBill={props.setInvoiceToBill}
                invoiceList={props.unpaidInvoiceList}
                snackbarSuccess={props.snackbarSuccess}
                companyId={props.companyId}
              />
            </div>
          </>
        ) : null}
      </div>
      {private_booking.coach ? (
        <CoachListItem
          onCoachSelected={() =>
            props.goToCoachCalendar(private_booking.coach.id)
          }
          noEdit
          coach={private_booking.coach}
          onEditCoach={() => props.setIsUpdateCoachFormOpen(true)}
        />
      ) : null}
      {private_booking.establishment ? (
        <EstablishmentListItem establishment={private_booking.establishment} />
      ) : null}
      {props.onDelete &&
      props.private_booking.booking_status_code === BOOKING_STATUS_OK.id ? (
        <div className={classes.buttonContainer}>
          <RedButton onClick={props.onDelete}>
            {t('privateBooking.discard')}
          </RedButton>
        </div>
      ) : (
        <div className={classes.buttonContainer}>
          <Button onClick={props.onRestore}>
            {t('privateBooking.restore')}
          </Button>
          <RedButton onClick={props.onDelete}>
            {t('privateBooking.hardDelete')}
          </RedButton>
        </div>
      )}
      {!!props.invoiceToBill && !!props.invoiceToBill.member && (
        <PaymentDialog
          termsAndConditionsAccepted
          memberId={private_booking.member.id}
          onError={() => {}}
          onSuccess={(callback) => {
            setTimeout(() => {
              props.fetchInvoiceListUnpaid(private_booking.member.id);
              props.setInvoiceToBill(null);
              if (typeof callback === 'function') callback();
            }, 3000);
          }}
          requestClientSecret={props.requestClientSecret}
          paymentGroupId={props.paymentGroupId}
          paymentGroupPriceCts={props.paymentGroupPriceCts}
          clientSecret={props.clientSecretLoading ? null : props.clientSecret}
          clientSecretLoading={props.clientSecretLoading}
          amountToPay={parseFloat(
            props.invoiceToBill.amount_due_cts -
              props.invoiceToBill.amount_paid_cts,
          ).toFixed(2)}
          onCancel={() => props.setInvoiceToBill(null)}
          availablePaymentMethodList={props.availablePaymentMethodList}
          defaultUserName={props.invoiceToBill.member.name}
          defaultUserEmail={props.invoiceToBill.member.email}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    width: '100%',
  },
  header: {
    marginBottom: theme.spacing(2),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
  },
  updatedTimeExplain: {
    marginTop: theme.spacing(1),
  },
  firstRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chipContainer: {
    paddingLeft: theme.spacing(3),
  },
  invoiceTable: {
    maxHeight: '300px',
    overflow: 'auto',
  },
}));

export default compose(
  memo,
  withStateHandlers(
    { isUpdateTimeFormOpen: false, updatedTime: null },
    {
      setUpdatedTime: () => (updatedTime) => ({ updatedTime }),
      setUpdateTimeForm: () => () => ({ isUpdateTimeFormOpen: true }),
      closeUpdateTimeForm: () => () => ({ isUpdateTimeFormOpen: false }),
      updateTimeAndClose:
        (_, { updateTime }) =>
        (...args) => {
          updateTime(...args);
          return { isUpdateTimeFormOpen: false };
        },
    },
  ),
)(PrivateBookingCard);
