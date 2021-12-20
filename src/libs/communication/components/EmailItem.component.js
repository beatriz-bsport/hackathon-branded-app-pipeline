// @flow

import React from 'react';

import { compose } from 'recompose';
import withStyles from '@material-ui/core/styles/withStyles';
import EmailIcon from '@material-ui/icons/Email';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import NotificationActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationOffIcon from '@material-ui/icons/NotificationsOff';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import { useTranslation } from 'react-i18next';
import ToolTip from '#components/Tooltip.component';

type Props = {
  email: string,
  classes: Object,
  accept_email: boolean,
  notificationIcon: boolean,
  openMailDialog: () => void,
  hideContactButton?: boolean,
  pending_email?: string,
};

export const EmailListItem = (props: Props) => {
  const { email, notificationIcon, pending_email, classes } = props;
  const { t } = useTranslation('member');
  const renderNotificationIcon = () => {
    return props.accept_email ? (
      <NotificationActiveIcon className={classes.notificationIcon} />
    ) : (
      <NotificationOffIcon className={classes.notificationIcon} />
    );
  };
  return (
    <div>
      <ListItem>
        <AlternateEmailIcon />
        <ListItemText
          primary={
            <div className={classes.flexEmail}>
              <Typography>{email || ' - '}</Typography>
              {pending_email && (
                <ToolTip
                  title={t('changeEmailRequest.pendingValidation', {
                    email: pending_email,
                  })}
                >
                  <div className={classes.iconContainer}>
                    <HourglassEmptyIcon color="disabled" />
                  </div>
                </ToolTip>
              )}
            </div>
          }
          className={classes.listItemText}
        />
        {email && props.openMailDialog && !props.hideContactButton ? (
          <Button
            color="primary"
            onClick={() => {
              props.openMailDialog();
            }}
          >
            <EmailIcon />
          </Button>
        ) : null}
        {notificationIcon ? renderNotificationIcon() : null}
      </ListItem>
    </div>
  );
};

const style = (theme) => ({
  listItemText: {
    marginLeft: theme.spacing(2),
  },
  notificationIcon: {
    marginLeft: theme.spacing(2),
  },
  flexEmail: {
    display: 'flex',
    alignItems: 'center',
  },
  iconContainer: {
    paddingLeft: theme.spacing(2),
  },
});

export default compose(withStyles(style))(EmailListItem);
