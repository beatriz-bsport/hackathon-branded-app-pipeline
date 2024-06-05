import React from 'react';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
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

import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

import { compose, withState, withHandlers } from 'recompose';
import { SmartList } from '#libs/smart-list/types';

import { ResolvedGenericTags } from '#libs/email-editor/types';
import ObjectLevelPermissionWrapper from '#libs/role/permission-utils/ObjectLevelPermissionWrapper.component';
import MarketingRuleFormBooking from '../../marketing/components/marketing-rule-form/MarketingRuleFormBooking.component';

import NotificationListInner from '../../marketing/components/NotificationListInner.component';

type Props = {
  getEmails: () => void;
  emails: Array<any>;
  getEmailDetail: (id: number) => void;
  emailDetails: Array<any>;
  emailListLoading: boolean;
  emailDetailLoading: boolean;
  objectId: number;
  updateNotification: (id: number, data: any) => void;
  deleteNotification: (notificationId: number) => void;
  notifications: { items: Array<any>; loading: boolean };
  identifier: 'establishment' | 'meta_activity';

  isDeleteModalOpen: boolean;
  // @ts-expect-error
  setIsDeleteModalOpen: (boolean) => void;
  selectedNotification: any;
  // @ts-expect-error
  setSelectedNotification: (any) => void;
  isFormOpen: boolean;
  // @ts-expect-error
  setIsFormOpen: (boolean) => void;

  closeForm: () => void;
  onSubmit: (data: any) => void;
  goToSmartlist: () => void;
  getSmartLists: () => void;
  smartLists: SmartList[];
  tags: { [tag_name: string]: string[] };
  resolvedGenericTags: ResolvedGenericTags;
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
              <div className={classes.text}>
                <NotificationListInner
                  emailTitle={
                    props?.emails?.find(
                      (email) => email.id === notif.email_design,
                    )?.title ?? ''
                  }
                  notification={notif}
                  smartLists={props.smartLists}
                />
              </div>
              <ObjectLevelPermissionWrapper
                forcedBehavior="hidden"
                requiredPermission="member.allowed_actions.manageNotification"
              >
                <>
                  <Switch
                    checked={notif.active}
                    onChange={() =>
                      props.updateNotification(notif.id, {
                        active: !notif.active,
                      })
                    }
                  />
                  <ListItemSecondaryAction>
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
                </>
              </ObjectLevelPermissionWrapper>
            </ListItem>
          ))}
      </Paper>
      <ObjectLevelPermissionWrapper
        forcedBehavior="hidden"
        requiredPermission="member.allowed_actions.manageNotification"
      >
        <div className={classes.addButtonContainer}>
          <Button
            color="primary"
            onClick={() => props.setIsFormOpen(true)}
            variant="outlined"
          >
            {t('notification.addNotification')}
          </Button>
        </div>
      </ObjectLevelPermissionWrapper>
      {props.isFormOpen && (
        <MarketingRuleFormBooking
          // @ts-expect-error
          emailDetailLoading={props.emailDetailLoading}
          emailDetails={props.emailDetails}
          emailListLoading={props.emailListLoading}
          emails={props.emails}
          getEmailDetail={props.getEmailDetail}
          getEmails={props.getEmails}
          getSmartLists={props.getSmartLists}
          goToSmartlist={props.goToSmartlist}
          identifier={props.identifier}
          initial={props.selectedNotification}
          objectId={props.objectId}
          onCancel={props.closeForm}
          onSubmit={props.onSubmit}
          resolvedGenericTags={props.resolvedGenericTags}
          smartLists={props.smartLists}
          tags={props.tags}
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
  // @ts-expect-error
)(BookingCreationNotification);
