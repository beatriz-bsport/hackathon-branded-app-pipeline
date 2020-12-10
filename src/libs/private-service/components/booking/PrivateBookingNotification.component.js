// @flow
import React from 'react';
import Button from '@material-ui/core/Button';
import { compose, withState, withHandlers } from 'recompose';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
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
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';

import PrivateBookingNotificationForm from './PrivateBookingNotificationForm.component';

type Props = {
  getEmails: () => void,
  emails: Array<any>,
  getEmailDetail: (id: number) => void,
  emailDetails: Array<any>,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  serviceId: number,
  updateNotification: (id: number, data: any) => void,
  deleteNotification: (notificationId: number) => void,
  notifications: { items: Array<any>, loading: boolean },

  isDeleteModalOpen: boolean,
  setIsDeleteModalOpen: (boolean) => void,
  selectedNotification: any,
  setSelectedNotification: (any) => void,
  isFormOpen: boolean,
  setIsFormOpen: (boolean) => void,

  closeForm: () => void,
  onSubmit: (data: any) => void,
};

const PRIVATE_BOOKING_NOTIFICATION_KIND_VALID = 0;
const PRIVATE_BOOKING_NOTIFICATION_KIND_CANCELLED_REFUNDED = 1;

const getNotificationKind = (kind: number) => {
  switch (kind) {
    case PRIVATE_BOOKING_NOTIFICATION_KIND_VALID:
      return 'valid';
    case PRIVATE_BOOKING_NOTIFICATION_KIND_CANCELLED_REFUNDED:
      return 'cancelledRefunded';
    default:
      return 'cancelledNotRefunded';
  }
};

const renderPrimaryText = (notif, t) => {
  const { notify_booking_nb, kind, hours } = notif.event_rules;
  return (
    <Typography>
      {`${
        notify_booking_nb === 0
          ? t(
              `privateService:privateBookingNotification.listItemPrimary.notifyAllEvents.${getNotificationKind(
                kind,
              )}`,
            )
          : t(
              `privateService:privateBookingNotification.listItemPrimary.${getNotificationKind(
                kind,
              )}`,
              {
                notify_booking_nb,
              },
            )
      } | ${t(
        `privateService:privateBookingNotification.listItemPrimary.${
          hours > 0 ? 'after' : 'before'
        }`,
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

const PrivateBookingNotification = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack', 'privateService']);
  if (props.notifications.loading) {
    return (
      <div className={classes.loading}>
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className={classes.notificationContainer}>
      <Paper className={classes.paper}>
        {props.notifications.items.map((notif) => (
          <ListItem key={notif.id} divider>
            <Switch
              checked={notif.active}
              onChange={() =>
                props.updateNotification(notif.id, {
                  active: !notif.active,
                })
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
          {t('paymentPack:notification.addButton')}
        </Button>
      </div>
      {props.isFormOpen && (
        <PrivateBookingNotificationForm
          serviceId={props.serviceId}
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
          {t('notification.listItem.deleteModal.title')}
        </DialogTitle>
        <DialogContent>
          {t('notification.listItem.deleteModal.content')}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.setSelectedNotification(null);
              props.setIsDeleteModalOpen(false);
            }}
          >
            {t('notification.listItem.deleteModal.cancel')}
          </Button>
          <Button
            color="primary"
            onClick={() => {
              props.deleteNotification(props.selectedNotification.id);
              props.setSelectedNotification(null);
              props.setIsDeleteModalOpen(false);
            }}
          >
            {t('notification.listItem.deleteModal.confirm')}
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
    marginTop: theme.spacing(3),
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    width: '70%',
  },
  notificationContainer: {
    marginTop: theme.spacing(4),
  },
}));

export default compose(
  withState('isDeleteModalOpen', 'setIsDeleteModalOpen', false),
  withState('selectedNotification', 'setSelectedNotification', null),
  withState('isFormOpen', 'setIsFormOpen', false),
  withHandlers({
    closeForm: ({ setIsFormOpen, setSelectedNotification }) => () => {
      setSelectedNotification(null);
      setIsFormOpen(false);
    },
    onSubmit: ({
      createNotification,
      updateNotification,
      selectedNotification,
      setIsFormOpen,
      setSelectedNotification,
    }) => (data: any) => {
      if (selectedNotification !== null) {
        updateNotification(selectedNotification.id, data);
      } else {
        createNotification(data);
      }
      setIsFormOpen(false);
      setSelectedNotification(null);
    },
  }),
)(PrivateBookingNotification);
