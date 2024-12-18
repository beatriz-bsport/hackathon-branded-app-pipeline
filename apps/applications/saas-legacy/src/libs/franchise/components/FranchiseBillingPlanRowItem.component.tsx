import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import type { FranchiseUserBillingPlan } from '#src/libs/franchise/types';
import SubscriptionStatus from '#src/libs/subscription/components/SubscriptionStatus.component';
import { formatAsDate } from '#src/utils/datetime';
import ConsumerPassSourceChip from '#src/components/chip/ConsumerPassSourceChip';
import { getSubscriptionPriceAndRecurrence } from '#src/libs/subscription/utils';
import ListItem from '@material-ui/core/ListItem';

type Props = {
  billingPlan: FranchiseUserBillingPlan;
  onClick: () => void;
  selected: boolean;
};

const FranchiseBillingPlanRowItem: React.FC<Props> = ({
  billingPlan,
  onClick,
  selected,
}) => {
  const { t } = useTranslation('subscription');
  const classes = useStyles();

  const recurrenceLabel = React.useMemo(
    () =>
      getSubscriptionPriceAndRecurrence(
        billingPlan?.interval,
        billingPlan?.nb_interval,
        billingPlan?.recurrence_basis,
        billingPlan?.recurrent_price,
        t,
      ),
    [
      billingPlan?.interval,
      billingPlan?.nb_interval,
      billingPlan?.recurrence_basis,
      billingPlan?.recurrent_price,
      t,
    ],
  );

  return (
    <ListItem
      key={billingPlan?.id}
      button={true}
      className={classes.container}
      onClick={onClick}
      selected={selected}
    >
      <div>
        <Typography color="textPrimary" variant="body1">
          {billingPlan?.contract_name}
        </Typography>
        <Typography color="textPrimary" variant="body2">
          {recurrenceLabel}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {`${t('subscription:parameters.firstBilling')}: ${formatAsDate(
            billingPlan?.first_billing_date,
          )}`}
        </Typography>
      </div>
      <div className={classes.chipsContainer}>
        <ConsumerPassSourceChip
          companySourceName={billingPlan?.company_name}
          companySourcePrimaryColor={billingPlan?.company_primary_color}
        />
        <SubscriptionStatus
          canceledAt={billingPlan?.canceled_at}
          hasEnded={billingPlan?.has_ended}
          pauses={billingPlan?.pauses}
          status={billingPlan?.status}
        />
      </div>
    </ListItem>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  chipsContainer: {
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
}));

export default React.memo(FranchiseBillingPlanRowItem);
