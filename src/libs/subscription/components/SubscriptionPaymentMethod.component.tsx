import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import { PAYMENT_ENGINE_BSPORT } from '@bsport/common/lib/master-data/payment-group';
import PaymentMethodListItem from '../../payment/components/PaymentMethodListItem.component';

import { PaymentMethod } from '../../invoice/types';

type Props = {
  paymentEngine: number;
  paymentMethod?: PaymentMethod;
  onEdit: () => void;
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
      {!!props.paymentMethod && (
        <Paper>
          <PaymentMethodListItem
            onEdit={props.onEdit}
            paymentMethod={props.paymentMethod}
          />
        </Paper>
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
}));

export default SubscriptionPaymentMethod;
