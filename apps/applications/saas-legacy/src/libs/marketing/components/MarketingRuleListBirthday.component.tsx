import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { ButtonBase, Collapse, Typography } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DeepPartial } from 'redux';
import NotificationsList from '#src/libs/marketing/components/MarketingRuleNotificationList.component';
import { SmartList } from '#src/libs/smart-list/types';
import { EmailTemplateSummary } from '#src/libs/email-editor/types';
import { OptionCallback, ThunkAction } from '../../../state/types';
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
  const [showSection, setShowSection] = useState<boolean>(false);
  const toggleSelection = useCallback(
    () => setShowSection((prevShowSelection) => !prevShowSelection),
    [],
  );

  return (
    <>
      <ButtonBase
        className={classes.buttonTitleHeader}
        onClick={toggleSelection}
      >
        <Typography variant="h5">
          {t('notifications.groupTitle.birthday')}
        </Typography>
        {showSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ButtonBase>
      <Collapse in={showSection}>
        <NotificationsList
          emailSummariesById={emailSummariesById}
          notifications={notifications}
          onClickNotification={onClickNotification}
          onUpdateNotification={onUpdateNotification}
          smartLists={smartLists}
        />
        {notifications.length === 0 && (
          <Typography>{t('notifications.notificationsEmpty')}</Typography>
        )}
      </Collapse>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonTitleHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    width: '100%',
  },
}));

export default React.memo(MarketingRuleListBirthday);
