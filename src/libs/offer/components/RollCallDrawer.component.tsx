import React from 'react';
import { Typography, makeStyles, Button, Divider } from '@material-ui/core';
import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import { Alert } from '@material-ui/lab';
import { PeopleAlt } from '@material-ui/icons';
import chroma from 'chroma-js';
import GenericResponsiveDrawer from '#components/genericDrawer/GenericResponsiveDrawer.component';
import BookingTable from '#libs/booking/components/BookingTable.component';
import { Member } from '#libs/member/types';
import { Tag, TagGroup } from '#libs/tag/types';
import ValidationRollCallText from './ValidationRollCallText.component';
import { RollCallState } from '../constants';

export type Props = {
  open: boolean;
  offerName: string;
  date: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  bookingTableLoading: boolean;
  confirmBookingAttendance: (bookingId: number) => void;
  discardBookingAttendance: (bookingId: number) => void;
  members: Array<Member<Tag<TagGroup>>>;
  bookings: Array<Object>;
  validationRollCallState: RollCallState;
  lastValidatedRollCallDate?: string;
};

export const RollCallDrawer: React.FC<Props> = (props) => {
  const { t } = useTranslation(['offer', 'common']);
  const classes = useStyles();
  return (
    <GenericResponsiveDrawer
      open={props.open}
      title={t('rollCall.drawer.rollCall')}
      subtitle={`${props.offerName} - ${moment(props.date).format('LLL')}`}
      onClose={props.onClose}
    >
      <div className={classes.drawer}>
        <div className={classes.info}>
          <Alert severity="info" className={classes.alert}>
            {t('rollCall.drawer.info')}
          </Alert>
        </div>
        <div className={classes.row}>
          <PeopleAlt className={classes.peopleIcon} />
          <Typography variant="h6" className={classes.listTitle}>
            {t('rollCall.drawer.listMembers')}
          </Typography>
        </div>
        <div className={classes.list}>
          <BookingTable
            loading={props.bookingTableLoading}
            bookings={props.bookings}
            members={props.members}
            confirmBookingAttendance={props.confirmBookingAttendance}
            discardBookingAttendance={props.discardBookingAttendance}
          />
        </div>
        <Divider />
        <div className={classes.bottomRow}>
          <ValidationRollCallText
            validationRollCallState={props.validationRollCallState}
            isSeveralRollCallsPage={false}
            lastValidatedRollCallDate={props.lastValidatedRollCallDate}
          />
          <div>
            <Button onClick={props.onClose}>{t('cancel')}</Button>
            <Button
              onClick={props.onConfirm}
              variant="contained"
              color="primary"
              disabled={
                props.isLoading ||
                props.validationRollCallState === RollCallState.VALIDATED
              }
            >
              {t('confirm')}
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
