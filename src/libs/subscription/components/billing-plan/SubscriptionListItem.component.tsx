import React from 'react';

import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/styles';
import { Theme, ListItem } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useTranslation, Trans } from 'react-i18next';
import TodayIcon from '@material-ui/icons/Today';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import InfoIcon from '@material-ui/icons/Info';
import { getCurrencyDisplay } from '#libs/theme/selectors';

import SubscriptionPaymentMethod from '../SubscriptionPaymentMethod.component';
import RedButton from '#components/button/RedButton.component';
import { Subscription } from '../../types';
import { PaymentMethod } from '#libs/payment/types';
import { OptionCallback } from '../../../../state/types';
import ContractTermsDialog from '../contract/ContractTermsDialog.component';
import ButtonBaseWithTypography from '#components/button/ButtonBaseWithTypography';
import { formatAsDatetimeAdapted } from '../../../../utils/datetime';

type Props = {
  subscription: Subscription;
  changePaymentMethod?: (id: number) => void;
  paymentMethodList?: Array<PaymentMethod>;
  variant?: 'card' | 'listItem';
  downloadContractTerms: (options: OptionCallback) => void;
};

type PaymentMethodInfoProps = {
  subscription: Subscription;
  changePaymentMethod?: (id: number) => void;
  paymentMethodList?: Array<PaymentMethod>;
};

const PaymentMethodInfo = ({
  subscription,
  changePaymentMethod,
  paymentMethodList,
}: PaymentMethodInfoProps) => {
  const { t } = useTranslation(['subscription']);
  if (subscription.has_ended || !!subscription.canceled_at) return null;
  if (subscription.is_v2) {
    return (
      <SubscriptionPaymentMethod
        onEdit={() => changePaymentMethod(subscription.id)}
        paymentEngine={subscription.payment_engine}
        paymentMethod={
          subscription.stripe_payment_method_id &&
          paymentMethodList.find(
            (pm) => pm.id === subscription.stripe_payment_method_id,
          )
        }
      />
    );
  }
  if (subscription.payment_method === 2) {
    return (
      <RedButton
        // @ts-expect-error
        onClick={(ev) => {
          ev.stopPropagation();
          changePaymentMethod(subscription.id);
        }}
        variant="outlined"
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
        onEdit={() => changePaymentMethod(subscription.id)}
        paymentEngine={subscription.payment_engine}
        paymentMethod={paymentMethod}
      />
    );
  }
  return null;
};

export const SubscriptionListItem = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation('subscription');
  const [openContractTermsDialog, setOpenContractTermsDialog] =
    React.useState(false);
  const onOpenContractTermsDialog = () => setOpenContractTermsDialog(true);
  const onCloseContractTermsDialog = () => setOpenContractTermsDialog(false);
  const { subscription, variant } = props;
  if (!subscription) {
    return null;
  }
  const subscriptionStatus = t(`billing_plan_status.${subscription.status}`);
  if (variant === 'listItem') {
    return (
      <ListItem divider className={classes.paperContainer}>
        <Typography variant="h6">{subscription.name}</Typography>

        <div>
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
                d: formatAsDatetimeAdapted(
                  subscription.first_billing_date,
                  'DDD',
                ),
              })}
            </Typography>
          </div>
          {subscription.next_billing_date && (
            <div className={classes.row}>
              <TodayIcon className={classes.leftIcon} />
              <Typography>
                {t('subscription.listItem.nextBillingDate', {
                  d: formatAsDatetimeAdapted(
                    subscription.next_billing_date,
                    'DDD',
                  ),
                })}
              </Typography>
            </div>
          )}
          {subscription.status && (
            <div className={classes.row}>
              <InfoIcon className={classes.leftIcon} />
              <Typography>{subscriptionStatus}</Typography>
            </div>
          )}
        </div>
      </ListItem>
    );
  }
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
              d: formatAsDatetimeAdapted(
                subscription.first_billing_date,
                'DDD',
              ),
            })}
          </Typography>
        </div>
        {subscription.next_billing_date && (
          <div className={classes.row}>
            <TodayIcon className={classes.leftIcon} />
            <Typography>
              {t('subscription.listItem.nextBillingDate', {
                d: formatAsDatetimeAdapted(
                  subscription.next_billing_date,
                  'DDD',
                ),
              })}
            </Typography>
          </div>
        )}
        <div className={classes.row}>
          <InfoIcon className={classes.leftIcon} />
          <Typography>{subscriptionStatus}</Typography>
        </div>
        {subscription.contract_terms_date_accepted && (
          <div className={classes.row}>
            <CheckIcon className={classes.leftIcon} />
            <Typography className={classes.contractTerms}>
              <Trans
                components={[
                  <ButtonBaseWithTypography
                    disableRipple
                    className={classes.contractTermsButton}
                    onClick={onOpenContractTermsDialog}
                    typographyColor="primary"
                  >
                    .
                  </ButtonBaseWithTypography>,
                ]}
                i18nKey="parameters.contractTermsAccepted"
                t={t}
                values={{
                  dateAccepted: formatAsDatetimeAdapted(
                    subscription.contract_terms_date_accepted,
                    'DDD',
                  ),
                }}
              />
            </Typography>
          </div>
        )}
      </div>
      {props.paymentMethodList && (
        <PaymentMethodInfo
          changePaymentMethod={props.changePaymentMethod}
          paymentMethodList={props.paymentMethodList}
          subscription={subscription}
        />
      )}
      <ContractTermsDialog
        closeContractTermsDialog={onCloseContractTermsDialog}
        contractTerms={subscription.legal_contract}
        contractTermsLink={subscription.contract_terms_pdf_link}
        downloadContractTerms={props.downloadContractTerms}
        open={openContractTermsDialog}
      />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  paperContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
    alignItems: 'unset',
  },
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
  contractTerms: {
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
    },
  },
  contractTermsButton: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
}));

export default SubscriptionListItem;
