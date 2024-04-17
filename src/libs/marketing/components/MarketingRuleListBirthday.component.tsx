import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { DeepPartial } from 'redux';
import { OptionCallback, ThunkAction } from '../../../state/types';
import NotificationsList from '#libs/marketing/components/MarketingRuleNotificationList.component';
import { SmartList } from '#libs/smart-list/types';
import { EmailTemplateSummary } from '#libs/email-editor/types';
import { MarketingNotification } from '../types';

type Props = {
  emailSummariesById: {
    [key: string]: EmailTemplateSummary;
  };
  notifications: MarketingNotification[];
  onClickNotification: (notification: MarketingNotification) => void;
  onUpdateNotification: (
    id: number,
    data: DeepPartial<MarketingNotification>,
    options?: OptionCallback,
  ) => ThunkAction;
  smartLists: SmartList[];
};

const MarketingRuleListBirthday: React.FC<Props> = ({
  emailSummariesById,
  notifications,
  onClickNotification,
  onUpdateNotification,
  smartLists,
}) => {
  const { t } = useTranslation('marketing');
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.classTitle} variant="h5">
        {t('marketing:notifications.groupTitle.birthday')}
      </Typography>
      <div>
        <NotificationsList
          emailSummariesById={emailSummariesById}
          notifications={notifications}
          onClickNotification={onClickNotification}
          onUpdateNotification={onUpdateNotification}
          smartLists={smartLists}
        />
        {notifications.length === 0 && (
          <Typography>
            {t('marketing:notifications.notificationsEmpty')}
          </Typography>
        )}
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  classTitle: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
}));

export default React.memo(MarketingRuleListBirthday);
