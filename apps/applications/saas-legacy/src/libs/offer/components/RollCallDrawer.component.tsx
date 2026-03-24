import React, { useCallback, useEffect, useState } from 'react';
import { Typography, makeStyles, Button, Divider } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Alert } from '@material-ui/lab';
import { PeopleAlt } from '@material-ui/icons';
import chroma from 'chroma-js';
import GenericResponsiveDrawer from '#src/components/genericDrawer/GenericResponsiveDrawer.component';
// @ts-expect-error
import BookingTable from '#src/libs/booking/components/BookingTable.component';
import { Member } from '#src/libs/member/types';
import { Tag, TagGroup } from '#src/libs/tag/types';
import { Offer } from '#src/libs/offer/types';
import { analyticsClientB2B } from '#src/components/analytics/mixpanel';
import ValidationRollCallText from './ValidationRollCallText.component';
import ConfirmationRollCallDialog from './ConfirmationRollCallDialog.component';
import { OptionCallback } from '../../../state/types';
import { formatAsDatetimeAdapted } from '../../../utils/datetime';

export type Props = {
  open: boolean;
  offer?: Offer;
  onClose: () => void;
  bookingTableLoading: boolean;
  confirmBookingAttendance: (bookingId: number) => void;
  discardBookingAttendance: (bookingId: number) => void;
  members: Array<Member<Tag<TagGroup>>>;
  bookings: Array<Object>;
  fetchBookings: (offerId: number) => void;
  postRollCall: (offerId: number, options?: OptionCallback) => void;
  fetchOffer: (offerId: number, options?: OptionCallback) => void;
  rollCallLoading: boolean;
  isRollCallMandatory: boolean;
};

export const RollCallDrawer: React.FC<Props> = (props) => {
  const { t } = useTranslation(['offer', 'common']);
  const classes = useStyles();
  const { postRollCall, fetchOffer, fetchBookings, offer } = props;
  const [
    confirmationRollCallDialogIsOpen,
    setConfirmationRollCallDialogIsOpen,
  ] = useState(false);

  useEffect(() => {
    if (props.open) {
      analyticsClientB2B.addSuperProperties({
        page_source: 'roll_call_drawer',
      });
      return () => {
        analyticsClientB2B.removeSuperProperties(['page_source']);
      };
    } else {
      analyticsClientB2B.removeSuperProperties(['page_source']);
    }
  }, [props.open]);
  const openConfirmationRollCallDialog = useCallback(() => {
    setConfirmationRollCallDialogIsOpen(true);
  }, []);
  const closeConfirmationRollCallDialog = useCallback(() => {
    setConfirmationRollCallDialogIsOpen(false);
  }, []);
  const validateRollCall = useCallback(
    (options?: OptionCallback) => {
      postRollCall(offer?.id, {
        onSuccess: () => {
          fetchOffer(offer?.id, {
            onSuccess: () => fetchBookings(offer.id),
          });
          options?.onSuccess();
        },
      });
    },
    [postRollCall, fetchOffer, fetchBookings, offer],
  );
  return (
    <GenericResponsiveDrawer
      onClose={props.onClose}
      open={props.open}
      subtitle={`${props.offer?.name} - ${formatAsDatetimeAdapted(
        props.offer?.date_start,
        'DDD t',
      )}`}
      title={t('rollCall.drawer.rollCall')}
    >
      <ConfirmationRollCallDialog
        isLoading={props.rollCallLoading}
        nbRollCallsLeftToValidate={1}
        onCancel={closeConfirmationRollCallDialog}
        onConfirm={validateRollCall}
        open={confirmationRollCallDialogIsOpen}
      />
      <div className={classes.drawer}>
        <div className={classes.info}>
          <Alert className={classes.alert} severity="info">
            {t('rollCall.drawer.info')}
          </Alert>
        </div>
        <div className={classes.row}>
          <PeopleAlt className={classes.peopleIcon} />
          <Typography className={classes.listTitle} variant="h6">
            {t('rollCall.drawer.listMembers')}
          </Typography>
        </div>
        <div className={classes.list}>
          <BookingTable
            bookings={props.bookings}
            confirmBookingAttendance={props.confirmBookingAttendance}
            dateRollCallLastModified={props.offer?.date_roll_call_last_modified}
            discardBookingAttendance={props.discardBookingAttendance}
            isRollCallMandatory={props.isRollCallMandatory}
            loading={props.bookingTableLoading}
            members={props.members}
          />
        </div>
        <Divider />
        <div className={classes.bottomRow}>
          <ValidationRollCallText
            lastValidatedRollCallDate={
              props.offer?.date_roll_call_last_modified
            }
            nbRollCallsLeftToValidate={
              props.offer?.roll_call_needs_validation ? 1 : 0
            }
          />
          <div>
            <Button onClick={props.onClose}>{t('common:cancel')}</Button>
            <Button
              color="primary"
              disabled={
                // @ts-expect-error
                props.isLoading || !props.offer?.roll_call_needs_validation
              }
              onClick={openConfirmationRollCallDialog}
              variant="contained"
            >
              {t('common:confirm')}
            </Button>
          </div>
        </div>
      </div>
    </GenericResponsiveDrawer>
  );
};

const useStyles = makeStyles((theme) => ({
  drawer: { height: '100%', display: 'flex', flexDirection: 'column' },
  info: {
    marginBottom: theme.spacing(2),
  },
  alert: {
    alignItems: 'center',
  },
  listTitle: {
    marginLeft: theme.spacing(2),
    fontWeight: 'bold',
  },
  peopleIcon: { color: chroma(theme.palette.text.secondary).alpha(0.6).hex() },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    marginTop: theme.spacing(2),
    flex: '1',
  },
  bottomRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(4),
  },
}));
export default RollCallDrawer;
