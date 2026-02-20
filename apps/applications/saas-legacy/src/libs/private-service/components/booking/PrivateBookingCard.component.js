// @flow
import React, { memo, useCallback, useEffect } from 'react';
import { compose, withStateHandlers } from 'recompose';
import { useTranslation } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { DateTime, Settings } from 'luxon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  InlineDateTimePicker,
  MuiPickersUtilsProvider,
} from 'material-ui-pickers';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Button from '@material-ui/core/Button';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code.js';
import Divider from '@material-ui/core/Divider';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';
import Hidden from '@material-ui/core/Hidden';

import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { LocalizedLuxonUtils } from '#src/i18n/utils/luxon-picker-utils';

import type { Invoice } from '#src/libs/invoice/types';
import type { PaymentMethod } from '#src/libs/payment/types';
import InvoiceTable from '#src/libs/invoice/components/InvoiceTable.component';
import PaymentDialog from '#src/libs/payment/components/PaymentDialog.component';
import type { ConsumerGiftcard, Giftcard } from '#src/libs/giftcard/types';
import type { PerformanceTrackingProgram } from '#src/libs/performance-tracking/types';
import ObjectLevelPermissionProvider from '#src/libs/role/permission-utils/ObjectLevelPermissionProvider.component';
import ObjectLevelPermissionWrapper from '#src/libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import SessionNotePad from '#src/libs/offer/components/SessionNotePad';
import { TEMPORARY_AMOUNT_TO_FORCE_INTERNAL_PAYMENT_CTS } from '#src/libs/invoice/constants';
import { getPrivateBookingStatusCodeForCalendar } from '../../../booking/utils';
import type { OptionCallback } from '../../../../state/types';
import ResourceAllocationConfirmDialog from '../slot-searcher/ResourceAllocationConfirmDialog.component';
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';
import CoachListItem from '../../../associated-coach/components/CoachListItem.component';
import RedChip from '../../../../components/chip/RedChip.component';
import RedButton from '../../../../components/button/RedButton.component';
import { useGetPrivateConsumerPass } from '../hooks';
import type { PrivateBookingWithRelatedFields } from '../../types';
import MemberMinimalListItem from '../../../member/components/MemberMinimalListItem.component';

type Props = {
  private_booking: PrivateBookingWithRelatedFields,
  goToMember?: (id: number) => void,
  onDelete: () => void,
  onRestore: () => void,
  onSetUnpaid?: () => void,
  setPrivateBookingUnpaidLoading?: boolean,
  isUpdateTimeFormOpen: boolean,
  loading: boolean,
  setUpdatedTime: (updatedTime: DateTime | null) => void,
  closeUpdateTimeForm: () => void,
  updatedTime: DateTime | null,
  goToCoachCalendar: (coachId: number) => void,
  updateTime: (string, OptionCallback) => void,
  setUpdateTimeForm: () => void,
  setIsUpdateCoachFormOpen: (boolean) => void,
  fetchInvoiceListUnpaid: (memberId: number) => void,
  unpaidInvoiceList: Array<Invoice>,
  companyId: number,
  stripePaymentElementConfig: StripePaymentElementConfig,
  snackbarSuccess: (msg: string) => void,
  fetchMemberPaymentMethod: (memberId: number) => void,
  availablePaymentMethodList: Array<PaymentMethod>,
  invoiceToBill: Invoice,
  setInvoiceToBill: (invoice?: Invoice) => void,
  clientSecretLoading: boolean,
  clientSecret?: string,
  paymentGroupId?: number,
  paymentGroupPriceCts?: number,
  requestClientSecret: (paymengEngine) => void,
  createMemberProgram: (data: any, options?: any) => void,
  programList: Array<PerformanceTrackingProgram>,
  updateMemberMetricValue: (data: any, options: OptionCallback) => void,
  fetchPerformanceTrackingData: (member: number) => void,
  programDataLoading: boolean,
  consumerGiftcardList: Array<ConsumerGiftcard<Giftcard>>,
  applyGiftcardOnInvoice: (
    invoiceUuid: string,
    consumergiftCardId: number,
    amount: number,
    options?: OptionCallback,
  ) => void,
  fetchConsumerGiftcardReceivedList: (memberId: number) => void,
  isCoach: boolean,
  onlinePaymentEnabled?: boolean,
  onClose: () => void,
  cardBillingDetailsMandatory: boolean,
  editInternalNote: (
    _: {
      internal_note: string,
    },
    options?: OptionCallback,
  ) => void,
  memberBulkLoading?: boolean,
};

