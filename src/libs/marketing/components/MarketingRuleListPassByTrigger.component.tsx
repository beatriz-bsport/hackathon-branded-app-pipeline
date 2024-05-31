import {
  ButtonBase,
  Collapse,
  Paper,
  type Theme,
  Typography,
  makeStyles,
  Switch,
} from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import React, { useCallback } from 'react';
import type { ImmutableArray, ImmutableObject } from 'seamless-immutable';
import type { MarketingNotification } from '../types';
import MarketingRulePassNotificationItem from './MarketingRulePassNotificationItem.component';
import type { EmailTemplateSummary } from '#src/libs/email-editor/types';

type Props = {
  in: boolean;
  onClickNotification: (
    notification: ImmutableObject<MarketingNotification>,
  ) => void;
  onUpdateNotification: (
    id: number,
    notification: MarketingNotification,
  ) => void;
  emailSummariesById: { [key: string]: EmailTemplateSummary };
  notifications: ImmutableArray<MarketingNotification>;
  triggerTitle: string;
};

const MarketingRuleListPassByTrigger: React.FC<Props> = (props) => {
  const [showSection, setShowSection] = React.useState(false);
  const classes = useStyles();

  const changeNotificationStatus = useCallback(
    (notification: ImmutableObject<MarketingNotification>) => {
      props.onUpdateNotification(notification.id, {
        ...notification.asMutable({ deep: true }),
        active: !notification.active,
      });
    },
    [props],
  );
  return (
    <Collapse in={props.in}>
      <Paper
        className={
          !showSection
            ? classes.collapse
            : `${classes.collapse} ${classes.gapped}`
        }
      >
        <ButtonBase
          className={classes.title}
          onClick={() => {
            setShowSection(!showSection);
          }}
        >
          <Typography
            className={classes.typographyTitle}
            color="textPrimary"
            variant="subtitle1"
          >
            {props.triggerTitle}
          </Typography>

          {showSection ? <ExpandLess /> : <ExpandMore />}
        </ButtonBase>
        <Collapse in={showSection}>
          <div className={classes.section}>
            {props.notifications.map((n) => (
              <ButtonBase
                key={n.id}
                className={classes.notificationItem}
                onClick={() => props.onClickNotification(n)}
              >
                <Switch
                  checked={n.active}
                  color="primary"
                  onClick={() => changeNotificationStatus(n)}
                />
                <MarketingRulePassNotificationItem
                  emailSummariesById={props.emailSummariesById}
                  notification={n}
                />
              </ButtonBase>
            ))}
          </div>
        </Collapse>
      </Paper>
    </Collapse>
  );
};

export default MarketingRuleListPassByTrigger;

const useStyles = makeStyles((theme: Theme) => ({
  typographyTitle: {
    fontWeight: 500,
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  collapse: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    borderRadius: 4,
  },
  gapped: {
    gap: theme.spacing(2),
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    '& > *:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
  notificationItem: {
    justifyContent: 'flex-start',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    gap: theme.spacing(1),
  },
}));
