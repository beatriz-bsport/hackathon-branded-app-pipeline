// @flow

import React, { Component } from 'react';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import withStyles from '@material-ui/core/styles/withStyles';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose } from 'recompose';

import PaymentPackNotificationForm from './PaymentPackNotificationForm.component';
import withConfirm from '../../../hocs/with-confirm.hoc';

const PAYMENT_PACK_NOTIFICATION_DAY_LEFT = 0;
const PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT = 1;
const PAYMENT_PACK_NOTIFICATION_DAY_PAST = 2;

type Props = {
  getEmails: () => void,
  getEmailDetail: (id: number) => void,
  getSmartLists: () => void,
  createNotification: () => void,
  updateNotification: (data: any) => void,
  deleteNotification: (id: number) => void,
  goToSmartlist: () => void,
  classes: Object,
  t: TFunction,
  emailListLoading: boolean,
  emails: Array<any>,

  smartLists: Array<any>,
  pack: PaymentPack,
  notifications: Array<any>,
  emailDetailLoading: boolean,
  smartListLoading: boolean,
  emailDetails: Array<any>,
};

const ButtonWithConfirm = withConfirm(IconButton, 'onClick', {
  title: 'paymentPack:notification.listItem.deleteModal.title',
  cancel: 'paymentPack:notification.listItem.deleteModal.cancel',
  confirm: 'paymentPack:notification.listItem.deleteModal.confirm',
  Content: ({ t }: { t: TFunction }) => (
    <p>{t('paymentPack:notification.listItem.deleteModal.content')}</p>
  ),
});

export class notificationRule extends Component<Props, state> {
  state = {
    selectedNotification: null,
    openForm: false,
  };

  renderPrimaryNotifText = (notif) => {
    const { t } = this.props;
    if (
      notif.kind === PAYMENT_PACK_NOTIFICATION_DAY_LEFT &&
      notif.days_left < 0
    ) {
      return (
        <Typography>
          {`${t(
            `notification.${PAYMENT_PACK_NOTIFICATION_DAY_PAST}.first`,
          )} ${Math.abs(notif.days_left)} ${t(
            `notification.${PAYMENT_PACK_NOTIFICATION_DAY_PAST}.second`,
          )} `}
        </Typography>
      );
    }
    if (notif.kind === PAYMENT_PACK_NOTIFICATION_DAY_LEFT) {
      return (
        <Typography>
          {`${t(`notification.${PAYMENT_PACK_NOTIFICATION_DAY_LEFT}.first`)} ${
            notif.days_left
          } ${t(`notification.${PAYMENT_PACK_NOTIFICATION_DAY_LEFT}.second`)} `}
        </Typography>
      );
    }
    return (
      <Typography>
        {`${t(`notification.${PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT}.first`)} ${
          notif.credits_left
        } ${t(
          `notification.${PAYMENT_PACK_NOTIFICATION_CREDIT_LEFT}.second`,
        )} `}
      </Typography>
    );
  };

  onFormSubmit = (data) => {
    if (this.state.selectedNotification !== null) {
      this.props.updateNotification({
        ...data,
        id: this.state.selectedNotification.id,
        payment_pack: this.props.pack.id,
      });
      this.setState({ selectedNotification: null, openForm: false });
    } else {
      this.props.createNotification({
        ...data,
        payment_pack: this.props.pack.id,
      });
      this.setState({ selectedNotification: null, openForm: false });
    }
  };

  render() {
    const { notifications, emails, classes, t, smartLists } = this.props;
    if (notifications.loading) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div>
        <Paper className={classes.paper}>
          {notifications.items.map((notif) => (
            <div key={notif.id} className={this.props.classes}>
              <ListItem divider>
                <Switch
                  checked={notif.active}
                  onChange={() =>
                    this.props.updateNotification({
                      active: !notif.active,
                      id: notif.id,
                      payment_pack: this.props.pack.id,
                    })
                  }
                  value="checkedA"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <ListItemText
                  primary={this.renderPrimaryNotifText(notif)}
                  secondary={
                    <div>
                      <Typography variant="caption">
                        {` ${t('notification.listItem.mail')}: ${
                          emails.find(
                            (email) => email.id === notif.email_design,
                          )
                            ? emails.find(
                                (email) => email.id === notif.email_design,
                              ).title
                            : ' - '
                        }`}
                      </Typography>
                      {notif.smartlist_exclude.length > 0 ? (
                        <div className={classes.inlineLeft}>
                          <Typography variant="caption">
                            {` ${t('notification.listItem.smartList')}: `}
                          </Typography>
                          <Typography
                            variant="caption"
                            className={classes.list}
                          >
                            {smartLists
                              .filter((smartlist) =>
                                notif.smartlist_exclude.includes(smartlist.id),
                              )
                              .map((smartlist) => smartlist.name)
                              .join(', ') || ' - '}
                          </Typography>
                        </div>
                      ) : null}
                      {notif.smartlist_include.length > 0 ? (
                        <div className={classes.inlineLeft}>
                          <Typography variant="caption">
                            {` ${t(
                              'notification.listItem.smartListInclude',
                            )}: `}
                          </Typography>
                          <Typography
                            variant="caption"
                            className={classes.list}
                          >
                            {smartLists
                              .filter((smartlist) =>
                                notif.smartlist_include.includes(smartlist.id),
                              )
                              .map((smartlist) => smartlist.name)
                              .join(', ') || ' - '}
                          </Typography>
                        </div>
                      ) : null}
                    </div>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="Edit"
                    color="primary"
                    onClick={() =>
                      this.setState({
                        openForm: true,
                        selectedNotification: notif,
                      })
                    }
                  >
                    <EditIcon />
                  </IconButton>
                  <ButtonWithConfirm
                    onClick={() => this.props.deleteNotification(notif)}
                    color="secondary"
                  >
                    <DeleteIcon />
                  </ButtonWithConfirm>
                </ListItemSecondaryAction>
              </ListItem>
            </div>
          ))}
        </Paper>
        <div className={classes.addButtonContainer}>
          <Button
            id="button_pass_notification"
            variant="outlined"
            color="primary"
            onClick={() => this.setState({ openForm: true })}
          >
            {t('notification.addButton')}
          </Button>
        </div>
        <PaymentPackNotificationForm
          open={this.state.openForm}
          goToSmartlist={this.props.goToSmartlist}
          notification={this.state.selectedNotification}
          onCancel={() =>
            this.setState({ selectedNotification: null, openForm: false })
          }
          emails={emails}
          emailListLoading={this.props.emailListLoading}
          getEmailDetail={this.props.getEmailDetail}
          emailDetails={this.props.emailDetails}
          getEmails={this.props.getEmails}
          emailDetailLoading={this.props.emailDetailLoading}
          getSmartLists={this.props.getSmartLists}
          smartLists={this.props.smartLists}
          smartListLoading={this.props.smartListLoading}
          onSubmit={this.onFormSubmit}
        />
      </div>
    );
  }
}

const styles = (theme) => ({
  list: {
    marginLeft: theme.spacing(1),
  },
  inlineLeft: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
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
});

export default compose(
  withTranslation(['paymentPack']),
  withStyles(styles),
)(notificationRule);
