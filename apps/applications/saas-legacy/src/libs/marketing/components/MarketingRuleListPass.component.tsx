import React, { useMemo } from 'react';
import Immutable, { ImmutableObject } from 'seamless-immutable';
import {
  ButtonBase,
  Collapse,
  Theme,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { MarketingNotification } from '../types';
import { EmailTemplateSummary } from '../../email-editor/types';
import MarketingRuleListPassByTrigger from './MarketingRuleListPassByTrigger.component';
import { splitPassNotificationsByTrigger } from '../utils';

type Props = {
  sectionTitleKey: string;
  passNotifications: MarketingNotification[];
  onClickNotification: (
    notification: ImmutableObject<MarketingNotification>,
  ) => void;
  onToggleActiveNotification: (id: number, active: boolean) => void;
  emailSummariesById: { [key: string]: EmailTemplateSummary };
};

const MarketingRuleListPass: React.FC<Props> = (props: Props) => {
  const [showSection, setShowSection] = React.useState(false);
  const { t } = useTranslation('marketing');
  const classes = useStyle();

  const notificationsByTrigger = useMemo(() => {
    const {
      remainingCreditNotifications,
      remainingValidityNotifications,
      expiredValidityNotifications,
    } = splitPassNotificationsByTrigger(props.passNotifications);

    return Immutable(
      [
        {
          title: t('notifications.notificationTitle.remainingCredit'),
          notifications: remainingCreditNotifications,
        },
        {
          title: t('notifications.notificationTitle.remainingValidity'),
          notifications: remainingValidityNotifications,
        },
        {
          title: t('notifications.notificationTitle.expiredValidity'),
          notifications: expiredValidityNotifications,
        },
      ].filter(({ notifications }) => notifications.length),
    );
  }, [props.passNotifications, t]);

  return (
    <div>
      <ButtonBase
        className={classes.buttonTitleHeader}
        onClick={() => setShowSection(!showSection)}
      >
        <Typography variant="h5">{t(props.sectionTitleKey)}</Typography>
        {showSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ButtonBase>
      <Collapse in={showSection}>
        {!props.passNotifications.length && (
          <Typography>
            {t('marketing:notifications.notificationsEmpty')}
          </Typography>
        )}
      </Collapse>
      <div className={showSection ? classes.notificationsContainer : ''}>
        {notificationsByTrigger.map(({ title, notifications }) => (
          <MarketingRuleListPassByTrigger
            key={title}
            emailSummariesById={props.emailSummariesById}
            in={showSection}
            notifications={notifications}
            onClickNotification={props.onClickNotification}
            onToggleActiveNotification={props.onToggleActiveNotification}
            triggerTitle={title}
          />
        ))}
      </div>
    </div>
  );
};

const useStyle = makeStyles((theme: Theme) => ({
  notificationsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
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

export default MarketingRuleListPass;
