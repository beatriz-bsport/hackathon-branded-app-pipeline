import React from 'react';
import { useTranslation } from 'react-i18next';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import classnames from 'classnames';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import { makeStyles } from '@material-ui/core/styles';

import PaymentMethodIcon from './PaymentMethodIcon.component';

type Props = {
  paymentMethodSelected: number;
  paymentMethodChoices: Array<number>;
  selectPaymentMethod: (paymentMethod: number) => void;
};

export const PaymentMethodCardSelector = (props: Props) => {
  const classes = useStyles();
  const { t } = useTranslation(['invoice']);
  return (
    <FormControl className={classes.formControl}>
      <Typography
        className={classes.title}
        variant="h6"
        id="payment-method-select-label"
      >
        {t('paymentMethod.select.label')}
      </Typography>
      <div className={classes.row}>
        {props.paymentMethodChoices.map((pm) => (
          <ButtonBase onClick={() => props.selectPaymentMethod(pm)}>
            <Paper
              className={classnames(
                classes.paper,
                props.paymentMethodSelected === pm ? classes.selected : null,
              )}
            >
              <PaymentMethodIcon paymentMethod={pm} />
            </Paper>
          </ButtonBase>
        ))}
      </div>
    </FormControl>
  );
};

const useStyles = makeStyles((theme) => ({
  formControl: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '100vw',
    overflowX: 'auto',
    paddingBottom: theme.spacing(1),
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  selected: {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 4,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing(1),
    '&>*': {
      marginRight: theme.spacing(1),
    },
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

export default PaymentMethodCardSelector;
