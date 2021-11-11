// @flow

import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import { compose, withState, withHandlers } from 'recompose';

import BookingCreationNotificationForm from './BookingCreationNotificationForm.component';

const BOOKING_CREATION_NOTIFICATION_BOOKING_DEPRECATED = 0;
const BOOKING_CREATION_NOTIFICATION_ATTENDANCE_DEPRECATED = 1;
const BOOKING_CREATION_NOTIFICATION_CANCELLATION_DEPRECATED = 2;

const BOOKING_NOTIFICATION_VALID_ATTENDANCE = 3;
const BOOKING_NOTIFICATION_VALID_ABSENCE = 4;
const BOOKING_NOTIFICATION_CANCELLED_REFUNDED = 5;

type Props = {
  getEmails: () => void,
  emails: Array<any>,
  getEmailDetail: (id: number) => void,
  emailDetails: Array<any>,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  objectId: number,
  updateNotification: (id: number, data: any) => void,
  deleteNotification: (notificationId: number) => void,
  notifications: { items: Array<any>, loading: boolean },
  identifier: 'establishment' | 'meta_activity',

  isDeleteModalOpen: boolean,
  setIsDeleteModalOpen: (boolean) => void,
  selectedNotification: any,
  setSelectedNotification: (any) => void,
  isFormOpen: boolean,
  setIsFormOpen: (boolean) => void,

  closeForm: () => void,
  onSubmit: (data: any) => void,
};

const getNotificationKind = (kind: number) => {
  // Deprecated stuff, for compatibility reasons
  if (kind === BOOKING_CREATION_NOTIFICATION_BOOKING_DEPRECATED) {
    return 'bookingDeprecated';
  }
  if (kind === BOOKING_CREATION_NOTIFICATION_CANCELLATION_DEPRECATED) {
    return 'cancelledDeprecated';
  }
  // ---------------------------------------------------------------------------
  if (
    kind === BOOKING_NOTIFICATION_VALID_ATTENDANCE ||
    kind === BOOKING_CREATION_NOTIFICATION_ATTENDANCE_DEPRECATED
  ) {
    return 'attendance';
  }
  if (kind === BOOKING_NOTIFICATION_VALID_ABSENCE) {
    return 'absence';
  }
  if (kind === BOOKING_NOTIFICATION_CANCELLED_REFUNDED) {
    return 'refunded';
  }
  return 'notRefunded';
};

const renderPrimaryText = (notif, t) => {
  const { notify_booking_nb, kind, hours } = notif.event_rules;
  return (
    <Typography>
      {`${
        notify_booking_nb === 0
          ? t(
              `notification.form.listItemPrimary.notifyAllEvents.${getNotificationKind(
                kind,
              )}`,
            )
          : t(
              `notification.form.listItemPrimary.${getNotificationKind(kind)}`,
              {
                notify_booking_nb,
              },
            )
      } | ${t(
        `notification.form.listItemPrimary.${hours > 0 ? 'after' : 'before'}`,
        {
          hours: Math.abs(hours),
        },
      )}`}
    </Typography>
  );
};

const renderSecondaryText = (notif, emails, t) => {
  const mailTitle = emails.find((email) => email.id === notif.email_design)
    ? emails.find((email) => email.id === notif.email_design).title
    : ' - ';
  return (
    <Typography variant="caption">
      {`${t('paymentPack:notification.listItem.mail')}: ${mailTitle}`}
    </Typography>
  );
};

const BookingCreationNotification = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['booking', 'paymentPack']);

  if (props.notifications.loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Paper className={classes.paper}>
        {props.notifications.items
          .filter((n) => !!n)
          .filter((n) => !!n.event_rules)
          .map((notif) => (
            <ListItem key={notif.id} divider>
              <Switch
                checked={notif.active}
                onChange={() =>
                  props.updateNotification(notif.id, { active: !notif.active })
                }
              />
              <div className={classes.text}>
                <ListItemText
                  primary={renderPrimaryText(notif, t)}
                  secondary={renderSecondaryText(notif, props.emails, t)}
                />
              </div>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="Edit"
                  color="primary"
                  onClick={() => {
                    props.setSelectedNotification(notif);
                    props.setIsFormOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => {
                    props.setSelectedNotification(notif);
                    props.setIsDeleteModalOpen(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </Paper>
      <div className={classes.addButtonContainer}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => props.setIsFormOpen(true)}
        >
          {t('notification.addNotification')}
        </Button>
      </div>
      {props.isFormOpen && (
        <BookingCreationNotificationForm
          objectId={props.objectId}
          identifier={props.identifier}
          emails={props.emails}
          emailListLoading={props.emailListLoading}
          getEmailDetail={props.getEmailDetail}
          emailDetails={props.emailDetails}
          getEmails={props.getEmails}
          emailDetailLoading={props.emailDetailLoading}
          onCancel={props.closeForm}
          initial={props.selectedNotification}
          onSubmit={props.onSubmit}
        />
      )}
      <Dialog open={props.isDeleteModalOpen}>
        <DialogTitle>
          {t('paymentPack:notification.listItem.deleteModal.title')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('paymentPack:notification.listItem.deleteModal.content')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.setSelectedNotification(null);
              props.setIsDeleteModalOpen(false);
            }}
          >
            {t('paymentPack:notification.listItem.deleteModal.cancel')}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              props.deleteNotification(props.selectedNotification.id);
              props.setSelectedNotification(null);
              props.setIsDeleteModalOpen(false);
            }}
          >
            {t('paymentPack:notification.listItem.deleteModal.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(2),
  },
  addButtonContainer: {
    width: '100%',
    paddingTop: theme.spacing(1),
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  text: {
    width: '70%',
  },
}));

export default compose(
  withState('isDeleteModalOpen', 'setIsDeleteModalOpen', false),
  withState('selectedNotification', 'setSelectedNotification', null),
  withState('isFormOpen', 'setIsFormOpen', false),
  withHandlers({
    closeForm:
      ({ setIsFormOpen, setSelectedNotification }) =>
      () => {
        setSelectedNotification(null);
        setIsFormOpen(false);
      },
    onSubmit:
      ({
        createNotification,
        updateNotification,
        selectedNotification,
        setIsFormOpen,
        setSelectedNotification,
      }) =>
      (data: any) => {
        if (selectedNotification !== null) {
          updateNotification(selectedNotification.id, data);
        } else {
          createNotification(data);
        }
        setIsFormOpen(false);
        setSelectedNotification(null);
      },
  }),
)(BookingCreationNotification);
