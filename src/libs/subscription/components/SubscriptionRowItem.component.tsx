import React, { useMemo } from 'react';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import PauseIcon from '@material-ui/icons/Pause';
import DoneIcon from '@material-ui/icons/Done';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import {
  BILLING_PLAN_STATUS_ENDED,
  BILLING_PLAN_STATUS_PAUSED,
} from '@bsport/common/lib/master-data/subscription-status';
import { formatAsDate, isDateInThePast } from '#src/utils/datetime';
import type { Subscription, Contract } from '../types';
import type { FranchiseCompany } from '#src/libs/franchise/types';
import CompanyChip from '#src/components/franchise/CompanyChip.component';

const SubscriptionStatus = (props: { subscription: Subscription }) => {
  const classes = useStyles();
  const { t } = useTranslation('subscription');
  const { subscription } = props;
  if (subscription.canceled_at) {
    return (
      <div className={classes.subscriptionStatus}>
        <Typography variant="caption">{t('listItem.canceled')}</Typography>
        <ClearIcon className={classes.icon} />
      </div>
    );
  }
  if (
    subscription.has_ended ||
    subscription.status === BILLING_PLAN_STATUS_ENDED
  ) {
    return (
      <div className={classes.subscriptionStatus}>
        <Typography variant="caption">{t('listItem.expired')}</Typography>
        <HourglassEmptyIcon className={classes.icon} />
      </div>
    );
  }
  if (subscription.status === BILLING_PLAN_STATUS_PAUSED) {
    return (
      <div className={classes.subscriptionStatus}>
        <Typography variant="caption">{t('listItem.paused')}</Typography>
        <PauseIcon className={classes.icon} />
      </div>
    );
  }
  return (
    <div className={classes.subscriptionStatus}>
      <Typography variant="caption">{t('listItem.valid')}</Typography>
      <DoneIcon className={classes.icon} />
    </div>
  );
};

type Props = {
  getFranchiseCompanyById?: (id: number) => FranchiseCompany;
  subscription: Subscription;
  getContractById: (id: number) => Contract;
  onClick: (subscriptionId: number, companyId?: number) => void;
  withoutSubscriptionStatus?: boolean;
};

const SubscriptionRowItem = (props: Props) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();

  const formattedFirstBillingDate = useMemo(
    () => formatAsDate(props.subscription.first_billing_date),
    [props.subscription.first_billing_date],
  );

  const companyId = useMemo(
    () => props.getContractById?.(props.subscription.contract)?.company,
    [props],
  );

  const franchiseCompany = useMemo(
    () => props.getFranchiseCompanyById?.(companyId),
    [companyId, props],
  );

  const subscriptionRowSecondaryText = useMemo(
    () =>
      isDateInThePast(props.subscription.first_billing_date)
        ? t('listItem.subscribedOn', {
            date: formattedFirstBillingDate,
          })
        : t('listItem.willSubscribeOn', {
            date: formattedFirstBillingDate,
          }),
    [formattedFirstBillingDate, props.subscription.first_billing_date, t],
  );
  return (
    <div>
      <ListItem
        dense
        // @ts-expect-error
        button={!!props.onClick}
        onClick={() => props.onClick?.(props.subscription.id, companyId)}
      >
        <ListItemAvatar>
          <Avatar
            src={
              // @ts-expect-error
              props.subscription?.member?.photo
                ? // @ts-expect-error
                  props.subscription.member.photo
                : null
            }
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography>{props.subscription.memberName}</Typography>
              {props.subscription?.memberArchived && (
                <Typography color="secondary" variant="caption">
                  {`${'\u00A0'}(${t('member:archived')})`}
                </Typography>
              )}
            </div>
          }
          secondary={subscriptionRowSecondaryText}
          secondaryTypographyProps={{ variant: 'caption' }}
        />
        <div className={classes.chip}>
          {!!franchiseCompany && <CompanyChip company={franchiseCompany} />}
        </div>
        {!props.withoutSubscriptionStatus && (
          <SubscriptionStatus subscription={props.subscription} />
        )}
      </ListItem>
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  subscriptionStatus: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    margin: theme.spacing(2),
  },
  chip: {
    marginRight: theme.spacing(1),
  },
}));

export default SubscriptionRowItem;
