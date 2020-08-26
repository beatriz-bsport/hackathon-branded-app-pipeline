// @flow

import React, { Component } from 'react';
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

import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';
import type { Notification } from '../types';

import BookingCreationNotificationForm from './BookingCreationNotificationForm.component';

const BOOKING_CREATION_NOTIFICATION_BOOKING_DEPRECATED = 0;
const BOOKING_CREATION_NOTIFICATION_ATTENDANCE_DEPRECATED = 1;
const BOOKING_CREATION_NOTIFICATION_CANCELLATION_DEPRECATED = 2;

const BOOKING_NOTIFICATION_VALID_ATTENDANCE = 3;
const BOOKING_NOTIFICATION_VALID_ABSENCE = 4;
const BOOKING_NOTIFICATION_CANCELLED_REFUNDED = 5;

type Props = {
  classes: Object,
  t: TFunction,
  getEmails: () => void,
  emails: Array<any>,
  getEmailDetail: (id: number) => void,
  emailDetails: Array<any>,
  emailListLoading: boolean,
  emailDetailLoading: boolean,
  objectId: number,
  createNotification: (data: any) => void,
  updateNotification: (data: any) => void,
  deleteNotification: (notificationId: number) => void,
  notifications: Array<Notification>,
  identifier: string,
};

type State = {
  selectedNotification: any,
  openPreForm: boolean,
  openForm: boolean,
  openDeleteModal: boolean,
  update: boolean,
};

class BookingCreationNotification extends Component<Props, State> {
  state = {
    selectedNotification: null,
    openPreForm: false,
    openForm: false,
    openDeleteModal: false,
    update: false,
  };

  onformSubmit = (data) => {
    if (this.state.selectedNotification !== null) {
      this.props.updateNotification({
        ...data,
        id: this.state.selectedNotification.id,
        [this.props.identifier]: this.props.objectId,
      });
      this.setState({
        selectedNotification: null,
        openForm: false,
        openPreForm: false,
        update: false,
      });
    } else {
      this.props.createNotification({
        ...data,
        [this.props.identifier]: this.props.objectId,
      });
      this.setState({
        selectedNotification: null,
        openForm: false,
        openPreForm: false,
        update: false,
      });
    }
  };

  nextStep = () => this.setState({ openPreForm: false, openForm: true });

  computeKind = (notif) => {
    // Deprecated stuff, for compatibilité reasons
    if (notif.kind === BOOKING_CREATION_NOTIFICATION_BOOKING_DEPRECATED) {
      return 'bookingDeprecated';
    }
    if (notif.kind === BOOKING_CREATION_NOTIFICATION_CANCELLATION_DEPRECATED) {
      return 'cancelledDeprecated';
    }
    // ---------------------------------------------------------------------------
    if (
      notif.kind === BOOKING_NOTIFICATION_VALID_ATTENDANCE ||
      notif.kind === BOOKING_CREATION_NOTIFICATION_ATTENDANCE_DEPRECATED
    ) {
      return 'attendance';
    }
    if (notif.kind === BOOKING_NOTIFICATION_VALID_ABSENCE) {
      return 'absence';
    }
    if (notif.kind === BOOKING_NOTIFICATION_CANCELLED_REFUNDED) {
      return 'refunded';
    }
    return 'notRefunded';
  };

  renderPrimaryNotifText = (notif) => {
    const { t } = this.props;
    return (
      <Typography>
        {`${t(`notification.form.listItemPrimary.${this.computeKind(notif)}`, {
          notify_booking_nb: notif.notify_booking_nb,
        })} | ${t(
          `notification.form.listItemPrimary.${
            notif.hours > 0 ? 'after' : 'before'
          }`,
          {
            hours: Math.abs(notif.hours),
          },
        )}`}
      </Typography>
    );
  };

  renderSecondaryNotifText = (notif) => {
    const { t, emails } = this.props;
    const mailTitle = emails.find((email) => email.id === notif.email_design)
      ? emails.find((email) => email.id === notif.email_design).title
      : ' - ';
    return (
      <Typography variant="caption">
        {`${t('paymentPack:notification.listItem.mail')}: ${mailTitle}`}
      </Typography>
    );
  };

  render() {
    if (this.props.notifications.loading) {
      return (
        <div className={this.props.classes.loading}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div>
        <Paper className={this.props.classes.paper}>
          {this.props.notifications.items.map((notif) => (
            <ListItem key={notif.id} divider>
              <Switch
                checked={notif.active}
                onChange={() =>
                  this.props.updateNotification({
                    active: !notif.active,
                    id: notif.id,
                    [this.props.identifier]: this.props.objectId,
                  })
                }
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              <div className={this.props.classes.text}>
                <ListItemText
                  primary={this.renderPrimaryNotifText(notif)}
                  secondary={this.renderSecondaryNotifText(notif)}
                />
              </div>
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="Edit"
                  color="primary"
                  onClick={() =>
                    this.setState({
                      openForm: true,
                      selectedNotification: notif,
                      update: true,
                    })
                  }
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() =>
                    this.setState({
                      openDeleteModal: true,
                      selectedNotification: notif,
                    })
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </Paper>
        <div className={this.props.classes.addButtonContainer}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => this.setState({ openPreForm: true })}
          >
            {this.props.t('notification.addNotification')}
          </Button>
        </div>
        <BookingCreationNotificationForm
          openPreForm={this.state.openPreForm}
          openForm={this.state.openForm}
          notification={this.state.selectedNotification}
          onCancel={() =>
            this.setState({
              selectedNotification: null,
              openForm: false,
              openPreForm: false,
              update: false,
            })
          }
          emails={this.props.emails}
          emailListLoading={this.props.emailListLoading}
          getEmailDetail={this.props.getEmailDetail}
          emailDetails={this.props.emailDetails}
          getEmails={this.props.getEmails}
          emailDetailLoading={this.props.emailDetailLoading}
          onSubmit={this.onformSubmit}
          nextStep={this.nextStep}
          update={this.state.update}
        />
        <Dialog open={this.state.openDeleteModal}>
          <DialogTitle>
            {this.props.t(
              'paymentPack:notification.listItem.deleteModal.title',
            )}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.props.t(
                'paymentPack:notification.listItem.deleteModal.content',
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ openDeleteModal: false })}>
              {this.props.t(
                'paymentPack:notification.listItem.deleteModal.cancel',
              )}
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.props.deleteNotification(
                  this.state.selectedNotification.id,
                );
                this.setState({
                  openDeleteModal: false,
                  selectedNotification: null,
                });
              }}
            >
              {this.props.t(
                'paymentPack:notification.listItem.deleteModal.confirm',
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const styles = (theme) => ({
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
});

export default compose(
  withStyles(styles),
  withTranslation(['booking', 'paymentPack']),
)(BookingCreationNotification);
