import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import CheckoutContext from '#src/pages/checkout/basket/CheckoutContext';

import PaymentMethodIcon from './PaymentMethodIcon.component';
import {
  PAYMENT_GROUP_METHOD_IDENTIFIER_APPLE_PAY,
  PAYMENT_GROUP_METHOD_IDENTIFIER_GOOGLE_PAY,
} from '@bsport/common/lib/master-data/payment-group';

type Props = {
  customClasses?: { [className: string]: string };
  paymentMethodChoices: Array<number>;
  paymentMethodSelected: number;
  paymentProcessing?: boolean;
  selectPaymentMethod: (paymentMethod: number) => void;
  title?: string;
  withoutPaymentMethodPadding?: boolean;
};

export const PaymentMethodCardSelector = ({
  customClasses,
  paymentMethodChoices,
  paymentMethodSelected,
  paymentProcessing,
  selectPaymentMethod,
  title,
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
        {title ?? t('paymentMethod.select.label')}
      </Typography>
      <div className={clsx(classes.row, customClasses?.row)}>
        {paymentMethodChoices
          ?.filter(
            (pm) =>
              /* Apple Pay and Google Pay are rendered in the Express Checkout element */
              ![
                PAYMENT_GROUP_METHOD_IDENTIFIER_APPLE_PAY,
                PAYMENT_GROUP_METHOD_IDENTIFIER_GOOGLE_PAY,
              ].includes(pm),
          )
          ?.map((pm) => (
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
