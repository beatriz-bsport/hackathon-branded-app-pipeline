// @flow

import React from 'react';
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
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { makeStyles } from '@material-ui/core/styles';

import { useTranslation } from 'react-i18next';
import { compose, withState, withHandlers } from 'recompose';

import PaymentPackNotificationForm from './PaymentPackNotificationForm.component';

const CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME = 3;

type Props = {
  getEmails: () => void,
  pack: PaymentPack,
  getEmailDetail: (id: number) => void,
  getSmartLists: () => void,
  updateNotification: (id: number, data: any) => void,
  deleteNotification: (id: number) => void,
  goToSmartlist: () => void,
  classes: Object,
  emailListLoading: boolean,
  emails: Array<any>,

  smartLists: Array<any>,
  notifications: { items: Array<any>, loading: boolean },
  emailDetailLoading: boolean,
  smartListLoading: boolean,
  emailDetails: Array<any>,

  onSubmit: (data: any) => void,
  closeForm: () => void,
  isDeleteModalOpen: boolean,
  setIsDeleteModalOpen: (boolean) => void,
  selectedNotification: any,
  setSelectedNotification: (any) => void,
  isFormOpen: boolean,
  setIsFormOpen: (boolean) => void,
};

const getNotificationKind = (notif: any) => {
  if (notif.kind === CONSUMER_PAYMENT_PACK_NOTIFICATION_TIME) {
    return notif.event_rules.days_left < 0 ? 'daysPast' : 'daysLeft';
  }
  return 'creditsLeft';
};

const renderPrimaryText = (notif, t) => {
  const notificationKind = getNotificationKind(notif);
  if (notificationKind === 'creditsLeft') {
    return (
      <Typography>
        {`${t('notification.creditsLeft.first')} ${
          notif.event_rules.credits_left
        } ${t('notification.creditsLeft.second')}`}
      </Typography>
    );
  }
  return (
    <Typography>
      {`${t(`notification.${notificationKind}.first`)} ${Math.abs(
        notif.event_rules.days_left,
      )} ${t(`notification.${notificationKind}.second`)}`}
    </Typography>
  );
};

const PaymentPackNotification = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['paymentPack']);

  const { notifications, emails, smartLists } = props;
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
          <div key={notif.id} className={props.classes}>
            <ListItem divider>
              <Switch
                checked={notif.active}
                onChange={() =>
                  props.updateNotification(notif.id, { active: !notif.active })
                }
                value="checkedA"
                inputProps={{ 'aria-label': 'secondary checkbox' }}
              />
              <ListItemText
                primary={renderPrimaryText(notif, t)}
                secondary={
                  <div>
                    <Typography variant="caption">
                      {` ${t('notification.listItem.mail')}: ${
                        emails.find((email) => email.id === notif.email_design)
                          ? emails.find(
                              (email) => email.id === notif.email_design,
                            ).title
                          : ' - '
                      }`}
                    </Typography>
                    {notif.event_rules.smartlist_exclude &&
                    notif.event_rules.smartlist_exclude.length > 0 ? (
                      <div className={classes.inlineLeft}>
                        <Typography variant="caption">
                          {` ${t('notification.listItem.smartList')}: `}
                        </Typography>
                        <Typography variant="caption" className={classes.list}>
                          {smartLists
                            .filter((smartlist) =>
                              notif.event_rules.smartlist_exclude.includes(
                                smartlist.id,
                              ),
                            )
                            .map((smartlist) => smartlist.name)
                            .join(', ') || ' - '}
                        </Typography>
                      </div>
                    ) : null}
                    {notif.event_rules.smartlist_include &&
                    notif.event_rules.smartlist_include.length > 0 ? (
                      <div className={classes.inlineLeft}>
                        <Typography variant="caption">
                          {` ${t('notification.listItem.smartListInclude')}: `}
                        </Typography>
                        <Typography variant="caption" className={classes.list}>
                          {smartLists
                            .filter((smartlist) =>
                              notif.event_rules.smartlist_include.includes(
                                smartlist.id,
                              ),
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
          </div>
        ))}
      </Paper>
      <div className={classes.addButtonContainer}>
        <Button
          id="button_pass_notification"
          variant="outlined"
          color="primary"
          onClick={() => props.setIsFormOpen(true)}
        >
          {t('notification.addButton')}
        </Button>
      </div>
      {props.isFormOpen && (
        <PaymentPackNotificationForm
          id={props.pack.id}
          goToSmartlist={props.goToSmartlist}
          onCancel={props.closeForm}
          emails={emails}
          emailListLoading={props.emailListLoading}
          getEmailDetail={props.getEmailDetail}
          emailDetails={props.emailDetails}
          getEmails={props.getEmails}
          emailDetailLoading={props.emailDetailLoading}
          getSmartLists={props.getSmartLists}
          smartLists={props.smartLists}
          smartListLoading={props.smartListLoading}
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
)(PaymentPackNotification);
