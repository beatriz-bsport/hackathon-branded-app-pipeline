// @flow

import React from 'react';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
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

import ProductNotificationForm from '#libs/marketing/components/ProductNotificationForm.component';
import NotificationListInner from '#libs/marketing/components/NotificationListInner.component';

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
  tags: { [tag_name: string]: string[] },
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
  const getMergeTags = () => {
    if (props.tags) {
      return [
        ...Object.entries(props.tags).reduce((acc, [tagCategory, tagList]) => {
          acc.push({
            label: t(`notificationRule:tag.${tagCategory}.name`),
            options: [...tagList].map((tag) => ({
              label: t(`notificationRule:tag.${tagCategory}.tags.${tag}`),
              value: `{${tag}}`,
            })),
          });
          return acc;
        }, []),
      ];
    }
    return null;
  };

  return (
    <div>
      <Paper className={classes.paper}>
        {notifications.items.map((notif) => (
          <div key={notif.id} className={props.classes}>
            <ListItem divider>
              <NotificationListInner
                notification={notif}
                emailTitle={
                  props?.emails?.find(
                    (email) => email.id === notif.email_design,
                  )?.title ?? ''
                }
                smartLists={smartLists}
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notif.active}
                  onChange={() =>
                    props.updateNotification(notif.id, {
                      active: !notif.active,
                    })
                  }
                  value="checkedA"
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
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
        <ProductNotificationForm
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
          identifier="payment_pack"
          tags={getMergeTags()}
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
)(PaymentPackNotification);
