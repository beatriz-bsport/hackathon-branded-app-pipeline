// @flow
import React from 'react';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Divider, Theme, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import {
  NotificationRule,
  NotificationRuleEventType,
  NotificationRuleSettings,
} from '#libs/notification-rule/types';
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';

type Props = {
  eventGroupName: string;
  eventsList: (NotificationRuleEventType & { rule: NotificationRule })[];
  isOpen: boolean;
  settings: Record<number, NotificationRuleSettings>;
  onToggleClick: (event: string) => () => void;
  className?: string;
};

const NotificationRuleGroupHeader = (props: Props) => {
  const {
    eventGroupName,
    eventsList,
    className,
    settings,
    isOpen,
    onToggleClick,
  } = props;

  const { t } = useTranslation('notificationRule');
  const classes = useStyles();

  return (
    <div className={className}>
      <div className={classes.titleWrapper}>
        <Typography variant="h5" className={classes.title}>
          {t(`ruleGroup.${eventGroupName}`)}
        </Typography>
        <Typography className={classes.subtitle}>
          {t('countElements', { nbr: eventsList.length })}
        </Typography>
      </div>
      <div className={classes.contentWrapper}>
        <div>
          {!!isOpen && (
            <Button
              className={classes.backButton}
              color="primary"
              variant="outlined"
              onClick={onToggleClick(eventGroupName)}
            >
              <ArrowBackIcon className={classes.iconLeft} />
              {t('goBackToMenu')}
            </Button>
          )}
          <Chip
            label={t('countEmail', {
              nbr: eventsList.filter(
                (event) =>
                  !(settings?.[event?.notification_event]?.disabled ?? false),
              ).length,
            })}
          />
          {!isOpen && (
            <Button
              className={classes.configureButton}
              color="primary"
              variant="outlined"
              onClick={onToggleClick(eventGroupName)}
            >
              <ArrowForwardIcon className={classes.iconLeft} />
              {t('configureNotif')}
            </Button>
          )}
          <FeatureListProvider>
            {(featureList) => (
              <>
                {featureList.upsell &&
                  featureList.upsell.find(
                    (f) => f.readable_identifier === 'push_notification',
                  ) && (
                    <Chip
                      label={t('countNotification', {
                        nbr: eventsList.filter(
                          (event) => event?.rule?.is_notification_push_active,
                        ).length,
                      })}
                      className={classes.rightChip}
                    />
                  )}
              </>
            )}
          </FeatureListProvider>
        </div>
      </div>
      <Divider className={classes.divider} />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    fontSize: 25,
  },
  subtitle: {
    fontSize: 12,
    color: theme.palette.grey[500],
    marginLeft: theme.spacing(1),
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: theme.spacing(1),
  },
  contentWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    marginTop: theme.spacing(1),
  },
  rightChip: {
    marginLeft: theme.spacing(2),
  },
  configureButton: {
    marginLeft: theme.spacing(2),
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
}));

export default NotificationRuleGroupHeader;
