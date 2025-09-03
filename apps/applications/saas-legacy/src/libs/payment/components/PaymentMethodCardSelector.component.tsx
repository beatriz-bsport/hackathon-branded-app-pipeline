import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FormControl from '@material-ui/core/FormControl';
import { Theme, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import CheckoutContext from '../../../pages/checkout/basket/CheckoutContext';

import PaymentMethodIcon from './PaymentMethodIcon.component';

type Props = {
  paymentMethodSelected: number;
  paymentMethodChoices: Array<number>;
  selectPaymentMethod: (paymentMethod: number) => void;
  paymentProcessing?: boolean;
  customClasses?: { [className: string]: string };
  withoutPaymentMethodPadding?: boolean;
};

export const PaymentMethodCardSelector = ({
  paymentMethodChoices,
  paymentMethodSelected,
  selectPaymentMethod,
  paymentProcessing,
  customClasses,
  withoutPaymentMethodPadding,
}: Props) => {
  const { t } = useTranslation('invoice');

  const isCheckoutContext = React.useContext(CheckoutContext);
  const classes = useStyles({ isCheckoutContext, withoutPaymentMethodPadding });

  const handleClick = useCallback(
    (pm: number) => {
      if (pm !== paymentMethodSelected) selectPaymentMethod(pm);
    },
    [paymentMethodSelected, selectPaymentMethod],
  );
  return (
    <FormControl
      className={clsx(classes.formControl, customClasses?.formControl)}
    >
      <Typography
        className={clsx(classes.title, customClasses?.title)}
        id="payment-method-select-label"
        variant="h6"
      >
        {t('paymentMethod.select.label')}
      </Typography>
      <div className={clsx(classes.row, customClasses?.row)}>
        {paymentMethodChoices.map((pm) => (
          <ButtonBase
            key={`${pm}`}
            disabled={paymentProcessing}
            onClick={() => handleClick(pm)}
          >
            <Paper
              className={clsx(classes.paper, customClasses?.paper, {
                [classes.selected]: paymentMethodSelected === pm,
                [customClasses?.selected]: paymentMethodSelected === pm,
              })}
            >
              <PaymentMethodIcon paymentMethod={pm} />
            </Paper>
          </ButtonBase>
        ))}
      </div>
    </FormControl>
  );
};
type CheckoutContextThemeProps = {
  isCheckoutContext?: boolean;
  withoutPaymentMethodPadding?: boolean;
};

const useStyles = makeStyles<Theme, CheckoutContextThemeProps>((theme) => ({
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
  row: ({ isCheckoutContext, withoutPaymentMethodPadding }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px ${theme.spacing(
      1,
    )}px ${
      isCheckoutContext || withoutPaymentMethodPadding ? 0 : theme.spacing(1)
    }px`,
    '&>*': {
      marginRight: theme.spacing(1),
    },
  }),
  paper: {
    padding: theme.spacing(1),
  },
}));

export default React.memo(PaymentMethodCardSelector);
