import React, { useState } from 'react';
import {
  ButtonBase,
  Collapse,
  Theme,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { useTranslation } from 'react-i18next';

import EventIcon from '@material-ui/icons/Event';
import TodayIcon from '@material-ui/icons/Today';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { NOTIFICATION_KIND } from '@bsport/common/lib/master-data/notification-rule-events.js';

// @ts-expect-error
import { Contract } from '#src/libs/subscription/types.ts';
import { SmartList } from '#src/libs/smart-list/types';
import { DeepPartial } from '../../../utils/types';
import { MarketingNotification } from '../types';
import MarketingNotificationsList from './MarketingRuleNotificationList.component';
import { EmailTemplateSummary } from '../../email-editor/types';

type Props = {
  contractNotifications: { [key: string]: MarketingNotification[] };
  contractById: { [key: string]: Contract };
  onClickNotification: (notification: MarketingNotification) => void;
  emailSummariesById: { [key: string]: EmailTemplateSummary };
  onUpdateNotification: (
    id: number,
    data: DeepPartial<MarketingNotification>,
  ) => void;
  smartLists: SmartList[];
};

const ContractNotificationList: React.FC<Props> = (props: Props) => {
  const [hideById, setHideById] = useState<{
    [key: string]: boolean | undefined;
  }>({});
  const [showSection, setShowSection] = useState<boolean>(false);
  const { t } = useTranslation('marketing');

  const classes = useStyles();
  return (
    <div>
      <ButtonBase
        className={classes.buttonTitleHeader}
        onClick={() => setShowSection(!showSection)}
      >
        <Typography variant="h5">
          {t('notifications.groupTitle.contract')}
        </Typography>
        {showSection ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ButtonBase>
      <Collapse in={showSection}>
        {!Object.keys(props.contractNotifications ?? []).length && (
          <Typography>
            {t('marketing:notifications.notificationsEmpty')}
          </Typography>
        )}
      </Collapse>
      {Object.keys(props.contractNotifications ?? []).map((id) => {
        const notifications: MarketingNotification[] =
          props.contractNotifications[id] || [];
        const contract = props.contractById[id];

        const contractStartCreation = notifications.filter(
          (n) =>
            n.kind === NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_CREATION,
        );
        const contractStartFirstBilling = notifications.filter(
          (n) =>
            n.kind ===
            NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_FIRST_BILLING,
        );

        const contractEnd = notifications?.filter(
          (n) => n.kind === NOTIFICATION_KIND.SUBSCRIPTION_NOTIFICATION_END,
        );
        if (contract) {
          return (
            <Collapse in={showSection}>
              <div
                key={`notifications_contract_${id}`}
                className={classes.contractItem}
              >
                <ButtonBase
                  className={classes.buttonTitleContainer}
                  onClick={() => {
                    setHideById({
                      ...hideById,
                      [id]: !hideById[id],
                    });
                  }}
                >
                  <Typography color="primary" variant="h5">
                    {contract.name}
                  </Typography>

                  {!hideById[id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </ButtonBase>

                <Collapse in={!hideById[id]}>
                  {(!!contractStartCreation.length ||
                    !!contractStartFirstBilling.length) && (
                    <div className={classes.contractKindContainer}>
                      <div className={classes.titleContainer}>
                        <TodayIcon />
                        <Typography className={classes.title}>
                          {t('notifications.contractKind.contractStart')}
                        </Typography>
                      </div>
                      {!!contractStartCreation.length && (
                        <div className={classes.notificationsContainer}>
                          <Typography className={classes.bulletPoint}>
                            {t(
                              `subscription:contractNotification.creation`,
                            ).toLowerCase()}
                          </Typography>
                          <MarketingNotificationsList
                            emailSummariesById={props.emailSummariesById}
                            notifications={contractStartCreation}
                            onClickNotification={props.onClickNotification}
                            onUpdateNotification={props.onUpdateNotification}
                            smartLists={props.smartLists}
                          />
                        </div>
                      )}
                      {!!contractStartFirstBilling.length && (
                        <div className={classes.notificationsContainer}>
                          <Typography className={classes.bulletPoint}>
                            {t(
                              `subscription:contractNotification.firstBilling`,
                            ).toLowerCase()}
                          </Typography>
                          <MarketingNotificationsList
                            emailSummariesById={props.emailSummariesById}
                            notifications={contractStartFirstBilling}
                            onClickNotification={props.onClickNotification}
                            onUpdateNotification={props.onUpdateNotification}
                            smartLists={props.smartLists}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {!!contractEnd.length && (
                    <div className={classes.contractKindContainer}>
                      <div className={classes.titleContainer}>
                        <EventIcon />
                        <Typography className={classes.title}>
                          {t('notifications.contractKind.contractEnd')}
                        </Typography>
                      </div>
                      <div className={classes.notificationsContainer}>
                        <MarketingNotificationsList
                          emailSummariesById={props.emailSummariesById}
                          notifications={contractEnd}
                          onClickNotification={props.onClickNotification}
                          onUpdateNotification={props.onUpdateNotification}
                          smartLists={props.smartLists}
                        />
                      </div>
                    </div>
                  )}
                </Collapse>
              </div>
            </Collapse>
          );
        }
        return null;
      })}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  contractItem: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  contractKindContainer: {
    marginTop: theme.spacing(2),
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  buttonTitleContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    marginLeft: theme.spacing(2),
  },
  notificationsContainer: {
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(2),
    marginLeft: theme.spacing(1.5),
    paddingLeft: theme.spacing(3.5),
    borderWidth: 0,
    borderLeftWidth: 1,
    borderStyle: 'solid',
  },
  bulletPoint: {
    '&::before': {
      content: '"\u2022"',
      paddingRight: theme.spacing(1),
    },
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
export default ContractNotificationList;
