// @ts-nocheck
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

import MarketingRuleFormProduct from '../marketing-rule-form/MarketingRuleFormProduct.component';
import NotificationListInner from '#libs/marketing/components/NotificationListInner.component';
import { getMergeTags } from '../../utils';
import { PaymentPack } from '../../../payment-packs/types';
import { ResolvedGenericTags } from '#libs/email-editor/types';

type Props = {
  getEmails: () => void;
  pack: PaymentPack;
  getEmailDetail: (id: number) => void;
  getSmartLists: () => void;
  updateNotification: (id: number, data: any) => void;
  deleteNotification: (id: number) => void;
  goToSmartlist: () => void;
  classes: Object;
  emailListLoading: boolean;
  emails: Array<any>;

  smartLists: Array<any>;
  notifications: { items: Array<any>; loading: boolean };
  emailDetailLoading: boolean;
  smartListLoading: boolean;
  emailDetails: Array<any>;

  onSubmit: (data: any) => void;
  closeForm: () => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (v: boolean) => void;
  selectedNotification: any;
  setSelectedNotification: (n: any) => void;
  isFormOpen: boolean;
  setIsFormOpen: (v: boolean) => void;
  tags: { [tag_name: string]: string[] };
  resolvedGenericTags: ResolvedGenericTags;
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

  const mergeTags = getMergeTags(props.tags, t);

  return (
    <div>
      <Paper className={classes.paper}>
        {notifications.items.map((notif) => (
          <div key={notif.id} className={props.classes}>
            <ListItem divider>
              <NotificationListInner
                emailTitle={
                  props?.emails?.find(
                    (email) => email.id === notif.email_design,
                  )?.title ?? ''
                }
                notification={notif}
                smartLists={smartLists}
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={notif.active}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                  onChange={() =>
                    props.updateNotification(notif.id, {
                      active: !notif.active,
                    })
                  }
                  value="checkedA"
                />
                <IconButton
                  aria-label="Edit"
                  color="primary"
                  edge="end"
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
          color="primary"
          id="button_pass_notification"
          onClick={() => props.setIsFormOpen(true)}
          variant="outlined"
        >
          {t('notification.addButton')}
        </Button>
      </div>
      {props.isFormOpen && (
        <MarketingRuleFormProduct
          emailDetailLoading={props.emailDetailLoading}
          emailDetails={props.emailDetails}
          emailListLoading={props.emailListLoading}
          emails={emails}
          getEmailDetail={props.getEmailDetail}
          getEmails={props.getEmails}
          getSmartLists={props.getSmartLists}
          goToSmartlist={props.goToSmartlist}
          id={props.pack.id}
          identifier="payment_pack"
          initial={props.selectedNotification}
          onCancel={props.closeForm}
          onSubmit={props.onSubmit}
          resolvedGenericTags={props.resolvedGenericTags}
          smartListLoading={props.smartListLoading}
          smartLists={props.smartLists}
          tags={mergeTags}
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
