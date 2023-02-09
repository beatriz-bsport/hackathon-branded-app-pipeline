import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';

import EmailIcon from '@material-ui/icons/Email';
import SmsIcon from '@material-ui/icons/Sms';
import NotificationsIcon from '@material-ui/icons/Notifications';
import LabelIcon from '@material-ui/icons/Label';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

import {
  CADENCE_MARKETING_ACTION_WRITTEN_EMAIL,
  CADENCE_MARKETING_ACTION_SMS,
  CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION,
  CADENCE_MARKETING_ACTION_TAG_MANAGEMENT,
  CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE,
  CADENCE_MARKETING_ACTION_CHOICES,
  CadenceMarketingActionsEnum,
} from '#libs/sequential_marketing/constants';

import useFeaturesProvider from '#libs/company/hooks/feature-list-provider.hook ';
import MarketingActionCard from './MarketingActionCard.component';

type Props = {
  selectedAction: CadenceMarketingActionsEnum;
  handleChangeAction: (action: CadenceMarketingActionsEnum) => void;
  marketingActionConfiguredDict: { [key: number]: boolean };
};

const MarketingActionIconEnum = {
  [CADENCE_MARKETING_ACTION_WRITTEN_EMAIL]: EmailIcon,
  [CADENCE_MARKETING_ACTION_SMS]: SmsIcon,
  [CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION]: NotificationsIcon,
  [CADENCE_MARKETING_ACTION_TAG_MANAGEMENT]: LabelIcon,
  [CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE]: LibraryBooksIcon,
};

const MarktingIconLabel = {
  [CADENCE_MARKETING_ACTION_WRITTEN_EMAIL]: `cadence.form.marketing_action.${CADENCE_MARKETING_ACTION_WRITTEN_EMAIL}`,
  [CADENCE_MARKETING_ACTION_SMS]: `cadence.form.marketing_action.${CADENCE_MARKETING_ACTION_SMS}`,
  [CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION]: `cadence.form.marketing_action.${CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION}`,
  [CADENCE_MARKETING_ACTION_TAG_MANAGEMENT]: `cadence.form.marketing_action.${CADENCE_MARKETING_ACTION_TAG_MANAGEMENT}`,
  [CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE]: `cadence.form.marketing_action.${CADENCE_MARKETING_ACTION_EMAIL_TEMPLATE}`,
};

export const MarketingActionCardList: React.FC<Props> = ({
  selectedAction,
  handleChangeAction,
  marketingActionConfiguredDict,
}) => {
  const { t } = useTranslation('marketing');

  const { pushNotificationEnabled, smsEnabled, featuresLoading } =
    useFeaturesProvider();

  const classes = useStyles();
  return (
    <div className={classes.cardsContainer}>
      {CADENCE_MARKETING_ACTION_CHOICES.map((item) => {
        const disabled =
          (item === CADENCE_MARKETING_ACTION_SMS &&
            (!pushNotificationEnabled || featuresLoading)) ||
          (item === CADENCE_MARKETING_ACTION_PUSH_NOTIFICATION &&
            (!smsEnabled || featuresLoading));

        return (
          <MarketingActionCard
            item={item}
            selected={item === selectedAction}
            configured={marketingActionConfiguredDict[item] ?? false}
            disabled={disabled}
            onClick={() => handleChangeAction(item)}
            svgIcon={MarketingActionIconEnum[item]}
            label={t(MarktingIconLabel[item])}
          />
        );
      })}
    </div>
  );
};

export default MarketingActionCardList;

const useStyles = makeStyles((theme: Theme) => ({
  cardsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing(4),
  },
}));
