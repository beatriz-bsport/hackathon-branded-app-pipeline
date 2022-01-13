import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import AlertIcon from '@material-ui/icons/Warning';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import {
  PAYMENT_ENGINE_BSPORT,
  PAYMENT_ENGINE_STRIPE,
} from '@bsport/common/lib/master-data/payment-group';
import PaymentMethodListItem from '../../payment/components/PaymentMethodListItem.component';

import { PaymentMethod } from '../../payment/types';

type Props = {
  paymentEngine: number;
  paymentMethod?: PaymentMethod;
  onEdit: () => void;
  loading?: boolean;
};

export const SubscriptionPaymentMethod = (props: Props) => {
  const { t } = useTranslation(['invoice']);
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h5">{t('paymentMethod.title')}</Typography>

      <Divider className={classes.divider} />
      {props.paymentEngine === PAYMENT_ENGINE_BSPORT && (
        <React.Fragment>
          <Typography className={classes.text}>
            {t('paymentMethod.isInternalExplain')}
          </Typography>

          <Button color="primary" variant="outlined" onClick={props.onEdit}>
            {t('paymentMethod.add')}
          </Button>
        </React.Fragment>
      )}
      {props.paymentEngine === PAYMENT_ENGINE_STRIPE && !!props.paymentMethod && (
        <Paper>
          <PaymentMethodListItem
            onEdit={props.onEdit}
            paymentMethod={props.paymentMethod}
          />
        </Paper>
      )}
      {props.paymentEngine === PAYMENT_ENGINE_STRIPE &&
        !props.paymentMethod &&
        (props.loading ? (
          <CircularProgress />
        ) : (
          <div className={classes.inconsistentMsg}>
            <AlertIcon color="error" className={classes.iconLeft} />
            <Typography variant="caption" color="error">
              {t('paymentMethod.inconsistent')}
            </Typography>
          </div>
        ))}
      {!props.paymentMethod && !props.loading && (
        <Button color="primary" variant="outlined" onClick={props.onEdit}>
          {t('paymentMethod.add')}
        </Button>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  text: {
    marginBottom: theme.spacing(2),
  },
  inconsistentMsg: {
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    border: '1px solid red',
    borderRadius: 12,
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
}));

export default SubscriptionPaymentMethod;
