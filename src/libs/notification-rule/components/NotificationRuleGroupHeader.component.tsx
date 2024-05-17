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
// @ts-expect-error
import FeatureListProvider from '#libs/company/hocs/feature-list-provider.hoc';
import { UPSELL_IDENTIFIER_PUSH_NOTIFICATION } from '#libs/platform-billing/upsell-identifiers';
import { FeatureList } from '#libs/company/types';
import { hasUpsell } from '#libs/platform-billing/utils';

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
        <Typography className={classes.title} variant="h5">
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
              onClick={onToggleClick(eventGroupName)}
              variant="outlined"
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
              onClick={onToggleClick(eventGroupName)}
              variant="outlined"
            >
              <ArrowForwardIcon className={classes.iconLeft} />
              {t('configureNotif')}
            </Button>
          )}
          <FeatureListProvider>
            {(featureList: FeatureList) => (
              <>
                {hasUpsell(
                  featureList,
                  UPSELL_IDENTIFIER_PUSH_NOTIFICATION,
                ) && (
                  <Chip
                    className={classes.rightChip}
                    label={t('countNotification', {
                      nbr: eventsList.filter(
                        (event) => event?.rule?.is_notification_push_active,
                      ).length,
                    })}
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