export const PrivateBookingCard = (props: Props) => {
  const { private_booking, loading } = props;
  const { t } = useTranslation(['privateService', 'member']);
  const classes = useStyles();
  React.useEffect(() => {
    if (private_booking.member && private_booking.member.id) {
      props.fetchInvoiceListUnpaid(private_booking.member.id);
      props.fetchMemberPaymentMethod(private_booking.member.id);
      props.fetchConsumerGiftcardReceivedList(private_booking.member.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [private_booking?.member?.id]);

  const [openAllocationModal, setOpenAllocationModal] = React.useState(false);
  const [unpaidInvoicesSectionOpened, setUnpaidInvoicesSectionOpened] =
    React.useState(true);

  const [{ value: privateConsumerPass }, fetchPrivateConsumerPass] =
    useGetPrivateConsumerPass();

  useEffect(() => {
    if (private_booking?.private_consumer_pass) {
      fetchPrivateConsumerPass(private_booking.private_consumer_pass);
    }
  }, [private_booking?.private_consumer_pass, fetchPrivateConsumerPass]);

  const applyGiftcardOnInvoice = (
    invoiceUuid: string,
    consumerGiftCardId: number,
    amount: number,
    options: OptionCallback,
  ) => {
    return props.applyGiftcardOnInvoice(
      invoiceUuid,
      consumerGiftCardId,
      amount,
      {
        onSuccess: () => {
          if (options && options.onSuccess) options.onSuccess();
          props.fetchInvoiceListUnpaid(private_booking.member.id);
          props.fetchConsumerGiftcardReceivedList(private_booking.member.id);
        },
        onError: () => {
          if (options && options.onError) options.onError();
          props.fetchInvoiceListUnpaid(private_booking.member.id);
          props.fetchConsumerGiftcardReceivedList(private_booking.member.id);
        },
      },
    );
  };

  const handleSubmit = () => setOpenAllocationModal(true);

  const onCancel = () => setOpenAllocationModal(false);

  const onSubmit = () =>
    props.updateTime(props.updatedTime, {
      onSuccess: () => props.closeUpdateTimeForm(),
      onError: () => {
        props.closeUpdateTimeForm();
        setOpenAllocationModal(false);
      },
    });

  const handleOpenUnpaidInvoicesSection = useCallback(
    () => setUnpaidInvoicesSectionOpened((previousValue) => !previousValue),
    [setUnpaidInvoicesSectionOpened],
  );

  const canBeConvertedToUnpaid =
    props.onSetUnpaid &&
    !props.private_booking.is_unpaid &&
    DateTime.fromISO(props.private_booking.date_start) > DateTime.now();

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
        {openAllocationModal && (
          <ResourceAllocationConfirmDialog
            dateStart={props.updatedTime?.toISO()}
            onCancel={onCancel}
            onSubmit={onSubmit}
            privateBooking={private_booking}
          />
        )}
        <DialogTitle>{t('privateBooking.updateTime.title')}</DialogTitle>
        <DialogContent>
          <MuiPickersUtilsProvider
            locale={Settings.defaultLocale}
            utils={LocalizedLuxonUtils}
          >
            <InlineDateTimePicker
              keyboard
              ampm={false}
              format="y/MM/dd HH:mm"
              onChange={props.setUpdatedTime}
              onError={console.error}
              value={
                props.updatedTime ||
                DateTime.fromISO(props.private_booking.date_start)
              }
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
          <Button color="primary" onClick={handleSubmit}>
            {t('privateBooking.updateTime.submit')}
          </Button>
        </DialogActions>
      </div>
    );
  }
  return (
    <>
      <ObjectLevelPermissionProvider
        requiredPermission={[
          'reservation.privateBooking.allowed_actions.edit',
          'billing.allowed_actions.readInvoices',
          'session.privateSlot.allowed_actions.viewNotes',
        ]}
      >
        {([
          hasEditPrivateBookingPermission,
          hasReadInvoicePermission,
          hasEditNotesPermission,
        ]) => (
          <div className={classes.container}>
            <div className={classes.header}>
              <div className={classes.headerLeft}>
                {props.private_booking.booking_status_code !==
                BOOKING_STATUS_OK.id ? (
                  <div className={classes.firstRow}>
                    <Typography color="error" variant="h6">
                      {t(
                        ...getPrivateBookingStatusCodeForCalendar(
                          props.private_booking,
                        ),
                      )}
                    </Typography>
                    <div className={classes.chipContainer}>
                      {props.private_booking.was_refunded ? (
                        <Chip
                          color="primary"
                          label={
                            <Typography color="white" variant="body2">
                              {`${t('privateBooking.isRefunded')}`}
                            </Typography>
                          }
                          size="small"
                        />
                      ) : (
                        <RedChip
                          color="primary"
                          label={
                            <Typography color="white" variant="body2">
                              {`${t('privateBooking.notRefunded')}`}
                            </Typography>
                          }
                          size="small"
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
              <Hidden mdUp>
                <IconButton onClick={props.onClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Hidden>
            </div>
            {props.private_booking.is_unpaid && (
              <ListItem dense>
                <ListItemIcon>
                  <WarningIcon color="error" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography color="error">
                      {t('privateBooking.bookingIsUnpaid')}
                    </Typography>
                  }
                />
              </ListItem>
            )}
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
                primary={`${DateTime.fromISO(
                  private_booking.date_start,
                ).toFormat('HH:mm')} - ${DateTime.fromISO(
                  private_booking.date_end,
                ).toFormat('HH:mm')}`}
              />
              <ListItemSecondaryAction>
                {props.updateTime && hasEditPrivateBookingPermission && (
                  <IconButton onClick={props.setUpdateTimeForm}>
                    <EditIcon color="primary" />
                  </IconButton>
                )}
              </ListItemSecondaryAction>
            </ListItem>
            <ObjectLevelPermissionProvider requiredPermission="reservation.privateBooking.allowed_actions.editPerformance">
              {(hasEditPerformancePermission) => (
                <MemberMinimalListItem
                  bottomCredit
                  createMemberProgram={props.createMemberProgram}
                  fetchPerformanceTrackingData={
                    props.fetchPerformanceTrackingData
                  }
                  firstPrivateBooking={private_booking.first_in_company}
                  isPreventUpdateMetricValue={!hasEditPerformancePermission}
                  member={private_booking.member}
                  memberLoading={props.memberBulkLoading}
                  onClick={
                    !props.memberBulkLoading && !!props.goToMember
                      ? () => props.goToMember(private_booking.member.id)
                      : null
                  }
                  privateConsumerPass={privateConsumerPass}
                  programDataLoading={props.programDataLoading}
                  programList={props.programList}
                  updateMemberMetricValue={props.updateMemberMetricValue}
                />
              )}
            </ObjectLevelPermissionProvider>
            {private_booking.coach && !props.isCoach ? (
              <CoachListItem
                noEdit
                coach={private_booking.coach}
                hasEditPermission={hasEditPrivateBookingPermission}
                onCoachSelected={() =>
                  props.goToCoachCalendar(private_booking.coach.id)
                }
                onEditCoach={() => props.setIsUpdateCoachFormOpen(true)}
              />
            ) : null}
            {private_booking.establishment ? (
              <EstablishmentListItem
                establishment={private_booking.establishment}
              />
            ) : null}
            <Divider className={classes.divider} />
            <div className={classes.notePadContainer}>
              <SessionNotePad
                noDivider
                initialValue={props.private_booking?.internal_note}
                onSubmit={props.editInternalNote}
                permissionType="privateSlot"
              />
            </div>
            {hasEditNotesPermission && <Divider className={classes.divider} />}
            {hasReadInvoicePermission &&
            props.unpaidInvoiceList &&
            props.unpaidInvoiceList.length ? (
              <div className={classes.unpaidInvoicesContainer}>
                <ButtonBase
                  className={classes.unpaidInvoicesTitle}
                  onClick={handleOpenUnpaidInvoicesSection}
                >
                  <Typography className={classes.bookingsHeader} variant="h6">
                    {t('member:unpaidInvoiceTitle', {
                      count: props.unpaidInvoiceList.length,
                    })}
                  </Typography>
                  {unpaidInvoicesSectionOpened ? (
                    <KeyboardArrowUp />
                  ) : (
                    <KeyboardArrowDown />
                  )}
                </ButtonBase>
                <Collapse in={unpaidInvoicesSectionOpened}>
                  <InvoiceTable
                    compactMode
                    hideMemberName
                    hidePagination
                    showOpenInvoiceNested
                    applyGiftcardOnInvoice={applyGiftcardOnInvoice}
                    companyId={props.companyId}
                    consumerGiftcardList={props.consumerGiftcardList}
                    invoiceList={props.unpaidInvoiceList}
                    onBill={props.setInvoiceToBill}
                    snackbarSuccess={props.snackbarSuccess}
                  />
                </Collapse>
              </div>
            ) : null}
            <Divider className={classes.divider} />
          </div>
        )}
      </ObjectLevelPermissionProvider>

      {props.onDelete &&
      props.private_booking.booking_status_code === BOOKING_STATUS_OK.id ? (
        <div className={classes.buttonContainer}>
          <ObjectLevelPermissionWrapper
            forcedBehavior="hidden"
            requiredPermission="reservation.privateBooking.allowed_actions.cancel"
          >
            <RedButton onClick={props.onDelete} variant="outlined">
              {t('privateBooking.discard')}
            </RedButton>
          </ObjectLevelPermissionWrapper>
          {canBeConvertedToUnpaid && (
            <ObjectLevelPermissionWrapper
              forcedBehavior="hidden"
              requiredPermission="reservation.privateBooking.allowed_actions.edit"
            >
              <Button
                disabled={props.setPrivateBookingUnpaidLoading}
                onClick={props.onSetUnpaid}
                style={{ marginLeft: 8 }}
                variant="outlined"
              >
                {t('privateBooking.setUnpaid.button')}
              </Button>
            </ObjectLevelPermissionWrapper>
          )}
        </div>
      ) : (
        <div className={classes.buttonContainer}>
          {props.onRestore && (
            <Button onClick={props.onRestore}>
              {t('privateBooking.restore')}
            </Button>
          )}
          {props.onDelete && (
            <RedButton onClick={props.onDelete} variant="outlined">
              {t('privateBooking.hardDelete')}
            </RedButton>
          )}
        </div>
      )}
      {!!props.invoiceToBill && !!props.invoiceToBill.member && (
        <PaymentDialog
          termsAndConditionsAccepted
          amountToPay={parseFloat(
            props.invoiceToBill.amount_due_cts -
              props.invoiceToBill.amount_paid_cts,
          ).toFixed(2)}
          availablePaymentMethodList={props.availablePaymentMethodList}
          cardBillingDetailsMandatory={props.cardBillingDetailsMandatory}
          clientSecret={props.clientSecretLoading ? null : props.clientSecret}
          clientSecretLoading={props.clientSecretLoading}
          companyId={props.companyId}
          defaultUserEmail={props.invoiceToBill.member.email}
          defaultUserName={props.invoiceToBill.member.name}
          memberId={private_booking.member.id}
          onCancel={() => props.setInvoiceToBill(null)}
          onError={() => {}}
          onlinePaymentEnabled={props.onlinePaymentEnabled}
          onlyInternal={
            !props.onlinePaymentEnabled ||
            props.invoiceToBill.amount_due_cts <
              TEMPORARY_AMOUNT_TO_FORCE_INTERNAL_PAYMENT_CTS
          }
          onSuccess={(callback) => {
            setTimeout(() => {
              props.fetchInvoiceListUnpaid(private_booking.member.id);
              props.setInvoiceToBill(null);
              if (typeof callback === 'function') callback();
            }, 3000);
          }}
          paymentGroupId={props.paymentGroupId}
          paymentGroupPriceCts={props.paymentGroupPriceCts}
          requestClientSecret={props.requestClientSecret}
          stripePaymentElementConfig={props.stripePaymentElementConfig}
        />
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
    paddingBottom: theme.spacing(0),
    width: '100%',
  },
  header: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  closeButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    padding: theme.spacing(3),
    paddingTop: theme.spacing(5),
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
  divider: {
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
  },
  unpaidInvoicesContainer: {
    padding: theme.spacing(3),
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
  },
  unpaidInvoicesTitle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  notePadContainer: {
    marginRight: theme.spacing(-1),
    marginLeft: theme.spacing(-1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

export default compose(
  memo,
  withStateHandlers(
    { isUpdateTimeFormOpen: false, updatedTime: null },
    {
      setUpdatedTime: () => (updatedTime) => ({ updatedTime }),
      setUpdateTimeForm: () => () => ({ isUpdateTimeFormOpen: true }),
      closeUpdateTimeForm: () => () => {
        return { isUpdateTimeFormOpen: false, updatedTime: null };
      },
      updateTimeAndClose:
        (_, { updateTime }) =>
        (...args) => {
          updateTime(...args);
          return { isUpdateTimeFormOpen: false };
        },
    },
  ),
)(PrivateBookingCard);
