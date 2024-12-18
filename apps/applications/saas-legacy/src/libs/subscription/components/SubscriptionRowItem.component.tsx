import React, { useCallback, useMemo } from 'react';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import SubscriptionStatus from './SubscriptionStatus.component';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import { makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { formatAsDate, isDateInThePast } from '#src/utils/datetime';
import type { Subscription } from '../types';
import type { FranchiseCompany } from '#src/libs/franchise/types';
import CompanyChip from '#src/components/franchise/CompanyChip.component';

type Props = {
  company?: FranchiseCompany;
  subscription: Subscription;
  onClick: (subscriptionId: number) => void;
  withoutSubscriptionStatus?: boolean;
};

const SubscriptionRowItem = (props: Props) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();

  const formattedFirstBillingDate = useMemo(
    () => formatAsDate(props.subscription.first_billing_date),
    [props.subscription.first_billing_date],
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

  const clickHandler = useCallback(() => {
    props.onClick(props.subscription.id);
  }, [props]);

  return (
    <div>
      <ListItem
        dense
        // @ts-expect-error
        button={!!props.onClick}
        onClick={clickHandler}
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
        {!!props.company && (
          <div className={classes.chip}>
            <CompanyChip company={props.company} />
          </div>
        )}
        {!props.withoutSubscriptionStatus && (
          <SubscriptionStatus
            canceledAt={props.subscription.canceled_at}
            hasEnded={props.subscription.has_ended}
            pauses={props.subscription.pauses}
            status={props.subscription.status}
          />
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
