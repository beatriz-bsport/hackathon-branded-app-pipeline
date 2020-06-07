// @flow
import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { compose, withStateHandlers } from 'recompose';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import InlineDateTimePicker from 'material-ui-pickers/DateTimePicker/DateTimePickerInline';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Button from '@material-ui/core/Button';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { BOOKING_STATUS_OK } from '@bsport/common/lib/master-data/booking_status_code';

import MemberListItem from '../../../member/components/MemberMinimalListItem.component';
import type { PrivateBookingWithRelatedFields } from '../../types';
import RedButton from '../../../../components/button/RedButton.component';

import CoachListItem from '../../../associated-coach/components/CoachListItem.component';
import EstablishmentListItem from '../../../establishment/components/EstablishmentListItem.component';

type Props = {
  private_booking: PrivateBookingWithRelatedFields,
  goToMember: ?(id: number) => void,
  onDelete: () => void,
  isUpdateTimeFormOpen: boolean,
  loading: boolean,
  setUpdatedTime: (any) => void,
  closeUpdateTimeForm: () => void,
  updatedTime: ?string,
  goToCoachCalendar: (coachId: number) => void,
  updateTime: (string, OptionCallback) => void,
  setUpdateTimeForm: () => void,
};
export const PrivateBookingCard = (props: Props) => {
  const { private_booking, loading } = props;
  const { t } = useTranslation(['privateService']);
  const classes = useStyles();

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
          <InlineDateTimePicker
            keyboard
            ampm={false}
            value={props.updatedTime || props.private_booking.date_start}
            onChange={props.setUpdatedTime}
            onError={console.error}
            format="YYYY/MM/DD HH:mm"
          />
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
    <div className={classes.container}>
      <div className={classes.header}>
        {props.private_booking.booking_status_code !== BOOKING_STATUS_OK.id ? (
          <Typography variant="h6" color="error">
            {t('privateBooking.isCancelled')}
          </Typography>
        ) : null}
        <Typography variant="h4">
          {private_booking.private_slot.private_service.name}
        </Typography>
        <Typography variant="h5">
          {private_booking.private_slot.name}
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
      </ListItem>

      <MemberListItem
        member={private_booking.member}
        onClick={() => props.goToMember(private_booking.member.id)}
      />
      {private_booking.coach ? (
        <CoachListItem
          onCoachSelected={() =>
            props.goToCoachCalendar(private_booking.coach.id)
          }
          noEdit
          coach={private_booking.coach}
        />
      ) : null}
      {private_booking.establishment ? (
        <EstablishmentListItem establishment={private_booking.establishment} />
      ) : null}
      {props.onDelete &&
      props.private_booking.booking_status_code === BOOKING_STATUS_OK.id ? (
        <div className={classes.buttonContainer}>
          {!!props.updateTime && (
            <Button onClick={props.setUpdateTimeForm} color="primary">
              {t('privateBooking.editTime')}
            </Button>
          )}
          <RedButton onClick={props.onDelete}>
            {t('privateBooking.discard')}
          </RedButton>
        </div>
      ) : (
        <div className={classes.buttonContainer}>
          <RedButton onClick={props.onDelete}>
            {t('privateBooking.hardDelete')}
          </RedButton>
        </div>
      )}
    </div>
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
  },
  updatedTimeExplain: {
    marginTop: theme.spacing(1),
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
      updateTimeAndClose: (_, { updateTime }) => (...args) => {
        updateTime(...args);
        return { isUpdateTimeFormOpen: false };
      },
    },
  ),
)(PrivateBookingCard);
