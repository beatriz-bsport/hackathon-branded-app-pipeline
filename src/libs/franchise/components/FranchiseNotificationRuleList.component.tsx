import React from 'react';
import { compose } from 'recompose';
import { WithTranslation, withTranslation } from 'react-i18next';
import {
  List,
  ListItem,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core';
import { NotificationRule } from '../../notification-rule/types';

type OwnProps = {
  notificationId?: number;
  eventListWithRule: Record<string, NotificationRule[]>;
  navigateToNotification: (id: number) => () => void;
};

type Props = OwnProps & WithTranslation;

export const FranchiseNotificationRuleList = (props: Props) => {
  const {
    eventListWithRule,
    notificationId,
    navigateToNotification,

    t,
  } = props;
  const classes = useStyles();

  return Object.keys({ ...eventListWithRule }).map((key) => (
    <React.Fragment key={key}>
      <Typography variant="h5" className={classes.title}>
        {t(`ruleGroup.${key}`)}
      </Typography>

      <Paper>
        <List className={classes.list}>
          {eventListWithRule[key].map((rule) => (
            <ListItem
              key={rule.notification_event}
              button
              divider
              selected={notificationId === rule.notification_event}
              onClick={navigateToNotification(rule.notification_event)}
              className={classes.row}
            >
              <Typography variant="body1">
                {t(`eventType.${rule.notification_event}`)}
              </Typography>
            </ListItem>
          ))}
        </List>
      </Paper>
    </React.Fragment>
  ));
};

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    marginBottom: theme.spacing(2),
  },
  list: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(4),
    padding: 0,
  },
  row: {
    height: 70,
    padding: theme.spacing(2),
  },
}));

export default compose<any, OwnProps>(withTranslation(['notificationRule']))(
  FranchiseNotificationRuleList,
);
