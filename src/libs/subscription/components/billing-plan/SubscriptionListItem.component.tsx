import React from 'react';

import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import TodayIcon from '@material-ui/icons/Today';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import moment from 'moment-timezone';
import AddIcon from '@material-ui/icons/Add';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import InfoIcon from '@material-ui/icons/Info';
import { getCurrencyDisplay } from '../../../theme/selectors';
import { getStatus } from '../../utils';

import SubscriptionPaymentMethod from '../SubscriptionPaymentMethod.component';
import RedButton from '../../../../components/button/RedButton.component';
import { Subscription } from '../../types';
import { PaymentMethod } from '../../../payment/types';

type Props = {
  subscription: Subscription;
  changePaymentMethod: (id: number) => void;
  paymentMethodList: Array<PaymentMethod>;
};

const PaymentMethodInfo = ({
  subscription,
  changePaymentMethod,
  paymentMethodList,
}: Props) => {
  const { t } = useTranslation(['subscription']);
  if (subscription.has_ended || !!subscription.canceled_at) return null;
  if (subscription.is_v2) {
    return (
      <SubscriptionPaymentMethod
        paymentMethod={
          subscription.stripe_payment_method_id &&
          paymentMethodList.find(
            (pm) => pm.id === subscription.stripe_payment_method_id,
          )
        }
        onEdit={() => changePaymentMethod(subscription.id)}
        paymentEngine={subscription.payment_engine}
      />
    );
  }
  if (subscription.payment_method === 2) {
    return (
      <RedButton
        variant="outlined"
        onClick={(ev) => {
          ev.stopPropagation();
          changePaymentMethod(subscription.id);
        }}
      >
        <AddIcon />
        {t(
          `parameters.payment_method_group.${subscription.payment_method_identifier}`,
        )}
      </RedButton>
    );
  }
  const paymentMethod =
    subscription.stripe_payment_method_id &&
    paymentMethodList.find(
      (pm) => pm.id === subscription.stripe_payment_method_id,
    );
  if (paymentMethod) {
    return (
      <SubscriptionPaymentMethod
        paymentMethod={paymentMethod}
        onEdit={() => changePaymentMethod(subscription.id)}
        paymentEngine={subscription.payment_engine}
      />
    );
  }
  return null;
};

export const SubscriptionListItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['subscription']);
  const { subscription } = props;
  return (
    <div className={classes.container}>
      <Typography variant="h4">{subscription.name}</Typography>
      <Divider />
      <div className={classes.innerInfo}>
        <div className={classes.row}>
          <AccessTimeIcon className={classes.leftIcon} />
          <Typography>
            {t('subscription.listItem.recurrencePriceIs', {
              amount: subscription.recurrent_price,
              currencyDisplay: getCurrencyDisplay(),
            })}
          </Typography>
        </div>
        <div className={classes.row}>
          <CalendarIcon className={classes.leftIcon} />
          <Typography>
            {t('subscription.listItem.startingAt', {
              d: moment(subscription.first_billing_date).format('LL'),
            })}
          </Typography>
        </div>
        {subscription.next_billing_date && (
          <div className={classes.row}>
            <TodayIcon className={classes.leftIcon} />
            <Typography>
              {t('subscription.listItem.nextBillingDate', {
                d: moment(subscription.next_billing_date).format('LL'),
              })}
            </Typography>
          </div>
        )}
        <div className={classes.row}>
          <InfoIcon className={classes.leftIcon} />
          <Typography>{getStatus(subscription.status, t)}</Typography>
        </div>
      </div>
      <PaymentMethodInfo
        subscription={subscription}
        changePaymentMethod={props.changePaymentMethod}
        paymentMethodList={props.paymentMethodList}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(6),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  innerInfo: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}));

export default SubscriptionListItem;
