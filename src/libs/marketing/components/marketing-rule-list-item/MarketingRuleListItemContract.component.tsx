// @ts-nocheck
import React from 'react';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import DialogTitle from '@material-ui/core/DialogTitle';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Theme, withStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import { compose } from 'recompose';
import { MaterialStyleType } from '../../../../utils/types';
import { EmailTemplateSummary } from '#libs/email-editor/types.ts';

import NotificationListInner from '#libs/marketing/components/NotificationListInner.component';
import { MarketingNotification } from '#libs/marketing/types';
import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import { SmartList } from '#libs/smart-list/types';
import ObjectLevelPermissionWrapper from '#libs/role/permission-utils/ObjectLevelPermissionWrapper.component';

type OwnProps = {
  updateNotification: (id: number, data: any) => void;
  notifications: { items: Array<MarketingNotification>; loading: boolean };
  deleteNotification: (id: number) => void;
  deleteNotificationModalOpen: boolean;
  setDeleteNotificationModalOpen: (v: boolean) => void;
  selectedNotification: MarketingNotification;
  setSelectedNotification: (n: MarketingNotification) => void;
  setContractNotificationFormOpen: (v: boolean) => void;
  emails: EmailTemplateSummary[];
  smartLists: SmartList[];
};

type Props = OwnProps &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

class MarketingRuleListItemContract extends React.PureComponent<Props> {
  handleUpdateNotification = (notif_id: number, active: boolean) => {
    return this.props.updateNotification(notif_id, { active });
  };

  handleEditNotification = (notif: MarketingNotification, open: boolean) => {
    this.props.setSelectedNotification(notif);
    this.props.setContractNotificationFormOpen(open);
  };

  handleDeleteModalOpen = (
    notif: MarketingNotification | null,
    open: boolean,
  ) => {
    this.props.setSelectedNotification(notif);
    this.props.setDeleteNotificationModalOpen(open);
  };

  handleDeleteNotification = (notif_id: number, open: boolean) => {
    this.props.deleteNotification(notif_id);
    this.props.setSelectedNotification(null);
    this.props.setDeleteNotificationModalOpen(open);
  };

  render() {
    const { classes, t } = this.props;
    if (this.props.notifications.loading) {
      return (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      );
    }

    return (
      <div>
        <Paper className={classes.paper}>
          {this.props.notifications.items.map((notif) => (
            <div key={`contract_notification_${notif.id}`}>
              <ListItem divider>
                <NotificationListInner
                  emailTitle={
                    this.props?.emails?.find(
                      (email) => email.id === notif.email_design,
                    )?.title ?? ''
                  }
                  notification={notif}
                  smartLists={this.props.smartLists}
                />
                <ObjectLevelPermissionWrapper
                  forcedBehavior="hidden"
                  requiredPermission="member.allowed_actions.manageNotification"
                >
                  <div className={classes.secondaryAction}>
                    <Switch
                      checked={notif.active}
                      inputProps={{ 'aria-label': 'secondary checkbox' }}
                      onChange={() =>
                        this.handleUpdateNotification(notif.id, !notif.active)
                      }
                      value="checkedA"
                    />
                    <IconButton
                      aria-label="Edit"
                      color="primary"
                      edge="end"
                      onClick={() => this.handleEditNotification(notif, true)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => this.handleDeleteModalOpen(notif, true)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </ObjectLevelPermissionWrapper>
              </ListItem>
            </div>
          ))}
        </Paper>
        <GenericResponsiveDialog
          fullScreenBreakpoint="xs"
          maxWidth="sm"
          open={this.props.deleteNotificationModalOpen}
        >
          <DialogTitle>
            {t('paymentPack:notification.listItem.deleteModal.title')}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('paymentPack:notification.listItem.deleteModal.content')}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleDeleteModalOpen(null, false)}>
              {t('paymentPack:notification.listItem.deleteModal.cancel')}
            </Button>
            <Button
              color="primary"
              onClick={() => {
                this.handleDeleteNotification(
                  this.props.selectedNotification.id,
                  false,
                );
              }}
            >
              {t('paymentPack:notification.listItem.deleteModal.confirm')}
            </Button>
          </DialogActions>
        </GenericResponsiveDialog>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  loading: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(2),
  },
  secondaryAction: {
    display: 'flex',
    alignItems: 'center',
  },
});

export default compose<Props, OwnProps>(
  withStyles(styles),
  withTranslation(['paymentPack']),
)(MarketingRuleListItemContract);
